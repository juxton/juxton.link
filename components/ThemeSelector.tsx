"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_THEME,
  type Theme,
  THEMES,
  readStoredTheme,
  writeStoredTheme,
} from "@/lib/theme";

export default function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_THEME;
    }

    return readStoredTheme(window.localStorage);
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStoredTheme(theme, window.localStorage);
  }, [theme]);

  function handleThemeSelect(nextTheme: Theme) {
    setTheme(nextTheme);
  }

  return (
    <div className="theme-selector" role="group" aria-label="Theme selector">
      {THEMES.map((themeOption) => (
        <button
          key={themeOption}
          type="button"
          className="theme-option"
          aria-label={`Switch to ${themeOption} theme`}
          aria-pressed={theme === themeOption}
          data-selected={theme === themeOption}
          onClick={() => {
            handleThemeSelect(themeOption);
          }}
        >
          {themeOption}
        </button>
      ))}
    </div>
  );
}
