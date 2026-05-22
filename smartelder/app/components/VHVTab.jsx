'use client';
import { useState } from 'react';
import { useWelfare } from '../context/WelfareContext';

const INIT_ALERTS = [
  { id:'A001', type:'urgent', icon:'🚨', title:'บัญชีธนาคารปิด — PromptPay โอนไม่ผ่าน', patient:'นาง สุนีย์ แก้วใส', addr:'15/3 ซ.วัดสิงห์ บางมด', action:'ไปผูก PromptPay ใหม่ + ยืนยันตัวตน', status:'pending', time:'10 นาทีที่แล้ว' },
  { id:'A002', type:'review', icon:'⏰', title:'TTL ครบกำหนด — ต้องรีวิว ADL ใหม่', patient:'นาย สมชาย ใจดี', addr:'88 ถ.พระราม 2 บางขุนเทียน', action:'ประเมิน Barthel ADL Score + อัปเดตระบบ', status:'pending', time:'1 ชั่วโมงที่แล้ว' },
  { id:'A003', type:'urgent', icon:'🏥', title:'ผู้ป่วยติดเตียงรายใหม่ตรวจพบในพื้นที่', patient:'นาง วิไล สมบูรณ์', addr:'22 ซ.สวนพลู ราษฎร์บูรณะ', action:'เยี่ยมบ้านครั้งแรก + ลงทะเบียนสิทธิ์', status:'pending', time:'2 ชั่วโมงที่แล้ว' },
  { id:'A004', type:'review', icon:'💊', title:'ยืนยันการรับผ้าอ้อมประจำเดือน', patient:'นาย วิชัย ศรีสุข', addr:'7/1 ซ.บางปะกอก ราษฎร์บูรณะ', action:'ยืนยัน Proof of Life + มอบผ้าอ้อม 90 ชิ้น', status:'accepted', time:'เมื่อวานนี้' },
];

const URGENCY_COLOR = { urgent:'#EF4444', review:'#F59E0B', done:'#0F6E56' };

export default function VHVTab() {
  const { state, dispatch } = useWelfare();
  const alerts = state.alerts;
  const [logging, setLogging] = useState(null);
  const [logAdl, setLogAdl]   = useState('');
  const [logNote, setLogNote] = useState('');

  const accept  = id => dispatch({ type:'ACCEPT_ALERT', id });
  const saveLog = id => {
    const adlVal = parseInt(logAdl);
    const alert  = alerts.find(a => a.id===id);
    if (!isNaN(adlVal) && alert?.patientId) {
      dispatch({ type:'UPDATE_ADL', patientId:alert.patientId, adl:adlVal });
    }
    dispatch({ type:'CLOSE_ALERT', id });
    setLogging(null); setLogAdl(''); setLogNote('');
  };

  const pending  = alerts.filter(a => a.status==='pending');
  const accepted = alerts.filter(a => a.status==='accepted');
  const done     = alerts.filter(a => a.status==='done');

  return (
    <div>
      {/* Header */}
      <div style={{ borderRadius:20, padding:'18px 24px', marginBottom:20, background:'linear-gradient(135deg,#0a3d2e,#0F6E56,#17A97E)', boxShadow:'0 6px 28px rgba(15,110,86,0.28)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🏘️</div>
          <div>
            <p style={{ color:'white', fontWeight:800, fontSize:17 }}>Work Orders — อปท. Last-Mile</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>Exception Handler • อสม. เข้าช่วยเฉพาะกรณีที่ระบบ re-route • พื้นที่: บางมด–ราษฎร์บูรณะ</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ textAlign:'center', padding:'6px 14px', borderRadius:12, background:'rgba(239,68,68,0.25)', border:'1px solid rgba(239,68,68,0.4)' }}>
            <p style={{ color:'#FCA5A5', fontSize:20, fontWeight:900 }}>{pending.length}</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>รอดำเนินการ</p>
          </div>
          <div style={{ textAlign:'center', padding:'6px 14px', borderRadius:12, background:'rgba(245,158,11,0.25)', border:'1px solid rgba(245,158,11,0.4)' }}>
            <p style={{ color:'#FDE68A', fontSize:20, fontWeight:900 }}>{accepted.length}</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>รับงานแล้ว</p>
          </div>
          <div style={{ textAlign:'center', padding:'6px 14px', borderRadius:12, background:'rgba(74,222,128,0.2)', border:'1px solid rgba(74,222,128,0.3)' }}>
            <p style={{ color:'#86EFAC', fontSize:20, fontWeight:900 }}>{done.length}</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>เสร็จแล้ว</p>
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
        {alerts.map(a => (
          <div key={a.id} className={`alert-card ${a.status==='done'?'done':a.type}`}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
              {/* Icon */}
              <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, background: a.status==='done'?'#DCFCE7':a.type==='urgent'?'#FEE2E2':'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                {a.status==='done' ? '✅' : a.icon}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>{a.title}</span>
                      <span className={`badge ${a.status==='done'?'badge-green':a.type==='urgent'?'badge-red':'badge-yellow'}`}>
                        {a.status==='done' ? '✅ เสร็จ' : a.status==='accepted' ? '🔄 กำลังทำ' : a.type==='urgent' ? '🚨 ด่วน' : '⏰ รีวิว'}
                      </span>
                    </div>
                    <p style={{ fontSize:13, color:'#4B7A6A', marginBottom:2 }}>👤 {a.patient}</p>
                    <p style={{ fontSize:12, color:'#9BBCAF', marginBottom:6 }}>📍 {a.addr}</p>
                    <div style={{ padding:'8px 12px', borderRadius:10, background:'rgba(15,110,86,0.06)', border:'1px solid rgba(15,110,86,0.1)', fontSize:12, color:'#0F6E56', fontWeight:600 }}>
                      📋 {a.action}
                    </div>
                  </div>
                  <span style={{ fontSize:11, color:'#9BBCAF', flexShrink:0, marginTop:2 }}>{a.time}</span>
                </div>

                {/* Action buttons */}
                {a.status==='pending' && (
                  <div style={{ display:'flex', gap:8, marginTop:12 }}>
                    <button onClick={() => accept(a.id)} className="btn-primary touch-active" style={{ padding:'8px 20px', fontSize:13 }}>
                      ✋ รับงาน
                    </button>
                    <button onClick={() => setLogging(logging===a.id?null:a.id)} className="touch-active" style={{ padding:'8px 16px', fontSize:13, borderRadius:12, border:'1.5px solid #D1E8DF', background:'white', color:'#0F6E56', fontWeight:700, cursor:'pointer' }}>
                      📝 บันทึกผล
                    </button>
                  </div>
                )}
                {a.status==='accepted' && (
                  <div style={{ display:'flex', gap:8, marginTop:12 }}>
                    <button onClick={() => setLogging(logging===a.id?null:a.id)} className="btn-primary touch-active" style={{ padding:'8px 20px', fontSize:13, background:'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                      📝 บันทึกผล
                    </button>
                  </div>
                )}

                {/* Log form */}
                {logging===a.id && (
                  <div className="anim-fade-up" style={{ marginTop:12, padding:'14px 16px', borderRadius:14, background:'#F0FDF9', border:'1px solid #A7D9C6' }}>
                    <p style={{ fontWeight:700, fontSize:13, color:'#0F6E56', marginBottom:10 }}>บันทึกผลการเยี่ยมบ้าน</p>
                    <div style={{ display:'flex', gap:10, marginBottom:10, flexWrap:'wrap' }}>
                      <div style={{ flex:1, minWidth:120 }}>
                        <p style={{ fontSize:11, color:'#9BBCAF', marginBottom:4 }}>คะแนน ADL ใหม่ (0-20)</p>
                        <input className="field-input" type="number" min="0" max="20" value={logAdl} onChange={e=>setLogAdl(e.target.value)} placeholder="เช่น 8" />
                      </div>
                      <div style={{ flex:2, minWidth:200 }}>
                        <p style={{ fontSize:11, color:'#9BBCAF', marginBottom:4 }}>หมายเหตุ</p>
                        <input className="field-input" value={logNote} onChange={e=>setLogNote(e.target.value)} placeholder="สภาพผู้ป่วย / ปัญหาที่พบ..." />
                      </div>
                    </div>
                    <button onClick={() => saveLog(a.id)} disabled={!logAdl} className="btn-primary touch-active" style={{ padding:'8px 20px', fontSize:13 }}>
                      ✅ ยืนยันบันทึก
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI insight */}
      <div style={{ borderRadius:20, padding:'16px 20px', background:'linear-gradient(135deg,#0a3d2e,#0F6E56)', boxShadow:'0 6px 28px rgba(15,110,86,0.25)', display:'flex', alignItems:'flex-start', gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🤖</div>
        <div>
          <p style={{ color:'white', fontWeight:700, marginBottom:4 }}>AI วิเคราะห์งานภาคสนาม</p>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13, lineHeight:1.6 }}>
            จากข้อมูล ICD-10 พบผู้ป่วยติดเตียงรายใหม่ 1 ราย และ TTL ครบกำหนด 1 ราย • แนะนำจัดลำดับ: เคส ด่วน → รีวิว ADL • ระยะทางรวมวันนี้ประมาณ 4.2 กม.
          </p>
        </div>
      </div>
    </div>
  );
}
