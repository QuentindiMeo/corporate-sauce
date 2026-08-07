import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const themePanel = '[data-view-panel="theme"]';
const datePanel = '[data-view-panel="date"]';
// Les deux états du bouton sont dans le HTML ; CSS n'en montre que celui de la vue active.
const themeState = '[data-view-toggle] [data-view-state="theme"]';
const dateState = '[data-view-toggle] [data-view-state="date"]';

test.describe("Feature: gallery view toggle (theme ⇄ date)", () => {
  test("Given a first visit, When the page loads, Then the gallery opens by category", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-view", "theme");
    await expect(page.locator(themePanel)).toBeVisible();
    await expect(page.locator(datePanel)).toBeHidden();
    // Le bouton affiche l'état courant : « Par rubrique ».
    await expect(page.locator(themeState)).toBeVisible();
    await expect(page.locator(dateState)).toBeHidden();
  });

  test("Given the category view, When the toggle is clicked, Then the date flow replaces it", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("[data-view-toggle]");

    await toggle.click();

    await expect(page.locator("html")).toHaveAttribute("data-view", "date");
    await expect(page.locator(datePanel)).toBeVisible();
    await expect(page.locator(themePanel)).toBeHidden();
  });

  test("Given the toggle, When the view switches, Then its icon and label follow the active view", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("[data-view-toggle]");

    await expect(toggle).toHaveAccessibleName(/^Par rubrique/);
    await expect(page.locator(`${themeState} .view-toggle__icon--rows`)).toBeVisible();

    await toggle.click();

    await expect(page.locator(dateState)).toBeVisible();
    await expect(page.locator(themeState)).toBeHidden();
    await expect(page.locator(`${dateState} .view-toggle__icon--calendar`)).toBeVisible();
    // ? Le nom accessible suit : état courant, puis action.
    await expect(toggle).toHaveAccessibleName(/^Par date/);
    await expect(toggle).toHaveAccessibleName(/rubrique$/);
  });

  test("Given the date view, When the toggle is clicked again, Then the category view comes back", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("[data-view-toggle]");

    await toggle.click();
    await toggle.click();

    await expect(page.locator("html")).toHaveAttribute("data-view", "theme");
    await expect(page.locator(themePanel)).toBeVisible();
  });

  test("Given a chosen view, When the page is reloaded, Then the choice persists", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();
    await expect(page.locator("html")).toHaveAttribute("data-view", "date");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-view", "date");
    await expect(page.locator(datePanel)).toBeVisible();
    // ? Le libellé du bouton est juste dès le premier rendu : rendu au build, choisi par CSS, donc aucun clignotement « Par rubrique » avant que le script ne s'exécute.
    await expect(page.locator(dateState)).toBeVisible();
    await expect(page.locator(themeState)).toBeHidden();
  });

  test("Given the toggle, When it is focused and Enter is pressed, Then the view switches (keyboard)", async ({
    page,
  }) => {
    await page.goto("/");
    const toggle = page.locator("[data-view-toggle]");

    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveAttribute("data-view", "date");
  });

  test("Given the toggle, When the view switches, Then the change is announced politely", async ({ page }) => {
    await page.goto("/");
    const status = page.locator("[data-view-status]");

    // ? Rien n'est annoncé au chargement : le visiteur n'a rien changé.
    await expect(status).toHaveText("");

    await page.locator("[data-view-toggle]").click();
    await expect(status).toHaveText(/par date/i);
    await expect(status).toHaveAttribute("aria-live", "polite");
  });

  test("Given the date view, When a card is clicked, Then the modal still opens", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();

    await page.locator(`${datePanel} [data-post-id]`).first().click();

    await expect(page.locator("[data-post-modal]")).toBeVisible();
  });

  test("Given the date view, When it is audited with axe, Then there is no critical or serious violation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();
    await expect(page.locator(datePanel)).toBeVisible();

    const resultats = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const graves = resultats.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(graves).toEqual([]);
  });
});

test.describe("Feature: month rail (date view)", () => {
  // ? Le rail ne s'affiche qu'avec assez de gouttière latérale (cf. AnchorRail).
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Given the category view, When the page loads, Then only the category rail is shown", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('[data-rail-view="theme"]')).toBeVisible();
    await expect(page.locator('[data-rail-view="date"]')).toBeHidden();
  });

  test("Given the date view, When it is active, Then the rail switches to months", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();

    await expect(page.locator('[data-rail-view="date"]')).toBeVisible();
    await expect(page.locator('[data-rail-view="theme"]')).toBeHidden();
  });

  test("Given the month rail, When the page is at the top, Then the first month is current", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();

    const links = page.locator('[data-rail-view="date"] [data-rail-anchor]');
    await expect(links.first()).toHaveAttribute("aria-current", "true");
  });

  test("Given a month rail link, When it is clicked, Then it leads to the matching month section", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();

    const link = page.locator('[data-rail-view="date"] [data-rail-anchor]').first();
    const anchor = await link.getAttribute("data-rail-anchor");
    await link.click();

    await expect(page.locator(`#${anchor}`)).toBeVisible();
  });
});
