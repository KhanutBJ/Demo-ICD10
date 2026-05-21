'use client';
import { useState } from 'react';

const STAGES = [
  {
    id:'hospital', icon:'🏥', color:'#0F6E56',
    title:'Hospital Edge', sub:'HIS Add-on ดักจับ ICD+ADL',
    detail:'Local Rule Engine คัดกรองรหัสโรคเสี่ยง',
    payloadLabel:'⚠️ Raw Data — ไม่เคยออกนอกโรงพยาบาล',
    payload:`{\n  "patient_hn": "HN-2024-001",\n  "national_id": "1234567890123",\n  "icd10": "I63.9",\n  "barthel_adl": 3,\n  "mobility": "bedridden"\n}`,
  },
  {
    id:'tokenizer', icon:'🔒', color:'#6366F1',
    title:'Privacy Shield', sub:'PDPA Tokenization',
    detail:'SHA-256 เข้ารหัสเลขบัตร / ลบชื่อโรค / เหลือแค่ Flag',
    payloadLabel:'✅ Anonymized Token — ปลอดภัยตาม PDPA',
    payload:`{\n  "secure_token": "e3b0c44298fc1c149a...",\n  "welfare_flags": {\n    "tier": "DEPENDENT_BEDRIDDEN",\n    "diaper_eligible": true,\n    "caregiver_eligible": true,\n    "ttl": "PERMANENT"\n  }\n}`,
  },
  {
    id:'gateway', icon:'☁️', color:'#0EA5E9',
    title:'DGA API Gateway', sub:'จับคู่ทะเบียนราษฎร์',
    detail:'ตรวจซ้ำ → State Machine: Eligible → Active_Paying',
    payloadLabel:'✅ State Update',
    payload:`{\n  "citizen_matched": true,\n  "duplicate_check": "CLEAR",\n  "new_state": "ACTIVE_PAYING",\n  "benefits_unlocked": [\n    "DIAPER_3PCS_DAY",\n    "CAREGIVER_ALLOWANCE",\n    "MEDICAL_DEVICE_LOAN"\n  ]\n}`,
  },
  {
    id:'delivery', icon:'💳', color:'#17A97E',
    title:'Disbursement', sub:'PromptPay / อสม. Last-Mile',
    detail:'โอนเงินอัตโนมัติ หรือ Alert อสม. ถ้า Exception',
    payloadLabel:'✅ Delivery Result',
    payload:`{\n  "promptpay_status": "SUCCESS",\n  "amount_thb": 850,\n  "period": "2026-06",\n  "vhv_alert": null\n}`,
    exceptionPayload:`{\n  "promptpay_status": "FAILED",\n  "error": "ACCOUNT_CLOSED",\n  "vhv_alert": {\n    "type": "PAYMENT_EXCEPTION",\n    "action": "HOME_VISIT_REQUIRED",\n    "urgency": "HIGH"\n  }\n}`,
  },
];

export default function PipelineTab() {
  const [curStage, setCurStage] = useState(-1);
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);
  const [isEx, setIsEx]         = useState(false);
  const [expanded, setExpanded] = useState(null);

  const runDemo = async (exception = false) => {
    setRunning(true); setDone(false); setIsEx(false);
    setCurStage(-1); setExpanded(null);
    for (let i = 0; i < STAGES.length; i++) {
      setCurStage(i);
      await new Promise(r => setTimeout(r, 1700));
    }
    setCurStage(STAGES.length);
    setIsEx(exception); setDone(true); setRunning(false);
  };

  const reset = () => { setCurStage(-1); setDone(false); setIsEx(false); setRunning(false); setExpanded(null); };

  return (
    <div>
      {/* Header */}
      <div style={{ borderRadius:20, padding:'18px 24px', marginBottom:24, background:'linear-gradient(135deg,#0a3d2e,#0F6E56,#17A97E)', boxShadow:'0 6px 28px rgba(15,110,86,0.28)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🔗</div>
            <div>
              <p style={{ color:'white', fontWeight:800, fontSize:17 }}>PWL Data Pipeline</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>ICD-10 → Privacy Shield → DGA → สิทธิ์ถึงเตียงผู้ป่วย</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={reset} disabled={running} style={{ padding:'9px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.12)', color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>🔄 Reset</button>
            <button onClick={() => runDemo(true)} disabled={running} style={{ padding:'9px 16px', borderRadius:12, border:'none', background:'rgba(239,68,68,0.8)', color:'white', fontSize:13, fontWeight:700, cursor:running?'not-allowed':'pointer' }}>⚠️ Exception</button>
            <button onClick={() => runDemo(false)} disabled={running} style={{ padding:'9px 20px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.95)', color:'#0F6E56', fontSize:13, fontWeight:800, cursor:running?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:6 }}>
              {running ? <><span className="spinner" style={{ borderTopColor:'#0F6E56', borderColor:'rgba(15,110,86,0.2)', width:14, height:14 }} />กำลังรัน...</> : '▶ Demo Pipeline'}
            </button>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div style={{ display:'flex', alignItems:'stretch', marginBottom:24, overflowX:'auto', paddingBottom:4 }}>
        {STAGES.map((s, i) => {
          const isActive = curStage === i;
          const isDone   = curStage > i;
          return (
            <div key={s.id} style={{ display:'flex', alignItems:'center', flex:'1 0 auto' }}>
              <div className={`pipeline-stage${isActive?' active':''}${isDone?' done':''}`} onClick={() => setExpanded(expanded===i?null:i)}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <div style={{ width:30, height:30, borderRadius:9, background: isDone?`${s.color}20`:isActive?s.color:'#E8F0ED', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color: isDone?s.color:isActive?'white':'#9BBCAF', fontWeight:800, transition:'all 0.3s' }}>
                    {isDone ? '✓' : isActive ? <span className="spinner" style={{ width:12, height:12, borderTopColor:'white', borderColor:'rgba(255,255,255,0.3)' }} /> : i+1}
                  </div>
                  {isDone && <span className="badge badge-teal" style={{ fontSize:10 }}>เสร็จ</span>}
                  {isActive && <span className="badge badge-teal" style={{ fontSize:10 }}>กำลังรัน</span>}
                </div>
                <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
                <p style={{ fontWeight:800, fontSize:13, color:isDone||isActive?s.color:'#1A2E28', marginBottom:2 }}>{s.title}</p>
                <p style={{ fontSize:11, color:'#9BBCAF', lineHeight:1.4, marginBottom:4 }}>{s.sub}</p>
                {isActive && <p style={{ fontSize:11, color:s.color, fontWeight:600 }}>{s.detail}</p>}
                <p style={{ fontSize:10, color:'#C4D9D0', marginTop:6 }}>คลิกดู payload ↓</p>
              </div>
              {i < STAGES.length-1 && (
                <div className={`pipeline-connector${isActive?' active':''}${isDone?' done':''}`}>
                  {isActive && <div className="flow-dot" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded payload */}
      {expanded !== null && (
        <div className="glass-card anim-fade-up" style={{ padding:20, marginBottom:20 }}>
          <p style={{ fontSize:12, color:'#9BBCAF', marginBottom:8 }}>{STAGES[expanded].payloadLabel}</p>
          <pre style={{ background:'#0a1f19', color:'#a7f3d0', borderRadius:14, padding:'14px 18px', fontSize:12, lineHeight:1.7, overflow:'auto', fontFamily:'monospace' }}>
            {expanded===3 && isEx && done ? STAGES[3].exceptionPayload : STAGES[expanded].payload}
          </pre>
          {expanded===0 && (
            <div style={{ marginTop:10, padding:'10px 14px', borderRadius:12, background:'#FFF7E0', border:'1px solid #F59E0B40', fontSize:12, color:'#92400E' }}>
              ⚠️ ข้อมูลชุดนี้ <strong>ไม่เคยออกนอกโรงพยาบาล</strong> — ประมวลผลภายใน Hospital Perimeter เท่านั้น
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {done && (
        <div className="anim-pop-in" style={{ borderRadius:20, padding:'18px 24px', marginBottom:20, background:isEx?'linear-gradient(135deg,#FEE2E2,#FFF1F2)':'linear-gradient(135deg,#DCFCE7,#F0FDF9)', border:`2px solid ${isEx?'#FECDD3':'#86EFAC'}`, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:36 }}>{isEx?'⚠️':'✅'}</div>
          <div>
            <p style={{ fontWeight:800, fontSize:15, color:isEx?'#991B1B':'#15803D' }}>
              {isEx ? 'Exception ถูกตรวจพบ — Alert ส่ง อสม. แล้ว!' : 'Pipeline สำเร็จ — สิทธิ์ถึงเตียงผู้ป่วยอัตโนมัติ!'}
            </p>
            <p style={{ fontSize:13, color:isEx?'#B91C1C':'#166534', marginTop:2 }}>
              {isEx ? 'บัญชีปิด → อสม. รับ Alert → จะเดินเท้าไปผูก PromptPay ที่บ้าน' : 'ICD-10 → Token → DGA → Active_Paying → PromptPay โอนเงินในรอบถัดไป'}
            </p>
          </div>
        </div>
      )}

      {/* Tech notes */}
      <div className="responsive-grid-2">
        {[
          { icon:'🛡️', title:'PDPA Compliance', color:'#6366F1', pts:['ไม่มีชื่อโรคออกนอกโรงพยาบาล','SHA-256 + Rotating Salt','ท้องถิ่นเห็นแค่ "ระดับสิทธิ์" ไม่เห็นโรค','Privacy by Design ทุก Layer'] },
          { icon:'⚙️', title:'Tech Stack', color:'#0EA5E9', pts:['HL7 FHIR Standard','mTLS Mutual Authentication','Apache Kafka Message Queue','State Machine Ledger (PostgreSQL)'] },
        ].map((box, i) => (
          <div key={i} className="glass-card" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${box.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{box.icon}</div>
              <span style={{ fontWeight:700, color:'#1A2E28', fontSize:14 }}>{box.title}</span>
            </div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
              {box.pts.map((p, j) => (
                <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'#4B7A6A', lineHeight:1.5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:box.color, flexShrink:0, marginTop:5 }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
