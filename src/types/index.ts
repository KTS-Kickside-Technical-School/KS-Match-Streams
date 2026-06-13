export interface Team {
  name: string;
  shortName: string;
  logo: string;
  score: number;
}

export interface Match {
  id: string;
  title: string;
  homeTeam: Team;
  awayTeam: Team;
  league: string;
  category: string;
  status: 'live' | 'upcoming' | 'finished' | string;
  minute: string;
  startTime: string | null;
  thumbnail: string;
  description: string;
  streamUrl: string;
  views: string | number;
  spectators: string | number;
  referee: string;
  stats: any;
  chatMessages: any;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isMod: boolean;
  time: string;
}

export interface StatRow {
  name: string;
  home: string | number;
  away: string | number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface League {
  id: string;
  name: string;
  icon: string;
}
