# Synape x Right — PWL POC Demo

> **Proactive Welfare Link (PWL)**: ICD-10 × Barthel ADL → Welfare Tier → สิทธิ์ถึงเตียงผู้ป่วยอัตโนมัติ
> "สิทธิ์ต้องวิ่งไปหาผู้ป่วย ไม่ใช่รอให้ผู้ป่วยมาถาม"

---

## System Architecture

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║  ZONE 1 — HOSPITAL PERIMETER                                                   ║
║                                                                                ║
║   ┌─────────────────┐  CDC trigger   ┌──────────────────────────────────────┐ ║
║   │  HosXP (MySQL)  │───────────────▶│  PWL Edge Module                     │ ║
║   │  ICD-10 + ADL   │                │                                      │ ║
║   └─────────────────┘                │   ┌──────────────────────────────┐   │ ║
║                                      │   │       Rule Engine            │   │ ║
║                                      │   │       ICD × ADL → Tier       │   │ ║
║                                      │   └───────────────┬──────────────┘   │ ║
║                                      │                   ▼                  │ ║
║                                      │   ┌───────────────────────┐  ┌─────┐ │ ║
║                                      │   │   Tokenizer (PDPA)    │─▶│Local│ │ ║
║                                      │   │   SHA-256 + KMS       │  │Queue│ │ ║
║                                      │   │   Strip PII/ICD       │  │SQLite│ │ ║
║                                      │   └───────────────────────┘  └─────┘ │ ║
║                                      └──────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════════════╝
                                              │
                                    mTLS · X.509 per hospital
                                              │
                                              ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║  ZONE 2 — GOVERNMENT CLOUD (DGA)                                               ║
║                                                                                ║
║                  ┌────────────────────────────────────────┐                   ║
║                  │           API Gateway (Kong)            │                   ║
║                  │   mTLS termination · rate-limit · HMAC  │                   ║
║                  └───────────────────┬────────────────────┘                   ║
║                                      │                                        ║
║                                      ▼                                        ║
║                  ┌────────────────────────────────────────┐                   ║
║                  │           Token Resolver                │                   ║
║                  │      Secure enclave · Token → CID       │                   ║
║                  └───────────────────┬────────────────────┘                   ║
║                                      │                                        ║
║                                      ▼                                        ║
║                  ┌────────────────────────────────────────┐                   ║
║                  │        State Machine Service            │                   ║
║                  │  Pending → Eligible → Active →          │                   ║
║                  │  Suspended → Renewed → Terminated       │                   ║
║                  └──────┬─────────────┬────────────┬───────┘                   ║
║                         │             │            │                          ║
║                         ▼             ▼            ▼                          ║
║            ┌────────────────┐ ┌──────────────┐ ┌─────────────────┐           ║
║            │   Ledger DB    │ │ Routing Engine│ │  Cross-Agency   │           ║
║            │  Append-only   │ │   Delivery    │ │  NHSO · MoI     │           ║
║            │    · audit     │ │   routing     │ │  Treasury       │           ║
║            └────────────────┘ └──────────────┘ │  LTC integration│           ║
║                                                 └─────────────────┘           ║
╚══════════════════════════════════════════════════════════════════════════════════╝
              │                       │                      │
              ▼                       ▼                      ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║  ZONE 3 — LOCAL DELIVERY                                                       ║
║                                                                                ║
║  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐ ║
║  │  Local Gov.          │  │    Care Manager       │  │  Rights Dashboard    │ ║
║  │  Dashboard           │  │                       │  │                      │ ║
║  │  Work orders         │  │  Tablet UI            │  │  Aggregate view only │ ║
║  │  audit trail         │  │  ADL + care plan      │  │  No PII              │ ║
║  │  No ICD codes        │  │  Pre-filled forms     │  │                      │ ║
║  └──────────┬───────────┘  └──────────────────────┘  └──────────────────────┘ ║
║             │ Exception only                                                   ║
║             ▼                                                                  ║
║  ┌──────────────────────┐                                                      ║
║  │     VHV Alert        │                                                      ║
║  │  Last-mile re-route  │                                                      ║
║  └──────────────────────┘                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════╝


╔══════════════════════════════════════════════════════════════════════════════════╗
║  PWL DEMO APP — Tab-to-Zone Mapping                                            ║
╚══════════════════════════════════════════════════════════════════════════════════╝

  🏥 CodingTab          →  Zone 1   Voice→Whisper→Qwen3→ICD+ADL→SAVE_ICD dispatch
  🔗 PipelineTab        →  Z1→Z2→Z3 Animated 4-stage demo (happy path + exception)
  🛡️ WelfareTab         →  Zone 2   6-state machine · ADL gauge · TTL · RAG chips
  🏘️ VHVTab             →  Zone 3   Work orders from exceptions · ADL log → sync
  📊 DashboardTab       →  Zone 3   กสม. Rights · Tier/State stats · RAG agencies
  💬 RightsTab          →  Zone 3   RAG chatbot (KB 11 entries) + Qwen3 + sources

                              ┌──────────────────────┐
                              │  WelfareContext       │   ← shared across all tabs
                              │  React useReducer     │
                              │  patients · alerts    │
                              │  suggestedAgencies    │
                              └──────────────────────┘


╔══════════════════════════════════════════════════════════════════════════════════╗
║  🤖  RAG Layer  (welfare-kb.js — 11 entries)                                   ║
╚══════════════════════════════════════════════════════════════════════════════════╝

  ICD + Tier ──▶ retrieveRelevant() ──▶ Top-K docs
                                              │
              ┌───────────────────────────────┤
              │                               │
              ▼                               ▼
     suggestAgencies()                 RightsTab chatbot
     → [สปสช., กปท.,                  inject context → Qwen3-32b
        LTC Fund, อปท.,               → answer + 📚 source badges
        กองทุนฟื้นฟูจังหวัด, …]
     → store per patient (WelfareContext)
     → chips in WelfareTab
     → aggregate card in DashboardTab


╔══════════════════════════════════════════════════════════════════════════════════╗
║  📋  ICD-10 → Welfare Tier → Benefits                                          ║
╚══════════════════════════════════════════════════════════════════════════════════╝

  ICD       Tier                   ADL    TTL    Benefits
  ────────  ─────────────────────  ─────  ─────  ────────────────────────────────
  I63       STROKE_DEPENDENT       ≤ 6    180d   ผ้าอ้อม · Caregiver · อุปกรณ์
  I69       STROKE_SEQUELAE        ≤ 8    180d   ผ้าอ้อม · Caregiver · Palliative
  I50       CARDIAC_DEPENDENT      ≤ 8    180d   ผ้าอ้อม · Caregiver · Palliative
  F01/F03   DEMENTIA_LONGTERM      ≤ 8    ∞ lock Care Plan (LTC) · อุปกรณ์ · ผ้าอ้อม
  S72       FRACTURE_TEMPORARY     ≤ 8    90d    อุปกรณ์ชั่วคราว · กายภาพบำบัด
  M17/E11   CHRONIC                —      —      ตรวจสุขภาพประจำปี · ยา


╔══════════════════════════════════════════════════════════════════════════════════╗
║  🔐  Privacy Zones                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════╝

  Zone 1 — Hospital Perimeter    Zone 2 — DGA Cloud        Zone 3 — อปท./กสม.
  ──────────────────────────     ──────────────────         ──────────────────────
  ICD-10 · PII · ADL             Tier Token only            Work Order only
  ► Never leaves perimeter        No diagnosis name          No ICD / no name
  SHA-256 + KMS at edge           Append-only ledger         ADL result only
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript + JSX |
| State | React Context + `useReducer` |
| AI / LLM | Groq `qwen/qwen3-32b` |
| Speech-to-Text | Groq Whisper `whisper-large-v3` |
| RAG | Client-side keyword scoring (welfare-kb.js · 11 entries) |
| Charts | Recharts |
| Deploy | Vercel |

---

## Getting Started

```bash
cd smartelder && npm install
```

`smartelder/.env.local`:

```env
NEXT_PUBLIC_GROQ_ASR_KEY=your_groq_asr_key
NEXT_PUBLIC_GROQ_LLM_KEY=your_groq_llm_key
```

```bash
npm run dev   # http://localhost:3000
```

---

## Project Structure

```
smartelder/
├── app/
│   ├── components/
│   │   ├── CodingTab.jsx      # Voice+LLM → ICD-10+ADL → SAVE_ICD
│   │   ├── PipelineTab.jsx    # Animated 4-stage PWL pipeline demo
│   │   ├── WelfareTab.jsx     # 6-state machine · RAG agency chips
│   │   ├── VHVTab.jsx         # อปท. work orders · ADL logging
│   │   ├── DashboardTab.jsx   # กสม. analytics · RAG agency panel
│   │   └── RightsTab.jsx      # RAG chatbot (welfare-kb + Qwen3)
│   ├── context/
│   │   └── WelfareContext.jsx # patients · alerts · suggestedAgencies
│   ├── data/
│   │   └── welfare-kb.js      # 11-entry KB · retrieveRelevant() · suggestAgencies()
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── vercel.json
```

---

**สปสช.** โทร **1330** · 24 ชั่วโมง · ฟรีทั่วประเทศ
