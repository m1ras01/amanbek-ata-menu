"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/admin", label: "Меню" },
  { href: "/admin/qr", label: "QR-код" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authenticated))
      .catch(() => setAuthed(false));
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    router.push("/admin");
  };

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    if (pathname !== "/admin") {
      router.replace("/admin");
      return null;
    }
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-primary/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-primary">
              Amanbek Ata
            </Link>
            <nav className="flex gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-primary/60 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={logout}
            className="text-sm text-primary/60 hover:text-primary"
          >
            Выйти
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
