/**
 * Les trois modes de la charte QDM (§1) :
 * - `sombre` (Rust) : accroche / opinion tranchée, chiffre-choc ;
 * - `clair` (Ambre) : pédagogie / comparaison, bonne vs mauvaise pratique ;
 * - `liant` (Forêt & Abricot) : collaboration inter-métiers.
 */
export const MODES = ['sombre', 'clair', 'liant'] as const;

export type Mode = (typeof MODES)[number];

export function estMode(valeur: string): valeur is Mode {
	return (MODES as readonly string[]).includes(valeur);
}
