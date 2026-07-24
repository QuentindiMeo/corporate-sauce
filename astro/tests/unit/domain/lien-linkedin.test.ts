import { describe, expect, it } from 'vitest';
import {
	creerLienLinkedIn,
	LienLinkedInInvalideError,
} from '@domain/lien-linkedin';

describe('creerLienLinkedIn', () => {
	it('accepte une URL LinkedIn en HTTPS', () => {
		const url = 'https://www.linkedin.com/posts/qdm_activity-123';
		expect(creerLienLinkedIn(url)).toBe(url);
	});

	it('accepte le domaine nu linkedin.com', () => {
		const url = 'https://linkedin.com/feed/update/urn:li:activity:1';
		expect(creerLienLinkedIn(url)).toBe(url);
	});

	it('rejette une chaîne qui n’est pas une URL', () => {
		expect(() => creerLienLinkedIn('pas une url')).toThrow(LienLinkedInInvalideError);
	});

	it('rejette une URL non HTTPS', () => {
		expect(() => creerLienLinkedIn('http://www.linkedin.com/x')).toThrow(
			LienLinkedInInvalideError,
		);
	});

	it('rejette un autre domaine', () => {
		expect(() => creerLienLinkedIn('https://example.com/x')).toThrow(
			LienLinkedInInvalideError,
		);
	});

	it('rejette une usurpation de domaine (linkedin.com.evil.com)', () => {
		expect(() => creerLienLinkedIn('https://linkedin.com.evil.com/x')).toThrow(
			LienLinkedInInvalideError,
		);
	});
});
