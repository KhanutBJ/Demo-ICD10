import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synape x Right — ระบบ AI คุ้มครองสิทธิ์ผู้สูงอายุ",
  description: "ระบบ AI อัจฉริยะสำหรับโรงพยาบาลไทย ลดคอขวดการ coding ICD-10 และคุ้มครองสิทธิ์ผู้สูงอายุ",
  keywords: ["ICD-10", "AI", "โรงพยาบาล", "ผู้สูงอายุ", "บัตรทอง", "สาธารณสุขไทย"],
  openGraph: {
    title: "Synape x Right",
    description: "AI-powered medical coding & elderly rights protection",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
