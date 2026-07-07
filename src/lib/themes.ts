export type ThemeId = "traditional" | "modern" | "night";

export const THEMES: ThemeId[] = ["traditional", "modern", "night"];

export const THEME_META: Record<
  ThemeId,
  { label: { ru: string; kz: string; uz: string }; emoji: string; preview: string }
> = {
  traditional: {
    label: { ru: "Традиция", kz: "Дәстүр", uz: "An'ana" },
    emoji: "🏛",
    preview: "#630e14",
  },
  modern: {
    label: { ru: "Современный", kz: "Заманауи", uz: "Zamonaviy" },
    emoji: "✨",
    preview: "#1b4332",
  },
  night: {
    label: { ru: "Премиум", kz: "Премиум", uz: "Premium" },
    emoji: "🌙",
    preview: "#0a0a0a",
  },
};
