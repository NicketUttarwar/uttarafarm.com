/** Public files under `public/assets/` (URL path `/assets/...`). */
export function assetUrl(filename: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}assets/${filename}`;
}
