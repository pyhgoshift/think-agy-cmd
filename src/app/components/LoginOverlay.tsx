"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginOverlayProps {
  onLoginSuccess: () => void;
}

export default function LoginOverlay({ onLoginSuccess }: LoginOverlayProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // Default password: admin (since no DB auth is specified)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = password.toLowerCase();
    if (pw === "admin" || pw === "pyhgo") {
      setIsLocked(false);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xs p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700/50">
                <Lock className="text-primary" size={32} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-widest">
              PYHGOSHIFT<br/>
              <span className="text-sm text-primary tracking-normal">ThinkPad AGY Remoter</span>
            </h1>
            <p className="text-zinc-400 text-center text-xs mb-8">Enter command code to access</p>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full bg-zinc-800/50 border ${error ? 'border-red-500' : 'border-zinc-700'} rounded-xl px-4 py-3 text-center text-white font-mono tracking-[0.2em] focus:outline-none focus:border-primary transition-colors`}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  password.length > 0 ? 'bg-primary text-white hover:bg-primary/90' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
                disabled={password.length === 0}
              >
                ACCESS <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
