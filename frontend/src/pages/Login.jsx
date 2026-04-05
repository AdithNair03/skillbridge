import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div style={{minHeight:'calc(100vh - 64px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div className="card" style={{width:'100%',maxWidth:480,padding:48}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:40,marginBottom:12}}>📚</div>
          <h2 style={{fontSize:28,marginBottom:8}}>Welcome Back</h2>
          <p style={{color:'var(--text-light)'}}>Login to continue your learning journey</p>
        </div>
        {error && <div style={{background:'#FFECEC',color:'#D43535',padding:'12px 16px',borderRadius:'var(--radius-sm)',marginBottom:20,fontSize:14}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Email Address</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <label style={{fontWeight:600,fontSize:14}}>Password</label>
              <span style={{color:'var(--primary)',fontSize:14,cursor:'pointer'}}>Forgot password?</span>
            </div>
            <input className="input" type="password" placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:16}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:24,color:'var(--text-light)',fontSize:14}}>
          Don't have an account? <Link to="/register" style={{color:'var(--primary)',fontWeight:600}}>Sign up for free</Link>
        </p>
        <div style={{display:'flex',alignItems:'center',gap:16,margin:'24px 0'}}>
          <hr style={{flex:1,border:'none',borderTop:'1px solid var(--border)'}} />
          <span style={{color:'var(--text-light)',fontSize:13}}>Or continue with</span>
          <hr style={{flex:1,border:'none',borderTop:'1px solid var(--border)'}} />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {['🔵 Google','⚫ GitHub'].map(p=>(
            <button key={p} className="btn btn-outline" style={{justifyContent:'center',fontSize:14,padding:'12px'}}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
