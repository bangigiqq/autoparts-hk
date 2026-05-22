import type { Metadata } from "next";
import "./globals.css";
import { ensureSeeded } from "@/lib/init";

export const metadata: Metadata = {
  title: "欣榮汽配專門店 | 汽車機油・電裝套件",
  description: "汽車機油、電池、車速連動門鎖套件 — 香港屯門門市自取・轉數快付款",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureSeeded();

  return (
    <html lang="zh-Hant">
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
