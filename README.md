# Phishing Email Detector

A full-stack web application that uses AI to detect and analyze potential phishing emails. The application consists of a React frontend and a Node.js backend that leverages the Cohere AI API for email analysis.

## Features

- **AI-Powered Analysis**: Uses Cohere's Command-R-Plus model to analyze email content
- **Risk Scoring**: Provides a risk score from 0-100 for each email
- **Red Flag Detection**: Identifies potential phishing indicators
- **Detailed Explanations**: Offers plain-English explanations of detected threats
- **Actionable Recommendations**: Provides specific advice on how to handle suspicious emails

## Project Structure

```
PJ_2/
├── backend/                 # Node.js Express server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── components/         # Backend components
├── phishing-detector/      # React frontend
│   ├── src/               # Source code
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cohere API key

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   COHERE_API_KEY=your_cohere_api_key_here
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the phishing-detector directory:
   ```bash
   cd phishing-detector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /analyze` - Analyze email content for phishing indicators
- `GET /test` - Test endpoint to verify server is running

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. Paste or type the email content you want to analyze
3. Click "Analyze" to get the AI-powered analysis
4. Review the risk score, red flags, explanation, and recommendations

## Environment Variables

- `COHERE_API_KEY`: Your Cohere API key (required for email analysis)

## Technologies Used

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express, Axios
- **AI**: Cohere Command-R-Plus model
- **Development**: npm, Git

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
