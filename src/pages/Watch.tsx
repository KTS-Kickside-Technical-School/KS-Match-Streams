import React from 'react';
import { Link } from 'react-router-dom';
import { useWatchMatch } from '../hooks/useWatchMatch';
import StreamPlayer from '../components/StreamPlayer';
import { 
  Trophy, Users, ShieldAlert, Sparkles, Tv, 
  BarChart3, MessageSquare, ChevronRight, ArrowLeft 
} from 'lucide-react';

const Watch: React.FC = () => {
  const {
    match,
    relatedMatches,
    isLoading,
    error,
    chatMessages,
    statRows,
    formatStatValue,
    toNumeric,
    ENABLE_STATS_AND_CHAT,
  } = useWatchMatch();

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="w-full aspect-video bg-slate-800 rounded-xl" />
          <div className="h-6 bg-slate-800 rounded w-1/3 mt-2" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-4/5" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="h-[250px] bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <ShieldAlert size={52} className="text-red-500 mb-4" />
        <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">Watch Stream Unavailable</h2>
        <p className="text-slate-400 text-xs max-w-[360px] leading-relaxed mb-6">
          {error || 'The match stream could not be loaded. It may have expired or is not currently active.'}
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all"
        >
          <ArrowLeft size={14} />
          <span>Return to Match Center</span>
        </Link>
      </div>
    );
  }

  const isLive = match.status === 'live';

  return (
    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
      
      {/* Back button row */}
      <div className="mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Match Center</span>
        </Link>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Player & Meta details */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          
          {/* Active Stream Player */}
          <StreamPlayer match={match} />

          {/* Match Info Card */}
          <div className="bg-[#11141e] border border-white/[0.05] rounded-xl p-4 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                <Trophy size={12} className="text-primary shrink-0" />
                <span className="truncate">{match.league}</span>
              </div>
              {isLive ? (
                <span className="badge-live-pulse text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Stream
                </span>
              ) : (
                <span className="bg-white/[0.03] text-slate-400 border border-white/[0.06] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Upcoming Event
                </span>
              )}
            </div>

            <h1 className="text-lg md:text-2xl font-black text-white mb-2 leading-snug">
              {match.homeTeam?.name || '-'} <span className="text-slate-500 font-light mx-1">vs</span> {match.awayTeam?.name || '-'}
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {match.description || 'Enjoy live, lag-free match streaming channels in high-definition (HD 1080p) provided by SportSRC. Support our platform by sharing streams with other sports fans!'}
            </p>

            {/* Stadium / referee information */}
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 border-t border-white/[0.04] pt-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>Venue: <strong className="text-slate-400">{match.spectators || 'International Broadcast'}</strong></span>
              </div>
              <div className="text-white/5">|</div>
              <div className="flex items-center gap-1">
                <Trophy size={12} />
                <span>Referee: <strong className="text-slate-400">{match.referee || 'Official Referee'}</strong></span>
              </div>
            </div>
          </div>

          {/* ========================================================
              LIVE STATISTICS PANEL - Conditionally rendered
              ======================================================== */}
          {ENABLE_STATS_AND_CHAT && (
            <div className="bg-[#11141e] border border-white/[0.05] rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={15} className="text-primary" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Live Match Statistics</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                {statRows.length > 0 ? (
                  statRows.map((stat, index) => {
                    const homeValue = formatStatValue(stat.home);
                    const awayValue = formatStatValue(stat.away);
                    const homeNumeric = toNumeric(homeValue);
                    const awayNumeric = toNumeric(awayValue);
                    const total = (homeNumeric ?? 0) + (awayNumeric ?? 0);
                    const width = total > 0 ? `${Math.max(0, Math.min(100, Math.round((homeNumeric! / total) * 100)))}%` : '50%';

                    return (
                      <div key={`${stat.name}-${index}`} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-bold text-white">
                          <span>{homeValue}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{stat.name}</span>
                          <span>{awayValue}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.04] rounded overflow-hidden">
                          <div className="h-full bg-primary rounded" style={{ width }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-500 text-center py-4">No live statistics provided by API for this match.</div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Related matches sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">

          {/* ========================================================
              SPECTATOR LIVE CHAT PANEL - Conditionally rendered
              ======================================================== */}
          {ENABLE_STATS_AND_CHAT && (
            <div className="bg-[#11141e] border border-white/[0.05] rounded-xl flex flex-col h-[350px] overflow-hidden shadow-md">
              <div className="bg-white/[0.02] border-b border-white/[0.05] p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-primary" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Spectator Live Chat</span>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded text-[8px] font-bold text-primary">
                  <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  <span>Live Feed</span>
                </div>
              </div>

              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-2.5 scrollbar-thin">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs leading-relaxed break-words">
                      <span className="text-[9px] text-slate-500 mr-1.5 font-mono">{msg.time}</span>
                      <span className={`font-bold mr-1.5 ${msg.isMod ? 'text-red-500 bg-red-500/10 px-1 py-0.2 rounded scale-90' : 'text-purple-400'}`}>
                        {msg.user}:
                      </span>
                      <span className="text-slate-300">{msg.text}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 text-center py-10 my-auto">No chat messages provided by API for this match.</div>
                )}
              </div>
            </div>
          )}

          {/* Related Streams Section */}
          {relatedMatches.length > 0 && (
            <div className="bg-[#11141e] border border-white/[0.05] rounded-xl p-3 shadow-md">
              
              <div className="flex items-center gap-2 mb-3 px-1 pb-2 border-b border-white/[0.04]">
                <Sparkles size={14} className="text-primary" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Related Streams</h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {relatedMatches.map(rel => (
                  <Link 
                    to={`/watch/${rel.id}`} 
                    key={rel.id} 
                    className="flex items-center p-1.5 rounded-lg border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] gap-3 transition-all duration-200 group"
                  >
                    <img 
                      src={rel.thumbnail} 
                      alt={rel.title} 
                      className="w-14 aspect-[16/10] object-cover rounded border border-white/[0.05] shrink-0" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://sportsrc.org/img/sport/badge/fallback.png' }}
                    />
                    
                    <div className="flex-grow overflow-hidden">
                      <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider truncate">{rel.league}</div>
                      <div className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors leading-snug">{rel.title}</div>
                      <div className="text-[9px] mt-0.5">
                        {rel.status === 'live' ? (
                          <span className="text-primary font-bold animate-pulse-live-indicator">LIVE • {rel.minute || 'NOW'}</span>
                        ) : (
                          <span className="text-slate-500">Upcoming Fixture</span>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
                  </Link>
                ))}
              </div>

            </div>
          )}

          {/* Mini Sponsor ad placeholder for side column (300x250 format) */}
          <div className="border border-white/[0.04] bg-[#11141e]/20 p-3 rounded-xl text-center flex flex-col gap-1.5 select-none mt-1">
            <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">Sidebar Sponsor Card</span>
            <div className="aspect-[4/3] rounded border border-dashed border-white/[0.08] flex items-center justify-center flex-col p-3 bg-black/10">
              <span className="text-slate-500 text-[10px] font-bold">Advertise With Us</span>
              <span className="text-slate-600 text-[9px] mt-0.5">300x250 Banner Space</span>
            </div>
            <a href="mailto:sponsors@kickside.com" className="text-[8px] font-bold text-primary hover:underline mt-0.5">sponsors@kickside.com</a>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Watch;
