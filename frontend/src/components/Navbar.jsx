import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav style={{background:'#fff',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 12px rgba(108,71,255,0.06)'}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:10,fontFamily:'var(--font-display)',fontWeight:800,fontSize:20,color:'var(--primary)'}}>
          <span style={{fontSize:24}}>📚</span> Skill Bridge
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:32}}>
          <Link to="/" style={{color:'var(--text-mid)',fontWeight:500,fontSize:15}}>Home</Link>
          <Link to="/explore" style={{color:'var(--text-mid)',fontWeight:500,fontSize:15}}>Explore Skills</Link>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{padding:'10px 20px'}}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{color:'var(--text-mid)',fontWeight:500,fontSize:15}}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{padding:'10px 20px'}}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
