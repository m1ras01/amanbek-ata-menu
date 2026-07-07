import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME ?? "admin";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "amanbek2026";
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === SESSION_VALUE;
}

export { COOKIE_NAME, SESSION_VALUE };
