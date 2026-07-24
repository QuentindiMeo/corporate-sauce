import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Modale de post', () => {
	test('ouvre la modale au clic sur une carte', async ({ page }) => {
		await page.goto('/');
		const dialog = page.locator('[data-post-modal]');
		await expect(dialog).toBeHidden();

		await page.locator('[data-post-id]').first().click();

		await expect(dialog).toBeVisible();
		await expect(dialog.locator('.modal-post__titre')).toBeVisible();
		await expect(dialog.getByRole('link', { name: /LinkedIn/ })).toBeVisible();
	});

	test('ferme la modale avec Échap et restaure le focus sur la carte', async ({ page }) => {
		await page.goto('/');
		const carte = page.locator('[data-post-id]').first();
		await carte.click();

		const dialog = page.locator('[data-post-modal]');
		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(dialog).toBeHidden();
		await expect(carte).toBeFocused();
	});

	test('ferme la modale au clic sur l’arrière-plan', async ({ page }) => {
		await page.goto('/');
		await page.locator('[data-post-id]').first().click();
		const dialog = page.locator('[data-post-modal]');
		await expect(dialog).toBeVisible();

		// Clic sur l'arrière-plan (::backdrop) : un point du viewport hors de la boîte du dialog.
		await page.mouse.click(5, 5);

		await expect(dialog).toBeHidden();
	});

	test('aucune violation axe critique/sérieuse, modale ouverte', async ({ page }) => {
		await page.goto('/');
		await page.locator('[data-post-id]').first().click();
		await expect(page.locator('[data-post-modal]')).toBeVisible();

		const resultats = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.analyze();

		const graves = resultats.violations.filter(
			(v) => v.impact === 'critical' || v.impact === 'serious',
		);
		expect(graves).toEqual([]);
	});
});
