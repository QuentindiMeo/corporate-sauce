import { describe, expect, it } from 'vitest';

import {
	PUBLICATION_HOUR,
	PUBLICATION_TIME_ZONE,
	publicationInstant,
} from '@domain/publication-time';

/**
 * ! Règle métier : un post QDM paraît à 11 h, heure de Paris. `posts.json` ne porte
 * ! que le JOUR ; l'instant réel dépend donc de l'heure d'été (CEST, +02:00) ou
 * ! d'hiver (CET, +01:00) en vigueur ce jour-là.
 */
describe('Feature: publication instant (11 h, heure de Paris)', () => {
	it('Given the business rule, Then the hour and the time zone are explicit', () => {
		expect(PUBLICATION_HOUR).toBe(11);
		expect(PUBLICATION_TIME_ZONE).toBe('Europe/Paris');
	});

	it('Given a summer day, When the instant is resolved, Then it is 09:00 UTC (CEST, +02:00)', () => {
		expect(publicationInstant('2026-07-21').toISOString()).toBe('2026-07-21T09:00:00.000Z');
		expect(publicationInstant('2026-09-02').toISOString()).toBe('2026-09-02T09:00:00.000Z');
	});

	it('Given a winter day, When the instant is resolved, Then it is 10:00 UTC (CET, +01:00)', () => {
		expect(publicationInstant('2026-01-15').toISOString()).toBe('2026-01-15T10:00:00.000Z');
		expect(publicationInstant('2026-12-01').toISOString()).toBe('2026-12-01T10:00:00.000Z');
	});

	it('Given the spring-forward day, When the instant is resolved, Then summer time already applies at 11 h', () => {
		// ? 2026-03-29 : bascule à 02:00 → 03:00. À 11 h, on est déjà en +02:00.
		expect(publicationInstant('2026-03-29').toISOString()).toBe('2026-03-29T09:00:00.000Z');
		expect(publicationInstant('2026-03-28').toISOString()).toBe('2026-03-28T10:00:00.000Z');
	});

	it('Given the fall-back day, When the instant is resolved, Then winter time already applies at 11 h', () => {
		// ? 2026-10-25 : bascule à 03:00 → 02:00. À 11 h, on est déjà en +01:00.
		expect(publicationInstant('2026-10-25').toISOString()).toBe('2026-10-25T10:00:00.000Z');
		expect(publicationInstant('2026-10-24').toISOString()).toBe('2026-10-24T09:00:00.000Z');
	});

	it('Given a resolved instant, Then it really reads 11 h in Paris', () => {
		// Contrôle indépendant du calcul : on relit l'instant DANS le fuseau cible.
		const heureParis = (iso: string) =>
			new Intl.DateTimeFormat('fr-FR', {
				timeZone: PUBLICATION_TIME_ZONE,
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			}).format(publicationInstant(iso));

		for (const day of ['2026-01-15', '2026-03-29', '2026-07-21', '2026-10-25', '2026-12-01']) {
			expect(heureParis(day)).toBe('11:00');
		}
	});

	it('Given a malformed day, When the instant is resolved, Then it is rejected', () => {
		expect(() => publicationInstant('21/07/2026')).toThrow();
		expect(() => publicationInstant('2026-07')).toThrow();
		expect(() => publicationInstant('2026-13-01')).toThrow();
		expect(() => publicationInstant('')).toThrow();
	});
});
