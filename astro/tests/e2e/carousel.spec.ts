import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Carousel (fard folder card)', () => {
	test('the carousel thumbnail shows a stack of pages + badge', async ({ page }) => {
		await page.goto('/');
		const fard = page.locator('.post-card[data-fard]').first();
		await expect(fard).toBeVisible();
		await expect(fard.locator('.fard__page')).toHaveCount(3);
		await expect(fard.locator('.fard__badge')).toHaveText(/3\s*pages/);
	});

	test('the modal opens a navigable carousel (next + counter)', async ({ page }) => {
		await page.goto('/');
		await page.locator('.post-card[data-fard] [data-post-id]').first().click();

		const dialog = page.locator('[data-post-modal]');
		await expect(dialog).toBeVisible();
		const counter = dialog.locator('[data-carousel-counter]');
		await expect(counter).toHaveText('1 / 3');

		await dialog.locator('[data-carousel-next]').click();
		await expect(counter).toHaveText('2 / 3');

		// Un point permet d'aller directement à une page.
		await dialog.locator('[data-carousel-dot]').nth(2).click();
		await expect(counter).toHaveText('3 / 3');
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
