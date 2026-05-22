'use client';
import { createContext, useContext, useReducer } from 'react';

/* ── ICD → Welfare mapping ─────────────────── */
export const ICD_MAP = {
  // Tier: STROKE_DEPENDENT — I63 (Cerebral infarction) ADL ≤ 6, TTL 180 days
  I63: { state:'active', tier:'STROKE_DEPENDENT', adlThreshold:6, ttl:180, benefits:[{icon:'🧻',name:'ผ้าอ้อมฟรี',detail:'3 ชิ้น/วัน (กปท.)',badge:'badge-green'},{icon:'👤',name:'Caregiver',detail:'6,000–10,442 บาท/ปี',badge:'badge-blue'},{icon:'🛏️',name:'อุปกรณ์การแพทย์',detail:'ยืมเตียง/รถเข็นฟรี',badge:'badge-teal'}] },
  // Tier: STROKE_SEQUELAE — I69 (Sequelae of stroke) ADL ≤ 8, TTL 180 days
  I69: { state:'active', tier:'STROKE_SEQUELAE', adlThreshold:8, ttl:180, benefits:[{icon:'🧻',name:'ผ้าอ้อมฟรี',detail:'3 ชิ้น/วัน (กปท.)',badge:'badge-green'},{icon:'👤',name:'Caregiver',detail:'6,000–10,442 บาท/ปี',badge:'badge-blue'},{icon:'💊',name:'Palliative Care',detail:'3,000 บาท/6 เดือน',badge:'badge-purple'}] },
  // Tier: CARDIAC_DEPENDENT — I50 (Heart failure) ADL ≤ 8
  I50: { state:'active', tier:'CARDIAC_DEPENDENT', adlThreshold:8, ttl:180, benefits:[{icon:'🧻',name:'ผ้าอ้อมฟรี',detail:'3 ชิ้น/วัน',badge:'badge-green'},{icon:'👤',name:'Caregiver',detail:'6,000–10,442 บาท/ปี',badge:'badge-blue'},{icon:'💊',name:'Palliative Care',detail:'3,000 บาท/6 เดือน',badge:'badge-purple'}] },
  // Tier: DEMENTIA_LONGTERM — F01/F03 ADL ≤ 8, locked (Dementia Protocol)
  F01: { state:'active', tier:'DEMENTIA_LONGTERM', adlThreshold:8, locked:true, benefits:[{icon:'👤',name:'Care Plan (LTC Fund)',detail:'ล็อกถาวร — ต้องยืนยันก่อนระงับ',badge:'badge-blue'},{icon:'🛏️',name:'อุปกรณ์การแพทย์',detail:'ยืมเตียง/รถเข็นฟรี',badge:'badge-teal'},{icon:'🧻',name:'ผ้าอ้อมฟรี',detail:'3 ชิ้น/วัน',badge:'badge-green'}] },
  F03: { state:'active', tier:'DEMENTIA_LONGTERM', adlThreshold:8, locked:true, benefits:[{icon:'👤',name:'Care Plan (LTC Fund)',detail:'ล็อกถาวร — ต้องยืนยันก่อนระงับ',badge:'badge-blue'},{icon:'🛏️',name:'อุปกรณ์การแพทย์',detail:'ยืมเตียง/รถเข็นฟรี',badge:'badge-teal'},{icon:'🧻',name:'ผ้าอ้อมฟรี',detail:'3 ชิ้น/วัน',badge:'badge-green'}] },
  // Tier: FRACTURE_TEMPORARY — S72 (Femur fracture) ADL ≤ 8, TTL 90 days
  S72: { state:'active', tier:'FRACTURE_TEMPORARY', adlThreshold:8, ttl:90, benefits:[{icon:'🛏️',name:'อุปกรณ์ชั่วคราว',detail:'เตียง/รถเข็น 90 วัน',badge:'badge-orange'},{icon:'🏃',name:'กายภาพบำบัด',detail:'ที่บ้านโดย อสม.',badge:'badge-blue'}] },
  M17: { state:'eligible', tier:'CHRONIC', benefits:[{icon:'🩺',name:'ตรวจสุขภาพประจำปี',detail:'ฟรีทุกปี',badge:'badge-green'},{icon:'💊',name:'ยาแก้ปวดข้อ',detail:'สิทธิ์บัตรทอง',badge:'badge-teal'}] },
  E11: { state:'eligible', tier:'CHRONIC', benefits:[{icon:'🩺',name:'ตรวจสุขภาพประจำปี',detail:'ฟรีทุกปี',badge:'badge-green'},{icon:'💊',name:'ยาเบาหวาน',detail:'สิทธิ์บัตรทอง',badge:'badge-teal'}] },
};

export function matchIcd(code) {
  return ICD_MAP[code?.slice(0,3)] || null;
}

/* ── Initial state ─────────────────────────── */
const INIT = {
  patients: {
    P001:{ name:'นาย สมชาย ใจดี',   age:72, icon:'👴', addr:'88 ถ.พระราม 2 บางขุนเทียน', state:'active',    icd:'I63.9', adl:3,  ttl:162, locked:false, benefits:ICD_MAP.I63.benefits, timeline:[{date:'20 พ.ค. 2568',event:'ICD-10: I63.9 บันทึกโดยแพทย์ (Tier: STROKE_DEPENDENT)',type:'ok'},{date:'20 พ.ค. 2568',event:'Eligible → Active (TTL 180 วัน)',type:'ok'}] },
    P002:{ name:'นาง มาลี รักสุข',   age:68, icon:'👵', addr:'22 ซ.สวนพลู ราษฎร์บูรณะ',  state:'eligible',  icd:'M17.1', adl:14, ttl:null, locked:false, benefits:ICD_MAP.M17.benefits, timeline:[] },
    P003:{ name:'นาย วิชัย ศรีสุข',  age:80, icon:'👴', addr:'7/1 ซ.บางปะกอก',            state:'active',    icd:'I50.0', adl:6,  ttl:162, locked:false, benefits:ICD_MAP.I50.benefits, timeline:[] },
    P004:{ name:'นาง สุนีย์ แก้วใส', age:75, icon:'👵', addr:'15/3 ซ.วัดสิงห์ บางมด',     state:'suspended', icd:'S72.0', adl:9,  ttl:72,  locked:false, benefits:ICD_MAP.S72.benefits, timeline:[{date:'15 พ.ค. 2568',event:'ICD-10: S72.0 (Tier: FRACTURE_TEMPORARY) TTL 90 วัน',type:'ok'},{date:'21 พ.ค. 2568',event:'Suspended — รอรีวิว ADL (บัญชีปิด)',type:'warn'}] },
    P005:{ name:'นาย ประยุทธ์ ดีงาม',age:65, icon:'👴', addr:'44 ถ.สุขสวัสดิ์ บางมด',     state:'active',    icd:'F03',   adl:5,  ttl:null, locked:true,  benefits:ICD_MAP.F03.benefits, timeline:[] },
  },
  alerts:[
    { id:'A001', type:'urgent', icon:'🚨', title:'บัญชีธนาคารปิด — PromptPay โอนไม่ผ่าน', patient:'นาง สุนีย์ แก้วใส', patientId:'P004', addr:'15/3 ซ.วัดสิงห์ บางมด', action:'ไปผูก PromptPay + ยืนยันตัวตน', status:'pending', time:'10 นาทีที่แล้ว' },
    { id:'A002', type:'review', icon:'⏰', title:'TTL ครบกำหนด — รีวิว ADL', patient:'นาย สมชาย ใจดี', patientId:'P001', addr:'88 ถ.พระราม 2 บางขุนเทียน', action:'ประเมิน Barthel ADL', status:'pending', time:'1 ชั่วโมงที่แล้ว' },
  ],
  savedCount: 2,
};

/* ── Reducer ───────────────────────────────── */
function reducer(state, action) {
  const now = new Date().toLocaleString('th-TH',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  switch(action.type) {

    case 'SAVE_ICD': {
      const { patientId, patientName, icdCodes, addr } = action.payload;
      let welfare = null, matchedIcd = null;
      for (const c of icdCodes) { const w = matchIcd(c); if (w) { welfare=w; matchedIcd=c; break; } }
      if (!welfare) return state;

      const newAlerts = [...state.alerts];
      const dependentTiers = ['STROKE_DEPENDENT','STROKE_SEQUELAE','DEMENTIA_LONGTERM','CARDIAC_DEPENDENT'];
      if (dependentTiers.includes(welfare.tier)) {
        newAlerts.unshift({ id:`A${Date.now()}`, type:'urgent', icon:'🏥', title:`ผู้ป่วยพึ่งพิงรายใหม่ — Tier: ${welfare.tier}`, patient:patientName, patientId, addr, action:'เยี่ยมบ้านครั้งแรก + ลงทะเบียนสิทธิ์', status:'pending', time:'เพิ่งสร้าง' });
      }
      if (welfare.ttl) {
        newAlerts.push({ id:`A${Date.now()+1}`, type:'review', icon:'⏰', title:`TTL ${welfare.ttl} วัน — จัดการรีวิว ADL`, patient:patientName, patientId, addr, action:`รีวิว ADL หลัง ${welfare.ttl} วัน`, status:'pending', time:`ครบกำหนดใน ${welfare.ttl} วัน` });
      }

      return {
        ...state,
        patients: { ...state.patients, [patientId]: { ...state.patients[patientId], state:welfare.state, icd:matchedIcd, locked:!!welfare.locked, ttl:welfare.ttl||null, benefits:welfare.benefits, timeline:[{date:now,event:`ICD-10: ${matchedIcd} บันทึกจาก AI Coder`,type:'ok'},{date:now,event:`Tier: ${welfare.tier} → State: ${welfare.state==='active'?'Active':'Eligible'}`,type:'ok'},...(state.patients[patientId]?.timeline||[])] } },
        alerts: newAlerts,
        savedCount: state.savedCount + 1,
      };
    }

    case 'SET_STATE': {
      const p = state.patients[action.patientId];
      const isWarn = action.newState === 'suspended' || action.newState === 'terminated';
      const stateLabel = { pending:'Pending', eligible:'Eligible', active:'Active', suspended:'Suspended', renewed:'Renewed', terminated:'Terminated' }[action.newState] || action.newState;
      return { ...state, patients: { ...state.patients, [action.patientId]: { ...p, state:action.newState, timeline:[{date:now,event:`สถานะเปลี่ยนเป็น: ${stateLabel}`,type:isWarn?'warn':'ok'},...(p.timeline||[])] } } };
    }

    case 'UPDATE_ADL': {
      const p = state.patients[action.patientId];
      return { ...state, patients: { ...state.patients, [action.patientId]: { ...p, adl:action.adl, timeline:[{date:now,event:`อสม. อัปเดต ADL Score: ${action.adl}/20`,type:'ok'},...(p.timeline||[])] } } };
    }

    case 'ACCEPT_ALERT':
      return { ...state, alerts: state.alerts.map(a => a.id===action.id ? {...a,status:'accepted'} : a) };

    case 'CLOSE_ALERT':
      return { ...state, alerts: state.alerts.map(a => a.id===action.id ? {...a,status:'done'} : a) };

    default: return state;
  }
}

/* ── Context ───────────────────────────────── */
const Ctx = createContext(null);

export function WelfareProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INIT);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useWelfare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWelfare must be inside WelfareProvider');
  return ctx;
}
