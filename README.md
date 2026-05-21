# 🏥 Synape x Right — Demo ICD-10

> AI-powered ICD-10 coding assistant and elderly rights protection system for Thai hospitals.

---

## ✨ Features

| Tab | Description |
|-----|-------------|
| 🏥 **บันทึกการรักษา** (ICD-10 AI) | Voice-to-text clinical note entry + AI-suggested ICD-10 codes via Groq LLM |
| 👥 **คิวอัจฉริยะ** (Smart Queue) | Intelligent patient queue management |
| 💬 **สิทธิ์ของฉัน** (Rights Bot) | AI chatbot explaining บัตรทอง 30 บาท (Universal Healthcare) rights to elderly patients |
| 📊 **Dashboard** | Analytics and reporting overview |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript + JSX
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
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
│   │   ├── QueueTab.jsx      # Smart queue management
│   │   ├── RightsTab.jsx     # Rights AI chatbot
│   │   └── DashboardTab.jsx  # Analytics dashboard
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main app shell + tab navigation
├── public/
├── package.json
└── vercel.json
```

---

## 📞 Healthcare Hotline

**สปสช.** (NHSO) — โทร **1330** · 24 ชั่วโมง · ฟรีทั่วประเทศ
