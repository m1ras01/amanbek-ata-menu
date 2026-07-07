"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ADMIN_BASE } from "@/lib/admin-config";

export default function AdminAccessPage() {
  const [qr, setQr] = useState<{ url: string; dataUrl: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin-qr")
      .then((r) => r.json())
      .then(setQr);
  }, []);

  const download = () => {
    window.open("/api/admin-qr?format=png", "_blank");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">QR для входа в панель</h1>
      <p className="mt-1 text-sm text-primary-muted">
        Отсканируйте — откроется страница входа. Логин и пароль знает только
        персонал.
      </p>

      <div className="card mt-6 rounded-2xl p-6">
        <div className="rounded-xl bg-cream px-4 py-3 text-sm text-primary-muted">
          <p>
            <span className="font-semibold text-primary">Адрес панели:</span>{" "}
            <code className="text-accent">{ADMIN_BASE}</code>
          </p>
          <p className="mt-1 text-xs">
            Старый адрес /admin больше не работает.
          </p>
        </div>

        {qr && (
          <div className="mt-6 flex flex-col items-center">
            <div className="rounded-2xl border-2 border-gold/30 bg-cream p-6 text-center">
              <div className="flex justify-center">
                <BrandLogo size="md" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr.dataUrl}
                alt="Admin QR"
                className="mx-auto mt-4 h-64 w-64 rounded-xl"
              />
              <p className="mt-4 text-sm font-semibold text-primary">
                Сканируйте для входа
              </p>
              <p className="mt-2 text-xs text-primary/40 break-all">{qr.url}</p>
            </div>

            <button
              onClick={download}
              className="btn-primary mt-6 rounded-xl px-6 py-2.5 font-semibold text-white"
            >
              Скачать PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
