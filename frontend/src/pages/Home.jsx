import { Link } from 'react-router-dom';

const categories = [
  { name: 'Web Development', icon: '💻', learners: '1,234' },
  { name: 'Graphic Design', icon: '🎨', learners: '987' },
  { name: 'Photography', icon: '📷', learners: '756' },
  { name: 'Music Production', icon: '🎵', learners: '654' },
  { name: 'Cooking', icon: '🍳', learners: '543' },
  { name: 'Language Learning', icon: '🌍', learners: '432' },
];

const steps = [
  { num: '1', title: 'Create Your Profile', desc: 'Sign up and list the skills you want to teach and learn' },
  { num: '2', title: 'Find Your Match', desc: 'Browse and connect with people who have complementary skills' },
  { num: '3', title: 'Schedule Sessions', desc: 'Book convenient times for skill exchange or paid learning' },
  { num: '4', title: 'Learn & Grow', desc: 'Exchange knowledge and master new skills together' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{background:'linear-gradient(135deg, #6C47FF 0%, #5035CC 50%, #3B2A99 100%)',color:'#fff',padding:'100px 0 80px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)'}}/>
        <div className="container" style={{position:'relative'}}>
          <h1 style={{fontSize:'clamp(40px,6vw,72px)',fontWeight:800,marginBottom:20,lineHeight:1.1}}>
            Learn New Skills,<br/>Share Your Knowledge
          </h1>
          <p style={{fontSize:18,opacity:0.85,maxWidth:600,margin:'0 auto 40px',lineHeight:1.7}}>
            Join the largest community of skill sharers and learners. Exchange your expertise, connect with passionate teachers, and master the skills you've always wanted to learn.
          </p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" className="btn" style={{background:'#fff',color:'var(--primary)',fontSize:16,padding:'14px 32px'}}>
              Get Started Free →
            </Link>
            <Link to="/explore" className="btn" style={{background:'rgba(255,255,255,0.15)',color:'#fff',border:'2px solid rgba(255,255,255,0.3)',fontSize:16,padding:'14px 32px'}}>
              Explore Skills
            </Link>
          </div>
          <div style={{display:'flex',gap:48,justifyContent:'center',marginTop:60,flexWrap:'wrap'}}>
            {[['50K+','Active Users'],['500+','Skills Available'],['100K+','Sessions Completed']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontSize:32,fontWeight:800,fontFamily:'var(--font-display)'}}>{n}</div>
                <div style={{opacity:0.7,fontSize:14}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section style={{padding:'80px 0',background:'var(--bg-white)'}}>
        <div className="container">
          <h2 style={{textAlign:'center',fontSize:36,marginBottom:8}}>Popular Skills</h2>
          <p style={{textAlign:'center',color:'var(--text-light)',marginBottom:48}}>Discover what others are learning</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
            {categories.map(cat => (
              <Link to="/explore" key={cat.name} className="card" style={{padding:'20px 24px',display:'flex',alignItems:'center',gap:16,cursor:'pointer'}}>
                <div style={{width:48,height:48,borderRadius:12,background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{cat.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:2}}>{cat.name}</div>
                  <div style={{color:'var(--text-light)',fontSize:13}}>{cat.learners} learners</div>
                </div>
                <span style={{color:'var(--primary)',fontSize:20}}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{padding:'80px 0',background:'var(--bg)'}}>
        <div className="container">
          <h2 style={{textAlign:'center',fontSize:36,marginBottom:8}}>How Skill Exchange Works</h2>
          <p style={{textAlign:'center',color:'var(--text-light)',marginBottom:64}}>Start learning in just a few simple steps</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:32}}>
            {steps.map(s => (
              <div key={s.num} style={{textAlign:'center'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',color:'#fff',fontWeight:800,fontSize:24,fontFamily:'var(--font-display)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 24px rgba(108,71,255,0.3)'}}>{s.num}</div>
                <h3 style={{fontSize:18,marginBottom:10}}>{s.title}</h3>
                <p style={{color:'var(--text-light)',fontSize:14,lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section style={{padding:'80px 0',background:'var(--bg-white)'}}>
        <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
          <div>
            <h2 style={{fontSize:36,marginBottom:24}}>Why Choose Skill Bridge?</h2>
            {['Learn from real experts in their field','Flexible scheduling that fits your lifestyle','Exchange skills or book paid sessions','Safe and secure platform','Join a supportive learning community'].map(f=>(
              <div key={f} style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <span style={{color:'var(--accent)',fontSize:20}}>✓</span>
                <span style={{color:'var(--text-mid)',fontSize:16}}>{f}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:40,background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',color:'#fff',border:'none'}}>
            <h3 style={{fontSize:24,marginBottom:12}}>Ready to start your learning journey?</h3>
            <p style={{opacity:0.85,marginBottom:28}}>Join thousands of learners and teachers sharing knowledge every day.</p>
            <Link to="/register" className="btn" style={{background:'#fff',color:'var(--primary)',fontSize:15}}>Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:'#0D0D2B',color:'rgba(255,255,255,0.7)',padding:'48px 0 32px'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:48,marginBottom:40}}>
            <div>
              <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:20,color:'#fff',marginBottom:12}}>📚 Skill Bridge</div>
              <p style={{fontSize:14,lineHeight:1.7}}>Connecting learners and teachers worldwide.</p>
            </div>
            {[['Platform',['Explore Skills','How It Works','Pricing','Success Stories']],['Support',['Help Center','Safety Guidelines','Terms of Service','Privacy Policy']],['Connect',['contact@skillbridge.com','Twitter','Facebook','LinkedIn']]].map(([title,items])=>(
              <div key={title}>
                <div style={{color:'#fff',fontWeight:700,marginBottom:16}}>{title}</div>
                {items.map(i=><div key={i} style={{fontSize:14,marginBottom:10,cursor:'pointer'}}>{i}</div>)}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:24,textAlign:'center',fontSize:13}}>
            © 2024 Skill Bridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
