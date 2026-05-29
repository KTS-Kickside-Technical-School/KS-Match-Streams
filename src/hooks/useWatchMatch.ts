import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Match, ChatMessage, StatRow } from '../types/index';

const ENABLE_STATS_AND_CHAT = false;

const formatStatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};

const toNumeric = (value: string): number | null => {
  const cleaned = value.replace('%', '').trim();
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeStatRows = (stats: any): StatRow[] => {
  if (Array.isArray(stats)) {
    return stats
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const name = item.name || item.label || item.key || item.stat || '';
        const home = item.home ?? item.homeValue ?? item.team1 ?? item.left;
        const away = item.away ?? item.awayValue ?? item.team2 ?? item.right;
        if (!name) return null;
        return { name: String(name), home, away };
      })
      .filter((item): item is StatRow => item !== null);
  }

  if (!stats || typeof stats !== 'object') return [];

  return Object.entries(stats).map(([name, value]: [string, any]) => {
    if (Array.isArray(value)) {
      return { name, home: value[0], away: value[1] };
    }

    if (value && typeof value === 'object') {
      return {
        name,
        home: value.home ?? value.team1 ?? value.left,
        away: value.away ?? value.team2 ?? value.right,
      };
    }

    return { name, home: value, away: '-' };
  });
};

const normalizeChatRows = (chatMessages: any): ChatMessage[] => {
  if (!Array.isArray(chatMessages)) return [];

  return chatMessages
    .map((msg, index) => {
      if (!msg || typeof msg !== 'object') return null;

      return {
        id: msg.id || msg.messageId || `${msg.user || msg.username || 'user'}-${index}`,
        user: msg.user || msg.username || 'User',
        text: msg.text || msg.message || msg.body || '',
        isMod: Boolean(msg.isMod || msg.mod || msg.role === 'mod' || msg.role === 'moderator'),
        time: msg.time || msg.timestamp || '',
      };
    })
    .filter((msg): msg is ChatMessage => msg !== null && !!msg.text);
};

export const useWatchMatch = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [relatedMatches, setRelatedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [statRows, setStatRows] = useState<StatRow[]>([]);

  // Load match details
  useEffect(() => {
    const loadMatch = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiService.getMatchById(id);
        setMatch(data);
        setChatMessages(normalizeChatRows(data.chatMessages));
        setStatRows(normalizeStatRows(data.stats));

        // Dynamic SEO title & description update
        document.title = `Watch Live: ${data.homeTeam.name} vs ${data.awayTeam.name} - ${data.league} | Kickside`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            `Watch live, lag-free match streaming channels in high-definition (HD 1080p) for ${data.homeTeam.name} vs ${data.awayTeam.name}. Venue: ${data.spectators || 'International Broadcast'}.`
          );
        }

        // Fetch related matches
        const related = await apiService.getRelatedMatches(data.category, data.id);
        setRelatedMatches(related);
      } catch (err: any) {
        setError('Match data could not be recovered. The stream might have ended or is restricted.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  return {
    id,
    match,
    relatedMatches,
    isLoading,
    error,
    chatMessages,
    statRows,
    formatStatValue,
    toNumeric,
    ENABLE_STATS_AND_CHAT,
  };
};
