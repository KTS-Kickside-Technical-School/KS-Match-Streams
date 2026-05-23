import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, Users, Eye, Sparkles } from 'lucide-react';

const Hero = ({ match }) => {
  if (!match) return null;

  return (
    <section style={{ ...styles.heroSection, backgroundImage: `linear-gradient(rgba(8, 9, 12, 0.4), rgba(8, 9, 12, 0.95)), url(${match.thumbnail})` }}>
      {/* Glow highlight */}
      <div style={styles.radialGlow}></div>

      <div className="container" style={styles.container}>
        {/* Live Accent Tag */}
        <div style={styles.topRow}>
          <div className="badge-live" style={styles.badgeLive}>
            Live Match of the Day
          </div>
          <div style={styles.hotTag}>
            <Flame size={14} color="var(--accent-green)" />
            <span>{match.views ? `${match.views} watching now` : 'Live audience'}</span>
          </div>
        </div>

        {/* League and Titles */}
        <div style={styles.leagueName}>
          <Sparkles size={16} color="var(--accent-green)" />
          <span>{match.league}</span>
        </div>

        <h1 style={styles.title}>
          {match.homeTeam?.name || '-'} <span style={styles.vsText}>vs</span> {match.awayTeam?.name || '-'}
        </h1>

        <p style={styles.description}>
          {match.description || ''}
        </p>

        {/* Scoreboard Preview */}
        <div style={styles.scoreboard}>
          <div style={styles.teamScore}>
            <span style={styles.teamName}>{match.homeTeam?.name || '-'}</span>
            <span style={styles.scoreNumber}>{match.homeTeam?.score ?? '-'}</span>
          </div>
          <div style={styles.scoreDivider}>:</div>
          <div style={styles.teamScore}>
            <span style={styles.scoreNumber}>{match.awayTeam?.score ?? '-'}</span>
            <span style={styles.teamName}>{match.awayTeam?.name || '-'}</span>
          </div>
          <div style={styles.liveClock}>{match.minute}</div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <Link to={`/watch/${match.id}`} style={styles.watchBtn}>
            <Play size={18} fill="currentColor" />
            <span>Watch Live Stream</span>
          </Link>
          <a href="#live-section" style={styles.exploreBtn}>
            <span>View All Matches</span>
          </a>
        </div>

        {/* Quick Stats Overlay */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <Users size={16} />
            <span>Spectators: <strong>{match.spectators || '-'}</strong></span>
          </div>
          <div style={styles.statDivider}>|</div>
          <div style={styles.statItem}>
            <Eye size={16} />
            <span>Rating: <strong>HD 1080p</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  heroSection: {
    position: 'relative',
    minHeight: '520px',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    padding: '80px 0 60px 0',
    overflow: 'hidden',
  },
  radialGlow: {
    position: 'absolute',
    top: '-150px',
    right: '-50px',
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(0, 255, 102, 0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  container: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  badgeLive: {
    boxShadow: '0 0 15px rgba(0, 255, 102, 0.2)',
  },
  hotTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '4px 10px',
    borderRadius: 'var(--border-radius-sm)',
    border: '1px solid var(--border-color)',
  },
  leagueName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.92rem',
    fontWeight: '600',
    color: 'var(--accent-green)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  title: {
    fontSize: '3.2rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    color: '#ffffff',
    lineHeight: '1.1',
    maxWidth: '800px',
    marginBottom: '16px',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    '@media (max-width: 768px)': {
      fontSize: '2.2rem',
    }
  },
  vsText: {
    color: 'var(--text-muted)',
    fontSize: '2rem',
    fontWeight: '300',
    margin: '0 8px',
  },
  description: {
    fontSize: '1.02rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '650px',
    marginBottom: '24px',
  },
  scoreboard: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(24, 28, 40, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '12px 24px',
    borderRadius: 'var(--border-radius-md)',
    gap: '20px',
    marginBottom: '28px',
    boxShadow: 'var(--shadow-md)',
  },
  teamScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  teamName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  scoreNumber: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--accent-green)',
    background: 'rgba(0, 255, 102, 0.1)',
    padding: '2px 10px',
    borderRadius: 'var(--border-radius-sm)',
    minWidth: '38px',
    textAlign: 'center',
  },
  scoreDivider: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
  },
  liveClock: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--bg-primary)',
    background: 'var(--accent-green)',
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  watchBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--accent-green)',
    color: 'var(--bg-primary)',
    padding: '14px 28px',
    borderRadius: 'var(--border-radius-xl)',
    fontSize: '0.98rem',
    fontWeight: '700',
    boxShadow: '0 4px 16px rgba(0, 255, 102, 0.3)',
    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 255, 102, 0.4)',
    }
  },
  exploreBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: 'var(--border-radius-xl)',
    fontSize: '0.98rem',
    fontWeight: '600',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'var(--border-hover)',
    }
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statDivider: {
    color: 'rgba(255, 255, 255, 0.05)',
  }
};

export default Hero;
