import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMySessions, updateSessionStatus, cancelSession, createReview } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await getMySessions();
      setSessions(data);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateSessionStatus(id, { status });
      setSessions(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch (e) {}
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this session?')) return;
    try {
      await cancelSession(id);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (e) {}
  };

  const handleReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      const otherId = reviewModal.requester?._id === user?._id ? reviewModal.provider?._id : reviewModal.requester?._id;
      await createReview({ reviewee: otherId, session: reviewModal._id, rating: reviewForm.rating, comment: reviewForm.comment, skillTaught: reviewModal.skillToLearn });
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
    } catch (e) {} finally { setSubmitting(false); }
  };

  const upcoming = sessions.filter(s => ['pending', 'confirmed'].includes(s.status));
  const past = sessions.filter(s => ['completed', 'cancelled'].includes(s.status));
  const displayed = tab === 'upcoming' ? upcoming : past;

  const statusColor = { pending: '#D4920D', confirmed: '#1B8856', completed: '#1B8856', cancelled: '#D43535' };
  const statusBg = { pending: '#FFF8E7', confirmed: '#E8FAF3', completed: '#E8FAF3', cancelled: '#FFECEC' };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div style={{ padding: 32 }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, marginBottom: 6 }}>📅 My Sessions</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage your learning sessions</p>
        </div>
        <Link to="/explore" className="btn btn-primary">+ Request New Session</Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
        {[['upcoming', `Upcoming (${upcoming.length})`], ['past', `Past (${past.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '12px 28px', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: tab === key ? 'var(--primary)' : 'var(--text-light)', borderBottom: tab === key ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -2, transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-light)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
          <h3 style={{ marginBottom: 8 }}>No {tab} sessions</h3>
          <p style={{ marginBottom: 20 }}>{tab === 'upcoming' ? "You don't have any upcoming sessions yet." : "You haven't completed any sessions yet."}</p>
          <Link to="/explore" className="btn btn-primary">Find Skills to Learn</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayed.map(s => {
            const isRequester = s.requester?._id === user?._id;
            const other = isRequester ? s.provider : s.requester;
            return (
              <div key={s._id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📅</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                      <h3 style={{ fontSize: 17 }}>{s.skillToLearn}</h3>
                      <span style={{ background: statusBg[s.status], color: statusColor[s.status], padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                      <span className={`badge ${s.sessionType === 'paid' ? 'badge-warning' : 'badge-primary'}`}>
                        {s.sessionType === 'paid' ? `$${s.price}/hr` : 'Skill Exchange'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 4 }}>
                      {isRequester ? '📚 Learning from' : '🎓 Teaching'}: <strong>{other?.firstName} {other?.lastName}</strong>
                    </div>
                    <div style={{ color: 'var(--text-mid)', fontSize: 13 }}>
                      📆 {new Date(s.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      {s.scheduledTime && ` at ${s.scheduledTime}`} · ⏱ {s.duration} mins
                    </div>
                    {s.message && <p style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 6, fontStyle: 'italic' }}>"{s.message}"</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    {s.status === 'pending' && !isRequester && (
                      <button onClick={() => handleStatus(s._id, 'confirmed')} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>✓ Confirm</button>
                    )}
                    {s.status === 'confirmed' && (
                      <button onClick={() => handleStatus(s._id, 'completed')} className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '8px 18px', fontSize: 13 }}>✓ Mark Complete</button>
                    )}
                    {s.status === 'completed' && isRequester && (
                      <button onClick={() => setReviewModal(s)} className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>⭐ Leave Review</button>
                    )}
                    {['pending', 'confirmed'].includes(s.status) && isRequester && (
                      <button onClick={() => handleCancel(s._id)} className="btn" style={{ background: '#FFECEC', color: '#D43535', padding: '8px 18px', fontSize: 13 }}>✕ Cancel</button>
                    )}
                    <Link to={`/profile/${other?._id}`} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13, textAlign: 'center' }}>View Profile</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 36 }}>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>⭐ Leave a Review</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: 24, fontSize: 14 }}>Share your experience with {reviewModal.provider?.firstName}</p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Rating</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                    style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', opacity: n <= reviewForm.rating ? 1 : 0.3, transition: 'opacity 0.2s' }}>⭐</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Your Review</label>
              <textarea className="input" rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} style={{ resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleReview} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button onClick={() => setReviewModal(null)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
