'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';

const TOOLS = [
  { id: 'adl', label: 'ประเมิน ADL', desc: 'Barthel Index Scoring' },
  { id: 'careplan', label: 'ร่าง Care Plan', desc: 'แผนดูแล 3C (LTC)' },
  { id: 'rights', label: 'เช็คสิทธิ์ผ้าอ้อม LTC', desc: 'ตรวจสอบคุณสมบัติ' },
  { id: 'policy', label: 'ค้นหาระเบียบ สปสช.', desc: 'เงื่อนไขเบิกจ่าย' },
];

const EXAMPLES = {
  adl: "ตาหวัง อายุ 78 ปี ป่วย Stroke\n- กินอาหาร: ต้องป้อน (0)\n- ลุกนั่ง: ต้องมีคนพยุง 1 คน (5)\n- กลั้นปัสสาวะ/อุจจาระ: ไม่ได้เลย ใส่แพมเพิสตลอด (0/0)\n- การเดิน: เดินไม่ได้ ติดเตียง (0)\n- อาบน้ำ/แต่งตัว: ทำเองไม่ได้ (0)\nรบกวนประเมินคะแนน ADL ให้หน่อย",
  careplan: "ผู้ป่วยติดเตียง ADL 3/20 มีปัญหาอั้นขับถ่ายไม่ได้ ญาติทำความสะอาดไม่ทัน เสี่ยงเกิดแผลกดทับที่ก้นกบ ขอร่าง Care Plan สำหรับเบิกผ้าอ้อมผู้ใหญ่ สปสช. 3 ชิ้นต่อวัน",
  rights: "ผู้ป่วย ADL 4 กลั้นปัสสาวะไม่ได้ มีสิทธิ์ได้ผ้าอ้อมไหม?",
  policy: "ระเบียบการเบิกผ้าอ้อมผู้ใหญ่ปีล่าสุด กำหนดให้เบิกได้กี่ชิ้นต่อวัน?",
};

export default function CMWorkspaceTab() {
  const [patients, setPatients] = useState([]);
  const [selectedHn, setSelectedHn] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tool, setTool] = useState('careplan');
  const [input, setInput] = useState('');
  const [loading, setLoad] = useState(false);
  const [result, setResult] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/patients`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
        if (data.length > 0 && !selectedHn) {
          setSelectedHn(data[0].HN);
        }
      }
    } catch (e) {
      console.error("Failed to fetch patients:", e);
    }
  };

  const fetchTasks = async (hn) => {
    if (!hn) return;
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${hn}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedHn) {
      fetchTasks(selectedHn);
    }
  }, [selectedHn]);

  const handleToggleTask = async (taskName, checked) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hn: selectedHn, task_name: taskName, checked })
      });
      if (res.ok) {
        fetchTasks(selectedHn);
        fetchPatients();
      }
    } catch (e) {
      console.error("Failed to toggle task:", e);
    }
  };

  const run = async () => {
    if (!input.trim()) return;
    setLoad(true); setResult('');

    try {
      const res = await fetch(`${API_BASE}/api/ai/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, input }),
      });
      if (!res.ok) throw new Error('API Request Failed');
      const d = await res.json();
      setResult(d.result);
    } catch (e) {
      console.error(e);
      setResult('เกิดข้อผิดพลาดในการประมวลผลผ่าน AI Agent ในหลังบ้าน');
    } finally {
      setLoad(false);
    }
  };

  const loadExample = () => setInput(EXAMPLES[tool] || '');

  const activePatient = patients.find(p => p.HN === selectedHn) || {
    HN: 'HN-001',
    Name: 'คุณตาหวัง รักดี',
    Age: '78',
    Gender: 'ชาย',
    Symptom: 'Stroke อัมพาตครึ่งซีกซ้าย',
    ADL_Score: '3',
    Eligibility: 'Eligible',
    Status: 'assigned'
  };

  const completedTasks = tasks.filter(t => t.checked).length;
  const totalTasks = tasks.length || 4;

  function intVal(val) {
    const parsed = parseInt(val);
    return isNaN(parsed) ? 20 : parsed;
  }

  return (
    <div className="anim-fade-up">
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>Care Manager Workspace</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Review patient tickets and auto-draft Care Plans using AI</p>
        </div>
        <button className="btn-primary touch-active" style={{ borderRadius: 8 }}>Export Care Plan (PDF)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div className="card" style={{ background: 'white', overflow: 'hidden' }}>
             <div style={{ background: '#00B87C', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div>
                 <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                   เลือกคนไข้:{' '}
                   <select 
                     value={selectedHn} 
                     onChange={e => setSelectedHn(e.target.value)} 
                     style={{ 
                       background: 'rgba(255,255,255,0.2)', 
                       border: 'none', 
                       borderRadius: 4, 
                       color: 'white', 
                       padding: '4px 8px', 
                       fontWeight: 700, 
                       cursor: 'pointer',
                       outline: 'none'
                     }}
                   >
                     {patients.map(p => (
                       <option key={p.HN} value={p.HN} style={{ color: '#111827' }}>
                         {p.HN} - {p.Name}
                       </option>
                     ))}
                   </select>
                 </h2>
                 <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
                   อาการ: {activePatient.Symptom}
                 </div>
               </div>
               <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', fontSize: 12, fontWeight: 700, borderRadius: 4 }}>
                 {activePatient.Status?.toUpperCase() || 'NEW'}
               </span>
             </div>
             <div style={{ padding: 20 }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F3F4F6', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                   <span>อายุ: {activePatient.Age} ปี</span>
                   <span>เพศ: {activePatient.Gender}</span>
                   <span>คะแนน ADL: {activePatient.ADL_Score}</span>
                 </div>
                 
                 {[
                   { icon: '<path d="M4 8v3c0 4.5 3.5 9 8 9s8-4.5 8-9V8" /><path d="M2.5 8h19" /><path d="M7 13a4 4 0 0 0 10 0" />', title: 'ผ้าอ้อมฟรี', desc: '3 ชิ้น/วัน (กปท.)', status: activePatient.Eligibility === 'Eligible' ? 'มีสิทธิ์' : activePatient.Eligibility === 'Pending' ? 'ยื่นคำขอ' : 'ไม่ตรงเกณฑ์' },
                   { icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />', title: 'Caregiver', desc: 'จัดสรรผู้ดูแล', status: activePatient.ADL_Score !== 'N/A' && intVal(activePatient.ADL_Score) <= 6 ? 'มีสิทธิ์' : 'พิจารณา' },
                   { icon: '<path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />', title: 'อุปกรณ์การแพทย์', desc: 'เตียงลมผู้ป่วย', status: activePatient.ADL_Score !== 'N/A' && intVal(activePatient.ADL_Score) <= 4 ? 'มีสิทธิ์' : 'พิจารณา' },
                 ].map((item, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, border: '1px solid #E5E7EB', borderRadius: 6, background: '#F9FAFB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                         <div style={{ display: 'flex', color: '#6B7280' }}>
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} />
                         </div>
                         <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>{item.desc}</div>
                         </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: item.status === 'มีสิทธิ์' ? '#10B981' : '#3B82F6', padding: '4px 10px', borderRadius: 4 }}>{item.status}</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>

           <div className="card" style={{ flex: 1, background: 'white', overflow: 'hidden' }}>
             <div style={{ background: '#4B8BFF', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ background: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 6, display: 'flex' }}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path></svg>
                   </div>
                   <div>
                     <h2 style={{ fontSize: 16, fontWeight: 700 }}>CM Task Checklist</h2>
                     <div style={{ fontSize: 11, opacity: 0.9 }}>SOP มาตรฐานการจัดการเคส LTC</div>
                   </div>
                </div>
                <span style={{ fontWeight: 800, background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                  {completedTasks}/{totalTasks}
                </span>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
               {tasks.map((t, i) => (
                 <div key={i} onClick={() => handleToggleTask(t.title, !t.checked)} style={{ display: 'flex', gap: 12, padding: 14, border: `1px solid ${t.checked ? '#00B87C' : 'var(--border)'}`, background: t.checked ? '#F0FDF4' : 'var(--surface)', borderRadius: 10, cursor: 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${t.checked ? '#00B87C' : '#CBD5E1'}`, background: t.checked ? '#00B87C' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                       {t.checked && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
                    </div>
                    <div>
                       <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>{t.title}</div>
                       <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>คลิกเพื่อเปลี่ยนสถานะงาน</div>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Column: AI Agent Care Plan Drafter */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           <div style={{ background: '#111827', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <div style={{ background: 'rgba(255,255,255,0.1)', padding: 6, borderRadius: 6, display: 'flex' }}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
               </div>
               <div>
                 <h2 style={{ fontSize: 16, fontWeight: 700 }}>AI Care Plan Assistant</h2>
                 <div style={{ fontSize: 11, opacity: 0.8 }}>Auto-drafting powered by Groq Qwen3-32b</div>
               </div>
             </div>
           </div>

           <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
             
             {/* Tool selector */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
               {TOOLS.map(t => (
                 <button key={t.id} onClick={() => { setTool(t.id); setResult(''); }}
                   className="touch-active" style={{
                     padding: '12px', cursor: 'pointer', textAlign: 'left', borderRadius: 8,
                     border: tool === t.id ? '2px solid var(--blue)' : '1px solid var(--border)',
                     background: tool === t.id ? 'var(--blue-light)' : 'var(--surface)',
                   }}>
                   <div style={{ fontWeight: 700, fontSize: 13, color: tool === t.id ? 'var(--blue)' : 'var(--ink)' }}>{t.label}</div>
                 </button>
               ))}
             </div>

             {/* Input */}
             <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>Context & Notes</div>
                  <button onClick={loadExample} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }}>Load Patient Data</button>
                </div>
                <textarea
                  className="clinical-textarea"
                  style={{ height: 120 }}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="กรอกข้อมูลจากการเยี่ยมบ้านที่นี่..."
                />
                <button onClick={run} disabled={loading || !input.trim()}
                  className="btn-primary touch-active"
                  style={{ marginTop: 12, width: '100%', padding: 12, fontSize: 14, borderRadius: 8 }}>
                  {loading ? 'Processing...' : `Generate ${TOOLS.find(t => t.id === tool)?.label}`}
                </button>
             </div>

             {/* Output */}
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 8 }}>AI Draft Result</div>
                <div style={{
                  flex: 1, background: 'var(--surface-2)', borderRadius: 8, padding: 16,
                  border: '1px solid var(--border)', minHeight: 200, position: 'relative', overflowY: 'auto'
                }}>
                   {!result && !loading && (
                     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--ink-4)', fontSize: 13, textAlign: 'center' }}>
                       Ready to generate.<br/>Click the button above.
                     </div>
                   )}
                   {loading && (
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-3)', fontSize: 13 }}>
                       <span className="spinner" /> AI is writing...
                     </div>
                   )}
                   {result && (
                     <div className="anim-fade-up" style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                       {result}
                     </div>
                   )}
                </div>
             </div>

           </div>
        </div>
      </div>
    </div>
  );
}
