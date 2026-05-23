'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const HISGatewayTab = dynamic(() => import('./components/HISGatewayTab'), { ssr: false });
const ReferralTab   = dynamic(() => import('./components/ReferralTab'),   { ssr: false });
const AIAgentTab    = dynamic(() => import('./components/AIAgentTab'),    { ssr: false });
const VHVTab        = dynamic(() => import('./components/VHVTab'),        { ssr: false });
const InsightsTab   = dynamic(() => import('./components/InsightsTab'),   { ssr: false });

const TABS = [
  { id: 'his',       label: 'HIS Gateway' },
  { id: 'referral',  label: 'Auto-Referral' },
  { id: 'agent',     label: 'AI Agent' },
  { id: 'vhv',       label: 'อสม. Monitor' },
  { id: 'insights',  label: 'Insights' },
];

export default function HomePage() {
  const [active, setActive] = useState('referral');
  const now = new Date().toLocaleDateString('th-TH', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#00B87C', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #00D08A, #00A36D)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><rect x="7.5" y="2" width="3" height="14" rx="1.5" fill="white"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="white"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'white', letterSpacing: '-0.2px' }}>Synapse x Right</div>
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>LTC AI Agent Platform</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="sm-show" style={{ fontSize: 13, color: '#E6F9F3', fontWeight: 500 }}>{now}</span>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', background: 'rgba(255, 255, 255, 0.2)', color: 'white', borderRadius: 999, border: '1px solid rgba(255, 255, 255, 0.3)' }}>● ระบบพร้อมใช้งาน</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                style={{
                  background: 'none', border: 'none', padding: '10px 0 14px', cursor: 'pointer',
                  color: active === t.id ? 'white' : 'rgba(255,255,255,0.7)',
                  fontWeight: active === t.id ? 700 : 500,
                  fontSize: 14,
                  borderBottom: active === t.id ? '3px solid white' : '3px solid transparent',
                  transition: '0.2s',
                }}>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div className="anim-fade-up">
          {active === 'his'       && <HISGatewayTab />}
          {active === 'referral'  && <ReferralTab />}
          {active === 'agent'     && <AIAgentTab />}
          {active === 'vhv'       && <VHVTab />}
          {active === 'insights'  && <InsightsTab />}
        </div>
      </main>

      <footer style={{ background: '#0F172A', padding: '24px 24px', textAlign: 'center', borderTop: '1px solid #1E293B' }}>
        <p style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>
          <strong style={{ color: 'white' }}>ระบบบูรณาการสิทธิ์ผ้าอ้อมผู้ใหญ่ (Diaper Auto-Referral)</strong> — กองทุนหลักประกันสุขภาพแห่งชาติ
        </p>
        <p style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>
          © 2026 National Health Security Office. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
