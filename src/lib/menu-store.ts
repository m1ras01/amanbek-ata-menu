import { promises as fs } from "fs";
import path from "path";
import type { MenuData } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "menu.json");

export async function readMenu(): Promise<MenuData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as MenuData;
}

export async function writeMenu(data: MenuData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getPublicMenu(): Promise<MenuData> {
  const data = await readMenu();
  return {
    settings: data.settings,
    categories: data.categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    dishes: data.dishes
      .filter((d) => d.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}
