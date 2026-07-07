"use client";

import { t } from "@/lib/i18n";
import { useLang } from "./LangProvider";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  const { lang } = useLang();

  return (
    <div className="px-4 pb-2 pt-3">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
          ⌕
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t(lang, "search")}
          className="card w-full rounded-2xl py-3 pr-4 pl-10 text-sm text-primary placeholder:text-primary/35 outline-none transition-all focus:ring-2 focus:ring-gold/30"
        />
      </div>
    </div>
  );
}
