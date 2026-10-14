import React, { useEffect } from 'react';
import { Header } from './components/common/Header';
import { ChatFeed } from './components/chat/ChatFeed';
import { ChatInput } from './components/chat/ChatInput';
import { useChatStore } from './stores/chatStore';

export const App: React.FC = () => {
  const { checkServerStatus } = useChatStore();

  useEffect(() => {
    // Initial backend health & model detection check
    checkServerStatus();
  }, [checkServerStatus]);

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 font-sans text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Top Navigation / Brand Bar */}
      <Header />

      {/* Main Chat Scrollable Feed */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatFeed />
      </main>

      {/* Persistent Bottom Chat Dock */}
      <ChatInput />
    </div>
  );
};

export default App;
