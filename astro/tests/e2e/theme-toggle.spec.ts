import { expect, test } from '@playwright/test';

test.describe('Bascule de thème (chrome)', () => {
	test('le clic bascule data-theme et met à jour aria-pressed', async ({ page }) => {
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

	test('le choix persiste après rechargement', async ({ page }) => {
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
