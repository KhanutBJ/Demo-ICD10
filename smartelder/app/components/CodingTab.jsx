'use client';
import { useState, useRef } from 'react';
import { useWelfare, matchIcd } from '../context/WelfareContext';

const GROQ_ASR_KEY = process.env.NEXT_PUBLIC_GROQ_ASR_KEY;
const GROQ_LLM_KEY = process.env.NEXT_PUBLIC_GROQ_LLM_KEY;

const PATIENTS = [
  { id: 'P001', name: 'นาย สมชาย ใจดี',    age: 72, hn: 'HN-2024-001', condition: 'DM Type 2, HT',   icon: '👴', addr: '88 ถ.พระราม 2 บางขุนเทียน' },
  { id: 'P002', name: 'นาง มาลี รักสุข',    age: 68, hn: 'HN-2024-002', condition: 'Knee OA',         icon: '👵', addr: '22 ซ.สวนพลู ราษฎร์บูรณะ' },
  { id: 'P003', name: 'นาย วิชัย ศรีสุข',   age: 80, hn: 'HN-2024-003', condition: 'Heart Failure',   icon: '👴', addr: '7/1 ซ.บางปะกอก' },
  { id: 'P004', name: 'นาง สุนีย์ แก้วใส',  age: 75, hn: 'HN-2024-004', condition: 'Cataract',        icon: '👵', addr: '15/3 ซ.วัดสิงห์ บางมด' },
  { id: 'P005', name: 'นาย ประยุทธ์ ดีงาม', age: 65, hn: 'HN-2024-005', condition: 'HT, DM Type 2',   icon: '👴', addr: '44 ถ.สุขสวัสดิ์ บางมด' },
];

// Strip Qwen3 <think>...</think> tokens then extract JSON
function parseIcdResponse(raw) {
  const stripped = raw.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('ไม่พบ JSON ในคำตอบ AI');
  return JSON.parse(match[0]);
}

const confColor = (c) => c >= 85 ? '#0F6E56' : c >= 70 ? '#F59E0B' : '#EF4444';

const STAT_ITEMS = [
  { icon: '⚡', value: '95%',   label: 'ลดเวลา Coding',   sub: 'จาก 2-3 วัน → ทันที' },
  { icon: '🎯', value: '94.2%', label: 'ความแม่นยำ AI',   sub: 'เทียบ Expert coder' },
  { icon: '🚀', value: '100%',  label: 'ไร้คนกลาง',        sub: 'Doctor ยืนยันได้เลย' },
];

export default function CodingTab() {
  const { dispatch } = useWelfare();
  const [patient, setPatient]   = useState(PATIENTS[0]);
  const [note, setNote]         = useState('');
  const [recording, setRec]     = useState(false);
  const [transcribing, setTrans]= useState(false);
  const [coding, setCoding]     = useState(false);
  const [codes, setCodes]       = useState(null);
  const [selected, setSelected] = useState([]);
  const [status, setStatus]     = useState(null);
  const [saved, setSaved]       = useState(false);
  const [adlScore, setAdlScore]       = useState('');
  const [welfareAnim, setWelfareAnim] = useState(0);
  const [welfareUnlocked, setWelfareUnlocked] = useState([]);
  const mrRef     = useRef(null);
  const chunksRef = useRef([]);

  /* ── Recording ─────────────────────────────────────── */
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); transcribe(); };
      mrRef.current = mr;
      mr.start();
      setRec(true);
      setStatus({ type: 'info', msg: '🎙️ กำลังบันทึกเสียง... ปล่อยเพื่อหยุด' });
    } catch {
      setStatus({ type: 'err', msg: '❌ ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาต' });
    }
  };

  const stopRec = () => {
    if (mrRef.current && recording) { mrRef.current.stop(); setRec(false); setStatus(null); }
  };

  const transcribe = async () => {
    setTrans(true);
    setStatus({ type: 'info', msg: '🔄 กำลังถอดเสียงด้วย Whisper AI...' });
    try {
      const fd = new FormData();
      fd.append('file', new Blob(chunksRef.current, { type: 'audio/webm' }), 'rec.webm');
      fd.append('model', 'whisper-large-v3');
      fd.append('language', 'th');
      const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST', headers: { Authorization: `Bearer ${GROQ_ASR_KEY}` }, body: fd,
      });
      const d = await res.json();
      if (d.text) {
        setNote(p => p ? `${p} ${d.text}` : d.text);
        setStatus({ type: 'ok', msg: '✅ ถอดเสียงสำเร็จ — ตรวจสอบข้อความด้านล่าง' });
      } else {
        setStatus({ type: 'err', msg: `❌ ${d.error?.message || 'ถอดเสียงไม่สำเร็จ'}` });
      }
    } catch {
      setStatus({ type: 'err', msg: '❌ เชื่อมต่อ API ไม่สำเร็จ' });
    } finally { setTrans(false); }
  };

  /* ── ICD Suggest ───────────────────────────────────── */
  const suggestCodes = async () => {
    if (!note.trim()) { setStatus({ type: 'warn', msg: '⚠️ กรุณากรอก clinical note ก่อน' }); return; }
    setCoding(true); setCodes(null); setSaved(false); setSelected([]);
    setStatus({ type: 'info', msg: '🤖 AI กำลังวิเคราะห์และแนะนำ ICD-10...' });
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_LLM_KEY}` },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          messages: [
            {
              role: 'system',
              content: 'คุณคือผู้เชี่ยวชาญด้าน ICD-10 coding สำหรับระบบสาธารณสุขไทย เมื่อได้รับ clinical note ให้สกัด diagnosis แล้วแนะนำ ICD-10 code 3 อันดับแรกที่เหมาะสมที่สุด พร้อม confidence score (%) และเหตุผลสั้นๆ ตอบในรูปแบบ JSON เท่านั้น ห้ามมี markdown หรือ backtick: {"codes": [{"code": "", "description_th": "", "confidence": 0, "reason": ""}]}',
            },
            { role: 'user', content: `Clinical note: ${note}` },
          ],
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });
      const d = await res.json();
      const raw = d.choices?.[0]?.message?.content || '';
      const parsed = parseIcdResponse(raw);
      setCodes(parsed.codes);
      setStatus({ type: 'ok', msg: `✅ AI แนะนำ ${parsed.codes.length} รหัสสำเร็จ — คลิกเลือกรหัสที่ต้องการ` });
    } catch (e) {
      setStatus({ type: 'err', msg: `❌ วิเคราะห์ไม่สำเร็จ: ${e.message}` });
    } finally { setCoding(false); }
  };

  const toggleCode = (code) =>
    setSelected(p => p.includes(code) ? p.filter(c => c !== code) : [...p, code]);

  const saveHIS = () => {
    if (!selected.length) { setStatus({ type: 'warn', msg: '⚠️ เลือก ICD code อย่างน้อย 1 รายการ' }); return; }
    setSaved(true);
    setStatus({ type: 'ok', msg: `✅ บันทึก ${selected.length} รหัสลง HIS สำเร็จ! ไม่ต้องรอนักจัดรหัส` });
    // Collect welfare benefits
    const seen = new Set();
    const benefits = [];
    for (const code of selected) {
      const w = matchIcd(code);
      if (w) w.benefits.forEach(b => { if (!seen.has(b.name)) { seen.add(b.name); benefits.push(b); } });
    }
    setWelfareUnlocked(benefits);
    // Tokenization animation
    setWelfareAnim(0);
    setTimeout(() => setWelfareAnim(1), 700);
    setTimeout(() => setWelfareAnim(2), 1500);
    setTimeout(() => setWelfareAnim(3), 2300);
    // Dispatch to global context
    dispatch({ type:'SAVE_ICD', payload:{ patientId:patient.id, patientName:patient.name, icdCodes:selected, addr:patient.addr, adl: adlScore !== '' ? Number(adlScore) : undefined } });
  };

  const adlNum = adlScore !== '' ? Number(adlScore) : null;
  const adlLabel = adlNum === null ? null : adlNum <= 6 ? '🔴 ติดเตียง' : adlNum <= 12 ? '🟡 ติดบ้าน' : '🟢 ช่วยตัวเองได้';
  const adlColor = adlNum === null ? null : adlNum <= 6 ? '#991B1B' : adlNum <= 12 ? '#92400E' : '#166534';
  const adlBg    = adlNum === null ? null : adlNum <= 6 ? '#FEE2E2' : adlNum <= 12 ? '#FEF3C7' : '#DCFCE7';

  const resetPatient = (p) => { setPatient(p); setCodes(null); setNote(''); setSaved(false); setStatus(null); setSelected([]); setAdlScore(''); setWelfareAnim(0); setWelfareUnlocked([]); };

  const statusClass = status?.type === 'ok' ? 'status-ok' : status?.type === 'err' ? 'status-err' : status?.type === 'warn' ? 'status-warn' : 'status-info';

  return (
    <div>
      {/* ── Patient chips ───────────────────────────────── */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9BBCAF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
          เลือกผู้ป่วย
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PATIENTS.map(p => (
            <button key={p.id} onClick={() => resetPatient(p)}
              className={`patient-chip touch-active${patient.id === p.id ? ' active' : ''}`}>
              {p.icon} {p.name.split(' ')[1]} · {p.age} ปี
            </button>
          ))}
        </div>
      </div>

      {/* ── Patient banner ──────────────────────────────── */}
      <div className="patient-banner" style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg,#0a3d2e 0%,#0F6E56 60%,#17A97E 100%)',
        padding: '18px 24px',
        marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: '0 6px 28px rgba(15,110,86,0.28)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{
          width: 52, height: 52, borderRadius: 16, flexShrink: 0,
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}>{patient.icon}</div>

        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>{patient.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
            {patient.hn} &nbsp;·&nbsp; อายุ {patient.age} ปี &nbsp;·&nbsp; {patient.condition}
          </div>
        </div>

        {saved && (
          <div style={{
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
            borderRadius: 12, padding: '8px 16px',
            color: 'white', fontWeight: 700, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.3)',
          }} className="anim-pop-in">
            ✅ HIS Updated
          </div>
        )}
      </div>

      {/* ── Two-column layout ───────────────────────────── */}
      <div className="responsive-grid-2">

        {/* LEFT ── Clinical note */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#0F6E56,#17A97E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📝</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1A2E28' }}>บันทึกทางคลินิก</span>
            </div>

            {/* Mic button */}
            <button
              onMouseDown={startRec} onMouseUp={stopRec}
              onTouchStart={startRec} onTouchEnd={stopRec}
              disabled={transcribing}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                border: 'none', cursor: transcribing ? 'wait' : 'pointer',
                background: recording
                  ? 'linear-gradient(135deg,#DC2626,#EF4444)'
                  : 'linear-gradient(135deg,#0F6E56,#17A97E)',
                color: 'white',
                boxShadow: recording
                  ? '0 4px 16px rgba(220,38,38,0.4)'
                  : '0 4px 16px rgba(15,110,86,0.3)',
                transition: 'all 0.2s',
              }}>
              {recording && <span className="recording-ring" />}
              {recording
                ? <><span className="recording-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'white', display: 'inline-block' }} /><span>ปล่อยเพื่อหยุด</span></>
                : transcribing
                  ? <><span className="spinner" /><span>กำลังถอด...</span></>
                  : <><span>🎤</span><span>กดค้างพูด</span></>
              }
            </button>
          </div>

          <textarea
            className="clinical-textarea"
            style={{ height: 180 }}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="พิมพ์หรือพูด clinical note ที่นี่...&#10;&#10;เช่น: ผู้ป่วยชายอายุ 72 ปี มาด้วยอาการปวดหัวเข่าข้างขวาเรื้อรัง 3 เดือน เดินลำบาก ตรวจพบ crepitus บริเวณ knee joint น้ำหนักเกิน BMI 28"
          />

          {/* ADL Score input */}
          <div style={{ marginTop:14, padding:'12px 14px', borderRadius:14, background:'#F8FAFC', border:'1.5px solid #E8F0ED' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#9BBCAF', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8 }}>
              Barthel ADL Score (พยาบาลบันทึก) — เงื่อนไข Trigger สิทธิ์
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <input
                type="number" min="0" max="20"
                className="field-input"
                style={{ width:72 }}
                value={adlScore}
                onChange={e => setAdlScore(e.target.value)}
                placeholder="0–20"
              />
              {adlLabel && (
                <div style={{ padding:'5px 14px', borderRadius:10, fontSize:13, fontWeight:700, background:adlBg, color:adlColor }}>
                  {adlLabel}
                </div>
              )}
              {!adlScore && (
                <span style={{ fontSize:12, color:'#C4D9D0' }}>ยังไม่ได้กรอก (สิทธิ์อาจไม่ถูก trigger)</span>
              )}
            </div>
          </div>

          {/* Status */}
          {status && (
            <div className={`status-msg ${statusClass} anim-slide-right`} style={{ marginTop: 12 }}>
              <span style={{ lineHeight: 1.5, flexShrink: 0 }}>
                {status.type === 'ok' ? '✅' : status.type === 'err' ? '❌' : status.type === 'warn' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{status.msg.replace(/^[✅❌⚠️ℹ️🎙️🔄🤖]\s*/, '')}</span>
            </div>
          )}

          {/* Submit */}
          <button onClick={suggestCodes} disabled={coding || transcribing || !note.trim()}
            className="btn-primary touch-active"
            style={{ marginTop: 14, width: '100%', padding: '13px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {coding
              ? <><span className="spinner" /><span>AI กำลังวิเคราะห์...</span></>
              : '🤖 ให้ AI แนะนำ ICD-10 Code'}
          </button>
        </div>

        {/* RIGHT ── ICD suggestions */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#0F6E56,#17A97E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🏷️</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1A2E28' }}>AI แนะนำ ICD-10 Codes</span>
            {codes && <span className="badge badge-teal" style={{ marginLeft: 'auto' }}>{codes.length} รหัส</span>}
          </div>

          {/* Empty state */}
          {!codes && !coding && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: 12 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg,#F0FDF9,#DCFCE7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
                border: '2px dashed #A7D9C6',
              }}>🔍</div>
              <p style={{ color: '#9BBCAF', fontSize: 14, textAlign: 'center', lineHeight: 1.6 }}>
                กรอก clinical note แล้วกด<br /><strong style={{ color: '#0F6E56' }}>"ให้ AI แนะนำ ICD-10 Code"</strong>
              </p>
            </div>
          )}

          {/* Skeleton */}
          {coding && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ padding: 16, borderRadius: 16, border: '2px solid #E8F0ED', background: '#FAFCFB' }}>
                  <div className="shimmer-bar" style={{ height: 14, borderRadius: 8, width: '35%', marginBottom: 10 }} />
                  <div className="shimmer-bar" style={{ height: 12, borderRadius: 8, width: '65%', marginBottom: 8 }} />
                  <div className="shimmer-bar" style={{ height: 8, borderRadius: 8, width: '100%' }} />
                </div>
              ))}
            </div>
          )}

          {/* ICD Cards */}
          {codes && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }} className="anim-fade-up">
              {codes.map((c, i) => (
                <div key={i} onClick={() => toggleCode(c.code)}
                  className={`icd-card touch-active${selected.includes(c.code) ? ' selected' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: 18, color: '#0F6E56', fontFamily: 'Inter, monospace' }}>{c.code}</span>
                      <span className="badge" style={{
                        background: confColor(c.confidence) + '20',
                        color: confColor(c.confidence),
                        border: `1px solid ${confColor(c.confidence)}40`,
                      }}>{c.confidence}% confident</span>
                      {selected.includes(c.code) && <span className="badge badge-teal anim-pop-in">✓ เลือกแล้ว</span>}
                    </div>
                    <span style={{ color: '#C4D9D0', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>#{i+1}</span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1A2E28', marginBottom: 8 }}>{c.description_th}</p>
                  {/* Confidence bar */}
                  <div style={{ width: '100%', height: 5, borderRadius: 999, background: '#E8F0ED', overflow: 'hidden', marginBottom: 7 }}>
                    <div className="conf-bar" style={{ '--w': `${c.confidence}%`, background: `linear-gradient(90deg,${confColor(c.confidence)}80,${confColor(c.confidence)})` }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#6B9A87', lineHeight: 1.5 }}>{c.reason}</p>
                  {/* ADL threshold check */}
                  {adlNum !== null && (() => {
                    const w = matchIcd(c.code);
                    if (!w?.adlThreshold) return null;
                    const met = adlNum <= w.adlThreshold;
                    return (
                      <div style={{ marginTop:6, fontSize:11, fontWeight:700, color: met ? '#0F6E56' : '#DC2626', background: met ? '#F0FDF9' : '#FEF2F2', borderRadius:8, padding:'4px 10px', display:'inline-block' }}>
                        {met ? `✅ ADL ${adlNum} ≤ ${w.adlThreshold} — threshold ผ่าน → Tier: ${w.tier}` : `❌ ADL ${adlNum} > ${w.adlThreshold} — ไม่ถึงเกณฑ์ (Tier: ${w.tier})`}
                      </div>
                    );
                  })()}
                </div>
              ))}

              {/* Save button */}
              <button onClick={saveHIS}
                className={`touch-active ${selected.length ? 'btn-primary' : ''}`}
                style={{
                  marginTop: 4, padding: '13px', fontSize: 14, fontWeight: 700,
                  borderRadius: 14, border: 'none', cursor: selected.length ? 'pointer' : 'not-allowed',
                  background: selected.length ? undefined : '#E8F0ED',
                  color: selected.length ? undefined : '#9BBCAF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}>
                {saved
                  ? '✅ บันทึก HIS สำเร็จแล้ว!'
                  : `💾 ยืนยันและบันทึกลง HIS (${selected.length} รายการ)`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Welfare Unlock Panel ───────────────────── */}
      {saved && (
        <div className="glass-card anim-fade-up" style={{ marginTop:20, padding:22 }}>
          <p style={{ fontWeight:800, fontSize:15, color:'#0F6E56', marginBottom:14 }}>🔗 PWL — กำลังส่งสัญญาณสิทธิ์</p>
          {/* Tokenization steps */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
            {[
              { label:'SHA-256 เข้ารหัส', icon:'🔒' },
              { label:'ส่ง mTLS → DGA', icon:'☁️' },
              { label:'สิทธิ์ถูกปลดล็อก!', icon:'✅' },
            ].map((step, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background: welfareAnim > i ? '#F0FDF9' : '#F8FAFC', border:`1.5px solid ${welfareAnim > i ? '#0F6E56' : '#E8F0ED'}`, transition:'all 0.4s' }}>
                <span>{welfareAnim > i ? step.icon : '⏳'}</span>
                <span style={{ fontSize:12, fontWeight:600, color: welfareAnim > i ? '#0F6E56' : '#9BBCAF' }}>{step.label}</span>
              </div>
            ))}
          </div>
          {/* Benefits */}
          {welfareAnim >= 3 && welfareUnlocked.length > 0 && (
            <div className="anim-fade-up">
              <p style={{ fontSize:12, color:'#9BBCAF', marginBottom:10 }}>สิทธิ์ที่ถูกปลดล็อกจาก ICD-10 ส่งไปยัง สปสช./อปท. แล้ว</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {welfareUnlocked.map((b, i) => (
                  <div key={i} className="benefit-chip">
                    <span style={{ fontSize:20 }}>{b.icon}</span>
                    <div><p style={{ fontWeight:700, fontSize:13, color:'#1A2E28' }}>{b.name}</p><p style={{ fontSize:11, color:'#6B9A87' }}>{b.detail}</p></div>
                    <span className={`badge ${b.badge}`} style={{ marginLeft:'auto' }}>ปลดล็อกแล้ว</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {welfareAnim >= 3 && welfareUnlocked.length === 0 && (
            <p style={{ fontSize:12, color:'#9BBCAF' }}>รหัส ICD ที่เลือกไม่ตรงกับเงื่อนไขสิทธิ์พิเศษ — อยู่ในสิทธิ์บัตรทองปกติ</p>
          )}
        </div>
      )}

      {/* ── Stat row ────────────────────────────────────── */}
      <div className="responsive-grid-3" style={{ marginTop: 20 }}>
        {STAT_ITEMS.map((s, i) => (
          <div key={i} style={{
            padding: '20px 16px', textAlign: 'center',
            background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(15,110,86,0.1)', borderRadius: 20,
            boxShadow: '0 4px 24px rgba(15,110,86,0.07)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#0F6E56,#17A97E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A2E28', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#9BBCAF', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
