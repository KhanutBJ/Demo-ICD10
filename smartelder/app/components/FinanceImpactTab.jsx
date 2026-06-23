'use client';
import React from 'react';

const COSTS = [
  { label: 'Platform Development', value: 1400000, color: '#1565C0' },
  { label: 'Cloud & AI Infrastructure', value: 1668000, color: '#1B3A6B' },
  { label: 'Maintenance & Support', value: 2280000, color: '#90CAF9' },
  { label: 'Training & อสม. Support', value: 1190000, color: '#E8A0BF' },
  { label: 'Contingency & Messaging', value: 630000, color: '#222222' },
];

const TOTAL_INVESTMENT = 7168000;

const IMPACT_BARS = [
  { year: '2570', label: 'Phase 1', patients: 1400, barHeight: 8 },
  { year: '2571', label: 'Phase 2', patients: 15400, barHeight: 45 },
  { year: '2572', label: 'Phase 3', patients: 60400, barHeight: 100 },
];

function DonutChart() {
  const total = COSTS.reduce((s, c) => s + c.value, 0);
  let cumulative = 0;
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 95;
  const innerR = 58;

  const segments = COSTS.map((c) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += c.value;
    const endAngle = (cumulative / total) * 360;
    const pct = ((c.value / total) * 100).toFixed(1);
    return { ...c, startAngle, endAngle, pct };
  });

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(cx, cy, outerR, innerR, startAngle, endAngle) {
    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((s, i) => (
            <path key={i} d={arcPath(cx, cy, outerR, innerR, s.startAngle, s.endAngle - 0.5)} fill={s.color} />
          ))}
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>3 YEARS</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>7.17M</div>
          <div style={{ fontSize: 11, color: '#888' }}>THB</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#444' }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{s.pct}%</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactBars() {
  const maxPatients = 60400;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 28, height: 220, paddingBottom: 8 }}>
      {IMPACT_BARS.map((b, i) => {
        const h = Math.max((b.patients / maxPatients) * 180, 20);
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#1B4332' }}>
              {b.patients >= 1000 ? `${(b.patients / 1000).toFixed(b.patients >= 10000 ? 1 : 1)}K` : b.patients.toLocaleString()}
            </div>
            <div style={{
              width: 64,
              height: h,
              borderRadius: '8px 8px 4px 4px',
              background: `linear-gradient(180deg, #00B87C ${0}%, #1B4332 ${100}%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>{b.label}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{b.year}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function FinanceImpactTab() {
  return (
    <div className="anim-fade-up" style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1B4332 100%)',
        borderRadius: 20,
        padding: '40px 40px 32px',
        color: 'white',
        textAlign: 'center',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(0,184,124,0.15)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <span style={{ background: 'rgba(255,255,255,0.12)', padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#A7F3D0' }}>
          FINANCIAL & SOCIAL IMPACT
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '12px 0 8px', letterSpacing: '-0.5px' }}>ผลกระทบ</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto' }}>
          ต้นทุนแพลตฟอร์ม vs ผลลัพธ์เชิงสังคมที่วัดได้จริง
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* LEFT — Cost Structure */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#F8FAFC', padding: '14px 24px', borderBottom: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: 0.5 }}>COST STRUCTURE</h2>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>3 Years Cost Projection (CAPEX + OPEX)</p>
          </div>
          <div style={{ padding: '24px 20px' }}>
            <DonutChart />
          </div>
          <div style={{ borderTop: '1px solid #E2E8F0', padding: '16px 24px', background: '#F8FAFC' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>CAPEX</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1565C0' }}>1.75M</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>OPEX / 3 ปี</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B' }}>5.42M</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>ต่อผู้ป่วย/ปี</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#00B87C' }}>119 ฿</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Social Impact */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#F0FDF4', padding: '14px 24px', borderBottom: '1px solid #A7F3D0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1B4332', margin: 0, letterSpacing: 0.5 }}>SOCIAL IMPACT PROJECTION</h2>
            <p style={{ fontSize: 12, color: '#4ADE80', margin: '2px 0 0', fontWeight: 600 }}>ผู้ป่วยเข้าถึงสิทธิ์ผ้าอ้อมสะสม (คน)</p>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <ImpactBars />
          </div>
          <div style={{ borderTop: '1px solid #D1FAE5', padding: '16px 24px', background: '#F0FDF4' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>ครอบครัวประหยัด</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>10,140 ฿/ปี</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>CM Capacity</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>×3 เท่า</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Patients Reached */}
        <div className="card" style={{ textAlign: 'center', padding: '24px 16px', background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>เข้าถึงสิทธิ์ใน 3 ปี</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#1B4332', lineHeight: 1.1 }}>60,400</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>คน</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>จาก 387,000 คนตกหล่น</div>
        </div>

        {/* Total Investment */}
        <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>Total Investment</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#1565C0', lineHeight: 1.1, border: '2px solid #1565C0', borderRadius: 12, padding: '8px 16px', display: 'inline-block' }}>
            7,168,000
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1565C0', marginTop: 4 }}>THB</div>
        </div>

        {/* SROI */}
        <div className="card" style={{ textAlign: 'center', padding: '24px 16px', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 8 }}>Social Return on Investment</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>ลดภาระครอบครัว</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#B45309' }}>612M ฿</div>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: '6px 16px', background: '#FCD34D', borderRadius: 999, display: 'inline-block', fontSize: 16, fontWeight: 900, color: '#78350F' }}>
            SROI 85 : 1
          </div>
        </div>
      </div>

      {/* Key Message */}
      <div className="card" style={{ padding: '20px 28px', background: 'linear-gradient(135deg, #0F172A, #1B4332)', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: '#A7F3D0', fontWeight: 700, marginBottom: 2 }}>เวลาเข้าถึงสิทธิ์</div>
            <span style={{ fontSize: 24, fontWeight: 900 }}>45 → 14 </span>
            <span style={{ fontSize: 14, color: '#A7F3D0' }}>วัน</span>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: 11, color: '#A7F3D0', fontWeight: 700, marginBottom: 2 }}>เทียบเท่าจ้าง CM เพิ่ม</div>
            <span style={{ fontSize: 24, fontWeight: 900 }}>~800 </span>
            <span style={{ fontSize: 14, color: '#A7F3D0' }}>คน</span>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: 11, color: '#A7F3D0', fontWeight: 700, marginBottom: 2 }}>Coverage Gap</div>
            <span style={{ fontSize: 24, fontWeight: 900 }}>56% → &lt;20%</span>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: 11, color: '#A7F3D0', fontWeight: 700, marginBottom: 2 }}>ลงทุนเพียง</div>
            <span style={{ fontSize: 24, fontWeight: 900 }}>119 </span>
            <span style={{ fontSize: 14, color: '#A7F3D0' }}>฿/คน/ปี</span>
          </div>
        </div>
      </div>

    </div>
  );
}
