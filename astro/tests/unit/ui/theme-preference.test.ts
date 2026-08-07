import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, toggleTheme, resolveInitialTheme, type Theme } from "@/ui/theme/theme-preference";

describe("Feature: resolve initial theme", () => {
  it("Given a valid stored theme, When the initial theme is resolved, Then the stored theme is preferred", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });

  it("Given no stored choice, When the initial theme is resolved, Then the system preference is followed", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
  });

  it("Given an invalid stored value, When the initial theme is resolved, Then it falls back to the system preference", () => {
    expect(resolveInitialTheme("bleu", true)).toBe("dark");
    expect(resolveInitialTheme("", false)).toBe("light");
  });
});

describe("Feature: toggle theme", () => {
  it("Given a theme, When it is toggled, Then it switches between light and dark", () => {
    expect(toggleTheme("dark")).toBe<Theme>("light");
    expect(toggleTheme("light")).toBe<Theme>("dark");
  });
});

describe("Feature: theme storage key", () => {
  it("Given THEME_STORAGE_KEY, Then it is a stable key", () => {
    expect(THEME_STORAGE_KEY).toBe("qdm-theme");
  });
});
