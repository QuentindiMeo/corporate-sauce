import { describe, expect, it } from 'vitest';

import { formatPublicationDate, toIsoDate } from '@/ui/format/date';

describe('Feature: publication date formatting', () => {
	it('Given a publication date, When it is formatted, Then it reads as a long French date', () => {
		expect(formatPublicationDate(new Date('2026-07-21T00:00:00Z'))).toBe('21 juillet 2026');
	});

	it('Given a date in a month with an accent, Then the French month name is preserved', () => {
		expect(formatPublicationDate(new Date('2026-08-04T00:00:00Z'))).toBe('4 août 2026');
	});

	it('Given a date at UTC midnight, Then it is not shifted a day backwards by the local timezone', () => {
		// Régression : sans `timeZone: 'UTC'`, un fuseau négatif rendait « 20 juillet ».
		expect(formatPublicationDate(new Date('2026-07-21T00:00:00Z'))).toContain('21');
		expect(toIsoDate(new Date('2026-07-21T00:00:00Z'))).toBe('2026-07-21');
	});

	it('Given a date, When the machine form is built, Then it is a bare ISO day', () => {
		expect(toIsoDate(new Date('2026-09-02T00:00:00Z'))).toBe('2026-09-02');
	});
});
