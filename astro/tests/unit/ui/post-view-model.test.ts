import type { ImageMetadata } from "astro";
import { describe, expect, it } from "vitest";

import {
  isScheduledNow,
  toMonthRowViewModels,
  toPostViewModel,
  toThemeRowViewModels,
} from "@/ui/view-model/post-view-model";
import { publicationInstant } from "@domain/publication-time";
import { aPost } from "../../helpers/post-factory";

const visual = {
  src: "/_astro/demo.webp",
  width: 1080,
  height: 1350,
  format: "webp",
} as ImageMetadata;

const page = (alt: string) => ({ image: visual, alt });

const post = (overrides = {}) =>
  aPost<ImageMetadata>({
    id: "demo",
    category: "A11Y",
    mode: "clair",
    title: "Un titre",
    image: visual,
    imageAlt: "Un visuel",
    publishedAt: publicationInstant("2026-08-05"),
    ...overrides,
  });

describe("Feature: post view model", () => {
  it("Given an entity, When it is projected, Then the image keeps its Astro type without any cast", () => {
    const vm = toPostViewModel(post());

    // Le type est garanti à la compilation ; à l'exécution on vérifie le passage à l'identique.
    expect(vm.image).toBe(visual);
    expect(vm.imageAlt).toBe("Un visuel");
  });

  it("Given an entity, When it is projected, Then the publication instant is carried, not a verdict", () => {
    const vm = toPostViewModel(post());

    expect(vm.publishedAtIso).toBe("2026-08-05T09:00:00.000Z");
    expect(vm.publishedDayIso).toBe("2026-08-05");
    expect(vm.publishedLabel).toBe("5 août 2026");
  });

  it("Given the view model, Then it holds NO value derived from the current time", () => {
    // ! Règle tirée de la Phase 8 : un booléen « à venir » figé dans le view model serait figé au build.
    // ! Le view model porte le FAIT (l'instant) ; le verdict est calculé à part.
    const champs = Object.keys(toPostViewModel(post()));

    expect(champs).not.toContain("isScheduled");
    expect(champs).not.toContain("scheduled");
    expect(champs).toContain("publishedAtIso");
  });

  it("Given a carousel entity, When it is projected, Then pages and count are precomputed", () => {
    const vm = toPostViewModel(post({ pages: [page("p1"), page("p2"), page("p3")] }));

    expect(vm.isCarousel).toBe(true);
    expect(vm.pageCount).toBe(3);
    expect(vm.pages.map((p) => p.alt)).toEqual(["p1", "p2", "p3"]);
  });

  it("Given a single-visual entity, When it is projected, Then it is not a carousel and pages are empty", () => {
    const vm = toPostViewModel(post());

    expect(vm.isCarousel).toBe(false);
    expect(vm.pageCount).toBe(0);
    expect(vm.pages).toEqual([]);
  });

  it("Given a mode, When it is projected, Then the palettes are ready as inline styles", () => {
    const vm = toPostViewModel(post({ mode: "clair" }));

    expect(vm.mode).toBe("clair");
    expect(vm.isDarkMode).toBe(false);
    expect(vm.modeStyle).toContain("--bg:#F6ECD4");
    expect(vm.headerStyle).toContain("--bg:#120A07"); // ? La carte inverse la bande de titre : mode clair → en-tête sombre.
  });

  it("Given a dark mode, When it is projected, Then isDarkMode is set and the header inverts the other way", () => {
    const vm = toPostViewModel(post({ mode: "sombre" }));

    expect(vm.isDarkMode).toBe(true);
    expect(vm.headerStyle).toContain("--bg:#F6ECD4");
  });

  it("Given a post, When it is projected, Then the accessible label base names its shape", () => {
    expect(toPostViewModel(post()).ariaBase).toBe("Ouvrir le post « Un titre »");
    expect(toPostViewModel(post({ pages: [page("a"), page("b")] })).ariaBase).toBe("Ouvrir le carrousel « Un titre »");
  });

  it("Given a carousel, When it is projected, Then an accessible description states the page count", () => {
    expect(toPostViewModel(post({ pages: [page("a"), page("b")] })).ariaDescription).toBe("Contient 2 pages.");
    expect(toPostViewModel(post()).ariaDescription).toBeUndefined();
  });

  it("Given a post, When it is projected, Then editorial texts pass through", () => {
    const vm = toPostViewModel(post({ subtitle: "Accroche", body: "Corps", takeaway: "Clé", cta: "Réagissez" }));

    expect(vm.subtitle).toBe("Accroche");
    expect(vm.body).toBe("Corps");
    expect(vm.takeaway).toBe("Clé");
    expect(vm.cta).toBe("Réagissez");
    expect(vm.linkedInUrl).toBe("https://www.linkedin.com/posts/qdm");
  });
});

describe("Feature: scheduled verdict, computed apart from the view model", () => {
  it("Given an instant still ahead, When compared to now, Then the post is scheduled", () => {
    const vm = toPostViewModel(post());
    expect(isScheduledNow(vm, new Date("2026-08-05T08:00:00Z"))).toBe(true);
  });

  it("Given an instant already past, When compared to now, Then the post is published", () => {
    const vm = toPostViewModel(post());
    expect(isScheduledNow(vm, new Date("2026-08-05T10:00:00Z"))).toBe(false);
  });

  it("Given exactly the publication instant, Then the post counts as published", () => {
    const vm = toPostViewModel(post());
    expect(isScheduledNow(vm, new Date("2026-08-05T09:00:00Z"))).toBe(false);
  });
});

describe("Feature: row view models", () => {
  it("Given theme rows, When they are projected, Then categories and posts are preserved", () => {
    const rows = toThemeRowViewModels([
      { category: "PERF", posts: [post({ id: "a" })] },
      { category: "A11Y", posts: [post({ id: "b" }), post({ id: "c" })] },
    ]);

    expect(rows.map((r) => r.category)).toEqual(["PERF", "A11Y"]);
    expect(rows[1].posts.map((p) => p.id)).toEqual(["b", "c"]);
    expect(rows[1].posts[0].publishedLabel).toBe("5 août 2026");
  });

  it("Given month rows, When they are projected, Then labels for the heading and the rail are ready", () => {
    const rows = toMonthRowViewModels([
      {
        monthKey: "2026-08",
        month: new Date("2026-08-01T00:00:00.000Z"),
        posts: [post({ id: "a" }), post({ id: "b" })],
      },
    ]);

    expect(rows[0].monthKey).toBe("2026-08");
    expect(rows[0].label).toBe("août 2026");
    expect(rows[0].code).toBe("08.26");
    expect(rows[0].labelWithElision).toBe("d'août 2026");
    expect(rows[0].count).toBe(2);
  });

  it("Given a consonant-initial month, Then the elided label keeps « de »", () => {
    const rows = toMonthRowViewModels([
      { monthKey: "2026-07", month: new Date("2026-07-01T00:00:00.000Z"), posts: [] },
    ]);

    expect(rows[0].labelWithElision).toBe("de juillet 2026");
  });

  it("Given no rows, When they are projected, Then the result is empty", () => {
    expect(toThemeRowViewModels([])).toEqual([]);
    expect(toMonthRowViewModels([])).toEqual([]);
  });
});
