import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');

  .auth-page {
    min-height: 100vh;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 24px;
  }

  .auth-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 40px 36px;
    width: 100%;
    max-width: 380px;
  }

  .auth-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 32px;
    text-decoration: none;
  }
  .auth-logo-icon {
    width: 30px; height: 30px;
    background: #111;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .auth-logo-text {
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
    font-size: 15px;
    color: #111;
    letter-spacing: -0.01em;
  }

  .auth-heading {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 18px;
    font-weight: 500;
    color: #111;
    margin-bottom: 6px;
  }
  .auth-sub {
    font-size: 13px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }
  .auth-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: .06em;
  }
  .auth-field input {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 9px 12px;
    background: #fafafa;
    color: #111;
    outline: none;
    transition: border-color .15s, background .15s;
    width: 100%;
    box-sizing: border-box;
  }
  .auth-field input:focus {
    border-color: #111;
    background: #fff;
  }

  .auth-error {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #c53030;
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 16px;
  }

  .auth-hint {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #999;
    margin-top: 3px;
  }

  .auth-submit {
    width: 100%;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity .15s;
  }
  .auth-submit:hover { opacity: .8; }
  .auth-submit:disabled { opacity: .4; cursor: not-allowed; }

  .auth-footer {
    font-size: 13px;
    color: #666;
    margin-top: 20px;
    text-align: center;
  }
  .auth-footer a {
    color: #111;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form);
      nav('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-page">
        <div className="auth-card">

          {/* Logo */}
          <a href="/" className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                <line x1="9" y1="10" x2="15" y2="10" />
              </svg>
            </div>
            <span className="auth-logo-text">Brainly</span>
          </a>

          <h1 className="auth-heading">Create account</h1>
          <p className="auth-sub">Start building your personal link library.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <span className="auth-hint">Minimum 6 characters</span>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
    </>
  );
}