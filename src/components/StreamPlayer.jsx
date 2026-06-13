import React, { useState, useRef, useEffect } from 'react';
import { Maximize, ShieldAlert, Tv, Eye } from 'lucide-react';

const extractIframeSrc = (raw) => {
  if (typeof raw !== 'string') return '';
  const match = raw.match(/<iframe[^>]*src=["']([^"']+)["']/i);
  return match?.[1] || '';
};

const resolveStreamSource = (raw) => {
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

const StreamPlayer = ({ match }) => {
  const [streamError, setStreamError] = useState(false);
  const playerContainerRef = useRef(null);

  if (!match) return null;

  const isLive = match.status === 'live';
  const streamSource = resolveStreamSource(match.streamUrl);
  const hasStream = streamSource.type !== 'none' && !!streamSource.src;
  const streamSrc = streamSource.src;

  const handleFullscreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerContainerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  // Reset error when match changes
  useEffect(() => {
    setStreamError(false);
  }, [match.id]);

  return (
    <div 
      ref={playerContainerRef}
      style={styles.playerContainer}
    >
      {/* If the match is upcoming, show pre-match screen */}
      {!isLive ? (
        <div style={styles.upcomingScreen}>
          <div style={{ ...styles.upcomingBackdrop, backgroundImage: `linear-gradient(rgba(8, 9, 12, 0.8), rgba(8, 9, 12, 0.95)), url(${match.thumbnail})` }}></div>
          <div style={styles.upcomingContent}>
            <div style={styles.upcomingIconWrapper}>
              <Tv size={36} color="var(--accent-green)" />
            </div>
            <h3 style={styles.upcomingTitle}>Stream Offline</h3>
            <p style={styles.upcomingSubtitle}>
              Pre-match studio coverage for <strong>{match.homeTeam.name} vs {match.awayTeam.name}</strong> will begin approximately 30 minutes before kick-off.
            </p>
            <div style={styles.upcomingTimeBadge}>
              Scheduled: {new Date(match.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        </div>
      ) : (
        /* If live, show stream */
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {streamError || !hasStream ? (
            <div style={styles.errorOverlay}>
              <ShieldAlert size={48} color="#ef4444" />
              <h3 style={styles.errorTitle}>{hasStream ? 'Stream Connection Failed' : 'Stream Not Available Yet'}</h3>
              <p style={styles.errorText}>
                {hasStream
                  ? 'We are experiencing issues connecting to the SportsRC stream server. Please try refreshing or switching servers.'
                  : 'This live fixture currently has no playable stream source from API.'}
              </p>
            </div>
          ) : (
            /* SportsRC stream source renderer */
            <div style={{ width: '100%', height: '100%', background: '#000000' }}>
              {streamSource.type === 'iframe' ? (
                <iframe
                  title={match.title || 'Live Stream'}
                  src={streamSrc}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  onError={() => setStreamError(true)}
                  style={styles.iframeElement}
                />
              ) : (
                <video
                  src={streamSrc}
                  controls
                  autoPlay
                  playsInline
                  loop
                  onError={() => setStreamError(true)}
                  style={styles.videoElement}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  playerContainer: {
    width: '100%',
    aspectRatio: '16/9',
    background: '#040507',
    borderRadius: 'var(--border-radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative',
  },
  upcomingScreen: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px) brightness(0.2)',
    zIndex: 0,
  },
  upcomingContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '30px',
    maxWidth: '520px',
  },
  upcomingIconWrapper: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    background: 'rgba(0, 255, 102, 0.08)',
    border: '1px solid rgba(0, 255, 102, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: 'var(--shadow-glow)',
  },
  upcomingTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  upcomingSubtitle: {
    fontSize: '0.94rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  upcomingTimeBadge: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--accent-green)',
    background: 'rgba(0, 255, 102, 0.08)',
    border: '1px solid rgba(0, 255, 102, 0.2)',
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-sm)',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(8, 9, 12, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    textAlign: 'center',
    zIndex: 5,
  },
  errorTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#ffffff',
    marginTop: '16px',
    marginBottom: '10px',
  },
  errorText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    maxWidth: '440px',
    lineHeight: '1.5',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  iframeElement: {
    width: '100%',
    height: '100%',
    border: 'none',
    background: '#000000',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    background: 'linear-gradient(to bottom, rgba(8, 9, 12, 0.9) 0%, transparent 100%)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    zIndex: 2,
  },
  topLiveBadge: {
    fontSize: '0.7rem',
    padding: '3px 8px',
  },
  streamTitle: {
    fontSize: '0.94rem',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  streamStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '4px 10px',
    borderRadius: '4px',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'linear-gradient(to top, rgba(8, 9, 12, 0.95) 0%, rgba(8, 9, 12, 0.4) 70%, transparent 100%)',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    zIndex: 2,
  },
  progressBarWrapper: {
    width: '100%',
    cursor: 'pointer',
    padding: '4px 0',
  },
  progressBarBg: {
    width: '100%',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBarLiveFill: {
    width: '100%', // Live stream is always 100% full
    height: '100%',
    background: 'var(--accent-green)',
    boxShadow: 'var(--shadow-glow)',
  },
  controlButtonsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  rightControlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  controlBtn: {
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
    transition: 'all var(--transition-fast)',
    padding: '4px',
    ':hover': {
      opacity: 1,
      color: 'var(--accent-green)',
      transform: 'scale(1.05)',
    }
  },
  liveClockBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#ef4444',
  },
  pulseDot: {
    width: '5px',
    height: '5px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
  },
  settingsDropdown: {
    position: 'absolute',
    bottom: '36px',
    right: 0,
    background: 'rgba(24, 28, 40, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-md)',
    padding: '8px',
    minWidth: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    zIndex: 10,
    boxShadow: 'var(--shadow-md)',
  },
  settingsTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    padding: '4px 8px 6px 8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '4px',
  },
  settingsOption: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    padding: '6px 8px',
    borderRadius: 'var(--border-radius-sm)',
    textAlign: 'left',
    width: '100%',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    }
  },
  settingsOptionActive: {
    color: 'var(--accent-green)',
    background: 'rgba(0, 255, 102, 0.05)',
  }
};

export default StreamPlayer;
