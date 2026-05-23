'use client';
import React from 'react';

export default function ArchitectureTab() {
  return (
    <div className="anim-fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>System Architecture & Data Link</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>แผนผังบูรณาการข้อมูลและสถาปัตยกรรม AI ประมวลผลสิทธิ์</p>
      </div>

      <div className="card" style={{ padding: 40, background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, position: 'relative' }}>
        
        {/* Layer 1: Data Sources */}
        <div style={{ display: 'flex', gap: 120, width: '100%', justifyContent: 'center', zIndex: 2 }}>
          <div className="arch-node" style={{ ...nodeStyle, borderTop: '4px solid #4B8BFF' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏥</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Hospital HIS</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>ฐานข้อมูล HOSxP / JHCIS</div>
          </div>
          <div className="arch-node" style={{ ...nodeStyle, borderTop: '4px solid #00B87C' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🧑‍⚕️</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>อสม. (VHV App)</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>คัดกรอง ADL / เช็คชื่อ</div>
          </div>
        </div>

        {/* Animated Flow 1: Sources -> AI Agent */}
        <div style={{ height: 80, width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} pointerEvents="none">
             {/* Left line (HIS -> AI) */}
             <path id="pathHIS" d="M calc(50% - 170px) 0 Q calc(50% - 170px) 40, 50% 80" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
             <g>
               <animateMotion dur="3s" repeatCount="indefinite" path="M calc(50% - 170px) 0 Q calc(50% - 170px) 40, 50% 80" />
               <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#4B8BFF" />
               <text x="0" y="4" fill="white" fontSize="10" fontWeight="700" fontFamily="Prompt" textAnchor="middle">ICD-10</text>
             </g>
             
             {/* Right line (VHV -> AI) */}
             <path id="pathVHV" d="M calc(50% + 170px) 0 Q calc(50% + 170px) 40, 50% 80" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
             <g>
               <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M calc(50% + 170px) 0 Q calc(50% + 170px) 40, 50% 80" />
               <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#00B87C" />
               <text x="0" y="4" fill="white" fontSize="10" fontWeight="700" fontFamily="Prompt" textAnchor="middle">ADL Score</text>
             </g>
          </svg>
          <div style={{ ...arrowStyle, background: 'var(--surface)', padding: '4px 16px', borderRadius: 12, border: '1px solid var(--border)', zIndex: 3, alignSelf: 'center', boxShadow: 'var(--shadow-sm)' }}>Data Link Architecture (HL7 / API)</div>
        </div>

        {/* Layer 2: Core Processing */}
        <div style={{ display: 'flex', gap: 60, width: '100%', justifyContent: 'center', zIndex: 2 }}>
          <div className="arch-node anim-pulse" style={{ ...nodeStyle, width: 360, borderTop: '4px solid #6E4FF6', background: 'var(--purple-light)', animation: 'pulseBorder 2s ease-in-out infinite' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <span className="chip chip-purple">Groq LPU</span>
              <span className="chip chip-blue">Qwen 32b</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#5438CC' }}>AI Agent (RAG)</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
              ประมวลผลสิทธิ์ผ้าอ้อม วิเคราะห์ ADL & ICD-10 <br/>เทียบกับคู่มือ NHSO แบบ Real-time
            </div>
            <div style={{ position: 'absolute', right: -20, top: '40%', fontSize: 20 }}>⚙️</div>
          </div>
        </div>

        {/* Animated Flow 2: AI Agent -> Outputs */}
        <div style={{ height: 100, width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} pointerEvents="none">
             {/* Center line (AI -> Dashboard) */}
             <path d="M 50% 0 L 50% 100" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
             <g>
               <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s" path="M 50% 0 L 50% 100" />
               <rect x="-40" y="-12" width="80" height="24" rx="12" fill="#FF9500" />
               <text x="0" y="4" fill="white" fontSize="10" fontWeight="700" fontFamily="Prompt" textAnchor="middle">📊 Update UI</text>
             </g>

             {/* Left line (AI -> Line) */}
             <path d="M 50% 0 Q calc(50% - 250px) 50, calc(50% - 250px) 100" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
             <g>
               <animateMotion dur="2.5s" repeatCount="indefinite" begin="0s" path="M 50% 0 Q calc(50% - 250px) 50, calc(50% - 250px) 100" />
               <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#00C300" />
               <text x="0" y="4" fill="white" fontSize="10" fontWeight="700" fontFamily="Prompt" textAnchor="middle">🔔 Notify CM</text>
             </g>

             {/* Right line (AI -> Logistics) */}
             <path d="M 50% 0 Q calc(50% + 250px) 50, calc(50% + 250px) 100" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
             <g>
               <animateMotion dur="2.5s" repeatCount="indefinite" begin="1s" path="M 50% 0 Q calc(50% + 250px) 50, calc(50% + 250px) 100" />
               <rect x="-40" y="-12" width="80" height="24" rx="12" fill="#FF3B30" />
               <text x="0" y="4" fill="white" fontSize="10" fontWeight="700" fontFamily="Prompt" textAnchor="middle">📦 Dispatch</text>
             </g>
          </svg>
          <div style={{ ...arrowStyle, background: 'var(--surface)', padding: '4px 16px', borderRadius: 12, border: '1px solid var(--border)', zIndex: 3, alignSelf: 'center', boxShadow: 'var(--shadow-sm)' }}>Auto-Referral Execution</div>
        </div>

        {/* Layer 3: Output / Action */}
        <div style={{ display: 'flex', gap: 40, width: '100%', justifyContent: 'center', flexWrap: 'wrap', zIndex: 2 }}>
          <div className="arch-node" style={{ ...nodeStyle, borderTop: '4px solid #00C300' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📱</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Line OA & Board</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>แจ้งเตือน Care Manager ทันที</div>
          </div>
          <div className="arch-node" style={{ ...nodeStyle, borderTop: '4px solid #FF9500' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Central Dashboard</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>ติดตามสถานะ 4 ขั้นตอนแบบ Real-time</div>
          </div>
          <div className="arch-node" style={{ ...nodeStyle, borderTop: '4px solid #FF3B30' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🚚</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Logistics (ไปรษณีย์)</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>ส่งผ้าอ้อมถึงบ้าน (Tracking)</div>
          </div>
        </div>

      </div>
    </div>
  );
}

const nodeStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '24px 20px',
  textAlign: 'center',
  width: 220,
  boxShadow: 'var(--shadow-sm)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'default',
};

const arrowStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--ink-4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  letterSpacing: '0.5px'
};
