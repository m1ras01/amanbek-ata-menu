import { NextResponse } from "next/server";
import QRCode from "qrcode";
import {
  buildOrderPayload,
  encodeOrderPayload,
  type CompactOrder,
} from "@/lib/order-payload";

function siteBase(request: Request): string {
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = (body.payload ?? body) as CompactOrder;

    if (!payload?.items?.length) {
      return NextResponse.json({ error: "Empty order" }, { status: 400 });
    }

    const token = encodeOrderPayload(payload);
    const url = `${siteBase(request)}/waiter/${token}`;
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 260,
      color: { dark: "#630E14", light: "#EAE2D1" },
    });

    return NextResponse.json({ url, dataUrl, token });
  } catch {
    return NextResponse.json({ error: "QR generation failed" }, { status: 500 });
  }
}
