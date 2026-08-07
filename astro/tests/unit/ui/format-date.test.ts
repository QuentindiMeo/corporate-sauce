import { describe, expect, it } from "vitest";

import { publicationInstant } from "@domain/publication-time";
import {
  formatMonth,
  formatMonthCode,
  formatMonthWithElision,
  formatPublicationDate,
  toIsoDate,
} from "@/ui/format/date";

describe("Feature: publication date formatting", () => {
  it("Given a publication date, When it is formatted, Then it reads as a long French date", () => {
    expect(formatPublicationDate(new Date("2026-07-21T00:00:00Z"))).toBe("21 juillet 2026");
  });

  it("Given a date in a month with an accent, Then the French month name is preserved", () => {
    expect(formatPublicationDate(new Date("2026-08-04T00:00:00Z"))).toBe("4 août 2026");
  });

  it("Given a date at UTC midnight, Then it is not shifted a day backwards by the local timezone", () => {
    // Régression : sans `timeZone: 'UTC'`, un fuseau négatif rendait « 20 juillet ».
    expect(formatPublicationDate(new Date("2026-07-21T00:00:00Z"))).toContain("21");
    expect(toIsoDate(new Date("2026-07-21T00:00:00Z"))).toBe("2026-07-21");
  });

  it("Given a date, When the machine form is built, Then it is a bare ISO day", () => {
    expect(toIsoDate(new Date("2026-09-02T00:00:00Z"))).toBe("2026-09-02");
  });

  it("Given a real publication instant, When it is formatted, Then it reads the Paris publication day", () => {
    // ? `publishedAt` n'est plus minuit UTC mais 11 h Paris (= 09:00Z l'été).
    expect(formatPublicationDate(publicationInstant("2026-07-21"))).toBe("21 juillet 2026");
    expect(toIsoDate(publicationInstant("2026-07-21"))).toBe("2026-07-21");
    expect(formatPublicationDate(publicationInstant("2026-01-15"))).toBe("15 janvier 2026");
    expect(toIsoDate(publicationInstant("2026-01-15"))).toBe("2026-01-15");
  });

  it("Given an instant whose UTC day differs from its Paris day, Then the Paris day wins", () => {
    // ! Régression : 23 h 30 UTC le 20 juillet, c'est déjà le 21 à Paris (01 h 30).
    // ! En `timeZone: 'UTC'`, ce jour-là s'affichait « 20 juillet » — un jour trop tôt.
    const veille = new Date("2026-07-20T23:30:00Z");
    expect(formatPublicationDate(veille)).toBe("21 juillet 2026");
    expect(toIsoDate(veille)).toBe("2026-07-21");
  });
});

describe("Feature: month formatting (date view headings)", () => {
  it("Given the first day of a month, When it is formatted, Then it reads as month and year in French", () => {
    expect(formatMonth(new Date("2026-08-01T00:00:00Z"))).toBe("août 2026");
  });

  it("Given any day of a month, When it is formatted, Then only month and year are kept", () => {
    expect(formatMonth(new Date("2026-07-21T00:00:00Z"))).toBe("juillet 2026");
  });

  it("Given the first day at UTC midnight, Then a negative timezone does not roll it into the previous month", () => {
    // ! Régression : sans `timeZone: 'UTC'`, le 1er septembre minuit UTC s'afficherait « août 2026 ».
    expect(formatMonth(new Date("2026-09-01T00:00:00Z"))).toBe("septembre 2026");
  });

  it("Given a month key, When the short code is built, Then it reads MM.AA", () => {
    expect(formatMonthCode("2026-08")).toBe("08.26");
    expect(formatMonthCode("2025-12")).toBe("12.25");
  });

  it("Given a vowel-initial month, When the preposition is added, Then it is elided", () => {
    expect(formatMonthWithElision(new Date("2026-08-01T00:00:00Z"))).toBe("d'août 2026");
    expect(formatMonthWithElision(new Date("2026-04-01T00:00:00Z"))).toBe("d'avril 2026");
    expect(formatMonthWithElision(new Date("2026-10-01T00:00:00Z"))).toBe("d'octobre 2026");
  });

  it("Given a consonant-initial month, When the preposition is added, Then it stays « de »", () => {
    expect(formatMonthWithElision(new Date("2026-07-01T00:00:00Z"))).toBe("de juillet 2026");
    expect(formatMonthWithElision(new Date("2026-12-01T00:00:00Z"))).toBe("de décembre 2026");
  });
});
