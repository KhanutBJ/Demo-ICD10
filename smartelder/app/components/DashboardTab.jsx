'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const DATA = [
  { name:'รพ.บางมด',         rate:8,  status:'ดี',    color:'#0F6E56', bg:'#F0FDF9' },
  { name:'รพ.สมเด็จ',        rate:12, status:'ปกติ',  color:'#3B82F6', bg:'#EFF6FF' },
  { name:'รพ.ราษฎร์บูรณะ',  rate:28, status:'สูง',   color:'#F59E0B', bg:'#FFFBEB' },
  { name:'รพ.ธนบุรี',        rate:41, status:'วิกฤต', color:'#EF4444', bg:'#FFF1F2' },
];

const BADGE = {
  ดี:    { cls:'badge-green',  icon:'✅' },
  ปกติ:  { cls:'badge-blue',   icon:'🔵' },
  สูง:   { cls:'badge-yellow', icon:'⚠️' },
  วิกฤต: { cls:'badge-red',    icon:'🚨' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const { rate, color } = payload[0].payload;
  return (
    <div style={{ background:'white', border:'1.5px solid #E8F0ED', borderRadius:14, padding:'12px 16px', boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}>
      <p style={{ fontWeight:700, color:'#1A2E28', marginBottom:4, fontSize:13 }}>{label}</p>
      <p style={{ color, fontWeight:800, fontSize:16 }}>{rate}%</p>
      <p style={{ fontSize:11, color:'#9BBCAF', marginTop:2 }}>อัตราปฏิเสธสิทธิ์</p>
      {rate >= 30 && <p style={{ fontSize:11, color:'#EF4444', marginTop:4, fontWeight:600 }}>⚠️ เกินเกณฑ์ สปสช. (25%)</p>}
    </div>
  );
};

export default function DashboardTab() {
  return (
    <div>
      {/* Impact metrics */}
      <div className="responsive-grid-4" style={{ marginBottom:20 }}>
        {[
          { icon:'💰', value:'฿2.4M', label:'เงินสวัสดิการปลดล็อก', sub:'ต่อเดือน (ทั่วประเทศ)', color:'#0F6E56' },
          { icon:'👴', value:'1,247', label:'ผู้สูงอายุได้รับสิทธิ์', sub:'เพิ่มขึ้นจากระบบเดิม', color:'#6366F1' },
          { icon:'🚫', value:'0',    label:'เคสตกหล่น', sub:'Zero-gap สิทธิ์สาธารณสุข', color:'#17A97E' },
          { icon:'⚡', value:'<1hr', label:'เวลาปลดล็อกสิทธิ์', sub:'จากเดิม 2–4 สัปดาห์', color:'#F59E0B' },
        ].map((m, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.88)', backdropFilter:'blur(12px)', border:`1px solid ${m.color}20`, borderRadius:20, padding:'20px 16px', textAlign:'center', boxShadow:'0 4px 24px rgba(15,110,86,0.07)' }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{m.icon}</div>
            <div className="impact-number" style={{ fontSize:28 }}>{m.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#1A2E28', marginTop:4 }}>{m.label}</div>
            <div style={{ fontSize:11, color:'#9BBCAF', marginTop:2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div style={{
        borderRadius:16, padding:'14px 18px', marginBottom:20,
        background:'linear-gradient(135deg,#FFF1F2,#FFF5F5)',
        border:'1.5px solid #FECDD3',
        display:'flex', alignItems:'flex-start', gap:12,
        boxShadow:'0 4px 16px rgba(239,68,68,0.1)',
      }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🚨</div>
        <div>
          <p style={{ fontWeight:800, color:'#991B1B', fontSize:15 }}>พบความผิดปกติด่วน!</p>
          <p style={{ fontSize:13, color:'#B91C1C', lineHeight:1.6, marginTop:2 }}>
            รพ.ธนบุรี มีอัตราปฏิเสธสิทธิ์ <strong>41%</strong> — เกินเกณฑ์มาตรฐาน สปสช. (25%) อย่างมีนัยสำคัญ ควรเข้าตรวจสอบโดยด่วน
          </p>
        </div>
      </div>

      {/* Chart card */}
      <div className="glass-card" style={{ padding:'24px', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:'linear-gradient(135deg,#0F6E56,#17A97E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📊</div>
            <div>
              <h2 style={{ fontSize:16, fontWeight:800, color:'#1A2E28' }}>อัตราการปฏิเสธสิทธิ์ตามโรงพยาบาล</h2>
              <p style={{ fontSize:12, color:'#9BBCAF', marginTop:1 }}>ข้อมูล Q1/2568 • เส้นประแดง = เกณฑ์ สปสช. 25%</p>
            </div>
          </div>
          <span className="badge badge-teal">Live</span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={DATA} margin={{ top:10, right:30, left:0, bottom:5 }} barSize={52}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F0ED" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize:12, fontFamily:'Sarabun,sans-serif', fill:'#6B9A87', fontWeight:600 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v=>`${v}%`} tick={{ fontSize:11, fill:'#9BBCAF' }} axisLine={false} tickLine={false} domain={[0,50]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(15,110,86,0.06)', radius:8 }} />
            <ReferenceLine y={25} stroke="#EF4444" strokeDasharray="6 3" strokeWidth={2}
              label={{ value:'เกณฑ์ 25%', fill:'#EF4444', fontSize:11, position:'right', fontWeight:600 }} />
            <Bar dataKey="rate" radius={[10,10,0,0]}>
              {DATA.map((d,i) => (
                <Cell key={i} fill={d.color} fillOpacity={0.85}
                  style={{ filter:`drop-shadow(0 4px 8px ${d.color}40)` }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hospital cards */}
      <div className="responsive-grid-4" style={{ marginBottom:20 }}>
        {DATA.map((h,i) => (
          <div key={i} className="touch-active" style={{
            borderRadius:20, padding:'18px 16px',
            background: h.bg,
            border:`2px solid ${h.color}30`,
            transition:'all 0.2s',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#1A2E28' }}>{h.name}</span>
              <span className={`badge ${BADGE[h.status].cls}`}>{BADGE[h.status].icon} {h.status}</span>
            </div>
            <div style={{ fontSize:34, fontWeight:900, color:h.color, lineHeight:1 }}>{h.rate}%</div>
            <p style={{ fontSize:11, color:'#9BBCAF', marginTop:4, marginBottom:12 }}>อัตราปฏิเสธสิทธิ์</p>
            <div style={{ width:'100%', height:6, borderRadius:999, background:`${h.color}20`, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:999, width:`${(h.rate/50)*100}%`, background:h.color, transition:'width 1s ease' }} />
            </div>
            {h.status==='วิกฤต' && (
              <div style={{ marginTop:10, padding:'6px 10px', borderRadius:10, background:'#FEE2E2', fontSize:11, color:'#991B1B', fontWeight:600 }}>
                ⚠️ แนะนำตรวจสอบทันที
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Insight grid */}
      <div className="responsive-grid-3">
        {[
          {
            title:'สาเหตุหลักปฏิเสธ', icon:'📋', color:'#3B82F6',
            items:['ICD-10 ไม่ถูกต้อง (45%)','เอกสารไม่ครบ (28%)','ไม่อยู่ในสิทธิ์ (17%)','อื่นๆ (10%)'],
          },
          {
            title:'ผลกระทบผู้ป่วย', icon:'👴', color:'#EF4444',
            items:['ถูกปฏิเสธ: 847 คน/เดือน','ค่าใช้จ่ายเฉลี่ย: 12,400 บาท','ร้องเรียน สปสช.: 234 เคส','รอเคลียร์ > 30 วัน'],
          },
          {
            title:'แนวทางแก้ไข', icon:'💡', color:'#0F6E56',
            items:['AI ตรวจ code ก่อนส่ง','ฝึกอบรม coder ประจำปี','ติดตั้ง Synape x Right','รายงาน สปสช. รายสัปดาห์'],
          },
        ].map((box,i) => (
          <div key={i} className="glass-card" style={{ padding:'18px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${box.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>{box.icon}</div>
              <span style={{ fontWeight:700, color:'#1A2E28', fontSize:13 }}>{box.title}</span>
            </div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
              {box.items.map((item,j) => (
                <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:12.5, color:'#4B7A6A', lineHeight:1.5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:box.color, flexShrink:0, marginTop:5 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
