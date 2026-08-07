import { expect, test } from "@playwright/test";

const contenuMeta = (page: import("@playwright/test").Page, selecteur: string) =>
  page.locator(selecteur).getAttribute("content");

test.describe("Feature: link preview metadata", () => {
  test("Given the home page, When it is loaded, Then the preview image is declared with an absolute URL", async ({
    page,
  }) => {
    await page.goto("/");
    const image = await contenuMeta(page, 'meta[property="og:image"]');
    expect(image).toBeTruthy();
    // ! Une URL relative est ignorée par la plupart des scrapers : c'est le point le plus fragile de l'OG.
    expect(() => new URL(image ?? "")).not.toThrow();
    expect(image).toMatch(/^https?:\/\//);
  });

  test("Given the home page, When it is loaded, Then the preview image declares its size, type and alt", async ({
    page,
  }) => {
    await page.goto("/");
    expect(Number(await contenuMeta(page, 'meta[property="og:image:width"]'))).toBeGreaterThan(0);
    expect(Number(await contenuMeta(page, 'meta[property="og:image:height"]'))).toBeGreaterThan(0);
    expect(await contenuMeta(page, 'meta[property="og:image:type"]')).toBe("image/png");
    expect((await contenuMeta(page, 'meta[property="og:image:alt"]')) ?? "").not.toHaveLength(0);
  });

  /**
   * ! LE test de non-régression du lot A : le jour où le visuel d'aperçu change (og.md, lot B), des
   * ! dimensions codées en dur mentiraient en silence — le build resterait vert et les cartes seraient
   * ! mal composées. On relit donc l'en-tête IHDR du PNG RÉELLEMENT servi.
   */
  test("Given the home page, When it is loaded, Then the declared dimensions match the served file", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const declaree = {
      largeur: Number(await contenuMeta(page, 'meta[property="og:image:width"]')),
      hauteur: Number(await contenuMeta(page, 'meta[property="og:image:height"]')),
    };

    // ? L'URL est absolue et porte le domaine de production ; la prévisualisation locale, elle, sert
    // ? sur `localhost`. On ne requiert donc que le CHEMIN, qui est commun aux deux.
    const chemin = new URL((await contenuMeta(page, 'meta[property="og:image"]')) ?? "").pathname;
    const reponse = await request.get(chemin);
    expect(reponse.ok()).toBe(true);

    const octets = await reponse.body();
    expect(octets.subarray(1, 4).toString("ascii")).toBe("PNG");
    // En-tête IHDR d'un PNG : largeur et hauteur en big-endian, aux octets 16 et 20.
    expect(octets.readUInt32BE(16)).toBe(declaree.largeur);
    expect(octets.readUInt32BE(20)).toBe(declaree.hauteur);
  });

  test("Given the home page, When it is loaded, Then the preview image is landscape, as the card expects", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const chemin = new URL((await contenuMeta(page, 'meta[property="og:image"]')) ?? "").pathname;
    const octets = await (await request.get(chemin)).body();
    const ratio = octets.readUInt32BE(16) / octets.readUInt32BE(20);

    // ! Le visuel servi était un visuel de POST en 1080×1350 (ratio 0,80), dont `summary_large_image`
    // ! recadrait 58 % — signature et punchline comprises. Ce test verrouille le format paysage (og.md, lot B).
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThanOrEqual(2);
    // Plafond de poids le plus bas parmi les plateformes visées (X : 5 Mo).
    expect(octets.byteLength).toBeLessThan(5 * 1024 * 1024);
  });

  test("Given the home page, When it is loaded, Then the Twitter card is a large summary with an alt", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await contenuMeta(page, 'meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(await contenuMeta(page, 'meta[name="twitter:image"]')).toMatch(/^https?:\/\//);
    expect((await contenuMeta(page, 'meta[name="twitter:image:alt"]')) ?? "").not.toHaveLength(0);
  });

  test("Given the home page, When it is loaded, Then og:url agrees with the canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(await contenuMeta(page, 'meta[property="og:url"]')).toBe(canonical);
  });
});
