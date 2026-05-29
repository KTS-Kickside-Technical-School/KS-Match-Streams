import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock } from 'lucide-react';
import type { Match } from '../types/index';

interface MatchCardProps {
  match?: Match;
  isLoading?: boolean;
}

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatMatchDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (isToday(date)) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mb-0.5">TODAY</span>
        <span className="text-sm font-black text-white tracking-wide">{timeStr}</span>
      </div>
    );
  } else {
    const day = date.getDate();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthStr = months[date.getMonth()];

    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return (
      <div className="flex flex-col items-center">
        <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider mb-0.5">
          {day}{suffix}.{monthStr}
        </span>
        <span className="text-xs font-bold text-white/90">{timeStr}</span>
      </div>
    );
  }
};

const MatchCard: React.FC<MatchCardProps> = ({ match, isLoading = false }) => {
  const [countdown, setCountdown] = useState('');

  // Format start time countdown for upcoming games
  useEffect(() => {
    if (isLoading || !match || match.status === 'live' || !match.startTime) return;

    const calculateCountdown = () => {
      const difference = +new Date(match.startTime!) - +new Date();
      if (difference <= 0) {
        setCountdown('Starting soon...');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setCountdown(`In ${days} day${days > 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setCountdown(`In ${hours}h ${minutes}m`);
      } else {
        setCountdown(`In ${minutes}m`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [match?.startTime, match?.status, isLoading]);

  // Row Loading Skeleton
  if (isLoading) {
    return (
      <div className="bg-[#181c28] border border-white/[0.06] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 min-h-[90px] sm:h-[80px] animate-pulse w-full">
        <div className="w-24 shrink-0 h-8 bg-slate-800 rounded hidden sm:block" />
        <div className="flex-grow flex flex-col gap-2.5 w-full">
          <div className="h-3.5 bg-slate-800 rounded w-2/3" />
          <div className="h-3.5 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="w-full sm:w-28 shrink-0 h-8 bg-slate-800 rounded-lg mt-2 sm:mt-0" />
      </div>
    );
  }

  if (!match) return null;

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const hasStarted = isLive || isFinished;

  return (
    <Link
      to={`/watch/${match.id}`}
      className={`relative bg-[#181c28] border border-white/[0.06] hover:border-primary/40 rounded-xl p-4 flex flex-col sm:flex-row items-stretch gap-3 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-primary/5 cursor-pointer group select-none overflow-hidden w-full ${
        isLive ? 'border-l-[5px] border-l-red-500 bg-red-500/[0.01]' : ''
      }`}
    >
      {/* Subtle cover image background glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.015] pointer-events-none z-0 rounded-xl"
        style={{ backgroundImage: match.thumbnail ? `url(${match.thumbnail})` : 'none' }}
      />

      {/* 1st Column: Time/Status Indicator */}
      <div className="w-full sm:w-28 shrink-0 flex sm:flex-col items-center justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-white/[0.04] pb-2.5 sm:pb-0 sm:pr-3 gap-1 relative z-10">
        {isLive ? (
          <>
            <span className="badge-live-pulse flex items-center text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
              Live
            </span>
            <span className="text-xs font-black text-primary animate-pulse-live-indicator shrink-0">
              {match.minute || 'LIVE'}
            </span>
          </>
        ) : (
          <>
            <div className="shrink-0">{formatMatchDate(match.startTime)}</div>
            <span className="bg-white/[0.03] text-slate-400 border border-white/[0.06] text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shrink-0 mt-0.5">
              <Clock size={8} className="shrink-0" />
              <span>{countdown || 'fixtures'}</span>
            </span>
          </>
        )}
      </div>

      {/* 2nd Column: Teams & Scores */}
      <div className="flex flex-col gap-2.5 flex-grow justify-center pl-0 sm:pl-3 relative z-10 py-1">
        {/* Home Team */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3.5 truncate mr-4">
            <img
              src={match.homeTeam?.logo || ''}
              alt={match.homeTeam?.name}
              className="w-6 h-6 rounded-full object-cover border border-white/[0.08] shrink-0 bg-slate-900"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://sportsrc.org/img/sport/badge/fallback.png';
              }}
            />
            <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-primary transition-colors duration-200">
              {match.homeTeam?.name || '-'}
            </span>
          </div>
          {hasStarted && (
            <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded shrink-0">
              {match.homeTeam?.score ?? 0}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3.5 truncate mr-4">
            <img
              src={match.awayTeam?.logo || ''}
              alt={match.awayTeam?.name}
              className="w-6 h-6 rounded-full object-cover border border-white/[0.08] shrink-0 bg-slate-900"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://sportsrc.org/img/sport/badge/fallback.png';
              }}
            />
            <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-primary transition-colors duration-200">
              {match.awayTeam?.name || '-'}
            </span>
          </div>
          {hasStarted && (
            <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded shrink-0">
              {match.awayTeam?.score ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* 3rd Column: League name */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 sm:border-l border-white/[0.04] pt-2.5 sm:pt-0 sm:pl-4 min-w-full sm:min-w-[130px] shrink-0 relative z-10">
        <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider truncate max-w-[120px]">
          <Trophy size={10} className="text-primary shrink-0" />
          <span className="truncate">{match.league}</span>
        </span>
        
        {isLive && (
          <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md mt-1.5 shrink-0 animate-pulse hidden sm:inline-block">
            Watch Live →
          </span>
        )}
      </div>
    </Link>
  );
};

export default MatchCard;
