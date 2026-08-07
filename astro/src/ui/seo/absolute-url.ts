/**
 * ? Rend une URL absolue à partir du site (laisse intactes les URLs déjà absolues).
 * ? Partagé par le JSON-LD et les balises Open Graph : les deux exigent des URLs absolues,
 * ? et les deux se trompaient de base avant le lot A d'`og.md`.
 */
export function absoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return new URL(path, siteUrl).href;
}
