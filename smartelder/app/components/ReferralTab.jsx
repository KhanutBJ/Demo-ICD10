'use client';
import { useState } from 'react';

const CASES = [
  { id: 'R001', hn: 'HN-2024-001', age: 72, icd: 'I63.9', care: 'Cerebral Infarction',    day: 2, sla: 7, cm: 'วรรณา ใจดี',    paths: { rights: true, adl: true, logistics: true },  status: 'done',    adl: null },
  { id: 'R002', hn: 'HN-2024-007', age: 68, icd: 'I63.5', care: 'MCA Occlusion',          day: 5, sla: 7, cm: 'อภิชัย สุขใส',  paths: { rights: true, adl: true, logistics: false }, status: 'progress',    adl: 5 },
  { id: 'R003', hn: 'HN-2024-012', age: 81, icd: 'I61.0', care: 'Intracerebral Hemorrhage', day: 1, sla: 7, cm: null,             paths: { rights: true, adl: false, logistics: false }, status: 'wait', adl: null },
  { id: 'R004', hn: 'HN-2024-019', age: 76, icd: 'I69.3', care: 'Sequelae of Stroke',      day: 6, sla: 7, cm: 'ปริยา แก้วดวง', paths: { rights: true, adl: true, logistics: true },  status: 'forward', adl: 4 },
  { id: 'R005', hn: 'HN-2024-023', age: 74, icd: 'I63.9', care: 'Cerebral Infarction',    day: 3, sla: 7, cm: 'ปริยา แก้วดวง', paths: { rights: true, adl: true, logistics: true }, status: 'progress', adl: 3 },
];

const TRAFFY_STATS = [
  { id: 'wait',     label: 'รอตรวจสอบสิทธิ์', count: 1278, pct: 0,   color: '#FF6B6B', bg: '#FF6B6B' },
  { id: 'forward',  label: 'ส่งต่อ Care Manager', count: 99763, pct: 8,  color: '#4B8BFF', bg: '#4B8BFF' },
  { id: 'progress', label: 'กำลังประเมิน ADL', count: 77403, pct: 6,   color: '#FFD166', bg: '#FFD166' },
  { id: 'done',     label: 'อนุมัติจัดส่งผ้าอ้อม',  count: 1071402, pct: 82, color: '#06D6A0', bg: '#06D6A0' },
];

export default function ReferralTab() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // Default to map view as requested

  const filteredCases = filter === 'all' ? CASES : CASES.filter(c => c.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Diaper Auto-Referral Tracking</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>ระบบบูรณาการข้อมูลสิทธิ์ผ้าอ้อมผู้ใหญ่ระดับประเทศ</p>
        </div>
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: 24 }}>
        {/* Left Column - Map/List Placeholder */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
             <button onClick={() => setViewMode('list')} className="chip chip-gray" style={{ background: viewMode === 'list' ? '#636366' : 'var(--surface)', color: viewMode === 'list' ? 'white' : 'var(--ink-3)', border: viewMode === 'list' ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}>รายการผู้ป่วย</button>
             <button onClick={() => setViewMode('map')} className="chip chip-gray" style={{ background: viewMode === 'map' ? '#00B87C' : 'var(--surface)', color: viewMode === 'map' ? 'white' : 'var(--ink-3)', border: viewMode === 'map' ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}>แผนที่ (ศูนย์อนามัย)</button>
          </div>
          <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8, height: 400, overflowY: 'auto', background: viewMode === 'map' ? '#0F172A' : 'var(--surface)' }}>
            
            {viewMode === 'map' && (
              <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Stylized background grid */}
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/></pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Abstract map shape (Bangkok/Central area representation) */}
                  <path d="M150,50 Q200,20 250,50 T300,100 T320,200 T280,300 T200,350 T100,280 T80,180 Z" fill="rgba(0, 184, 124, 0.1)" stroke="#00B87C" strokeWidth="2" strokeDasharray="5,5"/>
                  
                  {/* Health Centers (Large Dots) */}
                  {[
                    { cx: 180, cy: 120, color: 'rgba(255,255,255,0.2)', size: 30, label: 'ศูนย์ 1' },
                    { cx: 240, cy: 160, color: 'rgba(255,255,255,0.2)', size: 40, label: 'ศูนย์ 2' },
                    { cx: 160, cy: 260, color: 'rgba(255,255,255,0.2)', size: 50, label: 'ศูนย์ 4' },
                  ].map((dot, i) => (
                    <g key={`center-${i}`}>
                      <circle cx={dot.cx} cy={dot.cy} r={dot.size} fill={dot.color} className="anim-pulse" style={{ animation: `pulseBorder 3s infinite ${i * 0.5}s` }} />
                      <text x={dot.cx - 15} y={dot.cy + 4} fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600" fontFamily="Prompt">{dot.label}</text>
                    </g>
                  ))}

                  {/* BKK Districts overlay */}
                  <g stroke="#00B87C" strokeWidth="1" fill="none" opacity="0.3">
                    <path d="M 200 200 Q 300 150 400 250 T 500 400 T 300 500 Z" />
                    <path d="M 400 250 Q 500 200 600 300 T 500 400" />
                    <path d="M 200 200 Q 150 300 200 400 T 300 500" />
                  </g>
                </svg>
                <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: 8, backdropFilter: 'blur(4px)' }}>
                  <div style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>สรุปภาพรวมพื้นที่ศูนย์อนามัย</div>
                  <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>ข้อมูลการดำเนินงานระดับเขตสุขภาพ</div>
                </div>
              </div>
            )}

            {viewMode === 'list' && filteredCases.map(c => {
               const stat = TRAFFY_STATS.find(s => s.id === c.status);
               return (
                 <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }} onClick={() => setSelected(selected === c.id ? null : c.id)}>
                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: stat?.bg, marginTop: 4, flexShrink: 0 }} />
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{c.hn}</div>
                     <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{c.care} · อายุ {c.age} ปี</div>
                     <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}>เวลาเฉลี่ย: {c.day} วัน / {c.sla} วัน</div>
                   </div>
                   <div style={{ fontSize: 11, fontWeight: 600, color: stat?.color, background: `${stat?.color}20`, padding: '2px 8px', borderRadius: 999 }}>{stat?.label}</div>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Right Column - Traffy Big Status Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, justifyContent: 'flex-end' }}>
             <button className="chip chip-gray" style={{ background: '#3A3A3C', color: 'white', border: 'none' }}>Open Data</button>
             <button className="chip chip-gray" style={{ background: '#3A3A3C', color: 'white', border: 'none' }}>CSV</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             {/* Wait (Red) */}
             <div onClick={() => setFilter(filter === 'wait' ? 'all' : 'wait')} style={{ background: TRAFFY_STATS[0].bg, borderRadius: 12, padding: '24px', textAlign: 'left', cursor: 'pointer', opacity: filter === 'all' || filter === 'wait' ? 1 : 0.6, transition: '0.2s', color: 'white', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.15, transform: 'rotate(-15deg)' }} width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {TRAFFY_STATS[0].label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: '-1px' }}>{TRAFFY_STATS[0].count.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>({TRAFFY_STATS[0].pct}%)</span></div>
                </div>
             </div>

             {/* Progress (Yellow) */}
             <div onClick={() => setFilter(filter === 'progress' ? 'all' : 'progress')} style={{ background: TRAFFY_STATS[2].bg, borderRadius: 12, padding: '24px', textAlign: 'left', cursor: 'pointer', opacity: filter === 'all' || filter === 'progress' ? 1 : 0.6, transition: '0.2s', color: '#3A3A3C', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', right: -10, bottom: -20, opacity: 0.1, transform: 'rotate(10deg)' }} width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    {TRAFFY_STATS[2].label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: '-1px' }}>{TRAFFY_STATS[2].count.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>({TRAFFY_STATS[2].pct}%)</span></div>
                </div>
             </div>

             {/* Forward (Blue) */}
             <div onClick={() => setFilter(filter === 'forward' ? 'all' : 'forward')} style={{ background: TRAFFY_STATS[1].bg, borderRadius: 12, padding: '24px', textAlign: 'left', cursor: 'pointer', opacity: filter === 'all' || filter === 'forward' ? 1 : 0.6, transition: '0.2s', color: 'white', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', right: -20, bottom: -10, opacity: 0.15, transform: 'rotate(-5deg)' }} width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    {TRAFFY_STATS[1].label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: '-1px' }}>{TRAFFY_STATS[1].count.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>({TRAFFY_STATS[1].pct}%)</span></div>
                </div>
             </div>

             {/* Done (Green) */}
             <div onClick={() => setFilter(filter === 'done' ? 'all' : 'done')} style={{ background: TRAFFY_STATS[3].bg, borderRadius: 12, padding: '24px', textAlign: 'left', cursor: 'pointer', opacity: filter === 'all' || filter === 'done' ? 1 : 0.6, transition: '0.2s', color: 'white', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', right: -15, bottom: -25, opacity: 0.15, transform: 'rotate(15deg)' }} width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {TRAFFY_STATS[3].label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: '-1px' }}>{TRAFFY_STATS[3].count.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>({TRAFFY_STATS[3].pct}%)</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
