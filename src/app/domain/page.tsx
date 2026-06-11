import { Globe } from "lucide-react";

export default function DomainPage() {
  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-white tracking-wide">DOMAIN MANAGEMENT</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden relative">
        <iframe 
          src="https://dash.domain.digitalplat.org/" 
          className="w-full h-full border-none bg-zinc-950"
          title="DigitalPlat FreeDomain Dashboard"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
