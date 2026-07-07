"use client";

import { useEffect, useState } from "react";
import { BrandLogo, OrnamentDivider } from "@/components/BrandLogo";
import {
  decodeOrderPayload,
  isEncodedOrderToken,
  payloadToOrder,
} from "@/lib/order-payload";
import { formatPrice, t } from "@/lib/i18n";
import { LanguageSwitcherLight } from "./LanguageSwitcher";
import { useLang } from "./LangProvider";
import type { Order } from "@/lib/types";

export function WaiterOrderView({ orderId }: { orderId: string }) {
  const { lang } = useLang();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [stateless, setStateless] = useState(false);

  useEffect(() => {
    const encoded = decodeOrderPayload(orderId);
    if (encoded) {
      setOrder(payloadToOrder(orderId, encoded));
      setStateless(true);
      setLoading(false);
      return;
    }

    if (isEncodedOrderToken(orderId)) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: Order) => {
        setOrder(data);
        setDone(data.status === "completed");
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  const markDone = async () => {
    if (stateless) {
      setDone(true);
      return;
    }
    const res = await fetch(`/api/orders/${orderId}`, { method: "PATCH" });
    if (res.ok) setDone(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
        <p className="font-display text-5xl text-primary/15">✦</p>
        <p className="mt-4 text-primary-muted">{t(lang, "orderNotFound")}</p>
      </div>
    );
  }

  const time = new Date(order.updatedAt).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen pattern-subtle">
      <header className="pattern-bg px-4 py-5 shadow-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gold-light/70 uppercase">
              {t(lang, "waiterOrder")}
            </p>
            <h1 className="font-display text-3xl font-bold text-white">
              {order.table
                ? `${t(lang, "table")} ${order.table}`
                : t(lang, "newOrder")}
            </h1>
          </div>
          <LanguageSwitcherLight />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5">
        <div className="mb-5 flex items-center justify-between text-xs font-medium tracking-wide text-primary-muted uppercase">
          <span>#{order.id}</span>
          <span>{time}</span>
        </div>

        {done && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5 text-center text-sm font-semibold text-green-700">
            ✓ {t(lang, "orderAccepted")}
          </div>
        )}

        <div className="space-y-2.5">
          {order.items.map((item) => (
            <div
              key={item.dishId}
              className="card flex items-center justify-between rounded-2xl p-4"
            >
              <div className="min-w-0 flex-1 pr-3">
                <p className="font-semibold text-primary">{item.name[lang]}</p>
                <p className="mt-0.5 text-xs text-primary-muted">
                  {item.weightOrVolume}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-primary">
                  ×{item.quantity}
                </p>
                <p className="text-sm font-bold text-accent">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-primary shadow-lg shadow-primary/20">
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="font-medium tracking-wide text-gold-light/80 uppercase">
              {t(lang, "total")}
            </span>
            <span className="font-display text-3xl font-bold text-gold-light">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {!done && (
          <button
            onClick={markDone}
            className="btn-primary mt-5 w-full rounded-2xl py-4 font-bold tracking-wide text-white uppercase"
          >
            {t(lang, "acceptOrder")}
          </button>
        )}

        <OrnamentDivider className="mt-8" />
        <div className="mt-4 flex justify-center">
          <BrandLogo size="sm" />
        </div>
      </main>
    </div>
  );
}
