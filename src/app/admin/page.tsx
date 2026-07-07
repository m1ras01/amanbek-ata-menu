"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
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
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      router.refresh();
    } else {
      setError("Неверный пароль");
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
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
        >
          <h1 className="text-xl font-bold text-primary">Amanbek Ata</h1>
          <p className="mt-1 text-sm text-primary/60">Панель управления</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="mt-4 w-full rounded-xl border border-primary/20 px-4 py-2.5 text-primary outline-none focus:border-primary/40"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return <AdminPanel />;
}
