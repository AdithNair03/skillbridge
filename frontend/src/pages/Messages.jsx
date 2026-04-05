import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConversations, getMessages, sendMessage } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    getConversations().then(r => setConversations(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  useEffect(() => {
    if (userId) loadMessages(userId);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (uid) => {
    try {
      const { data } = await getMessages(uid);
      setMessages(data);
      const conv = conversations.find(c => c.user._id === uid);
      if (conv) setActiveUser(conv.user);
    } catch(e) {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    try {
      const { data } = await sendMessage(userId, { content: text });
      setMessages(prev => [...prev, data]);
      setText('');
      getConversations().then(r => setConversations(r.data));
    } catch(e) {}
  };

  const initials = (u) => u ? `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}` : '?';

  return (
    <div style={{display:'grid',gridTemplateColumns:'300px 1fr',height:'calc(100vh - 0px)',overflow:'hidden'}} className="animate-fade">
      {/* Conversations list */}
      <div style={{borderRight:'1px solid var(--border)',background:'var(--bg-white)',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'24px 20px 16px',borderBottom:'1px solid var(--border)'}}>
          <h3 style={{fontSize:20,marginBottom:16}}>💬 Messages</h3>
          <input className="input" placeholder="Search conversations..." style={{fontSize:13}} />
        </div>
        <div style={{flex:1,overflow:'auto'}}>
          {loading ? <div style={{padding:20,color:'var(--text-light)',textAlign:'center'}}>Loading...</div> :
          conversations.length === 0 ? (
            <div style={{padding:32,textAlign:'center',color:'var(--text-light)'}}>
              <div style={{fontSize:32,marginBottom:8}}>💬</div>
              <p style={{fontSize:13}}>No conversations yet</p>
              <Link to="/explore" style={{color:'var(--primary)',fontSize:13}}>Find someone to message</Link>
            </div>
          ) : conversations.map(c => (
            <Link to={`/messages/${c.user._id}`} key={c.user._id}
              style={{display:'block',padding:'14px 20px',borderBottom:'1px solid var(--border)',background: userId === c.user._id ? 'var(--primary-light)' : 'transparent', transition:'background 0.2s'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14,flexShrink:0}}>
                  {initials(c.user)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontWeight:700,fontSize:14}}>{c.user.firstName} {c.user.lastName}</span>
                    <span style={{fontSize:11,color:'var(--text-light)'}}>{new Date(c.lastMessage?.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                  <div style={{color:'var(--text-light)',fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {c.lastMessage?.content}
                  </div>
                </div>
                {c.unreadCount > 0 && <div style={{width:20,height:20,borderRadius:'50%',background:'var(--primary)',color:'#fff',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{c.unreadCount}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {userId ? (
        <div style={{display:'flex',flexDirection:'column',background:'var(--bg)'}}>
          <div style={{background:'var(--bg-white)',borderBottom:'1px solid var(--border)',padding:'16px 24px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>
              {initials(activeUser)}
            </div>
            <div>
              <div style={{fontWeight:700}}>{activeUser?.firstName} {activeUser?.lastName}</div>
              <div style={{color:'var(--accent)',fontSize:12}}>● Online</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',gap:12}}>
              <Link to={`/request-session/${userId}`} style={{color:'var(--primary)',fontSize:22}}>📅</Link>
              <Link to={`/profile/${userId}`} style={{color:'var(--primary)',fontSize:22}}>👤</Link>
            </div>
          </div>

          <div style={{flex:1,overflow:'auto',padding:'20px 24px',display:'flex',flexDirection:'column',gap:12}}>
            {messages.map(msg => {
              const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
              return (
                <div key={msg._id} style={{display:'flex',justifyContent: isMe ? 'flex-end' : 'flex-start'}}>
                  {!isMe && <div style={{width:32,height:32,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'var(--primary)',marginRight:10,flexShrink:0}}>
                    {initials(msg.sender)}
                  </div>}
                  <div style={{maxWidth:'65%'}}>
                    <div style={{background: isMe ? 'linear-gradient(135deg,var(--primary),var(--primary-dark))' : 'var(--bg-white)',color: isMe ? '#fff' : 'var(--text-dark)',padding:'12px 16px',borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',fontSize:14,lineHeight:1.5,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      {msg.content}
                    </div>
                    <div style={{fontSize:11,color:'var(--text-light)',marginTop:4,textAlign: isMe ? 'right' : 'left'}}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} style={{background:'var(--bg-white)',borderTop:'1px solid var(--border)',padding:'16px 24px',display:'flex',gap:12,alignItems:'center'}}>
            <input className="input" placeholder="Type your message..." value={text} onChange={e=>setText(e.target.value)} style={{flex:1}} />
            <button type="submit" className="btn btn-primary" style={{padding:'12px 20px',flexShrink:0}}>➤</button>
          </form>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'var(--text-light)'}}>
          <div style={{fontSize:56,marginBottom:16}}>💬</div>
          <h3 style={{marginBottom:8}}>Select a conversation</h3>
          <p style={{fontSize:14}}>Choose a conversation from the left to start chatting</p>
        </div>
      )}
    </div>
  );
}
