"use client";

import { useEffect, useState } from "react";
import type { Category, Dish, MenuData } from "@/lib/types";

type Tab = "dishes" | "categories";

function emptyDish(categories: Category[]): Dish {
  const catId = categories[0]?.id ?? "";
  return {
    id: `dish-${Date.now()}`,
    categoryId: catId,
    sortOrder: 99,
    isActive: true,
    isAvailable: true,
    name: { ru: "", kz: "", uz: "" },
    description: { ru: "", kz: "", uz: "" },
    price: 0,
    weightOrVolume: "",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    tags: [],
  };
}

export function AdminPanel() {
  const [data, setData] = useState<MenuData | null>(null);
  const [tab, setTab] = useState<Tab>("dishes");
  const [editing, setEditing] = useState<Dish | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/menu", { method: "POST" })
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async (updated: MenuData) => {
    setData(updated);
    await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!data) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const updateDish = (dish: Dish) => {
    const dishes = data.dishes.map((d) => (d.id === dish.id ? dish : d));
    if (!data.dishes.find((d) => d.id === dish.id)) {
      dishes.push(dish);
    }
    save({ ...data, dishes });
    setEditing(null);
  };

  const deleteDish = (id: string) => {
    if (!confirm("Удалить блюдо?")) return;
    save({ ...data, dishes: data.dishes.filter((d) => d.id !== id) });
  };

  const toggleDish = (id: string, field: "isActive" | "isAvailable") => {
    const dishes = data.dishes.map((d) =>
      d.id === id ? { ...d, [field]: !d[field] } : d
    );
    save({ ...data, dishes });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Управление меню</h1>
        {saved && (
          <span className="text-sm font-medium text-green-600">Сохранено ✓</span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {(["dishes", "categories"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t
                ? "bg-primary text-white"
                : "bg-white text-primary/60 border border-primary/10"
            }`}
          >
            {t === "dishes" ? "Блюда" : "Категории"}
          </button>
        ))}
      </div>

      {tab === "dishes" && (
        <div className="mt-6">
          <button
            onClick={() => setEditing(emptyDish(data.categories))}
            className="mb-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-light"
          >
            + Добавить блюдо
          </button>

          <div className="space-y-3">
            {data.dishes
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((dish) => {
                const cat = data.categories.find(
                  (c) => c.id === dish.categoryId
                );
                return (
                  <div
                    key={dish.id}
                    className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-primary truncate">
                        {dish.name.ru || "Без названия"}
                      </p>
                      <p className="text-xs text-primary/50">
                        {cat?.name.ru} · {dish.price} ₸ · {dish.weightOrVolume}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        toggleDish(dish.id, "isAvailable")
                      }
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${
                        dish.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {dish.isAvailable ? "В наличии" : "Нет"}
                    </button>
                    <button
                      onClick={() =>
                        toggleDish(dish.id, "isActive")
                      }
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${
                        dish.isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {dish.isActive ? "Активно" : "Скрыто"}
                    </button>
                    <button
                      onClick={() => setEditing(dish)}
                      className="text-sm text-accent hover:underline"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => deleteDish(dish.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {tab === "categories" && (
        <div className="mt-6 space-y-3">
          {data.categories
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    value={cat.name.ru}
                    onChange={(e) => {
                      const categories = data.categories.map((c) =>
                        c.id === cat.id
                          ? { ...c, name: { ...c.name, ru: e.target.value } }
                          : c
                      );
                      setData({ ...data, categories });
                    }}
                    placeholder="RU"
                    className="rounded-lg border border-primary/10 px-3 py-2 text-sm"
                  />
                  <input
                    value={cat.name.kz}
                    onChange={(e) => {
                      const categories = data.categories.map((c) =>
                        c.id === cat.id
                          ? { ...c, name: { ...c.name, kz: e.target.value } }
                          : c
                      );
                      setData({ ...data, categories });
                    }}
                    placeholder="KZ"
                    className="rounded-lg border border-primary/10 px-3 py-2 text-sm"
                  />
                  <input
                    value={cat.name.uz}
                    onChange={(e) => {
                      const categories = data.categories.map((c) =>
                        c.id === cat.id
                          ? { ...c, name: { ...c.name, uz: e.target.value } }
                          : c
                      );
                      setData({ ...data, categories });
                    }}
                    placeholder="UZ"
                    className="rounded-lg border border-primary/10 px-3 py-2 text-sm"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const categories = data.categories.map((c) =>
                        c.id === cat.id
                          ? { ...c, isActive: !c.isActive }
                          : c
                      );
                      save({ ...data, categories });
                    }}
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${
                      cat.isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.isActive ? "Активна" : "Скрыта"}
                  </button>
                  <button
                    onClick={() => save(data)}
                    className="text-sm text-accent hover:underline"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {editing && (
        <DishEditor
          dish={editing}
          categories={data.categories}
          onSave={updateDish}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function DishEditor({
  dish,
  categories,
  onSave,
  onClose,
}: {
  dish: Dish;
  categories: Category[];
  onSave: (d: Dish) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(dish);

  const set = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setName = (lang: "ru" | "kz" | "uz", value: string) =>
    setForm((f) => ({ ...f, name: { ...f.name, [lang]: value } }));

  const setDesc = (lang: "ru" | "kz" | "uz", value: string) =>
    setForm((f) => ({
      ...f,
      description: { ...f.description, [lang]: value },
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5">
        <h2 className="text-lg font-bold text-primary">
          {dish.name.ru ? "Редактировать" : "Новое блюдо"}
        </h2>

        <div className="mt-4 space-y-3">
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="w-full rounded-lg border border-primary/10 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.ru}
              </option>
            ))}
          </select>

          {(["ru", "kz", "uz"] as const).map((lang) => (
            <input
              key={lang}
              value={form.name[lang]}
              onChange={(e) => setName(lang, e.target.value)}
              placeholder={`Название (${lang.toUpperCase()})`}
              className="w-full rounded-lg border border-primary/10 px-3 py-2 text-sm"
            />
          ))}

          {(["ru", "kz", "uz"] as const).map((lang) => (
            <textarea
              key={lang}
              value={form.description[lang]}
              onChange={(e) => setDesc(lang, e.target.value)}
              placeholder={`Описание (${lang.toUpperCase()})`}
              rows={2}
              className="w-full rounded-lg border border-primary/10 px-3 py-2 text-sm"
            />
          ))}

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              placeholder="Цена"
              className="rounded-lg border border-primary/10 px-3 py-2 text-sm"
            />
            <input
              value={form.weightOrVolume}
              onChange={(e) => set("weightOrVolume", e.target.value)}
              placeholder="Вес / объём"
              className="rounded-lg border border-primary/10 px-3 py-2 text-sm"
            />
          </div>

          <input
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="Ссылка на фото"
            className="w-full rounded-lg border border-primary/10 px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onSave(form)}
            className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-white"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-primary/20 py-2.5 font-semibold text-primary"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
