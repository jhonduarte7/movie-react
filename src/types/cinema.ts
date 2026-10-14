/**
 * Types and interfaces for Cinema MCP Client & Assistant.
 */

export interface CinemaPromptRequestDto {
  prompt: string;
  userPreference?: string | null;
}

export interface CinemaPromptResponseDto {
  answer: string;
  model: string;
  timestamp: string;
}

export interface CinemaStatusDto {
  applicationName?: string;
  serverPort?: number;
  mcpServerConnected?: boolean;
  aiModel?: string;
  status?: string;
  timestamp?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  model?: string;
  userPreference?: string;
  isError?: boolean;
}

export interface QuickSuggestion {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preference?: string;
  badge?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
