export const THEME_STORAGE_KEY = "juxton.theme";

export const THEMES = ["retro", "modern"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "retro";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.includes(value as Theme);
}

export function readStoredTheme(storage: Storage | null = globalThis.localStorage): Theme {
  if (!storage) {
    return DEFAULT_THEME;
  }

  const rawValue = storage.getItem(THEME_STORAGE_KEY);

  return isTheme(rawValue) ? rawValue : DEFAULT_THEME;
}

export function writeStoredTheme(
  theme: Theme,
  storage: Storage | null = globalThis.localStorage,
): void {
  if (!storage || !isTheme(theme)) {
    return;
  }

  storage.setItem(THEME_STORAGE_KEY, theme);
}
