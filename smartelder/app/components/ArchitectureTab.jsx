"use client";
import React, { useState } from "react";

/* ── Design-system colour aliases ─────────────────────────── */
const C = {
  blue: "#1671FF",
  green: "#00B87C",
  purple: "#6E4FF6",
  orange: "#FF9500",
  red: "#FF3B30",
  line: "#00C300",
  ink: "#1C1C1E",
  ink3: "#636366",
  ink4: "#AEAEB2",
  border: "#E2E8F0",
  surf: "#FFFFFF",
  surf2: "#F8FAFC",
  surf3: "#F1F5F9",
};

/* ── Shared node card ─────────────────────────────────────── */
function Node({ icon, title, sub, accent, style = {}, pulse = false }) {
  return (
    <div
      style={{
        position: "absolute",
        background: C.surf,
        border: `1.5px solid ${accent}`,
        borderRadius: 10,
        padding: "10px 12px",
        textAlign: "center",
        minWidth: 120,
        boxShadow: pulse
          ? `0 0 0 3px ${accent}22, var(--shadow-sm)`
          : "var(--shadow-sm)",
        zIndex: 4,
        ...style,
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 12, color: C.ink }}>{title}</div>
      {sub && (
        <div
          style={{ fontSize: 10, color: C.ink3, marginTop: 2, lineHeight: 1.5 }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── Scrolling log lines (CSS-animated) ─────────────────── */
const LOGS = [
  ["22:14:03", "HIS", "ICD-10 I63.9 → discharge_day_match() → HN-2026-A3F1"],
  [
    "22:14:05",
    "LINE",
    'อสม. "ประเมิน ADL ตาหวัง" → orchestrate → ADL=4 Eligible ✓',
  ],
  [
    "22:14:08",
    "WEB",
    "CM toggle task ✓ → Sheets write → milestone → LINE push อสม.",
  ],
  ["22:14:10", "LINE", 'CM "ขอดูภาพรวม" → show_dashboard → Flex card sent ✓'],
  ["22:14:12", "WEB", "Alert ack → Sheets update → PUSH VHV notified ✓"],
  ["22:14:15", "HIS", "ICD-10 I61.0 → discharge_day_match() → HN-2026-B7D2"],
  [
    "22:14:18",
    "LINE",
    'Nurse "เช็คสิทธิ์ HN-2024-007" → rights check → Eligible ✓',
  ],
];

function LogPanel() {
  return (
    <div
      style={{
        background: "#0D1117",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "'SF Mono','Fira Code',monospace",
        fontSize: 11,
        height: 90,
        overflow: "hidden",
        position: "relative",
        border: `1px solid #21262D`,
      }}
    >
      <style>{`
        @keyframes scrollLog { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        .log-scroll { animation: scrollLog 10s linear infinite; }
        @keyframes blink2 { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .live-dot { display:inline-block;width:6px;height:6px;border-radius:50%;background:#00B87C;animation:blink2 1.5s ease-in-out infinite;margin-right:5px;vertical-align:middle; }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span className="live-dot" />
        <span style={{ color: "#3FB950", fontSize: 10, fontWeight: 600 }}>
          LIVE
        </span>
      </div>
      <div className="log-scroll">
        {[...LOGS, ...LOGS].map((l, i) => (
          <div key={i} style={{ lineHeight: "1.9", whiteSpace: "nowrap" }}>
            <span style={{ color: "#6E7681", marginRight: 8 }}>{l[0]}</span>
            <span
              style={{
                color:
                  l[1] === "HIS"
                    ? "#79C0FF"
                    : l[1] === "LINE"
                      ? "#3FB950"
                      : "#FFA657",
                marginRight: 8,
                fontWeight: 700,
              }}
            >
              [{l[1]}]
            </span>
            <span style={{ color: "#CDD9E5" }}>{l[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Arrow label ─────────────────────────────────────────── */
function ArrowLabel({ children, x, y }) {
  return (
    <text
      x={x}
      y={y}
      fill={C.ink4}
      fontSize="9"
      fontFamily="'SF Mono',monospace"
    >
      {children}
    </text>
  );
}

/* ── Animated SVG path packet ─────────────────────────────── */
function Packet({ pathId, color, dur, begin }) {
  return (
    <circle r="5" fill={color} opacity="0.9" filter="url(#glow)">
      <animateMotion
        dur={`${dur}s`}
        repeatCount="indefinite"
        begin={`${begin}s`}
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

/* ── Marker defs ─────────────────────────────────────────── */
function Defs({ ids }) {
  return (
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {ids.map(([id, color]) => (
        <marker
          key={id}
          id={id}
          markerWidth="7"
          markerHeight="5"
          refX="7"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0 0, 7 2.5, 0 5" fill={color} opacity="0.8" />
        </marker>
      ))}
    </defs>
  );
}

/* ════════════════════════════════════════════════
   FLOW 0 — Hospital Discharge Day Match
════════════════════════════════════════════════ */
function Flow0() {
  return (
    <div style={{ position: "relative", height: 520 }}>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <Defs
          ids={[
            ["m0a", C.blue],
            ["m0b", C.purple],
            ["m0c", C.green],
            ["m0d", C.orange],
          ]}
        />
        <path
          id="d0a"
          d="M 170,58 C 260,58 290,58 340,58"
          fill="none"
          stroke={C.blue}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m0a)"
        />
        <path
          id="d0b"
          d="M 490,58 C 570,58 590,110 590,155"
          fill="none"
          stroke={C.purple}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m0b)"
        />
        <path
          id="d0c"
          d="M 545,255 C 490,310 430,330 390,340"
          fill="none"
          stroke={C.green}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m0c)"
        />
        <path
          id="d0d"
          d="M 260,368 C 170,368 120,310 90,270"
          fill="none"
          stroke={C.orange}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m0d)"
        />
        <Packet pathId="d0a" color={C.blue} dur={2.2} begin={0} />
        <Packet pathId="d0b" color={C.purple} dur={1.8} begin={0.7} />
        <Packet pathId="d0c" color={C.green} dur={2} begin={1.6} />
        <Packet pathId="d0d" color={C.orange} dur={2.2} begin={2.5} />
        <ArrowLabel x={183} y={49}>
          POST /api/his/confirm-discharge
        </ArrowLabel>
        <ArrowLabel x={512} y={118}>
          discharge_day_match()
        </ArrowLabel>
        <ArrowLabel x={420} y={295}>
          Patients + Tasks rows
        </ArrowLabel>
        <ArrowLabel x={85} y={328}>
          send_line_push(CM)
        </ArrowLabel>
      </svg>

      <Node
        icon="🏥"
        title="Hospital HIS"
        sub={"HOSxP / JHCIS\nICD-10 I63.9 Stroke"}
        accent={C.blue}
        pulse
        style={{ left: 20, top: 30, width: 150 }}
      />
      <Node
        icon="⚡"
        title="FastAPI · Cloud Run"
        sub={"webhook → route\nasia-southeast3"}
        accent={C.purple}
        style={{ left: 340, top: 30, width: 155 }}
      />
      <Node
        icon="✨"
        title="Gemini 2.5 Flash"
        sub={"generate HN\nseed 4 tasks"}
        accent={C.purple}
        style={{ left: 530, top: 155, width: 145 }}
      />
      <Node
        icon="📊"
        title="Google Sheets"
        sub={"Patients · Tasks\nauto-created rows"}
        accent={C.green}
        style={{ left: 260, top: 322, width: 145 }}
      />
      <Node
        icon="📱"
        title="LINE Push → CM"
        sub={"find_line_id_by_name()\nFlex card dispatched"}
        accent={C.orange}
        style={{ left: 20, top: 215, width: 150 }}
      />

      {/* Step callout */}
      <div
        className="card"
        style={{
          position: "absolute",
          right: 0,
          top: 200,
          width: 185,
          padding: "14px 16px",
          fontSize: 12,
          color: C.ink3,
          lineHeight: 1.8,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: C.ink,
            marginBottom: 8,
          }}
        >
          Discharge-Day Match
        </div>
        {[
          ["1", "Auto-generate HN ใหม่"],
          ["2", "seed 4 Tasks ใน Sheet"],
          ["3", "หา LINE ID ของ CM"],
          ["4", "Push Flex card แจ้ง CM"],
          ["5", "ล็อคคิวส่งผ้าอ้อมงวดแรก"],
        ].map(([n, t]) => (
          <div
            key={n}
            style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
          >
            <span
              className="chip chip-green"
              style={{
                fontSize: 9,
                padding: "1px 5px",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {n}
            </span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 195 }}>
        <LogPanel />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   FLOW 1 — LINE Chat → ADL → Care Plan
════════════════════════════════════════════════ */
function Flow1() {
  return (
    <div style={{ position: "relative", height: 520 }}>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <Defs
          ids={[
            ["m1a", C.line],
            ["m1b", C.purple],
            ["m1c", C.green],
            ["m1d", C.line],
          ]}
        />
        <path
          id="d1a"
          d="M 160,60 C 270,60 290,60 340,60"
          fill="none"
          stroke={C.line}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m1a)"
        />
        <path
          id="d1b"
          d="M 496,60 C 580,60 610,120 610,160"
          fill="none"
          stroke={C.purple}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m1b)"
        />
        <path
          id="d1c"
          d="M 565,260 C 510,310 440,340 390,355"
          fill="none"
          stroke={C.green}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m1c)"
        />
        <path
          id="d1d"
          d="M 255,380 C 145,380 80,315 68,255"
          fill="none"
          stroke={C.line}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m1d)"
        />
        <Packet pathId="d1a" color={C.line} dur={2} begin={0} />
        <Packet pathId="d1b" color={C.purple} dur={2.2} begin={0.8} />
        <Packet pathId="d1c" color={C.green} dur={2} begin={1.8} />
        <Packet pathId="d1d" color={C.line} dur={2.2} begin={2.8} />
        <ArrowLabel x={175} y={50}>
          webhook text event
        </ArrowLabel>
        <ArrowLabel x={512} y={135}>
          agent_orchestrate()
        </ArrowLabel>
        <ArrowLabel x={438} y={308}>
          ADL + CarePlan write
        </ArrowLabel>
        <ArrowLabel x={72} y={340}>
          reply Flex Card
        </ArrowLabel>
      </svg>

      <Node
        icon="📱"
        title="LINE OA"
        sub={"อสม. พิมพ์\n'ประเมิน ADL HN-001'"}
        accent={C.line}
        pulse
        style={{ left: 10, top: 32, width: 150 }}
      />
      <Node
        icon="⚡"
        title="FastAPI Webhook"
        sub={"HMAC verify\nlog_chat() → memory"}
        accent={C.purple}
        style={{ left: 340, top: 32, width: 158 }}
      />
      <Node
        icon="✨"
        title="Gemini Orchestrator"
        sub={"intent → JSON\n{action:'check_eligibility'}"}
        accent={C.purple}
        style={{ left: 565, top: 160, width: 150 }}
      />
      <Node
        icon="📊"
        title="Google Sheets"
        sub={"ADL Score · Care Plan\nChat_History log"}
        accent={C.green}
        style={{ left: 255, top: 338, width: 148 }}
      />
      <Node
        icon="📋"
        title="Flex Card Reply"
        sub={"ADL Result Card\nCare Plan + สิทธิ์"}
        accent={C.green}
        style={{ left: 10, top: 210, width: 148 }}
      />

      <div
        className="card"
        style={{
          position: "absolute",
          right: 0,
          top: 190,
          width: 185,
          padding: "14px 16px",
          fontSize: 12,
          color: C.ink3,
          lineHeight: 1.8,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: C.ink,
            marginBottom: 8,
          }}
        >
          LINE Chat Flow
        </div>
        {[
          ["1", "อสม. ส่งอธิบายอาการ"],
          ["2", "Gemini classify intent"],
          ["3", "ADL scoring ≤6 → Eligible"],
          ["4", "เขียน Sheet + Chat log"],
          ["5", "ส่ง Flex Card กลับทาง LINE"],
        ].map(([n, t]) => (
          <div
            key={n}
            style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
          >
            <span
              className="chip chip-blue"
              style={{
                fontSize: 9,
                padding: "1px 5px",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {n}
            </span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 195 }}>
        <LogPanel />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   FLOW 2 — Web Dashboard → LINE Push
════════════════════════════════════════════════ */
function Flow2() {
  return (
    <div style={{ position: "relative", height: 520 }}>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <Defs
          ids={[
            ["m2a", C.orange],
            ["m2b", C.blue],
            ["m2c", C.green],
            ["m2d", C.line],
          ]}
        />
        <path
          id="d2a"
          d="M 165,60 C 265,60 300,60 345,60"
          fill="none"
          stroke={C.orange}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m2a)"
        />
        <path
          id="d2b"
          d="M 500,60 C 580,60 615,125 615,190"
          fill="none"
          stroke={C.blue}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m2b)"
        />
        <path
          id="d2c"
          d="M 575,295 C 510,350 450,370 390,375"
          fill="none"
          stroke={C.green}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m2c)"
        />
        <path
          id="d2d"
          d="M 255,390 C 140,390 75,320 68,258"
          fill="none"
          stroke={C.line}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          opacity="0.4"
          markerEnd="url(#m2d)"
        />
        <Packet pathId="d2a" color={C.orange} dur={2} begin={0} />
        <Packet pathId="d2b" color={C.blue} dur={2.2} begin={0.7} />
        <Packet pathId="d2c" color={C.green} dur={2} begin={1.8} />
        <Packet pathId="d2d" color={C.line} dur={2.2} begin={2.7} />
        <ArrowLabel x={178} y={50}>
          POST /api/tasks/toggle
        </ArrowLabel>
        <ArrowLabel x={512} y={148}>
          update Sheet row
        </ArrowLabel>
        <ArrowLabel x={420} y={335}>
          write milestone
        </ArrowLabel>
        <ArrowLabel x={68} y={335}>
          push อสม. LINE
        </ArrowLabel>
      </svg>

      <Node
        icon="💻"
        title="Web Dashboard"
        sub={"CM กด ✓ Task\nCM Workspace Tab"}
        accent={C.orange}
        pulse
        style={{ left: 10, top: 32, width: 155 }}
      />
      <Node
        icon="⚡"
        title="FastAPI"
        sub={"toggle task\ncheck milestone"}
        accent={C.blue}
        style={{ left: 345, top: 32, width: 155 }}
      />
      <Node
        icon="📊"
        title="Google Sheets"
        sub={"Tasks tab\nchecked=True"}
        accent={C.blue}
        style={{ left: 575, top: 190, width: 148 }}
      />
      <Node
        icon="🏁"
        title="Milestone Check"
        sub={"all 4 tasks done?\n→ trigger push"}
        accent={C.green}
        style={{ left: 255, top: 350, width: 148 }}
      />
      <Node
        icon="📱"
        title="LINE Push อสม."
        sub={"send_line_push()\n'เคส HN สิ้นสุดแล้วค่ะ'"}
        accent={C.line}
        style={{ left: 10, top: 220, width: 152 }}
      />

      <div
        className="card"
        style={{
          position: "absolute",
          right: 0,
          top: 190,
          width: 185,
          padding: "14px 16px",
          fontSize: 12,
          color: C.ink3,
          lineHeight: 1.8,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: C.ink,
            marginBottom: 8,
          }}
        >
          Two-Way Bridge
        </div>
        <p style={{ marginBottom: 8 }}>
          ทุก action บน Dashboard มีผล real-time บน LINE ทันที
        </p>
        {["Task toggle", "Alert ack", "Discharge confirm"].map((t) => (
          <div
            key={t}
            style={{ display: "flex", gap: 6, alignItems: "center" }}
          >
            <span style={{ color: C.green }}>→</span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 195 }}>
        <LogPanel />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   FLOW 3 — Full System Loop
════════════════════════════════════════════════ */
function Flow3() {
  return (
    <div style={{ position: "relative", height: 520 }}>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <Defs
          ids={[
            ["m3a", C.blue],
            ["m3b", C.line],
            ["m3c", C.orange],
            ["m3d", C.purple],
            ["m3e", C.green],
            ["m3f", C.line],
            ["m3g", C.orange],
          ]}
        />
        {/* inputs → FastAPI */}
        <path
          id="d3a"
          d="M 135,48  C 240,48 265,55 315,55"
          fill="none"
          stroke={C.blue}
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3a)"
        />
        <path
          id="d3b"
          d="M 135,118 C 230,118 265,80 315,65"
          fill="none"
          stroke={C.line}
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3b)"
        />
        <path
          id="d3c"
          d="M 135,190 C 230,190 265,95 315,72"
          fill="none"
          stroke={C.orange}
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3c)"
        />
        {/* FastAPI → Gemini */}
        <path
          id="d3d"
          d="M 480,60  C 560,60 580,120 580,160"
          fill="none"
          stroke={C.purple}
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3d)"
        />
        {/* Gemini → Sheets */}
        <path
          id="d3e"
          d="M 535,255 C 490,300 435,330 385,340"
          fill="none"
          stroke={C.green}
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3e)"
        />
        {/* Sheets → LINE out / Web out */}
        <path
          id="d3f"
          d="M 245,360 C 125,360 70,300 65,240"
          fill="none"
          stroke={C.line}
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3f)"
        />
        <path
          id="d3g"
          d="M 245,375 C 170,430 90,420 65,370"
          fill="none"
          stroke={C.orange}
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.35"
          markerEnd="url(#m3g)"
        />

        <Packet pathId="d3a" color={C.blue} dur={1.8} begin={0} />
        <Packet pathId="d3b" color={C.line} dur={2} begin={0.4} />
        <Packet pathId="d3c" color={C.orange} dur={2.2} begin={0.8} />
        <Packet pathId="d3d" color={C.purple} dur={1.8} begin={1.3} />
        <Packet pathId="d3e" color={C.green} dur={2} begin={2} />
        <Packet pathId="d3f" color={C.line} dur={2} begin={2.7} />
        <Packet pathId="d3g" color={C.orange} dur={2} begin={3} />
      </svg>

      {/* Left: 3 inputs */}
      <Node
        icon="🏥"
        title="Hospital HIS"
        sub="ICD-10 Discharge"
        accent={C.blue}
        style={{ left: 0, top: 22, width: 135 }}
      />
      <Node
        icon="📱"
        title="LINE OA"
        sub="Chat / Audio / OCR"
        accent={C.line}
        style={{ left: 0, top: 92, width: 135 }}
      />
      <Node
        icon="💻"
        title="Web Dashboard"
        sub="CM / Nurse / Admin"
        accent={C.orange}
        style={{ left: 0, top: 162, width: 135 }}
        pulse
      />

      {/* Centre-top: FastAPI */}
      <Node
        icon="⚡"
        title="FastAPI · Cloud Run"
        sub={"Webhook + REST\nasia-southeast3"}
        accent={C.purple}
        pulse
        style={{ left: 315, top: 28, width: 168 }}
      />

      {/* Right: Gemini */}
      <Node
        icon="✨"
        title="Gemini AI Engine"
        sub={"2.5-flash · ADL · TTS\nOrchestrator JSON"}
        accent={C.purple}
        style={{ left: 545, top: 160, width: 158 }}
      />

      {/* Centre-bottom: Sheets */}
      <Node
        icon="📊"
        title="Google Sheets DB"
        sub={"Users · Patients\nAlerts · Tasks · Chat"}
        accent={C.green}
        style={{ left: 245, top: 318, width: 158 }}
      />

      {/* Left-bottom: outputs */}
      <Node
        icon="📱"
        title="LINE Push Out"
        sub="CM · VHV notify"
        accent={C.line}
        style={{ left: 0, top: 245, width: 135 }}
      />
      <Node
        icon="🔄"
        title="Web Live Poll"
        sub="5s refresh KPIs"
        accent={C.orange}
        style={{ left: 0, top: 335, width: 135 }}
      />

      {/* Legend */}
      <div
        className="card"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 175,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            color: C.ink,
            marginBottom: 10,
          }}
        >
          Data packets
        </div>
        {[
          [C.blue, "ICD-10 / HIS"],
          [C.line, "LINE message"],
          [C.orange, "Web action"],
          [C.purple, "AI inference"],
          [C.green, "DB write/read"],
        ].map(([col, lab]) => (
          <div
            key={lab}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              fontSize: 12,
              color: C.ink3,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: col,
                flexShrink: 0,
                boxShadow: `0 0 6px ${col}`,
              }}
            />
            {lab}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 185 }}>
        <LogPanel />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
const FLOWS = [
  { label: "① Hospital Discharge", component: Flow0 },
  { label: "② LINE Chat → ADL", component: Flow1 },
  { label: "③ Web → LINE Push", component: Flow2 },
  { label: "④ Full System Loop", component: Flow3 },
];

export default function ArchitectureTab() {
  const [active, setActive] = useState(0);
  const FlowComp = FLOWS[active].component;

  return (
    <div className="anim-fade-up">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
          System Architecture & Data Flow
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 4 }}>
          LaPooPoo · LTC Diaper Auto-Referral Agent — animated journey through 4
          layers
        </p>
      </div>

      {/* Journey tabs */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}
      >
        {FLOWS.map((f, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={active === i ? "chip chip-green" : "chip chip-gray"}
            style={{
              cursor: "pointer",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              padding: "6px 16px",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Animated flow canvas */}
      <div
        className="card"
        style={{ padding: 24, marginBottom: 20, overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
          }}
        >
          <style>{`@keyframes blink3{0%,100%{opacity:1}50%{opacity:0.2}} .ldot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);animation:blink3 1.5s ease-in-out infinite;}`}</style>
          <span className="ldot" />
          <span
            style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 600 }}
          >
            {active === 0 &&
              "Discharge-Day Match — Hospital → Community auto-referral"}
            {active === 1 &&
              "LINE Chat Journey — อสม. ส่งข้อความ → ADL scoring → Flex Card reply"}
            {active === 2 &&
              "Web → LINE Push — CM กด Task Done → notify อสม. บน LINE"}
            {active === 3 &&
              "Full System Loop — 3 inputs · Gemini AI · Google Sheets · 2 outputs"}
          </span>
        </div>
        <FlowComp />
      </div>

      {/* Layer overview + Role table */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Layer strip */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "var(--ink)",
              marginBottom: 14,
            }}
          >
            4-Layer Stack
          </div>
          {[
            {
              col: C.blue,
              label: "INPUT",
              items: [
                "Hospital HIS (HOSxP)",
                "LINE OA (text/audio/image)",
                "Web Dashboard (Next.js)",
              ],
            },
            {
              col: C.purple,
              label: "AI ORCHESTRATION",
              items: [
                "FastAPI · Cloud Run",
                "Gemini 2.5 Flash",
                "Agentic Orchestrator",
              ],
            },
            {
              col: C.green,
              label: "PERSISTENCE",
              items: ["Users · Patients", "Alerts · Tasks", "Chat_History"],
            },
            {
              col: C.orange,
              label: "OUTPUT",
              items: [
                "LINE Push (CM/VHV)",
                "Discharge-Day Match",
                "Kanban Live Board",
              ],
            },
          ].map((l) => (
            <div
              key={l.label}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 12,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 3,
                  borderRadius: 3,
                  background: l.col,
                  flexShrink: 0,
                  alignSelf: "stretch",
                  minHeight: 14,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: l.col,
                    letterSpacing: 0.5,
                    marginBottom: 2,
                  }}
                >
                  {l.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-3)",
                    lineHeight: 1.7,
                  }}
                >
                  {l.items.join(" · ")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Role table */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "var(--ink)",
              marginBottom: 14,
            }}
          >
            Role-Based Access
          </div>
          {[
            {
              role: "CM",
              col: C.purple,
              caps: "ดูคนไข้ทั้งหมด · Care Plan · ตรวจสอบ Task · Dashboard",
            },
            {
              role: "Nurse",
              col: C.blue,
              caps: "ตรวจสิทธิ์ · ดู Dashboard · Alert ack",
            },
            {
              role: "VHV (อสม.)",
              col: C.green,
              caps: "ประเมิน ADL · ยืนยัน Discharge · รับ Push",
            },
            {
              role: "Patient",
              col: C.orange,
              caps: "ดูสิทธิ์ตัวเอง · ถามนโยบาย · สแกนบัตร",
            },
            {
              role: "Guest",
              col: C.ink4,
              caps: "ถามนโยบายทั่วไป · เลือก Role ก่อนใช้งาน",
            },
          ].map((r) => (
            <div
              key={r.role}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  minWidth: 70,
                  fontSize: 11,
                  fontWeight: 700,
                  color: r.col,
                  background: `${r.col}12`,
                  border: `1px solid ${r.col}30`,
                  borderRadius: 6,
                  padding: "2px 8px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {r.role}
              </span>
              <span
                style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6 }}
              >
                {r.caps}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-way bridge callout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div
          className="card"
          style={{ padding: 16, borderLeft: `3px solid ${C.line}` }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 12,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            LINE → DB → Web (upstream)
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.7 }}>
            User texts LINE OA → FastAPI webhook → Gemini AI → action written to
            Sheets → Web polls & shows live data
          </div>
        </div>
        <div
          className="card"
          style={{ padding: 16, borderLeft: `3px solid ${C.blue}` }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 12,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            Web → DB → LINE (downstream)
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.7 }}>
            CM clicks ✓ / Alert ack on dashboard → backend writes Sheet →{" "}
            <code style={{ fontSize: 11 }}>send_line_push()</code> notifies
            CM/VHV on LINE
          </div>
        </div>
      </div>
    </div>
  );
}
