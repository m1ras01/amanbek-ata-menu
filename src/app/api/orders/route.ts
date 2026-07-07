import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/order-store";
import type { OrderItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items as OrderItem[];
    const table = body.table as string | undefined;
    const orderId = body.orderId as string | undefined;

    if (!items?.length) {
      return NextResponse.json({ error: "Empty order" }, { status: 400 });
    }

    const order = await saveOrder(items, table, orderId);
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
