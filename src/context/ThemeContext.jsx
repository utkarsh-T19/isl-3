import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const THEME_OPTIONS = ['light', 'dark', 'system'];
const STORAGE_KEY = 'isl-theme';

const ThemeContext = createContext(null);

/**
 * Read stored theme from localStorage.
 * Returns one of 'light', 'dark', 'system'. Defaults to 'system' on any error or invalid value.
 */
function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEME_OPTIONS.includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

/**
 * Resolve a preference to an actual theme ('light' or 'dark').
 * Falls back to 'dark' if matchMedia is unavailable.
 */
function resolveTheme(preference) {
  if (preference === 'light' || preference === 'dark') return preference;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

/**
 * Set the data-theme attribute on the root <html> element.
 */
function applyTheme(resolved) {
  document.documentElement.setAttribute('data-theme', resolved);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const pref = getStoredTheme();
    const resolved = resolveTheme(pref);
    applyTheme(resolved);
    return pref;
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme));

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const setTheme = useCallback((newPreference) => {
    if (!THEME_OPTIONS.includes(newPreference)) return;

    try {
      localStorage.setItem(STORAGE_KEY, newPreference);
    } catch {
      // silently skip persistence
    }

    setThemeState(newPreference);

    const resolved = resolveTheme(newPreference);
    applyTheme(resolved);
    setResolvedTheme(resolved);
  }, []);

  // Attach/detach matchMedia listener for system mode
  useEffect(() => {
    if (theme !== 'system') return;

    let mql;
    try {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }

    const handler = (e) => {
      if (themeRef.current !== 'system') return;
      const resolved = e.matches ? 'dark' : 'light';
      applyTheme(resolved);
      setResolvedTheme(resolved);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  // Keep DOM in sync whenever theme changes (covers mount + preference changes)
  useEffect(() => {
    const resolved = resolveTheme(theme);
    applyTheme(resolved);
    setResolvedTheme(resolved);
  }, [theme]);

  const value = { theme, resolvedTheme, setTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
