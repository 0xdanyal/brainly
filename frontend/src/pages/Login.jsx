import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Logo from '../components/Logo';
import '../styles/global.css';
import '../styles/login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);
      login(data.token, data.email);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="landing-page">
      <header className="landing-topbar">
        <Logo />
        <Link className="landing-register-link" to="/register">Create free account</Link>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-left">
          <span className="landing-pill">Save once. Find instantly.</span>
          <h1 className="landing-title">Turn your open tabs into an organized knowledge vault.</h1>
          <p className="landing-subtitle">
            LinkStash helps you capture important links, tag them by topic, and retrieve anything in seconds.
            No more hunting through browser history when you need that one resource.
          </p>
          <div className="landing-points">
            <div className="landing-point">
              <span className="landing-point-icon">01</span>
              <div>
                <h3>Save links with context</h3>
                <p>Store URL, title, and quick notes so every saved link has meaning.</p>
              </div>
            </div>
            <div className="landing-point">
              <span className="landing-point-icon">02</span>
              <div>
                <h3>Tag by project or topic</h3>
                <p>Organize links with tags like work, react, ideas, docs, or personal.</p>
              </div>
            </div>
            <div className="landing-point">
              <span className="landing-point-icon">03</span>
              <div>
                <h3>Find anything instantly</h3>
                <p>Use one search bar to quickly get back to exactly what you saved.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card landing-auth-card">
          <div className="auth-logo-wrap">
            <Logo size="sm" />
          </div>
          <span className="auth-highlight">Welcome back</span>
          <h2 className="auth-heading">Sign in to your stash</h2>
          <p className="auth-subheading">Keep your best links organized and searchable.</p>
          {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            <div className="auth-field">
              <label className="form-label">Email address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            </div>
            <div className="auth-field">
              <label className="form-label">Password</label>
              <input type="password" placeholder="Enter your password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="auth-footer">
            New to LinkStash? <Link to="/register">Create one free</Link>
          </div>
        </div>
      </section>
    </div>
  );
}