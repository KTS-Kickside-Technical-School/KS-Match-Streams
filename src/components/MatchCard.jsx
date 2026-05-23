import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Trophy, Eye, Clock } from 'lucide-react';

const MatchCard = ({ match, isLoading = false }) => {
  const [countdown, setCountdown] = useState('');

  // Skeletons rendering
  if (isLoading) {
    return (
      <div style={styles.cardSkeleton}>
        <div className="skeleton" style={styles.skeleHeader}></div>
        <div style={styles.skeleTeams}>
          <div className="skeleton" style={styles.skeleTeamLogo}></div>
          <div className="skeleton" style={styles.skeleTeamName}></div>
        </div>
        <div style={styles.skeleTeams}>
          <div className="skeleton" style={styles.skeleTeamLogo}></div>
          <div className="skeleton" style={styles.skeleTeamName}></div>
        </div>
        <div className="skeleton" style={styles.skeleFooter}></div>
      </div>
    );
  }

  if (!match) return null;

  const isLive = match.status === 'live';

  // Format start time countdown for upcoming games
  useEffect(() => {
    if (isLive || !match.startTime) return;

    const calculateCountdown = () => {
      const difference = +new Date(match.startTime) - +new Date();
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
        setCountdown(`In ${minutes} mins`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [match.startTime, isLive]);

  return (
    <div style={styles.card}>
      {/* Card Widescreen Banner Background Glow */}
      <div style={{ ...styles.cardBgGlow, backgroundImage: `url(${match.thumbnail})` }}></div>

      {/* Top details */}
      <div style={styles.cardHeader}>
        <span style={styles.leagueName}>
          <Trophy size={12} style={{ color: 'var(--accent-green)' }} />
          {match.league}
        </span>
        {isLive ? (
          <span className="badge-live">Live</span>
        ) : (
          <span className="badge-upcoming">
            <Clock size={12} />
            {countdown}
          </span>
        )}
      </div>

      {/* Match core */}
      <div style={styles.teamsContainer}>
        {/* Home Team */}
        <div style={styles.teamRow}>
          <img src={match.homeTeam?.logo || ''} alt={match.homeTeam?.name || 'Home team'} style={styles.teamLogo} />
          <span style={styles.teamName}>{match.homeTeam?.name || '-'}</span>
          {isLive && <span style={styles.teamScore}>{match.homeTeam?.score ?? '-'}</span>}
        </div>

        {/* Separator / vs */}
        {!isLive && <div style={styles.vsText}>VS</div>}

        {/* Away Team */}
        <div style={styles.teamRow}>
          <img src={match.awayTeam?.logo || ''} alt={match.awayTeam?.name || 'Away team'} style={styles.teamLogo} />
          <span style={styles.teamName}>{match.awayTeam?.name || '-'}</span>
          {isLive && <span style={styles.teamScore}>{match.awayTeam?.score ?? '-'}</span>}
        </div>
      </div>

      {/* Card footer/actions */}
      <div style={styles.cardFooter}>
        <div style={styles.matchMeta}>
          {isLive ? (
            <span style={styles.liveClock}>{match.minute}</span>
          ) : (
            <span style={styles.startDate}>
              {match.startTime ? new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
            </span>
          )}
        </div>

        <Link to={`/watch/${match.id}`} style={{ ...styles.actionBtn, ...(isLive ? styles.actionBtnLive : styles.actionBtnUpcoming) }}>
          {isLive ? <Play size={14} fill="currentColor" /> : <Calendar size={14} />}
          <span>{isLive ? 'Watch Live' : 'Match Info'}</span>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    ':hover': {
      transform: 'translateY(-6px)',
      borderColor: 'var(--border-accent)',
      background: 'var(--bg-card-hover)',
      boxShadow: 'var(--shadow-lg)',
    }
  },
  cardBgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.02,
    zIndex: 0,
    pointerEvents: 'none',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1,
  },
  leagueName: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  teamsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
  },
  teamRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  teamLogo: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  teamName: {
    fontSize: '0.94rem',
    fontWeight: '700',
    color: '#ffffff',
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  teamScore: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: 'var(--accent-green)',
    background: 'rgba(0, 255, 102, 0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  vsText: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    alignSelf: 'flex-start',
    marginLeft: '36px',
    letterSpacing: '0.05em',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '14px',
  },
  matchMeta: {
    display: 'flex',
    alignItems: 'center',
  },
  liveClock: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--accent-green)',
    textTransform: 'uppercase',
  },
  startDate: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.82rem',
    fontWeight: '700',
    transition: 'all var(--transition-fast)',
  },
  actionBtnLive: {
    background: 'rgba(0, 255, 102, 0.1)',
    color: 'var(--accent-green)',
    border: '1px solid rgba(0, 255, 102, 0.2)',
    ':hover': {
      background: 'var(--accent-green)',
      color: 'var(--bg-primary)',
    }
  },
  actionBtnUpcoming: {
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#ffffff',
    border: '1px solid var(--border-color)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'var(--border-hover)',
    }
  },

  // Skeleton Styles
  cardSkeleton: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '220px',
    justifyContent: 'space-between',
  },
  skeleHeader: {
    height: '16px',
    width: '60%',
    marginBottom: '20px',
  },
  skeleTeams: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  skeleTeamLogo: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
  },
  skeleTeamName: {
    height: '14px',
    width: '40%',
  },
  skeleFooter: {
    height: '32px',
    width: '100%',
    marginTop: '10px',
  }
};

export default MatchCard;
