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

export const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const useHomeMatches = (searchValue: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date Filtering State (Today by default)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // React Router URL Sync
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL values (defaults to all)
  const categoryParam = searchParams.get('category') || 'all';
  const leagueParam = searchParams.get('league') || 'all-leagues';
  const statusParam = searchParams.get('status') || 'all'; // 'all' or 'live'

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllMatches();
      setMatches(data);
    } catch (err: any) {
      setError('Unable to synchronize live sports streams. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Poll API for score updates every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic SEO Page Meta updates
  useEffect(() => {
    const activeSearch = searchParams.get('search');
    if (activeSearch) {
      document.title = `Search results for "${activeSearch}" - Kickside Match Center`;
    } else if (categoryParam !== 'all') {
      document.title = `${categoryParam.toUpperCase()} Live Streams & Schedules - Kickside`;
    } else if (leagueParam !== 'all-leagues') {
      const activeLeague = TOP_LEAGUES.find((l) => l.id === leagueParam);
      const name = activeLeague ? activeLeague.name : leagueParam;
      document.title = `${name} Streams & Scores - Kickside`;
    } else {
      document.title = 'Kickside | Live Sports Stream & Match Center';
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Watch live sports match streams, check upcoming fixtures, and follow real-time scores on Kickside Match Center. Ad-prepared and lag-free streaming.'
      );
    }
  }, [categoryParam, leagueParam, searchParams]);

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

  // Toggling status parameter
  const toggleLiveStatus = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (statusParam === 'live') {
      nextParams.delete('status');
    } else {
      nextParams.set('status', 'live');
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

  // Extract dynamic leagues present in current loaded matches
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

  // Date Shifts helper
  const shiftDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

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

    // 3. Live status filter
    const matchesStatus = statusParam === 'all' || match.status === 'live';

    // 4. Date filter (governs schedules and live matches)
    const matchDate = match.startTime ? new Date(match.startTime) : null;
    let matchesDate = false;
    if (matchDate) {
      matchesDate = isSameDay(matchDate, selectedDate);
    } else {
      // If no start time and it is live, display only on Today
      matchesDate = match.status === 'live' && isSameDay(new Date(), selectedDate);
    }

    // 5. Input Search filter
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

    return matchesCategory && matchesLeague && matchesStatus && matchesDate && matchesSearch;
  });

  const liveMatches = filteredMatches.filter((m) => m.status === 'live');
  const upcomingMatches = filteredMatches.filter((m) => m.status === 'upcoming');

  // Group matches by tournament/league
  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const league = match.league || 'Other Tournaments';
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

  // Featured Highlight Hero (only from today's matches or overall live)
  const featuredMatch =
    matches.find((m) => m.status === 'live' && m.category === 'football') ||
    matches.find((m) => m.status === 'live') ||
    filteredMatches.find((m) => m.status === 'upcoming') ||
    filteredMatches[0] ||
    null;

  const totalLiveCount = matches.filter((m) => m.status === 'live').length;

  return {
    matches,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    shiftDate,
    categoryParam,
    leagueParam,
    statusParam,
    updateUrlParams,
    toggleLiveStatus,
    sortedDynamicLeagues,
    leagueCounts,
    filteredMatches,
    liveMatches,
    upcomingMatches,
    groupedMatches,
    orderedLeagueNames,
    featuredMatch,
    totalLiveCount,
    fetchMatches,
    TOP_LEAGUES,
    searchParams,
  };
};
