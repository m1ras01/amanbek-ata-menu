"use client";

import { useEffect, useState } from "react";
import { OrnamentDivider } from "@/components/BrandLogo";
import { buildOrderPayload } from "@/lib/order-payload";
import { formatPrice, t } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { useCart } from "./CartProvider";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartSheet({ open, onClose }: Props) {
  const { lang } = useLang();
  const {
    items,
    table,
    totalCount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (!open || items.length === 0) {
      setQrDataUrl(null);
      setQrError(false);
      return;
    }

    let cancelled = false;
    setSyncing(true);
    setQrError(false);

    const payload = buildOrderPayload(items, table, totalPrice);

    fetch("/api/order-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload }),
    })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) throw new Error("QR fetch failed");
        const { dataUrl } = await res.json();
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, items, table, totalPrice]);

  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-primary/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-slide-up flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-3xl bg-paper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-primary">
              {t(lang, "cart")}
            </h2>
            {table && (
              <p className="mt-0.5 text-xs font-medium tracking-wide text-gold uppercase">
                {t(lang, "table")} {table}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-cream text-primary transition-colors hover:bg-cream-dark"
          >
            ✕
          </button>
        </div>

        <OrnamentDivider className="px-5" />

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-4xl text-primary/15">✦</p>
              <p className="mt-3 text-primary-muted">{t(lang, "cartEmpty")}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((line) => (
                <div
                  key={line.dish.id}
                  className="card flex items-center gap-3 rounded-2xl p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-primary">
                      {line.dish.name[lang]}
                    </p>
                    <p className="text-sm font-bold text-accent">
                      {formatPrice(line.dish.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-primary/10 bg-cream p-1">
                    <button
                      onClick={() =>
                        updateQuantity(line.dish.id, line.quantity - 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper text-primary"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(line.dish.id, line.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-gold-light"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(line.dish.id)}
                    className="px-1 text-primary/25 transition-colors hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-primary/5 px-5 py-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-primary-muted">
                {totalCount} {t(lang, "items")}
              </span>
              <span className="font-display text-2xl font-bold text-accent">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-cream p-5 text-center">
              <p className="font-display text-lg font-semibold text-primary">
                {t(lang, "showQrToWaiter")}
              </p>
              <p className="mt-1 text-xs text-primary-muted">
                {t(lang, "waiterWillSee")}
              </p>

              <div className="mt-4 flex justify-center">
                <div className="rounded-2xl bg-paper p-3 shadow-inner ring-1 ring-gold/20">
                  {syncing ? (
                    <div className="flex h-[260px] w-[260px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
                    </div>
                  ) : qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="Order QR"
                      className="h-[260px] w-[260px] rounded-xl"
                    />
                  ) : qrError ? (
                    <div className="flex h-[260px] w-[260px] flex-col items-center justify-center gap-2 px-4 text-center">
                      <p className="text-sm font-medium text-primary">
                        {t(lang, "qrError")}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setQrError(false);
                          setSyncing(true);
                          const payload = buildOrderPayload(
                            items,
                            table,
                            totalPrice
                          );
                          fetch("/api/order-qr", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ payload }),
                          })
                            .then(async (res) => {
                              if (!res.ok) throw new Error();
                              const { dataUrl } = await res.json();
                              setQrDataUrl(dataUrl);
                              setQrError(false);
                            })
                            .catch(() => setQrError(true))
                            .finally(() => setSyncing(false));
                        }}
                        className="text-xs font-semibold text-accent underline"
                      >
                        {t(lang, "retry")}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              onClick={clearCart}
              className="mt-4 w-full py-2 text-xs font-medium tracking-wide text-primary/35 uppercase transition-colors hover:text-red-500"
            >
              {t(lang, "clearCart")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
