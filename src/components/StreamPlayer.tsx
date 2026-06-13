import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ShieldAlert, Tv, Eye, Settings } from 'lucide-react';
import type { Match } from '../types/index';

interface StreamPlayerProps {
  match: Match;
}

const extractIframeSrc = (raw: string): string => {
  if (typeof raw !== 'string') return '';
  const match = raw.match(/<iframe[^>]*src=["']([^"']+)["']/i);
  return match?.[1] || '';
};

const resolveStreamSource = (raw: string): { type: 'iframe' | 'video' | 'none'; src: string } => {
  const value = String(raw || '').trim();
  if (!value) {
    return { type: 'none', src: '' };
  }

  const iframeSrc = extractIframeSrc(value);
  if (iframeSrc) {
    return { type: 'iframe', src: iframeSrc };
  }

  const isDirectVideo = /\.(mp4|webm|ogg|m3u8|mov)(\?|$)/i.test(value) || value.startsWith('blob:');
  return isDirectVideo ? { type: 'video', src: value } : { type: 'iframe', src: value };
};

const StreamPlayer: React.FC<StreamPlayerProps> = ({ match }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [resolution, setResolution] = useState('1080p HD');
  const [showSettings, setShowSettings] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const isLive = match.status === 'live';
  const streamSource = resolveStreamSource(match.streamUrl);
  const isIframeStream = streamSource.type === 'iframe';
  const hasStream = streamSource.type !== 'none' && !!streamSource.src;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerContainerRef.current.requestFullscreen().catch(() => { });
      }
    }
  };

  const handleQualityChange = (quality: string) => {
    setResolution(quality);
    setShowSettings(false);
  };

  // Reset states when match id changes
  useEffect(() => {
    setStreamError(false);
    setIsPlaying(true);
  }, [match.id]);

  return (
    <div
      ref={playerContainerRef}
      className="relative w-full aspect-video bg-[#040507] rounded-xl overflow-hidden border border-white/[0.06] shadow-xl group"
      onMouseLeave={() => setShowSettings(false)}
    >
      {/* 1. Pre-match Offline Slate for Upcoming Matches */}
      {!isLive ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md brightness-[0.15]"
            style={{ backgroundImage: match.thumbnail ? `url(${match.thumbnail})` : 'none' }}
          />
          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-[480px]">
            <div className="w-[64px] h-[64px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(62,96,244,0.2)]">
              <Tv size={28} className="text-primary animate-pulse" />
            </div>

            <h3 className="text-base font-black text-white mb-2 uppercase tracking-wider">Stream Offline</h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Pre-match studio analysis for <strong className="text-white">{match.homeTeam?.name || '-'} vs {match.awayTeam?.name || '-'}</strong> will begin approximately 30 minutes before kick-off.
            </p>

            <div className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded">
              Scheduled: {match.startTime ? new Date(match.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Fixture Pending'}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Playable Stream Frame for Live Matches */
        <div className="relative w-full h-full bg-black">
          {streamError || !hasStream ? (
            /* Error display slate */
            <div className="absolute inset-0 bg-[#08090c]/98 z-10 flex flex-col items-center justify-center p-6 text-center">
              <ShieldAlert size={40} className="text-red-500 mb-3" />
              <h3 className="text-sm font-extrabold text-white mb-1.5">Stream Source Offline</h3>
              <p className="text-xs text-slate-400 max-w-[380px] leading-relaxed">
                {hasStream
                  ? 'We are experiencing trouble connecting to the SportsRC video network. Please reload the page or switch channels.'
                  : 'The API provider has not attached a live video source for this match yet.'}
              </p>
            </div>
          ) : (
            /* Player elements */
            <div className="w-full h-full relative">
              {isIframeStream ? (
                <iframe
                  title={match.title || 'Live Stream Embed'}
                  src={streamSource.src}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  onError={() => setStreamError(true)}
                  className="w-full h-full border-none bg-black"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={streamSource.src}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  loop
                  onError={() => setStreamError(true)}
                  className="w-full h-full object-cover bg-black"
                />
              )}

              {/* Hover-revealed Control Overlays */}
              <div className="absolute inset-0 pointer-events-none z-10">

                {/* Top Overlay details */}
                {/* <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/85 via-black/40 to-transparent p-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                  <span className="badge-live-pulse text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live Stream
                  </span>
                  
                  <span className="text-xs font-bold text-white truncate flex-grow">
                    {match.title || `${match.homeTeam?.name} vs ${match.awayTeam?.name}`}
                  </span>
                  
                  <span className="flex items-center gap-1 bg-black/45 px-2 py-1 rounded text-[9px] font-bold text-slate-400 shrink-0">
                    <Eye size={11} />
                    <span>{match.views ? `${match.views} viewers` : 'Live'}</span>
                  </span>
                </div> */}

                {/* Bottom Player Overlay controls */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">

                  {/* Progress Indicator line */}
                  <div className="w-full h-1 bg-white/20 rounded overflow-hidden">
                    <div className="w-full h-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                  </div>

                  {/* Actions buttons row */}
                  <div className="flex justify-between items-center w-full">
                    {/* Left Actions controls */}
                    <div className="flex items-center gap-4">
                      {!isIframeStream && (
                        <>
                          <button
                            onClick={handlePlayPause}
                            className="text-white hover:text-primary p-0.5 active:scale-95 transition-all"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                          </button>

                          <button
                            onClick={handleMuteUnmute}
                            className="text-white hover:text-primary p-0.5 active:scale-95 transition-all"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                          </button>
                        </>
                      )}

                      <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[8px] font-black text-red-500 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                        <span>LIVE NOW</span>
                      </div>
                    </div>

                    {/* Right Actions controls */}
                    <div className="flex items-center gap-3">

                      {/* Quality selection dropdown menu */}
                      {!isIframeStream && (
                        <div className="relative">
                          <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="flex items-center gap-1 text-[9px] font-bold text-white hover:text-primary p-0.5 transition-colors"
                          >
                            <Settings size={15} />
                            <span>{resolution}</span>
                          </button>

                          {showSettings && (
                            <div className="absolute bottom-[24px] right-0 bg-[#181c28]/95 backdrop-blur-xl border border-white/[0.08] p-1 rounded-md min-w-[120px] flex flex-col gap-0.5 z-30 shadow-xl">
                              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 border-b border-white/[0.04] mb-1">Quality</div>
                              {(['1080p HD', '720p', '480p'] as const).map((q) => (
                                <button
                                  key={q}
                                  onClick={() => handleQualityChange(q)}
                                  className={`text-[9px] font-bold text-left px-2 py-1.5 rounded w-full transition-colors ${resolution === q
                                      ? 'text-primary bg-primary/10'
                                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                                    }`}
                                >
                                  {q} {q === '1080p HD' ? '(60FPS)' : ''}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-primary p-0.5 active:scale-95 transition-all"
                        aria-label="Fullscreen"
                      >
                        <Maximize size={16} />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
