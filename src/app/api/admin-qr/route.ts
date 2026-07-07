import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { ADMIN_BASE } from "@/lib/admin-config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `${request.headers.get("x-forwarded-proto") ?? "http"}://${request.headers.get("host")}`;
  const url = `${base}${ADMIN_BASE}`;

  if (format === "png") {
    const buffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 512,
      color: { dark: "#630E14", light: "#EAE2D1" },
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="amanbek-admin-qr.png"',
      },
    });
  }

  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 400,
    color: { dark: "#630E14", light: "#EAE2D1" },
  });

  return NextResponse.json({ url, dataUrl });
}
