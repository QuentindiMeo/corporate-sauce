import { describe, expect, it } from 'vitest';
import { createLinkedInUrl, InvalidLinkedInUrlError } from '@domain/linkedin-url';

describe('createLinkedInUrl', () => {
	it('accepte une URL LinkedIn en HTTPS', () => {
		const url = 'https://www.linkedin.com/posts/qdm_activity-123';
		expect(createLinkedInUrl(url)).toBe(url);
	});

	it('accepte le domaine nu linkedin.com', () => {
		const url = 'https://linkedin.com/feed/update/urn:li:activity:1';
		expect(createLinkedInUrl(url)).toBe(url);
	});

	it('rejette une chaîne qui n’est pas une URL', () => {
		expect(() => createLinkedInUrl('pas une url')).toThrow(InvalidLinkedInUrlError);
	});

	it('rejette une URL non HTTPS', () => {
		expect(() => createLinkedInUrl('http://www.linkedin.com/x')).toThrow(InvalidLinkedInUrlError);
	});

	it('rejette un autre domaine', () => {
		expect(() => createLinkedInUrl('https://example.com/x')).toThrow(InvalidLinkedInUrlError);
	});

	it('rejette une usurpation de domaine (linkedin.com.evil.com)', () => {
		expect(() => createLinkedInUrl('https://linkedin.com.evil.com/x')).toThrow(
			InvalidLinkedInUrlError,
		);
	});
});
