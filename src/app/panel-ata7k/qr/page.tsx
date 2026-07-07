"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export default function MenuQrPage() {
  const [qr, setQr] = useState<{ url: string; dataUrl: string } | null>(null);
  const [table, setTable] = useState("");

  useEffect(() => {
    const params = table ? `?table=${table}` : "";
    fetch(`/api/qr${params}`)
      .then((r) => r.json())
      .then(setQr);
  }, [table]);

  const download = () => {
    const params = table ? `?format=png&table=${table}` : "?format=png";
    window.open(`/api/qr${params}`, "_blank");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">QR-код для столов</h1>
      <p className="mt-1 text-sm text-primary-muted">
        Распечатайте и разместите на столах. QR не меняется при обновлении меню.
      </p>

      <div className="card mt-6 rounded-2xl p-6">
        <label className="text-sm font-medium text-primary">
          Номер стола (необязательно)
        </label>
        <input
          value={table}
          onChange={(e) => setTable(e.target.value)}
          placeholder="Например: 5"
          className="mt-1 w-full max-w-xs rounded-lg border border-primary/10 px-3 py-2 text-sm"
        />

        {qr && (
          <div className="mt-6 flex flex-col items-center">
            <div className="rounded-2xl border-2 border-gold/30 bg-cream p-6 text-center">
              <div className="flex justify-center">
                <BrandLogo size="md" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr.dataUrl}
                alt="QR Code"
                className="mx-auto mt-4 h-64 w-64 rounded-xl"
              />
              <p className="mt-4 text-sm font-semibold text-primary">
                Сканируйте меню
              </p>
              <p className="text-xs text-primary-muted">Мәзірді сканерлеңіз</p>
              <p className="text-xs text-primary-muted">Menyuni skanerlang</p>
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
