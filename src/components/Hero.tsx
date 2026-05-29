import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, Users, Eye, Sparkles } from 'lucide-react';
import type { Match } from '../types/index';

interface HeroProps {
  match?: Match;
}

const Hero: React.FC<HeroProps> = ({ match }) => {
  if (!match) return null;

  return (
    <section 
      className="relative min-h-[360px] md:min-h-[400px] bg-cover bg-center bg-no-repeat flex items-center py-6 md:py-10 overflow-hidden rounded-xl border border-white/[0.06] mb-4 shadow-lg group"
      style={{ 
        backgroundImage: `linear-gradient(rgba(8, 9, 12, 0.45), rgba(8, 9, 12, 0.98)), url(${match.thumbnail})` 
      }}
    >
      {/* Background brand radial glow highlight */}
      <div className="absolute -top-[120px] -right-[80px] w-[350px] h-[350px] bg-radial-gradient from-primary/5 to-transparent pointer-events-none z-10 animate-pulse-glow" />

      <div className="relative z-20 px-6 md:px-10 flex flex-col items-start w-full">
        
        {/* Top Tag row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="badge-live-pulse text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            Live Highlight Match
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 bg-white/[0.04] px-2.5 py-1 border border-white/[0.08] rounded">
            <Flame size={12} className="text-primary" />
            <span>{match.views ? `${match.views} Watching` : 'High Traffic'}</span>
          </div>
        </div>

        {/* League and titles */}
        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
          <Sparkles size={14} className="animate-spin-slow text-primary" />
          <span>{match.league}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-none mb-3 max-w-[650px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)]">
          {match.homeTeam?.name || '-'} <span className="text-slate-500 font-light text-xl md:text-3xl mx-1.5">vs</span> {match.awayTeam?.name || '-'}
        </h1>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-[550px] mb-5 line-clamp-2">
          {match.description || 'Watch high-definition live coverage of this blockbuster clash. Enjoy multiple high-speed stream channels with zero latency.'}
        </p>

        {/* Compact Live Scoreboard Preview */}
        <div className="flex items-center bg-slate-900/60 backdrop-blur-md border border-white/[0.08] px-4 py-2.5 rounded-lg gap-4 mb-6 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white max-w-[120px] truncate">{match.homeTeam?.name || '-'}</span>
            <span className="text-sm font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded min-w-[30px] text-center">
              {match.homeTeam?.score ?? 0}
            </span>
          </div>
          <div className="text-slate-500 font-bold text-sm leading-none">:</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded min-w-[30px] text-center">
              {match.awayTeam?.score ?? 0}
            </span>
            <span className="text-xs font-bold text-white max-w-[120px] truncate">{match.awayTeam?.name || '-'}</span>
          </div>
          <div className="text-[10px] font-black text-primary animate-pulse pl-2 border-l border-white/[0.08] uppercase">
            {match.minute || 'LIVE'}
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <Link 
            to={`/watch/${match.id}`} 
            className="flex items-center gap-2 bg-primary hover:bg-primary-strong text-[#08090c] px-6 py-3 rounded-full text-xs font-extrabold shadow-lg shadow-primary/10 hover:scale-[1.03] transition-all duration-200"
          >
            <Play size={15} fill="currentColor" />
            <span>Watch Live Stream</span>
          </Link>
          
          <a 
            href="#live-section" 
            className="flex items-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white px-5 py-3 rounded-full text-xs font-bold transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('live-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Matches</span>
          </a>
        </div>

        {/* Bottom Details Row */}
        <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Users size={12} />
            <span>Venue Attendance: <strong>{match.spectators || 'Worldwide Broadcast'}</strong></span>
          </div>
          <div className="text-white/10">|</div>
          <div className="flex items-center gap-1.5">
            <Eye size={12} />
            <span>Format: <strong>Full HD 1080p (60FPS)</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
