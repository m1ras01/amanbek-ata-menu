"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ADMIN_BASE, adminUrl } from "@/lib/admin-config";

const NAV = [
  { href: ADMIN_BASE, label: "Меню", icon: "📋" },
  { href: adminUrl("/qr"), label: "QR меню", icon: "📱" },
  { href: adminUrl("/access"), label: "QR входа", icon: "🔐" },
];

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authenticated))
      .catch(() => setAuthed(false));
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    router.push(ADMIN_BASE);
  };

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    if (pathname !== ADMIN_BASE) {
      router.replace(ADMIN_BASE);
      return null;
    }
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-paper shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <BrandLogo size="sm" />
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary md:hidden"
                aria-label="Меню"
              >
                ☰
              </button>
              <button
                onClick={logout}
                className="hidden min-h-[40px] rounded-xl px-3 text-sm text-primary-muted hover:text-primary md:block"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="mt-3 hidden gap-2 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-primary-muted hover:bg-cream hover:text-primary"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile nav dropdown */}
          {menuOpen && (
            <nav className="mt-3 space-y-1 md:hidden">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-cream"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex min-h-[48px] w-full items-center gap-2 rounded-xl px-4 text-sm text-red-500"
              >
                🚪 Выйти
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-5 sm:py-6">{children}</main>
    </div>
  );
}
