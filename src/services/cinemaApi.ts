import axios, { AxiosError } from 'axios';
import type { CinemaPromptRequestDto, CinemaPromptResponseDto, CinemaStatusDto } from '../types/cinema';

// Axios instance configured with defaults
const apiClient = axios.create({
  baseURL: '',
  timeout: 120000, // 120s for local Ollama LLM inference + MCP tool execution
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Service to communicate with Cinema MCP Client endpoints.
 */
export const cinemaApi = {
  /**
   * Primary endpoint: Sends a natural language prompt to the Cinema AI Assistant.
   * POST /api/cinema/ask
   */
  async askAssistant(request: CinemaPromptRequestDto): Promise<CinemaPromptResponseDto> {
    try {
      const response = await apiClient.post<CinemaPromptResponseDto>('/api/cinema/ask', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
        
        // Handle server connection error (backend not running or connection refused)
        if (axiosErr.code === 'ERR_NETWORK' || axiosErr.code === 'ECONNABORTED' || !axiosErr.response) {
          throw new Error(
            `Unable to connect to Cinema MCP Client at port 8091. Please ensure your Spring Boot application is running.`
          );
        }

        const serverMessage = axiosErr.response?.data?.message || axiosErr.response?.data?.error;
        if (serverMessage) {
          throw new Error(serverMessage);
        }

        throw new Error(`Server returned HTTP ${axiosErr.response?.status}: ${axiosErr.message}`);
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred while contacting Cinema AX.');
    }
  },

  /**
   * Auxiliary endpoint: Gets movie recommendations by genre.
   * GET /api/cinema/recommend?genre={genre}
   */
  async recommendByGenre(genre?: string): Promise<CinemaPromptResponseDto> {
    try {
      const response = await apiClient.get<CinemaPromptResponseDto>('/api/cinema/recommend', {
        params: genre ? { genre } : {},
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch movie recommendation.');
      }
      throw error;
    }
  },

  /**
   * Auxiliary endpoint: Retrieves status and MCP connection information.
   * GET /api/cinema/status
   */
  async getStatus(): Promise<CinemaStatusDto> {
    try {
      const response = await apiClient.get<CinemaStatusDto>('/api/cinema/status', {
        timeout: 4000,
      });
      return response.data;
    } catch {
      return {
        applicationName: 'cinema-mcp-client',
        serverPort: 8091,
        mcpServerConnected: false,
        status: 'OFFLINE',
      };
    }
  },
};
