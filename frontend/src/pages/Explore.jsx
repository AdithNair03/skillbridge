import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api';

const CATEGORIES = ['All','Technology','Design','Language','Music','Art','Cooking','Health','Business','Other'];
const LEVELS = ['All Levels','Beginner','Intermediate','Advanced','Expert'];

export default function Explore() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getUsers({ search, level: level !== 'All Levels' ? level : '' });
        setUsers(data);
      } catch(e) {} finally { setLoading(false); }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, level]);

  const filtered = [...users].sort((a,b) => sortBy === 'rating' ? (b.rating||0)-(a.rating||0) : (b.totalSessions||0)-(a.totalSessions||0));

  return (
    <div style={{padding:32}} className="animate-fade">
      <h2 style={{fontSize:32,marginBottom:8}}>Explore Skills</h2>
      <p style={{color:'var(--text-light)',marginBottom:28}}>Find skilled people to learn from or exchange knowledge with</p>

      {/* Search bar */}
      <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:280,position:'relative'}}>
          <input className="input" placeholder="Search for any skill..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:44}} />
          <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-light)',fontSize:18}}>🔍</span>
        </div>
        <button className="btn btn-primary" style={{padding:'12px 24px'}}>Search</button>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{color:'var(--text-light)',fontSize:14}}>▼ Filters:</span>
        <select className="input" value={level} onChange={e=>setLevel(e.target.value)} style={{width:'auto',padding:'10px 16px'}}>
          {LEVELS.map(l=><option key={l}>{l}</option>)}
        </select>
        <select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:'auto',padding:'10px 16px',marginLeft:'auto'}}>
          <option value="rating">Highest Rated</option>
          <option value="sessions">Most Sessions</option>
        </select>
      </div>

      <p style={{color:'var(--text-light)',fontSize:14,marginBottom:20}}>{filtered.length} results found</p>

      {loading ? (
        <div className="page-loader"><div className="spinner"/></div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:20}}>
          {filtered.map(u => (
            <div key={u._id} className="card" style={{padding:24}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:18,fontFamily:'var(--font-display)',flexShrink:0}}>
                  {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                    <span style={{fontWeight:800,fontSize:16,fontFamily:'var(--font-display)'}}>{u.firstName} {u.lastName}</span>
                    {u.isVerified && <span className="badge badge-success" style={{fontSize:11}}>✓ Verified</span>}
                  </div>
                  <div style={{color:'var(--text-light)',fontSize:13}}>{u.location || 'Remote'}</div>
                  <div style={{color:'#F5A623',fontSize:13,marginTop:2}}>⭐ {u.rating || 'New'} {u.reviewsCount > 0 && `(${u.reviewsCount})`}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  {u.hourlyRate > 0
                    ? <div style={{color:'var(--primary)',fontWeight:700,fontSize:15}}>${u.hourlyRate}/hr</div>
                    : <div style={{color:'var(--accent)',fontWeight:700,fontSize:13}}>Exchange</div>
                  }
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:12,color:'var(--text-light)',marginBottom:8}}>SKILLS OFFERED</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {u.skillsOffered?.slice(0,3).map(s=>(
                    <span key={s._id} className="badge badge-primary" style={{fontSize:12}}>{s.name} · {s.level}</span>
                  ))}
                </div>
              </div>

              {u.skillsWanted?.length > 0 && (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'var(--text-light)',marginBottom:8}}>WANTS TO LEARN</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {u.skillsWanted.slice(0,2).map(s=>(
                      <span key={s._id} style={{background:'#F0FFF9',color:'#1B8856',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <Link to={`/profile/${u._id}`} className="btn btn-outline" style={{justifyContent:'center',padding:'10px',fontSize:14}}>View Profile</Link>
                <Link to={`/request-session/${u._id}`} className="btn btn-primary" style={{justifyContent:'center',padding:'10px',fontSize:14}}>Request Session</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px 0',color:'var(--text-light)'}}>
              <div style={{fontSize:48,marginBottom:16}}>🔍</div>
              <h3>No results found</h3>
              <p>Try different search terms or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
