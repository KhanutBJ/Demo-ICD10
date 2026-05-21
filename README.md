# 🏥 Synape x Right — PWL POC Demo

> **Proactive Welfare Link (PWL)**: Transforming passive ICD-10 codes into an active social welfare ecosystem. "สิทธิ์ต้องวิ่งไปหาผู้ป่วย ไม่ใช่รอให้ผู้ป่วยมาถาม"

---

## ✨ Features & Architecture

**Core Workflow (Live Shared State):**
`🏥 CodingTab → (React Context) → 🛡️ WelfareTab, 📱 VHVTab, 📊 Dashboard`

| Tab | Feature | Description |
|-----|---------|-------------|
| 🏥 **บันทึก ICD-10** | **AI Coding** | Voice/Text entry → AI suggests ICD-10 codes → Save triggers PWL |
| 🔗 **PWL Pipeline** | **Data Flow** | Animated 4-stage visualization: HIS → Tokenizer → DGA → Delivery |
| 🛡️ **สิทธิ์ผู้ป่วย** | **State Machine** | Live welfare state per patient, TTL countdowns, and ADL tracking |
| 📱 **แดชบอร์ด อสม.** | **Last-Mile** | Real-time task alerts for VHV (อสม.), ADL update dispatching |
| 📊 **ภาพรวมระบบ** | **Analytics** | Live impact metrics based on unlocked welfare records |
| 💬 **สิทธิ์ AI** | **Rights Bot** | AI chatbot for Universal Healthcare (บัตรทอง 30 บาท) FAQs |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript + JSX
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **State Management**: React Context API + `useReducer`
- **AI / LLM**: [Groq](https://groq.com/) — `qwen/qwen3-32b` for ICD coding & rights Q&A
- **Speech-to-Text**: Groq Whisper `whisper-large-v3`

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd smartelder
npm install
```

### 2. Set up environment variables

Create a `.env.local` file inside `smartelder/`:

```env
NEXT_PUBLIC_GROQ_ASR_KEY=your_groq_asr_key_here
NEXT_PUBLIC_GROQ_LLM_KEY=your_groq_llm_key_here
```

Get your API keys at [console.groq.com](https://console.groq.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Import this repo into [Vercel](https://vercel.com)
2. Set **Root Directory** to `smartelder`
3. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_GROQ_ASR_KEY`
   - `NEXT_PUBLIC_GROQ_LLM_KEY`
4. Deploy 🚀

---

## 📁 Project Structure

```
smartelder/
├── app/
│   ├── components/
│   │   ├── CodingTab.jsx     # ICD-10 AI coding (voice + LLM)
│   │   ├── PipelineTab.jsx   # Animated data flow visualization
│   │   ├── WelfareTab.jsx    # Live patient state machine
│   │   ├── VHVTab.jsx        # Village Health Volunteer dashboard
│   │   ├── DashboardTab.jsx  # Live impact metrics
│   │   └── RightsTab.jsx     # Rights AI chatbot
│   ├── context/
│   │   └── WelfareContext.jsx # Global shared state for PWL flow
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main app shell + tab routing
├── public/
├── package.json
└── vercel.json
```

---

## 📞 Healthcare Hotline

**สปสช.** (NHSO) — โทร **1330** · 24 ชั่วโมง · ฟรีทั่วประเทศ
