import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import StreamPlayer from '../components/StreamPlayer';
import MatchCard from '../components/MatchCard';
import { Trophy, Users, ShieldAlert, Sparkles, Tv, BarChart3, MessageSquare, ChevronRight } from 'lucide-react';

const formatStatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};

const toNumeric = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;

  const cleaned = value.replace('%', '').trim();
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeStatRows = (stats) => {
  if (Array.isArray(stats)) {
    return stats
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const name = item.name || item.label || item.key || item.stat || '';
        const home = item.home ?? item.homeValue ?? item.team1 ?? item.left;
        const away = item.away ?? item.awayValue ?? item.team2 ?? item.right;
        if (!name) return null;
        return { name: String(name), home, away };
      })
      .filter(Boolean);
  }

  if (!stats || typeof stats !== 'object') return [];

  return Object.entries(stats).map(([name, value]) => {
    if (Array.isArray(value)) {
      return { name, home: value[0], away: value[1] };
    }

    if (value && typeof value === 'object') {
      return {
        name,
        home: value.home ?? value.team1 ?? value.left,
        away: value.away ?? value.team2 ?? value.right
      };
    }

    return { name, home: value, away: '-' };
  });
};

const normalizeChatRows = (chatMessages) => {
  if (!Array.isArray(chatMessages)) return [];

  return chatMessages
    .map((msg, index) => {
      if (!msg || typeof msg !== 'object') return null;

      return {
        id: msg.id || msg.messageId || `${msg.user || msg.username || 'user'}-${index}`,
        user: msg.user || msg.username || 'User',
        text: msg.text || msg.message || msg.body || '',
        isMod: Boolean(msg.isMod || msg.mod || msg.role === 'mod' || msg.role === 'moderator'),
        time: msg.time || msg.timestamp || ''
      };
    })
    .filter((msg) => msg && msg.text);
};

const Watch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [relatedMatches, setRelatedMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [statRows, setStatRows] = useState([]);

  // Load match details
  useEffect(() => {
    const loadMatch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiService.getMatchById(id);
        setMatch(data);
        setChatMessages(normalizeChatRows(data.chatMessages));
        setStatRows(normalizeStatRows(data.stats));
        
        // Fetch related matches
        const related = await apiService.getRelatedMatches(data.category, data.id);
        setRelatedMatches(related);
      } catch (err) {
        setError('Match data could not be recovered. The stream might have ended or is restricted.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={styles.watchContainer}>
        {/* Widescreen Skeleton Layout */}
        <div style={styles.leftCol}>
          <div className="skeleton" style={styles.skelePlayer}></div>
          <div className="skeleton" style={styles.skeleTitle}></div>
          <div className="skeleton" style={styles.skeleText}></div>
        </div>
        <div style={styles.rightCol}>
          <div className="skeleton" style={styles.skeleChat}></div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container" style={styles.errorContainer}>
        <ShieldAlert size={56} color="#ef4444" style={{ marginBottom: '20px' }} />
        <h2>Watch Stream Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '10px 0 24px 0', maxWidth: '440px', lineHeight: '1.6' }}>
          {error || 'The match stream could not be loaded. It may have expired or is not currently active.'}
        </p>
        <Link to="/" style={styles.backBtn}>Return to Match Center</Link>
      </div>
    );
  }

  const isLive = match.status === 'live';

  return (
    <div className="container" style={styles.watchContainer}>
      {/* Left Column: Player & Stats */}
      <div style={styles.leftCol}>
        {/* Stream Player */}
        <StreamPlayer match={match} />

        {/* Match General Info */}
        <div style={styles.infoCard}>
          <div style={styles.infoMeta}>
            <div style={styles.leagueName}>
              <Trophy size={14} color="var(--accent-green)" />
              <span>{match.league}</span>
            </div>
            {isLive ? (
              <span className="badge-live">Live Stream</span>
            ) : (
              <span className="badge-upcoming">Upcoming Event</span>
            )}
          </div>

          <h1 style={styles.matchTitle}>
            {match.homeTeam?.name || '-'} <span style={styles.vsMuted}>vs</span> {match.awayTeam?.name || '-'}
          </h1>

          <p style={styles.matchDesc}>{match.description}</p>

          <div style={styles.spectatorsRow}>
            <Users size={16} color="var(--text-muted)" />
            <span>Venue: <strong>{match.spectators || '-'}</strong></span>
            <span>•</span>
            <span>Referee: <strong>{match.referee || '-'}</strong></span>
          </div>
        </div>

        {/* Live Match Stats Panel (API-driven) */}
        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <BarChart3 size={18} color="var(--accent-green)" />
            <h3 style={styles.statsTitle}>Live Match Statistics</h3>
          </div>
          
          <div style={styles.statsList}>
            {statRows.length > 0 ? (
              statRows.map((stat, index) => {
                const homeValue = formatStatValue(stat.home);
                const awayValue = formatStatValue(stat.away);
                const homeNumeric = toNumeric(homeValue);
                const awayNumeric = toNumeric(awayValue);
                const total = (homeNumeric ?? 0) + (awayNumeric ?? 0);
                const width = total > 0 ? `${Math.max(0, Math.min(100, Math.round((homeNumeric / total) * 100)))}%` : '50%';

                return (
                  <div key={`${stat.name}-${index}`} style={styles.statItem}>
                    <div style={styles.statLabels}>
                      <span>{homeValue}</span>
                      <span style={styles.statName}>{stat.name}</span>
                      <span>{awayValue}</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{ ...styles.progressBarFill, width }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.emptyPanelText}>No live statistics provided by API for this match.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Live Chat & Related Matches */}
      <div style={styles.rightCol}>
        {/* Live Interactive Chat */}
        <div style={styles.chatCard}>
          <div style={styles.chatHeader}>
            <MessageSquare size={16} color="var(--accent-green)" />
            <span style={styles.chatTitle}>Spectator Live Chat</span>
            <div style={styles.onlineBadge}>
              <div style={styles.onlineDot}></div>
              <span>{chatMessages.length > 0 ? 'Live Feed' : 'No Feed'}</span>
            </div>
          </div>

          {/* Messages Wrapper */}
          <div style={styles.chatMessagesContainer}>
            {chatMessages.length > 0 ? (
              chatMessages.map((msg) => (
                <div key={msg.id} style={styles.chatMessageRow}>
                  <span style={styles.chatTime}>{msg.time ? `${msg.time}` : ''}</span>
                  <span style={{
                    ...styles.chatUser,
                    ...(msg.isMod ? styles.chatUserMod : {})
                  }}>
                    {msg.user}:
                  </span>
                  <span style={styles.chatText}>{msg.text}</span>
                </div>
              ))
            ) : (
              <div style={styles.emptyPanelText}>No chat messages provided by API for this match.</div>
            )}
          </div>
        </div>

        {/* Related Streams Section */}
        {relatedMatches.length > 0 && (
          <div style={styles.relatedBox}>
            <div style={styles.relatedHeader}>
              <Sparkles size={16} color="var(--accent-green)" />
              <h3 style={styles.relatedTitle}>Related Match Streams</h3>
            </div>
            
            <div style={styles.relatedList}>
              {relatedMatches.map(rel => (
                <Link to={`/watch/${rel.id}`} key={rel.id} style={styles.relatedLinkCard}>
                  <img src={rel.thumbnail} alt={rel.title} style={styles.relatedThumb} />
                  <div style={styles.relatedInfo}>
                    <div style={styles.relatedLeague}>{rel.league}</div>
                    <div style={styles.relatedTeams}>{rel.title}</div>
                    <div style={styles.relatedMeta}>
                      {rel.status === 'live' ? (
                        <span style={styles.relatedLiveBadge}>LIVE • {rel.minute}</span>
                      ) : (
                        <span>Upcoming</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  watchContainer: {
    display: 'flex',
    gap: '30px',
    paddingTop: '40px',
    paddingBottom: '80px',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '2 1 650px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightCol: {
    flex: '1 1 340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minWidth: '320px',
  },
  infoCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '24px',
  },
  infoMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  leagueName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.86rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  matchTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: '#ffffff',
    marginBottom: '12px',
  },
  vsMuted: {
    color: 'var(--text-muted)',
    fontSize: '1.25rem',
    fontWeight: '300',
  },
  matchDesc: {
    fontSize: '0.94rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  spectatorsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '16px',
  },
  statsCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '24px',
  },
  statsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  statsTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.86rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  statName: {
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    background: 'var(--accent-green)',
  },

  // Live Chat Styles
  chatCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)',
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  chatHeader: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid var(--border-color)',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  chatTitle: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#ffffff',
    flexGrow: 1,
  },
  onlineBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0, 255, 102, 0.06)',
    border: '1px solid rgba(0, 255, 102, 0.1)',
    padding: '2px 8px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.72rem',
    color: 'var(--accent-green)',
    fontWeight: '700',
  },
  onlineDot: {
    width: '4px',
    height: '4px',
    backgroundColor: 'var(--accent-green)',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-glow)',
  },
  chatMessagesContainer: {
    flexGrow: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chatMessageRow: {
    fontSize: '0.84rem',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  chatTime: {
    color: 'var(--text-muted)',
    fontSize: '0.74rem',
    marginRight: '8px',
  },
  chatUser: {
    fontWeight: '700',
    color: '#a855f7', // default purple for users
    marginRight: '6px',
  },
  chatUserSelf: {
    color: 'var(--accent-green)',
  },
  chatUserMod: {
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
    padding: '1px 4px',
    borderRadius: '2px',
  },
  chatText: {
    color: '#e2e8f0',
  },
  emptyPanelText: {
    fontSize: '0.84rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },

  // Related matches
  relatedBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '20px',
  },
  relatedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  relatedTitle: {
    fontSize: '0.94rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  relatedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  relatedLinkCard: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-md)',
    padding: '8px',
    gap: '12px',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'var(--border-hover)',
    }
  },
  relatedThumb: {
    width: '64px',
    aspectRatio: '16/10',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  relatedInfo: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  relatedLeague: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  relatedTeams: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  relatedMeta: {
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
  },
  relatedLiveBadge: {
    color: 'var(--accent-green)',
    fontWeight: '700',
  },

  // Skeletons Watch
  skelePlayer: {
    width: '100%',
    aspectRatio: '16/9',
  },
  skeleTitle: {
    height: '24px',
    width: '40%',
    marginTop: '16px',
  },
  skeleText: {
    height: '14px',
    width: '80%',
    marginTop: '12px',
  },
  skeleChat: {
    height: '420px',
    width: '100%',
  },

  // Error state Watch
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '100px 20px',
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    padding: '12px 24px',
    borderRadius: 'var(--border-radius-xl)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ffffff',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'var(--border-hover)',
    }
  }
};

export default Watch;
