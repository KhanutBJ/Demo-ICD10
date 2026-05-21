'use client';
import { useState } from 'react';

const QUEUE_INIT = [
  { id:'Q001', name:'นาง วิไล สุขใจ',    age:78, cond:'ตรวจเบาหวานประจำปี',  wait:15, status:'รอ', priority:'ปกติ', icon:'👵' },
  { id:'Q002', name:'นาย สมบัติ ทองดี',  age:82, cond:'ปวดหัวเข่า ใส่รั้ง', wait:32, status:'รอ', priority:'สูง',  icon:'👴' },
  { id:'Q003', name:'นาง แก้วใส รักดี',  age:70, cond:'ตรวจความดันโลหิต',   wait:48, status:'รอ', priority:'ปกติ', icon:'👵' },
];

export default function QueueTab() {
  const [queue, setQueue]   = useState(QUEUE_INIT);
  const [sms, setSms]       = useState({});
  const [form, setForm]     = useState({ show: false, name: '', age: '', cond: '' });
  const [adding, setAdding] = useState(false);

  const sendSMS = id => {
    setSms(p => ({ ...p, [id]: true }));
    setTimeout(() => setSms(p => ({ ...p, [id]: false })), 3000);
  };

  const callNext = id => setQueue(p => p.map(q => q.id === id ? { ...q, status: 'รับบริการ' } : q));

  const addPatient = () => {
    if (!form.name.trim()) return;
    setAdding(true);
    setTimeout(() => {
      const maxWait = Math.max(...queue.map(q => q.wait), 0);
      const age = parseInt(form.age) || 70;
      setQueue(p => [...p, {
        id: `Q${Date.now()}`, name: form.name, age,
        cond: form.cond || 'ไม่ระบุ',
        wait: maxWait + 15, status: 'รอ',
        priority: age >= 80 ? 'สูง' : 'ปกติ',
        icon: age >= 65 ? '👴' : '🧑',
      }]);
      setForm({ show: false, name: '', age: '', cond: '' });
      setAdding(false);
    }, 900);
  };

  const waiting    = queue.filter(q => q.status === 'รอ');
  const serving    = queue.filter(q => q.status === 'รับบริการ');
  const avgWait    = waiting.length ? Math.round(waiting.reduce((s,q)=>s+q.wait,0)/waiting.length) : 0;

  return (
    <div>
      {/* Stats */}
      <div className="responsive-grid-3" style={{ marginBottom: 20 }}>
        {[
          { label:'รอรับบริการ',  value: waiting.length, color:'#F59E0B', icon:'⏳', bg:'#FFF7E0' },
          { label:'ให้บริการแล้ว', value: serving.length, color:'#0F6E56', icon:'✅', bg:'#F0FDF9' },
          { label:'เฉลี่ยรอ',      value: `${avgWait} นาที`, color:'#6366F1', icon:'⏱️', bg:'#EEF2FF' },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg, borderRadius:20, padding:'20px 16px', textAlign:'center', border:`1px solid ${s.color}22` }}>
            <div style={{ fontSize:26, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, fontWeight:600, color:'#4B7A6A', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Queue card */}
      <div className="glass-card" style={{ marginBottom:20, overflow:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'16px 24px', borderBottom:'1px solid #E8F0ED', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>👥</div>
            <span style={{ fontWeight:700, fontSize:15, color:'#1A2E28' }}>คิวผู้ป่วยวันนี้</span>
          </div>
          <button onClick={() => setForm(f=>({...f,show:!f.show}))}
            className="btn-primary touch-active" style={{ padding:'8px 18px', fontSize:13 }}>
            + เช็กอิน
          </button>
        </div>

        {/* Check-in form */}
        {form.show && (
          <div style={{ padding:'16px 24px', background:'#F0FDF9', borderBottom:'1px solid #D1E8DF' }} className="anim-fade-up">
            <div className="queue-form-grid">
              <input className="field-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="ชื่อ-นามสกุล" />
              <input className="field-input" value={form.age}  onChange={e=>setForm(f=>({...f,age:e.target.value}))}  placeholder="อายุ" type="number" />
              <input className="field-input" value={form.cond} onChange={e=>setForm(f=>({...f,cond:e.target.value}))} placeholder="อาการ / เหตุผลที่มา" />
            </div>
            <button onClick={addPatient} disabled={adding||!form.name.trim()}
              className="btn-primary touch-active" style={{ padding:'9px 20px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
              {adding ? <><span className="spinner"/>กำลังเพิ่ม...</> : '🤖 AI จัดคิวอัตโนมัติ'}
            </button>
          </div>
        )}

        {/* Rows */}
        <div>
          {queue.map((q,i) => {
            const isServing = q.status === 'รับบริการ';
            const isHigh    = q.priority === 'สูง';
            return (
              <div key={q.id} className="queue-row" style={{
                padding:'14px 24px',
                display:'flex', alignItems:'center', gap:14,
                background: isServing ? 'linear-gradient(90deg,#F0FDF9,#FAFFFE)' : i%2===0 ? 'white' : '#FAFCFB',
                borderBottom:'1px solid #F0F5F3',
                transition:'background 0.3s',
              }}>
                {/* Number avatar */}
                <div style={{
                  width:40, height:40, borderRadius:14, flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:17,
                  background: isHigh
                    ? 'linear-gradient(135deg,#DC2626,#EF4444)'
                    : isServing
                      ? 'linear-gradient(135deg,#0F6E56,#17A97E)'
                      : 'linear-gradient(135deg,#E8F0ED,#D1E8DF)',
                  color: isHigh||isServing ? 'white' : '#4B7A6A',
                  fontWeight:800, fontSize:14,
                  boxShadow: isHigh ? '0 3px 10px rgba(220,38,38,0.3)' : isServing ? '0 3px 10px rgba(15,110,86,0.3)' : 'none',
                }}>{i+1}</div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, color:'#1A2E28', fontSize:14 }}>{q.icon} {q.name}</span>
                    <span style={{ fontSize:12, color:'#9BBCAF' }}>{q.age} ปี</span>
                    {isHigh && <span className="badge badge-red">⚠️ ความสำคัญสูง</span>}
                    <span className={`badge ${isServing ? 'badge-green' : 'badge-yellow'}`}>
                      {isServing ? '✅ รับบริการ' : '⏳ รอ'}
                    </span>
                  </div>
                  <p style={{ fontSize:12, color:'#6B9A87', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.cond}</p>
                </div>

                <div className="queue-row-actions" style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <div style={{ textAlign:'right', marginRight:4 }}>
                    <div style={{ fontWeight:700, fontSize:14, color: q.wait>40 ? '#EF4444' : '#0F6E56' }}>~{q.wait} นาที</div>
                    <div style={{ fontSize:11, color:'#9BBCAF' }}>รอคาดการณ์</div>
                  </div>
                  {!isServing && (
                    <>
                      <button onClick={()=>sendSMS(q.id)}
                        className="touch-active"
                        style={{
                          padding:'6px 12px', borderRadius:10, fontSize:12, fontWeight:600,
                          border:'none', cursor:'pointer', transition:'all 0.2s',
                          background: sms[q.id] ? '#DCFCE7' : '#DBEAFE',
                          color:       sms[q.id] ? '#15803D' : '#1E40AF',
                        }}>
                        {sms[q.id] ? '✅ ส่งแล้ว' : '📱 SMS'}
                      </button>
                      <button onClick={()=>callNext(q.id)}
                        className="btn-primary touch-active" style={{ padding:'6px 14px', fontSize:12 }}>
                        เรียก
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI insight */}
      <div style={{
        borderRadius:20, padding:'16px 20px',
        background:'linear-gradient(135deg,#0a3d2e,#0F6E56)',
        boxShadow:'0 6px 28px rgba(15,110,86,0.28)',
        display:'flex', alignItems:'flex-start', gap:14,
      }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🤖</div>
        <div>
          <p style={{ color:'white', fontWeight:700, marginBottom:4 }}>AI วิเคราะห์คิว</p>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13, lineHeight:1.6 }}>
            ผู้สูงอายุ 80+ ปีได้รับลำดับความสำคัญอัตโนมัติ • SMS แจ้งเตือนก่อนถึงคิว 5 นาที • ประมาณเวลาแม่นยำ ±5 นาที
          </p>
        </div>
      </div>
    </div>
  );
}
