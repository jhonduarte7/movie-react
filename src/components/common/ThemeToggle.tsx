import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../lib/utils';
import type { ThemeMode } from '../../types/cinema';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'segmented';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, variant = 'compact' }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();

  if (variant === 'segmented') {
    const modes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
      { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
      { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
      { id: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
    ];

    return (
      <div
        className={cn(
          'inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs',
          className
        )}
        role="group"
        aria-label="Theme switcher"
      >
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setTheme(mode.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all',
              theme === mode.id
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-xs font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            )}
            title={`Switch to ${mode.label} theme`}
          >
            {mode.icon}
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Compact Switcher
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center p-2 rounded-xl transition-all',
        'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200',
        'dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
        className
      )}
      title={`Toggle theme (Currently: ${resolvedTheme})`}
      aria-label="Toggle dark/light theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
