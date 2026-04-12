import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS = {
  light: 'Current theme: light. Switch to dark',
  dark: 'Current theme: dark. Switch to system',
  system: 'Current theme: system. Switch to light',
};

function cycleTheme(current) {
  const order = ['light', 'dark', 'system'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const Icon = ICONS[theme] || Monitor;
  const label = LABELS[theme] || LABELS.system;

  return (
    <button
      onClick={() => setTheme(cycleTheme(theme))}
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--surface-2)',
        color: 'var(--text-2)',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--surface-hover)';
        e.currentTarget.style.color = 'var(--text)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface-2)';
        e.currentTarget.style.color = 'var(--text-2)';
      }}
    >
      <Icon size={16} />
    </button>
  );
};

export default ThemeSwitcher;
