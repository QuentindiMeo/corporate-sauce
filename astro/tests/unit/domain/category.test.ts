import { describe, expect, it } from 'vitest';
import { CATEGORIES, isCategory } from '@domain/category';
import { isDarkMode, isMode, MODES } from '@domain/mode';

describe('category', () => {
	it('expose les 7 rubriques dans l’ordre d’affichage', () => {
		expect(CATEGORIES).toEqual(['PERF', 'A11Y', 'DX', 'UI', 'ARCHI', 'HTML', 'COLLAB']);
	});

	it('valide une rubrique connue et rejette l’inconnue', () => {
		expect(isCategory('PERF')).toBe(true);
		expect(isCategory('perf')).toBe(false);
		expect(isCategory('AUTRE')).toBe(false);
	});
});

describe('mode', () => {
	it('expose les 3 modes de la charte', () => {
		expect(MODES).toEqual(['sombre', 'clair', 'liant']);
	});

	it('valide un mode connu et rejette l’inconnu', () => {
		expect(isMode('liant')).toBe(true);
		expect(isMode('LIANT')).toBe(false);
		expect(isMode('bleu')).toBe(false);
	});

	it('classe sombre et liant en dark, clair en light', () => {
		expect(isDarkMode('sombre')).toBe(true);
		expect(isDarkMode('liant')).toBe(true);
		expect(isDarkMode('clair')).toBe(false);
	});
});
