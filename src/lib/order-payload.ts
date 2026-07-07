import type { CartLine, LocalizedText, Order } from "./types";

export type CompactOrderItem = {
  i: string;
  q: number;
  p: number;
  n: LocalizedText;
  w: string;
};

export type CompactOrder = {
  t?: string;
  items: CompactOrderItem[];
  tot: number;
  at: number;
};

export function buildOrderPayload(
  items: CartLine[],
  table: string | null,
  total: number
): CompactOrder {
  return {
    t: table ?? undefined,
    items: items.map((line) => ({
      i: line.dish.id,
      q: line.quantity,
      p: line.dish.price,
      n: line.dish.name,
      w: line.dish.weightOrVolume,
    })),
    tot: total,
    at: Date.now(),
  };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(token: string): Uint8Array {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"));
  }
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function encodeOrderPayload(payload: CompactOrder): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return bytesToBase64Url(bytes);
}

export function decodeOrderPayload(token: string): CompactOrder | null {
  try {
    const bytes = base64UrlToBytes(token);
    const payload = JSON.parse(
      new TextDecoder().decode(bytes)
    ) as CompactOrder;
    if (!payload?.items?.length) return null;
    return payload;
  } catch {
    return null;
  }
}

export function payloadToOrder(token: string, payload: CompactOrder): Order {
  const at = new Date(payload.at).toISOString();
  return {
    id: token.slice(0, 8),
    table: payload.t,
    items: payload.items.map((item) => ({
      dishId: item.i,
      quantity: item.q,
      price: item.p,
      name: item.n,
      weightOrVolume: item.w,
    })),
    total: payload.tot,
    createdAt: at,
    updatedAt: at,
    status: "active",
  };
}

export function isEncodedOrderToken(id: string): boolean {
  return id.length > 16;
}
