# AGENTS.md — Agent Guidelines & Architecture for `movie-react`

Welcome to the **Cinema AX (`movie-react`)** frontend repository. This document defines the engineering standards, architecture, coding conventions, and operational workflows for AI agents and human contributors working on this codebase.

---

## 1. Project Overview & Ecosystem Context

`movie-react` is the modern conversational user interface for the **Cinema MCP Ecosystem**:

```
[User Browser: movie-react] (Port 5174)
          │  HTTP /api/* (Vite Proxy)
          ▼
[Cinema MCP Client: Spring AI + Ollama llama3.1] (Port 8091)
          │  Model Context Protocol (MCP)
          ▼
[Movie MCP Server: Movie Database & Tool Providers]
```

- **Frontend Project**: `movie-react` (this repository).
- **Backend Orchestrator**: [`cinema-mcp-client`](https://github.com/jhonduarte7/cinema-mcp-client) (Spring Boot 3.x, Spring AI, Ollama `llama3.1`).
- **MCP Server**: [`movie-mcp-server`](https://github.com/jhonduarte7/movie-mcp-server) (Provides cinema tools, showtimes, ratings, catalog).

---

## 2. Technology Stack & Versions

| Layer / Library | Version | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 (`^19.0.0`) | UI Component Architecture |
| **Language** | TypeScript 5.7+ | Strict type safety |
| **Bundler / Dev Server** | Vite 6 (`^6.2.0`) | Fast HMR & reverse proxy configuration |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first styling with modern CSS engine |
| **State Management** | Zustand 5 (`^5.0.3`) | Global chat, connection, and theme state |
| **HTTP Client** | Axios (`^1.8.1`) | Network requests with resilient error handling |
| **Markdown Engine** | `react-markdown` + `remark-gfm` | Rich rendering of LLM responses (tables, lists) |
| **Icons** | Lucide React (`^0.475.0`) | Clean, accessible iconography |

---

## 3. Directory Layout & Key Responsibilities

```
movie-react/
├── .agents/                    # Agent skills & workflows
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatFeed.tsx    # Scrollable conversation viewport & auto-scroller
│   │   │   ├── ChatInput.tsx   # Textarea, Enter-to-send, and preference chips
│   │   │   ├── ChatMessage.tsx # Message cards with Markdown tables & copy buttons
│   │   │   └── QuickPrompts.tsx# Fast-action suggestion cards
│   │   └── common/
│   │       ├── Header.tsx      # Top bar with title, status pill & theme toggle
│   │       ├── StatusBadge.tsx # Real-time online/offline/standby indicator
│   │       └── ThemeToggle.tsx # Light/Dark/System theme switcher
│   ├── lib/
│   │   └── utils.ts            # Class merging utility (clsx + tailwind-merge)
│   ├── services/
│   │   └── cinemaApi.ts        # Axios API client interacting with Spring AI
│   ├── stores/
│   │   ├── chatStore.ts        # Chat messages, pending states, offline simulation
│   │   └── themeStore.ts       # Theme state & HTML root class synchronization
│   ├── types/
│   │   └── cinema.ts           # DTOs, message roles, suggestions, status types
│   ├── App.tsx                 # Main root layout wrapper
│   ├── index.css               # Global stylesheet & Tailwind directives
│   └── main.tsx                # React DOM root entry point
├── .env                        # Local dev environment configuration
├── .env.example                # Example environment template
├── .gitignore                  # Git ignore rules (node_modules, dist, logs)
├── AGENTS.md                   # Agent guidelines and architectural manual
├── README.md                   # User documentation and setup guide
└── vite.config.ts              # Vite plugins, path aliases (@ -> src), and API proxy
```

---

## 4. Architectural Rules for Agents

### 4.1. Resilience & Standby Mode
- The frontend features a **Simulated Fallback Mode** (`getSimulatedCinemaResponse` in [`src/stores/chatStore.ts`](file:///D:/IA/SPRING-BOOT/WORKSPACE/movie-react/src/stores/chatStore.ts)).
- If the Spring Boot backend (`http://localhost:8091`) is unreachable, the application **must gracefully inform the user** and provide realistic preview responses instead of crashing or showing an empty screen.
- **Rule**: Never remove or disable this fallback mechanism without an explicit user requirement.

### 4.2. API Proxy & Environment Configuration
- In development, network calls to `/api/*` are reverse-proxied by Vite to the target defined in `VITE_API_TARGET` (default: `http://localhost:8091`).
- Avoid hardcoding `http://localhost:8091` directly in frontend components or services; always use relative `/api/...` paths so the Vite proxy or production reverse proxy (e.g., NGINX) can handle routing and avoid CORS.

### 4.3. React 19 & TypeScript Conventions
- **Strict Typing**: All components, hooks, and store actions must have explicit types. Do not use `any`.
- **State Management**: Use Zustand stores (`useChatStore`, `useThemeStore`) for shared states. Keep component state local (`useState`) for transient UI states (e.g., input values, dropdown toggles).
- **Tailwind CSS v4**: Note that Tailwind v4 uses `@tailwindcss/vite` and `@import "tailwindcss";` in `src/index.css`. Do not add deprecated `tailwind.config.js` plugins unless strictly required and compatible with v4.

### 4.4. UI & Accessibility Standards
- Ensure all interactive buttons have descriptive `title` attributes or accessible labels.
- Support both **Light** and **Dark** color schemes seamlessly.
- Responsive design: Mobile devices (single column, full width) up to 4K displays.

---

## 5. Development & Verification Commands

```bash
# Install dependencies
npm install

# Start development server (Port 5174)
npm run dev

# Run TypeScript compiler check and build
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Git & Contribution Hygiene
- **Never commit `node_modules/` or build artifacts (`dist/`, `*.tsbuildinfo`)**.
- Always verify working tree cleanliness with `git status` prior to proposing commits.
- Write concise, conventional commit messages (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
