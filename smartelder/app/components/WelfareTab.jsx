'use client';
import { useState } from 'react';
import { useWelfare } from '../context/WelfareContext';

const PATIENTS = [
  { id:'P001', name:'นาย สมชาย ใจดี',   age:72, icon:'👴', icd:'I63.9', icdLabel:'Stroke', adl:3,  state:'active',  ttl:null },
  { id:'P002', name:'นาง มาลี รักสุข',   age:68, icon:'👵', icd:'M17.1', icdLabel:'Knee OA', adl:14, state:'eligible', ttl:null },
  { id:'P003', name:'นาย วิชัย ศรีสุข',  age:80, icon:'👴', icd:'I50.0', icdLabel:'Heart Failure', adl:6, state:'active', ttl:null },
  { id:'P004', name:'นาง สุนีย์ แก้วใส', age:75, icon:'👵', icd:'S72.0', icdLabel:'Hip Fracture', adl:9, state:'hold',   ttl:72 },
  { id:'P005', name:'นาย ประยุทธ์ ดีงาม',age:65, icon:'👴', icd:'F03',   icdLabel:'Dementia', adl:5,  state:'active',  ttl:null },
];

const BENEFITS = {
  'I63.9': [
    { icon:'🧻', name:'ผ้าอ้อมผู้ใหญ่ฟรี', detail:'3 ชิ้น/วัน (สปสช.)', badge:'badge-green' },
    { icon:'👤', name:'Caregiver', detail:'6,000–10,442 บาท/ปี', badge:'badge-blue' },
    { icon:'🛏️', name:'อุปกรณ์การแพทย์', detail:'ยืมเตียง/รถเข็นฟรี', badge:'badge-teal' },
  ],
  'M17.1': [
    { icon:'🩺', name:'ตรวจสุขภาพประจำปี', detail:'ฟรีทุกปี', badge:'badge-green' },
    { icon:'💊', name:'ยาแก้ปวดข้อ', detail:'ตามสิทธิ์บัตรทอง', badge:'badge-teal' },
  ],
  'I50.0': [
    { icon:'🧻', name:'ผ้าอ้อมผู้ใหญ่ฟรี', detail:'3 ชิ้น/วัน', badge:'badge-green' },
    { icon:'👤', name:'Caregiver', detail:'6,000–10,442 บาท/ปี', badge:'badge-blue' },
    { icon:'💊', name:'Palliative Care', detail:'3,000 บาท/6 เดือน', badge:'badge-purple' },
  ],
  'S72.0': [
    { icon:'🛏️', name:'อุปกรณ์ชั่วคราว', detail:'เตียง/รถเข็น 90 วัน', badge:'badge-orange' },
    { icon:'🏃', name:'กายภาพบำบัด', detail:'ที่บ้านโดย อสม.', badge:'badge-blue' },
  ],
  'F03': [
    { icon:'👤', name:'Caregiver', detail:'ล็อกสิทธิ์ถาวร', badge:'badge-blue' },
    { icon:'🛏️', name:'อุปกรณ์การแพทย์', detail:'ยืมเตียง/รถเข็นฟรี', badge:'badge-teal' },
    { icon:'🧻', name:'ผ้าอ้อมผู้ใหญ่ฟรี', detail:'3 ชิ้น/วัน', badge:'badge-green' },
  ],
};

const STATE_ORDER = ['pending','eligible','active','hold','ended'];

const STATES = [
  { id:'pending',  label:'Pending',       icon:'⏳', cls:'' },
  { id:'eligible', label:'Eligible',      icon:'✔️', cls:'passed' },
  { id:'active',   label:'Active Paying', icon:'💚', cls:'active' },
  { id:'hold',     label:'Suspended',     icon:'⏸️', cls:'hold' },
  { id:'ended',    label:'Terminated',    icon:'🔴', cls:'ended' },
];

const TIMELINE = {
  P001: [
    { date:'20 พ.ค. 2568', event:'แพทย์บันทึก ICD-10: I63.9 (Stroke)', type:'ok' },
    { date:'20 พ.ค. 2568', event:'PWL Add-on ส่ง Token → DGA Gateway', type:'ok' },
    { date:'20 พ.ค. 2568', event:'สถานะเปลี่ยน: Eligible → Active_Paying', type:'ok' },
    { date:'01 มิ.ย. 2568', event:'PromptPay โอน 850 บาท สำเร็จ', type:'ok' },
  ],
  P004: [
    { date:'15 พ.ค. 2568', event:'แพทย์บันทึก ICD-10: S72.0 (Hip Fracture)', type:'ok' },
    { date:'15 พ.ค. 2568', event:'สถานะ: Active_Paying (TTL 90 วัน)', type:'ok' },
    { date:'21 พ.ค. 2568', event:'ระบบแจ้งเตือน: อีก 72 วันต้องรีวิว ADL', type:'warn' },
  ],
};

function AdlGauge({ score }) {
  const pct = (score / 20) * 100;
  const color = score <= 6 ? '#EF4444' : score <= 12 ? '#F59E0B' : '#0F6E56';
  const label = score <= 6 ? 'ติดเตียง' : score <= 12 ? 'ติดบ้าน' : 'ช่วยเหลือตัวเองได้';
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:12, color:'#9BBCAF' }}>Barthel ADL Score</span>
        <span style={{ fontWeight:800, fontSize:15, color }}>{score}/20 — {label}</span>
      </div>
      <div style={{ height:10, borderRadius:999, background:'#E8F0ED', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${color}80,${color})`, borderRadius:999, transition:'width 0.8s' }} />
      </div>
    </div>
  );
}

export default function WelfareTab() {
  const { state, dispatch } = useWelfare();
  const [pid, setPid] = useState('P001');

  const patients = state.patients;
  const p = patients[pid] || {};
  const benefits  = p.benefits || [];
  const timeline  = p.timeline || [];
  const currentState = p.state || 'pending';
  const currentIdx   = STATE_ORDER.indexOf(currentState);

  const suspend = () => dispatch({ type:'SET_STATE', patientId:pid, newState: currentState==='hold' ? 'active' : 'hold' });

  return (
    <div>
      {/* Patient chips */}
      <div className="glass-card" style={{ padding:'16px 20px', marginBottom:20 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#9BBCAF', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:12 }}>เลือกผู้ป่วย</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {Object.entries(patients).map(([id, pt]) => (
            <button key={id} onClick={() => setPid(id)}
              className={`patient-chip touch-active${pid===id?' active':''}`}>
              {pt.icon} {pt.name?.split(' ')[1]} · {pt.age} ปี
            </button>
          ))}
        </div>
      </div>

      {/* State Machine */}
      <div className="glass-card" style={{ padding:24, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🛡️</div>
            <span style={{ fontWeight:700, fontSize:15, color:'#1A2E28' }}>Welfare State Machine</span>
          </div>
          <button onClick={suspend} className="touch-active" style={{ padding:'8px 16px', borderRadius:12, border:'none', cursor:'pointer', background: currentState==='hold' ? 'linear-gradient(135deg,#0F6E56,#17A97E)' : 'linear-gradient(135deg,#DC2626,#EF4444)', color:'white', fontSize:13, fontWeight:700 }}>
            {currentState==='hold' ? '▶ Reactivate สิทธิ์' : '⏸ Suspend สิทธิ์'}
          </button>
        </div>

        {/* State nodes */}
        <div style={{ display:'flex', alignItems:'center', gap:6, overflowX:'auto', paddingBottom:4 }}>
          {STATES.map((s, i) => {
            const myIdx = STATE_ORDER.indexOf(s.id);
            const isCurrent = s.id === currentState;
            const isPassed   = myIdx < currentIdx;
            let cls = '';
            if (isCurrent) cls = s.id === 'hold' ? 'hold' : s.id === 'ended' ? 'ended' : 'active';
            else if (isPassed) cls = 'passed';
            return (
              <div key={s.id} style={{ display:'flex', alignItems:'center', flex:'1 0 auto' }}>
                <div className={`state-node ${cls}`}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                  <p style={{ fontWeight:700, fontSize:12, color:'#1A2E28' }}>{s.label}</p>
                  {isCurrent && <span className="badge badge-teal" style={{ fontSize:9, marginTop:4 }}>ปัจจุบัน</span>}
                </div>
                {i < STATES.length-1 && <span className="state-arrow">›</span>}
              </div>
            );
          })}
        </div>

        {/* ADL */}
        <div style={{ marginTop:20 }}>
          <AdlGauge score={p.adl} />
        </div>

        {/* TTL */}
        {p.ttl && (
          <div style={{ marginTop:14, padding:'10px 16px', borderRadius:14, background:'#FFF7E0', border:'1px solid #F59E0B40', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>⏰</span>
            <p style={{ fontSize:13, color:'#92400E' }}>TTL: เหลืออีก <strong>{p.ttl} วัน</strong> — ระบบจะส่ง Alert ให้ อสม. รีวิว ADL ใหม่อัตโนมัติ</p>
          </div>
        )}
      </div>

      <div className="responsive-grid-2">
        {/* Benefits */}
        <div className="glass-card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🎁</div>
            <span style={{ fontWeight:700, fontSize:15, color:'#1A2E28' }}>สิทธิ์ที่ถูกปลดล็อก</span>
            <span className="badge badge-teal" style={{ marginLeft:'auto' }}>{benefits.length} รายการ</span>
          </div>
          <div style={{ marginBottom:12, padding:'8px 12px', borderRadius:10, background:'#F0FDF9', fontSize:12, color:'#0F6E56', fontWeight:600 }}>
            ICD-10: <strong>{p.icd}</strong> — {p.icdLabel}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {benefits.map((b, i) => (
              <div key={i} className="benefit-chip">
                <span style={{ fontSize:22 }}>{b.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700, fontSize:13, color:'#1A2E28' }}>{b.name}</p>
                  <p style={{ fontSize:11, color:'#6B9A87' }}>{b.detail}</p>
                </div>
                <span className={`badge ${b.badge}`}>{b.badge.includes('green')?'ได้รับแล้ว':'มีสิทธิ์'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>📋</div>
            <span style={{ fontWeight:700, fontSize:15, color:'#1A2E28' }}>ประวัติการเปลี่ยนแปลง</span>
          </div>
          {timeline.length === 0 ? (
            <p style={{ color:'#9BBCAF', fontSize:13, textAlign:'center', padding:'20px 0' }}>ไม่มีประวัติ</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {timeline.map((t, i) => (
                <div key={i} style={{ display:'flex', gap:12, paddingBottom:14, position:'relative' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background: t.type==='warn'?'#F59E0B':'#0F6E56', flexShrink:0, marginTop:4 }} />
                    {i < timeline.length-1 && <div style={{ width:2, flex:1, background:'#E8F0ED', marginTop:4 }} />}
                  </div>
                  <div>
                    <p style={{ fontSize:11, color:'#9BBCAF', marginBottom:2 }}>{t.date}</p>
                    <p style={{ fontSize:13, color:'#1A2E28', lineHeight:1.5 }}>{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Locked state note */}
          {p.icd === 'F03' && (
            <div style={{ marginTop:12, padding:'10px 14px', borderRadius:12, background:'#F0FDF9', border:'1px solid #A7D9C6', fontSize:12, color:'#0F6E56' }}>
              🔒 สิทธิ์ถูก <strong>ล็อกถาวร</strong> — ต้องมีผู้ดูแลยืนยันก่อนจึงจะระงับได้ (Dementia Protocol)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
