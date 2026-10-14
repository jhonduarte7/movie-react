import React from 'react';
import { Film, Trash2, Clapperboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { StatusBadge } from './StatusBadge';
import { useChatStore } from '../../stores/chatStore';

export const Header: React.FC = () => {
  const { clearChat, messages } = useChatStore();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-400 text-white shadow-md shadow-amber-500/20">
            <Film className="h-5 w-5 animate-spin-slow" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 text-[8px] font-bold text-amber-400 ring-2 ring-white dark:ring-zinc-950">
              AX
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-50">
                Cinema AX
              </h1>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                <Clapperboard className="h-2.5 w-2.5" />
                MCP Client
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              AI Assistant for Movie Catalog & Schedules
            </p>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <StatusBadge />

          {messages.length > 1 && (
            <button
              type="button"
              onClick={clearChat}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              title="Clear current conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

          {/* Theme switcher */}
          <ThemeToggle variant="compact" />
        </div>
      </div>
    </header>
  );
};
