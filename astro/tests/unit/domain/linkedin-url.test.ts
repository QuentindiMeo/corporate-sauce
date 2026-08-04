import { describe, expect, it } from 'vitest';
import { createLinkedInUrl, InvalidLinkedInUrlError } from '@domain/linkedin-url';

describe('Feature: LinkedIn URL value object', () => {
	it('Given an HTTPS LinkedIn URL, When it is created, Then it is accepted', () => {
		const url = 'https://www.linkedin.com/posts/qdm_activity-123';
		expect(createLinkedInUrl(url)).toBe(url);
	});

	it('Given a bare linkedin.com URL, When it is created, Then it is accepted', () => {
		const url = 'https://linkedin.com/feed/update/urn:li:activity:1';
		expect(createLinkedInUrl(url)).toBe(url);
	});

	it('Given a non-URL string, When it is created, Then it is rejected', () => {
		expect(() => createLinkedInUrl('pas une url')).toThrow(InvalidLinkedInUrlError);
	});

	it('Given a non-HTTPS URL, When it is created, Then it is rejected', () => {
		expect(() => createLinkedInUrl('http://www.linkedin.com/x')).toThrow(InvalidLinkedInUrlError);
	});

	it('Given a non-LinkedIn domain, When it is created, Then it is rejected', () => {
		expect(() => createLinkedInUrl('https://example.com/x')).toThrow(InvalidLinkedInUrlError);
	});

	it('Given a spoofed domain (linkedin.com.evil.com), When it is created, Then it is rejected', () => {
		expect(() => createLinkedInUrl('https://linkedin.com.evil.com/x')).toThrow(
			InvalidLinkedInUrlError,
		);
	});
});
