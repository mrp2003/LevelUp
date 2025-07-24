import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LevelUp - Fitness Tracker",
  description: "Transform your fitness journey with intelligent tracking and personalized insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900`}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pb-20">{children}</main>
        </div>
      </body>
    </html>
  );
}
