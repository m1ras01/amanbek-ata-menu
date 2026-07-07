export type Lang = "ru" | "kz" | "uz";

export type LocalizedText = Record<Lang, string>;

export type DishTag = "spicy" | "vegetarian" | "hit" | "new";

export interface Category {
  id: string;
  sortOrder: number;
  isActive: boolean;
  name: LocalizedText;
}

export interface Dish {
  id: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  isAvailable: boolean;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  weightOrVolume: string;
  imageUrl: string;
  tags: DishTag[];
}

export interface RestaurantSettings {
  name: string;
  logoUrl: string;
  address: LocalizedText;
  phone: string;
  workingHours: LocalizedText;
  instagram: string;
  whatsapp: string;
  defaultLanguage: Lang;
}

export interface MenuData {
  settings: RestaurantSettings;
  categories: Category[];
  dishes: Dish[];
}

export interface OrderItem {
  dishId: string;
  quantity: number;
  name: LocalizedText;
  price: number;
  weightOrVolume: string;
}

export interface Order {
  id: string;
  table?: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  status: "active" | "completed";
}

export interface CartLine {
  dish: Dish;
  quantity: number;
}
