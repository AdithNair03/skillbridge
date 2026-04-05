import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/sessions')
    ]).then(([s, u, se]) => {
      setStats(s.data);
      setUsers(u.data);
      setSessions(se.data);
    }).catch(() => toast('Could not load admin data', 'error')).finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers(p => p.map(u => u._id === id ? { ...u, isActive: data.isActive } : u));
      toast(data.message, 'success');
    } catch { toast('Error', 'error'); }
  };

  const verifyUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/verify`);
      setUsers(p => p.map(u => u._id === id ? { ...u, isVerified: true } : u));
      toast('User verified!', 'success');
    } catch { toast('Error', 'error'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(p => p.filter(u => u._id !== id));
      toast('User deleted', 'info');
    } catch { toast('Error', 'error'); }
  };

  if (loading) return (
    <div className="dashboard-layout"><Sidebar />
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <div className="spinner" />
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'var(--primary)' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: '✅', color: 'var(--success)' },
    { label: 'Total Sessions', value: stats?.totalSessions || 0, icon: '📅', color: 'var(--warning)' },
    { label: 'Completed Sessions', value: stats?.completedSessions || 0, icon: '🏆', color: 'var(--accent)' },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: '⭐', color: 'var(--secondary)' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #EF4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚙️</div>
          <div>
            <h1 style={{ fontSize: '1.6rem' }}>Admin Panel</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage the Skill Bridge platform</p>
          </div>
        </div>

        <div className="tabs">
          {[['dashboard', '📊 Dashboard'], ['users', '👥 Users'], ['sessions', '📅 Sessions']].map(([val, label]) => (
            <button key={val} className={`tab-btn ${tab === val ? 'active' : ''}`} onClick={() => setTab(val)}>{label}</button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              {statCards.map(s => (
                <div key={s.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: 16 }}>🆕 Recent Users</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Name', 'Email', 'Role', 'Joined', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentUsers || []).map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar avatar-sm" style={{ fontSize: 12 }}>{u.firstName?.[0]}{u.lastName?.[0]}</div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 14, color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: 11 }}>{u.role}</span></td>
                      <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3>All Users ({users.length})</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['User', 'Email', 'Rating', 'Sessions', 'Verified', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar avatar-sm" style={{ fontSize: 12 }}>{u.firstName?.[0]}{u.lastName?.[0]}</div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px', fontSize: 14 }}>{u.rating ? `⭐ ${u.rating}` : 'N/A'}</td>
                      <td style={{ padding: '12px', fontSize: 14 }}>{u.totalSessions || 0}</td>
                      <td style={{ padding: '12px' }}>
                        {u.isVerified ? <span className="badge badge-success" style={{ fontSize: 11 }}>✓ Yes</span> : <span className="badge badge-gray" style={{ fontSize: 11 }}>No</span>}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {!u.isVerified && <button className="btn btn-success btn-sm" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => verifyUser(u._id)}>Verify</button>}
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => toggleUser(u._id)}>{u.isActive ? 'Disable' : 'Enable'}</button>
                          {u.role !== 'admin' && <button className="btn btn-danger btn-sm" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => deleteUser(u._id)}>Delete</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sessions */}
        {tab === 'sessions' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: 20 }}>All Sessions ({sessions.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Skill', 'Requester', 'Provider', 'Type', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px', fontWeight: 600, fontSize: 14 }}>{s.skillToLearn}</td>
                      <td style={{ padding: '12px', fontSize: 14 }}>{s.requester?.firstName} {s.requester?.lastName}</td>
                      <td style={{ padding: '12px', fontSize: 14 }}>{s.provider?.firstName} {s.provider?.lastName}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${s.sessionType === 'exchange' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: 11 }}>{s.sessionType}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-muted)' }}>{new Date(s.scheduledDate).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${
                          s.status === 'completed' ? 'badge-success' : s.status === 'cancelled' ? 'badge-danger' : s.status === 'confirmed' ? 'badge-primary' : 'badge-warning'
                        }`} style={{ fontSize: 11 }}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
