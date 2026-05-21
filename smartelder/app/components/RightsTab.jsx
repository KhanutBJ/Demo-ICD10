'use client';
import { useState, useRef } from 'react';

const GROQ_ASR_KEY = process.env.NEXT_PUBLIC_GROQ_ASR_KEY;
const GROQ_LLM_KEY = process.env.NEXT_PUBLIC_GROQ_LLM_KEY;

const QUICK_Q = [
  'บัตรทองใช้ที่ไหนได้บ้าง?',
  'ถูกปฏิเสธสิทธิ์ทำอย่างไร?',
  'ผู้สูงอายุมีสิทธิ์อะไรพิเศษ?',
  'ยาที่ใช้สิทธิ์บัตรทองได้?',
  'ตรวจสุขภาพประจำปีฟรีไหม?',
];

export default function RightsTab() {
  const [msgs, setMsgs]       = useState([
    { role:'ai', text:'สวัสดีครับ 😊 ผมคือผู้ช่วย AI อธิบายสิทธิ์บัตรทอง 30 บาท\nถามได้เลยนะครับ — ยินดีช่วยเหลือผู้สูงอายุทุกท่าน!' },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRec]   = useState(false);
  const [transcrib, setTrans] = useState(false);
  const mrRef     = useRef(null);
  const chunksRef = useRef([]);
  const bottomRef = useRef(null);

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 80);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setMsgs(p => [...p, { role:'user', text }]);
    setInput('');
    setLoading(true);
    scroll();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${GROQ_LLM_KEY}` },
        body: JSON.stringify({
          model:'qwen/qwen3-32b',
          messages:[
            { role:'system', content:'คุณคือ "Synape x Right" ผู้ช่วย AI อธิบายสิทธิ์บัตรทอง 30 บาท สำหรับผู้สูงอายุไทย (สปสช.) ตอบด้วยภาษาที่เข้าใจง่าย กระชับ ไม่เกิน 3 ประโยค หากผู้ใช้ถามเรื่องอื่นที่ไม่เกี่ยวกับสิทธิ์การรักษาพยาบาลหรือสุขภาพ ให้ปฏิเสธอย่างสุภาพและดึงกลับมาเรื่องบัตรทอง หากถูกปฏิเสธสิทธิ์ให้แนะนำช่องทางร้องเรียน สปสช. โทร 1330 ห้ามใช้ markdown หรือเครื่องหมายดอกจัน (*) ในคำตอบ' },
            ...msgs.map(m => ({ role: m.role==='ai' ? 'assistant' : 'user', content: m.text })),
            { role:'user', content: text },
          ],
          temperature:0.5, max_tokens:2048,
        }),
      });
      const d = await res.json();
      // Strip any <think> tokens from the reply (even if unclosed) and markdown bold asterisks
      const raw = d.choices?.[0]?.message?.content || '';
      const reply = raw.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').replace(/\*/g, '').trim() || 'ขออภัย ไม่สามารถตอบได้ กรุณาลองถามใหม่อีกครั้ง';
      setMsgs(p => [...p, { role:'ai', text: reply }]);
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
      {/* Info banner */}
      <div style={{
        borderRadius:20, padding:'16px 20px', marginBottom:16,
        background:'linear-gradient(135deg,#0a3d2e,#0F6E56,#17A97E)',
        display:'flex', alignItems:'center', gap:14,
        boxShadow:'0 6px 28px rgba(15,110,86,0.28)',
      }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🏥</div>
        <div>
          <p style={{ color:'white', fontWeight:800, fontSize:16 }}>สิทธิ์บัตรทอง 30 บาท</p>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13 }}>ถามได้ทุกเรื่องเกี่ยวกับสิทธิ์สุขภาพ • สปสช. โทร 1330</p>
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {QUICK_Q.map((q,i) => (
          <button key={i} onClick={()=>send(q)}
            className="touch-active"
            style={{
              padding:'7px 14px', borderRadius:999,
              background:'white', border:'1.5px solid #D1E8DF',
              fontSize:12, fontWeight:600, color:'#4B7A6A',
              cursor:'pointer', transition:'all 0.18s',
            }}
            onMouseOver={e=>{ e.currentTarget.style.borderColor='#17A97E'; e.currentTarget.style.color='#0F6E56'; }}
            onMouseOut={e=>{ e.currentTarget.style.borderColor='#D1E8DF'; e.currentTarget.style.color='#4B7A6A'; }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="glass-card" style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:14, minHeight:360, maxHeight:460 }}>
          {msgs.map((m,i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start', gap:8 }} className="anim-fade-up">
              {m.role==='ai' && (
                <div style={{
                  width:32, height:32, borderRadius:10, flexShrink:0,
                  background:'linear-gradient(135deg,#0F6E56,#17A97E)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:16, marginTop:2,
                }}>🤖</div>
              )}
              <div className={m.role==='user' ? 'bubble-user' : 'bubble-ai'}
                style={{
                  maxWidth:'72%', padding:'11px 16px', fontSize:14,
                  lineHeight:1.65, whiteSpace:'pre-wrap',
                  boxShadow: m.role==='user' ? '0 3px 12px rgba(15,110,86,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display:'flex', gap:8 }} className="anim-fade-up">
              <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤖</div>
              <div className="bubble-ai" style={{ padding:'12px 18px', display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(d=>(
                  <span key={d} className="dot-bounce" style={{ animationDelay:`${d*0.18}s` }} />
                ))}
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
            placeholder="ถามเกี่ยวกับสิทธิ์บัตรทองได้เลย..."
            disabled={loading||transcrib}
            style={{ flex:1 }}
          />
          <button
            onMouseDown={startRec} onMouseUp={stopRec}
            onTouchStart={startRec} onTouchEnd={stopRec}
            className="touch-active"
            style={{
              width:42, height:42, borderRadius:12, border:'none', cursor:'pointer',
              background: recording ? 'linear-gradient(135deg,#DC2626,#EF4444)' : 'linear-gradient(135deg,#0F6E56,#17A97E)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              boxShadow: recording ? '0 4px 14px rgba(220,38,38,0.35)' : '0 4px 14px rgba(15,110,86,0.3)',
              position:'relative', flexShrink:0,
            }}>
            {recording && <span className="recording-ring" />}
            {transcrib ? <span className="spinner" /> : '🎤'}
          </button>
          <button onClick={()=>send(input)} disabled={loading||!input.trim()}
            className="btn-primary touch-active" style={{ padding:'0 18px', height:42, fontSize:14, flexShrink:0 }}>
            ส่ง
          </button>
        </div>
      </div>

      {/* Emergency contact */}
      <div style={{ marginTop:16, padding:'14px 18px', borderRadius:16, background:'#FFF1F2', border:'1px solid #FECDD3', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:12, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📞</div>
        <div>
          <p style={{ fontWeight:700, color:'#991B1B', fontSize:14 }}>ถูกปฏิเสธสิทธิ์? ร้องเรียนได้ที่ สปสช.</p>
          <p style={{ fontSize:12, color:'#B91C1C', marginTop:1 }}>โทร <strong>1330</strong> · ตลอด 24 ชั่วโมง · ฟรีทั่วประเทศ</p>
        </div>
      </div>
    </div>
  );
}
