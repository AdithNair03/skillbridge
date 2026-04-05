import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMySessions, getUsers } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u] = await Promise.all([getMySessions(), getUsers()]);
        setSessions(s.data.filter(s => s.status !== 'cancelled').slice(0, 3));
        setRecommended(u.data.filter(u => u._id !== user?._id).slice(0, 4));
      } catch(e) {} finally { setLoading(false); }
    };
    load();
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'pending' || s.status === 'confirmed');
  const statsData = [
    { label: 'Sessions Completed', value: user?.totalSessions || 0, color: 'var(--primary)' },
    { label: 'Skills Offered', value: user?.skillsOffered?.length || 0, color: 'var(--accent)' },
    { label: 'Your Rating', value: user?.rating ? `⭐ ${user.rating}` : '⭐ New', color: '#F5A623' },
  ];

  if (loading) return <div className="page-loader"><div className="spinner"/></div>;

  return (
    <div style={{padding:32}} className="animate-fade">
      {/* Welcome banner */}
      <div style={{background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',borderRadius:'var(--radius-lg)',padding:'32px 40px',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32,flexWrap:'wrap',gap:20}}>
        <div>
          <h2 style={{fontSize:28,marginBottom:6}}>Welcome back, {user?.firstName}! 👋</h2>
          <p style={{opacity:0.85}}>Ready to learn something new today?</p>
        </div>
        <Link to="/explore" className="btn" style={{background:'rgba(255,255,255,0.2)',color:'#fff',border:'2px solid rgba(255,255,255,0.3)'}}>
          Explore Skills
        </Link>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24,alignItems:'start'}}>
        <div>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28}}>
            {statsData.map(s => (
              <div key={s.label} className="card" style={{padding:'20px 24px'}}>
                <div style={{fontSize:28,fontWeight:800,fontFamily:'var(--font-display)',color:s.color,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:13,color:'var(--text-light)'}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming Sessions */}
          <div className="card" style={{padding:24,marginBottom:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontSize:18}}>⏰ Upcoming Sessions</h3>
              <Link to="/sessions" style={{color:'var(--primary)',fontSize:14,fontWeight:600}}>View All</Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <div style={{textAlign:'center',padding:'32px 0',color:'var(--text-light)'}}>
                <div style={{fontSize:40,marginBottom:12}}>📅</div>
                <p>No upcoming sessions. <Link to="/explore" style={{color:'var(--primary)'}}>Find someone to learn from!</Link></p>
              </div>
            ) : upcomingSessions.map(s => (
              <div key={s._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:42,height:42,background:'var(--primary-light)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>📅</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:15}}>{s.skillToLearn}</div>
                    <div style={{color:'var(--text-light)',fontSize:13}}>with {s.provider?.firstName} {s.provider?.lastName}</div>
                  </div>
                </div>
                <span className={`badge ${s.sessionType === 'paid' ? 'badge-warning' : 'badge-primary'}`}>
                  {s.sessionType === 'paid' ? 'Paid' : 'Exchange'}
                </span>
              </div>
            ))}
          </div>

          {/* Recommended Skills */}
          <div className="card" style={{padding:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontSize:18}}>📈 Recommended for You</h3>
              <Link to="/explore" style={{color:'var(--primary)',fontSize:14,fontWeight:600}}>See More</Link>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              {recommended.map(u => (
                <Link to={`/profile/${u._id}`} key={u._id} className="card" style={{padding:16,display:'block'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:13,fontFamily:'var(--font-display)',flexShrink:0}}>
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{u.firstName} {u.lastName}</div>
                      <div style={{fontSize:11,color:'#F5A623'}}>⭐ {u.rating || 'New'}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {u.skillsOffered?.slice(0,2).map(s => (
                      <span key={s._id} className="badge badge-primary" style={{fontSize:11}}>{s.name}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Notifications */}
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,marginBottom:16}}>🔔 Notifications</h3>
            {[{msg:'Your profile is live! Start exploring',time:'Just now'},{msg:'Complete your profile for better matches',time:'2 min ago'}].map((n,i)=>(
              <div key={i} style={{padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:13,color:'var(--text-mid)'}}>{n.msg}<div style={{color:'var(--text-light)',fontSize:11,marginTop:3}}>{n.time}</div></div>
            ))}
          </div>
          {/* Daily Goal */}
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,marginBottom:16}}>🎯 Daily Goal</h3>
            <p style={{fontSize:13,color:'var(--text-mid)',marginBottom:12}}>Complete 1 learning session today</p>
            <div style={{background:'var(--border)',borderRadius:100,height:8,marginBottom:8}}>
              <div style={{background:'linear-gradient(90deg,var(--primary),var(--accent))',height:8,borderRadius:100,width:'60%',transition:'width 1s ease'}}/>
            </div>
            <p style={{fontSize:12,color:'var(--text-light)'}}>60% Complete</p>
          </div>
          {/* My Skills */}
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,marginBottom:16}}>🎓 My Skills</h3>
            {user?.skillsOffered?.slice(0,3).map(s=>(
              <div key={s._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:600}}>{s.name}</span>
                <span className="badge badge-primary" style={{fontSize:11}}>{s.level}</span>
              </div>
            ))}
            {(!user?.skillsOffered || user.skillsOffered.length === 0) && (
              <Link to="/profile/edit" style={{color:'var(--primary)',fontSize:13}}>+ Add your skills</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
