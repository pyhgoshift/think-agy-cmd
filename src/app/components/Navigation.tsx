"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Activity, Clock, BarChart2, Target, FileText, Grid, Globe } from "lucide-react";

const NAV_ITEMS = [
  { id: "chat", name: "CHAT", path: "/", icon: MessageSquare },
  { id: "live", name: "LIVE", path: "/live", icon: Activity },
  { id: "history", name: "HISTORY", path: "/history", icon: Clock },
  { id: "trading", name: "TRADING AGENT", path: "/trading", icon: BarChart2 },
  { id: "pitch", name: "BUSINESS PITCH", path: "/competition", icon: Target },
  { id: "domain", name: "DOMAIN", path: "/domain", icon: Globe },
  { id: "report", name: "REPORT", path: "/report", icon: FileText },
  { id: "graph", name: "GRAPH", path: "/graph", icon: Grid },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* PC Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-full py-6 px-4">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold tracking-wider text-primary">PYHGOSHIFT<br/><span className="text-white text-sm">THINK AGY RESULT VIEW</span></h1>
        </div>
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.path}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-primary" : ""} />
                  <span className="font-medium text-sm">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden flex items-center justify-around bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 h-16 fixed bottom-0 w-full z-50 px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.path} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center h-full gap-1 ${
                  isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon size={22} className={isActive ? "drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]" : ""} />
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
