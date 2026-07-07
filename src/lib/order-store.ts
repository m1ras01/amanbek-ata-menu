import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderItem } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "orders.json");
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function readOrders(): Promise<Record<string, Order>> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, Order>;
  } catch {
    return {};
  }
}

async function writeOrders(orders: Record<string, Order>): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

function pruneOld(orders: Record<string, Order>): Record<string, Order> {
  const cutoff = Date.now() - MAX_AGE_MS;
  const result: Record<string, Order> = {};
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
  orders[id] = { ...orders[id], status: "completed", updatedAt: new Date().toISOString() };
  await writeOrders(orders);
  return orders[id];
}
