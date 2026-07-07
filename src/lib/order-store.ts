import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderItem } from "./types";

const DATA_PATH = process.env.VERCEL
  ? path.join("/tmp", "amanbek-orders.json")
  : path.join(process.cwd(), "data", "orders.json");

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type OrdersMap = Record<string, Order>;

function getMemoryCache(): OrdersMap {
  const g = globalThis as typeof globalThis & { __amanbekOrders?: OrdersMap };
  if (!g.__amanbekOrders) g.__amanbekOrders = {};
  return g.__amanbekOrders;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function readOrders(): Promise<OrdersMap> {
  const cache = getMemoryCache();
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const fromFile = JSON.parse(raw) as OrdersMap;
    Object.assign(cache, fromFile);
  } catch {
    // file missing or unreadable — use memory cache only
  }
  return { ...cache };
}

async function writeOrders(orders: OrdersMap): Promise<void> {
  Object.assign(getMemoryCache(), orders);
  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch {
    // Vercel: keep orders in memory if disk write fails
  }
}

function pruneOld(orders: OrdersMap): OrdersMap {
  const cutoff = Date.now() - MAX_AGE_MS;
  const result: OrdersMap = {};
  for (const [id, order] of Object.entries(orders)) {
    if (new Date(order.updatedAt).getTime() > cutoff) {
      result[id] = order;
    }
  }
  return result;
}

export function calcTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = pruneOld(await readOrders());
  return orders[id] ?? null;
}

export async function saveOrder(
  items: OrderItem[],
  table?: string,
  existingId?: string
): Promise<Order> {
  const orders = pruneOld(await readOrders());
  const now = new Date().toISOString();
  const total = calcTotal(items);

  if (existingId && orders[existingId]) {
    const order: Order = {
      ...orders[existingId],
      items,
      total,
      table: table ?? orders[existingId].table,
      updatedAt: now,
      status: "active",
    };
    orders[existingId] = order;
    await writeOrders(orders);
    return order;
  }

  const id = generateId();
  const order: Order = {
    id,
    table,
    items,
    total,
    createdAt: now,
    updatedAt: now,
    status: "active",
  };
  orders[id] = order;
  await writeOrders(orders);
  return order;
}

export async function completeOrder(id: string): Promise<Order | null> {
  const orders = await readOrders();
  if (!orders[id]) return null;
  orders[id] = {
    ...orders[id],
    status: "completed",
    updatedAt: new Date().toISOString(),
  };
  await writeOrders(orders);
  return orders[id];
}
