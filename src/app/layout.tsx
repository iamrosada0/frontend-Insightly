import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Header  from "@/components/Header"; // 👈 importa o Header global

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insightly",
  description: "Plataforma de links e feedbacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* 👇 Header global aparece em todas as rotas */}
        <Header />

        {/* 👇 O conteúdo das páginas */}
        <main className="pt-6">{children}</main>
      </body>
    </html>
  );
}
