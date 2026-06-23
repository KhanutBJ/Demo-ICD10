'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const LandingTab       = dynamic(() => import('./components/LandingTab'), { ssr: false });
const ReferralKanban   = dynamic(() => import('./components/ReferralKanban'), { ssr: false });
const HISGatewayTab    = dynamic(() => import('./components/HISGatewayTab'), { ssr: false });
const CMWorkspaceTab   = dynamic(() => import('./components/CMWorkspaceTab'), { ssr: false });
const AIAgentTab       = dynamic(() => import('./components/AIAgentTab'), { ssr: false });
const VHVTab           = dynamic(() => import('./components/VHVTab'), { ssr: false });
const LineMonitorTab   = dynamic(() => import('./components/LineMonitorTab'), { ssr: false });
const CommandCenterTab = dynamic(() => import('./components/CommandCenterTab'), { ssr: false });
const PainPointTab     = dynamic(() => import('./components/PainPointTab'), { ssr: false });
const ArchitectureTab  = dynamic(() => import('./components/ArchitectureTab'), { ssr: false });
const RoadmapTab       = dynamic(() => import('./components/RoadmapTab'), { ssr: false });

const TABS = [
  { id: 'landing',      label: 'หน้าแรก' },
  { id: 'painpoint',    label: 'Why This Platform?' },
  { id: 'his',          label: 'HIS Gateway' },
  { id: 'kanban',       label: 'Auto-Referral Board' },
  { id: 'cm',           label: 'CM Workspace' },
  { id: 'ai',           label: 'AI Agent' },
  { id: 'vhv',          label: 'อสม. Field' },
  { id: 'line',         label: 'Line Monitor' },
  { id: 'admin',        label: 'Command Center' },
  { id: 'arch',         label: 'Architecture' },
  { id: 'roadmap',      label: 'Roadmap' },
];

export default function HomePage() {
  const [active, setActive] = useState('landing');
  const now = new Date().toLocaleDateString('th-TH', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#00B87C', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80, gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, flexShrink: 0 }}>
                <img src="/diaper-logo-real.png" alt="Diaper Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.8)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: '-0.2px' }}>LaPooPoo</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>ระบบประสานงานคุ้มครองสิทธิผ้าอ้อมผู้สูงอายุ</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, overflowX: 'auto', flexShrink: 1, scrollbarWidth: 'none' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActive(t.id)}
                  className="touch-active"
                  style={{
                    background: active === t.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                    border: 'none',
                    padding: '7px 12px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    color: active === t.id ? 'white' : 'rgba(255,255,255,0.8)',
                    fontWeight: active === t.id ? 700 : 500,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    transition: '0.2s',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div className="anim-fade-up">
          {active === 'landing'   && <LandingTab onEnter={setActive} />}
          {active === 'painpoint' && <PainPointTab />}
          {active === 'his'       && <HISGatewayTab />}
          {active === 'kanban'    && <ReferralKanban />}
          {active === 'cm'        && <CMWorkspaceTab />}
          {active === 'ai'        && <AIAgentTab />}
          {active === 'vhv'       && <VHVTab />}
          {active === 'line'      && <LineMonitorTab />}
          {active === 'admin'     && <CommandCenterTab />}
          {active === 'arch'      && <ArchitectureTab />}
          {active === 'roadmap'   && <RoadmapTab />}
        </div>
      </main>

      <footer style={{ background: '#0F172A', padding: '24px 24px', textAlign: 'center', borderTop: '1px solid #1E293B' }}>
        <p style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>
          <strong style={{ color: 'white' }}>LaPooPoo ระบบประสานงานคุ้มครองสิทธิผ้าอ้อมผู้สูงอายุ</strong> — กองทุนหลักประกันสุขภาพแห่งชาติ
        </p>
        <p style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>
          © 2026 National Health Security Office. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
