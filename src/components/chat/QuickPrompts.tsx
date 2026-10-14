import React from 'react';
import { Sparkles, Calendar, Star, Film, Users, Compass } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import type { QuickSuggestion } from '../../types/cinema';

const SUGGESTIONS: QuickSuggestion[] = [
  {
    id: 'schedules',
    title: "Today's Showtimes",
    description: 'Check active movie schedules & theater halls',
    prompt: 'What movies and showtimes are scheduled for today?',
    badge: 'Schedules',
  },
  {
    id: 'top-rated',
    title: 'Top Rated Movies',
    description: 'Highest rated films in the catalog',
    prompt: 'Which movies currently have the highest ratings?',
    preference: 'Top Rated',
    badge: 'Popular',
  },
  {
    id: 'scifi-recommendation',
    title: 'Sci-Fi Recommendation',
    description: 'Explore futuristic & mind-bending cinema',
    prompt: 'Can you recommend a great Sci-Fi movie playing right now?',
    preference: 'Sci-Fi',
    badge: 'Genre',
  },
  {
    id: 'family-friendly',
    title: 'Family & Animation',
    description: 'Screenings suited for general audience & kids',
    prompt: 'What family-friendly animated movies are available?',
    preference: 'All Audiences',
    badge: 'Kids',
  },
];

export const QuickPrompts: React.FC = () => {
  const { sendMessage, isLoading, setUserPreference } = useChatStore();

  const handleSelect = (item: QuickSuggestion) => {
    if (isLoading) return;
    if (item.preference) {
      setUserPreference(item.preference);
    }
    sendMessage(item.prompt, item.preference);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'schedules':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'top-rated':
        return <Star className="h-4 w-4 text-amber-400" />;
      case 'scifi-recommendation':
        return <Compass className="h-4 w-4 text-indigo-500" />;
      case 'family-friendly':
        return <Users className="h-4 w-4 text-emerald-500" />;
      default:
        return <Film className="h-4 w-4 text-rose-500" />;
    }
  };

  return (
    <div className="w-full py-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Suggested Cinema Inquiries
        </h3>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Click any card to ask instantly
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {SUGGESTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleSelect(item)}
            className="group relative flex flex-col items-start rounded-xl border border-zinc-200/90 bg-white p-3.5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-amber-400/80 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-amber-500/60 dark:hover:bg-zinc-800/80"
          >
            <div className="mb-2 flex w-full items-center justify-between">
              <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800 transition-colors group-hover:bg-amber-500/10 dark:group-hover:bg-amber-400/10">
                {getIcon(item.id)}
              </div>
              {item.badge && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {item.badge}
                </span>
              )}
            </div>

            <h4 className="text-xs font-bold text-zinc-900 group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400 transition-colors">
              {item.title}
            </h4>
            <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
