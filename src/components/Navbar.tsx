import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Tv, Calendar, Flame, Menu, X, Film } from 'lucide-react';
import logo from '../assets/logo.png';

interface NavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  liveCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ searchValue, onSearchChange, liveCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#08090c]/75 backdrop-blur-lg border-b border-white/[0.06] h-[64px] flex items-center">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full">
        
        {/* Brand Logo & Name */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight select-none"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img src={logo} alt="Kickside Logo" className="h-7 w-auto object-contain drop-shadow-[0_0_8px_rgba(62,96,244,0.35)]" />
          <div className="flex items-center">
            <span className="text-white">KICK</span>
            <span className="text-primary tracking-normal font-black ml-0.5">SIDE</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full ml-1 animate-pulse-glow" />
          </div>
        </Link>

        {/* Compact Search Bar */}
        <div className="relative hidden md:flex items-center bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] focus-within:border-primary/50 focus-within:bg-white/[0.05] rounded-full w-[280px] h-[36px] px-3 transition-all duration-200">
          <Search size={15} className="text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search teams, leagues, sports..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs font-normal bg-transparent text-white placeholder-slate-500 border-none outline-none"
          />
          {searchValue && (
            <button 
              onClick={() => onSearchChange('')} 
              className="text-slate-500 hover:text-white p-1"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-3">
          <Link 
            to="/" 
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${
              isActiveRoute('/') && !searchValue 
                ? 'bg-primary/10 text-white border border-primary/20 shadow-sm shadow-primary/5' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame size={14} className={isActiveRoute('/') && !searchValue ? 'text-primary' : ''} />
            <span>Discover</span>
          </Link>

          <Link 
            to="/live" 
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${
              isActiveRoute('/live')
                ? 'bg-primary/10 text-white border border-primary/20 shadow-sm shadow-primary/5' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Tv size={14} className={isActiveRoute('/live') ? 'text-primary' : ''} />
              {liveCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-[#08090c] text-[8px] font-black px-1 rounded-full scale-90 border border-[#08090c] animate-pulse">
                  {liveCount}
                </span>
              )}
            </div>
            <span>Live Streams</span>
          </Link>

          <Link 
            to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                const el = document.getElementById('upcoming-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <Calendar size={14} />
            <span>Schedule</span>
          </Link>


        </nav>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="flex md:hidden text-white p-1 hover:text-primary transition-colors" 
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-[#08090c]/98 border-b border-white/[0.06] py-4 px-4 flex flex-col gap-3 z-50 shadow-xl backdrop-blur-xl md:hidden">
          
          {/* Mobile Search */}
          <div className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full h-[40px] px-3 w-full">
            <Search size={16} className="text-slate-500 mr-2" />
            <input
              type="text"
              placeholder="Search matches, leagues, teams..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-sm bg-transparent text-white placeholder-slate-500 border-none outline-none"
            />
            {searchValue && (
              <button onClick={() => onSearchChange('')} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <Link 
            to="/" 
            className={`flex items-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
              isActiveRoute('/') && !searchValue 
                ? 'bg-primary/15 text-primary border border-primary/15' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.02]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Flame size={18} />
            <span>Discover Match Center</span>
          </Link>
          
          <Link 
            to="/live" 
            className={`flex items-center justify-between py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
              isActiveRoute('/live')
                ? 'bg-primary/15 text-primary border border-primary/15'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.02]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Tv size={18} className={isActiveRoute('/live') ? 'text-primary' : ''} />
              <span>Live Streams</span>
            </div>
            {liveCount > 0 && (
              <span className="bg-emerald-500 text-[#08090c] text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {liveCount} Live
              </span>
            )}
          </Link>

          <Link 
            to="/" 
            className="flex items-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.02] transition-colors"
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (location.pathname === '/') {
                setTimeout(() => {
                  const el = document.getElementById('upcoming-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            <Calendar size={18} />
            <span>Schedule & Fixtures</span>
          </Link>


        </div>
      )}
    </header>
  );
};

export default Navbar;
