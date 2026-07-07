"use client";

import { t } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { useLang } from "./LangProvider";

interface Props {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryNav({ categories, activeId, onSelect }: Props) {
  const { lang } = useLang();

  const pillClass = (active: boolean) =>
    active
      ? "bg-primary text-gold-light shadow-md shadow-primary/20 border-primary"
      : "bg-paper text-primary-muted border-primary/10 hover:border-gold/40 hover:text-primary";

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-4">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${pillClass(activeId === null)}`}
      >
        {t(lang, "all")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${pillClass(activeId === cat.id)}`}
        >
          {cat.name[lang]}
        </button>
      ))}
    </div>
  );
}
