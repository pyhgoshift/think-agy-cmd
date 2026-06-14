"use client";

import { useState } from "react";
import LoginOverlay from "./LoginOverlay";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {!isAuthenticated && <LoginOverlay onLoginSuccess={() => setIsAuthenticated(true)} />}
      <div className={`transition-opacity duration-500 w-full h-full flex flex-col md:flex-row ${isAuthenticated ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>
        {children}
      </div>
    </>
  );
}
