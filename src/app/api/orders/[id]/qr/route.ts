import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getOrder } from "@/lib/order-store";

function siteBase(request: Request): string {
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const url = `${siteBase(request)}/waiter/${id}`;
  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 260,
    color: { dark: "#630E14", light: "#EAE2D1" },
  });

  return NextResponse.json({ url, dataUrl });
}
