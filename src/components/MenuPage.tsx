"use client";

import { useMemo, useState } from "react";
import { BrandLogo, OrnamentDivider } from "@/components/BrandLogo";
import { CartButton } from "@/components/CartButton";
import { CartSheet } from "@/components/CartSheet";
import { CategoryNav } from "@/components/CategoryNav";
import { DishCard } from "@/components/DishCard";
import { DishModal } from "@/components/DishModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLang } from "@/components/LangProvider";
import { SearchBar } from "@/components/SearchBar";
import { t } from "@/lib/i18n";
import type { Category, Dish, RestaurantSettings } from "@/lib/types";

interface Props {
  settings: RestaurantSettings;
  categories: Category[];
  dishes: Dish[];
}

export function MenuPage({ settings, categories, dishes }: Props) {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = dishes;
    if (activeCategory) {
      result = result.filter((d) => d.categoryId === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.ru.toLowerCase().includes(q) ||
          d.name.kz.toLowerCase().includes(q) ||
          d.name.uz.toLowerCase().includes(q)
      );
    }
    return result;
  }, [dishes, activeCategory, search]);

  const grouped = useMemo(() => {
    if (activeCategory || search.trim()) return null;
    return categories
      .map((cat) => ({
        category: cat,
        dishes: filtered.filter((d) => d.categoryId === cat.id),
      }))
      .filter((g) => g.dishes.length > 0);
  }, [categories, filtered, activeCategory, search]);

  return (
    <div className="min-h-screen pattern-subtle">
      <header className="pattern-bg sticky top-0 z-40 shadow-lg shadow-primary/20">
        <div className="mx-auto max-w-lg px-4 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <BrandLogo onDark />
            <LanguageSwitcher />
          </div>
          <div className="mt-4">
            <OrnamentDivider />
            <p className="mt-2 text-center font-display text-sm tracking-wide text-gold-light/90">
              {t(lang, "menu")}
            </p>
          </div>
        </div>
        <div className="h-3 rounded-t-3xl bg-cream" />
      </header>

      <div className="-mt-1 bg-cream">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryNav
          categories={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        <main className="mx-auto max-w-lg px-4 pb-28 pt-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-4xl text-primary/20">✦</p>
              <p className="mt-3 text-primary-muted">{t(lang, "noResults")}</p>
            </div>
          ) : grouped ? (
            grouped.map(({ category, dishes: catDishes }) => (
              <section key={category.id} className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold text-primary">
                    {category.name[lang]}
                  </h2>
                  <div className="gold-line flex-1" />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  {catDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onClick={() => setSelectedDish(dish)}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {filtered.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onClick={() => setSelectedDish(dish)}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="border-t border-primary/5 bg-paper">
          <div className="mx-auto max-w-lg px-4 py-8">
            <OrnamentDivider className="mb-6" />
            <div className="space-y-3 text-sm text-primary-muted">
              <div className="flex gap-3">
                <span className="text-gold">◎</span>
                <p>
                  <span className="font-semibold text-primary">
                    {t(lang, "address")}
                  </span>
                  <br />
                  {settings.address[lang]}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-gold">☎</span>
                <p>
                  <span className="font-semibold text-primary">
                    {t(lang, "phone")}
                  </span>
                  <br />
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-accent hover:underline"
                  >
                    {settings.phone}
                  </a>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-gold">◷</span>
                <p>
                  <span className="font-semibold text-primary">
                    {t(lang, "hours")}
                  </span>
                  <br />
                  {settings.workingHours[lang]}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-6">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary/10 px-5 py-2 text-sm font-medium text-primary transition-colors hover:border-gold hover:text-gold"
                >
                  Instagram
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary/10 px-5 py-2 text-sm font-medium text-primary transition-colors hover:border-gold hover:text-gold"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <p className="mt-8 text-center font-display text-xs tracking-widest text-primary/30 uppercase">
              {settings.name}
            </p>
          </div>
        </footer>
      </div>

      {selectedDish && (
        <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
      )}

      <CartButton onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
