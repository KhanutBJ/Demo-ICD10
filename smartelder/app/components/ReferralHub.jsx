'use client';
import { useState } from 'react';
import { useWelfare } from '../context/WelfareContext';

/* ── Care Manager zones ────────────────────────────────── */
const CM_ZONES = [
  { zone:'บางขุนเทียน', cm:2, demand:9,  color:'#EF4444' },
  { zone:'ราษฎร์บูรณะ', cm:2, demand:11, color:'#EF4444' },
  { zone:'บางมด',        cm:3, demand:8,  color:'#F59E0B' },
  { zone:'ธนบุรี',        cm:4, demand:9,  color:'#0F6E56' },
];

/* ── Beyond-ADL clinical flags ─────────────────────────── */
const BEYOND_ADL_FLAGS = [
  { id:'urinary',    label:'ปัสสาวะผิดปกติ / อุดตัน',    icon:'🚨', severity:'urgent', notify:['สปสช.','รพ.ต้นสังกัด'] },
  { id:'pressure',   label:'แผลกดทับ (Pressure Sore)',   icon:'🩹', severity:'warn',   notify:['สปสช.','พยาบาล'] },
  { id:'fall',       label:'เสี่ยงล้ม / ล้มแล้ว',        icon:'⚠️', severity:'warn',   notify:['สปสช.','พยาบาล'] },
  { id:'depression', label:'ซึมเศร้า / ไม่รับประทานอาหาร', icon:'😔', severity:'warn',   notify:['สปสช.','จิตเวช'] },
  { id:'medication', label:'ไม่กินยาตามสั่ง',             icon:'💊', severity:'info',   notify:['รพ.ต้นสังกัด'] },
  { id:'nutrition',  label:'น้ำหนักลด / ขาดสารอาหาร',    icon:'🍽️', severity:'info',   notify:['พยาบาล'] },
];

/* ── Line alert feed (initial) ─────────────────────────── */
const INIT_ALERTS = [
  { id:'LA001', from:'อสม.สมหมาย', patientAnon:'PT-001', flag:'ปัสสาวะอุดตัน', time:'09:23', type:'urgent', seenBy:['สปสช.','รพ.บางมด'] },
  { id:'LA002', from:'อสม.สมศรี',  patientAnon:'PT-003', flag:'ไม่รับประทานอาหาร 2 วัน', time:'11:45', type:'warn', seenBy:['สปสช.'] },
  { id:'LA003', from:'อสม.สมชาย', patientAnon:'PT-005', flag:'กินยาครบ ✓', time:'08:00', type:'ok', seenBy:['สปสช.','รพ.ธนบุรี'] },
];

/* ── Line Care Plan questions per tier ─────────────────── */
const CARE_PLAN_Q = {
  STROKE_DEPENDENT:  ['ผู้ป่วยพลิกตัวเองได้ไหม?','มีน้ำลายไหลหรือสำลักบ่อยไหม?','ปัสสาวะ/อุจจาระอยู่เองได้ไหม?','สื่อสารด้วยภาษาได้ไหม?','ผิวหนังมีแผลหรือรอยแดงไหม?'],
  STROKE_SEQUELAE:   ['เดินได้หรือต้องพยุง?','มีอาการเจ็บปวดเรื้อรังไหม?','ต้องการ Palliative Care ไหม?','ครอบครัวดูแลได้ไหม?'],
  CARDIAC_DEPENDENT: ['หายใจลำบาก/เหนื่อยง่ายไหม?','ขาบวมไหม?','กินยาครบตามสั่งไหม?','น้ำหนักขึ้นกะทันหันไหม?'],
  DEMENTIA_LONGTERM: ['จำคนในบ้านได้ไหม?','มีพฤติกรรมก้าวร้าวไหม?','เดินออกนอกบ้านตอนกลางคืนไหม?','ปลอดภัยในบ้าน (ไฟ/น้ำ) ไหม?'],
  FRACTURE_TEMPORARY:['เจ็บปวดบริเวณกระดูกไหม?','ทำกายภาพตามที่แพทย์สั่งไหม?','ลุกนั่งได้เองไหม?'],
  CHRONIC:           ['ตรวจสุขภาพประจำปีครบไหม?','กินยาสม่ำเสมอไหม?','ออกกำลังกายได้ไหม?'],
};

/* ── Status meta ───────────────────────────────────────── */
const STATUS_META = {
  new:          { label:'New',          color:'#F59E0B', bg:'#FFFBEB', step:0 },
  acknowledged: { label:'Acknowledged', color:'#3B82F6', bg:'#EFF6FF', step:1 },
  assigned:     { label:'Assigned',     color:'#8B5CF6', bg:'#F5F3FF', step:2 },
  resolved:     { label:'Resolved',     color:'#0F6E56', bg:'#F0FDF9', step:3 },
};
const STATUS_ORDER = ['new','acknowledged','assigned','resolved'];

const SEVERITY_STYLE = {
  urgent: { bg:'#FFF1F2', border:'#FCA5A5', text:'#991B1B', dot:'#EF4444' },
  warn:   { bg:'#FFFBEB', border:'#FCD34D', text:'#92400E', dot:'#F59E0B' },
  ok:     { bg:'#F0FDF9', border:'#6EE7B7', text:'#065F46', dot:'#0F6E56' },
  info:   { bg:'#EFF6FF', border:'#93C5FD', text:'#1E40AF', dot:'#3B82F6' },
};

export default function ReferralHub() {
  const { state, dispatch } = useWelfare();
  const referrals = state.referrals || [];

  const [lineAlerts, setLineAlerts]   = useState(INIT_ALERTS);
  const [beyondFlags, setBeyondFlags] = useState({});   // { patientId: { urinary: true, ... } }
  const [selPatient, setSelPatient]   = useState('P001');
  const [cpAnswers, setCpAnswers]     = useState({});   // { q_index: true/false }
  const [cpSubmitted, setCpSubmitted] = useState(false);

  const patients  = Object.entries(state.patients).map(([id,p]) => ({ id,...p }));
  const selP      = state.patients[selPatient];
  const selTier   = selP?.icd?.slice(0,3) === 'F0' ? (selP?.icd?.slice(0,3) === 'F01' ? 'DEMENTIA_LONGTERM' : 'DEMENTIA_LONGTERM') : null;

  /* derive tier from icd for care plan questions */
  const tierForQ = (() => {
    const icd = selP?.icd?.slice(0,3);
    if (!icd) return 'CHRONIC';
    const map = { I63:'STROKE_DEPENDENT', I69:'STROKE_SEQUELAE', I50:'CARDIAC_DEPENDENT', F01:'DEMENTIA_LONGTERM', F03:'DEMENTIA_LONGTERM', S72:'FRACTURE_TEMPORARY', M17:'CHRONIC', E11:'CHRONIC' };
    return map[icd] || 'CHRONIC';
  })();

  /* advance referral status */
  const advance = (rf) => {
    const cur = STATUS_ORDER.indexOf(rf.status);
    if (cur < STATUS_ORDER.length - 1) {
      const next = STATUS_ORDER[cur + 1];
      const updates = { status: next };
      if (next === 'assigned' && !rf.cm) updates.cm = 'น.ส.วาสนา ดูแลดี (สปสช.)';
      dispatch({ type:'UPDATE_REFERRAL', id:rf.id, updates });
    }
  };

  /* flag beyond-ADL */
  const toggleFlag = (patientId, flagId, flagMeta, patientAnon) => {
    const prev = beyondFlags[patientId]?.[flagId];
    setBeyondFlags(p => ({ ...p, [patientId]: { ...p[patientId], [flagId]: !prev } }));
    if (!prev) {
      const now = new Date().toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit' });
      setLineAlerts(p => [
        { id:`LA${Date.now()}`, from:`อสม.ประจำโซน`, patientAnon, flag:flagMeta.label, time:now, type:flagMeta.severity, seenBy:flagMeta.notify },
        ...p,
      ]);
    }
  };

  /* CM utilization */
  const zoneWithLineFallback = CM_ZONES.filter(z => z.demand / z.cm > 3.5);

  /* summary counts */
  const counts = STATUS_ORDER.reduce((acc,s) => ({ ...acc, [s]: referrals.filter(r=>r.status===s).length }), {});
  const slaBreached = referrals.filter(r => r.daysOpen >= 7 && r.status !== 'resolved').length;

  return (
    <div>
      {/* ── Summary metrics ──────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:20 }}>
        {[
          { icon:'📨', label:'Referrals ทั้งหมด', value:referrals.length,         color:'#6366F1' },
          { icon:'🆕', label:'New (รอ สปสช.)',    value:counts.new||0,            color:'#F59E0B' },
          { icon:'👤', label:'Assigned (มี CM)',   value:counts.assigned||0,       color:'#8B5CF6' },
          { icon:'⚠️', label:'SLA เกิน 7 วัน',   value:slaBreached,              color:'#EF4444' },
        ].map((m,i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.9)', border:`1px solid ${m.color}20`, borderRadius:18, padding:'18px 16px', textAlign:'center', boxShadow:'0 4px 16px rgba(15,110,86,0.07)' }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{m.icon}</div>
            <div style={{ fontSize:26, fontWeight:900, color:m.color }}>{m.value}</div>
            <div style={{ fontSize:11, fontWeight:600, color:'#4B7A6A', marginTop:2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main grid ────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* ── Referral Kanban ──────────────────────────── */}
        <div className="glass-card" style={{ padding:22, gridColumn:'1/-1' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🔀</div>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Auto-Referral Board</p>
              <p style={{ fontSize:11, color:'#9BBCAF' }}>ICD save → ticket ส่งอัตโนมัติ → สปสช. / LTC Fund / หน่วยงานที่เกี่ยวข้อง</p>
            </div>
            <span style={{ marginLeft:'auto', padding:'4px 12px', borderRadius:8, background:'#EFF6FF', color:'#3B82F6', fontSize:11, fontWeight:700 }}>Live</span>
          </div>

          {/* Status columns */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:14 }}>
            {STATUS_ORDER.map(status => {
              const meta = STATUS_META[status];
              const group = referrals.filter(r => r.status === status);
              return (
                <div key={status}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, padding:'6px 10px', borderRadius:10, background:meta.bg, border:`1px solid ${meta.color}30` }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:meta.color, display:'inline-block' }} />
                    <span style={{ fontSize:12, fontWeight:700, color:meta.color }}>{meta.label}</span>
                    <span style={{ marginLeft:'auto', fontSize:12, fontWeight:800, color:meta.color }}>{group.length}</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {group.length === 0 && (
                      <div style={{ padding:'16px', borderRadius:12, border:'1.5px dashed #E8F0ED', textAlign:'center', color:'#C4D9D0', fontSize:11 }}>ไม่มี ticket</div>
                    )}
                    {group.map(rf => {
                      const p = state.patients[rf.patientId];
                      const overSLA = rf.daysOpen >= 7;
                      return (
                        <div key={rf.id} style={{ padding:'12px 14px', borderRadius:14, background:'white', border:`1.5px solid ${overSLA ? '#FCA5A5' : meta.color+'30'}`, boxShadow:`0 2px 8px ${meta.color}12` }}>
                          {/* Header */}
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <span style={{ fontSize:16 }}>{p?.icon || '👤'}</span>
                              <div>
                                <p style={{ fontSize:11, fontWeight:700, color:'#1A2E28' }}>{rf.id}</p>
                                <p style={{ fontSize:10, color:'#9BBCAF' }}>{rf.patientId} • {rf.icd}</p>
                              </div>
                            </div>
                            {overSLA && <span style={{ fontSize:9, fontWeight:700, color:'#EF4444', background:'#FEE2E2', padding:'2px 7px', borderRadius:6 }}>SLA!</span>}
                          </div>

                          {/* Tier + ADL */}
                          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:8 }}>
                            <span style={{ fontSize:10, background:`${meta.color}18`, color:meta.color, padding:'2px 8px', borderRadius:6, fontWeight:700 }}>{rf.tier}</span>
                            {rf.adl !== null && <span style={{ fontSize:10, background:'#F8FAFC', color:'#6B9A87', padding:'2px 8px', borderRadius:6, fontWeight:600 }}>ADL {rf.adl}</span>}
                          </div>

                          {/* Routed to */}
                          <p style={{ fontSize:10, color:'#9BBCAF', fontWeight:600, marginBottom:4 }}>ส่งไปยัง</p>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:8 }}>
                            {rf.routedTo.map((ag,i) => (
                              <span key={i} style={{ fontSize:10, background:'#EFF6FF', color:'#1D4ED8', padding:'2px 7px', borderRadius:6, fontWeight:600 }}>{ag}</span>
                            ))}
                          </div>

                          {/* CM */}
                          {rf.cm && <p style={{ fontSize:10, color:'#0F6E56', fontWeight:600, marginBottom:8 }}>👩‍⚕️ CM: {rf.cm}</p>}

                          {/* Footer */}
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:10, color:'#C4D9D0' }}>{rf.createdAt} · {rf.daysOpen}d</span>
                            {status !== 'resolved' && (
                              <button onClick={() => advance(rf)}
                                style={{ fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:8, border:'none', cursor:'pointer', background:`${meta.color}18`, color:meta.color }}>
                                ▶ ถัดไป
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Second row: CM Capacity + Line Monitor ──────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* CM Capacity */}
        <div className="glass-card" style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#EC4899,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>👩‍⚕️</div>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Care Manager Capacity</p>
              <p style={{ fontSize:11, color:'#9BBCAF' }}>อัตรา CM:ผู้ป่วย &gt; 3.5 → เปิด Line fallback</p>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {CM_ZONES.map((z, i) => {
              const ratio  = z.demand / z.cm;
              const pct    = Math.min((ratio / 5) * 100, 100);
              const over   = ratio > 3.5;
              const color  = ratio > 4.5 ? '#EF4444' : ratio > 3.5 ? '#F59E0B' : '#0F6E56';
              return (
                <div key={i}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#1A2E28' }}>{z.zone}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:11, color:'#9BBCAF' }}>{z.cm} CM / {z.demand} ผู้ป่วย</span>
                      <span style={{ fontSize:11, fontWeight:800, color }}>{ratio.toFixed(1)}x</span>
                      {over && <span style={{ fontSize:9, fontWeight:700, background:'#FEF3C7', color:'#92400E', padding:'2px 6px', borderRadius:6 }}>Line ON</span>}
                    </div>
                  </div>
                  <div style={{ height:8, borderRadius:999, background:'#E8F0ED', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:999, transition:'width 0.8s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Line fallback panel */}
          {zoneWithLineFallback.length > 0 && (
            <div style={{ padding:'14px 16px', borderRadius:16, background:'linear-gradient(135deg,#ECFDF5,#D1FAE5)', border:'1.5px solid #6EE7B7' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ fontSize:20 }}>💬</span>
                <div>
                  <p style={{ fontWeight:800, fontSize:12, color:'#065F46' }}>Line OA — Care Plan Bot (Fallback Active)</p>
                  <p style={{ fontSize:10, color:'#6EE7B7', marginTop:1 }}>โซน: {zoneWithLineFallback.map(z=>z.zone).join(', ')}</p>
                </div>
              </div>
              {/* Mock QR */}
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:72, height:72, borderRadius:12, border:'3px solid #065F46', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, background:'white' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(5,8px)', gap:1 }}>
                    {Array.from({length:25}).map((_,i)=>(
                      <div key={i} style={{ width:8, height:8, background: [0,1,5,6,2,7,12,17,22,18,23,24,19,3,8,4,9,14,16,21,20,15,11,13,10].includes(i) ? '#065F46':'white', borderRadius:1 }} />
                    ))}
                  </div>
                  <p style={{ fontSize:7, color:'#065F46', fontWeight:800, marginTop:3 }}>LINE</p>
                </div>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, color:'#065F46', marginBottom:4 }}>ครอบครัว/ผู้ดูแล scan เพื่อ:</p>
                  {['ประเมิน Care Plan ด้วยตนเอง','รับ template คำถาม ICD+ADL','แจ้ง flag ผิดปกติให้ สปสช.'].map((t,i) => (
                    <p key={i} style={{ fontSize:10, color:'#059669', marginBottom:2 }}>✓ {t}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Line Monitor Feed */}
        <div className="glass-card" style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#22C55E,#16A34A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>💬</div>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Line Monitor Feed</p>
              <p style={{ fontSize:11, color:'#9BBCAF' }}>อสม. แจ้ง → สปสช. + รพ. เห็นพร้อมกัน</p>
            </div>
            <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, background:'#DCFCE7', color:'#15803D', padding:'3px 9px', borderRadius:7 }}>Real-time</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:340, overflowY:'auto' }}>
            {lineAlerts.map((a, i) => {
              const sty = SEVERITY_STYLE[a.type] || SEVERITY_STYLE.info;
              return (
                <div key={a.id || i} style={{ padding:'10px 12px', borderRadius:12, background:sty.bg, border:`1px solid ${sty.border}` }} className="anim-fade-up">
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:sty.dot, display:'inline-block' }} />
                      <span style={{ fontSize:11, fontWeight:700, color:sty.text }}>{a.from}</span>
                      <span style={{ fontSize:10, color:'#9BBCAF' }}>· {a.patientAnon}</span>
                    </div>
                    <span style={{ fontSize:10, color:'#9BBCAF' }}>{a.time}</span>
                  </div>
                  <p style={{ fontSize:12, fontWeight:700, color:sty.text, marginBottom:5 }}>{a.flag}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {(a.seenBy||[]).map((s,j) => (
                      <span key={j} style={{ fontSize:9, fontWeight:700, background:'rgba(0,0,0,0.06)', color:sty.text, padding:'2px 7px', borderRadius:5 }}>👁 {s}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Beyond-ADL Assessment ────────────────────────── */}
      <div className="glass-card" style={{ padding:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#F59E0B,#EF4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🩺</div>
          <div>
            <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Beyond-ADL Assessment (อสม. กรอก)</p>
            <p style={{ fontSize:11, color:'#9BBCAF' }}>สิ่งที่ ADL score จับไม่ได้ — flag → Line alert → สปสช. + รพ. รับทราบ</p>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {/* Patient selector + flags */}
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:'#9BBCAF', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.6px' }}>เลือกผู้ป่วย</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:16 }}>
              {patients.filter(p => ['active','suspended'].includes(p.state)).map(p => (
                <button key={p.id} onClick={() => { setSelPatient(p.id); setCpAnswers({}); setCpSubmitted(false); }}
                  className={`patient-chip touch-active${selPatient===p.id?' active':''}`} style={{ fontSize:12 }}>
                  {p.icon} {p.name.split(' ')[1]}
                </button>
              ))}
            </div>

            <p style={{ fontSize:11, fontWeight:700, color:'#9BBCAF', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.6px' }}>Flag ผิดปกติ</p>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {BEYOND_ADL_FLAGS.map(f => {
                const active = !!beyondFlags[selPatient]?.[f.id];
                const sty    = SEVERITY_STYLE[f.severity];
                const anon   = `PT-00${patients.findIndex(p=>p.id===selPatient)+1}`;
                return (
                  <div key={f.id} onClick={() => toggleFlag(selPatient, f.id, f, anon)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, cursor:'pointer',
                      background: active ? sty.bg : '#FAFCFB',
                      border: `1.5px solid ${active ? sty.border : '#E8F0ED'}`,
                      transition:'all 0.2s' }}>
                    <div style={{ width:22, height:22, borderRadius:7, background: active ? sty.dot : 'white', border:`2px solid ${active ? sty.dot : '#C4D9D0'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', flexShrink:0 }}>
                      {active && <span style={{ color:'white', fontSize:11, fontWeight:800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:13 }}>{f.icon}</span>
                    <span style={{ fontSize:12, fontWeight:600, color: active ? sty.text : '#4B7A6A', flex:1 }}>{f.label}</span>
                    {active && (
                      <span style={{ fontSize:9, fontWeight:700, background:sty.bg, color:sty.text, padding:'2px 7px', borderRadius:6, border:`1px solid ${sty.border}` }}>
                        แจ้ง {f.notify.join('+')} แล้ว
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Line Care Plan Bot */}
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:'#9BBCAF', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.6px' }}>
              Line Care Plan Bot — {tierForQ}
            </p>
            <div style={{ padding:'14px 16px', borderRadius:16, background:'linear-gradient(135deg,#ECFDF5,#F0FDF9)', border:'1.5px solid #A7F3D0', marginBottom:12 }}>
              <p style={{ fontSize:11, color:'#065F46', fontWeight:700, marginBottom:10 }}>
                📋 แบบประเมิน Care Plan สำหรับ {selP?.name?.split(' ')[1] || '—'} ({tierForQ})
              </p>
              {(CARE_PLAN_Q[tierForQ] || []).map((q, i) => (
                <div key={i} onClick={() => !cpSubmitted && setCpAnswers(p => ({ ...p, [i]: !p[i] }))}
                  style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 10px', borderRadius:10, marginBottom:6, cursor: cpSubmitted ? 'default' : 'pointer',
                    background: cpAnswers[i] ? '#D1FAE5' : 'white', border:`1px solid ${cpAnswers[i]?'#6EE7B7':'#E8F0ED'}`, transition:'all 0.2s' }}>
                  <div style={{ width:18, height:18, borderRadius:5, flexShrink:0, marginTop:1, background: cpAnswers[i] ? '#0F6E56' : 'white', border:`2px solid ${cpAnswers[i]?'#0F6E56':'#C4D9D0'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {cpAnswers[i] && <span style={{ color:'white', fontSize:10, fontWeight:800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:11, color: cpAnswers[i] ? '#065F46' : '#4B7A6A', fontWeight: cpAnswers[i] ? 700 : 500, lineHeight:1.5 }}>{q}</span>
                </div>
              ))}
              {!cpSubmitted ? (
                <button onClick={() => { if(Object.values(cpAnswers).some(Boolean)) setCpSubmitted(true); }}
                  style={{ width:'100%', marginTop:8, padding:'9px', borderRadius:12, border:'none', cursor:'pointer', fontWeight:700, fontSize:12,
                    background: Object.values(cpAnswers).some(Boolean) ? 'linear-gradient(135deg,#0F6E56,#17A97E)' : '#E8F0ED',
                    color: Object.values(cpAnswers).some(Boolean) ? 'white' : '#9BBCAF',
                  }}>
                  ส่ง Care Plan ให้ สปสช. →
                </button>
              ) : (
                <div className="anim-pop-in" style={{ marginTop:8, padding:'10px', borderRadius:12, background:'#F0FDF9', border:'1px solid #0F6E5640', textAlign:'center' }}>
                  <p style={{ fontWeight:800, color:'#0F6E56', fontSize:12 }}>✅ ส่ง Care Plan สำเร็จ</p>
                  <p style={{ fontSize:10, color:'#6B9A87', marginTop:2 }}>สปสช. + CM รับข้อมูลแล้ว — จะ update ticket อัตโนมัติ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
