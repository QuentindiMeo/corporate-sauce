// @ts-check

import { readFileSync } from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

// Sur WSL2, les événements inotify ne remontent pas depuis un lecteur Windows
// monté (/mnt/…) → le HMR ne se déclenche pas. On bascule alors le watcher en
// scrutation (polling). Sans effet sur Linux/macOS natifs. Forçable via
// CHOKIDAR_USEPOLLING=true.
function surWsl() {
  try {
    return readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft");
  } catch {
    return false;
  }
}
const usePolling = process.env.CHOKIDAR_USEPOLLING === "true" || (surWsl() && process.cwd().startsWith("/mnt/"));

// https://astro.build/config
export default defineConfig({
  // Galerie statique déployée sur Cloudflare Pages (repli GitHub Pages).
  site: "https://example.com",
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: {
    server: {
      watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
    },
  },
  // Typographie de la charte QDM (§3), self-hostée au build (pas de CDN à l'exécution).
  fonts: [
    {
      // Titres & corps
      provider: fontProviders.google(),
      name: "Space Grotesk",
      cssVariable: "--font-title",
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
      display: "swap",
    },
    {
      // Chiffres-choc, tags, logotype, légendes
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: [700, 800],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
      display: "swap",
    },
    {
      // Corps long alternatif (mode clair dense)
      provider: fontProviders.google(),
      name: "Hanken Grotesk",
      cssVariable: "--font-body",
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
      display: "swap",
    },
  ],
});
