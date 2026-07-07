"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice, t } from "@/lib/i18n";
import type { Dish } from "@/lib/types";
import { useCart } from "./CartProvider";
import { DishTagBadge } from "./DishTags";
import { useLang } from "./LangProvider";

interface Props {
  dish: Dish;
  onClose: () => void;
}

export function DishModal({ dish, onClose }: Props) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem(dish, qty);
    onClose();
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-primary/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="animate-slide-up max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] w-full bg-cream-dark">
          <Image
            src={dish.imageUrl}
            alt={dish.name[lang]}
            fill
            className="object-cover"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
          <button
            onClick={onClose}
            className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-sm text-white"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="font-display text-3xl font-semibold text-white drop-shadow-lg">
              {dish.name[lang]}
            </h2>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {dish.tags.map((tag) => (
              <DishTagBadge key={tag} tag={tag} label={t(lang, tag)} />
            ))}
            {!dish.isAvailable && (
              <span className="rounded-full border border-primary/10 bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-primary-muted">
                {t(lang, "notAvailable")}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-primary-muted">
            {dish.description[lang]}
          </p>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
            <span className="font-display text-3xl font-bold text-accent">
              {formatPrice(dish.price)}
            </span>
            <span className="rounded-full bg-paper px-3 py-1 text-sm text-primary-muted">
              {dish.weightOrVolume}
            </span>
          </div>

          {dish.isAvailable && (
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-2xl border border-primary/10 bg-cream p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper text-lg text-primary transition-colors hover:bg-cream-dark"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper text-lg text-primary transition-colors hover:bg-cream-dark"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="btn-primary flex-1 rounded-2xl py-3.5 text-sm font-bold tracking-wide text-white uppercase"
              >
                {t(lang, "addToCart")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
