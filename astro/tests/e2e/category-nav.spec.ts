import { expect, test } from "@playwright/test";

test.describe("Feature: category navbar (scrollspy)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  // ? Le rail des rubriques est celui de la vue par défaut (cf. AnchorRail / MonthNav).
  const categoryLinks = '[data-rail-view="theme"] [data-rail-anchor]';

  test("Given the page loaded at the top, When no scroll has happened, Then the first category is active", async ({
    page,
  }) => {
    await page.goto("/");

    const links = page.locator(categoryLinks);
    await expect(links.first()).toHaveAttribute("aria-current", "true");
    await expect(links.nth(1)).toHaveAttribute("aria-current", "false");
  });

  test("Given a navbar link, When it is clicked, Then it leads to the matching section", async ({ page }) => {
    await page.goto("/");
    const secondLink = page.locator(categoryLinks).nth(1);
    const anchor = await secondLink.getAttribute("data-rail-anchor");

    await secondLink.click();

    // La section ciblée existe et est repérée par son titre.
    await expect(page.locator(`#${anchor}`)).toBeVisible();
  });
});
