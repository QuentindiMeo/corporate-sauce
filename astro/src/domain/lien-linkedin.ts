/**
 * Value object : une URL de post LinkedIn valide.
 * Type « branded » — on ne peut en obtenir un que via {@link creerLienLinkedIn},
 * ce qui garantit qu'un `LienLinkedIn` est toujours une URL LinkedIn en HTTPS.
 */
export type LienLinkedIn = string & { readonly __brand: 'LienLinkedIn' };

export class LienLinkedInInvalideError extends Error {
	constructor(valeur: string) {
		super(`Lien LinkedIn invalide : « ${valeur} »`);
		this.name = 'LienLinkedInInvalideError';
	}
}

export function creerLienLinkedIn(valeur: string): LienLinkedIn {
	let url: URL;
	try {
		url = new URL(valeur);
	} catch {
		throw new LienLinkedInInvalideError(valeur);
	}

	if (url.protocol !== 'https:') {
		throw new LienLinkedInInvalideError(valeur);
	}

	const hote = url.hostname.toLowerCase();
	if (hote !== 'linkedin.com' && !hote.endsWith('.linkedin.com')) {
		throw new LienLinkedInInvalideError(valeur);
	}

	return valeur as LienLinkedIn;
}
