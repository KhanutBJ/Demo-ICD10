'use client';
import React from 'react';

export default function PatientDetailTab() {
  return (
    <div className="anim-fade-up">
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>HN-2024-001 (Patient Detail)</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>ICD-10: I63.9 — Tier: STROKE_DEPENDENT</p>
        </div>
        <button className="btn-primary touch-active" style={{ borderRadius: 8 }}>Export PDF</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Unlocked Rights */}
        <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#00B87C', color: 'white', padding: 6, borderRadius: 8 }}>🎁</div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>สิทธิ์ที่ถูกปลดล็อก</h2>
            </div>
            <span className="chip" style={{ background: '#E6F9F3', color: '#00B87C' }}>3 รายการ</span>
          </div>

          <div style={{ background: '#F0FDF4', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#00B87C', marginBottom: 16 }}>
            ICD-10: I63.9 — Tier: STROKE_DEPENDENT
          </div>

          <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            🤖 RAG — หน่วยงานที่เกี่ยวข้อง
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['สปสช.', 'กปท.', 'กองทุนดูแลระยะยาว', 'กองทุนฟื้นฟูจังหวัด', 'อปท.'].map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue)', border: '1px solid var(--blue-light)', padding: '4px 10px', borderRadius: 6 }}>{tag}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🧻', title: 'ผ้าอ้อมฟรี', desc: '3 ชิ้น/วัน (กปท.)', status: 'ได้รับแล้ว' },
              { icon: '👤', title: 'Caregiver', desc: '6,000-10,442 บาท/ปี', status: 'มีสิทธิ์' },
              { icon: '🛏️', title: 'อุปกรณ์การแพทย์', desc: 'ยืมเตียง/รถเข็นฟรี', status: 'มีสิทธิ์' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: '1px solid #A7F3D0', borderRadius: 10, background: '#F0FDF4' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 24 }}>{item.icon}</div>
                    <div>
                       <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{item.title}</div>
                       <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.desc}</div>
                    </div>
                 </div>
                 <span style={{ fontSize: 12, fontWeight: 700, color: '#00B87C', background: '#D1FAE5', padding: '4px 12px', borderRadius: 999 }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Change History Timeline */}
        <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
             <div style={{ background: '#0F172A', color: 'white', padding: 6, borderRadius: 8 }}>📋</div>
             <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>ประวัติการเปลี่ยนแปลง</h2>
          </div>
          <div style={{ position: 'relative', paddingLeft: 16, borderLeft: '2px solid var(--border)' }}>
             {[
               { date: '23 พ.ค. 2569 23:39', txt: 'สถานะเปลี่ยนเป็น: Active', color: '#00B87C' },
               { date: '23 พ.ค. 2569 23:39', txt: 'สถานะเปลี่ยนเป็น: Renewed', color: '#00B87C' },
               { date: '23 พ.ค. 2569 23:32', txt: 'สถานะเปลี่ยนเป็น: Suspended', color: '#FF9500' },
               { date: '20 พ.ค. 2568', txt: 'ICD-10: I63.9 บันทึกโดยแพทย์ (Tier: STROKE_DEPENDENT)', color: '#00B87C' },
               { date: '20 พ.ค. 2568', txt: 'Eligible → Active (TTL 180 วัน)', color: '#00B87C' },
             ].map((evt, i) => (
               <div key={i} style={{ marginBottom: 20, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -22, top: 2, width: 10, height: 10, borderRadius: '50%', background: evt.color, border: '2px solid white' }} />
                  <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 2 }}>{evt.date}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{evt.txt}</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 24 }}>
        {/* Contact Agent Timeline */}
        <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
             <div style={{ background: '#0F172A', color: 'white', padding: 6, borderRadius: 8 }}>🤖</div>
             <div>
               <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Contact Agent</h2>
               <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>ต้องติดต่อใครบ้าง — Tier: STROKE_DEPENDENT</div>
             </div>
           </div>
           <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid #E2E8F0', marginTop: 10 }}>
              {[
                { icon: '🏥', title: 'โรงพยาบาล', badge: 'แจ้งวินิจฉัย ICD-10: I63', desc: 'ส่งข้อมูล ICD-10 + Barthel ADL → เจ้าหน้าที่ศูนย์ฯ ประจำโซน' },
                { icon: '🧑‍⚕️', title: 'อสม. ชุมชน', badge: 'ประสานลงพื้นที่', desc: 'นัดหมายกับญาติก่อนเยี่ยมบ้าน — ขออนุญาตก่อนเข้าบ้านและถ่ายรูป' },
                { icon: '👩‍⚕️', title: 'พยาบาลวิชาชีพ', badge: 'เยี่ยมบ้าน + ประเมิน Barthel ADL', desc: 'วัด BP, O2Sat, ประเมินกิจวัตร, บันทึก Care Plan ใน Program 3C กรมอนามัย' },
                { icon: '🏢', title: 'กปท.', badge: 'จัดส่งผ้าอ้อมฟรี', desc: '3 ชิ้น/วัน — ส่งถึงเคาน์เตอร์ศูนย์อนามัย พร้อม PIN รับของ 6 หลัก' },
                { icon: '🏛️', title: 'อปท./เทศบาล', badge: 'ลงทะเบียน Caregiver + กองทุนดูแลระยะยาว', desc: 'Caregiver 6,000-10,442 บาท/ปี + ประสานกองสวัสดิการสังคม' },
              ].map((step, i) => (
                <div key={i} style={{ marginBottom: 24, position: 'relative' }}>
                   <div style={{ position: 'absolute', left: -40, top: 0, width: 32, height: 32, borderRadius: '50%', background: 'white', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{step.icon}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--blue)' }}>{step.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, background: 'var(--blue-light)', color: 'var(--blue)', padding: '2px 6px', borderRadius: 4 }}>{step.badge}</span>
                   </div>
                   <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              ))}
           </div>
           <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', padding: 16, borderRadius: 8, marginTop: 16 }}>
             <div style={{ fontSize: 11, color: '#00B87C', fontWeight: 700, marginBottom: 4 }}>🏥 เคาน์เตอร์รับของใกล้บ้าน</div>
             <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>ศูนย์อนามัยที่ 1 (เชียงใหม่)</div>
             <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>ถ.เจริญราษฎร์ อ.เมือง จ.เชียงใหม่<br/>โทร: 053-242-xxx</div>
           </div>
        </div>

        {/* Nurse Task Board */}
        <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <div style={{ background: '#6E4FF6', color: 'white', padding: 6, borderRadius: 8 }}>📋</div>
                 <div>
                   <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Nurse Task Board</h2>
                   <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>SOP บทที่ ๓ ขั้นตอน ๑-๓</div>
                 </div>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--blue)' }}>2/5</span>
           </div>
           <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: '#6E4FF6' }} />
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             {[
               { title: 'รับข้อมูลผู้ป่วย', desc: 'จากโรงพยาบาล / อสม. / ผู้ป่วยหรือญาติ', step: 'ขั้นตอน ๑', checked: true },
               { title: 'นัดหมายเยี่ยมบ้าน', desc: 'นัดกับญาติ/อสม. ก่อนลงพื้นที่', step: 'ขั้นตอน ๒', checked: true },
               { title: 'เยี่ยมบ้าน + ประเมิน Barthel ADL', desc: 'วัด BP, O2Sat, ดัชนีบาร์เธลเอล', step: 'ขั้นตอน ๒', checked: false },
               { title: 'วางแผน Care Plan (Program 3C)', desc: 'บันทึกปัญหาสุขภาพในระบบกรมอนามัย', step: 'ขั้นตอน ๓', checked: false },
               { title: 'ส่งต่อสหวิชาชีพ', desc: 'กปท. / กองทุนดูแลระยะยาว / อปท.', step: 'ขั้นตอน ๓', checked: false },
             ].map((t, i) => (
               <div key={i} style={{ display: 'flex', gap: 12, padding: 16, border: `1px solid ${t.checked ? '#00B87C' : 'var(--border)'}`, background: t.checked ? '#F0FDF4' : 'var(--surface)', borderRadius: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${t.checked ? '#00B87C' : '#CBD5E1'}`, background: t.checked ? '#00B87C' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                     {t.checked && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                       <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{t.title}</div>
                       <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>{t.step}</div>
                     </div>
                     <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{t.desc}</div>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Delivery Tracking */}
        <div className="card" style={{ padding: 24, background: 'var(--surface)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ background: '#FF9500', color: 'white', padding: 6, borderRadius: 8 }}>📦</div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Delivery Tracking</h2>
           </div>
           
           <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 32 }}>🧻</div>
              <div>
                 <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>ผ้าอ้อมฟรี — 3 ชิ้น/วัน (กปท.)</div>
                 <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>ปลายทาง: ศูนย์อนามัยที่ 1</div>
              </div>
           </div>

           {/* Progress track */}
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, left: 20, right: 20, height: 2, background: '#E2E8F0', zIndex: 0 }} />
              <div style={{ position: 'absolute', top: 16, left: 20, width: '50%', height: 2, background: '#4B8BFF', zIndex: 1 }} />
              {[
                { icon: '📋', state: 'สร้าง', done: true },
                { icon: '📦', state: 'จัดเตรียม', done: true },
                { icon: '🚚', state: 'ออกจัดส่ง', done: true, current: true },
                { icon: '🏢', state: 'ถึงเคาน์เตอร์', done: false },
                { icon: '✅', state: 'รับของแล้ว', done: false },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.current ? '#4B8BFF' : s.done ? '#FF9500' : 'white', border: `2px solid ${s.done ? (s.current ? '#4B8BFF' : '#FF9500') : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {s.icon}
                   </div>
                   <div style={{ fontSize: 9, fontWeight: 600, color: s.done ? 'var(--ink)' : 'var(--ink-4)' }}>{s.state}</div>
                </div>
              ))}
           </div>

           <div style={{ background: '#F0F6FF', border: '1px solid #BFDBFE', padding: 16, borderRadius: 10, textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🚚</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#2563EB' }}>ออกจัดส่งแล้ว</div>
           </div>

           {/* PIN Box */}
           <div style={{ background: '#0F172A', padding: '20px 24px', borderRadius: 12, color: 'white' }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>PIN รับของที่เคาน์เตอร์</div>
              <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: 8, color: '#00B87C', lineHeight: 1 }}>8 4 7 2 9 3</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 12 }}>แจ้ง PIN นี้กับเจ้าหน้าที่ที่เคาน์เตอร์ ศูนย์อนามัยที่ 1</div>
           </div>

           <button className="btn-primary touch-active" style={{ width: '100%', marginTop: 16, background: 'transparent', border: '1px dashed #CBD5E1', color: 'var(--ink-3)', fontSize: 13 }}>▶ Demo: เลื่อนสถานะถัดไป</button>
        </div>
      </div>
    </div>
  );
}
