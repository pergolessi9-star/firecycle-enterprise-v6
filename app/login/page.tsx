"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    setPending(false);
    if (!response.ok) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next?.startsWith("/") ? next : "/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-semibold tracking-widest text-emerald-700">FIRECYCLE AI</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Acceso seguro</h1>
        <p className="mt-2 text-sm text-slate-600">Plataforma territorial de prevención, restauración y bioeconomía forestal.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Correo electrónico
            <input name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Contraseña
            <input name="password" type="password" autoComplete="current-password" minLength={8} required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3" />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={pending} className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {pending ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
