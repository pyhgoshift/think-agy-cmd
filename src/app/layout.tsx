import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyhgoShift Nexus",
  description: "Unified AI Agent Framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white h-screen flex flex-col md:flex-row overflow-hidden`}
      >
        <Navigation />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
