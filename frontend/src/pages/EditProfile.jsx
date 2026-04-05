import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, addSkillOffer, addSkillWant, deleteSkill } from '../api';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    bio: user?.bio || '', location: user?.location || '', hourlyRate: user?.hourlyRate || 0, avatar: user?.avatar || ''
  });
  const [newSkillOffer, setNewSkillOffer] = useState({ name:'', level:'Beginner', category:'' });
  const [newSkillWant, setNewSkillWant] = useState({ name:'', level:'Beginner', category:'' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [skills, setSkills] = useState({ offered: user?.skillsOffered || [], wanted: user?.skillsWanted || [] });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch(e) {} finally { setSaving(false); }
  };

  const handleAddSkill = async (type) => {
    const data = type === 'offer' ? newSkillOffer : newSkillWant;
    if (!data.name.trim()) return;
    try {
      const fn = type === 'offer' ? addSkillOffer : addSkillWant;
      const { data: updated } = await fn(data);
      setSkills(prev => ({ ...prev, [type === 'offer' ? 'offered' : 'wanted']: updated }));
      type === 'offer' ? setNewSkillOffer({ name:'', level:'Beginner', category:'' }) : setNewSkillWant({ name:'', level:'Beginner', category:'' });
    } catch(e) {}
  };

  const handleDeleteSkill = async (type, skillId) => {
    try {
      await deleteSkill(type, skillId);
      setSkills(prev => ({
        ...prev,
        [type === 'offer' ? 'offered' : 'wanted']: prev[type === 'offer' ? 'offered' : 'wanted'].filter(s => s._id !== skillId)
      }));
    } catch(e) {}
  };

  return (
    <div style={{padding:32,maxWidth:860}} className="animate-fade">
      <h2 style={{fontSize:28,marginBottom:24}}>✏️ Edit Profile</h2>
      {success && <div style={{background:'#E8FAF3',color:'#1B8856',padding:'12px 16px',borderRadius:'var(--radius-sm)',marginBottom:20,fontSize:14,fontWeight:600}}>{success}</div>}
      
      <form onSubmit={handleSave}>
        <div className="card" style={{padding:28,marginBottom:20}}>
          <h3 style={{fontSize:16,marginBottom:20}}>Basic Information</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>First Name</label>
              <input className="input" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} />
            </div>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Last Name</label>
              <input className="input" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} />
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Bio</label>
            <textarea className="input" rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell others about yourself..." style={{resize:'vertical'}} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Location</label>
              <input className="input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="City, Country" />
            </div>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Hourly Rate (USD) — 0 for Exchange only</label>
              <input className="input" type="number" min={0} value={form.hourlyRate} onChange={e=>setForm({...form,hourlyRate:Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <label style={{display:'block',fontWeight:600,marginBottom:8,fontSize:14}}>Avatar URL (optional)</label>
            <input className="input" value={form.avatar} onChange={e=>setForm({...form,avatar:e.target.value})} placeholder="https://..." />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{marginBottom:24}} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Profile'}
        </button>
      </form>

      {/* Skills Management */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {[
          { type:'offer', label:'Skills I Offer', list: skills.offered, newSkill: newSkillOffer, setNew: setNewSkillOffer },
          { type:'want', label:'Skills I Want to Learn', list: skills.wanted, newSkill: newSkillWant, setNew: setNewSkillWant },
        ].map(({ type, label, list, newSkill, setNew }) => (
          <div key={type} className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,marginBottom:16}}>{type==='offer'?'🎓':'📚'} {label}</h3>
            {list.map(s => (
              <div key={s._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <span style={{fontWeight:600,fontSize:14}}>{s.name}</span>
                  <span className="badge badge-primary" style={{marginLeft:8,fontSize:11}}>{s.level}</span>
                </div>
                <button onClick={()=>handleDeleteSkill(type, s._id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--secondary)',fontSize:18,padding:4}}>✕</button>
              </div>
            ))}
            <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
              <input className="input" placeholder="Skill name" value={newSkill.name} onChange={e=>setNew({...newSkill,name:e.target.value})} style={{fontSize:13}} />
              <select className="input" value={newSkill.level} onChange={e=>setNew({...newSkill,level:e.target.value})} style={{fontSize:13}}>
                {['Beginner','Intermediate','Advanced','Expert'].map(l=><option key={l}>{l}</option>)}
              </select>
              <button onClick={()=>handleAddSkill(type)} className="btn btn-outline" style={{justifyContent:'center',fontSize:13,padding:'10px'}}>+ Add Skill</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
