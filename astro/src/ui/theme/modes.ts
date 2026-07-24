import type { Mode } from '@domain/mode';

/**
 * Jetons de couleur des trois modes de la charte QDM (§2), source de vérité unique.
 * Appliqués en variables CSS inline sur le conteneur d'un post (via {@link styleFromMode})
 * pour garantir l'application sans dépendre d'une feuille de style externe.
 */
export const MODE_TOKENS: Record<Mode, Record<string, string>> = {
	// SOMBRE — Rust : accroche / opinion tranchée.
	sombre: {
		'--bg': '#120A07',
		'--panel': 'rgba(255,90,54,.05)',
		'--border': '#331c14',
		'--acc': '#FF5A36',
		'--acc-text': '#FF734F',
		'--acc-ink': '#120A07',
		'--fg': '#F5E9E2',
		'--muted': '#b09a8b',
		'--kicker': '#c9b3a3',
		'--glow': 'rgba(255,90,54,.26)',
	},
	// CLAIR — Ambre : pédagogie / comparaison.
	clair: {
		'--bg': '#F6ECD4',
		'--panel': '#EEE1BE',
		'--border': '#D9C79A',
		'--acc': '#F5A300',
		'--acc-text': '#8A5A00',
		'--acc-ink': '#2a1c00',
		'--fg': '#221B0E',
		'--muted': '#63563b',
	},
	// LIANT — Forêt & Abricot : collaboration inter-métiers (deux accents).
	liant: {
		'--bg': '#0F1712',
		'--panel': 'rgba(79,176,122,.06)',
		'--border': '#1D2B23',
		'--cool': '#4FB07A',
		'--cool-text': '#6BC291',
		'--warm': '#F2A65A',
		'--warm-text': '#F5B778',
		'--ink': '#0F1712',
		'--fg': '#E7F0E9',
		'--muted': '#8DA697',
	},
};

/** Jetons de signal sémantique ✓/✕, communs aux trois modes (charte §2). */
export const SIGNAL_TOKENS: Record<string, string> = {
	'--ok': '#2E6A46',
	'--ok-text': '#276039',
	'--bad': '#B23415',
};

/** Déclaration CSS inline des variables d'un mode : `"--bg:#120A07;--panel:…;"`. */
export function styleFromMode(mode: Mode): string {
	return Object.entries(MODE_TOKENS[mode])
		.map(([nom, valeur]) => `${nom}:${valeur}`)
		.join(';')
		.concat(';');
}
