import { expect, test } from '@playwright/test';

test.describe('Navbar des rubriques (scrollspy)', () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test('au chargement en haut de page, la première rubrique est active', async ({ page }) => {
		await page.goto('/');

		const links = page.locator('[data-nav-category]');
		await expect(links.first()).toHaveAttribute('aria-current', 'true');
		await expect(links.nth(1)).toHaveAttribute('aria-current', 'false');
	});

	test('l’ancre mène à la section correspondante', async ({ page }) => {
		await page.goto('/');
		const secondLink = page.locator('[data-nav-category]').nth(1);
		const slug = await secondLink.getAttribute('data-nav-category');

		await secondLink.click();

		// La section ciblée existe et est repérée par son titre.
		await expect(page.locator(`#category-${slug}`)).toBeVisible();
	});
});
