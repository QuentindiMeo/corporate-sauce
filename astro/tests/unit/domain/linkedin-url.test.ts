import { describe, expect, it } from 'vitest';
import { createLinkedInUrl, InvalidLinkedInUrlError } from '@domain/linkedin-url';

describe('createLinkedInUrl', () => {
	it('accepts an HTTPS LinkedIn URL', () => {
		const url = 'https://www.linkedin.com/posts/qdm_activity-123';
		expect(createLinkedInUrl(url)).toBe(url);
	});

	it('accepts the bare linkedin.com domain', () => {
		const url = 'https://linkedin.com/feed/update/urn:li:activity:1';
		expect(createLinkedInUrl(url)).toBe(url);
	});

	it('rejects a string that is not a URL', () => {
		expect(() => createLinkedInUrl('pas une url')).toThrow(InvalidLinkedInUrlError);
	});

	it('rejects a non-HTTPS URL', () => {
		expect(() => createLinkedInUrl('http://www.linkedin.com/x')).toThrow(InvalidLinkedInUrlError);
	});

	it('rejects a different domain', () => {
		expect(() => createLinkedInUrl('https://example.com/x')).toThrow(InvalidLinkedInUrlError);
	});

	it('rejects a spoofed domain (linkedin.com.evil.com)', () => {
		expect(() => createLinkedInUrl('https://linkedin.com.evil.com/x')).toThrow(
			InvalidLinkedInUrlError,
		);
	});
});
