import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Tv, Calendar, Trophy, Menu, X, Flame } from 'lucide-react';

const Navbar = ({ onSearchChange, searchValue, liveCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Logo */}
        <Link to="/" style={styles.logoContainer} onClick={() => setIsMobileMenuOpen(false)}>
          <span style={styles.logoText}>KICK</span>
          <span style={styles.logoAccent}>SIDE</span>
          <div style={styles.logoDot}></div>
        </Link>

        {/* Search Bar - only displayed/functional on homepage */}
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search teams, leagues, sports..."
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Navigation Links (Desktop) */}
        <nav style={styles.desktopNav}>
          <Link 
            to="/" 
            style={{
              ...styles.navLink,
              ...(isActiveRoute('/') ? styles.navLinkActive : {})
            }}
          >
            <Flame size={18} />
            <span>Discover</span>
          </Link>
          <a 
            href="#live-section" 
            style={styles.navLink}
            onClick={() => {
              const el = document.getElementById('live-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div style={styles.liveIndicator}>
              <Tv size={16} />
              {liveCount > 0 && <span style={styles.liveCountBadge}>{liveCount}</span>}
            </div>
            <span>Live Streams</span>
          </a>
          <a 
            href="#upcoming-section" 
            style={styles.navLink}
            onClick={() => {
              const el = document.getElementById('upcoming-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Calendar size={18} />
            <span>Schedule</span>
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button style={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div style={styles.mobileNav}>
          {/* Mobile Search */}
          <div style={styles.mobileSearchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <Link 
            to="/" 
            style={{
              ...styles.mobileNavLink,
              ...(isActiveRoute('/') ? styles.mobileNavLinkActive : {})
            }}
            onClick={toggleMobileMenu}
          >
            <Flame size={20} />
            <span>Discover Match Center</span>
          </Link>
          
          <a 
            href="#live-section" 
            style={styles.mobileNavLink}
            onClick={() => {
              toggleMobileMenu();
              setTimeout(() => {
                const el = document.getElementById('live-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <Tv size={20} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Live Streams 
              {liveCount > 0 && <span style={styles.mobileLiveBadge}>{liveCount} Live</span>}
            </span>
          </a>

          <a 
            href="#upcoming-section" 
            style={styles.mobileNavLink}
            onClick={() => {
              toggleMobileMenu();
              setTimeout(() => {
                const el = document.getElementById('upcoming-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <Calendar size={20} />
            <span>Schedule & Fixtures</span>
          </a>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    background: 'rgba(8, 9, 12, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '1.45rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    userSelect: 'none',
  },
  logoText: {
    color: '#ffffff',
  },
  logoAccent: {
    color: 'var(--accent-green)',
    textShadow: '0 0 10px rgba(0, 255, 102, 0.2)',
  },
  logoDot: {
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--accent-green)',
    borderRadius: '50%',
    marginLeft: '3px',
    boxShadow: 'var(--shadow-glow)',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-xl)',
    width: '320px',
    padding: '0 16px',
    height: '42px',
    transition: 'all 0.2s ease',
    '@media (maxWidth: 900px)': {
      display: 'none',
    }
  },
  searchIcon: {
    color: 'var(--text-muted)',
    marginRight: '10px',
  },
  searchInput: {
    width: '100%',
    fontSize: '0.88rem',
    fontWeight: '400',
    background: 'transparent',
    color: '#ffffff',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    transition: 'color var(--transition-fast)',
    padding: '8px 12px',
    borderRadius: 'var(--border-radius-sm)',
  },
  navLinkActive: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  liveCountBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    background: 'var(--accent-green)',
    color: 'var(--bg-primary)',
    fontSize: '0.62rem',
    fontWeight: '800',
    padding: '1px 5px',
    borderRadius: '8px',
    lineHeight: '1',
    boxShadow: 'var(--shadow-glow)',
  },
  mobileMenuButton: {
    display: 'none',
    color: '#ffffff',
  },
  mobileNav: {
    position: 'absolute',
    top: '76px',
    left: 0,
    width: '100%',
    background: 'rgba(8, 9, 12, 0.95)',
    backdropFilter: 'blur(30px)',
    borderBottom: '1px solid var(--border-color)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    zIndex: 999,
  },
  mobileSearchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-xl)',
    padding: '0 16px',
    height: '44px',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    borderRadius: 'var(--border-radius-md)',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid transparent',
  },
  mobileNavLinkActive: {
    color: '#ffffff',
    background: 'rgba(0, 255, 102, 0.05)',
    borderColor: 'rgba(0, 255, 102, 0.15)',
  },
  mobileLiveBadge: {
    background: 'var(--accent-green)',
    color: 'var(--bg-primary)',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '4px',
  }
};

// Add responsive media query handlers in inline code if needed or handle via index.css overrides.
// We will insert custom styling tags inside index.css for media queries to ensure CSS responsiveness!
export default Navbar;
