'use client';
import React from 'react';

export default function LineMonitorTab() {
  return (
    <div className="anim-fade-up">
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>อสม. Line Monitor</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Real-time field tracking via LINE Official Account</p>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, background: '#D1FAE5', color: '#00B87C', padding: '6px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00B87C' }} /> Live Feed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
        
        {/* Main Feed */}
        <div className="card" style={{ background: 'white', overflow: 'hidden' }}>
          <div style={{ background: '#00C300', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 6, display: 'flex' }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Alerts</h2>
             </div>
             <div style={{ fontSize: 13, opacity: 0.9 }}>อสม. แจ้ง → สปสช. + รพ. เห็นพร้อมกัน</div>
          </div>

          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
             {[
               { sender: 'อสม.สมหมาย', pt: 'PT-001 (อ.เมือง)', msg: 'ปัสสาวะอุดตัน สีขุ่นข้น', time: '09:23', color: '#E11D48', bg: '#FFF1F2', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />' },
               { sender: 'อสม.สมศรี', pt: 'PT-003 (อ.หางดง)', msg: 'ไม่รับประทานอาหาร 2 วัน อ่อนเพลีย', time: '11:45', color: '#D97706', bg: '#FEF3C7', icon: '<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />' },
               { sender: 'อสม.สมชาย', pt: 'PT-005 (อ.สันทราย)', msg: 'กินยาครบ เปลี่ยนผ้าอ้อมปกติ ✓', time: '08:00', color: '#059669', bg: '#F0FDF4', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />' },
               { sender: 'อสม.สมศรี', pt: 'PT-012 (อ.หางดง)', msg: 'ผ้าอ้อมใกล้หมด เหลือ 2 ชิ้น', time: 'เมื่อวาน', color: '#D97706', bg: '#FEF3C7', icon: '<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />' },
             ].map((m, i) => (
               <div key={i} style={{ padding: 16, background: 'white', border: `1px solid ${m.color}`, borderLeft: `6px solid ${m.color}`, borderRadius: 6, position: 'relative' }}>
                  <div style={{ position: 'absolute', right: 16, top: 16, display: 'flex', color: m.color, opacity: 0.2 }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: m.icon }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingRight: 40 }}>
                     <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.sender} <span style={{ color: '#6B7280', fontWeight: 500 }}>· {m.pt}</span></div>
                     <div style={{ fontSize: 12, color: '#6B7280' }}>{m.time}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{m.msg}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                     <span style={{ fontSize: 11, background: '#F3F4F6', color: '#374151', padding: '4px 8px', borderRadius: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10"></path></svg> สปสช. รับทราบแล้ว
                     </span>
                     <span style={{ fontSize: 11, background: '#F3F4F6', color: '#374151', padding: '4px 8px', borderRadius: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10"></path></svg> รพ.ต้นสังกัด รับทราบแล้ว
                     </span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Side Panel: QR and Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div className="card" style={{ padding: 24, textAlign: 'center' }}>
             <div style={{ background: '#00C300', color: 'white', width: 120, height: 120, margin: '0 auto 16px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, flexDirection: 'column', lineHeight: 1 }}>
                LINE<br/><span style={{ fontSize: 16, marginTop: 4 }}>QR</span>
             </div>
             <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Care Plan Bot</h3>
             <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
               ให้อสม. และญาติแสกนเพื่อแจ้งเตือนอาการฉุกเฉิน และส่งพิกัดเยี่ยมบ้านเข้าสู่ระบบอัตโนมัติ
             </p>
           </div>

           <div className="card" style={{ overflow: 'hidden' }}>
             <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '12px 16px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>สรุปการแจ้งเตือน (วันนี้)</h3>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E11D48' }}/> ฉุกเฉิน (สีแดง)</span>
                   <span style={{ fontSize: 14, fontWeight: 800, color: '#E11D48' }}>1</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D97706' }}/> เฝ้าระวัง (สีส้ม)</span>
                   <span style={{ fontSize: 14, fontWeight: 800, color: '#D97706' }}>2</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00B87C' }}/> ปกติ (สีเขียว)</span>
                   <span style={{ fontSize: 14, fontWeight: 800, color: '#00B87C' }}>12</span>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
