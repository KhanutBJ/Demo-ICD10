'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const SLA_DATA = [
  { name: 'ม.ค.', rate: 45, color: '#FF6B6B' },
  { name: 'ก.พ.', rate: 38, color: '#FFD166' },
  { name: 'มี.ค.', rate: 22, color: '#06D6A0' },
  { name: 'เม.ย.', rate: 15, color: '#4B8BFF' },
  { name: 'พ.ค.', rate: 6,  color: '#4B8BFF' },
];

const GAP_STATUS = [
  { gap: 'B1: ระยะเวลาอนุมัติสิทธิ์ (IMC Gap)',     desc: 'ลดเวลาอนุมัติผ้าอ้อม 3 ชิ้น/วัน จาก 180 วัน เป็น ≤7 วัน', status: 'done' },
  { gap: 'B2: ปัญหาขาดแคลน Care Manager', desc: 'ใช้ AI Draft Care Plan ส่งต่อให้ อสม. หรือญาติประเมิน ADL ทาง Line', status: 'done' },
  { gap: 'B3: คณะกรรมการอนุมัติล่าช้า',     desc: 'ระบบ Alert กองทุนตำบล (ดูแลระยะยาว) อัตโนมัติเมื่อเอกสารพร้อม',           status: 'pending' },
  { gap: 'B4: เบิกจ่ายเงินกองทุนช้า',      desc: 'ระบบ Auto-Disbursement ผ่าน PromptPay/Krungthai Corporate',                  status: 'pending' },
];

export default function InsightsTab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>สถิติและผลการดำเนินงาน (Insights)</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>ข้อมูลการประมวลผลและการแก้ไข Pain Points (B1-B4)</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="chip chip-gray" style={{ background: '#3A3A3C', color: 'white', border: 'none' }}>ดาวน์โหลดสถิติ (PDF)</button>
          <button className="chip chip-gray" style={{ background: '#3A3A3C', color: 'white', border: 'none' }}>เชื่อม API</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { value: '1,309,809', label: 'เคสแจ้งขอผ้าอ้อม (สะสม)',  sub: 'ทั่วประเทศ',    color: '#4B8BFF' },
          { value: '100%',      label: 'SLA 7 วัน (B1)',      sub: 'ตั้งแต่ใช้ AI Agent', color: '#06D6A0' },
          { value: '฿12.8M',    label: 'งบประมาณเบิกจ่าย',    sub: 'Q2 / 2026',           color: '#FFD166' },
          { value: '412',       label: 'รออนุมัติกองทุน',    sub: 'รอคณะกรรมการ รพ.สต.', color: '#FF6B6B' },
        ].map((m, i) => (
          <div key={i} style={{
            padding: '24px 20px', borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{m.label}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: m.color, letterSpacing: '-1.5px', lineHeight: 1, marginTop: 14 }}>{m.value}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 8 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="responsive-grid-2">
        {/* Trend Chart */}
        <div className="card" style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>สถิติระยะเวลาอนุมัติสิทธิ์ (วัน)</h2>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>ค่าเฉลี่ยปี 2026 · เส้นประ = เป้าหมาย 7 วัน</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SLA_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Sarabun, sans-serif', fill: 'var(--ink-3)', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v} วัน`} tick={{ fontSize: 11, fill: 'var(--ink-4)', fontWeight: 600 }} axisLine={false} tickLine={false} domain={[0, 50]} />
              <Tooltip cursor={{ fill: 'var(--surface-2)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 600 }} />
              <ReferenceLine y={7} stroke="#FF6B6B" strokeDasharray="5 3" strokeWidth={2}
                label={{ value: 'เป้าหมาย 7 วัน', fill: '#FF6B6B', fontSize: 12, position: 'right', fontWeight: 700 }} />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {SLA_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gap Status table */}
        <div className="card" style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>สถานะการแก้ไขปัญหา (Gap Registry)</h2>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>ความคืบหน้าตามแผนยุทธศาสตร์ ดูแลระยะยาว</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {GAP_STATUS.map((g, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '16px 0', borderBottom: i === GAP_STATUS.length - 1 ? 'none' : '1px solid var(--border)',
              }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: g.status === 'done' ? '#06D6A020' : '#FFD16620',
                  color: g.status === 'done' ? '#06D6A0' : '#FFD166',
                }}>
                  {g.status === 'done' ? 'แก้ไขแล้ว' : 'อยู่ระหว่างพัฒนา'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{g.gap}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
