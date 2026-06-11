"use client";

import { LineChart } from "lucide-react";
import { useEffect, useState } from "react";

export default function TradingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <LineChart className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-white tracking-wide">TRADING AGENT</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden relative">
        {mounted && (
          <iframe 
            src="/proxy/trading?cb=1781177819" 
            className="absolute inset-0 w-full h-full border-none"
            title="Trading Dashboard"
          />
        )}
      </div>
    </div>
  );
}
