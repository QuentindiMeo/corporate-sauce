import type { ImageMetadata } from "astro";
import { describe, expect, it } from "vitest";

import { galleryJsonLd } from "@/ui/seo/structured-data";
import { toPostViewModel } from "@/ui/view-model/post-view-model";
import { publicationInstant } from "@domain/publication-time";
import { aPost } from "../../helpers/post-factory";

const base = {
  siteUrl: "https://qdm.example",
  name: "Galerie QDM",
  description: "Les posts LinkedIn QDM.",
};

const image = (src: string) => ({ src, width: 1, height: 1, format: "webp" }) as ImageMetadata;

/**
 * ? `galleryJsonLd` consomme désormais des **view models** (action.md §3 : la présentation projette, il n'y a
 * ? pas de port sortant). Une seule projection sert donc la vue et le SEO.
 */
const aPostVm = (overrides: Record<string, unknown> = {}) =>
  toPostViewModel(aPost<ImageMetadata>({ image: image("/_astro/demo.webp"), ...overrides }));

describe("Feature: gallery JSON-LD", () => {
  it("Given posts, When the JSON-LD is built, Then a schema.org ItemList is produced", () => {
    const data = galleryJsonLd({ ...base, posts: [aPostVm()] }) as Record<string, unknown>;
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("ItemList");
    expect(data.name).toBe("Galerie QDM");
  });

  it("Given several posts, When the JSON-LD is built, Then each is a CreativeWork with an increasing position", () => {
    const posts = [aPostVm({ id: "a", title: "Titre A" }), aPostVm({ id: "b", title: "Titre B" })];
    const data = galleryJsonLd({ ...base, posts }) as {
      itemListElement: Array<{ position: number; item: Record<string, unknown> }>;
    };

    expect(data.itemListElement).toHaveLength(2);
    expect(data.itemListElement.map((e) => e.position)).toEqual([1, 2]);
    expect(data.itemListElement[0].item["@type"]).toBe("CreativeWork");
    expect(data.itemListElement[0].item.name).toBe("Titre A");
  });

  it("Given a post, When the JSON-LD is built, Then its LinkedIn URL is used as the item URL", () => {
    const post = aPostVm();
    const data = galleryJsonLd({ ...base, posts: [post] }) as {
      itemListElement: Array<{ item: { url: string } }>;
    };
    expect(data.itemListElement[0].item.url).toBe(post.linkedInUrl);
  });

  it("Given a relative image path, When the JSON-LD is built, Then the image URL is made absolute from the site", () => {
    const data = galleryJsonLd({ ...base, posts: [aPostVm({ image: image("/_astro/x.webp") })] }) as {
      itemListElement: Array<{ item: { image: string } }>;
    };
    expect(data.itemListElement[0].item.image).toBe("https://qdm.example/_astro/x.webp");
  });

  it("Given a post, When the JSON-LD is built, Then its publication date is exposed as a bare ISO day", () => {
    // ! Le jour vient du view model (`publishedDayIso`), donc le jour PARISIEN : un post paru à 11 h Paris le 21 juillet est bien daté 2026-07-21, pas la veille.
    const data = galleryJsonLd({
      ...base,
      posts: [aPostVm({ publishedAt: publicationInstant("2026-07-21") })],
    }) as { itemListElement: Array<{ item: { datePublished: string } }> };
    expect(data.itemListElement[0].item.datePublished).toBe("2026-07-21");
  });

  it("Given an already-absolute image URL, When the JSON-LD is built, Then the URL is kept as-is", () => {
    const data = galleryJsonLd({
      ...base,
      posts: [aPostVm({ image: image("https://cdn.example/x.webp") })],
    }) as { itemListElement: Array<{ item: { image: string } }> };
    expect(data.itemListElement[0].item.image).toBe("https://cdn.example/x.webp");
  });
});
