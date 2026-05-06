import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const API = import.meta.env.VITE_API_URL;

/* ─── helpers ─────────────────────────────────────────────── */
const TAG_PALETTE = [
  { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  { bg: '#fce7f3', color: '#9d174d', border: '#fbcfe8' },
  { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' },
  { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' },
  { bg: '#cffafe', color: '#155e75', border: '#a5f3fc' },
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

/* ─── styles (injected once) ──────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:   #111;
    --dim:   #666;
    --line:  #e0e0e0;
    --bg:    #fafafa;
    --white: #fff;
    --mono:  'IBM Plex Mono', monospace;
    --sans:  'IBM Plex Sans', sans-serif;
    --radius: 4px;
  }

  body { background: var(--bg); color: var(--ink); font-family: var(--sans); }

  /* ── top bar ── */
  .tb {
    position: sticky; top: 0; z-index: 10;
    background: var(--white);
    border-bottom: 1px solid var(--line);
    display: flex; align-items: center; gap: 16px;
    padding: 0 24px; height: 52px;
  }
  .tb-logo { cursor: pointer; display: flex; align-items: center; }
  .tb-spacer { flex: 1; }
  .tb-email {
    font-family: var(--mono); font-size: 12px; color: var(--dim);
  }
  .tb-signout {
    font-family: var(--mono); font-size: 12px;
    background: none; border: none; cursor: pointer;
    color: var(--dim); padding: 0;
    text-decoration: underline; text-underline-offset: 2px;
  }
  .tb-signout:hover { color: var(--ink); }

  /* ── search bar ── */
  .sb {
    background: var(--white);
    border-bottom: 1px solid var(--line);
    padding: 12px 24px;
    display: flex; gap: 8px; align-items: center;
  }
  .sb-wrap {
    flex: 1; position: relative; display: flex; align-items: center;
  }
  .sb-wrap input {
    width: 100%;
    font-family: var(--sans); font-size: 14px;
    border: 1px solid var(--line); border-radius: var(--radius);
    padding: 8px 32px 8px 10px;
    background: var(--bg); color: var(--ink);
    outline: none; transition: border-color .15s;
  }
  .sb-wrap input:focus { border-color: var(--ink); background: var(--white); }
  .sb-clear {
    position: absolute; right: 8px;
    background: none; border: none; cursor: pointer;
    color: var(--dim); font-size: 13px; line-height: 1;
    padding: 2px 4px;
  }
  .sb-clear:hover { color: var(--ink); }
  .sb-save {
    font-family: var(--mono); font-size: 12px;
    background: var(--ink); color: var(--white);
    border: none; border-radius: var(--radius);
    padding: 8px 16px; cursor: pointer;
    white-space: nowrap; transition: opacity .15s;
  }
  .sb-save:hover { opacity: .8; }
  .sb-save.cancel {
    background: none; color: var(--ink);
    border: 1px solid var(--line);
  }
  .sb-save.cancel:hover { border-color: var(--ink); opacity: 1; }

  /* ── main ── */
  .main { max-width: 900px; margin: 0 auto; padding: 24px; }

  /* ── form ── */
  .form-card {
    border: 1px solid var(--line); border-radius: var(--radius);
    background: var(--white); padding: 20px;
    margin-bottom: 24px;
  }
  .form-card h2 {
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    color: var(--dim); margin-bottom: 16px; text-transform: uppercase; letter-spacing: .04em;
  }
  .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-field { display: flex; flex-direction: column; gap: 4px; }
  .form-field + .form-field { margin-top: 12px; }
  .form-label {
    font-family: var(--mono); font-size: 11px; color: var(--dim);
    text-transform: uppercase; letter-spacing: .06em;
  }
  .form-field input {
    font-family: var(--sans); font-size: 14px;
    border: 1px solid var(--line); border-radius: var(--radius);
    padding: 8px 10px; background: var(--bg); color: var(--ink);
    outline: none; transition: border-color .15s;
  }
  .form-field input:focus { border-color: var(--ink); background: var(--white); }
  .tag-preview { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .tag-chip {
    font-family: var(--mono); font-size: 11px;
    padding: 2px 7px; border-radius: 2px;
  }
  .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
  .btn-ghost {
    font-family: var(--mono); font-size: 12px;
    background: none; border: 1px solid var(--line); border-radius: var(--radius);
    padding: 7px 14px; cursor: pointer; color: var(--dim);
  }
  .btn-ghost:hover { border-color: var(--ink); color: var(--ink); }
  .btn-primary {
    font-family: var(--mono); font-size: 12px;
    background: var(--ink); color: var(--white);
    border: none; border-radius: var(--radius);
    padding: 7px 18px; cursor: pointer; transition: opacity .15s;
  }
  .btn-primary:hover { opacity: .8; }
  .btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  /* ── filter row ── */
  .filter-row {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .filter-label {
    font-family: var(--mono); font-size: 11px; color: var(--dim);
    text-transform: uppercase; letter-spacing: .06em;
  }
  .filter-pill {
    font-family: var(--mono); font-size: 11px;
    background: none; border: 1px solid var(--line); border-radius: 2px;
    padding: 3px 10px; cursor: pointer; color: var(--dim); transition: all .12s;
  }
  .filter-pill:hover, .filter-pill.active {
    border-color: var(--ink); color: var(--ink); background: var(--white);
  }

  /* ── results info ── */
  .results-info {
    font-family: var(--mono); font-size: 12px; color: var(--dim);
    margin-bottom: 12px;
  }

  /* ── links grid ── */
  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--line);
  }

  .link-card {
    background: var(--white); padding: 16px;
    display: flex; flex-direction: column; gap: 6px;
    opacity: 0; animation: fadeUp .25s ease forwards;
    transition: background .12s;
  }
  .link-card:hover { background: var(--bg); }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-top {
    display: flex; justify-content: space-between; align-items: center;
  }
  .card-site { display: flex; align-items: center; gap: 5px; }
  .card-domain {
    font-family: var(--mono); font-size: 11px; color: var(--dim);
  }
  .card-actions { display: flex; gap: 4px; opacity: 0; transition: opacity .12s; }
  .link-card:hover .card-actions { opacity: 1; }
  .card-btn {
    background: none; border: 1px solid var(--line); border-radius: 2px;
    padding: 3px 6px; cursor: pointer; color: var(--dim); transition: all .12s;
  }
  .card-btn:hover { border-color: var(--ink); color: var(--ink); }
  .card-btn.del:hover { border-color: #e53e3e; color: #e53e3e; }

  .card-title {
    font-family: var(--sans); font-size: 14px; font-weight: 500;
    color: var(--ink); text-decoration: none; line-height: 1.3;
  }
  .card-title:hover { text-decoration: underline; text-underline-offset: 2px; }
  .card-desc {
    font-size: 13px; color: var(--dim); line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .card-footer {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-top: auto; padding-top: 6px;
  }
  .card-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .card-tag {
    font-family: var(--mono); font-size: 10px;
    padding: 2px 6px; border-radius: 2px; cursor: pointer;
  }
  .card-date {
    font-family: var(--mono); font-size: 10px; color: var(--dim); white-space: nowrap;
  }

  /* ── empty ── */
  .empty {
    text-align: center; padding: 60px 24px;
    border: 1px dashed var(--line); border-radius: var(--radius);
  }
  .empty-title { font-family: var(--mono); font-size: 14px; color: var(--dim); }
  .empty-sub { font-size: 13px; color: var(--dim); margin-top: 6px; }

  @media (max-width: 600px) {
    .form-2col { grid-template-columns: 1fr; }
    .tb-email { display: none; }
  }
`;

export default function Dashboard() {
  const { token, email, logout } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeGroup, setActiveGroup] = useState('');
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { url: '', title: '', description: '', tags: '', group: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchLinks = async () => {
    const params = {};
    if (search) params.q = search;
    if (activeTag) params.tag = activeTag;
    if (activeGroup) params.group = activeGroup;
    const { data } = await axios.get(`${API}/links`, { headers, params });
    setLinks(data);
  };

  const fetchTags = async () => {
    const { data } = await axios.get(`${API}/links/tags`, { headers });
    setTags(data);
  };

  const fetchGroups = async () => {
    const { data } = await axios.get(`${API}/links/groups`, { headers });
    setGroups(data);
  };

  useEffect(() => { fetchLinks(); }, [search, activeTag, activeGroup]);
  useEffect(() => { fetchTags(); fetchGroups(); }, [links]);

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
      setForm(emptyForm); setAdding(false); setEditingId(null);
      fetchLinks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving link');
    }
    setLoading(false);
  };

  const startEdit = (link) => {
    setForm({ url: link.url, title: link.title, description: link.description, tags: link.tags.join(', '), group: link.group || '' });
    setEditingId(link._id); setAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteLink = async (id) => {
    if (!confirm('Delete this link?')) return;
    await axios.delete(`${API}/links/${id}`, { headers });
    fetchLinks();
  };

  const cancelForm = () => { setForm(emptyForm); setAdding(false); setEditingId(null); };

  return (
    <>
      <style>{CSS}</style>

      {/* TOP BAR */}
      <header className="tb">
        <div className="tb-logo" onClick={() => { window.location.href = '/dashboard'; }}>
          <Logo />
        </div>
        <div className="tb-spacer" />
        <span className="tb-email">{email}</span>
        <button className="tb-signout" onClick={logout}>sign out</button>
      </header>

      {/* SEARCH + SAVE */}
      <div className="sb">
        <div className="sb-wrap">
          <input
            placeholder="Search links…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="sb-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <button
          className={`sb-save${adding ? ' cancel' : ''}`}
          onClick={() => adding ? cancelForm() : setAdding(true)}
        >
          {adding ? 'Cancel' : '+ Save Link'}
        </button>
      </div>

      <main className="main">

        {/* FORM */}
        {adding && (
          <div className="form-card">
            <h2>{editingId ? 'Edit link' : 'New link'}</h2>
            <form onSubmit={saveLink}>
              <div className="form-2col">
                <div className="form-field">
                  <label className="form-label">URL *</label>
                  <input placeholder="https://example.com" value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })} required />
                </div>
                <div className="form-field">
                  <label className="form-label">Title *</label>
                  <input placeholder="Short name" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Notes</label>
                <input placeholder="Why are you saving this?" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Folder / Group</label>
                <input placeholder="e.g. Coding Stuff" value={form.group}
                  onChange={e => setForm({ ...form, group: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Tags — comma separated</label>
                <input placeholder="react, design, reference" value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })} />
                {form.tags && (
                  <div className="tag-preview">
                    {parseTags(form.tags).map(t => {
                      const c = tagColor(t);
                      return (
                        <span key={t} className="tag-chip"
                          style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={cancelForm}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving…' : editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* GROUP FILTERS */}
        {groups.length > 0 && (
          <div className="filter-row" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px', marginBottom: '16px' }}>
            <span className="filter-label">📁 Folders</span>
            <button className={`filter-pill${activeGroup === '' ? ' active' : ''}`} onClick={() => setActiveGroup('')}>
              all
            </button>
            {groups.map(group => (
              <button key={group}
                className={`filter-pill${activeGroup === group ? ' active' : ''}`}
                onClick={() => setActiveGroup(activeGroup === group ? '' : group)}>
                {group}
              </button>
            ))}
          </div>
        )}

        {/* TAG FILTERS */}
        {tags.length > 0 && (
          <div className="filter-row">
            <span className="filter-label">Filter</span>
            <button className={`filter-pill${activeTag === '' ? ' active' : ''}`} onClick={() => setActiveTag('')}>
              all
            </button>
            {tags.map(tag => (
              <button key={tag}
                className={`filter-pill${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {(search || activeTag || activeGroup) && links.length > 0 && (
          <p className="results-info">
            {links.length} result{links.length !== 1 ? 's' : ''}
            {activeGroup && ` · 📁 ${activeGroup}`}
            {activeTag && ` · ${activeTag}`}
            {search && ` · "${search}"`}
          </p>
        )}

        {/* EMPTY */}
        {links.length === 0 && (
          <div className="empty">
            <p className="empty-title">{search || activeTag || activeGroup ? 'Nothing found.' : 'No links yet.'}</p>
            <p className="empty-sub">
              {search || activeTag || activeGroup
                ? 'Try a different keyword or clear the filter.'
                : 'Hit "+ Save Link" to add your first one.'}
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="links-grid">
          {links.map((link, i) => (
            <article key={link._id} className="link-card" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
              <div className="card-top">
                <div className="card-site">
                  <img src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`}
                    onError={e => { e.target.style.display = 'none'; }}
                    style={{ width: 14, height: 14 }} alt="" />
                  <span className="card-domain">{getDomain(link.url)}</span>
                </div>
                <div className="card-actions">
                  <button className="card-btn" onClick={() => startEdit(link)} title="Edit">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="card-btn del" onClick={() => deleteLink(link._id)} title="Delete">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" />
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
                        onClick={() => setActiveTag(activeTag === t ? '' : t)}>
                        {t}
                      </span>
                    );
                  })}
                </div>
                <span className="card-date">{formatDate(link.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>

      </main>
    </>
  );
}