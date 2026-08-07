import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Feature: post modal", () => {
  test("Given the home page, When a card is clicked, Then the modal opens", async ({ page }) => {
    await page.goto("/");
    const dialog = page.locator("[data-post-modal]");
    await expect(dialog).toBeHidden();

    await page.locator("[data-post-id]").first().click();

    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".modal-post__title")).toBeVisible();
    await expect(dialog.getByRole("link", { name: /LinkedIn/ })).toBeVisible();
  });

  test("Given an open modal, When Escape is pressed, Then it closes and focus returns to the card", async ({
    page,
  }) => {
    await page.goto("/");
    const carte = page.locator("[data-post-id]").first();
    await carte.click();

    const dialog = page.locator("[data-post-modal]");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(dialog).toBeHidden();
    await expect(carte).toBeFocused();
  });

  test("Given an open modal, When the backdrop is clicked, Then it closes", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-post-id]").first().click();
    const dialog = page.locator("[data-post-modal]");
    await expect(dialog).toBeVisible();

    // Clic sur l'arrière-plan (::backdrop) : un point du viewport hors de la boîte du dialog.
    await page.mouse.click(5, 5);

    await expect(dialog).toBeHidden();
  });

  test("Given an open modal, When it is audited with axe, Then there is no critical or serious violation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("[data-post-id]").first().click();
    await expect(page.locator("[data-post-modal]")).toBeVisible();

    const resultats = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

    const graves = resultats.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(graves).toEqual([]);
  });
});
