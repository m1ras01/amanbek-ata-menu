export const ADMIN_PATH =
  process.env.NEXT_PUBLIC_ADMIN_PATH ??
  process.env.ADMIN_PATH ??
  "panel-ata7k";

export const ADMIN_BASE = `/${ADMIN_PATH}`;

export function adminUrl(path = ""): string {
  return `${ADMIN_BASE}${path}`;
}
