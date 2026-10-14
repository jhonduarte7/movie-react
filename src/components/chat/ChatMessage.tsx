import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Film, User, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types/cinema';
import { cn, formatTime } from '../../lib/utils';
import { useChatStore } from '../../stores/chatStore';

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const [copied, setCopied] = useState(false);
  const { retryLastMessage, isLoading } = useChatStore();

  const isUser = message.role === 'user';
  const isError = message.isError;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={cn(
        'group flex w-full gap-3 py-3 transition-opacity',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-sm ring-1 ring-amber-500/30">
          {isError ? (
            <AlertCircle className="h-4 w-4 text-white" />
          ) : (
            <Film className="h-4 w-4" />
          )}
        </div>
      )}

      {/* Message Content Container */}
      <div
        className={cn(
          'relative flex max-w-[90%] sm:max-w-[82%] md:max-w-[76%] flex-col gap-1.5 rounded-2xl px-4 py-3 text-sm shadow-xs transition-all',
          isUser
            ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-xs'
            : isError
            ? 'border border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200 rounded-tl-xs'
            : 'border border-zinc-200/90 bg-white text-zinc-900 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-tl-xs shadow-xs'
        )}
      >
        {/* Optional User Preference Tag Badge */}
        {isUser && message.userPreference && (
          <div className="mb-0.5 inline-flex items-center gap-1 self-start rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-amber-300 dark:bg-zinc-200 dark:text-amber-800">
            <Sparkles className="h-3 w-3" />
            <span>Filter: {message.userPreference}</span>
          </div>
        )}

        {/* Message Body */}
        {isUser ? (
          <p className="whitespace-pre-wrap font-normal leading-relaxed">{message.content}</p>
        ) : (
          <div className="cinema-prose text-zinc-800 dark:text-zinc-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Footer info: Timestamp, Model pill, Copy button */}
        <div
          className={cn(
            'mt-1 flex items-center justify-between gap-3 text-[11px] opacity-70 transition-opacity group-hover:opacity-100',
            isUser ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
          )}
        >
          <div className="flex items-center gap-2">
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && message.model && (
              <span className="font-mono text-[10px] uppercase tracking-wide opacity-80">
                • {message.model}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!isUser && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Copy message to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            )}

            {isError && isLast && (
              <button
                type="button"
                onClick={() => retryLastMessage()}
                disabled={isLoading}
                className="flex items-center gap-1 rounded-md p-1 font-medium text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
                title="Retry sending this request"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-[10px]">Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 shadow-sm">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
