import React from 'react';
import { ShieldCheck, Info, Heart, Globe, ArrowUp } from 'lucide-react';
import logo from '../assets/logo.png';

const YoutubeIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitterIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#11141e] border-t border-white/[0.05] py-8 mt-auto w-full">
      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-6">
        
        <div className="flex justify-between flex-wrap gap-8">
          {/* Brand Box */}
          <div className="flex-1 min-w-[260px] max-w-[360px]">
            <div className="flex items-center gap-2 text-lg font-black tracking-tight mb-3">
              <img src={logo} alt="Logo" className="h-6 w-auto object-contain" />
              <div className="flex items-center">
                <span className="text-white">KICK</span>
                <span className="text-primary tracking-normal ml-0.5">SIDE</span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full ml-1" />
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              The ultimate high-fidelity digital hub for real-time sports match streams, instant live scores, schedules, and statistical analysis.
            </p>
            
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-md">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="text-[10px] font-medium text-slate-400">All stream systems operational</span>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="flex flex-wrap gap-8 flex-[2] justify-between min-w-[300px]">
            {/* Column 1 */}
            <div className="min-w-[120px] flex-1">
              <h4 className="text-[10px] uppercase tracking-wider text-white font-bold mb-3">Sports Hub</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Football Live Streams</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Basketball Fixtures</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">UFC Fight Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tennis Match Feeds</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="min-w-[120px] flex-1">
              <h4 className="text-[10px] uppercase tracking-wider text-white font-bold mb-3">Platform Navigation</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li><a href="/" className="hover:text-primary transition-colors">Discover Match Center</a></li>
                <li><a href="/live" className="hover:text-primary transition-colors">Active Live Streams</a></li>
                <li><a href="/" className="hover:text-primary transition-colors">Upcoming Schedules</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sports Broadcasting FAQ</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="min-w-[120px] flex-1">
              <h4 className="text-[10px] uppercase tracking-wider text-white font-bold mb-3">Legal & Safe</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">DMCA / Copyright Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Responsible Gaming</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/[0.05] my-2" />

        {/* Bottom Section */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Kickside Match Center. Made with <Heart size={10} className="inline text-primary mx-0.5 fill-current" /> for sports fans worldwide.
          </div>

          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all"><TwitterIcon size={14} /></a>
            <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all"><YoutubeIcon size={15} /></a>
            <a href="#" aria-label="Website" className="w-8 h-8 rounded-full bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all"><Globe size={15} /></a>
            <button onClick={scrollToTop} aria-label="Back to top" className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-[#08090c] border border-primary/20 hover:border-transparent flex items-center justify-center transition-all">
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
