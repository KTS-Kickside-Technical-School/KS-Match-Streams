import React from 'react';
import { ShieldCheck, Info, Heart, Globe, ArrowUp } from 'lucide-react';

// Custom high-fidelity inline brand SVGs due to lucide-react brand deprecations
const YoutubeIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.topSection}>
          {/* Brand Info */}
          <div style={styles.brandBox}>
            <div style={styles.logo}>
              <span>KICK</span><span style={{ color: 'var(--accent-green)' }}>SIDE</span>
              <div style={styles.logoDot}></div>
            </div>
            <p style={styles.description}>
              The ultimate high-fidelity digital hub for real-time sports match streams, instant live scores, schedules, and statistical analysis.
            </p>
            <div style={styles.statusBadge}>
              <ShieldCheck size={14} color="var(--accent-green)" />
              <span style={styles.statusText}>All systems operational</span>
            </div>
          </div>

          {/* Quick Links Group */}
          <div style={styles.linksGrid}>
            <div style={styles.linksColumn}>
              <h4 style={styles.columnTitle}>Sports Categories</h4>
              <ul style={styles.linksList}>
                <li><a href="#" style={styles.link}>Football Streams</a></li>
                <li><a href="#" style={styles.link}>Basketball Fixtures</a></li>
                <li><a href="#" style={styles.link}>UFC Fight Center</a></li>
                <li><a href="#" style={styles.link}>Tennis Matches</a></li>
              </ul>
            </div>

            <div style={styles.linksColumn}>
              <h4 style={styles.columnTitle}>Major Leagues</h4>
              <ul style={styles.linksList}>
                <li><a href="#" style={styles.link}>UEFA Champions League</a></li>
                <li><a href="#" style={styles.link}>English Premier League</a></li>
                <li><a href="#" style={styles.link}>NBA Regular Season</a></li>
                <li><a href="#" style={styles.link}>UFC Championship</a></li>
              </ul>
            </div>

            <div style={styles.linksColumn}>
              <h4 style={styles.columnTitle}>Legal & Safe</h4>
              <ul style={styles.linksList}>
                <li><a href="#" style={styles.link}>Terms of Service</a></li>
                <li><a href="#" style={styles.link}>Privacy Policy</a></li>
                <li><a href="#" style={styles.link}>DMCA / Copyright</a></li>
                <li><a href="#" style={styles.link}>Responsible Gaming</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={styles.divider} />

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          <div style={styles.copyrightText}>
            © {new Date().getFullYear()} Kickside Match Center. Made with <Heart size={12} color="var(--accent-green)" style={{ display: 'inline', margin: '0 4px' }} /> for sports fans worldwide.
          </div>

          <div style={styles.socialBox}>
            <a href="#" aria-label="Twitter" style={styles.socialLink}><TwitterIcon size={16} /></a>
            <a href="#" aria-label="YouTube" style={styles.socialLink}><YoutubeIcon size={18} /></a>
            <a href="#" aria-label="Website" style={styles.socialLink}><Globe size={18} /></a>
            <button onClick={scrollToTop} aria-label="Back to top" style={styles.topBtn}>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '60px 0 30px 0',
    marginTop: 'auto',
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px',
  },
  brandBox: {
    flex: '1 1 300px',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  logoDot: {
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--accent-green)',
    borderRadius: '50%',
    marginLeft: '3px',
    boxShadow: 'var(--shadow-glow)',
  },
  description: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0, 255, 102, 0.05)',
    border: '1px solid rgba(0, 255, 102, 0.1)',
    padding: '6px 12px',
    borderRadius: 'var(--border-radius-sm)',
  },
  statusText: {
    fontSize: '0.78rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  },
  linksGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    flex: '2 1 500px',
    justifyContent: 'space-between',
  },
  linksColumn: {
    flex: '1 1 140px',
  },
  columnTitle: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#ffffff',
    marginBottom: '20px',
    fontWeight: '700',
  },
  linksList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    transition: 'color var(--transition-fast)',
    ':hover': {
      color: '#ffffff',
    }
  },
  divider: {
    border: 0,
    height: '1px',
    background: 'var(--border-color)',
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  copyrightText: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
  },
  socialBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  socialLink: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
  },
  topBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(0, 255, 102, 0.08)',
    border: '1px solid rgba(0, 255, 102, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent-green)',
    transition: 'all var(--transition-fast)',
  }
};

export default Footer;
