import { absoluteUrl } from "@/ui/seo/absolute-url";

interface OgImageInput {
  siteUrl: string;
  /** Chemin servi par Astro (`ImageMetadata.src`), relatif au site ou déjà absolu. */
  src: string;
  width: number;
  height: number;
  /** `ImageMetadata.format` — la source fait foi, plutôt que de deviner via l'extension de l'URL. */
  format: string;
  alt: string;
}

interface OgImageMeta {
  url: string;
  width: number;
  height: number;
  /** `undefined` si le format n'a pas de type MIME connu : mieux vaut ne rien déclarer que déclarer faux. */
  type?: string;
  alt: string;
}

// ? Couvre les formats d'entrée d'`astro:assets` (`VALID_INPUT_FORMATS`).
const MIME_TYPES: Readonly<Record<string, string>> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  tiff: "image/tiff",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

/**
 * ? Balises `og:image:*` / `twitter:image:*` de l'aperçu de lien (og.md, lot A).
 * ? Les dimensions sont **reprises du fichier** (`ImageMetadata`), pas saisies à la main : elles ne
 * ? peuvent donc pas se désynchroniser du visuel servi le jour où il change.
 * * Les déclarer évite au scraper de télécharger l'image avant de composer la carte — ce qui compte
 * * surtout au tout premier partage, quand rien n'est encore en cache côté plateforme.
 */
export function ogImageMeta({ siteUrl, src, width, height, format, alt }: OgImageInput): OgImageMeta {
  return {
    url: absoluteUrl(siteUrl, src),
    width,
    height,
    type: MIME_TYPES[format],
    alt,
  };
}
