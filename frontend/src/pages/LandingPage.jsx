import { Link } from 'react-router-dom';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Serif:wght@400;600&family=IBM+Plex+Sans:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:   #0f0f0f;
    --dim:   #6b6b6b;
    --muted: #9b9b9b;
    --line:  #e3e3e3;
    --bg:    #f8f7f4;
    --white: #ffffff;
    --accent: #0f0f0f;
    --mono: 'IBM Plex Mono', monospace;
    --serif: 'IBM Plex Serif', serif;
    --sans: 'IBM Plex Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--ink); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 56px;
    background: rgba(248,247,244,.9);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  .nav-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
  .nav-logo-icon {
    width: 28px; height: 28px; background: var(--ink);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
  }
  .nav-logo-text {
    font-family: var(--mono); font-weight: 500; font-size: 14px;
    color: var(--ink); letter-spacing: -.01em;
  }
  .nav-links { display: flex; align-items: center; gap: 6px; }
  .nav-link {
    font-family: var(--mono); font-size: 12px; color: var(--dim);
    text-decoration: none; padding: 6px 12px; border-radius: 4px;
    transition: color .15s;
  }
  .nav-link:hover { color: var(--ink); }
  .nav-cta {
    font-family: var(--mono); font-size: 12px; font-weight: 500;
    background: var(--ink); color: var(--white);
    padding: 7px 16px; border-radius: 4px; text-decoration: none;
    transition: opacity .15s;
  }
  .nav-cta:hover { opacity: .8; }

  /* ── HERO ── */
  .hero {
    padding: 140px 40px 80px;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  }
  .hero-eyebrow {
    font-family: var(--mono); font-size: 11px; color: var(--dim);
    text-transform: uppercase; letter-spacing: .1em;
    display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
  }
  .hero-eyebrow::before {
    content: ''; display: block;
    width: 24px; height: 1px; background: var(--dim);
  }
  .hero-title {
    font-family: var(--serif); font-size: clamp(36px, 5vw, 58px);
    font-weight: 600; line-height: 1.08; color: var(--ink);
    margin-bottom: 20px; letter-spacing: -.02em;
  }
  .hero-title em { font-style: italic; }
  .hero-body {
    font-size: 16px; color: var(--dim); line-height: 1.65;
    margin-bottom: 32px; max-width: 420px;
  }
  .hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .btn-primary {
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    background: var(--ink); color: var(--white);
    padding: 11px 24px; border-radius: 4px; text-decoration: none;
    transition: opacity .15s; display: inline-block;
  }
  .btn-primary:hover { opacity: .8; }
  .btn-ghost {
    font-family: var(--mono); font-size: 13px; color: var(--dim);
    text-decoration: none; padding: 11px 20px;
    border: 1px solid var(--line); border-radius: 4px;
    transition: all .15s; display: inline-block;
  }
  .btn-ghost:hover { border-color: var(--ink); color: var(--ink); }

  /* ── HERO MOCKUP ── */
  .hero-visual {
    opacity: 0;
    animation: fadeUp .5s .2s ease forwards;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mockup {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04);
  }
  .mockup-bar {
    background: #f2f1ee;
    border-bottom: 1px solid var(--line);
    padding: 10px 14px;
    display: flex; align-items: center; gap: 6px;
  }
  .mockup-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--line); }
  .mockup-url {
    margin-left: 8px;
    font-family: var(--mono); font-size: 10px; color: var(--muted);
    background: var(--white); border: 1px solid var(--line);
    border-radius: 3px; padding: 2px 10px; flex: 1;
  }
  .mockup-body { padding: 14px; }
  .mockup-search {
    display: flex; gap: 6px; margin-bottom: 12px;
  }
  .mockup-input {
    flex: 1; background: #f8f7f4; border: 1px solid var(--line);
    border-radius: 4px; padding: 7px 10px;
    font-family: var(--mono); font-size: 10px; color: var(--dim);
  }
  .mockup-btn {
    background: var(--ink); color: var(--white);
    border-radius: 4px; padding: 7px 12px;
    font-family: var(--mono); font-size: 10px; white-space: nowrap;
  }
  .mockup-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .mockup-card {
    background: #f8f7f4; border: 1px solid var(--line);
    border-radius: 4px; padding: 10px;
  }
  .mockup-card-top { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .mockup-domain { font-family: var(--mono); font-size: 9px; color: var(--muted); }
  .mockup-card-title { font-family: var(--sans); font-size: 10px; font-weight: 500; color: var(--ink); margin-bottom: 5px; line-height: 1.3; }
  .mockup-tag {
    font-family: var(--mono); font-size: 8px;
    padding: 1px 5px; border-radius: 2px; display: inline-block;
  }
  .mockup-date { font-family: var(--mono); font-size: 8px; color: var(--muted); }

  /* ── DIVIDER ── */
  .divider {
    border: none; border-top: 1px solid var(--line);
    max-width: 1100px; margin: 0 auto;
  }

  /* ── STATS ── */
  .stats {
    max-width: 1100px; margin: 0 auto;
    padding: 48px 40px;
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--line);
    border: 1px solid var(--line); border-radius: 6px;
  }
  .stat {
    background: var(--white); padding: 32px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .stat-num {
    font-family: var(--mono); font-size: 36px; font-weight: 600;
    color: var(--ink); letter-spacing: -.03em;
  }
  .stat-label { font-size: 14px; color: var(--dim); }

  /* ── FEATURES ── */
  .features {
    max-width: 1100px; margin: 0 auto;
    padding: 80px 40px;
  }
  .features-header { margin-bottom: 48px; }
  .section-eyebrow {
    font-family: var(--mono); font-size: 11px; color: var(--dim);
    text-transform: uppercase; letter-spacing: .1em;
    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
  }
  .section-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--dim); }
  .section-title {
    font-family: var(--serif); font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 600; color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .section-title em { font-style: italic; }

  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: var(--line);
    border: 1px solid var(--line); border-radius: 6px; overflow: hidden;
  }
  .feature-card {
    background: var(--white); padding: 32px;
    transition: background .15s;
  }
  .feature-card:hover { background: #f8f7f4; }
  .feature-icon {
    width: 36px; height: 36px;
    background: #f2f1ee; border: 1px solid var(--line);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .feature-title {
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    color: var(--ink); margin-bottom: 8px;
  }
  .feature-body { font-size: 14px; color: var(--dim); line-height: 1.6; }

  /* ── HOW IT WORKS ── */
  .how {
    max-width: 1100px; margin: 0 auto;
    padding: 0 40px 80px;
  }
  .how-steps {
    margin-top: 48px;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
  }
  .how-step { position: relative; }
  .how-step::after {
    content: '→';
    position: absolute; right: -24px; top: 8px;
    font-family: var(--mono); font-size: 16px; color: var(--line);
  }
  .how-step:last-child::after { display: none; }
  .how-num {
    font-family: var(--mono); font-size: 11px; color: var(--muted);
    margin-bottom: 12px; letter-spacing: .06em;
  }
  .how-title {
    font-family: var(--mono); font-size: 14px; font-weight: 500;
    color: var(--ink); margin-bottom: 8px;
  }
  .how-body { font-size: 14px; color: var(--dim); line-height: 1.6; }

  /* ── CTA ── */
  .cta-section {
    max-width: 1100px; margin: 0 auto 80px;
    padding: 0 40px;
  }
  .cta-inner {
    background: var(--ink);
    border-radius: 8px;
    padding: 64px;
    display: flex; align-items: center; justify-content: space-between; gap: 40px;
  }
  .cta-title {
    font-family: var(--serif); font-size: clamp(24px, 3vw, 36px);
    font-weight: 600; color: var(--white);
    letter-spacing: -.02em; line-height: 1.1; max-width: 400px;
  }
  .cta-title em { font-style: italic; opacity: .7; }
  .cta-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }
  .btn-white {
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    background: var(--white); color: var(--ink);
    padding: 11px 24px; border-radius: 4px;
    text-decoration: none; transition: opacity .15s; display: inline-block;
  }
  .btn-white:hover { opacity: .9; }
  .btn-outline-white {
    font-family: var(--mono); font-size: 13px; color: rgba(255,255,255,.6);
    border: 1px solid rgba(255,255,255,.2); border-radius: 4px;
    padding: 11px 20px; text-decoration: none;
    transition: all .15s; display: inline-block;
  }
  .btn-outline-white:hover { color: var(--white); border-color: rgba(255,255,255,.5); }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--line);
    padding: 24px 40px;
    display: flex; align-items: center; justify-content: space-between;
    max-width: 1100px; margin: 0 auto;
  }
  .footer-copy {
    font-family: var(--mono); font-size: 11px; color: var(--muted);
  }
  .footer-links { display: flex; gap: 16px; }
  .footer-link {
    font-family: var(--mono); font-size: 11px; color: var(--muted);
    text-decoration: none; transition: color .15s;
  }
  .footer-link:hover { color: var(--ink); }

  /* ── ANIMATIONS ── */
  .fade-in {
    opacity: 0; animation: fadeUp .45s ease forwards;
  }
  .fade-in:nth-child(1) { animation-delay: .05s; }
  .fade-in:nth-child(2) { animation-delay: .15s; }
  .fade-in:nth-child(3) { animation-delay: .25s; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .hero { grid-template-columns: 1fr; padding: 100px 20px 48px; gap: 40px; }
    .hero-body { max-width: 100%; }
    .hero-visual { order: -1; }
    .stats { grid-template-columns: 1fr; padding: 0 20px; }
    .features, .how, .cta-section { padding-left: 20px; padding-right: 20px; }
    .features-grid { grid-template-columns: 1fr; }
    .how-steps { grid-template-columns: 1fr; gap: 24px; }
    .how-step::after { display: none; }
    .cta-inner { flex-direction: column; padding: 40px 28px; text-align: center; }
    .cta-actions { justify-content: center; }
    .footer { flex-direction: column; gap: 12px; text-align: center; padding: 20px; }
  }
`;

const mockCards = [
    { domain: 'github.com', title: 'awesome-react', tag: 'dev', tagStyle: { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }, date: 'May 3' },
    { domain: 'designmodo.com', title: 'UI Patterns 2025', tag: 'design', tagStyle: { background: '#fce7f3', color: '#9d174d', border: '1px solid #fbcfe8' }, date: 'May 4' },
    { domain: 'css-tricks.com', title: 'Grid Layout Guide', tag: 'css', tagStyle: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }, date: 'May 5' },
    { domain: 'notion.so', title: 'Product roadmap template', tag: 'tools', tagStyle: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }, date: 'May 6' },
];

export default function Landing() {
    return (
        <>
            <style>{CSS}</style>

            {/* NAV */}
            <nav className="nav">
                <a href="/" className="nav-logo">
                    <div className="nav-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            <line x1="9" y1="10" x2="15" y2="10" />
                        </svg>
                    </div>
                    <span className="nav-logo-text">Brainly</span>
                </a>
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Sign in</Link>
                    <Link to="/register" className="nav-cta">Get started</Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div style={{ opacity: 0, animation: 'fadeUp .45s .05s ease forwards' }}>
                    <p className="hero-eyebrow">Your personal web library</p>
                    <h1 className="hero-title">
                        Save links.<br />
                        Find them <em>instantly.</em>
                    </h1>
                    <p className="hero-body">
                        Brainly is a minimal bookmark manager for people who save too many tabs.
                        Tag anything, search everything, forget nothing.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary">Start for free →</Link>
                        <Link to="/login" className="btn-ghost">Sign in</Link>
                    </div>
                </div>

                {/* MOCKUP */}
                <div className="hero-visual">
                    <div className="mockup">
                        <div className="mockup-bar">
                            <div className="mockup-dot" />
                            <div className="mockup-dot" />
                            <div className="mockup-dot" />
                            <div className="mockup-url">brainly.app/dashboard</div>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-search">
                                <div className="mockup-input">Search links…</div>
                                <div className="mockup-btn">+ Save Link</div>
                            </div>
                            <div className="mockup-cards">
                                {mockCards.map((c, i) => (
                                    <div key={i} className="mockup-card">
                                        <div className="mockup-card-top">
                                            <span className="mockup-domain">{c.domain}</span>
                                            <span className="mockup-date">{c.date}</span>
                                        </div>
                                        <div className="mockup-card-title">{c.title}</div>
                                        <span className="mockup-tag" style={c.tagStyle}>{c.tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="divider" />

            {/* STATS */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
                <div className="stats" style={{ padding: 0 }}>
                    {[
                        { num: '< 1s', label: 'Average search response time' },
                        { num: '∞', label: 'Links you can save, no cap' },
                        { num: '100%', label: 'Yours — no ads, no tracking' },
                    ].map((s, i) => (
                        <div key={i} className="stat fade-in">
                            <span className="stat-num">{s.num}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURES */}
            <section className="features">
                <div className="features-header">
                    <p className="section-eyebrow">What you get</p>
                    <h2 className="section-title">Everything you need.<br /><em>Nothing you don't.</em></h2>
                </div>
                <div className="features-grid">
                    {[
                        {
                            title: 'Save in seconds',
                            body: 'Paste a URL, give it a title and notes. Done. No friction, no setup, no clutter.',
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                    <line x1="9" y1="10" x2="15" y2="10" />
                                </svg>
                            ),
                        },
                        {
                            title: 'Tag & filter',
                            body: 'Organise with free-form tags. Filter your entire library with one click. Color-coded so it\'s scannable at a glance.',
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                            ),
                        },
                        {
                            title: 'Instant search',
                            body: 'Full-text search across titles, URLs and notes. Find anything you\'ve ever saved in under a second.',
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="16.5" y1="16.5" x2="22" y2="22" />
                                </svg>
                            ),
                        },
                        {
                            title: 'Edit & update',
                            body: 'Changed your mind on a title or tag? Edit any link in-place. Your library stays accurate.',
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ),
                        },
                        {
                            title: 'Save links by groups',
                            body: 'Categorize links with custom groups to keep your collections organized and easy to navigate.',
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M9 13l3 3 5-6" />
                                    <path d="M10 15V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11" />
                                    <line x1="5" y1="19" x2="19" y2="19" />
                                </svg>
                            ),
                        },
                        {
                            title: 'Completely free',
                            body: 'No subscription, no ads, no upsell. Build your library without limits or a credit card.',
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ),
                        },
                    ].map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon">{f.icon}</div>
                            <p className="feature-title">{f.title}</p>
                            <p className="feature-body">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="how">
                <div>
                    <p className="section-eyebrow">How it works</p>
                    <h2 className="section-title">Three steps.<br /><em>That's it.</em></h2>
                </div>
                <div className="how-steps">
                    {[
                        { n: '01', title: 'Create an account', body: 'Sign up with your email and password. Takes about 20 seconds.' },
                        { n: '02', title: 'Save your first link group wise', body: 'Hit "+ Save Link", paste the URL, add a title, group and some tags.' },
                        { n: '03', title: 'Search and recall', body: 'Next time you need it, type a word. It\'s there.' },
                    ].map((s, i) => (
                        <div key={i} className="how-step">
                            <p className="how-num">{s.n}</p>
                            <p className="how-title">{s.title}</p>
                            <p className="how-body">{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-inner">
                    <h2 className="cta-title">
                        Stop losing links.<br />
                        <em>Start remembering everything.</em>
                    </h2>
                    <div className="cta-actions">
                        <Link to="/register" className="btn-white">Create free account →</Link>
                        <Link to="/login" className="btn-outline-white">Sign in</Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid var(--line)', textAlign: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex', padding: '24px 40px', maxWidth: 1100, margin: '0 auto' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#9b9b9b' }}>
                    © {new Date().getFullYear()} Brainly. Save smarter.
                </span>
            </footer>
        </>
    );
}