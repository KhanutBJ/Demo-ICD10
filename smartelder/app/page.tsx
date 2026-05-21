'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const CodingTab    = dynamic(() => import('./components/CodingTab'),    { ssr: false });
const QueueTab     = dynamic(() => import('./components/QueueTab'),     { ssr: false });
const RightsTab    = dynamic(() => import('./components/RightsTab'),    { ssr: false });
const DashboardTab = dynamic(() => import('./components/DashboardTab'), { ssr: false });

const TABS = [
  { id: 'coding',    emoji: '🏥', label: 'บันทึกการรักษา', sub: 'ICD-10 AI' },
  { id: 'queue',     emoji: '👥', label: 'คิวอัจฉริยะ',   sub: 'Smart Queue' },
  { id: 'rights',    emoji: '💬', label: 'สิทธิ์ของฉัน',  sub: 'Rights Bot' },
  { id: 'dashboard', emoji: '📊', label: 'Dashboard',       sub: 'Analytics' },
];

export default function HomePage() {
  const [active, setActive] = useState('coding');
  const now = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F0F7F4' }}>

      {/* ── HEADER ───────────────────────────────────────── */}
      <header className="app-header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 10px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}>🏥</div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
                  Synape x Right
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 500 }}>
                  ระบบ AI คุ้มครองสิทธิ์ผู้สูงอายุ
                </div>
              </div>
            </div>

            {/* Right info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right', display: 'none' }} className="sm-show">
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{now}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
                  <span className="glow-status" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600 }}>ระบบออนไลน์</span>
                </div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'background 0.2s',
              }}>👨‍⚕️</div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`tab-btn${active === t.id ? ' active' : ''}`}>
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                <span style={{ fontSize: 12 }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          {TABS.filter(t => t.id === active).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="anim-fade-in">
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg,#0F6E56,#17A97E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, boxShadow: '0 4px 12px rgba(15,110,86,0.25)',
              }}>{t.emoji}</div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F6E56', lineHeight: 1.2 }}>{t.label}</h1>
                <p style={{ fontSize: 12, color: '#6B9A87', fontWeight: 500 }}>{t.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="anim-fade-up">
          {active === 'coding'    && <CodingTab />}
          {active === 'queue'     && <QueueTab />}
          {active === 'rights'    && <RightsTab />}
          {active === 'dashboard' && <DashboardTab />}
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #D1E8DF',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        padding: '18px 20px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#6B9A87', fontSize: 13 }}>
          <strong style={{ color: '#0F6E56' }}>Synape x Right</strong>
          {' '}— พัฒนาเพื่อคุ้มครองสิทธิ์ผู้สูงอายุไทย ลดคอขวด ICD-10 coding
        </p>
        <p style={{ color: '#9BBCAF', fontSize: 11, marginTop: 4 }}>
          Groq Whisper large-v3 + Qwen3-32b • สปสช. โทร 1330
        </p>
      </footer>
    </div>
  );
}
