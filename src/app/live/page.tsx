"use client";

import { Video, AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function LivePage() {
  const [isLive, setIsLive] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const lastRectRef = useRef<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchScreenshot = async () => {
      try {
        const res = await fetch('/api/screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'always_allow' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.img) {
            setImgSrc(data.img);
            lastRectRef.current = data.rect;
          }
        }
      } catch (error) {
        console.error("Live fetch error", error);
      }
    };

    if (isLive) {
      fetchScreenshot();
      interval = setInterval(fetchScreenshot, 1500);
    }
    
    return () => clearInterval(interval);
  }, [isLive]);

  const handleImageClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!lastRectRef.current || !imgRef.current) return;
    
    const rect = imgRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;

    try {
      await fetch('/api/coord_click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key: 'always_allow', 
          rx, 
          ry, 
          rect: lastRectRef.current 
        })
      });
    } catch (error) {
      console.error("Click error", error);
    }
  };

  const handleEmergencyStop = async () => {
    if (!confirm('작업을 강제 중단하시겠습니까?')) return;
    
    try {
      await fetch('/api/emergency_stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'always_allow' })
      });
      alert("긴급 중단 신호가 전송되었습니다.");
    } catch (error) {
      console.error("Stop error", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Video className="text-primary" size={28} />
          <h1 className="text-2xl font-bold text-white tracking-wide">LIVE VIEW</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleEmergencyStop}
            className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/50"
          >
            <AlertTriangle size={18} />
            <span className="hidden sm:inline">EMERGENCY STOP</span>
          </button>
          
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
              isLive 
                ? 'bg-primary text-white shadow-primary/30' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {isLive ? 'LIVE ON' : 'LIVE OFF'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden relative flex items-center justify-center p-4">
        {!isLive ? (
          <div className="text-zinc-500 flex flex-col items-center gap-4">
            <Video size={48} className="opacity-20" />
            <p>Click LIVE ON to start screen sharing</p>
          </div>
        ) : imgSrc ? (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={imgRef}
            src={imgSrc} 
            alt="Live Screen" 
            onClick={handleImageClick}
            className="max-w-full max-h-full object-contain cursor-crosshair rounded-xl border border-zinc-700/50 shadow-2xl"
          />
        ) : (
          <div className="text-primary animate-pulse">Loading stream...</div>
        )}
      </div>
    </div>
  );
}
