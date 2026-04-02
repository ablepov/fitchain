import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { logEnvironmentStatus } from "@/lib/env-check";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

logEnvironmentStatus();

export const metadata: Metadata = {
  title: "Fitchain - РўСЂРµРЅРёСЂРѕРІРєРё",
  description: "РџСЂРёР»РѕР¶РµРЅРёРµ РґР»СЏ РґРѕРјР°С€РЅРёС… РјРёРєСЂРѕ-С‚СЂРµРЅРёСЂРѕРІРѕРє",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
