import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import MatchCard from '../components/MatchCard';
import CategoryBar from '../components/CategoryBar';
import type { Match } from '../types/index';
import { Trophy, Tv, RefreshCw, AlertTriangle, Star } from 'lucide-react';

interface LiveProps {
  searchValue: string;
}

// Preset Leagues list on the Left Sidebar
const TOP_LEAGUES = [
  { id: 'all-leagues', name: 'All Leagues', icon: '🏆' },
  { id: 'world-cup', name: 'World Cup', icon: '🌎' },
  { id: 'premier-league', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la-liga', name: 'La Liga', icon: '🇪🇸' },
  { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
  { id: 'serie-a', name: 'Serie A', icon: '🇮🇹' },
  { id: 'champions-league', name: 'UEFA Champions League', icon: '🇪🇺' },
  { id: 'nba', name: 'NBA', icon: '🏀' },
  { id: 'ufc', name: 'UFC / MMA', icon: '🥊' },
];

const Live: React.FC<LiveProps> = ({ searchValue }) => {
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

  // Dynamic SEO Page Meta Updating (Requirement 7)
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

  // Extract dynamic leagues present in current live matches (Requirement 6)
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

  // Group Matches by League (Requirement 5)
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* CategoryBar below Navbar */}
      <CategoryBar
        activeCategory={categoryParam}
        onSelectCategory={(id) => updateUrlParams('category', id)}
        matches={matches}
      />

      <main className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex-grow">
        {/* Responsive 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* =======================================================
              COLUMN 1: SIDEBAR - Top & Dynamic Leagues
              ======================================================= */}
          <aside className="lg:col-span-3 bg-[#11141e] border border-white/[0.05] rounded-xl p-3 shadow-md flex flex-col gap-3 lg:sticky lg:top-[144px]">

            <div className="flex items-center gap-2 px-1 pb-2 border-b border-white/[0.04]">
              <Trophy size={14} className="text-primary" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Top Leagues</h3>
            </div>

            {/* Desktop Top Leagues List */}
            <div className="hidden lg:flex flex-col gap-1">
              {TOP_LEAGUES.map((league) => (
                <button
                  key={league.id}
                  onClick={() => updateUrlParams('league', league.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-left transition-all ${leagueParam === league.id
                      ? 'bg-primary text-[#08090c] shadow-sm shadow-primary/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                >
                  <span className="text-sm shrink-0 leading-none">{league.icon}</span>
                  <span className="truncate">{league.name}</span>
                </button>
              ))}
            </div>

            {/* Tablet/Mobile Horizontal Top Leagues */}
            <div className="flex lg:hidden overflow-x-auto gap-2 pb-1 scrollbar-none select-none">
              {TOP_LEAGUES.map((league) => (
                <button
                  key={league.id}
                  onClick={() => updateUrlParams('league', league.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${leagueParam === league.id
                      ? 'bg-primary text-[#08090c] border-primary'
                      : 'bg-white/[0.02] text-slate-400 border-white/[0.05]'
                    }`}
                >
                  <span>{league.icon}</span>
                  <span>{league.name}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Other Leagues bottom integration (Requirement 6) */}
            {sortedDynamicLeagues.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-1 pb-1 pt-2 border-t border-white/[0.04] mt-1">
                  <Star size={12} className="text-slate-400" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Other Active Leagues
                  </h3>
                </div>

                <div className="hidden lg:flex flex-col gap-1">
                  {sortedDynamicLeagues.map((league) => (
                    <button
                      key={league}
                      onClick={() => updateUrlParams('league', league)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-left transition-all ${leagueParam.toLowerCase() === league.toLowerCase()
                          ? 'bg-primary text-[#08090c] shadow-sm shadow-primary/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-sm shrink-0 leading-none">🌎</span>
                        <span className="truncate">{league}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded scale-90 font-bold ${leagueParam.toLowerCase() === league.toLowerCase()
                            ? 'bg-[#08090c]/20 text-[#08090c]'
                            : 'bg-white/[0.03] text-slate-500'
                          }`}
                      >
                        {leagueCounts[league] || 0}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex lg:hidden overflow-x-auto gap-2 pb-1 scrollbar-none select-none">
                  {sortedDynamicLeagues.map((league) => (
                    <button
                      key={league}
                      onClick={() => updateUrlParams('league', league)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${leagueParam.toLowerCase() === league.toLowerCase()
                          ? 'bg-primary text-[#08090c] border-primary'
                          : 'bg-white/[0.02] text-slate-400 border-white/[0.05]'
                        }`}
                    >
                      <span>🌎</span>
                      <span>{league}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Sidebar Sponsored Ad */}
            <div className="hidden lg:flex flex-col border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] p-3 rounded-lg text-center gap-1.5 transition-colors mt-2">
              <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">Sponsored Space</span>
              <div className="aspect-[4/3] rounded border border-dashed border-white/[0.08] flex items-center justify-center flex-col p-3 bg-black/20">
                <span className="text-slate-500 text-[10px] font-bold">Advertise With Us</span>
                <span className="text-slate-600 text-[9px] mt-0.5">300x250 Banner Space</span>
              </div>
              <a
                href="mailto:sponsors@kickside.com"
                className="text-[8px] font-bold text-primary hover:underline mt-1"
              >
                sponsors@kickside.com
              </a>
            </div>

          </aside>

          {/* =======================================================
              COLUMN 2: MAIN PANEL - Feeds grouped by Leagues
              ======================================================= */}
          <section className="lg:col-span-9 flex flex-col gap-4 w-full">
            {/* Sync Header row */}
            <div className="flex justify-between items-center bg-[#11141e] border border-white/[0.05] p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 truncate pr-2">
                <Tv size={15} className="text-primary shrink-0 animate-pulse" />
                <h2 className="text-xs font-black text-white uppercase tracking-wider truncate">
                  {searchParams.get('search')
                    ? `Searching active streams for "${searchParams.get('search')}"`
                    : 'Active Live Broadcast Feeds'}
                </h2>
              </div>

              <button
                onClick={fetchLiveMatches}
                className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-slate-300 hover:text-white px-3.5 py-1.5 rounded-md text-[10px] font-bold active:scale-95 transition-all shrink-0"
              >
                <RefreshCw size={11} className={isLoading ? 'spinning' : ''} />
                <span>Sync Board</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/5 border border-red-500/10 rounded-xl gap-2">
                <AlertTriangle size={32} className="text-red-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Sync Connection Issue</h3>
                <p className="text-xs text-slate-400 max-w-[360px] leading-relaxed">{error}</p>
                <button
                  onClick={fetchLiveMatches}
                  className="mt-2 flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
                >
                  <RefreshCw size={12} />
                  <span>Retry Feed</span>
                </button>
              </div>
            )}

            {/* Skeletons Loading */}
            {isLoading && (
              <div className="flex flex-col gap-5">
                <div className="h-5 bg-slate-800 rounded w-1/4 animate-pulse mt-2" />
                <div className="flex flex-col gap-4">
                  <MatchCard isLoading={true} />
                  <MatchCard isLoading={true} />
                </div>
              </div>
            )}

            {/* Live Matches List grouped by leagues (Requirement 5) */}
            {!error && !isLoading && (
              <div className="flex flex-col gap-6">
                {filteredMatches.length > 0 ? (
                  orderedLeagueNames.map((league) => {
                    const leagueMatches = groupedMatches[league];
                    if (!leagueMatches || leagueMatches.length === 0) return null;

                    return (
                      <div key={league} className="flex flex-col gap-3">
                        {/* League Divider Header */}
                        <div className="flex justify-between items-center pb-2 border-b border-white/[0.04] mt-2">
                          <div className="flex items-center gap-2">
                            <Trophy size={13} className="text-primary" />
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">
                              {league}
                            </h3>
                          </div>
                          <span className="text-[9px] font-black text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
                            {leagueMatches.length} Active Stream{leagueMatches.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* List of row cards inside that league */}
                        <div className="flex flex-col gap-3">
                          {leagueMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-[#11141e]/30 border border-white/[0.04] rounded-xl text-center">
                    <Tv size={36} className="text-slate-600 mb-2" />
                    <h4 className="text-xs font-extrabold text-white uppercase">No Active Live Streams</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[320px] leading-relaxed">
                      There are currently no active live matches broadcasting under the selected filters.
                      Explore upcoming matches on the home page!
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Live;
