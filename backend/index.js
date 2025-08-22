const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cohere LLM handler
async function analyzeEmail(content) {
  const apiKey = process.env.COHERE_API_KEY;
  const prompt = `You are an expert at detecting phishing emails. Analyze the following email and provide:\n- A risk score (0-100)\n- A list of red flags\n- A plain-English explanation\n- An actionable recommendation\n\nEmail:\n${content}\n\nRespond in JSON with keys: riskScore, redFlags, explanation, recommendation.`;

  const response = await axios.post(
    'https://api.cohere.ai/v1/generate',
    {
      model: 'command-r-plus',
      prompt: prompt,
      max_tokens: 512,
      temperature: 0.2,
      stop_sequences: ["\n\n"]
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Cohere returns the text in response.data.generations[0].text
  let text = response.data.generations[0].text.trim();

  // Remove Markdown code block if present
  if (text.startsWith('```')) {
    text = text.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }
  text = text.replace(/^```json|^```|```$/g, '').trim();

  return JSON.parse(text);
}

app.post('/analyze', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'No email content provided.' });
  }
  try {
    const result = await analyzeEmail(content);
    res.json(result);
  } catch (err) {
    console.error('Cohere API error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to analyze email.' });
  }
});

// Add a simple test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running correctly' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test the server by visiting http://localhost:${PORT}/test`);
});