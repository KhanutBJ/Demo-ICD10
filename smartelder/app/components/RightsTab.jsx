'use client';
import { useState, useRef } from 'react';
import { retrieveRelevant } from '../data/welfare-kb';

const GROQ_ASR_KEY = process.env.NEXT_PUBLIC_GROQ_ASR_KEY;
const GROQ_LLM_KEY = process.env.NEXT_PUBLIC_GROQ_LLM_KEY;

const QUICK_Q = [
  'ผ้าอ้อมผู้ใหญ่ฟรีได้กี่ชิ้น?',
  'ถูกปฏิเสธสิทธิ์ทำอย่างไร?',
  'ผู้ป่วย Stroke ได้สิทธิ์อะไรบ้าง?',
  'คะแนน ADL ≤ 6 ได้อะไรพิเศษ?',
  'Caregiver ได้เงินเดือนเท่าไร?',
];

export default function RightsTab() {
  const [msgs, setMsgs]       = useState([
    { role:'ai', text:'สวัสดีครับ 😊 ผมคือผู้ช่วย AI คุ้มครองสิทธิ์ผู้สูงอายุ\nถามได้เลยครับ — ข้อมูลของผมอ้างอิงจากฐานข้อมูลสิทธิ์ สปสช. และ กปท. โดยตรง' },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRec]   = useState(false);
  const [transcrib, setTrans] = useState(false);
  const [lastSources, setLastSources] = useState([]);
  const mrRef     = useRef(null);
  const chunksRef = useRef([]);
  const bottomRef = useRef(null);

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 80);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setMsgs(p => [...p, { role:'user', text }]);
    setInput('');
    setLoading(true);
    setLastSources([]);
    scroll();

    // ── RAG: retrieve relevant welfare docs ──────────────────
    const retrieved = retrieveRelevant(text);
    setLastSources(retrieved);

    const ragContext = retrieved.length > 0
      ? `\n\n[ข้อมูลอ้างอิงจากฐานข้อมูลสิทธิ์ PWL]\n${retrieved.map(d => `• ${d.title}: ${d.content}`).join('\n')}`
      : '';

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${GROQ_LLM_KEY}` },
        body: JSON.stringify({
          model:'qwen/qwen3-32b',
          messages:[
            {
              role:'system',
              content:`คุณคือ "PWL Rights Assistant" ผู้ช่วย AI คุ้มครองสิทธิ์ผู้สูงอายุไทย อ้างอิงข้อมูลจากฐานข้อมูลสิทธิ์ที่ให้มาเสมอ ตอบด้วยภาษาที่เข้าใจง่าย กระชับ ไม่เกิน 3 ประโยค ระบุตัวเลข (บาท/ชิ้น/วัน) ที่แน่นอนเสมอหากมีในข้อมูล ห้าม hallucinate ตัวเลขที่ไม่อยู่ในข้อมูลอ้างอิง หากถูกปฏิเสธสิทธิ์ให้แนะนำ สปสช. โทร 1330 ห้ามใช้ markdown หรือเครื่องหมายดอกจัน (*)${ragContext}`,
            },
            ...msgs.map(m => ({ role: m.role==='ai' ? 'assistant' : 'user', content: m.text })),
            { role:'user', content: text },
          ],
          temperature:0.3,
          max_tokens:2048,
        }),
      });
      const d = await res.json();
      const raw   = d.choices?.[0]?.message?.content || '';
      const reply = raw.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').replace(/\*/g, '').trim()
        || 'ขออภัย ไม่สามารถตอบได้ กรุณาลองถามใหม่อีกครั้ง';
      setMsgs(p => [...p, { role:'ai', text: reply, sources: retrieved }]);
    } catch {
      setMsgs(p => [...p, { role:'ai', text:'❌ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่' }]);
    } finally { setLoading(false); scroll(); }
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(stream, { mimeType:'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size>0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t=>t.stop());
        setTrans(true);
        try {
          const fd = new FormData();
          fd.append('file', new Blob(chunksRef.current,{type:'audio/webm'}), 'q.webm');
          fd.append('model','whisper-large-v3'); fd.append('language','th');
          const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions',{
            method:'POST', headers:{Authorization:`Bearer ${GROQ_ASR_KEY}`}, body:fd,
          });
          const d = await res.json();
          if (d.text) send(d.text);
        } catch {} finally { setTrans(false); }
      };
      mrRef.current = mr; mr.start(); setRec(true);
    } catch {}
  };
  const stopRec = () => { if (mrRef.current && recording) { mrRef.current.stop(); setRec(false); } };

  return (
    <div>
      {/* Banner */}
      <div style={{ borderRadius:20, padding:'16px 20px', marginBottom:16, background:'linear-gradient(135deg,#0a3d2e,#0F6E56,#17A97E)', display:'flex', alignItems:'center', gap:14, boxShadow:'0 6px 28px rgba(15,110,86,0.28)' }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>⚖️</div>
        <div>
          <p style={{ color:'white', fontWeight:800, fontSize:16 }}>PWL Rights Assistant</p>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13 }}>RAG-powered • อ้างอิงจากฐานข้อมูลสิทธิ์ สปสช./กปท./LTC โดยตรง</p>
        </div>
        <div style={{ marginLeft:'auto', padding:'5px 12px', borderRadius:10, background:'rgba(255,255,255,0.18)', color:'white', fontSize:11, fontWeight:700, flexShrink:0 }}>
          📚 KB: 11 แหล่ง
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {QUICK_Q.map((q,i) => (
          <button key={i} onClick={()=>send(q)} disabled={loading}
            className="touch-active"
            style={{ padding:'7px 14px', borderRadius:999, background:'white', border:'1.5px solid #D1E8DF', fontSize:12, fontWeight:600, color:'#4B7A6A', cursor:'pointer', transition:'all 0.18s' }}
            onMouseOver={e=>{ e.currentTarget.style.borderColor='#17A97E'; e.currentTarget.style.color='#0F6E56'; }}
            onMouseOut={e=>{ e.currentTarget.style.borderColor='#D1E8DF'; e.currentTarget.style.color='#4B7A6A'; }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="glass-card" style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:14, minHeight:360, maxHeight:480 }}>
          {msgs.map((m,i) => (
            <div key={i} className="anim-fade-up">
              <div style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start', gap:8 }}>
                {m.role==='ai' && (
                  <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, marginTop:2 }}>🤖</div>
                )}
                <div className={m.role==='user' ? 'bubble-user' : 'bubble-ai'}
                  style={{ maxWidth:'72%', padding:'11px 16px', fontSize:14, lineHeight:1.65, whiteSpace:'pre-wrap', boxShadow: m.role==='user' ? '0 3px 12px rgba(15,110,86,0.25)' : '0 2px 8px rgba(0,0,0,0.05)' }}>
                  {m.text}
                </div>
              </div>
              {/* Source badges */}
              {m.role==='ai' && m.sources?.length > 0 && (
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:6, marginLeft:40 }}>
                  {m.sources.map((s,j) => (
                    <span key={j} style={{ padding:'3px 10px', borderRadius:999, background:'#F0FDF9', border:'1px solid #A7D9C6', fontSize:11, color:'#0F6E56', fontWeight:600 }}>
                      📚 {s.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', gap:8 }} className="anim-fade-up">
              <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤖</div>
              <div className="bubble-ai" style={{ padding:'12px 18px', display:'flex', flexDirection:'column', gap:6 }}>
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(d=>(
                    <span key={d} className="dot-bounce" style={{ animationDelay:`${d*0.18}s` }} />
                  ))}
                </div>
                {lastSources.length > 0 && (
                  <p style={{ fontSize:11, color:'#9BBCAF' }}>📚 พบ {lastSources.length} แหล่งข้อมูลที่เกี่ยวข้อง...</p>
                )}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ borderTop:'1px solid #E8F0ED', padding:'14px 16px', display:'flex', gap:8 }}>
          <input
            className="field-input" value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send(input)}
            placeholder="ถามเรื่องสิทธิ์สุขภาพ, ผ้าอ้อม, Caregiver, Stroke..."
            disabled={loading||transcrib}
            style={{ flex:1 }}
          />
          <button
            onMouseDown={startRec} onMouseUp={stopRec}
            onTouchStart={startRec} onTouchEnd={stopRec}
            className="touch-active"
            style={{ width:42, height:42, borderRadius:12, border:'none', cursor:'pointer', background: recording ? 'linear-gradient(135deg,#DC2626,#EF4444)' : 'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, position:'relative', flexShrink:0 }}>
            {recording && <span className="recording-ring" />}
            {transcrib ? <span className="spinner" /> : '🎤'}
          </button>
          <button onClick={()=>send(input)} disabled={loading||!input.trim()}
            className="btn-primary touch-active" style={{ padding:'0 18px', height:42, fontSize:14, flexShrink:0 }}>
            ส่ง
          </button>
        </div>
      </div>

      {/* RAG info box */}
      <div style={{ marginTop:14, padding:'12px 16px', borderRadius:14, background:'#F0FDF9', border:'1px solid #A7D9C6', display:'flex', alignItems:'flex-start', gap:10 }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🔍</span>
        <div>
          <p style={{ fontWeight:700, color:'#0F6E56', fontSize:13, marginBottom:2 }}>RAG-powered Retrieval</p>
          <p style={{ fontSize:12, color:'#4B7A6A', lineHeight:1.6 }}>
            ทุกคำตอบอ้างอิงจากฐานข้อมูล 11 แหล่ง (ผ้าอ้อม, Caregiver, LTC, S72, I63/I69, F01/F03, Barthel ADL, Palliative, บัตรทอง) ไม่ hallucinate ตัวเลขที่ไม่มีในฐานข้อมูล
          </p>
        </div>
      </div>

      {/* Emergency contact */}
      <div style={{ marginTop:12, padding:'14px 18px', borderRadius:16, background:'#FFF1F2', border:'1px solid #FECDD3', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:12, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📞</div>
        <div>
          <p style={{ fontWeight:700, color:'#991B1B', fontSize:14 }}>ถูกปฏิเสธสิทธิ์? ร้องเรียนได้ที่ สปสช.</p>
          <p style={{ fontSize:12, color:'#B91C1C', marginTop:1 }}>โทร <strong>1330</strong> · ตลอด 24 ชั่วโมง · ฟรีทั่วประเทศ</p>
        </div>
      </div>
    </div>
  );
}
