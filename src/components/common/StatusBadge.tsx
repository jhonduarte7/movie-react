import React from 'react';
import { RefreshCw, Cpu, Sparkles } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { cn } from '../../lib/utils';

export const StatusBadge: React.FC<{ className?: string }> = ({ className }) => {
  const { serverStatus, modelName, demoMode, setDemoMode, checkServerStatus } = useChatStore();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Backend connection pill */}
      <button
        type="button"
        onClick={() => checkServerStatus()}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
          serverStatus === 'online'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60'
            : serverStatus === 'checking'
            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60'
            : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
        )}
        title="Click to check Cinema MCP Client connection (port 8091)"
      >
        <span className="relative flex h-2 w-2">
          {serverStatus === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              serverStatus === 'online'
                ? 'bg-emerald-500'
                : serverStatus === 'checking'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-zinc-400 dark:bg-zinc-500'
            )}
          />
        </span>
        <span className="hidden sm:inline font-mono">
          {serverStatus === 'online' ? 'Cinema AX: 8091' : serverStatus === 'checking' ? 'Connecting...' : 'Standby'}
        </span>
        <RefreshCw className="w-3 h-3 opacity-60 hover:opacity-100 hover:rotate-180 transition-transform" />
      </button>

      {/* Model Name pill */}
      <div
        className={cn(
          'hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
          'bg-zinc-100 text-zinc-700 border-zinc-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/60'
        )}
        title="Underlying LLM powering Cinema Assistant"
      >
        <Cpu className="w-3 h-3 text-amber-500" />
        <span className="font-mono">{modelName}</span>
      </div>

      {/* Demo Simulation Toggle */}
      <button
        type="button"
        onClick={() => setDemoMode(!demoMode)}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors',
          demoMode
            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/30'
            : 'bg-transparent text-zinc-500 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        )}
        title="Toggle simulated movie assistant response mode"
      >
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span className="hidden lg:inline">{demoMode ? 'Preview Mode' : 'Live API'}</span>
      </button>
    </div>
  );
};
