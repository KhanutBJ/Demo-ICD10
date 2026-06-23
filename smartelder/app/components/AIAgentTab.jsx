'use client';
import { useState } from 'react';
import { API_BASE } from '../lib/api';

const TOOLS = [
  { id: 'adl',       label: 'ADL for Diaper Eligibility',     desc: 'ประเมิน Barthel ADL Score (ต้อง ≤6 จึงจะได้สิทธิ์)' },
  { id: 'careplan',  label: 'Care Plan Draft (Diaper)',     desc: 'ร่าง Care Plan เบิกผ้าอ้อม 3 ชิ้น/วัน' },
  { id: 'rights',    label: 'เช็คสิทธิ์ผ้าอ้อม LTC',     desc: 'ตรวจสอบสิทธิ์ผ้าอ้อมผู้ใหญ่ สปสช.' },
  { id: 'policy',    label: 'Policy RAG (Diaper)',          desc: 'ค้นหาระเบียบ สปสช. เรื่องผ้าอ้อม' },
];

const EXAMPLES = {
  adl: 'ผู้ป่วย HN-2024-001 ชายอายุ 72 ปี หลัง Stroke I63.9 สัปดาห์ที่ 2\nญาติแจ้งว่า: ผู้ป่วยลุกนั่งเองไม่ได้ ต้องช่วยอาบน้ำ แต่งตัว กินข้าวตักเองได้บ้าง\nเดินต้องมีคนพยุง ควบคุมปัสสาวะและอุจจาระไม่ได้เลย กลั้นไม่ได้',
  careplan: 'ผู้ป่วย Stroke I63.9 อายุ 72 ปี ADL Score = 3/20 (ติดเตียงรุนแรง)\nต้องการ: ผ้าอ้อมผู้ใหญ่ 3 ชิ้น/วัน\nCM: วรรณา ใจดี\nญาติผู้ดูแล: มี 1 คน (ลูกสาว)\nเป้าหมาย: ป้องกันแผลกดทับและรักษาความสะอาด',
  rights: 'ผู้ป่วย HN-2024-001 อายุ 72 ปี\nสิทธิ์: บัตรทอง 30 บาท\nICD: I63.9 Cerebral infarction\nADL Score: 4/20 ติดเตียง\nสถานะการกลั้นขับถ่าย: กลั้นไม่ได้ทั้งปัสสาวะและอุจจาระ',
  policy: 'ผู้ป่วยที่มีปัญหาการกลั้นขับถ่าย แต่ ADL = 8 (ติดบ้าน) สามารถขอรับสิทธิ์ผ้าอ้อมผู้ใหญ่จากกองทุน LTC หรือ สปสช. ได้หรือไม่? มีเงื่อนไขข้อยกเว้นอย่างไรบ้าง?',
};

export default function AIAgentTab() {
  const [tool, setTool]      = useState('adl');
  const [input, setInput]    = useState('');
  const [loading, setLoad]   = useState(false);
  const [result, setResult]  = useState('');

  const run = async () => {
    if (!input.trim()) return;
    setLoad(true); setResult('');

    try {
      const res = await fetch(`${API_BASE}/api/ai/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          input
        }),
      });
      if (!res.ok) throw new Error('API Request Failed');
      const d = await res.json();
      setResult(d.result);
    } catch (e) {
      console.error(e);
      setResult('เกิดข้อผิดพลาดในการเรียกใช้ AI Agent หลังบ้าน');
    } finally { setLoad(false); }
  };

  const loadExample = () => setInput(EXAMPLES[tool] || '');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>AI Agent</h1>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>RAG-powered tools for Adult Diaper Eligibility & Care Planning</p>
        </div>
        <span className="chip chip-blue">Gemini 3.5 Flash</span>
      </div>

      {/* Tool selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => { setTool(t.id); setResult(''); }}
            className="card touch-active" style={{
              padding: '14px 14px', cursor: 'pointer', textAlign: 'left',
              borderLeft: tool === t.id ? '3px solid var(--blue)' : '3px solid transparent',
              background: tool === t.id ? 'var(--blue-light)' : 'var(--surface)',
            }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: tool === t.id ? 'var(--blue)' : 'var(--ink)' }}>{t.label}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3 }}>{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="responsive-grid-2">
        {/* Input */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Input</div>
            <button onClick={loadExample} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 6,
              padding: '3px 10px', fontSize: 11, color: 'var(--blue)', cursor: 'pointer', fontWeight: 600,
            }}>Load Example</button>
          </div>
          <textarea
            className="clinical-textarea"
            style={{ height: 200 }}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="กรอกข้อมูลผู้ป่วยหรือคำถามที่นี่..."
          />
          <button onClick={run} disabled={loading || !input.trim()}
            className="btn-primary touch-active"
            style={{ marginTop: 10, width: '100%', padding: 10, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10 }}>
            {loading ? <><span className="spinner spinner-white" />Processing...</> : `Run ${TOOLS.find(t => t.id === tool)?.label}`}
          </button>
        </div>

        {/* Output */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 12 }}>
            AI Response
          </div>
          {!result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface-2)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="3" stroke="var(--ink-4)" strokeWidth="1.5"/>
                  <path d="M7 10h4M7 14h8" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ color: 'var(--ink-4)', fontSize: 12, textAlign: 'center' }}>
                เลือก tool แล้วกรอกข้อมูล<br/>AI Agent จะวิเคราะห์สิทธิ์ผ้าอ้อมให้
              </p>
            </div>
          )}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 20, color: 'var(--ink-3)', fontSize: 13 }}>
              <span className="spinner" /> Processing...
            </div>
          )}
          {result && (
            <div className="anim-fade-up" style={{
              background: 'var(--surface-2)', borderRadius: 10, padding: 16,
              fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8,
              whiteSpace: 'pre-wrap', maxHeight: 350, overflow: 'auto',
              border: '1px solid var(--border)',
            }}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

