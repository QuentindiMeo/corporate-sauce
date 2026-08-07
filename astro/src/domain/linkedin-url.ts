/**
 * Value object : une URL de post LinkedIn valide.
 * Type « branded » — on ne peut en obtenir un que via {@link createLinkedInUrl},
 * ce qui garantit qu'un `LinkedInUrl` est toujours une URL LinkedIn en HTTPS.
 */
export type LinkedInUrl = string & { readonly __brand: "LinkedInUrl" };

export class InvalidLinkedInUrlError extends Error {
  constructor(value: string) {
    super(`Lien LinkedIn invalide : « ${value} »`);
    this.name = "InvalidLinkedInUrlError";
  }
}

export function createLinkedInUrl(value: string): LinkedInUrl {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new InvalidLinkedInUrlError(value);
  }

  if (url.protocol !== "https:") {
    throw new InvalidLinkedInUrlError(value);
  }

  const host = url.hostname.toLowerCase();
  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) {
    throw new InvalidLinkedInUrlError(value);
  }

  return value as LinkedInUrl;
}
