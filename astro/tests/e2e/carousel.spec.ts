import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Carousel (fard folder card)', () => {
	test('the carousel thumbnail shows a stack of pages + badge', async ({ page }) => {
		await page.goto('/');
		const fard = page.locator('.post-card[data-fard]').first();
		await expect(fard).toBeVisible();
		// ? La pile n'affiche que 3 épaisseurs, quel que soit le nombre réel de pages…
		await expect(fard.locator('.fard__page')).toHaveCount(3);
		// ? …et le badge annonce le total réel (« N pages »).
		await expect(fard.locator('.fard__badge')).toHaveText(/\d+\s*pages/);
	});

	test('the modal opens a navigable carousel (next + counter)', async ({ page }) => {
		await page.goto('/');
		await page.locator('.post-card[data-fard] [data-post-id]').first().click();

		const dialog = page.locator('[data-post-modal]');
		await expect(dialog).toBeVisible();
		const counter = dialog.locator('[data-carousel-counter]');
		// ? Compteur « 1 / N » (N = nombre réel de pages, ≥ 2).
		await expect(counter).toHaveText(/^1 \/ \d+$/);

		await dialog.locator('[data-carousel-next]').click();
		await expect(counter).toHaveText(/^2 \/ \d+$/);

		// ? Un point permet d'aller directement à une page.
		await dialog.locator('[data-carousel-dot]').nth(2).click();
		await expect(counter).toHaveText(/^3 \/ \d+$/);
	});

	test('no critical/serious axe violation with the carousel open', async ({ page }) => {
		await page.goto('/');
		await page.locator('.post-card[data-fard] [data-post-id]').first().click();
		await expect(page.locator('[data-post-modal]')).toBeVisible();

		const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
		const serious = results.violations.filter(
			(v) => v.impact === 'critical' || v.impact === 'serious',
		);
		expect(serious).toEqual([]);
	});
});
