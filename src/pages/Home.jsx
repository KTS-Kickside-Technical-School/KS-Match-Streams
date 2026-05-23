import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Hero from '../components/Hero';
import MatchCard from '../components/MatchCard';
import { Tv, Calendar, RefreshCw, AlertTriangle, ShieldCheck, Flame, Trophy, Activity, CircleDot, Volleyball, Flag } from 'lucide-react';

const Home = ({ searchValue = '' }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllMatches();
      setMatches(data);
    } catch (err) {
      setError('Unable to synchronize live sports streams. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Poll every 30 seconds for live score updates
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter logic
  const filteredMatches = matches.filter(match => {
    // 1. Filter by category
    const matchesCategory = selectedCategory === 'all' || match.category === selectedCategory;
    const normalizedSearch = searchValue.toLowerCase();
    const title = String(match.title || '').toLowerCase();
    const league = String(match.league || '').toLowerCase();
    const homeName = String(match.homeTeam?.name || '').toLowerCase();
    const awayName = String(match.awayTeam?.name || '').toLowerCase();
    
    // 2. Filter by search value
    const matchesSearch = searchValue.trim() === '' || 
      title.includes(normalizedSearch) ||
      league.includes(normalizedSearch) ||
      homeName.includes(normalizedSearch) ||
      awayName.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  const liveMatches = filteredMatches.filter(m => m.status === 'live');
  const upcomingMatches = filteredMatches.filter(m => m.status === 'upcoming');

  // Select the main hero stream (prefer the first live football/basketball match, otherwise any live match)
  const featuredMatch = matches.find(m => m.status === 'live' && m.category === 'football') || 
                        matches.find(m => m.status === 'live') || 
                        matches[0];

  return (
    <main style={styles.main}>
      {/* Featured Match Hero Banner */}
      {!isLoading && !error && featuredMatch && (
        <Hero match={featuredMatch} />
      )}

      {/* Category Pills & Filters */}
      <section style={styles.filterSection}>
        <div className="container" style={styles.filterContainer}>
          <div style={styles.pillBox}>
            <button 
              onClick={() => setSelectedCategory('all')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'all' ? styles.pillBtnActive : {}) }}
            >
              <Activity size={15} />
              <span>All Sports</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('football')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'football' ? styles.pillBtnActive : {}) }}
            >
              <Trophy size={15} />
              <span>Football</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('basketball')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'basketball' ? styles.pillBtnActive : {}) }}
            >
              <Flame size={15} />
              <span>Basketball</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('ufc')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'ufc' ? styles.pillBtnActive : {}) }}
            >
              <Tv size={15} />
              <span>UFC / MMA</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('other')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'other' ? styles.pillBtnActive : {}) }}
            >
              <CircleDot size={15} />
              <span>Other</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('tennis')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'tennis' ? styles.pillBtnActive : {}) }}
            >
              <Volleyball size={15} />
              <span>Tennis</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('cricket')} 
              style={{ ...styles.pillBtn, ...(selectedCategory === 'cricket' ? styles.pillBtnActive : {}) }}
            >
              <Flag size={15} />
              <span>Cricket</span>
            </button>
          </div>

          <button onClick={fetchMatches} style={styles.refreshBtn} aria-label="Refresh feeds">
            <RefreshCw size={15} className={isLoading ? 'spinning' : ''} style={isLoading ? styles.spinningIcon : {}} />
            <span>Sync Scores</span>
          </button>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="container" style={styles.errorBox}>
          <AlertTriangle size={36} color="#ef4444" />
          <h3 style={styles.errorTitle}>Synchronization Issue</h3>
          <p style={styles.errorText}>{error}</p>
          <button onClick={fetchMatches} style={styles.retryBtn}>
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </section>
      )}

      {/* Live Matches Section */}
      {!error && (
        <section id="live-section" style={styles.section}>
          <div className="container">
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleRow}>
                <div style={styles.liveDot}></div>
                <h2 style={styles.sectionTitle}>Currently Streaming Live</h2>
              </div>
              <span style={styles.sectionCounter}>{isLoading ? '...' : `${liveMatches.length} Matches`}</span>
            </div>

            {isLoading ? (
              /* Render Skeleton Cards */
              <div style={styles.cardsGrid}>
                <MatchCard isLoading={true} />
                <MatchCard isLoading={true} />
                <MatchCard isLoading={true} />
              </div>
            ) : liveMatches.length > 0 ? (
              <div style={styles.cardsGrid}>
                {liveMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Tv size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h4>No Matches Streaming Live</h4>
                <p>Check back later or search upcoming schedules for upcoming blockbusters.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Matches Section */}
      {!error && (
        <section id="upcoming-section" style={styles.sectionUpcoming}>
          <div className="container">
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleRow}>
                <Calendar size={20} color="var(--text-secondary)" />
                <h2 style={styles.sectionTitle}>Upcoming Fixtures</h2>
              </div>
              <span style={styles.sectionCounter}>{isLoading ? '...' : `${upcomingMatches.length} Matches`}</span>
            </div>

            {isLoading ? (
              /* Render Skeleton Cards */
              <div style={styles.cardsGrid}>
                <MatchCard isLoading={true} />
                <MatchCard isLoading={true} />
                <MatchCard isLoading={true} />
              </div>
            ) : upcomingMatches.length > 0 ? (
              <div style={styles.cardsGrid}>
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Calendar size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h4>Schedule Empty</h4>
                <p>No matches matching your search criteria are currently scheduled.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

const styles = {
  main: {
    paddingBottom: '80px',
  },
  filterSection: {
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(17, 20, 30, 0.4)',
    padding: '16px 0',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pillBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  pillBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    padding: '8px 18px',
    borderRadius: 'var(--border-radius-xl)',
    fontSize: '0.86rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'var(--border-hover)',
      color: '#ffffff',
    }
  },
  pillBtnActive: {
    background: 'rgba(0, 255, 102, 0.1)',
    border: '1px solid rgba(0, 255, 102, 0.3)',
    color: 'var(--accent-green)',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-xl)',
    fontSize: '0.84rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
    ':hover': {
      borderColor: 'var(--border-hover)',
      color: '#ffffff',
    }
  },
  spinningIcon: {
    animation: 'spin 1s infinite linear',
  },
  section: {
    padding: '40px 0',
  },
  sectionUpcoming: {
    padding: '20px 0 40px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    paddingBottom: '12px',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--accent-green)',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-glow)',
  },
  sectionTitle: {
    fontSize: '1.45rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  sectionCounter: {
    fontSize: '0.84rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '4px 10px',
    borderRadius: '4px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px dashed var(--border-color)',
    textAlign: 'center',
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    background: 'rgba(239, 68, 68, 0.04)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: 'var(--border-radius-lg)',
    margin: '40px auto 20px auto',
    maxWidth: '600px',
  },
  errorTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    marginTop: '16px',
    color: '#ffffff',
  },
  errorText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    margin: '8px 0 20px 0',
    lineHeight: '1.5',
    maxWidth: '420px',
  },
  retryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ef4444',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.88rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
  }
};

export default Home;
