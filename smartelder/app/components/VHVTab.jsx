'use client';
import { useState } from 'react';

const VHV_PATIENTS = [
  { hn: 'HN-2024-001', name: 'สมชาย ใจดี', age: 72, icd: 'I63.9', type: 'ผู้ป่วยติดเตียง', adl: 5, status: 'care_active', nextVisit: 'พรุ่งนี้ 10:00', task: 'เปลี่ยนสายยาง' },
  { hn: 'HN-2024-019', name: 'มาลัย รักสุข', age: 76, icd: 'I69.3', type: 'ผู้ป่วยติดบ้าน', adl: 10, status: 'needs_adl', nextVisit: 'รอประเมิน', task: 'ส่งแบบประเมิน ADL ทาง Line' },
  { hn: 'HN-2024-042', name: 'บุญมี สีใส', age: 80, icd: 'E11.9', type: 'โรคเรื้อรัง', adl: 18, status: 'routine', nextVisit: '15 มิ.ย.', task: 'วัดความดัน/น้ำตาล' },
];

export default function VHVTab() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>อสม. Monitor Dashboard</h1>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Last-mile delivery & Community Tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="chip chip-blue">เขตบางมด 1</span>
          <span className="chip chip-green">อสม. ปรีชา</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { value: '12', label: 'ผู้ป่วยในความดูแล', color: 'var(--blue)', bg: 'var(--blue-light)' },
          { value: '3', label: 'เคสที่ต้องลงเยี่ยมสัปดาห์นี้', color: 'var(--amber)', bg: 'var(--amber-light)' },
          { value: '1', label: 'รอประเมิน ADL (Line Agent)', color: 'var(--purple)', bg: 'var(--purple-light)' },
        ].map((m, i) => (
          <div key={i} style={{ padding: '16px', borderRadius: 16, background: m.bg, border: `1px solid ${m.color}30` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color, letterSpacing: '-1px', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>รายการผู้ป่วยที่ต้องติดตาม (Action Required)</h2>
          <span className="chip chip-amber" style={{ fontSize: 11 }}>2 Pending Tasks</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VHV_PATIENTS.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 100px 140px 140px', alignItems: 'center',
              padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)',
              background: p.status === 'needs_adl' ? 'var(--purple-light)' : 'var(--surface)'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{p.hn} · อายุ {p.age} ปี</div>
              </div>
              <span className={p.type.includes('ติดเตียง') ? 'chip chip-red' : p.type.includes('ติดบ้าน') ? 'chip chip-amber' : 'chip chip-green'} style={{ fontSize: 10, width: 'fit-content' }}>
                {p.type}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>ADL: {p.adl}</span>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                <span style={{ color: 'var(--ink-4)', fontSize: 10, display: 'block' }}>นัดหมายต่อไป</span>
                {p.nextVisit}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                 <span style={{ color: 'var(--ink-4)', fontSize: 10, display: 'block' }}>สิ่งที่ต้องทำ</span>
                <strong style={{ color: p.status === 'needs_adl' ? 'var(--purple)' : 'var(--ink)' }}>{p.task}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card" style={{ padding: 20, marginTop: 20, borderLeft: '3px solid var(--purple)' }}>
         <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Line Agent Integration (B2 Solution)</h2>
         <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>
           เชื่อมต่อกับ Line OA เพื่อส่งแบบประเมิน ADL ให้ญาติผู้ดูแลโดยตรง AI Agent จะนำผลมาช่วยร่าง Care Plan อัตโนมัติ ลดภาระงานเอกสารของ Care Manager และ อสม.
         </p>
      </div>

    </div>
  );
}
