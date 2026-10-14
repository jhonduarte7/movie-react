import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, SlidersHorizontal, Film } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { cn } from '../../lib/utils';

const GENRE_PRESETS = [
  'Sci-Fi',
  'Action',
  'Animation',
  'Drama',
  'Comedy',
  'Horror',
  'Family (PG)',
  'Top Rated',
];

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage, isLoading, userPreference, setUserPreference } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const togglePreset = (preset: string) => {
    if (userPreference === preset) {
      setUserPreference('');
    } else {
      setUserPreference(preset);
    }
  };

  return (
    <div className="sticky bottom-0 z-20 w-full border-t border-zinc-200/80 bg-white/90 p-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-2">
        {/* Preference Selector Bar / Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
              showPreferences || userPreference
                ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            )}
            title="Configure cinema preference filter"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>Preferences</span>
          </button>

          {userPreference && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
              <Sparkles className="h-3 w-3" />
              <span>{userPreference}</span>
              <button
                type="button"
                onClick={() => setUserPreference('')}
                className="ml-0.5 rounded-full p-0.5 hover:bg-amber-500/20"
                title="Clear preference filter"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {/* Quick preset chips when opened or when no preference selected */}
          {showPreferences && (
            <div className="flex flex-wrap items-center gap-1 pl-1 animate-fadeIn">
              {GENRE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => togglePreset(preset)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                    userPreference === preset
                      ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Box */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-2 shadow-xs focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/20 dark:border-zinc-800/90 dark:bg-zinc-900/80 dark:focus-within:border-amber-500/60 transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-zinc-400 dark:text-zinc-500">
            <Film className="h-4 w-4" />
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              userPreference
                ? `Ask about ${userPreference} movies or showtimes...`
                : 'Ask Cinema AX about movies, schedules, actors, ratings...'
            }
            disabled={isLoading}
            className="max-h-40 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-medium transition-all',
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-amber-500/25 hover:opacity-95 active:scale-95'
                : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
            )}
            title="Send inquiry (Enter)"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Footnote */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 px-1">
          <span>Cinema MCP Client • Spring AI + Ollama (llama3.1)</span>
          <span className="hidden sm:inline">Press <kbd className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Enter</kbd> to send, <kbd className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Shift+Enter</kbd> for newline</span>
        </div>
      </div>
    </div>
  );
};
