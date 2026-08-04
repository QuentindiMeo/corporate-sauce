import { describe, expect, it } from 'vitest';
import { CATEGORIES, isCategory } from '@domain/category';
import { isDarkMode, isMode, MODES } from '@domain/mode';

describe('Feature: category vocabulary', () => {
	it('Given the category list, Then the 7 categories are exposed in display order', () => {
		expect(CATEGORIES).toEqual(['PERF', 'A11Y', 'DX', 'UI', 'ARCHI', 'HTML', 'COLLAB']);
	});

	it('Given a candidate string, When it is checked, Then a known category is accepted and an unknown one rejected', () => {
		expect(isCategory('PERF')).toBe(true);
		expect(isCategory('perf')).toBe(false);
		expect(isCategory('AUTRE')).toBe(false);
	});
});

describe('Feature: mode vocabulary', () => {
	it('Given the mode list, Then the 3 charter modes are exposed', () => {
		expect(MODES).toEqual(['sombre', 'clair', 'liant']);
	});

	it('Given a candidate string, When it is checked, Then a known mode is accepted and an unknown one rejected', () => {
		expect(isMode('liant')).toBe(true);
		expect(isMode('LIANT')).toBe(false);
		expect(isMode('bleu')).toBe(false);
	});

	it('Given a mode, When it is classified, Then sombre and liant are dark and clair is light', () => {
		expect(isDarkMode('sombre')).toBe(true);
		expect(isDarkMode('liant')).toBe(true);
		expect(isDarkMode('clair')).toBe(false);
	});
});
