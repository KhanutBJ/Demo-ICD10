'use client';
import React from 'react';

export default function PainPointTab() {
  const points = [
    {
      id: 1,
      title: 'การค้นพบผู้ป่วยล่าช้า (Delayed Discovery)',
      pain: 'รอให้ญาติมาแจ้ง หรือรอ อสม. เดินเท้าสำรวจตามบ้าน ทำให้ผู้ป่วยติดเตียงเข้าถึงสิทธิ์ล่าช้าหรือตกหล่นจากระบบ',
      stats: 'ปี 2566 มีผู้ป่วยติดเตียงเข้าถึงสิทธิ์ 44,667 คน (ใช้งบกว่า 154 ล้านบาท) แต่ยังมีผู้ป่วยอีกกว่า 60% ที่ยังไม่ถูกค้นพบเนื่องจากระบบ Manual',
      solution: 'เชื่อมต่อฐานข้อมูล HIS ของ รพ. ดักจับรหัสโรค (เช่น I63.9 Stroke) ทันทีที่แพทย์วินิจฉัย และส่งเรื่องเข้าแพลตฟอร์มอัตโนมัติ',
      highlight: 'Auto Pre-screen & Fast-track ภายใน 7 วัน',
    },
    {
      id: 2,
      title: 'คอขวดที่ Care Manager (CM Overload)',
      pain: 'CM 1 คนต้องดูแลผู้ป่วยเกินอัตราส่วน การลงพื้นที่และร่าง Care Plan ด้วยมือใช้เวลานาน ทำให้คิวประเมินค้างท่อเป็นเดือน',
      stats: 'ไทยขาดแคลนบุคลากรดูแลผู้สูงอายุกว่า 14,000 คน ปัจจุบัน CM 1 คนต้องแบกภาระดูแลผู้ป่วยเกินเกณฑ์มาตรฐาน (1:35) ผสมกับงานประจำที่ รพ.สต.',
      solution: 'ส่ง Line Agent ให้ญาติตอบคำถามพฤติกรรม (Behavioral Q) เบื้องต้น จากนั้น AI จะคำนวณ ADL และร่าง Care Plan อัตโนมัติ CM ทำหน้าที่เพียง "ตรวจสอบและอนุมัติ"',
      highlight: 'ลดภาระงานเอกสารลง 80%',
    },
    {
      id: 3,
      title: 'กระบวนการเอกสารหลายหน่วยงาน (Fragmented Paperwork)',
      pain: 'รพ. ส่งให้ อสม. → ศูนย์อนามัย → สปสช. / อปท. ขั้นตอนผ่านกระดาษและรอรอบการประชุม ข้อมูลสูญหายและล่าช้า',
      stats: 'อปท. ที่เข้าร่วมโครงการผ้าอ้อมในปี 2566 มี 1,876 แห่ง แต่ละแห่งมีรูปแบบเอกสารและรอบการประชุมที่ต่างกัน ทำให้เกิดคอขวดเชิงนโยบาย',
      solution: 'ใช้สถาปัตยกรรมแบบ Single Source of Truth ทุกหน่วยงานเห็นข้อมูลชุดเดียวกันและอัปเดตสถานะแบบ Real-time',
      highlight: 'ไม่ต้องส่งเอกสารกระดาษ 100%',
    },
    {
      id: 4,
      title: 'การตรวจสอบและเบิกจ่ายงบประมาณ (Budget Tracking)',
      pain: 'ไม่สามารถติดตามผลการใช้งานจริงได้ สปสช. ไม่รู้ว่าผ้าอ้อมถึงมือผู้ป่วยจริงหรือไม่ เสี่ยงต่อการเบิกงบซ้ำซ้อน',
      stats: 'ผ้าอ้อมถูกแจกจ่ายไปกว่า 18.02 ล้านชิ้นในปี 2566 แต่ยังไม่มีระบบติดตาม (Tracking) ว่าถูกนำไปใช้ตรงตาม Care Plan หรือมีการขายต่อสวมสิทธิ์หรือไม่',
      solution: 'ญาติหรือ อสม. สแกน QR Code ยืนยันการรับของและอัปเดตอาการรายสัปดาห์ ผูกกับเลขบัตรประชาชน',
      highlight: 'ป้องกันการสวมสิทธิ์ 100%',
    }
  ];

  return (
    <div className="anim-fade-up" style={{ maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Hero-Style Header Banner */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.85)), url(/cm-field-work.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 24,
        padding: '80px 40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        marginBottom: 40
      }}>
         {/* Decorative Blurs */}
         <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(0,184,124,0.2)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />
         <div style={{ position: 'absolute', bottom: -50, left: '10%', width: 200, height: 200, background: 'rgba(37,99,235,0.2)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
         
         <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800, letterSpacing: 1, display: 'inline-block', marginBottom: 20, color: '#A7F3D0' }}>
               EXECUTIVE SUMMARY
            </span>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: '-0.5px' }}>
              Why This Platform?
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
              เจาะลึก 4 ปัญหาเชิงโครงสร้างที่แพลตฟอร์มนี้เข้ามาแก้ไขแบบเบ็ดเสร็จ เพื่อผู้ป่วยติดเตียงและบุคลากรด่านหน้า
            </p>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {points.map((p, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', overflow: 'hidden', background: 'white' }}>
             
             {/* PAIN SECTION (RED) */}
             <div style={{ flex: 1, padding: 24, borderRight: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                   <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 10px', borderRadius: 4, fontSize: 13, fontWeight: 800 }}>
                     PAIN POINT
                   </div>
                   <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{p.title}</h2>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                   <div style={{ color: '#EF4444', marginTop: 2 }}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                   </div>
                   <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                     {p.pain}
                   </p>
                </div>
                <div style={{ marginTop: 20, padding: 12, background: '#F1F5F9', borderRadius: 6, borderLeft: '3px solid #94A3B8' }}>
                   <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>RESEARCH & STATS</div>
                   <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                     {p.stats}
                   </p>
                </div>
             </div>

             {/* SOLUTION SECTION (GREEN) */}
             <div style={{ flex: 1.2, padding: 24, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                   <div style={{ background: '#D1FAE5', color: '#059669', padding: '6px 10px', borderRadius: 4, fontSize: 13, fontWeight: 800 }}>
                     OUR SOLUTION
                   </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                   <div style={{ color: '#10B981', marginTop: 2 }}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </div>
                   <div>
                     <p style={{ fontSize: 14, color: '#111827', fontWeight: 600, lineHeight: 1.6, margin: 0, marginBottom: 12 }}>
                       {p.solution}
                     </p>
                     <span style={{ display: 'inline-block', background: '#F0FDF4', color: '#00B87C', border: '1px solid #A7F3D0', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 800 }}>
                       💡 {p.highlight}
                     </span>
                   </div>
                </div>
             </div>

          </div>
        ))}
      </div>

    </div>
  );
}
