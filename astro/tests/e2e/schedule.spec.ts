import { expect, test, type Locator } from '@playwright/test';

/**
 * ! Texte RÉELLEMENT lu à l'écran. `toHaveText` compare le `textContent`, qui inclut le texte
 * ! masqué en CSS : ici les deux mentions coexistent dans le DOM, donc il rendrait
 * ! « À venir — Posté le 5 août 2026 ». `innerText`, lui, respecte `display:none`.
 * ? Il reflète aussi `text-transform: uppercase` (charte §3) — d'où la comparaison en minuscules,
 * ? pour ne pas coupler ces specs à un choix de style.
 */
async function texteVisible(locator: Locator): Promise<string> {
	const brut = await locator.evaluate((element) => (element as HTMLElement).innerText);
	return brut.replace(/\s+/g, ' ').trim().toLocaleLowerCase('fr');
}

/**
 * ? Le site est STATIQUE : l'état « à venir / posté » figé au build se périme dès que 11 h
 * ? (heure de Paris) est franchie. Ces specs figent l'horloge du NAVIGATEUR (`page.clock`)
 * ? de part et d'autre de l'instant de parution et vérifient que l'affichage suit —
 * ? sans rebâtir le site.
 *
 * ! Post témoin : `06-carrousel-06`, publié le 2026-08-05. 11 h Paris = 09:00 UTC (CEST).
 */
const POST = '06-carrousel-06';
const AVANT = new Date('2026-08-05T08:00:00Z'); // 10 h à Paris — pas encore paru
const APRES = new Date('2026-08-05T10:00:00Z'); // 12 h à Paris — paru

const carte = `[data-view-panel="theme"] [data-post-id="${POST}"]`;
const article = `[data-view-panel="theme"] .post-card:has([data-post-id="${POST}"])`;

test.describe('Feature: scheduled state follows the browser clock', () => {
	test("Given the clock is set before 11 h Paris, When the page loads, Then the post shows as still to come", async ({
		page,
	}) => {
		await page.clock.setFixedTime(AVANT);
		await page.goto('/');

		await expect(page.locator(article)).toHaveAttribute('data-scheduled', '');
		await expect(page.locator(`${article} .post-card__scheduled`)).toBeVisible();
		await expect(page.locator(carte)).toHaveAccessibleName(/\(à venir\)$/);
	});

	test('Given the clock is set after 11 h Paris, When the page loads, Then the very same post shows as published', async ({
		page,
	}) => {
		await page.clock.setFixedTime(APRES);
		await page.goto('/');

		await expect(page.locator(article)).not.toHaveAttribute('data-scheduled', '');
		await expect(page.locator(`${article} .post-card__scheduled`)).toBeHidden();
		await expect(page.locator(carte)).toHaveAccessibleName(/\(posté\)$/);
	});

	test('Given a far-future clock, When the page loads, Then no post is scheduled and the counter disappears', async ({
		page,
	}) => {
		await page.clock.setFixedTime(new Date('2030-01-01T12:00:00Z'));
		await page.goto('/');

		await expect(page.locator('[data-scheduled-wrapper]')).toBeHidden();
		await expect(page.locator('.post-card[data-scheduled]')).toHaveCount(0);
	});

	test('Given a far-past clock, When the page loads, Then every post is scheduled and counted', async ({
		page,
	}) => {
		await page.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));
		await page.goto('/');

		await expect(page.locator('[data-scheduled-wrapper]')).toBeVisible();
		// 19 posts, tous à paraître — comptés une fois chacun malgré les deux panneaux.
		await expect(page.locator('[data-scheduled-count]')).toHaveText('19');
	});

	test('Given the modal is opened, Then its mention follows the browser clock too', async ({
		page,
	}) => {
		await page.clock.setFixedTime(AVANT);
		await page.goto('/');
		await page.locator(carte).click();

		const modale = page.locator('[data-post-modal] .modal-post');
		await expect(modale).toBeVisible();
		// ! Le contenu vient d'un <template> inerte : il doit avoir été corrigé lui aussi.
		await expect(modale.locator('[data-when="scheduled"]')).toBeVisible();
		await expect(modale.locator('[data-when="published"]')).toBeHidden();
		// ! `innerText` et non `toHaveText` : ce dernier lit le `textContent`, qui INCLUT le texte
		// ! masqué en CSS (« À venir — Posté le … »). Seul `innerText` dit ce qui est réellement lu.
		expect(await texteVisible(modale.locator('.modal-post__date'))).toBe('à venir — 5 août 2026');
	});

	test('Given the clock is past publication, When the modal is opened, Then it reads « Posté le »', async ({
		page,
	}) => {
		await page.clock.setFixedTime(APRES);
		await page.goto('/');
		await page.locator(carte).click();

		const modale = page.locator('[data-post-modal] .modal-post');
		await expect(modale.locator('[data-when="published"]')).toBeVisible();
		await expect(modale.locator('[data-when="scheduled"]')).toBeHidden();
		expect(await texteVisible(modale.locator('.modal-post__date'))).toBe('posté le 5 août 2026');
	});

	test('Given the publication day, Then the date label is the Paris day whatever the viewer timezone', async ({
		browser,
	}) => {
		// ! Le jour de parution est un fait PARISIEN : il ne doit pas glisser d'un fuseau à l'autre.
		const contexte = await browser.newContext({ timezoneId: 'Pacific/Honolulu' });
		const page = await contexte.newPage();
		await page.clock.setFixedTime(APRES);
		await page.goto('/');
		await page.locator(carte).click();

		// À Honolulu (UTC−10), l'instant 10:00Z du 5 août est encore le 4 août local : le libellé
		// ne doit pas pour autant reculer d'un jour.
		const date = page.locator('[data-post-modal] .modal-post__date');
		expect(await texteVisible(date)).toBe('posté le 5 août 2026');
		await expect(date).toHaveAttribute('datetime', '2026-08-05');
		await contexte.close();
	});
});

test.describe('Feature: scheduled state without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('Given JS is disabled, When the page loads, Then CSS alone shows exactly one state per card', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(page.locator('.post-card').first()).toBeVisible();

		// ! L'assertion qui compte, et qui ne dépend PAS de la date du build : la pastille n'est
		// ! visible que sur les cartes marquées. Si le CSS lâchait, les 38 pastilles s'afficheraient.
		const marquees = await page.locator('[data-view-panel="theme"] .post-card[data-scheduled]').count();
		const visibles = await page
			.locator('[data-view-panel="theme"] .post-card__scheduled:visible')
			.count();
		expect(visibles).toBe(marquees);

		// Et le repli rendu au build reste cohérent avec ce marquage.
		const compteur = page.locator('[data-scheduled-count]');
		expect(Number(await compteur.textContent())).toBe(marquees);
	});
});
