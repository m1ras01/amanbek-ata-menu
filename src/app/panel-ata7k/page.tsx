"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { AdminPanel } from "@/components/AdminPanel";

export default function PanelPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setAuthed(true);
      router.refresh();
    } else {
      setError("Неверный логин или пароль");
    }
  };

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <form
          onSubmit={login}
          className="card w-full max-w-sm rounded-2xl p-6"
        >
          <BrandLogo size="sm" />
          <p className="mt-3 text-sm text-primary-muted">Панель управления</p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Логин"
            autoComplete="username"
            className="mt-4 w-full rounded-xl border border-primary/20 bg-paper px-4 py-3.5 text-base text-primary outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            autoComplete="current-password"
            className="mt-3 w-full rounded-xl border border-primary/20 bg-paper px-4 py-3.5 text-base text-primary outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="btn-primary mt-4 w-full min-h-[48px] rounded-xl py-3 text-base font-semibold text-white"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return <AdminPanel />;
}
