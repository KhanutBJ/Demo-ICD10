'use client';
import React from 'react';

export default function PainPointTab() {
  const points = [
    {
      id: 1,
      title: 'การค้นพบผู้ป่วยล่าช้า (Delayed Discovery)',
      pain: 'รอให้ญาติมาแจ้ง หรือรอ อสม. เดินเท้าสำรวจตามบ้าน ทำให้ผู้ป่วยติดเตียงเข้าถึงสิทธิ์ล่าช้าหรือตกหล่นจากระบบ',
      stats: 'บทที่ 5 รายงาน ม.มหิดล/สปสช. 2568: ผู้สูงอายุถูกคัดกรองเพียง 55% (6.67 ล้านจาก 13.94 ล้านคน) — ผู้สูงอายุ ~6.2 ล้านคน ไม่เคยถูกประเมินภาวะพึ่งพิงเลย และในกลุ่มที่รู้จักระบบแล้ว (338,049 คน ติดบ้าน+ติดเตียง ปี 2567) ยังเข้าถึงบริการ LTC จริงเพียง 60.90% ในเขตเทศบาล และ 81.99% นอกเขตเทศบาล — หมายความว่า ~58,000 คนในเมือง ไม่ได้รับบริการแม้จะอยู่ในรายชื่อ ขณะที่สิทธิ์ผ้าอ้อมต้องมี Care Plan ก่อนจึงจะเบิกได้ จึงสร้างคอขวดตกหล่น 2 ชั้น (ไม่ถูกค้นพบ → ไม่มี Care Plan → ไม่ได้ผ้าอ้อม)',
      solution: 'เชื่อมต่อฐานข้อมูล HIS ของ รพ. ดักจับรหัสโรค (เช่น I63.9 Stroke) ทันทีที่แพทย์วินิจฉัย และส่งเรื่องเข้าแพลตฟอร์มอัตโนมัติ',
      highlight: 'Auto Pre-screen & Fast-track ภายใน 7 วัน',
    },
    {
      id: 2,
      title: 'คอขวดที่ Care Manager (CM Overload)',
      pain: 'CM 1 คนต้องดูแลผู้ป่วยเกินอัตราส่วน การลงพื้นที่และร่าง Care Plan ด้วยมือใช้เวลานาน ทำให้คิวประเมินค้างท่อเป็นเดือน',
      stats: 'ระบบ LTC ปี 2567 มี CM 20,220 คน, CG 106,650 คน (อัตราส่วน CG:CM = 5.3:1) แต่ผู้ใช้บริการเฉลี่ย 3.2 คน/CG — ในเขตสุขภาพที่ 10 CG 1 คน ต้องดูแลผู้สูงอายุถึง 7 ราย ขณะที่ค่าตอบแทน CM ต่อ Care Plan เพียง 100 บาท/ราย และ CG รับค่าตอบแทนจริงเฉลี่ยเพียง 1,620 บาท/เดือน (Khongboon 2023) ต่ำกว่า Living Wage 10,000 บาท ถึง 6 เท่า ส่งผลให้ 27.7% ของ CG ในระบบ LTC พิจารณาออกจากงาน',
      solution: 'ส่ง Line Agent ให้ญาติตอบคำถามพฤติกรรม (Behavioral Q) เบื้องต้น จากนั้น AI จะคำนวณ ADL และร่าง Care Plan อัตโนมัติ CM ทำหน้าที่เพียง "ตรวจสอบและอนุมัติ"',
      highlight: 'ลดภาระงานเอกสารลง 80%',
    },
    {
      id: 3,
      title: 'กระบวนการเอกสารหลายหน่วยงาน (Fragmented Paperwork)',
      pain: 'รพ. ส่งให้ อสม. → ศูนย์อนามัย → สปสช. / อปท. ขั้นตอนผ่านกระดาษและรอรอบการประชุม ข้อมูลสูญหายและล่าช้า',
      stats: 'อปท. ที่เข้าร่วมโครงการผ้าอ้อมในปี 2566 มี 1,876 แห่ง ต้องบันทึกข้อมูลซ้ำ 3 ระบบ (3C กรมอนามัย / สปสช. / HOSxP รพ.) ใช้เอกสาร 4 ชุดต่อ Care Plan 1 ราย และรอรอบประชุมอนุกรรมการ LTC ที่จัดเพียง 1–2 ครั้งต่อปี งบค้างเบิกนานหลายเดือน',
      solution: 'ใช้สถาปัตยกรรมแบบ Single Source of Truth ทุกหน่วยงานเห็นข้อมูลชุดเดียวกันและอัปเดตสถานะแบบ Real-time',
      highlight: 'ไม่ต้องส่งเอกสารกระดาษ 100%',
    },
    {
      id: 4,
      title: 'การตรวจสอบและเบิกจ่ายงบประมาณ (Budget Tracking)',
      pain: 'ไม่สามารถติดตามผลการใช้งานจริงได้ สปสช. ไม่รู้ว่าผ้าอ้อมถึงมือผู้ป่วยจริงหรือไม่ และราคากลางจัดซื้อต่ำกว่าตลาดทำให้ กปท. หลายแห่ง "ซื้อของไม่ได้" แม้มีงบ',
      stats: 'งบ LTC 6,000 บาท/คน/ปี ครอบคลุมต้นทุนจริงเพียง 13–29% (ต้นทุนจริง 24,732–44,677 บาท/คน/ปี) ราคากลางผ้าอ้อม 9.50 บาท/ชิ้น แต่ตลาดจริง 15.27 บาท — ทำให้ กปท.หลายแห่งจัดซื้อไม่ได้ (เครือข่ายผู้ป่วยยื่นหนังสือรัฐมนตรี พ.ย. 2567 ขอปรับราคากลาง) นอกจากนี้ 20% ของ อปท.แจ้งว่าจะ "ยุติโครงการ" เมื่องบ LTC หมด และ 18.02 ล้านชิ้นที่แจกจ่ายปี 2566 ไม่มีระบบยืนยันว่าถึงมือผู้ป่วยจริง',
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
