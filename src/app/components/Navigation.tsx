"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Activity, Clock } from "lucide-react";

const NAV_ITEMS = [
  { id: "chat", name: "CHAT", path: "/", icon: MessageSquare },
  { id: "live", name: "LIVE", path: "/live", icon: Activity },
  { id: "history", name: "HISTORY", path: "/history", icon: Clock },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* PC Sidebar (COMMAND WINDOW) */}
      <nav className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-full py-6 px-4">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold tracking-wider text-primary">
            PYHGOSHIFT<br/>
            <span className="text-white text-sm">COMMAND CENTER (명령)</span><br/>
            <span className="text-xs text-gray-400 font-normal">v2.1.0 (2026.06.14 12:53)</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
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
      <nav className="md:hidden flex items-center justify-around bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 h-[70px] fixed bottom-0 left-0 right-0 z-40 pb-safe">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.path} className="flex-1 h-full">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center h-full gap-1.5 ${
                    isActive ? "text-primary" : "text-zinc-500"
                  }`}
                >
                  <Icon size={22} className={isActive ? "text-primary" : "text-zinc-400"} />
                  <span className={`text-[11px] font-bold tracking-wide ${isActive ? "text-primary" : "text-zinc-500"}`}>{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
      </nav>
    </>
  );
}