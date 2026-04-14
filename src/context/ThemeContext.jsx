import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const THEME_OPTIONS = ['light', 'dark', 'system'];
const STORAGE_KEY = 'isl-theme';

const ThemeContext = createContext(null);

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEME_OPTIONS.includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function resolveTheme(preference) {
  if (preference === 'light' || preference === 'dark') return preference;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

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
    try { localStorage.setItem(STORAGE_KEY, newPreference); } catch {}
    setThemeState(newPreference);
    const resolved = resolveTheme(newPreference);
    applyTheme(resolved);
    setResolvedTheme(resolved);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    let mql;
    try { mql = window.matchMedia('(prefers-color-scheme: dark)'); } catch { return; }
    const handler = (e) => {
      if (themeRef.current !== 'system') return;
      const resolved = e.matches ? 'dark' : 'light';
      applyTheme(resolved);
      setResolvedTheme(resolved);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    applyTheme(resolved);
    setResolvedTheme(resolved);
  }, [theme]);

  const value = { theme, resolvedTheme, setTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
