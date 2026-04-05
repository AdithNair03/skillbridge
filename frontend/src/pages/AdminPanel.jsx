import { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, toggleUserStatus, deleteAdminUser, verifyUser, getAdminSessions } from '../api';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [s, u, se] = await Promise.all([getAdminStats(), getAdminUsers(), getAdminSessions()]);
      setStats(s.data); setUsers(u.data); setSessions(se.data);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    await toggleUserStatus(id);
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this user?')) return;
    await deleteAdminUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const handleVerify = async (id) => {
    const { data } = await verifyUser(id);
    setUsers(prev => prev.map(u => u._id === id ? data : u));
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'var(--primary)' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: '✅', color: 'var(--accent)' },
    { label: 'Total Sessions', value: stats?.totalSessions || 0, icon: '📅', color: '#F5A623' },
    { label: 'Completed Sessions', value: stats?.completedSessions || 0, icon: '🏆', color: '#1B8856' },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: '⭐', color: 'var(--secondary)' },
  ];

  return (
    <div style={{ padding: 32 }} className="animate-fade">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, marginBottom: 6 }}>⚙️ Admin Panel</h2>
        <p style={{ color: 'var(--text-light)' }}>Manage the Skill Bridge platform</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 28 }}>
        {[['overview','📊 Overview'], ['users','👥 Users'], ['sessions','📅 Sessions']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '12px 28px', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: tab === key ? 'var(--primary)' : 'var(--text-light)', borderBottom: tab === key ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -2, transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
            {statCards.map(s => (
              <div key={s.label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>🆕 Recent Users</h3>
            {stats?.recentUsers?.map(u => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{u.firstName} {u.lastName}</div>
                  <div style={{ color: 'var(--text-light)', fontSize: 12 }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{new Date(u.createdAt).toLocaleDateString()}</div>
                <span style={{ background: u.isActive ? '#E8FAF3' : '#FFECEC', color: u.isActive ? '#1B8856' : '#D43535', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <input className="input" placeholder="🔍 Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                    {['User','Email','Role','Skills','Status','Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{u.firstName} {u.lastName}</div>
                            {u.isVerified && <span style={{ fontSize: 11, color: '#1B8856' }}>✓ Verified</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-mid)' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: 11 }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                        {(u.skillsOffered?.length || 0) + (u.skillsWanted?.length || 0)} skills
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: u.isActive ? '#E8FAF3' : '#FFECEC', color: u.isActive ? '#1B8856' : '#D43535', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {!u.isVerified && (
                            <button onClick={() => handleVerify(u._id)} title="Verify" style={{ background: '#E8FAF3', color: '#1B8856', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>✓</button>
                          )}
                          <button onClick={() => handleToggle(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'} style={{ background: u.isActive ? '#FFF8E7' : '#E8FAF3', color: u.isActive ? '#D4920D' : '#1B8856', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>
                            {u.isActive ? '⏸' : '▶'}
                          </button>
                          <button onClick={() => handleDelete(u._id)} title="Delete" style={{ background: '#FFECEC', color: '#D43535', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-light)' }}>No users found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sessions */}
      {tab === 'sessions' && (
        <div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                    {['Skill','Requester','Provider','Type','Date','Status'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14 }}>{s.skillToLearn}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13 }}>{s.requester?.firstName} {s.requester?.lastName}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13 }}>{s.provider?.firstName} {s.provider?.lastName}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${s.sessionType === 'paid' ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: 11 }}>{s.sessionType}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-light)' }}>{new Date(s.scheduledDate).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.status === 'completed' ? '#E8FAF3' : s.status === 'cancelled' ? '#FFECEC' : s.status === 'confirmed' ? '#E8FAF3' : '#FFF8E7', color: s.status === 'completed' ? '#1B8856' : s.status === 'cancelled' ? '#D43535' : s.status === 'confirmed' ? '#1B8856' : '#D4920D' }}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sessions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-light)' }}>No sessions found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
