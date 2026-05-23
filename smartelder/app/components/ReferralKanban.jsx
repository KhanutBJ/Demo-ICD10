'use client';
import React from 'react';

const KANBAN_COLS = [
  { id: 'new', label: 'New', count: 1, color: '#FF9500', bg: '#FFF9F0' },
  { id: 'ack', label: 'Acknowledged', count: 1, color: '#4B8BFF', bg: '#F0F6FF' },
  { id: 'assigned', label: 'Assigned', count: 2, color: '#6E4FF6', bg: '#F4F0FF' },
  { id: 'resolved', label: 'Resolved', count: 1, color: '#00B87C', bg: '#E6F9F3' },
];

const CARDS = [
  { id: 'RF-005', pt: 'P004 • S72.0', status: 'new', tier: 'FRACTURE_TEMPORARY', adl: 9, to: ['กองทุนฟื้นฟูจังหวัด', 'อปท.'], date: '21 พ.ค. 2568 - 2d', cm: null },
  { id: 'RF-002', pt: 'P003 • I50.0', status: 'ack', tier: 'CARDIAC_DEPENDENT', adl: 6, to: ['สปสช.', 'LTC Fund'], date: '19 พ.ค. 2568 - 4d', cm: null },
  { id: 'RF-001', pt: 'P001 • I63.9', status: 'assigned', tier: 'STROKE_DEPENDENT', adl: 3, to: ['สปสช.', 'กปท.', 'LTC Fund'], date: '20 พ.ค. 2568 - 3d', cm: 'น.ส.วาสนา ดูแลดี' },
  { id: 'RF-003', pt: 'P005 • F03', status: 'assigned', tier: 'DEMENTIA_CARE', adl: 5, to: ['สปสช.', 'LTC Fund'], date: '22 พ.ค. 2568 - 1d', cm: 'นายสมศักดิ์ ขยัน' },
  { id: 'RF-004', pt: 'P002 • M17.1', status: 'resolved', tier: 'CHRONIC', adl: 14, to: ['สปสช.', 'รพ.สต.'], date: '15 พ.ค. 2568 - 0d', cm: 'น.ส.สุมาลี ใส่ใจ' },
];

export default function ReferralKanban() {
  return (
    <div className="anim-fade-up">
      {/* Top Stats - Flat GovTech Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Referrals ทั้งหมด', val: '5', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>', color: '#4B8BFF' },
          { label: 'New (รอ สปสช.)', val: '1', icon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', color: '#FF9500' },
          { label: 'Assigned (มี CM)', val: '2', icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>', color: '#6E4FF6' },
          { label: 'SLA เกิน 7 วัน', val: '0', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', color: '#FF3B30' },
        ].map((s, i) => (
          <div key={i} style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'white', border: '1px solid #E5E7EB', borderRadius: 8 }}>
             <div style={{ background: `${s.color}15`, color: s.color, width: 48, height: 48, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: s.icon }} />
             </div>
             <div>
               <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
               <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>{s.label}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Kanban Board - Flat GovTech Style */}
      <div style={{ background: 'white', padding: 24, border: '1px solid #E5E7EB', borderRadius: 8 }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#00B87C', color: 'white', padding: '6px', borderRadius: 6, display: 'flex' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>กระดานจัดการเคส (Auto-Referral Board)</h2>
               </div>
               <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 4 }}>สถานะการส่งต่อจาก HIS อัตโนมัติ</div>
            </div>
            <span style={{ background: '#E6F9F3', color: '#00B87C', padding: '4px 12px', fontSize: 12, fontWeight: 700, borderRadius: 999 }}>● LIVE (Real-time)</span>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, overflowX: 'auto', paddingBottom: 10 }}>
            {KANBAN_COLS.map(col => (
              <div key={col.id} style={{ display: 'flex', flexDirection: 'column', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
                 {/* Column Header - Solid Color (Traffy Style) */}
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: col.color }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>{col.label}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: 'white', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 12 }}>{col.count}</span>
                 </div>

                 {/* Cards */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
                   {CARDS.filter(c => c.status === col.id).map(c => (
                     <div key={c.id} className="touch-active" style={{ padding: 16, background: 'white', cursor: 'pointer', border: '1px solid #E5E7EB', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                           <div style={{ fontWeight: 800, fontSize: 14, color: col.color }}>{c.id}</div>
                           <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{c.pt}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                           <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: col.bg, color: col.color, borderRadius: 4 }}>{c.tier}</span>
                           <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', background: '#F3F4F6', color: '#4B5563', borderRadius: 4 }}>ADL {c.adl}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 4 }}>หน่วยงานรับผิดชอบ</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                           {c.to.map((t, i) => (
                             <span key={i} style={{ fontSize: 11, fontWeight: 600, color: '#1F2937', background: '#E5E7EB', padding: '2px 8px', borderRadius: 4 }}>{t}</span>
                           ))}
                        </div>
                        {c.cm && (
                           <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, background: '#D1FAE5', padding: '4px 8px', borderRadius: 4 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              <span>{c.cm}</span>
                           </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                           <span style={{ fontSize: 11, color: '#6B7280' }}>{c.date}</span>
                           <span style={{ fontSize: 11, fontWeight: 700, color: col.color }}>ดูรายละเอียด &rarr;</span>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
