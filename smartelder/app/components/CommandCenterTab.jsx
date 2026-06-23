'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';

export default function CommandCenterTab() {
  const [live, setLive] = useState(null);   // { total, todo, inprog, done, red, orange, green }
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [kRes, aRes] = await Promise.all([
          fetch(`${API_BASE}/api/kanban`),
          fetch(`${API_BASE}/api/alerts`),
        ]);
        const k = await kRes.json();
        const a = await aRes.json();
        const sc = k.status_counts || {};
        setLive({
          total: k.total_issues ?? (k.cards ? k.cards.length : 0),
          todo: sc['To Do'] ?? 0,
          inprog: sc['In Progress'] ?? 0,
          done: sc['Done'] ?? 0,
          red: a.filter(x => x.Alert_Level === 'Red').length,
          orange: a.filter(x => x.Alert_Level === 'Orange').length,
          green: a.filter(x => x.Alert_Level === 'Green').length,
        });
        setOnline(true);
      } catch (e) {
        console.error('Command Center live fetch failed:', e);
        setOnline(false);
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const kpis = [
    { label: 'เคสในระบบ (DB)', value: live ? live.total : '—', color: '#2563EB' },
    { label: 'รอดำเนินการ', value: live ? live.todo : '—', color: '#FF9500' },
    { label: 'กำลังดำเนินการ', value: live ? live.inprog : '—', color: '#6E4FF6' },
    { label: 'เสร็จสิ้น', value: live ? live.done : '—', color: '#00B87C' },
    { label: 'แจ้งเตือนฉุกเฉิน', value: live ? live.red : '—', color: '#E11D48' },
  ];

  return (
    <div className="anim-fade-up">
      {/* Top Bar */}
      <div style={{ background: '#2563EB', borderRadius: 6, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', marginBottom: 24 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 6, display: 'flex' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"></path><path d="M3 8h18"></path><path d="M17 12a5 5 0 0 1-10 0"></path></svg>
            </div>
            <div>
               <h2 style={{ fontSize: 18, fontWeight: 800 }}>สปสช. Command Center</h2>
               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Executive Dashboard for SLA & Budget Monitoring</div>
            </div>
         </div>
         <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: online ? '#34D399' : '#F87171' }} />
            {online ? 'Live • เชื่อมต่อฐานข้อมูล' : 'Offline'}
         </span>
      </div>

      {/* Live DB metrics strip (real-time from Google Sheets via backend) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
         {kpis.map(k => (
            <div key={k.label} className="card" style={{ padding: 16 }}>
               <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
               <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
               <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 6 }}>เรียลไทม์จากระบบ</div>
            </div>
         ))}
      </div>

      {/* SLA Gaps Row (B3, B4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
         {/* B3 Gap */}
         <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <div style={{ display: 'flex', color: '#64748B' }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 </div>
                 <span style={{ fontWeight: 700, fontSize: 14 }}>SLA: อนุมัติ Care Plan (Gap B3)</span>
               </div>
               <span style={{ fontSize: 10, background: '#F0F6FF', color: '#2563EB', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Auto-approve</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ flex: 1, border: '1px solid #FECDD3', background: '#FFF1F2', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#E11D48', fontWeight: 600 }}>อดีต (รออนุกรรมการ)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E11D48' }}>1-3 เดือน</div>
               </div>
               <span style={{ color: 'var(--ink-4)' }}>→</span>
               <div style={{ flex: 1, border: '1px solid #BFDBFE', background: '#F0F6FF', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>ปัจจุบัน (Platform)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>ทันที (0 วัน)</div>
               </div>
            </div>
         </div>

         {/* B4 Gap */}
         <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <div style={{ display: 'flex', color: '#64748B' }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                 </div>
                 <span style={{ fontWeight: 700, fontSize: 14 }}>SLA: เบิกจ่ายงบประมาณ (Gap B4)</span>
               </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ flex: 1, border: '1px solid #FECDD3', background: '#FFF1F2', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#E11D48', fontWeight: 600 }}>อดีต (โอนซ้ำซ้อน)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E11D48' }}>15+ วัน</div>
               </div>
               <span style={{ color: 'var(--ink-4)' }}>→</span>
               <div style={{ flex: 1, border: '1px solid #A7F3D0', background: '#F0FDF4', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#00B87C', fontWeight: 600 }}>ปัจจุบัน (Platform)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#00B87C' }}>&lt; 3 วัน</div>
               </div>
            </div>
         </div>

         {/* Coverage Rate */}
         <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <div style={{ display: 'flex', color: '#64748B' }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                 </div>
                 <span style={{ fontWeight: 700, fontSize: 14 }}>Coverage Rate (ผู้ป่วย Stroke)</span>
               </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ flex: 1, border: '1px solid #FECDD3', background: '#FFF1F2', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#E11D48', fontWeight: 600 }}>ก่อน PWL (20% ยังไม่ได้รับ Care Plan จริง)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E11D48' }}>~40%</div>
               </div>
               <span style={{ color: 'var(--ink-4)' }}>→</span>
               <div style={{ flex: 1, border: '1px solid #A7F3D0', background: '#F0FDF4', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#00B87C', fontWeight: 600 }}>หลัง Pilot (เป้าหมาย)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#00B87C' }}>80%+</div>
               </div>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
         {/* Care Manager Capacity vs Demand */}
         <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
               <div style={{ background: '#F3F4F6', color: '#64748B', padding: 8, borderRadius: 10, display: 'flex' }}>
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><line x1="12" y1="10" x2="12" y2="10"></line></svg>
               </div>
               <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Care Manager Capacity</h2>
                  <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>CG ปัจจุบัน 18,000 คน / เป้าหมาย 50,000 คน | ค่าตอบแทน 5,000–6,000 บาท/เดือน (Gap B2)</div>
               </div>
            </div>

            {[
               { zone: 'อ.เมือง (เชียงใหม่)', cm: 12, pt: 54, ratio: 4.5, color: '#FF9500', alert: true },
               { zone: 'อ.หางดง', cm: 8, pt: 44, ratio: 5.5, color: '#E11D48', alert: true },
               { zone: 'อ.สันทราย', cm: 15, pt: 35, ratio: 2.3, color: '#00B87C', alert: false },
               { zone: 'อ.แม่ริม', cm: 10, pt: 25, ratio: 2.5, color: '#00B87C', alert: false },
            ].map(z => (
               <div key={z.zone} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                     <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{z.zone}</span>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{z.cm} CM / {z.pt} ผู้ป่วย</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: z.color }}>{z.ratio}x</span>
                        {z.alert && <span style={{ fontSize: 10, fontWeight: 800, background: '#FF9500', color: 'white', padding: '2px 6px', borderRadius: 4 }}>ขาดแคลน</span>}
                     </div>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: `${Math.min(z.ratio * 15, 100)}%`, background: z.color, borderRadius: 4 }} />
                  </div>
               </div>
            ))}
         </div>

         {/* Welfare State Distribution */}
         <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
               <div style={{ display: 'flex', color: '#64748B' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
               </div>
               <div>
                 <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Welfare State Distribution</h2>
                 <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>สถานะผู้ป่วยที่เข้าสู่ระบบ Auto-Referral</div>
               </div>
            </div>
            {[
               { label: 'Active (รับสิทธิ์แล้ว)', count: '4,520', pct: '65%', color: '#00B87C', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />' },
               { label: 'Eligible (รออนุมัติ สปสช.)', count: '1,200', pct: '20%', color: '#4B8BFF', icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>' },
               { label: 'Suspended (ข้อมูลไม่ครบ)', count: '300', pct: '5%', color: '#FF9500', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="9" x2="15" y2="15"></line>' },
               { label: 'Rejected (ไม่เข้าเกณฑ์)', count: '250', pct: '10%', color: '#E11D48', icon: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' },
            ].map(row => (
               <div key={row.label} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                     <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={row.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: row.icon }} />
                        {row.label}
                     </span>
                     <span style={{ fontSize: 13, fontWeight: 800, color: row.color }}>{row.count} ราย</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: row.pct, background: row.color, borderRadius: 4 }} />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
