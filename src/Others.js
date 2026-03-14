import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Footer from './Footer';

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);
const InboxIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
  .am-card { background:#fff; border-radius:18px; overflow:hidden; border:1.5px solid #E5E7EB; display:flex; flex-direction:column; transition:transform 0.26s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.26s ease,border-color 0.26s ease; }
  .am-card:hover { transform:translateY(-6px); }
  .am-btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; width:100%; padding:10px 18px; border-radius:10px; font-weight:600; font-size:13.5px; border:none; cursor:pointer; text-decoration:none; color:white; background:linear-gradient(135deg,#F59E0B,#D97706); transition:filter 0.2s,transform 0.15s; }
  .am-btn:hover { filter:brightness(1.1); transform:translateY(-2px); }
  .am-btn:active { transform:translateY(0); }
  .am-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:20px; }
  @media(max-width:580px){.am-grid{grid-template-columns:1fr;}}
  .back-btn:hover { background:#FEF3C7 !important; }
`;

const Other = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, 'documents'), where('category', '==', 'Other'));
        const snap = await getDocs(q);
        setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ display:'flex',flexDirection:'column',minHeight:'100vh',backgroundColor:'#F3F4F6' }}>
      <style>{STYLES}</style>

      <header style={{ background:'white',borderBottom:'1px solid #E5E7EB',position:'sticky',top:0,zIndex:10 }}>
        <div style={{ height:4,background:'linear-gradient(90deg,#FBBF24,#F59E0B,#D97706)' }} />
        <div style={{ padding:'15px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:1280,margin:'0 auto',flexWrap:'wrap',gap:12 }}>
          <div style={{ display:'flex',alignItems:'center',gap:14 }}>
            <button className="back-btn" onClick={()=>navigate('/Documents')} style={{ display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:9,background:'#FFFBEB',border:'1.5px solid #FDE68A',color:'#92400E',fontSize:13,fontWeight:600,cursor:'pointer',transition:'background .2s' }}>
              <BackIcon /> Back
            </button>
            <div style={{ width:46,height:46,borderRadius:13,background:'linear-gradient(135deg,#FBBF24,#D97706)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(245,158,11,0.38)',flexShrink:0 }}><FileIcon /></div>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:'#111827',margin:0,lineHeight:1.2 }}>Other Resources</h1>
              <p style={{ fontSize:13,color:'#9CA3AF',margin:'3px 0 0',fontWeight:400 }}>Additional study materials</p>
            </div>
          </div>
          {!loading && documents.length > 0 && (
            <div style={{ display:'flex',alignItems:'center',gap:7,background:'#111827',borderRadius:10,padding:'9px 16px' }}>
              <FileIcon /><span style={{ fontSize:13.5,color:'white',fontWeight:600 }}>{documents.length} {documents.length===1?'document':'documents'}</span>
            </div>
          )}
        </div>
      </header>

      <main style={{ flexGrow:1,padding:'30px 32px',maxWidth:1280,margin:'0 auto',width:'100%' }}>
        {loading && (
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 0',gap:16 }}>
            <SpinnerIcon /><p style={{ fontSize:14,color:'#9CA3AF',margin:0 }}>Loading documents…</p>
          </div>
        )}
        {!loading && documents.length === 0 && (
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 0',gap:14 }}>
            <div style={{ width:72,height:72,borderRadius:20,background:'linear-gradient(135deg,#FBBF24,#D97706)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(245,158,11,0.3)' }}><InboxIcon /></div>
            <p style={{ fontSize:15,color:'#374151',margin:0,fontWeight:600 }}>No documents yet</p>
            <p style={{ fontSize:13,color:'#9CA3AF',margin:0 }}>Check back later for new resources.</p>
          </div>
        )}
        {!loading && documents.length > 0 && (
          <div className="am-grid">
            {documents.map(doc => {
              const isH = hoveredId === doc.id;
              return (
                <div key={doc.id} className="am-card" style={{ borderColor:isH?'#F59E0B':'#E5E7EB',boxShadow:isH?'0 20px 52px rgba(245,158,11,0.22)':'0 2px 8px rgba(0,0,0,0.06)' }} onMouseEnter={()=>setHoveredId(doc.id)} onMouseLeave={()=>setHoveredId(null)}>
                  <div style={{ height:190,background:'#FFFBEB',borderBottom:'1px solid #E5E7EB',overflow:'hidden',position:'relative' }}>
                    <iframe src={doc.fileUrl} title={doc.title} style={{ width:'100%',height:'100%',border:'none',pointerEvents:'none' }} />
                    <div style={{ position:'absolute',inset:0 }} />
                  </div>
                  <div style={{ padding:'16px 18px 18px',display:'flex',flexDirection:'column',flexGrow:1 }}>
                    <div style={{ display:'flex',alignItems:'flex-start',gap:10,marginBottom:14 }}>
                      <div style={{ width:36,height:36,borderRadius:9,background:'linear-gradient(135deg,#FBBF24,#D97706)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 3px 10px rgba(245,158,11,0.28)',transition:'transform 0.2s',transform:isH?'scale(1.08)':'scale(1)' }}><FileIcon /></div>
                      <div style={{ minWidth:0 }}>
                        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15.5,fontWeight:700,color:'#111827',margin:'0 0 3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{doc.title}</h3>
                        <p style={{ fontSize:12,color:'#9CA3AF',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{doc.fileName}</p>
                      </div>
                    </div>
                    <div style={{ flexGrow:1 }} />
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="am-btn"><ExternalLinkIcon /> View Full PDF</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Other;
