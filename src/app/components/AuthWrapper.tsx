"use client";

import { useState } from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAuthenticated) {
    return <div className="w-full h-full flex flex-col md:flex-row">{children}</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = password.toLowerCase();
    if (pw === "admin" || pw === "pyhgo") {
      setIsAuthenticated(true);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="w-full max-w-xs p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative">
        <h1 className="text-xl font-bold text-center text-white mb-2">
          PYHGOSHIFT<br/>
          <span className="text-xs text-teal-400">ThinkPad AGY Remoter</span>
        </h1>
        {error && <p className="text-red-500 text-xs text-center mb-4">Invalid Password</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-center text-white focus:outline-none focus:border-teal-500 font-mono tracking-[0.2em]"
            autoFocus
          />
          <button type="submit" className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-500 transition-colors">
            ACCESS
          </button>
        </form>
      </div>
    </div>
  );
}
