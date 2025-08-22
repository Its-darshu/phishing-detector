import React, { useState } from 'react';
import './App.css';

function NavBar() {
  return (
    <nav className="phg-navbar">
      <div className="phg-navbar-left">
        <span className="phg-logo">PhishGuard</span>
      </div>
      <div className="phg-navbar-right">
        <a className="phg-nav-link" href="#">Dashboard</a>
        <a className="phg-nav-link" href="#">Reports</a>
        <a className="phg-nav-link" href="#">Settings</a>
        <div className="phg-avatar" />
      </div>
    </nav>
  );
}

function TabSwitcher({ tab, setTab }: { tab: 'paste' | 'upload', setTab: (t: 'paste' | 'upload') => void }) {
  return (
    <div className="phg-tab-switcher">
      <button className={tab === 'paste' ? 'phg-tab-active' : 'phg-tab'} onClick={() => setTab('paste')}>Paste Email</button>
      <button className={tab === 'upload' ? 'phg-tab-active' : 'phg-tab'} onClick={() => setTab('upload')}>Upload File</button>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M10.59 13.41a2 2 0 0 1 0-2.82l3.18-3.18a2 2 0 0 1 2.82 2.82l-1.06 1.06" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/><path d="M13.41 10.59a2 2 0 0 1 0 2.82l-3.18 3.18a2 2 0 0 1-2.82-2.82l1.06-1.06" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/></svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#64748b" strokeWidth="1.5"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="#64748b" strokeWidth="1.5"/></svg>
  );
}
function AlertIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="1.5"/><path d="M12 8v4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#64748b"/></svg>
  );
}
function CheckIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}

function ResultsCard({ result }: any) {
  if (!result) return null;
  return (
    <div className="phg-results">
      <div className="phg-results-title">Analysis Results</div>
      <div className="phg-risk-score-row">
        <div className="phg-risk-score-label">Risk Score</div>
        <div className="phg-risk-score-bar">{result.riskScore}</div>
      </div>
      <div className="phg-section-title">Suspicious Elements</div>
      <div className="phg-suspicious-list">
        {result.redFlags.map((flag: any, idx: number) => (
          <div className="phg-suspicious-item" key={idx}>
            {flag.icon === 'link' && <LinkIcon />}
            {flag.icon === 'user' && <UserIcon />}
            {flag.icon === 'alert' && <AlertIcon />}
            <div>
              <div className="phg-suspicious-title">{flag.title}</div>
              <div className="phg-suspicious-desc">{flag.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="phg-section-title">Risk Explanation</div>
      <div className="phg-risk-explanation">{result.explanation}</div>
      <div className="phg-section-title">Actionable Advice</div>
      <div className="phg-action-list">
        {result.recommendation.map((rec: any, idx: number) => (
          <div className="phg-action-item" key={idx}>
            <CheckIcon />
            <span>{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const App: React.FC = () => {
  const [tab, setTab] = useState<'paste' | 'upload'>('paste');
  const [emailContent, setEmailContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmailContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: emailContent })
      });
      if (!response.ok) throw new Error('Failed to analyze email.');
      const data = await response.json();
      // Map backend result to UI structure
      setResult({
        riskScore: data.riskScore,
        redFlags: (data.redFlags || []).map((flag: string) => {
          // Heuristic icon mapping
          if (/link/i.test(flag)) return { icon: 'link', title: 'Multiple Links', desc: flag };
          if (/sender|address|domain/i.test(flag)) return { icon: 'user', title: 'Sender Mismatch', desc: flag };
          if (/urgent|immediate|pressure/i.test(flag)) return { icon: 'alert', title: 'Urgent Language', desc: flag };
          return { icon: 'alert', title: flag, desc: flag };
        }),
        explanation: data.explanation,
        recommendation: Array.isArray(data.recommendation) ? data.recommendation : [data.recommendation],
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phg-bg">
      <NavBar />
      <div className="phg-main">
        <div className="phg-title">Phishing Email Detector</div>
        <div className="phg-subtitle">Paste the email content or upload a file to analyze its risk.</div>
        <TabSwitcher tab={tab} setTab={setTab} />
        {tab === 'paste' ? (
          <textarea
            className="phg-textarea"
            placeholder="Paste email content here..."
            value={emailContent}
            onChange={e => setEmailContent(e.target.value)}
            rows={7}
          />
        ) : (
          <div className="phg-upload-box">
            <label className="phg-upload-btn">
              Upload .eml/.txt
              <input
                type="file"
                accept=".eml,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
            <span className="phg-file-name">{fileName}</span>
          </div>
        )}
        <button
          className="phg-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || (!emailContent && !fileName)}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {error && <div className="phg-error">{error}</div>}
        <ResultsCard result={result} />
      </div>
    </div>
  );
};

export default App;
