'use client';
import React from 'react';

export default function LandingTab({ onEnter }) {
  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 40 }}>
      
      {/* Hero Section */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(0, 184, 124, 0.3), rgba(4, 120, 87, 0.5)), url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 24,
        padding: '60px 40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 184, 124, 0.2)'
      }}>
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -50, left: '20%', width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(30px)' }} />
        
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
             <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src="/diaper-logo-real.png" alt="LTC Diaper Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(2.5)' }} />
             </div>
          </div>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: 1, display: 'inline-block', marginBottom: 20 }}>
            SYNAPSE x RIGHT : PILOT PHASE
          </span>
          <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.2, marginBottom: 20, letterSpacing: '-2px' }}>
            LaPooPoo
            <br />
            <span style={{ color: '#A7F3D0', fontSize: 36, letterSpacing: '-1px' }}>ระบบประสานงานคุ้มครองสิทธิผ้าอ้อมผู้สูงอายุ</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 24, fontWeight: 600, letterSpacing: 0, display: 'inline-block', marginTop: 12 }}>LTC Diaper Auto-Referral Agent</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 40, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px' }}>
            ลดช่องว่างการเข้าถึงสิทธิ์ เชื่อมต่อโรงพยาบาล, สปสช., อสม., และศูนย์อนามัยเข้าด้วยกันแบบไร้รอยต่อ พร้อม AI ช่วย Care Manager ร่างแผนการดูแลอัตโนมัติ
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button onClick={() => onEnter('kanban')} className="btn-primary touch-active" style={{ background: 'white', color: '#00B87C', fontSize: 16, padding: '16px 32px', borderRadius: 12, fontWeight: 800, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              เข้าสู่ระบบ Auto-Referral Board
            </button>
            <button onClick={() => onEnter('admin')} className="btn-primary touch-active" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 16, padding: '16px 32px', borderRadius: 12, fontWeight: 700 }}>
              ดูสถิติภาพรวม (สปสช.)
            </button>
          </div>
        </div>
      </div>

      {/* User Journey Map - GovTech Style */}
      <div style={{ marginTop: 40, padding: '0 20px', maxWidth: 1200, margin: '40px auto 40px' }}>
         <div className="card" style={{ background: 'white', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
            
            {/* Header: Persona & Expectations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 32, borderBottom: '1px solid #E5E7EB' }}>
               <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 80, height: 80, background: '#EBF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div>
                     <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>ผู้ป่วยสูงอายุ (Bedridden Patient)</h2>
                     <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}><strong>Scenario:</strong> ผู้ป่วยติดเตียงต้องการรับสิทธิ์ผ้าอ้อมผู้ใหญ่ สปสช. แต่ประสบปัญหาขั้นตอนเอกสารยุ่งยากและรอคิวนาน</p>
                  </div>
               </div>
               <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Expectations</h3>
                  <ul style={{ fontSize: 14, color: '#4B5563', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
                     <li>ได้รับอนุมัติสิทธิ์และผ้าอ้อมอย่างรวดเร็ว (ลดเวลาจากหลักเดือนเหลือหลักวัน)</li>
                     <li>ไม่ต้องเดินทางไปติดต่อโรงพยาบาลหรือหน่วยงานด้วยตนเอง</li>
                     <li>มีการติดตามดูแลอาการอย่างใกล้ชิดและโปร่งใส</li>
                  </ul>
               </div>
            </div>

            {/* Journey Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative' }}>
               
               {/* Background wavy line (mocked with SVG) */}
               <svg style={{ position: 'absolute', top: '55%', left: 0, width: '100%', height: 40, zIndex: 1, overflow: 'visible', pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 1000 40">
                  <path d="M0,20 Q125,0 250,20 T500,20 T750,20 T1000,20" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="8 8" />
               </svg>

               {[
                  { phase: 'DETECT', title: 'ดักจับข้อมูล', action: 'แพทย์บันทึกรหัสโรคลงระบบ HIS', touchpoint: 'ระบบสร้าง Ticket อัตโนมัติ', color: '#2563EB', bg: '#EFF6FF', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>' },
                  { phase: 'EVALUATE', title: 'ประเมินแผน', action: 'Line Agent ซักถามญาติ + AI ร่าง Care Plan', touchpoint: 'CM ยืนยันข้อมูลผ่าน Workspace', color: '#6E4FF6', bg: '#F5F3FF', icon: '<rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path>' },
                  { phase: 'APPROVE', title: 'อนุมัติสิทธิ์', action: 'สปสช. / อปท. พิจารณางบกองทุน LTC', touchpoint: 'แจ้งเตือนอนุมัติ Real-time', color: '#FF9500', bg: '#FFF7ED', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' },
                  { phase: 'CARE', title: 'ส่งมอบและติดตาม', action: 'อสม. ลงพื้นที่ส่งผ้าอ้อมถึงบ้าน', touchpoint: 'ติดตามสถานะผ่าน Line OA', color: '#00B87C', bg: '#F0FDF4', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' }
               ].map((step, idx) => (
                  <div key={idx} style={{ borderRight: idx < 3 ? '1px solid #E5E7EB' : 'none', display: 'flex', flexDirection: 'column' }}>
                     {/* Phase Header */}
                     <div style={{ background: step.bg, padding: '16px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: 1 }}>{step.phase}</div>
                        <div style={{ fontSize: 13, color: '#4B5563', fontWeight: 600, marginTop: 4 }}>{step.title}</div>
                     </div>
                     
                     {/* Phase Content */}
                     <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: 13, color: '#374151', marginBottom: 40, background: 'white', border: '1px solid #E5E7EB', padding: 12, borderRadius: 6, zIndex: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'center' }}>
                           {step.action}
                        </div>
                        
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <div style={{ background: 'white', width: 64, height: 64, borderRadius: '50%', border: `4px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, zIndex: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: step.icon }} />
                           </div>
                        </div>

                        <div style={{ fontSize: 12, fontWeight: 700, color: step.color, textAlign: 'center', marginTop: 40, background: 'white', border: `1px solid ${step.color}`, padding: '8px 12px', borderRadius: 999, zIndex: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                           {step.touchpoint}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Footer: Pain Points Solved */}
            <div style={{ background: '#0F172A', color: 'white', padding: '24px 32px' }}>
               <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, color: '#94A3B8' }}>Pain Points Solved & Opportunities</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                  <ul style={{ fontSize: 13, color: '#F1F5F9', paddingLeft: 16, margin: 0 }}>
                     <li>ลดเวลารอคอย (IMC Gap) จาก 6 เดือนเหลือ <span style={{ color: '#38BDF8', fontWeight: 700 }}>&lt; 7 วัน</span></li>
                  </ul>
                  <ul style={{ fontSize: 13, color: '#F1F5F9', paddingLeft: 16, margin: 0 }}>
                     <li>แก้ปัญหา Care Manager ขาดแคลนด้วย AI</li>
                  </ul>
                  <ul style={{ fontSize: 13, color: '#F1F5F9', paddingLeft: 16, margin: 0 }}>
                     <li>ลดภาระงานเอกสารซ้ำซ้อนของ รพ. และ สปสช.</li>
                  </ul>
                  <ul style={{ fontSize: 13, color: '#F1F5F9', paddingLeft: 16, margin: 0 }}>
                     <li>ปิดช่องโหว่ผู้ป่วยตกหล่นจากระบบ</li>
                  </ul>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
