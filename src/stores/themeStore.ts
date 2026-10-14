import { create } from 'zustand';
import type { ThemeMode } from '../types/cinema';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'cinema_theme_preference';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
    return saved;
  }
  return 'dark'; // Default to cinema dark mode
}

function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyThemeToDocument(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

const initialTheme = getInitialTheme();
const initialResolved = resolveTheme(initialTheme);
if (typeof window !== 'undefined') {
  applyThemeToDocument(initialResolved);
}

export const useThemeStore = create<ThemeState>((set, get) => {
  // Listen to system preference changes when system mode is selected
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const { theme } = get();
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        applyThemeToDocument(newResolved);
        set({ resolvedTheme: newResolved });
      }
    });
  }

  return {
    theme: initialTheme,
    resolvedTheme: initialResolved,

    setTheme: (theme: ThemeMode) => {
      localStorage.setItem(STORAGE_KEY, theme);
      const resolved = resolveTheme(theme);
      applyThemeToDocument(resolved);
      set({ theme, resolvedTheme: resolved });
    },

    toggleTheme: () => {
      const { resolvedTheme } = get();
      const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, nextTheme);
      applyThemeToDocument(nextTheme);
      set({ theme: nextTheme, resolvedTheme: nextTheme });
    },
  };
});
