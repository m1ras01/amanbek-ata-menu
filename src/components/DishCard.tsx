"use client";

import Image from "next/image";
import { formatPrice, t } from "@/lib/i18n";
import type { Dish } from "@/lib/types";
import { useCart } from "./CartProvider";
import { DishTagBadge } from "./DishTags";
import { useLang } from "./LangProvider";

interface Props {
  dish: Dish;
  onClick: () => void;
}

export function DishCard({ dish, onClick }: Props) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const unavailable = !dish.isAvailable;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!unavailable) addItem(dish);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`card card-hover group relative w-full cursor-pointer overflow-hidden rounded-2xl text-left active:scale-[0.98] ${
        unavailable ? "opacity-55" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
        <Image
          src={dish.imageUrl}
          alt={dish.name[lang]}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        {unavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/30 backdrop-blur-[2px]">
            <span className="rounded-full bg-paper/95 px-3 py-1 text-[10px] font-bold tracking-wide text-primary uppercase">
              {t(lang, "notAvailable")}
            </span>
          </div>
        )}
        {dish.tags.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {dish.tags.map((tag) => (
              <DishTagBadge key={tag} tag={tag} label={t(lang, tag)} />
            ))}
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="font-display text-sm font-semibold leading-tight text-white drop-shadow-md">
            {dish.name[lang]}
          </p>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-[11px] leading-relaxed text-primary-muted">
          {dish.description[lang]}
        </p>
        <div className="mt-2.5 flex items-end justify-between">
          <span className="text-base font-bold text-accent">
            {formatPrice(dish.price)}
          </span>
          <span className="text-[10px] text-primary/40">
            {dish.weightOrVolume}
          </span>
        </div>
      </div>
      {!unavailable && (
        <button
          onClick={handleQuickAdd}
          className="btn-primary absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-white shadow-lg"
        >
          +
        </button>
      )}
    </div>
  );
}
