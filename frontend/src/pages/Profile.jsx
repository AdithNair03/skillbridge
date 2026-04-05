import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, getUserReviews } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('skills');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, r] = await Promise.all([getUserById(id), getUserReviews(id)]);
        setProfile(p.data); setReviews(r.data);
      } catch(e) {} finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner"/></div>;
  if (!profile) return <div style={{padding:32}}>User not found</div>;

  const isMe = me?._id === id;
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`;

  return (
    <div style={{padding:32}} className="animate-fade">
      {/* Header Card */}
      <div className="card" style={{padding:32,marginBottom:24}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:20,flexWrap:'wrap'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:28,fontFamily:'var(--font-display)',flexShrink:0}}>
            {initials}
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:6}}>
              <h2 style={{fontSize:26}}>{profile.firstName} {profile.lastName}</h2>
              {profile.isVerified && <span className="badge badge-success">✓ Verified</span>}
              {profile.isTopRated && <span className="badge badge-warning">⭐ Top Rated</span>}
              {profile.isPro && <span className="badge badge-primary">Pro Member</span>}
            </div>
            <div style={{color:'var(--text-light)',fontSize:14,marginBottom:6}}>
              {profile.location && `📍 ${profile.location} · `}📅 Member since {new Date(profile.memberSince).getFullYear()}
            </div>
            <div style={{color:'#F5A623',fontSize:14,marginBottom:10}}>
              ⭐ {profile.rating || 'New'} {profile.reviewsCount > 0 && `(${profile.reviewsCount} reviews)`}
            </div>
            {profile.bio && <p style={{color:'var(--text-mid)',fontSize:14,maxWidth:600,lineHeight:1.7}}>{profile.bio}</p>}
          </div>
          <div style={{display:'flex',gap:12,flexShrink:0}}>
            {!isMe && (
              <>
                <Link to={`/request-session/${id}`} className="btn btn-primary" style={{padding:'10px 20px',fontSize:14}}>📅 Request Session</Link>
                <Link to={`/messages/${id}`} className="btn btn-outline" style={{padding:'10px 20px',fontSize:14}}>💬 Message</Link>
              </>
            )}
            {isMe && <Link to="/profile/edit" className="btn btn-outline" style={{padding:'10px 20px',fontSize:14}}>✏️ Edit Profile</Link>}
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:28,paddingTop:24,borderTop:'1px solid var(--border)'}}>
          {[
            ['📅', profile.totalSessions || 0, 'Total Sessions'],
            ['👥', profile.totalStudents || 0, 'Total Students'],
            ['⏰', profile.responseTime || '< 24 hrs', 'Response Time'],
            ['🏆', `${profile.successRate || 100}%`, 'Success Rate'],
          ].map(([icon, val, label]) => (
            <div key={label} style={{textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:4}}>{icon}</div>
              <div style={{fontWeight:800,fontSize:22,fontFamily:'var(--font-display)',color:'var(--primary)'}}>{val}</div>
              <div style={{fontSize:12,color:'var(--text-light)'}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:0,borderBottom:'2px solid var(--border)',marginBottom:24}}>
        {['skills','reviews','about'].map(t => (
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:'12px 24px',background:'none',border:'none',fontWeight:600,fontSize:14,cursor:'pointer',
              color: tab===t ? 'var(--primary)' : 'var(--text-light)',
              borderBottom: tab===t ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom:-2,textTransform:'capitalize',transition:'all 0.2s'}}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'skills' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,marginBottom:16,color:'var(--primary)'}}>🎓 Skills I Offer</h3>
            {profile.skillsOffered?.map(s => (
              <div key={s._id} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{s.name}</div>
                  {s.studentsCount > 0 && <div style={{color:'var(--text-light)',fontSize:12}}>Taught {s.studentsCount} students</div>}
                </div>
                <span className="badge badge-primary">{s.level}</span>
              </div>
            ))}
            {(!profile.skillsOffered || profile.skillsOffered.length === 0) && <p style={{color:'var(--text-light)',fontSize:14}}>No skills listed yet</p>}
          </div>
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,marginBottom:16,color:'var(--accent)'}}>📚 Skills I Want to Learn</h3>
            {profile.skillsWanted?.map(s => (
              <div key={s._id} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{fontWeight:700,fontSize:14}}>{s.name}</div>
                <span style={{background:'#E8FAF3',color:'#1B8856',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{s.level}</span>
              </div>
            ))}
            {(!profile.skillsWanted || profile.skillsWanted.length === 0) && <p style={{color:'var(--text-light)',fontSize:14}}>No learning goals listed yet</p>}
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {reviews.map(r => (
            <div key={r._id} className="card" style={{padding:24}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,color:'var(--primary)'}}>
                    {r.reviewer?.firstName?.[0]}{r.reviewer?.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{r.reviewer?.firstName} {r.reviewer?.lastName}</div>
                    <div style={{color:'#F5A623',fontSize:14}}>{'⭐'.repeat(r.rating)}</div>
                  </div>
                </div>
                <div style={{color:'var(--text-light)',fontSize:12}}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <p style={{color:'var(--text-mid)',fontSize:14,lineHeight:1.6}}>{r.comment}</p>
              {r.skillTaught && <span className="badge badge-primary" style={{marginTop:10,fontSize:12}}>{r.skillTaught}</span>}
            </div>
          ))}
          {reviews.length === 0 && <div style={{textAlign:'center',padding:'48px 0',color:'var(--text-light)'}}>
            <div style={{fontSize:40,marginBottom:12}}>⭐</div><p>No reviews yet</p>
          </div>}
        </div>
      )}

      {tab === 'about' && (
        <div className="card" style={{padding:32}}>
          <h3 style={{fontSize:18,marginBottom:16}}>About {profile.firstName}</h3>
          <p style={{color:'var(--text-mid)',lineHeight:1.8}}>{profile.bio || 'No bio provided yet.'}</p>
          {profile.hourlyRate > 0 && (
            <div style={{marginTop:24,padding:20,background:'var(--primary-light)',borderRadius:'var(--radius-sm)'}}>
              <div style={{fontWeight:700,color:'var(--primary)',fontSize:16}}>💰 Hourly Rate: ${profile.hourlyRate}/hr</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
