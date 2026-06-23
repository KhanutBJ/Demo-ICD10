'use client';
import React from 'react';

const NODE = {
  base: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '20px 16px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
    position: 'relative',
  },
};

const LAYERS = [
  {
    label: 'INPUT LAYER — Data Sources',
    color: '#4B8BFF',
    nodes: [
      { icon: null, svg: 'hospital', title: 'Hospital HIS', sub: 'HOSxP / JHCIS\nICD-10 Trigger', accent: '#4B8BFF' },
      { icon: null, svg: 'line', title: 'LINE OA Agent', sub: 'Free-text / Quick Reply\nVoice / Image OCR', accent: '#00C300' },
      { icon: null, svg: 'web', title: 'Web Dashboard', sub: 'Next.js · Vercel\nCM / Nurse / Admin', accent: '#FF9500' },
    ],
  },
  {
    label: 'AI & ORCHESTRATION — FastAPI · Cloud Run',
    color: '#6E4FF6',
    nodes: [
      { icon: null, svg: 'gemini', title: 'Gemini AI Engine', sub: 'gemini-2.5-flash\nADL · Care Plan · Rights · TTS', accent: '#6E4FF6', wide: true },
      { icon: null, svg: 'agent', title: 'Agentic Orchestrator', sub: 'Intent → JSON Action\ndispatch_agent_action()', accent: '#6E4FF6', wide: true },
    ],
  },
  {
    label: 'PERSISTENCE — Google Sheets (Single Source of Truth)',
    color: '#00B87C',
    nodes: [
      { icon: null, svg: 'sheet', title: 'Users', sub: 'LINE ID · Role\nCM · VHV · Nurse', accent: '#00B87C' },
      { icon: null, svg: 'sheet', title: 'Patients', sub: 'HN · ADL Score\nEligibility · Status', accent: '#00B87C' },
      { icon: null, svg: 'sheet', title: 'Alerts', sub: 'Type · Severity\nAck Status', accent: '#FF3B30' },
      { icon: null, svg: 'sheet', title: 'Tasks + Chat History', sub: 'CM Task Checklist\nPer-user Conversation', accent: '#FF9500' },
    ],
  },
  {
    label: 'OUTPUT LAYER — Notifications & Actions',
    color: '#059669',
    nodes: [
      { icon: null, svg: 'push', title: 'LINE Push', sub: 'CM · VHV Notify\nFlex Cards · TTS Audio', accent: '#00C300' },
      { icon: null, svg: 'discharge', title: 'Discharge-Day Match', sub: 'HN Auto-create\nSeed 4 tasks · Lock Queue', accent: '#FF3B30' },
      { icon: null, svg: 'kanban', title: 'Kanban Board', sub: 'Todo → Progress → Done\nReal-time SLA tracking', accent: '#FF9500' },
    ],
  },
];

const FLOW_LABELS = [
  'ICD-10 / Free-text / Web Action',
  'Gemini classify → JSON → execute',
  'CRUD · Log · Chat History',
  'Push · Alert · Update Dashboard',
];

function SvgIcon({ type, color }) {
  const s = { width: 28, height: 28 };
  const stroke = color || '#fff';
  const views = {
    hospital: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>,
    line: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    web: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
    gemini: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9M12 21a9 9 0 0 1-9-9"/><path d="M12 3v18"/></svg>,
    agent: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    sheet: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>,
    push: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    discharge: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    kanban: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="14" rx="1"/></svg>,
  };
  return views[type] || null;
}

export default function ArchitectureTab() {
  return (
    <div className="anim-fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>System Architecture & Data Flow</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>LaPooPoo · LTC Diaper Auto-Referral Agent — สถาปัตยกรรมจริงของระบบ</p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        {[
          { color: '#4B8BFF', label: 'Input / Source' },
          { color: '#6E4FF6', label: 'AI Orchestration (Cloud Run)' },
          { color: '#00B87C', label: 'Google Sheets DB' },
          { color: '#059669', label: 'Output / Action' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-3)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {LAYERS.map((layer, li) => (
          <div key={li}>
            {/* Flow arrow between layers */}
            {li > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-4)', background: 'var(--surface)', padding: '3px 12px', borderRadius: 12, border: '1px solid var(--border)' }}>
                  {FLOW_LABELS[li - 1]}
                </div>
                <svg width="20" height="18" viewBox="0 0 20 18"><path d="M10 0 L10 10 L4 10 L10 18 L16 10 L10 10" fill="var(--ink-4)" /></svg>
              </div>
            )}

            {/* Layer card */}
            <div style={{ background: 'var(--surface)', border: `2px solid ${layer.color}20`, borderRadius: 14, overflow: 'hidden' }}>
              {/* Layer header */}
              <div style={{ background: layer.color, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: 'white' }}>{layer.label}</div>
              </div>

              {/* Nodes */}
              <div style={{ display: 'flex', gap: 16, padding: 20, flexWrap: 'wrap' }}>
                {layer.nodes.map((node, ni) => (
                  <div key={ni} style={{
                    ...NODE.base,
                    flex: node.wide ? '2 1 220px' : '1 1 160px',
                    borderTop: `3px solid ${node.accent}`,
                    minWidth: 150,
                  }}>
                    {/* Icon circle */}
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: node.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <SvgIcon type={node.svg} color="white" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{node.title}</div>
                    {node.sub.split('\n').map((line, i) => (
                      <div key={i} style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.6 }}>{line}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-way flow callout */}
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 18, borderLeft: '3px solid #00C300' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 6 }}>LINE → DB → Web (upstream)</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.7 }}>
            User texts LINE OA → FastAPI webhook → Gemini AI → action written to Sheets → Web dashboard polls & shows live data
          </div>
        </div>
        <div className="card" style={{ padding: 18, borderLeft: '3px solid #4B8BFF' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 6 }}>Web → DB → LINE (downstream)</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.7 }}>
            CM clicks task ✓ / Alert ack on dashboard → backend writes Sheet → <code style={{ fontSize: 11 }}>send_line_push()</code> notifies the right CM/VHV on LINE
          </div>
        </div>
      </div>

      {/* Role table */}
      <div className="card" style={{ marginTop: 16, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 12 }}>Role-based Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[
            { role: 'CM', color: '#6E4FF6', caps: 'ดูคนไข้ทั้งหมด · Care Plan · งาน' },
            { role: 'Nurse', color: '#4B8BFF', caps: 'ตรวจสิทธิ์ · ดู Dashboard' },
            { role: 'VHV (อสม.)', color: '#00B87C', caps: 'ADL · ยืนยัน Discharge' },
            { role: 'Patient', color: '#FF9500', caps: 'ดูสิทธิ์ตัวเอง · ถามนโยบาย' },
            { role: 'Guest', color: '#94A3B8', caps: 'ถามนโยบาย · เลือก Role ก่อน' },
          ].map(r => (
            <div key={r.role} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 8, border: `1px solid ${r.color}30`, background: `${r.color}08` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: r.color, marginBottom: 4 }}>{r.role}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.5 }}>{r.caps}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
