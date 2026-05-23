'use client';
import React from 'react';

export default function AdvancedInsightsTab() {
  return (
    <div className="anim-fade-up">
      {/* สปสช. Rights Dashboard Top Bar */}
      <div style={{ background: '#2563EB', borderRadius: 12, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', marginBottom: 24, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 8, fontSize: 20 }}>⚖️</div>
            <div>
               <h2 style={{ fontSize: 18, fontWeight: 800 }}>สปสช. Rights Dashboard</h2>
               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Aggregate data only • No PII • Read-only สำหรับนักวิเคราะห์ สปสช.</div>
            </div>
         </div>
         <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Live</span>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
         {/* Time to Benefit */}
         <div className="card" style={{ padding: 20, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
               <span>⏱️</span>
               <span style={{ fontWeight: 700, fontSize: 14 }}>Time-to-Benefit (มัธยฐาน)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ flex: 1, border: '1px solid #FECDD3', background: '#FFF1F2', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#E11D48', fontWeight: 600 }}>ก่อน PWL</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E11D48' }}>45-90 วัน</div>
               </div>
               <span style={{ color: 'var(--ink-4)' }}>→</span>
               <div style={{ flex: 1, border: '1px solid #BFDBFE', background: '#F0F6FF', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>หลัง PWL</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>&lt; 7 วัน</div>
               </div>
            </div>
         </div>

         {/* Coverage Rate */}
         <div className="card" style={{ padding: 20, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
               <span>📊</span>
               <span style={{ fontWeight: 700, fontSize: 14 }}>Coverage Rate (pilot cohort)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ flex: 1, border: '1px solid #FECDD3', background: '#FFF1F2', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#E11D48', fontWeight: 600 }}>ก่อน PWL</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E11D48' }}>~40%</div>
               </div>
               <span style={{ color: 'var(--ink-4)' }}>→</span>
               <div style={{ flex: 1, border: '1px solid #A7F3D0', background: '#F0FDF4', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#00B87C', fontWeight: 600 }}>หลัง PWL</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#00B87C' }}>60%</div>
               </div>
            </div>
         </div>

         {/* Exceptions */}
         <div className="card" style={{ padding: 20, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
               <span>🚨</span>
               <span style={{ fontWeight: 700, fontSize: 14 }}>Unresolved Exceptions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ flex: 1, border: '1px solid #FECDD3', background: '#FFF1F2', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#E11D48', fontWeight: 600 }}>ก่อน PWL</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E11D48' }}>ไม่มีข้อมูล</div>
               </div>
               <span style={{ color: 'var(--ink-4)' }}>→</span>
               <div style={{ flex: 1, border: '1px solid #A7F3D0', background: '#F0FDF4', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#00B87C', fontWeight: 600 }}>หลัง PWL</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#00B87C' }}>2 เคส</div>
               </div>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
         {/* Welfare State Distribution */}
         <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
               <span>📋</span>
               <span style={{ fontWeight: 700, fontSize: 14 }}>Welfare State Distribution</span>
            </div>
            {[
               { label: 'Active', count: 3, pct: '60%', color: '#00B87C', icon: '💚' },
               { label: 'Eligible', count: 1, pct: '20%', color: '#4B8BFF', icon: '✓' },
               { label: 'Suspended', count: 1, pct: '20%', color: '#FF9500', icon: '⏸️' },
            ].map(row => (
               <div key={row.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                     <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{row.icon} {row.label}</span>
                     <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{row.count} ราย</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: row.pct, background: row.color, borderRadius: 3 }} />
                  </div>
               </div>
            ))}
         </div>

         {/* Coverage by Welfare Tier */}
         <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🗺️</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Coverage by Welfare Tier</span>
               </div>
               <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>No PII</span>
            </div>
            {[
               { tier: 'STROKE_DEPENDENT', sub: 'I63 ADL≤6', count: 1, bg: '#FFF1F2', color: '#E11D48' },
               { tier: 'CHRONIC', sub: 'M17/E11', count: 1, bg: '#F0F6FF', color: '#2563EB' },
               { tier: 'CARDIAC_DEPENDENT', sub: 'I50 ADL≤8', count: 1, bg: '#FFF1F2', color: '#E11D48' },
            ].map(row => (
               <div key={row.tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: row.bg, border: `1px solid ${row.bg}`, borderRadius: 8, marginBottom: 12 }}>
                  <div>
                     <div style={{ fontSize: 12, fontWeight: 800, color: row.color }}>{row.tier}</div>
                     <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{row.sub}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: row.color }}>{row.count}</div>
               </div>
            ))}
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
         {/* Care Manager Capacity */}
         <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
               <div style={{ fontSize: 32 }}>👩‍⚕️</div>
               <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Care Manager Capacity</h2>
                  <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>อัตรา CM:ผู้ป่วย &gt; 3.5 → เปิด Line fallback</div>
               </div>
            </div>

            {[
               { zone: 'อ.เมือง (เชียงใหม่)', cm: 2, pt: 9, ratio: 4.5, color: '#FF9500', alert: true },
               { zone: 'อ.หางดง', cm: 2, pt: 11, ratio: 5.5, color: '#E11D48', alert: true },
               { zone: 'อ.สันทราย', cm: 3, pt: 8, ratio: 2.7, color: '#00B87C', alert: false },
               { zone: 'อ.แม่ริม', cm: 4, pt: 9, ratio: 2.3, color: '#00B87C', alert: false },
            ].map(z => (
               <div key={z.zone} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                     <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{z.zone}</span>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{z.cm} CM / {z.pt} ผู้ป่วย</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: z.color }}>{z.ratio}x</span>
                        {z.alert && <span style={{ fontSize: 10, fontWeight: 800, background: '#FF9500', color: 'white', padding: '2px 6px', borderRadius: 4 }}>Line ON</span>}
                     </div>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: `${Math.min(z.ratio * 15, 100)}%`, background: z.color, borderRadius: 4 }} />
                  </div>
               </div>
            ))}

            <div style={{ marginTop: 24, padding: 16, background: '#D1FAE5', border: '1px solid #34D399', borderRadius: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
               <div style={{ background: '#00B87C', color: 'white', padding: '12px', borderRadius: 8, fontSize: 24, textAlign: 'center', fontWeight: 800, lineHeight: 1 }}>LINE<br/><span style={{ fontSize: 10 }}>QR</span></div>
               <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#047857', marginBottom: 4 }}>💬 Line OA — Care Plan Bot (Fallback Active)</div>
                  <div style={{ fontSize: 12, color: '#065F46', marginBottom: 8 }}>โซน: อ.เมือง, อ.หางดง</div>
                  <div style={{ fontSize: 11, color: '#065F46', lineHeight: 1.5 }}>
                     ครอบครัว/ผู้ดูแล scan เพื่อ:<br/>
                     ✓ ประเมิน Care Plan ด้วยตนเอง<br/>
                     ✓ รับ template คำถาม ICD+ADL<br/>
                     ✓ แจ้ง flag ผิดปกติให้ สปสช.
                  </div>
               </div>
            </div>
         </div>

         {/* Line Monitor Feed */}
         <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#00C300', color: 'white', padding: 6, borderRadius: 8 }}>💬</div>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Line Monitor Feed</h2>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>อสม. แจ้ง → สปสช. + รพ. เห็นพร้อมกัน</div>
                  </div>
               </div>
               <span style={{ fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#00B87C', padding: '4px 10px', borderRadius: 999 }}>Real-time</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {[
                 { sender: 'อสม.สมหมาย', pt: 'PT-001', msg: 'ปัสสาวะอุดตัน', time: '09:23', color: '#E11D48', bg: '#FFF1F2' },
                 { sender: 'อสม.สมศรี', pt: 'PT-003', msg: 'ไม่รับประทานอาหาร 2 วัน', time: '11:45', color: '#D97706', bg: '#FEF3C7' },
                 { sender: 'อสม.สมชาย', pt: 'PT-005', msg: 'กินยาครบ ✓', time: '08:00', color: '#00B87C', bg: '#F0FDF4' },
               ].map((m, i) => (
                 <div key={i} style={{ padding: 16, background: m.bg, border: `1px solid ${m.color}`, borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                       <div style={{ fontSize: 12, fontWeight: 700, color: m.color }}>🔴 {m.sender} <span style={{ color: 'var(--ink-4)', fontWeight: 500 }}>· {m.pt}</span></div>
                       <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{m.time}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>{m.msg}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                       <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.6)', border: `1px solid ${m.color}`, color: m.color, padding: '2px 8px', borderRadius: 999 }}>👁️ สปสช.</span>
                       <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.6)', border: `1px solid ${m.color}`, color: m.color, padding: '2px 8px', borderRadius: 999 }}>👁️ รพ.ต้นสังกัด</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
