import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Feature: carousel (fard folder card)", () => {
  test("Given a carousel post, When the thumbnail is rendered, Then it shows a stack of pages and a badge", async ({
    page,
  }) => {
    await page.goto("/");
    const fard = page.locator(".post-card[data-fard]").first();
    await expect(fard).toBeVisible();
    // ? La pile n'affiche que 3 épaisseurs, quel que soit le nombre réel de pages…
    await expect(fard.locator(".fard__page")).toHaveCount(3);
    // ? …et le badge annonce le total réel (« N pages »).
    await expect(fard.locator(".fard__badge")).toHaveText(/\d+\s*pages/);
  });

  test("Given a carousel card, When it is opened and navigated, Then the counter advances (next button and dots)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(".post-card[data-fard] [data-post-id]").first().click();

    const dialog = page.locator("[data-post-modal]");
    await expect(dialog).toBeVisible();
    const counter = dialog.locator("[data-carousel-counter]");
    // ? Compteur « 1 / N » (N = nombre réel de pages, ≥ 2).
    await expect(counter).toHaveText(/^1 \/ \d+$/);

    await dialog.locator("[data-carousel-next]").click();
    await expect(counter).toHaveText(/^2 \/ \d+$/);

    // ? Un point permet d'aller directement à une page.
    await dialog.locator("[data-carousel-dot]").nth(2).click();
    await expect(counter).toHaveText(/^3 \/ \d+$/);
  });

  test("Given an open carousel modal, When it is audited with axe, Then there is no critical or serious violation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(".post-card[data-fard] [data-post-id]").first().click();
    await expect(page.locator("[data-post-modal]")).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(serious).toEqual([]);
  });
});
