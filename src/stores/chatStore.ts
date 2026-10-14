import { create } from 'zustand';
import type { ChatMessage } from '../types/cinema';
import { cinemaApi } from '../services/cinemaApi';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  userPreference: string;
  serverStatus: 'online' | 'offline' | 'checking';
  modelName: string;
  demoMode: boolean;

  // Actions
  sendMessage: (prompt: string, overridePreference?: string) => Promise<void>;
  setUserPreference: (preference: string) => void;
  clearChat: () => void;
  setDemoMode: (enabled: boolean) => void;
  checkServerStatus: () => Promise<void>;
  retryLastMessage: () => Promise<void>;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `### Welcome to Cinema AX 🎬
I am your intelligent **Cinema MCP Assistant**. Powered by Spring AI and MCP tools, I can help you with:

- 🍿 **Explore Current Movies**: Check the catalogue, release dates, and genres.
- 🕒 **Movie Schedules & Showtimes**: Find viewing times and hall information.
- ⭐ **Recommendations & Top Rated**: Get personalized suggestions based on your taste or audience age.
- 🎟️ **Audience & Rating Guidelines**: Find family-friendly or adult-targeted screenings.

Feel free to pick one of the suggestions below or type any question!`,
  timestamp: new Date().toISOString(),
  model: 'llama3.1 (MCP)',
};

/**
 * Intelligent local fallback when backend is temporarily offline.
 */
function getSimulatedCinemaResponse(prompt: string, preference?: string): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('schedule') || p.includes('time') || p.includes('showing') || p.includes('when')) {
    return `### 🕒 Today's Featured Showtimes

Here are the active schedules retrieved via **Movie MCP Tools**:

| Movie | Hall / Screen | Showtimes | Format |
| :--- | :--- | :--- | :--- |
| **Inception** | Grand Auditorium 1 | 14:30, 18:00, 21:15 | IMAX 2D |
| **Dune: Part Two** | Dolby Atmos Room | 15:00, 19:30, 22:45 | 4K Laser |
| **Spider-Man: Across the Spider-Verse** | Theater 3 | 13:00, 16:30, 20:00 | Standard 2D |
| **Interstellar** | IMAX Premium | 17:00, 21:00 | IMAX 70mm |

*Tip: Please arrive 15 minutes prior to screening time.*`;
  }

  if (p.includes('top') || p.includes('best') || p.includes('rating') || p.includes('recommend')) {
    return `### ⭐ Top Rated & Recommended Titles ${preference ? `(Filtered by: ${preference})` : ''}

Based on critical ratings and user reviews in the cinema catalogue:

1. **The Dark Knight** *(Rating: 9.0/10)*
   - **Genre**: Action, Crime, Drama
   - **Audience**: PG-13 (13+)
   - **Synopsis**: When the menace known as the Joker wreaks havoc on Gotham, Batman must face one of the greatest psychological and physical tests.

2. **Interstellar** *(Rating: 8.7/10)*
   - **Genre**: Adventure, Drama, Sci-Fi
   - **Audience**: PG-13 (13+)
   - **Synopsis**: A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.

3. **Spirited Away** *(Rating: 8.6/10)*
   - **Genre**: Animation, Adventure, Family
   - **Audience**: All Audiences
   - **Synopsis**: During her family's move to the suburbs, a 10-year-old girl wanders into a world ruled by gods, witches, and spirits.

Would you like to see available showtimes for any of these?`;
  }

  if (p.includes('genre') || p.includes('scifi') || p.includes('action') || p.includes('horror') || p.includes('comedy')) {
    return `### 🎭 Available Cinema Genres

We currently feature screenings across the following categories:
- 🚀 **Sci-Fi & Fantasy**: Dune: Part Two, Inception, Interstellar
- 💥 **Action & Thriller**: The Dark Knight, Mission: Impossible
- 🎈 **Family & Animation**: Inside Out 2, Despicable Me 4
- 👻 **Horror & Suspense**: A Quiet Place: Day One, Alien: Romulus
- 🎭 **Drama & Romance**: Past Lives, Oppenheimer

Which genre would you like to explore in detail?`;
  }

  return `### 📽️ Cinema AX Assistant Response
Regarding your inquiry: **"${prompt}"**

${preference ? `> *Active User Preference applied:* **${preference}**\n\n` : ''}
The Cinema MCP Client queries the Movie Database in real-time through the Model Context Protocol. You can inquire about specific movie titles, filter by target audience (General, PG-13, Adults), or look up specific theater showtimes.

Is there a specific title or showtime you would like me to retrieve?`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [INITIAL_GREETING],
  isLoading: false,
  userPreference: '',
  serverStatus: 'checking',
  modelName: 'llama3.1',
  demoMode: false,

  setUserPreference: (preference: string) => {
    set({ userPreference: preference });
  },

  setDemoMode: (enabled: boolean) => {
    set({ demoMode: enabled });
  },

  clearChat: () => {
    set({ messages: [INITIAL_GREETING] });
  },

  checkServerStatus: async () => {
    try {
      const status = await cinemaApi.getStatus();
      if (status.status && status.status !== 'OFFLINE') {
        set({
          serverStatus: 'online',
          modelName: status.aiModel || 'llama3.1',
        });
      } else {
        set({ serverStatus: 'offline' });
      }
    } catch {
      set({ serverStatus: 'offline' });
    }
  },

  sendMessage: async (prompt: string, overridePreference?: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const { messages, userPreference, demoMode } = get();
    const effectivePreference = overridePreference !== undefined ? overridePreference : userPreference;

    // 1. Append User Message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
      userPreference: effectivePreference || undefined,
    };

    set({
      messages: [...messages, userMessage],
      isLoading: true,
    });

    try {
      let answerText = '';
      let usedModel = 'llama3.1';
      let responseTimestamp = new Date().toISOString();

      if (demoMode) {
        // Simulated response with natural delay for realistic UX
        await new Promise((res) => setTimeout(res, 800));
        answerText = getSimulatedCinemaResponse(trimmed, effectivePreference);
        usedModel = 'llama3.1 (Simulated)';
      } else {
        try {
          const response = await cinemaApi.askAssistant({
            prompt: trimmed,
            userPreference: effectivePreference || null,
          });
          answerText = response.answer;
          usedModel = response.model || 'llama3.1';
          responseTimestamp = response.timestamp || new Date().toISOString();
          set({ serverStatus: 'online', modelName: usedModel });
        } catch (apiError) {
          // If backend connection fails, automatically fall back to simulated mode with a helpful banner
          const errorMessage = apiError instanceof Error ? apiError.message : 'Connection failed';
          
          // Provide fallback simulation while warning user
          const simulated = getSimulatedCinemaResponse(trimmed, effectivePreference);
          answerText = `> ⚠️ **Backend Standby Notice**: Could not reach Spring Boot at \`http://localhost:8091\` (${errorMessage}).\n> *Displaying local simulated cinema data for preview:*\n\n` + simulated;
          usedModel = 'llama3.1 (Local Standby)';
          set({ serverStatus: 'offline' });
        }
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answerText,
        timestamp: responseTimestamp,
        model: usedModel,
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Failed to retrieve assistant response.';
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Error communicating with Cinema Assistant:**\n\n${errorText}\n\nPlease check that your Cinema MCP Client is running on port **8091**.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
      }));
    }
  },

  retryLastMessage: async () => {
    const { messages, sendMessage } = get();
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content, lastUserMessage.userPreference);
    }
  },
}));
