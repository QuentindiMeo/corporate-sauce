import { describe, expect, it } from "vitest";

import { ogImageMeta } from "@/ui/seo/open-graph";

const base = {
  siteUrl: "https://qdm.example",
  src: "/_astro/og.abcd1234.png",
  width: 1200,
  height: 630,
  format: "png",
  alt: "La galerie des posts QDM.",
};

describe("Feature: Open Graph image metadata", () => {
  it("Given a relative source, When the meta is built, Then the URL is made absolute from the site", () => {
    expect(ogImageMeta(base).url).toBe("https://qdm.example/_astro/og.abcd1234.png");
  });

  it("Given an already-absolute source, When the meta is built, Then the URL is kept as-is", () => {
    const meta = ogImageMeta({ ...base, src: "https://cdn.example/og.png" });
    expect(meta.url).toBe("https://cdn.example/og.png");
  });

  it("Given a site URL with a trailing path, When the meta is built, Then the source is resolved from the origin", () => {
    // ! `new URL("/a.png", "https://x.example/blog/")` → "https://x.example/a.png" : la racine gagne, c'est voulu.
    const meta = ogImageMeta({ ...base, siteUrl: "https://qdm.example/galerie/" });
    expect(meta.url).toBe("https://qdm.example/_astro/og.abcd1234.png");
  });

  it("Given the real file dimensions, When the meta is built, Then they are carried verbatim", () => {
    // ? C'est tout l'intérêt : les balises viennent d'`ImageMetadata`, donc elles ne peuvent pas
    // ? se désynchroniser du fichier servi.
    const meta = ogImageMeta({ ...base, width: 1080, height: 1350 });
    expect(meta.width).toBe(1080);
    expect(meta.height).toBe(1350);
  });

  it("Given a PNG, When the meta is built, Then the declared type is image/png", () => {
    expect(ogImageMeta(base).type).toBe("image/png");
  });

  it.each([
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["webp", "image/webp"],
    ["avif", "image/avif"],
    ["gif", "image/gif"],
    ["tiff", "image/tiff"],
    ["svg", "image/svg+xml"],
  ])("Given a %s image, When the meta is built, Then the declared type is %s", (format, expected) => {
    expect(ogImageMeta({ ...base, format }).type).toBe(expected);
  });

  it("Given an unknown format, When the meta is built, Then no type is declared rather than a wrong one", () => {
    expect(ogImageMeta({ ...base, format: "heic" }).type).toBeUndefined();
  });

  it("Given an alternative text, When the meta is built, Then it is carried through", () => {
    expect(ogImageMeta(base).alt).toBe("La galerie des posts QDM.");
  });
});
