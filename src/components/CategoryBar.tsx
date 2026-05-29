import React from 'react';
import type { Match } from '../types/index';

interface CategoryBarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  matches: Match[];
}

export const SPORTS_CATEGORIES = [
  { id: 'all', name: 'All Sports', icon: '📁' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'fight', name: 'Fight (UFC, MMA)', icon: '🥊' },
  { id: 'motor-sports', name: 'Motor Sports', icon: '🏎️' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'other', name: 'Other', icon: '🏐' },
];

const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  matches,
}) => {
  const getCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return matches.length;
    }
    return matches.filter((m) => m.category === categoryId).length;
  };

  return (
    <div className="w-full bg-[#11141e]/50 border-b border-white/[0.05] backdrop-blur-md sticky top-[64px] z-40 py-2.5 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-row items-center justify-start md:justify-center overflow-x-auto gap-2.5 scrollbar-none select-none py-1 scroll-smooth">
          {SPORTS_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const count = getCount(category.id);

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                  isActive
                    ? 'bg-primary text-[#08090c] border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border-white/[0.05] hover:border-white/[0.12]'
                }`}
              >
                <span className="text-sm shrink-0 leading-none">{category.icon}</span>
                <span className="capitalize">{category.name}</span>
                
                {count > 0 && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full scale-90 ${
                      isActive
                        ? 'bg-[#08090c]/15 text-[#08090c]'
                        : 'bg-white/[0.04] text-slate-500 group-hover:text-slate-300 border border-white/[0.03]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
