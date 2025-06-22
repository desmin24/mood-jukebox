
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  songs?: Song[];
  timestamp: number;
}

export interface Song {
  name: string;
  artist: string;
  description: string;
  youtube_search_query: string; // Changed from youtube_link
}

export interface GeminiApiResponse {
  mood_detected: string;
  bot_response: string;
  songs: Song[];
}

export enum CharacterMood {
  IDLE = 'IDLE',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  THINKING = 'THINKING',
  SINGING = 'SINGING',
  LOADING = 'LOADING',
}