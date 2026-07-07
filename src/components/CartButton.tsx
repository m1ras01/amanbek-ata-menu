"use client";

import { formatPrice, t } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { useCart } from "./CartProvider";

interface Props {
  onClick: () => void;
}

export function CartButton({ onClick }: Props) {
  const { lang } = useLang();
  const { totalCount, totalPrice } = useCart();

  if (totalCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="animate-pulse-soft btn-primary fixed bottom-5 left-4 right-4 z-40 mx-auto flex max-w-lg items-center justify-between rounded-2xl px-5 py-4 text-white"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold ring-1 ring-white/30">
          {totalCount}
        </span>
        <span className="font-semibold tracking-wide">{t(lang, "cart")}</span>
      </div>
      <span className="font-display text-xl font-bold">
        {formatPrice(totalPrice)}
      </span>
    </button>
  );
}
