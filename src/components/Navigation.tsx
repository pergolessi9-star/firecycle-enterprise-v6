"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CurrentUser = { name: string | null; email: string; role: string };

export default function Navigation() {
  const [expanded, setExpanded] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) setUser((await response.json()).user);
    });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const modules = [
    { label: "Dashboard", href: "/" },
    { label: "Command Center", href: "/command-center" },
    { label: "FIREWATCH", href: "/firewatch" },
    { label: "Satellite", href: "/satellite" },
    { label: "Digital Twin", href: "/digital-twin" },
    { label: "Evidence", href: "/evidence" },
    { label: "Risk Engine", href: "/risk" },
    { label: "Interventions", href: "/interventions" },
    { label: "Operations", href: "/operations" },
    { label: "Economics", href: "/economics" },
    { label: "Impact", href: "/impact" },
    { label: "MRV", href: "/mrv" },
    { label: "Maintenance", href: "/maintenance" },
    { label: "Bioeconomy", href: "/bioeconomy" },
    { label: "REDBIOMASA", href: "/redbiomasa" },
    { label: "Grazing", href: "/grazing" },
    { label: "Circular Value", href: "/circular-value" },
    { label: "Territorial Bioeconomy", href: "/territorial-command" },
    { label: "AI Copilot", href: "/ai-copilot" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <nav className={`${expanded ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col border-r border-slate-700`}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {expanded && <h1 className="font-bold text-lg">FIRECYCLE AI</h1>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-slate-800 rounded"
        >
          {expanded ? "←" : "→"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="block px-3 py-2 rounded hover:bg-slate-800 text-sm transition whitespace-nowrap"
            title={module.label}
          >
            {expanded ? module.label : module.label.charAt(0)}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700 text-xs text-slate-400 space-y-2">
        {expanded && user && <p><span className="block text-slate-200">{user.name ?? user.email}</span>{user.role}</p>}
        <button onClick={logout} className="w-full rounded bg-slate-800 px-3 py-2 text-left text-slate-200 hover:bg-slate-700" title="Cerrar sesión">
          {expanded ? "Cerrar sesión" : "×"}
        </button>
        {expanded && <p>© 2026 FIRECYCLE AI</p>}
      </div>
    </nav>
  );
}
