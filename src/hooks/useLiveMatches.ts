import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Match } from '../types/index';

const TOP_LEAGUES = [
  { id: 'all-leagues', name: 'All Leagues', icon: '🏆' },
  { id: 'world-cup', name: 'World Cup', icon: '🌎' },
  { id: 'premier-league', name: 'Premier League', icon: '🏴\u200D󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la-liga', name: 'La Liga', icon: '🇪🇸' },
  { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
  { id: 'serie-a', name: 'Serie A', icon: '🇮🇹' },
  { id: 'champions-league', name: 'UEFA Champions League', icon: '🇪🇺' },
  { id: 'nba', name: 'NBA', icon: '🏀' },
  { id: 'ufc', name: 'UFC / MMA', icon: '🥊' },
];

export const useLiveMatches = (searchValue: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // React Router URL Sync
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL values (defaults to all)
  const categoryParam = searchParams.get('category') || 'all';
  const leagueParam = searchParams.get('league') || 'all-leagues';

  const fetchLiveMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch only active live matches
      const data = await apiService.getLiveMatches();
      setMatches(data);
    } catch (err: any) {
      setError('Unable to synchronize live sports streams. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    // Poll API for score updates every 30 seconds
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update URL parameters helper
  const updateUrlParams = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === 'all-leagues') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    // Mutual exclusivity filters
    if (key === 'league') {
      nextParams.delete('category'); // clear sport when picking a league
    } else if (key === 'category') {
      nextParams.delete('league'); // clear league when picking a sport
    }

    setSearchParams(nextParams);
  };

  // Sync prop-based search value into URL search parameter
  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      nextParams.set('search', searchValue.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  }, [searchValue]);

  // Dynamic SEO Page Meta Updating
  useEffect(() => {
    document.title = '🔴 Live Sports Streams Now - Kickside Match Center';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Watch live sports match streams now on Kickside. Free, real-time streaming in high definition for Premier League, UEFA, NBA, and more.'
      );
    }
  }, []);

  // Extract dynamic leagues present in current live matches
  const allLeaguesInMatches = [...new Set(matches.map((m) => m.league))].filter(Boolean);
  const hardcodedLeagueNames = TOP_LEAGUES.map((l) => l.name.toLowerCase());
  const dynamicLeagues = allLeaguesInMatches.filter(
    (league) => !hardcodedLeagueNames.includes(league.toLowerCase())
  );

  const leagueCounts = matches.reduce((acc, m) => {
    acc[m.league] = (acc[m.league] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDynamicLeagues = dynamicLeagues.sort(
    (a, b) => (leagueCounts[b] || 0) - (leagueCounts[a] || 0)
  );

  // Filtering Logic
  const filteredMatches = matches.filter((match) => {
    // 1. Category filter
    const matchesCategory = categoryParam === 'all' || match.category === categoryParam;

    // 2. League filter
    let matchesLeague = true;
    if (leagueParam !== 'all-leagues') {
      const activeLeague = TOP_LEAGUES.find((l) => l.id === leagueParam);
      const targetLeagueName = activeLeague ? activeLeague.name : leagueParam;
      matchesLeague = match.league.toLowerCase() === targetLeagueName.toLowerCase();
    }

    // 3. Search query filter
    const activeSearch = (searchParams.get('search') || '').toLowerCase().trim();
    const title = String(match.title || '').toLowerCase();
    const league = String(match.league || '').toLowerCase();
    const category = String(match.category || '').toLowerCase();
    const homeName = String(match.homeTeam?.name || '').toLowerCase();
    const awayName = String(match.awayTeam?.name || '').toLowerCase();

    const matchesSearch =
      activeSearch === '' ||
      title.includes(activeSearch) ||
      league.includes(activeSearch) ||
      category.includes(activeSearch) ||
      homeName.includes(activeSearch) ||
      awayName.includes(activeSearch);

    return matchesCategory && matchesLeague && matchesSearch;
  });

  // Group Matches by League
  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const league = match.league || 'Other Leagues';
    if (!acc[league]) {
      acc[league] = [];
    }
    acc[league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Order grouped leagues: hardcoded first, then dynamic alphabetically
  const orderedLeagueNames = Object.keys(groupedMatches).sort((a, b) => {
    const aIndex = TOP_LEAGUES.findIndex((l) => l.name.toLowerCase() === a.toLowerCase());
    const bIndex = TOP_LEAGUES.findIndex((l) => l.name.toLowerCase() === b.toLowerCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return {
    matches,
    isLoading,
    error,
    categoryParam,
    leagueParam,
    updateUrlParams,
    sortedDynamicLeagues,
    leagueCounts,
    filteredMatches,
    groupedMatches,
    orderedLeagueNames,
    fetchLiveMatches,
    TOP_LEAGUES,
    searchParams,
  };
};
