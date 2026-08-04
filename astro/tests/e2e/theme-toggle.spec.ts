import { expect, test } from '@playwright/test';

test.describe('Feature: theme toggle (chrome)', () => {
	test('Given the home page, When the toggle is clicked, Then data-theme flips and aria-pressed updates', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		const bouton = page.locator('[data-theme-toggle]');

		const initial = await html.getAttribute('data-theme');
		expect(initial).toMatch(/^(light|dark)$/);

		await bouton.click();

		const bascule = initial === 'light' ? 'dark' : 'light';
		await expect(html).toHaveAttribute('data-theme', bascule);
		await expect(bouton).toHaveAttribute('aria-pressed', String(bascule === 'light'));
	});

	test('Given a toggled theme, When the page is reloaded, Then the choice persists', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		const bouton = page.locator('[data-theme-toggle]');

		const initial = await html.getAttribute('data-theme');
		await bouton.click();
		const choisi = initial === 'light' ? 'dark' : 'light';
		await expect(html).toHaveAttribute('data-theme', choisi);

		await page.reload();
		await expect(html).toHaveAttribute('data-theme', choisi);
	});
});
