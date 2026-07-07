import { NextResponse } from "next/server";
import { getPublicMenu, readMenu } from "@/lib/menu-store";

export async function GET() {
  try {
    const menu = await getPublicMenu();
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { isAuthenticated } = await import("@/lib/auth");
    const { writeMenu } = await import("@/lib/menu-store");

    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await writeMenu(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const menu = await readMenu();
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}
