const axios = require('axios');

// Sample phishing email for testing
const sampleEmail = `
From: security@paypa1-secure.com
To: user@example.com
Subject: URGENT: Your account has been compromised

Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be suspended in 24 hours unless you verify your information immediately.

Please click on the link below to verify your account:
http://paypa1-secure.com/verify.php?id=123456

Do not ignore this email or your account will be permanently closed.

Regards,
Security Team
`;

async function testAnalyzeEndpoint() {
  try {
    console.log('Testing /analyze endpoint with sample phishing email...');
    const response = await axios.post('http://localhost:5000/analyze', {
      content: sampleEmail
    });
    
    console.log('Success! Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing /analyze endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Test the server is running
async function testServerRunning() {
  try {
    console.log('Testing if server is running...');
    const response = await axios.get('http://localhost:5000/test');
    console.log('Server is running:', response.data);
    return true;
  } catch (error) {
    console.error('Server is not running or /test endpoint is not available');
    return false;
  }
}

async function runTests() {
  const serverRunning = await testServerRunning();
  if (serverRunning) {
    await testAnalyzeEndpoint();
  } else {
    console.log('Please start the server with "npm start" before running tests');
  }
}

runTests();