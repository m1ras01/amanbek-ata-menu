import type { DishTag } from "@/lib/types";

export const TAG_CLASS: Record<DishTag, string> = {
  spicy: "tag-spicy",
  vegetarian: "tag-vegetarian",
  hit: "tag-hit",
  new: "tag-new",
};

export function DishTagBadge({
  tag,
  label,
}: {
  tag: DishTag;
  label: string;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${TAG_CLASS[tag]}`}
    >
      {label}
    </span>
  );
}
