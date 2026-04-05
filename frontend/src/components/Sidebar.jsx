import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/explore', icon: '🔍', label: 'Explore Skills' },
  { to: '/messages', icon: '💬', label: 'Messages' },
  { to: '/sessions', icon: '📅', label: 'Sessions' },
  { to: '/profile/edit', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';

  return (
    <aside style={{background:'var(--bg-white)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',padding:'0',minHeight:'100vh',position:'sticky',top:0,height:'100vh',overflow:'hidden'}}>
      <div style={{padding:'20px 20px 16px',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,fontFamily:'var(--font-display)',fontWeight:800,fontSize:18,color:'var(--primary)',marginBottom:20}}>
          <span style={{fontSize:22}}>📚</span> Skill Bridge
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14,fontFamily:'var(--font-display)',flexShrink:0}}>
            {user?.avatar ? <img src={user.avatar} alt="avatar" style={{width:40,height:40,borderRadius:'50%',objectFit:'cover'}} /> : initials}
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:'var(--font-display)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.firstName} {user?.lastName}</div>
            <div style={{fontSize:12,color:'var(--text-light)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:'12px 12px',display:'flex',flexDirection:'column',gap:4}}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            style={({isActive}) => ({
              display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:'var(--radius-sm)',
              fontWeight:600,fontSize:14,
              background: isActive ? 'var(--primary-light)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-mid)',
              transition:'all 0.2s'
            })}>
            <span style={{fontSize:18}}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/admin"
            style={({isActive}) => ({
              display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:'var(--radius-sm)',
              fontWeight:600,fontSize:14,
              background: isActive ? '#FFF8E7' : 'transparent',
              color: isActive ? '#D4920D' : 'var(--text-mid)',
              transition:'all 0.2s'
            })}>
            <span style={{fontSize:18}}>⚙️</span> Admin Panel
          </NavLink>
        )}
      </nav>
      <div style={{padding:'12px',borderTop:'1px solid var(--border)'}}>
        <button onClick={handleLogout}
          style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:'var(--radius-sm)',fontWeight:600,fontSize:14,color:'var(--secondary)',background:'transparent',cursor:'pointer',border:'none',transition:'all 0.2s'}}
          onMouseEnter={e => e.currentTarget.style.background='#FFECEC'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <span style={{fontSize:18}}>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
