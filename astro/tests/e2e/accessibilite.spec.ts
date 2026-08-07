import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Feature: home accessibility", () => {
  test("Given the home page, When it is audited with axe, Then there is no critical or serious violation", async ({
    page,
  }) => {
    await page.goto("/");
    const resultats = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const graves = resultats.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(graves).toEqual([]);
  });

  test("Given the home page, When it is loaded, Then it is in French and has a single h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("Given the home page, When Tab is pressed, Then the skip link is the first focusable element", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focus = page.locator(":focus");
    await expect(focus).toHaveClass(/skip-link/);
    await expect(focus).toHaveAttribute("href", "#contenu");
  });

  test("Given the home page, When a card is focused and Enter is pressed, Then the modal opens", async ({ page }) => {
    await page.goto("/");
    const premiereCarte = page.locator("[data-post-id]").first();
    await premiereCarte.focus();
    await expect(premiereCarte).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("[data-post-modal]")).toBeVisible();
  });
});

test.describe("Feature: home SEO", () => {
  test("Given the home page, When it is loaded, Then a valid ItemList JSON-LD is injected", async ({ page }) => {
    await page.goto("/");
    const contenu = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(contenu ?? "{}");
    expect(data["@type"]).toBe("ItemList");
    expect(Array.isArray(data.itemListElement)).toBe(true);
    expect(data.itemListElement.length).toBeGreaterThan(0);
  });
});
