"use client";

import { LANG_SHORT } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useLang } from "./LangProvider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const langs: Lang[] = ["ru", "kz", "uz"];

  return (
    <div className="glass flex rounded-full p-1">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider transition-all ${
            lang === l
              ? "bg-gold text-primary shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          {LANG_SHORT[l]}
        </button>
      ))}
    </div>
  );
}

export function LanguageSwitcherLight() {
  const { lang, setLang } = useLang();
  const langs: Lang[] = ["ru", "kz", "uz"];

  return (
    <div className="flex rounded-full border border-primary/10 bg-cream p-1">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider transition-all ${
            lang === l
              ? "bg-primary text-gold-light shadow-sm"
              : "text-primary-muted hover:text-primary"
          }`}
        >
          {LANG_SHORT[l]}
        </button>
      ))}
    </div>
  );
}
