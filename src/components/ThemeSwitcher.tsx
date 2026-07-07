"use client";

import { THEME_META, THEMES } from "@/lib/themes";
import { useLang } from "./LangProvider";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { lang } = useLang();
  const { theme, setTheme } = useTheme();

  return (
    <div className="px-4 pb-3">
      <div className="flex gap-2">
        {THEMES.map((id) => {
          const meta = THEME_META[id];
          const active = theme === id;
          return (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-2.5 transition-all ${
                active
                  ? "border-gold bg-paper shadow-md ring-2 ring-gold/30"
                  : "border-primary/10 bg-paper/60 hover:border-gold/40"
              }`}
            >
              <span
                className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                style={{ background: meta.preview }}
              />
              <span
                className={`text-[10px] font-semibold ${
                  active ? "text-primary" : "text-primary-muted"
                }`}
              >
                {meta.emoji} {meta.label[lang]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
