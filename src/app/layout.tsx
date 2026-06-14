import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import AuthWrapper from "./components/AuthWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyhgoShift CMD",
  description: "Unified AI Agent Command Center",
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
        <AuthWrapper>
          <Navigation />
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 relative pb-[70px] md:pb-0">
            {children}
          </main>
        </AuthWrapper>
      </body>
    </html>
  );
}
