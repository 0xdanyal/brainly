import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../styles/global.css';
import '../styles/dashboard.css';

const API = import.meta.env.VITE_API_URL;

const TAG_PALETTE = [
  { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  { bg: '#fce7f3', color: '#9d174d', border: '#fbcfe8' },
  { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' },
  { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' },
  { bg: '#cffafe', color: '#155e75', border: '#a5f3fc' },
  { bg: '#f0fdf4', color: '#14532d', border: '#86efac' },
];

const tagColor = (tag) =>
  TAG_PALETTE[Math.abs([...tag].reduce((a, c) => a + c.charCodeAt(0), 0)) % TAG_PALETTE.length];

const parseTags = (str) => str.split(',').map(t => t.trim()).filter(Boolean);

const getDomain = (url) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Dashboard() {
  const { token, email, logout } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { url: '', title: '', description: '', tags: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchLinks = async () => {
    const params = {};
    if (search) params.q = search;
    if (activeTag) params.tag = activeTag;
    const { data } = await axios.get(`${API}/links`, { headers, params });
    setLinks(data);
  };

  const fetchTags = async () => {
    const { data } = await axios.get(`${API}/links/tags`, { headers });
    setTags(data);
  };

  useEffect(() => { fetchLinks(); }, [search, activeTag]);
  useEffect(() => { fetchTags(); }, [links]);

  const saveLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tags: parseTags(form.tags) };
      if (editingId) {
        await axios.patch(`${API}/links/${editingId}`, payload, { headers });
      } else {
        await axios.post(`${API}/links`, payload, { headers });
      }
      setForm(emptyForm);
      setAdding(false);
      setEditingId(null);
      fetchLinks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving link');
    }
    setLoading(false);
  };

  const startEdit = (link) => {
    setForm({ url: link.url, title: link.title, description: link.description, tags: link.tags.join(', ') });
    setEditingId(link._id);
    setAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  
  const cancelForm = () => { setForm(emptyForm); setAdding(false); setEditingId(null); };
  const recentLinks = [...links]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const topTags = tags.slice(0, 4);

  const deleteLink = async (id) => {
    if (!confirm('Delete this link?')) return;
    await axios.delete(`${API}/links/${id}`, { headers });
    fetchLinks();
  };

  return (
    <div className="dash-page">

      {/* HEADER */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <Logo onClick={() => { window.location.href = '/'; }} />
          <div className="dash-user-area">
            <div className="dash-stats">
              <span className="dash-stat-pill"><b>{links.length}</b> links</span>
              <span className="dash-stat-pill"><b>{tags.length}</b> tags</span>
            </div>
            <div className="v-rule" />
            <span className="dash-email">{email}</span>
            <button className="dash-signout-btn" onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="dash-hero">
        <h1 className="dash-hero-title">What did you save today?</h1>
        <p className="dash-hero-sub">Your personal library of links, notes & tags - always searchable.</p>
        <div className="dash-search-bar">
          <div className="dash-search-wrap">
            <svg className="dash-search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search by title, URL or notes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="dash-clear-btn" onClick={() => setSearch('')}>✕</button>}
          </div>
          <button
            className={`dash-add-btn${adding ? ' is-cancel' : ''}`}
            onClick={() => adding ? cancelForm() : setAdding(true)}
          >
            {adding ? '✕ Cancel' : '+ Save Link'}
          </button>
        </div>
      </section>

      {/* BODY */}
      <main className="dash-body">
        <section className="overview-grid">
          <article className="overview-card">
            <p className="overview-label">Quick status</p>
            <h3>{links.length === 0 ? 'Start your first stash' : `You saved ${links.length} links`}</h3>
            <p>
              {links.length === 0
                ? 'Add your first resource and build a searchable collection.'
                : 'Keep momentum by adding at least one useful link every day.'}
            </p>
          </article>

          <article className="overview-card">
            <p className="overview-label">Popular tags</p>
            {topTags.length > 0 ? (
              <div className="overview-chip-wrap">
                {topTags.map(tag => {
                  const c = tagColor(tag);
                  return (
                    <button
                      key={tag}
                      className="overview-chip"
                      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                      onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p>Add tags while saving links to unlock fast filtering.</p>
            )}
          </article>

          <article className="overview-card">
            <p className="overview-label">Recently added</p>
            {recentLinks.length > 0 ? (
              <ul className="recent-links-list">
                {recentLinks.map((link) => (
                  <li key={link._id}>
                    <a href={link.url} target="_blank" rel="noreferrer">{link.title || getDomain(link.url)}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your latest saved links will appear here.</p>
            )}
          </article>
        </section>

        {/* FORM */}
        {adding && (
          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">{editingId ? '✏️ Edit link' : '🔖 Save a new link'}</h2>
              <p className="form-card-sub">Fill in the details and add tags for easy filtering later.</p>
            </div>
            <form onSubmit={saveLink}>
              <div className="form-2col">
                <div className="form-field">
                  <label className="form-label">URL *</label>
                  <input placeholder="https://example.com" value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })} required />
                </div>
                <div className="form-field">
                  <label className="form-label">Title *</label>
                  <input placeholder="Give it a short name" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div className="form-field" style={{ marginTop: 14 }}>
                <label className="form-label">Notes / Description</label>
                <input placeholder="Why are you saving this? What's it for?" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-field" style={{ marginTop: 14 }}>
                <label className="form-label">
                  Tags{' '}
                  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--color-text-3)' }}>
                    — separate with commas e.g. react, tools, ux
                  </span>
                </label>
                <input placeholder="react, design, reference" value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })} />
                {form.tags && (
                  <div className="tag-preview-row">
                    {parseTags(form.tags).map(t => {
                      const c = tagColor(t);
                      return <span key={t} className="tag-preview-chip"
                        style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{t}</span>;
                    })}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={cancelForm}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}
                  style={{ width: 'auto', padding: '10px 28px' }}>
                  {loading ? 'Saving…' : editingId ? 'Update Link' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAG FILTERS */}
        {tags.length > 0 && (
          <div className="filter-row">
            <span className="filter-label">Filter:</span>
            <div className="filter-pills">
              <button className={`filter-pill${activeTag === '' ? ' active' : ''}`} onClick={() => setActiveTag('')}>
                All links
              </button>
              {tags.map(tag => {
                const c = tagColor(tag);
                const on = activeTag === tag;
                return (
                  <button key={tag} className={`filter-pill${on ? ' active' : ''}`}
                    style={on ? { background: c.bg, color: c.color, borderColor: c.border } : {}}
                    onClick={() => setActiveTag(on ? '' : tag)}>{tag}</button>
                );
              })}
            </div>
          </div>
        )}

        {(search || activeTag) && links.length > 0 && (
          <p className="results-info">
            {links.length} result{links.length !== 1 ? 's' : ''}
            {activeTag && ` tagged "${activeTag}"`}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* EMPTY STATE */}
        {links.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">{search || activeTag ? '🔍' : '📎'}</span>
            <h3 className="empty-title">{search || activeTag ? 'Nothing found' : 'Your stash is empty'}</h3>
            <p className="empty-text">
              {search || activeTag
                ? 'Try a different keyword or clear the tag filter.'
                : 'Hit "+ Save Link" above to start building your personal web library!'}
            </p>
          </div>
        )}

        {/* LINKS GRID */}
        <div className="links-grid">
          {links.map((link, i) => (
            <article key={link._id} className="link-card" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
              <div className="card-top">
                <div className="card-site">
                  <div className="card-favicon">
                    <img src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`}
                      onError={e => { e.target.style.display = 'none'; }}
                      style={{ width: 16, height: 16 }} alt="" />
                  </div>
                  <span className="card-domain">{getDomain(link.url)}</span>
                </div>
                <div className="card-actions">
                  <button className="card-action-btn" onClick={() => startEdit(link)} title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="card-action-btn danger" onClick={() => deleteLink(link._id)} title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>

              <a href={link.url} target="_blank" rel="noreferrer" className="card-title">
                {link.title || link.url}
              </a>

              {link.description && <p className="card-desc">{link.description}</p>}

              <div className="card-footer">
                <div className="card-tags">
                  {link.tags.map(t => {
                    const c = tagColor(t);
                    return (
                      <span key={t} className="card-tag"
                        style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                        onClick={() => setActiveTag(activeTag === t ? '' : t)}>{t}</span>
                    );
                  })}
                </div>
                <span className="card-date">{formatDate(link.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}