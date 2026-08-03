import { describe, expect, it } from 'vitest';
import { MODES } from '@domain/mode';
import { MODE_TOKENS, styleFromMode, SIGNAL_TOKENS } from '@/ui/theme/modes';

describe('MODE_TOKENS', () => {
	it('defines the three charter modes', () => {
		expect(Object.keys(MODE_TOKENS).sort()).toEqual([...MODES].sort());
	});

	it('matches the exact SOMBRE mode tokens (charter §2)', () => {
		expect(MODE_TOKENS.sombre).toMatchObject({
			'--bg': '#120A07',
			'--acc': '#FF5A36',
			'--acc-text': '#FF734F',
			'--acc-ink': '#120A07',
			'--fg': '#F5E9E2',
		});
	});

	it('matches the exact CLAIR mode tokens (charter §2)', () => {
		expect(MODE_TOKENS.clair).toMatchObject({
			'--bg': '#F6ECD4',
			'--acc': '#F5A300',
			'--acc-text': '#8A5A00',
			'--fg': '#221B0E',
		});
	});

	it('includes both LIANT mode accents (charter §2)', () => {
		expect(MODE_TOKENS.liant).toMatchObject({
			'--bg': '#0F1712',
			'--cool': '#4FB07A',
			'--warm': '#F2A65A',
			'--fg': '#E7F0E9',
		});
	});
});

describe('SIGNAL_TOKENS', () => {
	it('exposes the ✓/✕ signal tokens (charter §2)', () => {
		expect(SIGNAL_TOKENS).toMatchObject({
			'--ok-text': '#276039',
			'--bad': '#B23415',
		});
	});
});

describe('styleFromMode', () => {
	it('produces an inline CSS declaration of the mode variables', () => {
		const style = styleFromMode('sombre');
		expect(style).toContain('--bg:#120A07');
		expect(style).toContain('--acc:#FF5A36');
		expect(style.endsWith(';')).toBe(true);
	});

	it('includes all the mode variables', () => {
		const style = styleFromMode('liant');
		for (const [name, value] of Object.entries(MODE_TOKENS.liant)) {
			expect(style).toContain(`${name}:${value}`);
		}
	});
});
