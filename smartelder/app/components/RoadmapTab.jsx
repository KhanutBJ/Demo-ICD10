'use client';
import React from 'react';

const PHASES = [
  {
    phase: 'Phase 1',
    label: 'Pilot (พ.ศ. 2568–2569)',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    status: 'active',
    goal: 'PoC ใน 3 จังหวัดนำร่อง (เชียงใหม่, ขอนแก่น, ชลบุรี)',
    items: [
      { done: true,  text: 'HIS Gateway เชื่อมต่อ HOSxP → ICD-10 Trigger อัตโนมัติ' },
      { done: true,  text: 'AI Agent ประเมิน ADL + ร่าง Care Plan (Groq qwen3-32b)' },
      { done: true,  text: 'Line OA อสม. ยืนยันส่งผ้าอ้อม + QR Code สแกน' },
      { done: true,  text: 'สปสช. Command Center แสดง SLA B3/B4 Real-time' },
      { done: false, text: 'Onboard อปท. 50 แห่ง | ค้นพบผู้ป่วยตกหล่น 60% ที่ยังไม่ได้รับสิทธิ์' },
      { done: false, text: 'ลด Care Plan approval time จาก 1–3 เดือน → ≤ 7 วัน' },
    ],
    kpi: '≤ 7 วัน อนุมัติ Care Plan | ค้นพบผู้ป่วยใหม่ +2,000 ราย',
  },
  {
    phase: 'Phase 2',
    label: 'Scale (พ.ศ. 2569–2571)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    status: 'upcoming',
    goal: 'ขยาย 30 จังหวัด | เชื่อม 5 กระทรวง ผ่าน Single Source of Truth',
    items: [
      { done: false, text: 'ระบบ 3C กรมอนามัย + สปสช. Payment + HOSxP → API Unified Layer (HL7 FHIR)' },
      { done: false, text: 'ยกเลิก Triple Data Entry — ลดภาระเอกสาร 80%' },
      { done: false, text: 'CM Capacity: AI รับงานเอกสาร → CM ทำหน้าที่ "ตรวจสอบและอนุมัติ"' },
      { done: false, text: 'interRAI Outcome Indicators แทน Process Indicators' },
      { done: false, text: 'Caregiver Living Wage pathway (≥ 10,000 บาท/เดือน) + ระบบ Training 420h' },
      { done: false, text: 'No Re-admission Gap: แจ้งเตือนทีมชุมชนอัตโนมัติเมื่อผู้ป่วย readmit' },
    ],
    kpi: 'Coverage Rate ≥ 80% | ลด Brain Drain CG | IMC Gap ปิด 100%',
  },
  {
    phase: 'Phase 3',
    label: 'National (พ.ศ. 2571–2574)',
    color: '#059669',
    bg: '#F0FDF4',
    border: '#A7F3D0',
    status: 'future',
    goal: 'ระบบ LTC ระดับประเทศ รองรับ Super-Aged Society พ.ศ. 2574',
    items: [
      { done: false, text: 'National LTC Governance Body — คณะกรรมการผู้สูงอายุแห่งชาติ เป็น Coordinator' },
      { done: false, text: 'Needs-Based / Case-Mix Financing แทน Flat-Rate 6,000 บาท/คน/ปี' },
      { done: false, text: 'District-Level System Manager (ต้นแบบจาก Japan LTC CM model)' },
      { done: false, text: 'Social Daycare + Respite Care infrastructure ทุกจังหวัด' },
      { done: false, text: '50,000 CG พร้อมปฏิบัติงาน (จาก 18,000 ปัจจุบัน)' },
      { done: false, text: 'ผู้ป่วยทุกราย ≤ 3 วันได้รับการดูแล นับจากออกจากโรงพยาบาล' },
    ],
    kpi: 'ครอบคลุม 100% ผู้มีสิทธิ์ | Super-Aged Ready by 2574',
  },
];

const POLICY_RECS = [
  { num: 1, label: 'Professionalize CG Workforce', detail: 'Living Wage ≥ 10,000 บาท/เดือน ลด Brain Drain' },
  { num: 2, label: 'District System Manager', detail: 'ต้นแบบ CM ระดับอำเภอ (Japan model)' },
  { num: 3, label: 'Outcome vs Process Indicators', detail: 'เปลี่ยนจาก Process → QoL, Caregiver Burden Index, Family Satisfaction' },
  { num: 4, label: 'Needs-Based Financing', detail: 'Case-Mix แทน Flat-Rate 6,000 THB capitation' },
  { num: 5, label: 'Integrated HIS (interRAI)', detail: 'มาตรฐาน OECD/Canada/Singapore แทน Triple-Entry' },
  { num: 6, label: 'National LTC Governance', detail: 'คณะกรรมการผู้สูงอายุแห่งชาติ เป็น Coordinator ครอบคลุม 5 กระทรวง' },
];

export default function RoadmapTab() {
  return (
    <div className="anim-fade-up" style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', borderRadius: 16, padding: '40px 40px', color: 'white', marginBottom: 32 }}>
        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 1, display: 'inline-block', marginBottom: 16, color: '#A7F3D0' }}>
          STRATEGIC ROADMAP
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>
          จาก Pilot สู่ National LTC Platform
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 680, lineHeight: 1.6 }}>
          แผน 3 ระยะ ปิด Coverage Gap และรองรับ Super-Aged Society ภายใน พ.ศ. 2574
          — อ้างอิงข้อเสนอแนะเชิงนโยบาย 6 ข้อ จากรายงานวิจัยราชวิทยาลัย / มหาวิทยาลัยมหิดล (มีนาคม 2568)
        </p>
      </div>

      {/* Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
        {PHASES.map((p, idx) => (
          <div key={idx} className="card" style={{ border: `1px solid ${p.border}`, overflow: 'hidden' }}>
            <div style={{ background: p.bg, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${p.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: p.color, color: 'white', padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 800 }}>{p.phase}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: p.color }}>{p.label}</div>
                  <div style={{ fontSize: 13, color: '#4B5563', marginTop: 2 }}>{p.goal}</div>
                </div>
              </div>
              {p.status === 'active' && (
                <span style={{ background: p.color, color: 'white', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>กำลังดำเนินการ</span>
              )}
              {p.status === 'upcoming' && (
                <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>ขั้นต่อไป</span>
              )}
              {p.status === 'future' && (
                <span style={{ background: '#F3F4F6', color: '#9CA3AF', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>เป้าหมาย</span>
              )}
            </div>
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ marginTop: 1, flexShrink: 0 }}>
                      {item.done ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                      )}
                    </div>
                    <span style={{ fontSize: 14, color: item.done ? '#111827' : '#6B7280', fontWeight: item.done ? 600 : 400, lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 8, padding: '14px 18px', minWidth: 240, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: p.color, letterSpacing: 0.5, marginBottom: 6 }}>KPI TARGETS</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{p.kpi}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Recommendations */}
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#0F172A', color: 'white', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 800 }}>นโยบาย</div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>6 ข้อเสนอแนะเชิงนโยบาย</h2>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>จากรายงานวิจัยระบบ LTC ราชวิทยาลัย / ม.มหิดล — สปสช. มีนาคม 2568</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {POLICY_RECS.map((r) => (
            <div key={r.num} style={{ padding: 16, border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ background: '#0F172A', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{r.num}</div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{r.label}</span>
              </div>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{r.detail}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
