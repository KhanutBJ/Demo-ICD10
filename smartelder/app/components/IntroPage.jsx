'use client';
import { useState, useEffect } from 'react';

const STATS = [
  { value: '< 7 วัน',  label: 'Time-to-Benefit',   sub: 'จากเดิม 45–90 วัน',          icon: '⚡', delay: '0.45s' },
  { value: '94.2%',    label: 'ความแม่นยำ AI',      sub: 'ICD-10 coding vs. Expert',   icon: '🎯', delay: '0.62s' },
  { value: '0 ราย',    label: 'ผู้ป่วยตกหล่น',       sub: 'Zero-gap สิทธิ์สาธารณสุข',  icon: '🛡️', delay: '0.79s' },
];

const FLOW = [
  { icon: '🏥', label: 'ICD-10', sub: '+ ADL',     color: '#0F6E56' },
  { icon: '🔒', label: 'Privacy', sub: 'Shield',   color: '#6366F1' },
  { icon: '☁️', label: 'DGA',    sub: 'Cloud',     color: '#0EA5E9' },
  { icon: '💳', label: 'สิทธิ์', sub: 'ถึงเตียง',  color: '#17A97E' },
];

const TECH = ['Groq Whisper large-v3', 'Qwen3-32b', 'Next.js 16', 'RAG · PDPA', 'สปสช. 1330'];

export default function IntroPage({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 580);
  };

  const anim = (delay = '0s', duration = '0.7s') => ({
    animation: ready ? `floatIn ${duration} cubic-bezier(.22,.68,0,1.2) ${delay} both` : 'none',
    opacity: ready ? undefined : 0,
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 25% 30%, #0d5240 0%, #0a3d2e 45%, #061f18 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', overflow: 'hidden',
      animation: exiting ? 'introFadeOut 0.58s cubic-bezier(.4,0,1,1) forwards' : 'none',
    }}>

      {/* ── Decorative orbs ── */}
      {[
        { w:420, h:420, top:'-12%', left:'-10%', op:0.07, dur:'18s' },
        { w:300, h:300, top:'55%',  left:'72%',  op:0.06, dur:'22s', delay:'4s' },
        { w:200, h:200, top:'15%',  left:'78%',  op:0.05, dur:'15s', delay:'2s' },
        { w:160, h:160, top:'72%',  left:'8%',   op:0.06, dur:'20s', delay:'6s' },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'absolute', width: o.w, height: o.h, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23,169,126,1) 0%, transparent 70%)',
          opacity: o.op, top: o.top, left: o.left, pointerEvents: 'none',
          animation: `orbDrift ${o.dur} ease-in-out ${o.delay || '0s'} infinite`,
        }} />
      ))}

      {/* ── Grid lines ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(23,169,126,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,169,126,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* ── Logo ── */}
      <div style={{ ...anim('0.1s', '0.6s'), marginBottom: 20 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #0F6E56, #17A97E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38,
          animation: 'logoPulse 3s ease-in-out infinite',
          position: 'relative',
        }}>
          🏥
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 26,
            border: '2px solid rgba(23,169,126,0.3)',
          }} />
        </div>
      </div>

      {/* ── Title ── */}
      <div style={{ ...anim('0.2s', '0.65s'), textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{
          color: 'white', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)',
          letterSpacing: '-0.5px', lineHeight: 1.1,
          animation: 'textGlow 4s ease-in-out infinite',
        }}>
          Synape <span style={{ color: '#17A97E' }}>×</span> Right
        </h1>
      </div>

      {/* ── Tagline ── */}
      <div style={{ ...anim('0.3s', '0.65s'), textAlign: 'center', marginBottom: 6 }}>
        <p style={{
          fontSize: 'clamp(14px, 2.5vw, 18px)', fontWeight: 700,
          background: 'linear-gradient(90deg, #17A97E, #4ADE80, #17A97E)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ระบบ AI คุ้มครองสิทธิ์ผู้สูงอายุ — Proactive Welfare Link
        </p>
      </div>

      <div style={{ ...anim('0.38s', '0.6s'), textAlign: 'center', marginBottom: 36 }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(12px,2vw,14px)', fontStyle: 'italic' }}>
          "สิทธิ์ต้องวิ่งไปหาผู้ป่วย ไม่ใช่รอให้ผู้ป่วยมาถาม"
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
        marginBottom: 36, width: '100%', maxWidth: 680,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            ...anim(s.delay, '0.7s'),
            flex: '1 1 160px', maxWidth: 200,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(23,169,126,0.25)',
            borderRadius: 18, padding: '18px 16px', textAlign: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(23,169,126,0.12)'; e.currentTarget.style.borderColor = 'rgba(23,169,126,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(23,169,126,0.25)'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{
              fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: '#17A97E', lineHeight: 1,
            }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginTop: 5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Pipeline flow ── */}
      <div style={{ ...anim('0.95s', '0.7s'), width: '100%', maxWidth: 560, marginBottom: 40 }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
          PWL Pipeline
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          {FLOW.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 6px',
                background: `${f.color}15`,
                borderRadius: 14,
                border: `1px solid ${f.color}30`,
              }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: f.color }}>{f.label}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{f.sub}</span>
              </div>
              {i < FLOW.length - 1 && (
                <div style={{ position: 'relative', width: 32, height: 4, flexShrink: 0, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,169,126,0.2)', borderRadius: 2 }} />
                  <div style={{
                    position: 'absolute', top: 0, height: '100%', width: 16,
                    background: 'linear-gradient(90deg, transparent, #17A97E, transparent)',
                    borderRadius: 2,
                    animation: `flowDotH 1.8s ease-in-out ${i * 0.45}s infinite`,
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ ...anim('1.1s', '0.7s'), marginBottom: 28 }}>
        <button
          onClick={handleEnter}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #0F6E56 0%, #17A97E 50%, #0F6E56 100%)',
            backgroundSize: '200% auto',
            color: 'white', fontWeight: 800,
            fontSize: 'clamp(14px, 2.5vw, 17px)',
            borderRadius: 16, border: 'none', cursor: 'pointer',
            animation: 'ctaGlow 2.5s ease-in-out infinite',
            transition: 'transform 0.2s, background-position 0.4s',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)'; e.currentTarget.style.backgroundPosition = 'right center'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.backgroundPosition = 'left center'; }}
        >
          <span>เริ่มใช้งานระบบ</span>
          <span style={{ fontSize: 20 }}>→</span>
        </button>
      </div>

      {/* ── Tech pills ── */}
      <div style={{ ...anim('1.25s', '0.6s'), display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {TECH.map((t, i) => (
          <span key={i} style={{
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600,
          }}>{t}</span>
        ))}
      </div>

    </div>
  );
}
