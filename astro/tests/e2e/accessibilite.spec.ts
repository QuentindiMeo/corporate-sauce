import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility — home', () => {
	test('no critical/serious axe violation', async ({ page }) => {
		await page.goto('/');
		const resultats = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.analyze();
		const graves = resultats.violations.filter(
			(v) => v.impact === 'critical' || v.impact === 'serious',
		);
		expect(graves).toEqual([]);
	});

	test('the page is in French and has a single h1', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
		await expect(page.locator('h1')).toHaveCount(1);
	});

	test('the skip link is the first focusable element', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const focus = page.locator(':focus');
		await expect(focus).toHaveClass(/skip-link/);
		await expect(focus).toHaveAttribute('href', '#contenu');
	});

	test('cards are reachable and activatable via keyboard', async ({ page }) => {
		await page.goto('/');
		const premiereCarte = page.locator('[data-post-id]').first();
		await premiereCarte.focus();
		await expect(premiereCarte).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(page.locator('[data-post-modal]')).toBeVisible();
	});
});

test.describe('SEO — home', () => {
	test('injects a valid ItemList JSON-LD', async ({ page }) => {
		await page.goto('/');
		const contenu = await page.locator('script[type="application/ld+json"]').textContent();
		const data = JSON.parse(contenu ?? '{}');
		expect(data['@type']).toBe('ItemList');
		expect(Array.isArray(data.itemListElement)).toBe(true);
		expect(data.itemListElement.length).toBeGreaterThan(0);
	});
});
