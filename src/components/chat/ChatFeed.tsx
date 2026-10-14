import React, { useEffect, useRef } from 'react';
import { Film, Sparkles } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { ChatMessage } from './ChatMessage';
import { QuickPrompts } from './QuickPrompts';

export const ChatFeed: React.FC = () => {
  const { messages, isLoading } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message or state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isInitialState = messages.length <= 1;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {messages.map((message, idx) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLast={idx === messages.length - 1}
          />
        ))}

        {/* Quick prompt cards shown if at start of conversation */}
        {isInitialState && (
          <div className="pt-2">
            <QuickPrompts />
          </div>
        )}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex w-full items-center gap-3 py-2 text-zinc-500 dark:text-zinc-400 animate-fadeIn">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-sm ring-1 ring-amber-500/30">
              <Film className="h-4 w-4 animate-spin" />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 text-xs shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/80">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>Cinema AX is processing your inquiry with MCP tools...</span>
              <div className="flex items-center gap-1 pl-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};
