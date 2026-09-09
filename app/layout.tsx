import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CloudFace AI – Cloud-Based Smart Face Recognition Attendance System",
  description:
    "A next-generation college cloud computing project providing contactless, AI-powered face verification attendance management powered by Next.js, PostgreSQL, and Vercel.",
  keywords: [
    "CloudFace AI",
    "Face Recognition Attendance",
    "Cloud Computing Project",
    "Next.js",
    "Supabase",
    "PostgreSQL",
    "Prisma ORM",
    "Biometric Attendance",
  ],
  authors: [{ name: "CloudFace AI Team" }],
  openGraph: {
    title: "CloudFace AI – Smart Face Recognition Attendance",
    description:
      "Automated student attendance verification using AI face recognition and cloud architecture.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}
