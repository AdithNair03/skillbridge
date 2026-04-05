import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById, createSession } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RequestSession() {
  const { providerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({
    sessionType: 'exchange', skillToLearn: '', skillToTeach: '',
    duration: 60, scheduledDate: '', scheduledTime: '', message: '', price: 0
  });

  useEffect(() => {
    getUserById(providerId).then(r => setProvider(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [providerId]);

  const today = new Date();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };

  const isPastDay = (day) => {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDay) return alert('Please select a date from the calendar');
    if (!form.skillToLearn) return alert('Please select a skill to learn');
    setSubmitting(true);
    const date = new Date(currentYear, currentMonth, selectedDay);
    try {
      await createSession({
        provider: providerId, ...form,
        scheduledDate: date.toISOString(),
        price: form.sessionType === 'paid' ? provider?.hourlyRate || 0 : 0
      });
      setSuccess(true);
      setTimeout(() => navigate('/sessions'), 2000);
    } catch (e) {
      alert('Failed to create session. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!provider) return <div style={{ padding: 32 }}>Provider not found</div>;

  return (
    <div style={{ padding: 32, maxWidth: 900 }} className="animate-fade">
      <Link to={`/profile/${providerId}`} style={{ color: 'var(--text-light)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to Profile</Link>
      <h2 style={{ fontSize: 28, marginBottom: 28 }}>📅 Request a Session</h2>

      {success && (
        <div style={{ background: '#E8FAF3', color: '#1B8856', padding: '20px 24px', borderRadius: 'var(--radius)', marginBottom: 24, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>
          ✅ Session requested successfully! Redirecting to sessions...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <form onSubmit={handleSubmit}>
          {/* Session Type */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 16 }}>Session Type</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['exchange', '👥', 'Skill Exchange', 'Trade your skills'], ['paid', '💵', 'Paid Session', `$${provider.hourlyRate || 40}/hour`]].map(([type, icon, label, sub]) => (
                <div key={type} onClick={() => setForm({ ...form, sessionType: type })}
                  style={{ border: `2px solid ${form.sessionType === type ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '16px 20px', cursor: 'pointer', background: form.sessionType === type ? 'var(--primary-light)' : 'var(--bg-white)', transition: 'all 0.2s', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                  <div style={{ color: 'var(--text-light)', fontSize: 12 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill details */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Skill You Want to Learn *</label>
              <select className="input" value={form.skillToLearn} onChange={e => setForm({ ...form, skillToLearn: e.target.value })} required>
                <option value="">Select a skill</option>
                {provider.skillsOffered?.map(s => <option key={s._id} value={s.name}>{s.name} ({s.level})</option>)}
                <option value="Other">Other</option>
              </select>
            </div>
            {form.sessionType === 'exchange' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Skill You Will Teach</label>
                <select className="input" value={form.skillToTeach} onChange={e => setForm({ ...form, skillToTeach: e.target.value })}>
                  <option value="">Select a skill</option>
                  {user?.skillsOffered?.map(s => <option key={s._id} value={s.name}>{s.name} ({s.level})</option>)}
                </select>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Session Duration</label>
              <select className="input" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}>
                {[[30,'30 minutes'],[60,'1 hour'],[90,'1.5 hours'],[120,'2 hours']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Preferred Time</label>
              <input className="input" type="time" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} />
            </div>
          </div>

          {/* Message */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Message (Optional)</label>
            <textarea className="input" rows={3} placeholder="Introduce yourself and explain what you'd like to learn..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'none' }} />
          </div>

          {/* Calendar */}
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, marginBottom: 16 }}>
              📆 Select a Date 
              {selectedDay && <span style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: 12, fontSize: 14 }}>
                ✓ {monthNames[currentMonth]} {selectedDay}, {currentYear}
              </span>}
            </h3>

            {/* Month navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button type="button" onClick={prevMonth}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-white)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>‹</button>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{monthNames[currentMonth]} {currentYear}</span>
              <button type="button" onClick={nextMonth}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-white)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, textAlign: 'center', marginBottom: 4 }}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, textAlign: 'center' }}>
              {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
              {calDays.map(day => {
                const past = isPastDay(day);
                const selected = selectedDay === day;
                return (
                  <div key={day}
                    onClick={() => !past && setSelectedDay(day)}
                    style={{
                      padding: '9px 0', borderRadius: 8,
                      cursor: past ? 'not-allowed' : 'pointer',
                      fontWeight: selected ? 700 : 500,
                      fontSize: 13,
                      background: selected ? 'var(--primary)' : 'transparent',
                      color: selected ? '#fff' : past ? 'var(--border)' : 'var(--text-dark)',
                      border: selected ? 'none' : '1px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!past && !selected) e.currentTarget.style.background = 'var(--primary-light)'; }}
                    onMouseLeave={e => { if (!past && !selected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }}
            disabled={submitting || !selectedDay}>
            {submitting ? 'Sending Request...' : !selectedDay ? 'Select a date first' : '📅 Send Session Request'}
          </button>
        </form>

        {/* Provider card */}
        <div>
          <div className="card" style={{ padding: 24, position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                {provider.firstName?.[0]}{provider.lastName?.[0]}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{provider.firstName} {provider.lastName}</div>
                <div style={{ color: 'var(--text-light)', fontSize: 13 }}>{provider.skillsOffered?.[0]?.name || 'Skill Sharer'}</div>
                <div style={{ color: '#F5A623', fontSize: 13 }}>⭐ {provider.rating || 'New'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {provider.isVerified && <span className="badge badge-success">✓ Verified</span>}
              {provider.isTopRated && <span className="badge badge-warning">⭐ Top Rated</span>}
            </div>
            {[['Total Sessions', provider.totalSessions || 0], ['Response Time', provider.responseTime || '< 24 hrs'], ['Success Rate', `${provider.successRate || 100}%`]].map(([l,v])=>(
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-light)' }}>{l}</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📋 Session Policy</div>
              {['Free cancellation up to 24 hours before','Sessions via video call','Materials provided after session','Q&A support included'].map(p => (
                <div key={p} style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 6 }}>• {p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
