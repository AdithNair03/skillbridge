import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', skillsOffered:'', skillsWanted:'' });
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return setError('Please agree to the Terms of Service');
    setError('');
    const result = await register(form);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div style={{minHeight:'calc(100vh - 64px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div className="card" style={{width:'100%',maxWidth:600,padding:48}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:40,marginBottom:12}}>📚</div>
          <h2 style={{fontSize:28,marginBottom:8}}>Create Your Account</h2>
          <p style={{color:'var(--text-light)'}}>Join our community of learners and teachers</p>
        </div>
        {error && <div style={{background:'#FFECEC',color:'#D43535',padding:'12px 16px',borderRadius:'var(--radius-sm)',marginBottom:20,fontSize:14}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>First Name</label>
              <input className="input" placeholder="John" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required />
            </div>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Last Name</label>
              <input className="input" placeholder="Doe" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required />
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Email Address</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Password</label>
            <input className="input" type="password" placeholder="Create a strong password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <div style={{marginBottom:8}}>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Skills I Know</label>
            <textarea className="input" rows={2} placeholder="e.g., Web Development, Photography, Spanish" value={form.skillsOffered} onChange={e=>setForm({...form,skillsOffered:e.target.value})} style={{resize:'none'}} />
            <p style={{fontSize:12,color:'var(--text-light)',marginTop:4}}>Separate skills with commas</p>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Skills I Want to Learn</label>
            <textarea className="input" rows={2} placeholder="e.g., Graphic Design, Video Editing, French" value={form.skillsWanted} onChange={e=>setForm({...form,skillsWanted:e.target.value})} style={{resize:'none'}} />
            <p style={{fontSize:12,color:'var(--text-light)',marginTop:4}}>Separate skills with commas</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
            <input type="checkbox" id="agree" checked={agree} onChange={e=>setAgree(e.target.checked)} style={{width:16,height:16,accentColor:'var(--primary)'}} />
            <label htmlFor="agree" style={{fontSize:14,color:'var(--text-mid)'}}>
              I agree to the <span style={{color:'var(--primary)',cursor:'pointer'}}>Terms of Service</span> and <span style={{color:'var(--primary)',cursor:'pointer'}}>Privacy Policy</span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:14,fontSize:16}} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:24,color:'var(--text-light)',fontSize:14}}>
          Already have an account? <Link to="/login" style={{color:'var(--primary)',fontWeight:600}}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
