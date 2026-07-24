import { describe, expect, it } from 'vitest';
import { estMode, MODES } from '@domain/mode';
import { estRubrique, RUBRIQUES } from '@domain/rubrique';

describe('rubrique', () => {
	it('expose les 7 rubriques dans l’ordre d’affichage', () => {
		expect(RUBRIQUES).toEqual(['PERF', 'A11Y', 'DX', 'UI', 'ARCHI', 'HTML', 'COLLAB']);
	});

	it('valide une rubrique connue et rejette l’inconnue', () => {
		expect(estRubrique('PERF')).toBe(true);
		expect(estRubrique('perf')).toBe(false);
		expect(estRubrique('AUTRE')).toBe(false);
	});
});

describe('mode', () => {
	it('expose les 3 modes de la charte', () => {
		expect(MODES).toEqual(['sombre', 'clair', 'liant']);
	});

	it('valide un mode connu et rejette l’inconnu', () => {
		expect(estMode('liant')).toBe(true);
		expect(estMode('LIANT')).toBe(false);
		expect(estMode('bleu')).toBe(false);
	});
});
