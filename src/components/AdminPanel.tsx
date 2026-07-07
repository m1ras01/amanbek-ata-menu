"use client";

import { useEffect, useState } from "react";
import type { Category, Dish, MenuData } from "@/lib/types";
import { ImageUpload } from "@/components/ImageUpload";

type Tab = "dishes" | "availability" | "categories";

function emptyDish(categories: Category[]): Dish {
  const catId = categories.find((c) => c.isActive)?.id ?? categories[0]?.id ?? "";
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
    imageUrl: "",
  };
}

function emptyCategory(sortOrder: number): Category {
  return {
    id: `cat-${Date.now()}`,
    sortOrder,
    isActive: true,
    name: { ru: "", kz: "", uz: "" },
  };
}

export function AdminPanel() {
  const [data, setData] = useState<MenuData | null>(null);
  const [tab, setTab] = useState<Tab>("dishes");
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  const updateDish = (dish: Dish) => {
    const exists = data.dishes.some((d) => d.id === dish.id);
    const dishes = exists
      ? data.dishes.map((d) => (d.id === dish.id ? dish : d))
      : [...data.dishes, dish];
    save({ ...data, dishes });
    setEditingDish(null);
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

  const updateCategory = (cat: Category) => {
    const exists = data.categories.some((c) => c.id === cat.id);
    const categories = exists
      ? data.categories.map((c) => (c.id === cat.id ? cat : c))
      : [...data.categories, cat];
    save({ ...data, categories });
    setEditingCategory(null);
  };

  const deleteCategory = (id: string) => {
    const hasDishes = data.dishes.some((d) => d.categoryId === id);
    if (hasDishes) {
      alert("Сначала удалите или перенесите блюда из этой категории");
      return;
    }
    if (!confirm("Удалить категорию?")) return;
    save({ ...data, categories: data.categories.filter((c) => c.id !== id) });
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dishes", label: "Блюда", icon: "🍽" },
    { id: "availability", label: "Наличие", icon: "✓" },
    { id: "categories", label: "Категории", icon: "📂" },
  ];

  return (
    <div className="pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
          Управление меню
        </h1>
        {saved && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            ✓ Сохранено
          </span>
        )}
      </div>

      {/* Tabs — scroll on mobile, grid on desktop */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:flex sm:gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl px-2 py-2 text-center transition-all sm:min-h-0 sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5 ${
              tab === t.id
                ? "bg-primary text-white shadow-md"
                : "card text-primary-muted hover:text-primary"
            }`}
          >
            <span className="text-lg sm:text-base">{t.icon}</span>
            <span className="text-xs font-semibold sm:text-sm">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "dishes" && (
        <DishesTab
          data={data}
          onAdd={() => setEditingDish(emptyDish(data.categories))}
          onEdit={setEditingDish}
          onDelete={deleteDish}
          onToggle={toggleDish}
        />
      )}

      {tab === "availability" && (
        <AvailabilityTab
          data={data}
          onToggle={(id) => toggleDish(id, "isAvailable")}
        />
      )}

      {tab === "categories" && (
        <CategoriesTab
          data={data}
          onAdd={() =>
            setEditingCategory(
              emptyCategory(data.categories.length + 1)
            )
          }
          onEdit={setEditingCategory}
          onDelete={deleteCategory}
          onToggleActive={(id) => {
            const categories = data.categories.map((c) =>
              c.id === id ? { ...c, isActive: !c.isActive } : c
            );
            save({ ...data, categories });
          }}
        />
      )}

      {editingDish && (
        <DishEditor
          dish={editingDish}
          categories={data.categories.filter((c) => c.isActive)}
          onSave={updateDish}
          onClose={() => setEditingDish(null)}
        />
      )}

      {editingCategory && (
        <CategoryEditor
          category={editingCategory}
          onSave={updateCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}

/* ─── Shared UI ─── */

function AdminBtn({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
}) {
  const styles = {
    primary: "btn-primary text-white",
    secondary: "card text-primary hover:bg-cream-dark",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-primary-muted hover:text-primary",
  };
  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function AdminInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-primary-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-primary/10 bg-paper px-4 py-3 text-base text-primary outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 ${props.className ?? ""}`}
      />
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-primary/50 backdrop-blur-sm sm:items-center">
      <div
        className="animate-slide-up flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-3xl bg-paper sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-primary/5 px-5 py-4">
          <h2 className="font-display text-xl font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-primary"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ─── Dishes Tab ─── */

function DishesTab({
  data,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}: {
  data: MenuData;
  onAdd: () => void;
  onEdit: (d: Dish) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, field: "isActive" | "isAvailable") => void;
}) {
  return (
    <div className="mt-6">
      <AdminBtn onClick={onAdd} className="w-full sm:w-auto">
        + Добавить блюдо
      </AdminBtn>

      <div className="mt-4 space-y-3">
        {data.dishes
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((dish) => {
            const cat = data.categories.find((c) => c.id === dish.categoryId);
            return (
              <div key={dish.id} className="card rounded-2xl p-3 sm:p-4">
                <div className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dish.imageUrl || "/icon.svg"}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary leading-tight">
                      {dish.name.ru || "Без названия"}
                    </p>
                    <p className="mt-0.5 text-xs text-primary-muted sm:text-sm">
                      {cat?.name.ru} · {dish.price.toLocaleString()} ₸
                    </p>
                    <p className="text-xs text-primary-muted">
                      {dish.weightOrVolume}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge
                        active={dish.isAvailable}
                        onLabel="В наличии"
                        offLabel="Нет"
                        onClick={() => onToggle(dish.id, "isAvailable")}
                      />
                      <StatusBadge
                        active={dish.isActive}
                        onLabel="В меню"
                        offLabel="Скрыто"
                        onClick={() => onToggle(dish.id, "isActive")}
                        color="blue"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                  <AdminBtn
                    variant="secondary"
                    onClick={() => onEdit(dish)}
                    className="w-full sm:w-auto"
                  >
                    Изменить
                  </AdminBtn>
                  <AdminBtn
                    variant="danger"
                    onClick={() => onDelete(dish.id)}
                    className="w-full sm:w-auto"
                  >
                    Удалить
                  </AdminBtn>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function StatusBadge({
  active,
  onLabel,
  offLabel,
  onClick,
  color = "green",
}: {
  active: boolean;
  onLabel: string;
  offLabel: string;
  onClick: () => void;
  color?: "green" | "blue";
}) {
  const activeStyle =
    color === "blue"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        active ? activeStyle : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? onLabel : offLabel}
    </button>
  );
}

/* ─── Categories Tab ─── */

function CategoriesTab({
  data,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  data: MenuData;
  onAdd: () => void;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}) {
  return (
    <div className="mt-6">
      <p className="text-sm text-primary-muted">
        Разделы меню: Супы, Горячее, Напитки и т.д.
      </p>
      <AdminBtn onClick={onAdd} className="mt-4 w-full sm:w-auto">
        + Добавить категорию
      </AdminBtn>

      <div className="mt-4 space-y-3">
        {data.categories
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((cat) => {
            const dishCount = data.dishes.filter(
              (d) => d.categoryId === cat.id
            ).length;
            return (
              <div key={cat.id} className="card rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-primary">
                      {cat.name.ru || "Без названия"}
                    </p>
                    <p className="mt-0.5 text-sm text-primary-muted">
                      {cat.name.kz} · {cat.name.uz}
                    </p>
                    <p className="mt-1 text-xs text-primary-muted">
                      {dishCount} блюд · порядок {cat.sortOrder}
                    </p>
                  </div>
                  <StatusBadge
                    active={cat.isActive}
                    onLabel="Активна"
                    offLabel="Скрыта"
                    onClick={() => onToggleActive(cat.id)}
                    color="blue"
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <AdminBtn
                    variant="secondary"
                    onClick={() => onEdit(cat)}
                    className="w-full"
                  >
                    Изменить
                  </AdminBtn>
                  <AdminBtn
                    variant="danger"
                    onClick={() => onDelete(cat.id)}
                    className="w-full"
                  >
                    Удалить
                  </AdminBtn>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/* ─── Category Editor ─── */

function CategoryEditor({
  category,
  onSave,
  onClose,
}: {
  category: Category;
  onSave: (c: Category) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(category);
  const isNew = !category.name.ru && !category.name.kz;

  const setName = (lang: "ru" | "kz" | "uz", value: string) =>
    setForm((f) => ({ ...f, name: { ...f.name, [lang]: value } }));

  return (
    <Modal
      title={isNew ? "Новая категория" : "Редактировать категорию"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <AdminInput
          label="Название (RU)"
          value={form.name.ru}
          onChange={(e) => setName("ru", e.target.value)}
          placeholder="Например: Супы"
        />
        <AdminInput
          label="Название (KZ)"
          value={form.name.kz}
          onChange={(e) => setName("kz", e.target.value)}
          placeholder="Мысал: Сорпалар"
        />
        <AdminInput
          label="Название (UZ)"
          value={form.name.uz}
          onChange={(e) => setName("uz", e.target.value)}
          placeholder="Masalan: Sho'rvalar"
        />
        <AdminInput
          label="Порядок в меню"
          type="number"
          value={form.sortOrder}
          onChange={(e) =>
            setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
          }
        />

        <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-cream px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-primary">Показывать в меню</p>
            <p className="text-xs text-primary-muted">
              {form.isActive ? "Видна гостям" : "Скрыта"}
            </p>
          </div>
          <AvailabilitySwitch
            available={form.isActive}
            onChange={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 pb-2">
        <AdminBtn variant="secondary" onClick={onClose} className="w-full">
          Отмена
        </AdminBtn>
        <AdminBtn
          onClick={() => onSave(form)}
          className="w-full"
          variant="primary"
        >
          Сохранить
        </AdminBtn>
      </div>
    </Modal>
  );
}

/* ─── Dish Editor ─── */

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
  const isNew = !dish.name.ru;

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
    <Modal title={isNew ? "Новое блюдо" : "Редактировать блюдо"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-primary-muted uppercase tracking-wide">
            Категория
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="w-full rounded-xl border border-primary/10 bg-paper px-4 py-3 text-base text-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.ru}
              </option>
            ))}
          </select>
        </div>

        <AdminInput
          label="Название (RU)"
          value={form.name.ru}
          onChange={(e) => setName("ru", e.target.value)}
        />
        <AdminInput
          label="Название (KZ)"
          value={form.name.kz}
          onChange={(e) => setName("kz", e.target.value)}
        />
        <AdminInput
          label="Название (UZ)"
          value={form.name.uz}
          onChange={(e) => setName("uz", e.target.value)}
        />

        <div>
          <label className="mb-1 block text-xs font-semibold text-primary-muted uppercase tracking-wide">
            Описание (RU)
          </label>
          <textarea
            value={form.description.ru}
            onChange={(e) => setDesc("ru", e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-primary/10 bg-paper px-4 py-3 text-base text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-primary-muted uppercase tracking-wide">
            Описание (KZ)
          </label>
          <textarea
            value={form.description.kz}
            onChange={(e) => setDesc("kz", e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-primary/10 bg-paper px-4 py-3 text-base text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-primary-muted uppercase tracking-wide">
            Описание (UZ)
          </label>
          <textarea
            value={form.description.uz}
            onChange={(e) => setDesc("uz", e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-primary/10 bg-paper px-4 py-3 text-base text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AdminInput
            label="Цена (₸)"
            type="number"
            value={form.price || ""}
            onChange={(e) => set("price", Number(e.target.value))}
          />
          <AdminInput
            label="Вес / объём"
            value={form.weightOrVolume}
            onChange={(e) => set("weightOrVolume", e.target.value)}
            placeholder="350 г"
          />
        </div>

        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => set("imageUrl", url)}
        />

        <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-cream px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-primary">В наличии</p>
            <p className="text-xs text-primary-muted">
              {form.isAvailable ? "Можно заказать" : "Нет в наличии"}
            </p>
          </div>
          <AvailabilitySwitch
            available={form.isAvailable}
            onChange={() => set("isAvailable", !form.isAvailable)}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 pb-2">
        <AdminBtn variant="secondary" onClick={onClose} className="w-full">
          Отмена
        </AdminBtn>
        <AdminBtn onClick={() => onSave(form)} className="w-full">
          Сохранить
        </AdminBtn>
      </div>
    </Modal>
  );
}

/* ─── Availability ─── */

function AvailabilitySwitch({
  available,
  onChange,
}: {
  available: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${
        available ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${
          available ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function AvailabilityTab({
  data,
  onToggle,
}: {
  data: MenuData;
  onToggle: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "available" | "unavailable">("all");

  const dishes = data.dishes
    .filter((d) => d.isActive)
    .filter((d) => {
      if (filter === "available") return d.isAvailable;
      if (filter === "unavailable") return !d.isAvailable;
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const unavailableCount = data.dishes.filter(
    (d) => d.isActive && !d.isAvailable
  ).length;

  return (
    <div className="mt-6">
      <p className="text-sm text-primary-muted">
        Нажмите переключатель — гости сразу увидят изменения.
      </p>

      {unavailableCount > 0 && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠ {unavailableCount} блюд нет в наличии
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(
          [
            ["all", "Все"],
            ["available", "Есть"],
            ["unavailable", "Нет"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`min-h-[44px] rounded-xl text-sm font-semibold transition-all ${
              filter === key
                ? "bg-primary text-white"
                : "card text-primary-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {dishes.map((dish) => {
          const cat = data.categories.find((c) => c.id === dish.categoryId);
          return (
            <div
              key={dish.id}
              className={`card flex items-center gap-3 rounded-2xl p-3 ${
                !dish.isAvailable ? "opacity-60" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dish.imageUrl || "/icon.svg"}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-primary truncate">
                  {dish.name.ru}
                </p>
                <p className="text-xs text-primary-muted">{cat?.name.ru}</p>
              </div>
              <AvailabilitySwitch
                available={dish.isAvailable}
                onChange={() => onToggle(dish.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
