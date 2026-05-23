'use client';
import { useState } from 'react';
import { useWelfare, matchIcd } from '../context/WelfareContext';

/* ── Health centers near demo patients ─────────────────── */
const HEALTH_CENTERS = {
  P001: { name:'ศบส.บางขุนเทียน', addr:'ถ.พระราม 2 แขวงบางขุนเทียน', tel:'02-451-3xxx' },
  P002: { name:'ศบส.ราษฎร์บูรณะ', addr:'สำนักงานเขตราษฎร์บูรณะ', tel:'02-427-xxxx' },
  P003: { name:'รพ.สต.บางปะกอก', addr:'ซ.บางปะกอก ราษฎร์บูรณะ', tel:'02-427-xxxx' },
  P004: { name:'ศบส.บางมด', addr:'ซ.วัดสิงห์ แขวงบางมด', tel:'02-416-xxxx' },
  P005: { name:'ศบส.บางมด', addr:'ถ.สุขสวัสดิ์ แขวงบางมด', tel:'02-416-xxxx' },
};

/* ── Contact chain per welfare tier (SOP บทที่ ๓) ─────── */
const CONTACT_CHAIN = {
  STROKE_DEPENDENT: [
    { seq:1, agency:'โรงพยาบาล',       role:'แจ้งวินิจฉัย ICD-10: I63',        action:'ส่งข้อมูล ICD-10 + Barthel ADL → เจ้าหน้าที่ศูนย์ฯ ประจำโซน',                 icon:'🏥', color:'#0F6E56' },
    { seq:2, agency:'อสม. ชุมชน',      role:'ประสานลงพื้นที่',                  action:'นัดหมายกับญาติก่อนเยี่ยมบ้าน — ขออนุญาตก่อนเข้าบ้านและถ่ายรูป',             icon:'🏘️', color:'#0EA5E9' },
    { seq:3, agency:'พยาบาลวิชาชีพ',  role:'เยี่ยมบ้าน + ประเมิน Barthel ADL', action:'วัด BP, O₂Sat, ประเมินกิจวัตร, บันทึก Care Plan ใน Program 3C กรมอนามัย',     icon:'👩‍⚕️', color:'#6366F1' },
    { seq:4, agency:'กปท.',            role:'จัดส่งผ้าอ้อมฟรี',                 action:'3 ชิ้น/วัน — ส่งถึงเคาน์เตอร์ศูนย์อนามัย พร้อม PIN รับของ 6 หลัก',          icon:'🧻', color:'#17A97E' },
    { seq:5, agency:'อปท./เทศบาล',    role:'ลงทะเบียน Caregiver + LTC Fund',   action:'Caregiver 6,000–10,442 บาท/ปี + ประสานกองสวัสดิการสังคม',                    icon:'🏛️', color:'#F59E0B' },
  ],
  STROKE_SEQUELAE: [
    { seq:1, agency:'โรงพยาบาล',       role:'แจ้งวินิจฉัย ICD-10: I69',        action:'ส่ง ICD-10 + ADL → ศูนย์บริการสาธารณสุข',                                    icon:'🏥', color:'#0F6E56' },
    { seq:2, agency:'อสม. ชุมชน',      role:'ประสานลงพื้นที่',                  action:'นัดหมายเยี่ยมบ้าน',                                                           icon:'🏘️', color:'#0EA5E9' },
    { seq:3, agency:'พยาบาลวิชาชีพ',  role:'เยี่ยมบ้าน + ADL',                 action:'วางแผน Palliative Care + บันทึก Program 3C',                                  icon:'👩‍⚕️', color:'#6366F1' },
    { seq:4, agency:'กปท.',            role:'จัดส่งผ้าอ้อมฟรี',                 action:'3 ชิ้น/วัน → เคาน์เตอร์ศูนย์อนามัย + PIN 6 หลัก',                           icon:'🧻', color:'#17A97E' },
  ],
  CARDIAC_DEPENDENT: [
    { seq:1, agency:'โรงพยาบาล',       role:'แจ้งวินิจฉัย ICD-10: I50',        action:'ส่ง ICD-10 + ADL → ศูนย์บริการสาธารณสุข',                                    icon:'🏥', color:'#0F6E56' },
    { seq:2, agency:'อสม. ชุมชน',      role:'ประสานลงพื้นที่',                  action:'นัดหมายเยี่ยมบ้าน',                                                           icon:'🏘️', color:'#0EA5E9' },
    { seq:3, agency:'พยาบาลวิชาชีพ',  role:'เยี่ยมบ้าน + ADL',                 action:'Care Plan + วางแผน Palliative + Program 3C',                                  icon:'👩‍⚕️', color:'#6366F1' },
    { seq:4, agency:'กปท.',            role:'จัดส่งผ้าอ้อมฟรี',                 action:'3 ชิ้น/วัน → เคาน์เตอร์ + PIN รับของ',                                       icon:'🧻', color:'#17A97E' },
    { seq:5, agency:'LTC Fund',        role:'Palliative Care 3,000 บาท/6 เดือน','action':'ลงทะเบียน LTC ผ่าน อปท. — สปสช. 1330',                                    icon:'💊', color:'#8B5CF6' },
  ],
  DEMENTIA_LONGTERM: [
    { seq:1, agency:'โรงพยาบาล',       role:'แจ้งวินิจฉัย F01/F03 (Lock ถาวร)', action:'ส่ง ICD-10 สถานะ Lock — ต้องยืนยันก่อนระงับสิทธิ์',                          icon:'🏥', color:'#0F6E56' },
    { seq:2, agency:'อสม. ชุมชน',      role:'ประสานลงพื้นที่',                  action:'นัดหมายเยี่ยมบ้าน',                                                           icon:'🏘️', color:'#0EA5E9' },
    { seq:3, agency:'พยาบาลวิชาชีพ',  role:'Care Plan LTC (ล็อกถาวร)',          action:'บันทึก Program 3C กรมอนามัย — ห้ามยกเลิกโดยไม่ยืนยัน',                       icon:'👩‍⚕️', color:'#6366F1' },
    { seq:4, agency:'LTC Fund',        role:'Care Plan Fund ถาวร',               action:'ลงทะเบียน LTC ผ่าน อปท. — ต้องยืนยันก่อนระงับ',                             icon:'👤', color:'#7C3AED' },
    { seq:5, agency:'กปท.',            role:'จัดส่งผ้าอ้อมฟรี',                 action:'3 ชิ้น/วัน → เคาน์เตอร์ศูนย์อนามัย + PIN รับของ',                           icon:'🧻', color:'#17A97E' },
  ],
  FRACTURE_TEMPORARY: [
    { seq:1, agency:'โรงพยาบาล',       role:'แจ้งวินิจฉัย S72 (TTL 90 วัน)',   action:'ส่ง ICD-10 + ADL → ศูนย์บริการสาธารณสุข',                                    icon:'🏥', color:'#0F6E56' },
    { seq:2, agency:'อสม. ชุมชน',      role:'ประสานลงพื้นที่',                  action:'นัดหมายพยาบาล + นักกายภาพ',                                                  icon:'🏘️', color:'#0EA5E9' },
    { seq:3, agency:'พยาบาลวิชาชีพ',  role:'เยี่ยมบ้าน + ADL',                 action:'ส่งต่อกายภาพบำบัดที่บ้านโดย อสม.',                                            icon:'👩‍⚕️', color:'#6366F1' },
    { seq:4, agency:'กองทุนฟื้นฟูจังหวัด', role:'อุปกรณ์ชั่วคราว 90 วัน',    action:'ส่งเตียง/รถเข็น → เคาน์เตอร์ศูนย์อนามัย + PIN รับของ',                       icon:'🛏️', color:'#F59E0B' },
  ],
  CHRONIC: [
    { seq:1, agency:'โรงพยาบาล',       role:'แจ้งวินิจฉัย',                    action:'ส่ง ICD-10 ให้ รพ.สต. ใกล้บ้าน',                                             icon:'🏥', color:'#0F6E56' },
    { seq:2, agency:'รพ.สต.',          role:'ติดตามสุขภาพประจำปี',              action:'นัดตรวจ + จ่ายยา สิทธิ์บัตรทอง',                                            icon:'💊', color:'#0891B2' },
  ],
};

/* ── Nurse tasks from SOP บทที่ ๓ ขั้นตอน ๑–๓ ──────────── */
const NURSE_TASKS = [
  { id:'recv',     label:'รับข้อมูลผู้ป่วย',                icon:'📋', detail:'จากโรงพยาบาล / อสม. / ผู้ป่วยหรือญาติ (บันทึกเลขสารบรรณ)', sop:'ขั้นตอน ๑' },
  { id:'schedule', label:'นัดหมายเยี่ยมบ้าน',               icon:'📅', detail:'นัดกับญาติ/อสม. ก่อนลงพื้นที่ — ต้องได้รับอนุญาตก่อน',     sop:'ขั้นตอน ๒' },
  { id:'visit',    label:'เยี่ยมบ้าน + ประเมิน Barthel ADL', icon:'🏠', detail:'วัด BP, O₂Sat, ดัชนีบาร์เธลแอล, เยี่ยมตามมาตรฐานวิชาชีพ', sop:'ขั้นตอน ๒' },
  { id:'careplan', label:'วางแผน Care Plan (Program 3C)',     icon:'📝', detail:'บันทึกปัญหาสุขภาพในระบบกรมอนามัย + ส่งต่อสหวิชาชีพ',       sop:'ขั้นตอน ๓' },
  { id:'share',    label:'ส่งต่อสหวิชาชีพ',                 icon:'🔗', detail:'กปท. / LTC Fund / อปท. ดำเนินสิทธิ์ต่อ',                   sop:'ขั้นตอน ๓' },
];

/* ── Delivery status steps ─────────────────────────────── */
const DELIVERY_STEPS = [
  { label:'สร้าง Work Order', icon:'📋', color:'#9BBCAF' },
  { label:'กำลังจัดเตรียม',  icon:'📦', color:'#F59E0B' },
  { label:'ออกจัดส่งแล้ว',   icon:'🚚', color:'#3B82F6' },
  { label:'ถึงเคาน์เตอร์',   icon:'🏥', color:'#8B5CF6' },
  { label:'รับของแล้ว',      icon:'✅', color:'#0F6E56' },
];

/* Tiers that get diaper delivery */
const DIAPER_TIERS = ['STROKE_DEPENDENT','STROKE_SEQUELAE','CARDIAC_DEPENDENT','DEMENTIA_LONGTERM'];
const DEVICE_TIERS  = ['FRACTURE_TEMPORARY'];

/* Initial delivery state per patient */
const INIT_DELIVERY = { P001:2, P003:3, P005:1, P004:0 };
const INIT_TASKS = {
  P001: { recv:true,  schedule:true,  visit:false, careplan:false, share:false },
  P002: { recv:true,  schedule:false, visit:false, careplan:false, share:false },
  P003: { recv:true,  schedule:true,  visit:false, careplan:false, share:false },
  P004: { recv:true,  schedule:false, visit:false, careplan:false, share:false },
  P005: { recv:true,  schedule:true,  visit:true,  careplan:true,  share:false },
};
const PINS = { P001:'847293', P003:'362819', P005:'594017', P004:'210483' };

export default function LastMileTab() {
  const { state } = useWelfare();
  const patients = Object.entries(state.patients).map(([id, p]) => ({ id, ...p }));

  const [selId, setSelId]         = useState('P001');
  const [tasks, setTasks]         = useState(INIT_TASKS);
  const [delivery, setDelivery]   = useState(INIT_DELIVERY);
  const [pinInput, setPinInput]   = useState('');
  const [pinError, setPinError]   = useState(false);
  const [pinSuccess, setPinSuccess] = useState({});

  const patient = state.patients[selId];
  const tier    = matchIcd(patient?.icd)?.tier || 'CHRONIC';
  const chain   = CONTACT_CHAIN[tier] || CONTACT_CHAIN.CHRONIC;
  const center  = HEALTH_CENTERS[selId];
  const taskMap = tasks[selId] || {};
  const doneCount = NURSE_TASKS.filter(t => taskMap[t.id]).length;

  const hasDiaper = DIAPER_TIERS.includes(tier);
  const hasDevice = DEVICE_TIERS.includes(tier);
  const hasDelivery = hasDiaper || hasDevice;
  const delivStatus = delivery[selId] ?? null;
  const correctPin  = PINS[selId];

  const toggleTask = (id) =>
    setTasks(prev => ({ ...prev, [selId]: { ...prev[selId], [id]: !prev[selId]?.[id] } }));

  const advanceDelivery = () =>
    setDelivery(prev => ({ ...prev, [selId]: Math.min((prev[selId] ?? 0) + 1, 4) }));

  const confirmPin = () => {
    if (pinInput === correctPin) {
      setDelivery(prev => ({ ...prev, [selId]: 4 }));
      setPinSuccess(prev => ({ ...prev, [selId]: true }));
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1500);
    }
  };

  return (
    <div>
      {/* ── Patient chips ─────────────────────────── */}
      <div className="glass-card" style={{ padding:'16px 20px', marginBottom:20 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#9BBCAF', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:12 }}>
          เลือกผู้ป่วย
        </p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {patients.map(p => (
            <button key={p.id} onClick={() => { setSelId(p.id); setPinInput(''); setPinError(false); }}
              className={`patient-chip touch-active${selId === p.id ? ' active' : ''}`}>
              {p.icon} {p.name.split(' ')[1]} · {p.age} ปี
            </button>
          ))}
        </div>
      </div>

      {/* ── Patient banner ────────────────────────── */}
      <div style={{
        borderRadius:20, background:'linear-gradient(135deg,#0a3d2e,#0F6E56,#17A97E)',
        padding:'18px 24px', marginBottom:20,
        display:'flex', alignItems:'center', gap:16,
        boxShadow:'0 6px 28px rgba(15,110,86,0.28)',
      }}>
        <div style={{ width:52, height:52, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
          {patient?.icon}
        </div>
        <div style={{ flex:1 }}>
          <p style={{ color:'white', fontWeight:800, fontSize:17 }}>{patient?.name}</p>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, marginTop:2 }}>
            ICD: {patient?.icd} &nbsp;·&nbsp; Tier: <strong style={{ color:'#A7F3D0' }}>{tier}</strong> &nbsp;·&nbsp; {center?.name}
          </p>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:11 }}>Tasks</p>
          <p style={{ color:'white', fontWeight:900, fontSize:20 }}>{doneCount}/{NURSE_TASKS.length}</p>
        </div>
      </div>

      {/* ── Three-panel grid ──────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20 }}>

        {/* ── PANEL 1: Contact Agent ──────────────── */}
        <div className="glass-card" style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🤖</div>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Contact Agent</p>
              <p style={{ fontSize:11, color:'#9BBCAF' }}>ต้องติดต่อใครบ้าง — Tier: {tier}</p>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {chain.map((c, i) => (
              <div key={i} style={{ display:'flex', gap:12, position:'relative' }}>
                {/* Connector line */}
                {i < chain.length - 1 && (
                  <div style={{ position:'absolute', left:18, top:40, width:2, height:'calc(100% - 4px)', background:`${c.color}30`, zIndex:0 }} />
                )}
                {/* Step circle */}
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${c.color}18`, border:`2px solid ${c.color}60`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, zIndex:1 }}>
                  {c.icon}
                </div>
                <div style={{ paddingBottom:16, flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:c.color }}>{c.agency}</span>
                    <span style={{ fontSize:10, background:`${c.color}15`, color:c.color, padding:'1px 7px', borderRadius:6, fontWeight:600 }}>{c.role}</span>
                  </div>
                  <p style={{ fontSize:11, color:'#6B9A87', lineHeight:1.5 }}>{c.action}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Counter info */}
          <div style={{ marginTop:8, padding:'12px 14px', borderRadius:14, background:'linear-gradient(135deg,#F0FDF9,#EFF6FF)', border:'1.5px solid #A7D9C6' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#0F6E56', marginBottom:6 }}>🏥 เคาน์เตอร์รับของใกล้บ้าน</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#1A2E28' }}>{center?.name}</p>
            <p style={{ fontSize:11, color:'#6B9A87', marginTop:2 }}>{center?.addr}</p>
            <p style={{ fontSize:11, color:'#6B9A87' }}>โทร: {center?.tel}</p>
          </div>
        </div>

        {/* ── PANEL 2: Nurse Task Board ───────────── */}
        <div className="glass-card" style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>📋</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Nurse Task Board</p>
              <p style={{ fontSize:11, color:'#9BBCAF' }}>SOP บทที่ ๓ ขั้นตอน ๑–๓</p>
            </div>
            <span style={{ fontSize:13, fontWeight:900, color: doneCount === NURSE_TASKS.length ? '#0F6E56' : '#6366F1' }}>
              {doneCount}/{NURSE_TASKS.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height:6, borderRadius:999, background:'#E8F0ED', overflow:'hidden', marginBottom:16 }}>
            <div style={{ height:'100%', width:`${(doneCount/NURSE_TASKS.length)*100}%`, background:'linear-gradient(90deg,#6366F1,#0F6E56)', borderRadius:999, transition:'width 0.5s' }} />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {NURSE_TASKS.map((t, i) => {
              const done = !!taskMap[t.id];
              return (
                <div key={t.id} onClick={() => toggleTask(t.id)}
                  style={{
                    display:'flex', alignItems:'flex-start', gap:12, padding:'12px 14px',
                    borderRadius:14, cursor:'pointer',
                    background: done ? '#F0FDF9' : '#FAFCFB',
                    border:`1.5px solid ${done ? '#0F6E5650' : '#E8F0ED'}`,
                    transition:'all 0.2s',
                  }}>
                  <div style={{
                    width:24, height:24, borderRadius:8, flexShrink:0, marginTop:1,
                    background: done ? '#0F6E56' : 'white',
                    border:`2px solid ${done ? '#0F6E56' : '#C4D9D0'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.2s',
                  }}>
                    {done && <span style={{ color:'white', fontSize:13, fontWeight:800 }}>✓</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                      <span style={{ fontSize:14 }}>{t.icon}</span>
                      <span style={{ fontSize:12, fontWeight:700, color: done ? '#0F6E56' : '#1A2E28', textDecoration: done ? 'line-through' : 'none' }}>{t.label}</span>
                      <span style={{ fontSize:10, background:'#EFF6FF', color:'#3B82F6', padding:'1px 7px', borderRadius:6, fontWeight:600, marginLeft:'auto', flexShrink:0 }}>{t.sop}</span>
                    </div>
                    <p style={{ fontSize:11, color:'#9BBCAF', lineHeight:1.5 }}>{t.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {doneCount === NURSE_TASKS.length && (
            <div className="anim-pop-in" style={{ marginTop:14, padding:'10px 14px', borderRadius:12, background:'linear-gradient(135deg,#F0FDF9,#DCFCE7)', border:'1.5px solid #0F6E5640', textAlign:'center' }}>
              <p style={{ fontWeight:800, color:'#0F6E56', fontSize:13 }}>✅ ครบทุกขั้นตอน SOP แล้ว</p>
              <p style={{ fontSize:11, color:'#6B9A87', marginTop:2 }}>Care Plan ส่งไป Program 3C กรมอนามัยแล้ว</p>
            </div>
          )}
        </div>

        {/* ── PANEL 3: Delivery Tracking ──────────── */}
        <div className="glass-card" style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#F59E0B,#EF4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>📦</div>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:'#1A2E28' }}>Delivery Tracking</p>
              <p style={{ fontSize:11, color:'#9BBCAF' }}>ติดตามจัดส่งถึงเคาน์เตอร์</p>
            </div>
          </div>

          {!hasDelivery ? (
            <div style={{ textAlign:'center', padding:'32px 16px', color:'#9BBCAF' }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📋</div>
              <p style={{ fontSize:13, fontWeight:600 }}>ไม่มีรายการจัดส่ง</p>
              <p style={{ fontSize:11, marginTop:4 }}>Tier {tier} ไม่มีสิทธิ์ผ้าอ้อม/อุปกรณ์จัดส่ง</p>
            </div>
          ) : delivStatus === null ? (
            <div style={{ textAlign:'center', padding:'32px 16px', color:'#9BBCAF' }}>
              <p style={{ fontSize:13 }}>ยังไม่มี Work Order</p>
            </div>
          ) : (
            <>
              {/* Item info */}
              <div style={{ padding:'12px 14px', borderRadius:14, background:'#F8FAFC', border:'1.5px solid #E8F0ED', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:28 }}>{hasDiaper ? '🧻' : '🛏️'}</span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:13, color:'#1A2E28' }}>
                      {hasDiaper ? 'ผ้าอ้อมฟรี — 3 ชิ้น/วัน (กปท.)' : 'อุปกรณ์ชั่วคราว (กองทุนฟื้นฟู)'}
                    </p>
                    <p style={{ fontSize:11, color:'#6B9A87' }}>ปลายทาง: {center?.name}</p>
                  </div>
                </div>
              </div>

              {/* Status steps */}
              <div style={{ display:'flex', alignItems:'center', marginBottom:16, gap:0 }}>
                {DELIVERY_STEPS.map((s, i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
                    {i > 0 && (
                      <div style={{ position:'absolute', left:0, top:16, width:'50%', height:3, background: i <= delivStatus ? DELIVERY_STEPS[i].color : '#E8F0ED', transition:'background 0.4s' }} />
                    )}
                    {i < DELIVERY_STEPS.length - 1 && (
                      <div style={{ position:'absolute', right:0, top:16, width:'50%', height:3, background: i < delivStatus ? DELIVERY_STEPS[i+1].color : '#E8F0ED', transition:'background 0.4s' }} />
                    )}
                    <div style={{
                      width:34, height:34, borderRadius:'50%', zIndex:1,
                      background: i <= delivStatus ? s.color : '#E8F0ED',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: i <= delivStatus ? 16 : 12,
                      transition:'all 0.4s',
                      boxShadow: i === delivStatus ? `0 0 0 4px ${s.color}30` : 'none',
                    }}>
                      {i <= delivStatus ? s.icon : <span style={{ color:'#C4D9D0', fontWeight:700 }}>{i+1}</span>}
                    </div>
                    <p style={{ fontSize:9, fontWeight:600, color: i <= delivStatus ? s.color : '#C4D9D0', marginTop:4, textAlign:'center', lineHeight:1.3, maxWidth:54 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Current status highlight */}
              <div style={{ padding:'12px 14px', borderRadius:14, background:`${DELIVERY_STEPS[delivStatus].color}12`, border:`1.5px solid ${DELIVERY_STEPS[delivStatus].color}40`, marginBottom:14, textAlign:'center' }}>
                <p style={{ fontSize:24 }}>{DELIVERY_STEPS[delivStatus].icon}</p>
                <p style={{ fontWeight:800, fontSize:14, color:DELIVERY_STEPS[delivStatus].color }}>{DELIVERY_STEPS[delivStatus].label}</p>
              </div>

              {/* PIN code section */}
              {delivStatus >= 1 && delivStatus < 4 && (
                <div style={{ padding:'12px 14px', borderRadius:14, background:'#1A2E28', marginBottom:14 }}>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontWeight:700, letterSpacing:'0.8px', marginBottom:6 }}>PIN รับของที่เคาน์เตอร์</p>
                  <p style={{ fontSize:32, fontWeight:900, letterSpacing:8, color:'#4ADE80', fontFamily:'monospace' }}>
                    {PINS[selId] || '------'}
                  </p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:4 }}>แจ้ง PIN นี้กับเจ้าหน้าที่เคาน์เตอร์ {center?.name}</p>
                </div>
              )}

              {/* Confirm receipt at counter */}
              {delivStatus === 3 && !pinSuccess[selId] && (
                <div style={{ marginBottom:14 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#8B5CF6', marginBottom:8 }}>🏥 กรอก PIN เพื่อยืนยันรับของที่เคาน์เตอร์</p>
                  <div style={{ display:'flex', gap:8 }}>
                    <input
                      type="text" maxLength={6} value={pinInput}
                      onChange={e => setPinInput(e.target.value.replace(/\D/g,''))}
                      placeholder="000000"
                      style={{
                        flex:1, padding:'10px 14px', borderRadius:12, fontSize:18,
                        fontWeight:800, letterSpacing:6, fontFamily:'monospace',
                        border:`2px solid ${pinError ? '#EF4444' : '#E8F0ED'}`,
                        background: pinError ? '#FFF1F2' : 'white',
                        outline:'none', transition:'border 0.2s',
                      }}
                    />
                    <button onClick={confirmPin}
                      style={{ padding:'10px 18px', borderRadius:12, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, background:'linear-gradient(135deg,#8B5CF6,#6366F1)', color:'white' }}>
                      ยืนยัน
                    </button>
                  </div>
                  {pinError && <p style={{ fontSize:11, color:'#EF4444', marginTop:5, fontWeight:600 }}>❌ PIN ไม่ถูกต้อง กรุณาลองใหม่</p>}
                </div>
              )}

              {/* Success */}
              {delivStatus === 4 && (
                <div className="anim-pop-in" style={{ padding:'14px', borderRadius:14, background:'linear-gradient(135deg,#F0FDF9,#DCFCE7)', border:'1.5px solid #0F6E5640', textAlign:'center', marginBottom:14 }}>
                  <p style={{ fontSize:24 }}>✅</p>
                  <p style={{ fontWeight:800, color:'#0F6E56', fontSize:14 }}>รับของสำเร็จแล้ว!</p>
                  <p style={{ fontSize:11, color:'#6B9A87', marginTop:2 }}>จัดส่งเสร็จสมบูรณ์ — {center?.name}</p>
                </div>
              )}

              {/* Demo advance button */}
              {delivStatus < 4 && (
                <button onClick={advanceDelivery}
                  style={{ width:'100%', padding:'10px', borderRadius:12, border:'1.5px dashed #C4D9D0', background:'transparent', color:'#9BBCAF', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  ▶ Demo: เลื่อนสถานะถัดไป
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Summary stats ─────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginTop:20 }}>
        {[
          { icon:'📦', label:'Orders ที่กำลังจัดส่ง', value: Object.values(delivery).filter(s => s >= 1 && s <= 2).length, color:'#3B82F6' },
          { icon:'🏥', label:'ถึงเคาน์เตอร์แล้ว',    value: Object.values(delivery).filter(s => s === 3).length, color:'#8B5CF6' },
          { icon:'✅', label:'รับของแล้ว',            value: Object.values(delivery).filter(s => s === 4).length, color:'#0F6E56' },
          { icon:'📋', label:'Task เสร็จ (ทุกเคส)',   value: Object.values(tasks).flatMap(t => Object.values(t)).filter(Boolean).length, color:'#6366F1' },
        ].map((m, i) => (
          <div key={i} style={{ padding:'18px 16px', background:'rgba(255,255,255,0.88)', backdropFilter:'blur(12px)', border:`1px solid ${m.color}20`, borderRadius:20, textAlign:'center', boxShadow:'0 4px 24px rgba(15,110,86,0.07)' }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{m.icon}</div>
            <div style={{ fontSize:28, fontWeight:900, color:m.color }}>{m.value}</div>
            <div style={{ fontSize:12, fontWeight:600, color:'#4B7A6A', marginTop:2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
