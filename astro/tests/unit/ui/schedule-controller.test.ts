// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';

import { cardAriaLabel, initSchedule } from '@/ui/schedule/schedule-controller';

/**
 * ? Le site est statique : l'état « à venir / posté » figé au build se périme.
 * ? Ce contrôleur le recalcule dans le navigateur, à l'heure du visiteur.
 * ! `now` est toujours injecté (jamais `new Date()` ici) pour que les tests soient déterministes.
 */

// 11 h Paris le 5 août 2026 (CEST) = 09:00 UTC.
const PARU = '2026-08-05T09:00:00.000Z';
// 11 h Paris le 7 août 2026 = 09:00 UTC.
const A_VENIR = '2026-08-07T09:00:00.000Z';

beforeEach(() => {
	document.body.innerHTML = `
		<p class="intro__meta">
			19 posts<span data-scheduled-wrapper hidden> (<span data-scheduled-count>0</span> à pourvoir)</span>
		</p>
		<article class="post-card" id="carte-paru" data-published-at="${PARU}">
			<a data-post-id="p1" data-aria-base="Ouvrir le post « Paru »" aria-label="Ouvrir le post « Paru » (posté)">
				<span class="post-card__scheduled">À venir</span>
			</a>
		</article>
		<article class="post-card" id="carte-a-venir" data-published-at="${A_VENIR}">
			<a data-post-id="p2" data-aria-base="Ouvrir le carrousel « À venir »" aria-label="Ouvrir le carrousel « À venir » (posté)">
				<span class="post-card__scheduled">À venir</span>
			</a>
		</article>
		<template data-post-template="p1" data-post-at="${PARU}">
			<article class="modal-post" data-published-at="${PARU}"><time datetime="2026-08-05">…</time></article>
		</template>
		<template data-post-template="p2" data-post-at="${A_VENIR}">
			<article class="modal-post" data-published-at="${A_VENIR}"><time datetime="2026-08-07">…</time></article>
		</template>`;
});

const carte = (id: string) => document.querySelector(`#${id}`) as HTMLElement;
const lien = (id: string) => carte(id).querySelector('a') as HTMLAnchorElement;
const gabarit = (id: string) =>
	document.querySelector(`template[data-post-template="${id}"]`) as HTMLTemplateElement;

describe('Feature: schedule controller — cards', () => {
	it('Given a post already out, When the schedule is applied, Then its card is not marked scheduled', () => {
		initSchedule(document, new Date('2026-08-06T12:00:00Z'));

		expect(carte('carte-paru').hasAttribute('data-scheduled')).toBe(false);
	});

	it('Given a post still to come, When the schedule is applied, Then its card is marked scheduled', () => {
		initSchedule(document, new Date('2026-08-06T12:00:00Z'));

		expect(carte('carte-a-venir').hasAttribute('data-scheduled')).toBe(true);
	});

	it('Given a build-time state now stale, When the schedule is applied, Then it is corrected', () => {
		// Le HTML arrive « posté » pour les deux (état du build) ; à cet instant, les deux sont à venir.
		initSchedule(document, new Date('2026-08-01T00:00:00Z'));

		expect(carte('carte-paru').hasAttribute('data-scheduled')).toBe(true);
		expect(carte('carte-a-venir').hasAttribute('data-scheduled')).toBe(true);
	});

	it('Given the exact publication instant, When the schedule is applied, Then the post counts as out', () => {
		initSchedule(document, new Date(PARU));

		expect(carte('carte-paru').hasAttribute('data-scheduled')).toBe(false);
	});

	it('Given a card, When its state changes, Then its accessible name follows', () => {
		initSchedule(document, new Date('2026-08-06T12:00:00Z'));

		expect(lien('carte-paru').getAttribute('aria-label')).toBe('Ouvrir le post « Paru » (posté)');
		expect(lien('carte-a-venir').getAttribute('aria-label')).toBe(
			'Ouvrir le carrousel « À venir » (à venir)',
		);
	});
});

describe('Feature: schedule controller — modal templates', () => {
	it('Given inert template content, When the schedule is applied, Then it is corrected too', () => {
		// ! `template.content` est inerte : il échappe à document.querySelectorAll.
		initSchedule(document, new Date('2026-08-06T12:00:00Z'));

		const dedans = (id: string) =>
			gabarit(id).content.querySelector('[data-published-at]') as HTMLElement;
		expect(dedans('p1').hasAttribute('data-scheduled')).toBe(false);
		expect(dedans('p2').hasAttribute('data-scheduled')).toBe(true);
	});
});

describe('Feature: schedule controller — intro counter', () => {
	it('Given posts still to come, When the schedule is applied, Then the counter shows how many', () => {
		initSchedule(document, new Date('2026-08-06T12:00:00Z'));

		expect(document.querySelector('[data-scheduled-count]')?.textContent).toBe('1');
		expect(document.querySelector('[data-scheduled-wrapper]')?.hasAttribute('hidden')).toBe(false);
	});

	it('Given every post is out, When the schedule is applied, Then the counter is hidden', () => {
		initSchedule(document, new Date('2027-01-01T00:00:00Z'));

		expect(document.querySelector('[data-scheduled-wrapper]')?.hasAttribute('hidden')).toBe(true);
	});

	it('Given duplicated cards across both views, When counting, Then each post counts once', () => {
		// ? Les vignettes sont rendues deux fois (vue rubrique + vue date) : le comptage
		// ? s'appuie sur les <template> (un par post), pas sur les cartes.
		initSchedule(document, new Date('2026-08-01T00:00:00Z'));

		expect(document.querySelector('[data-scheduled-count]')?.textContent).toBe('2');
	});
});

describe('Feature: schedule controller — robustness', () => {
	it('Given a malformed date attribute, When the schedule is applied, Then the element is left alone', () => {
		document.body.innerHTML = `<article id="x" data-published-at="pas-une-date"></article>`;

		expect(() => initSchedule(document, new Date('2026-08-06T12:00:00Z'))).not.toThrow();
		expect(carte('x').hasAttribute('data-scheduled')).toBe(false);
	});

	it('Given a page without any schedule markup, When the schedule is applied, Then nothing breaks', () => {
		document.body.innerHTML = `<p>rien</p>`;

		expect(() => initSchedule(document, new Date('2026-08-06T12:00:00Z'))).not.toThrow();
	});
});

describe('Feature: accessible name composition', () => {
	it('Given a base label, When the state is applied, Then the mention is appended', () => {
		expect(cardAriaLabel('Ouvrir le post « X »', true)).toBe('Ouvrir le post « X » (à venir)');
		expect(cardAriaLabel('Ouvrir le post « X »', false)).toBe('Ouvrir le post « X » (posté)');
	});
});
