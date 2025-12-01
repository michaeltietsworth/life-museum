import React from 'react';
import { Category, ViewMode } from '../types';
import { BookOpen, Clock, Heart, Briefcase, MapPin, Baby, Users, Feather, LogOut } from 'lucide-react';

interface SidebarProps {
  currentCategory: Category | 'All';
  onSelectCategory: (c: Category | 'All') => void;
  currentView: ViewMode;
  onSelectView: (v: ViewMode) => void;
  onSignOut: () => void;
}

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  [Category.GENERAL]: Feather,
  [Category.CHILDHOOD]: Baby,
  [Category.ROMANCE]: Heart,
  [Category.CAREER]: Briefcase,
  [Category.TRAVEL]: MapPin,
  [Category.FAMILY]: Users,
  [Category.LESSONS]: BookOpen,
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentCategory, 
  onSelectCategory,
  currentView,
  onSelectView,
  onSignOut
}) => {
  return (
    <div className="w-full md:w-64 bg-museum-900 text-museum-100 flex-shrink-0 flex flex-col md:h-full border-r border-museum-700">
      <div className="p-4 md:p-6 border-b border-museum-800 flex justify-between items-center md:block">
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-museum-50 tracking-wider">Life Museum</h1>
          <p className="text-xs text-museum-400 mt-1 uppercase tracking-widest hidden md:block">Digital Legacy</p>
        </div>
        <button onClick={onSignOut} className="md:hidden text-museum-400 hover:text-red-400">
          <LogOut size={20} />
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto max-h-[40vh] md:max-h-none md:flex-1 border-b md:border-b-0 border-museum-800">
        <div>
          <h3 className="text-xs font-bold text-museum-500 uppercase tracking-wider mb-2 md:mb-3 px-2">View Mode</h3>
          <div className="flex md:block gap-2 space-y-0 md:space-y-1 overflow-x-auto md:overflow-visible">
            <button 
              onClick={() => onSelectView('timeline')}
              className={`flex-1 md:w-full text-left px-3 py-2 rounded-md flex items-center justify-center md:justify-start gap-2 md:gap-3 transition-colors ${currentView === 'timeline' ? 'bg-museum-800 text-amber-500' : 'hover:bg-museum-800/50'}`}
            >
              <Clock size={16} />
              <span className="text-sm font-medium whitespace-nowrap">Timeline</span>
            </button>
            <button 
              onClick={() => onSelectView('story')}
              className={`flex-1 md:w-full text-left px-3 py-2 rounded-md flex items-center justify-center md:justify-start gap-2 md:gap-3 transition-colors ${currentView === 'story' ? 'bg-museum-800 text-amber-500' : 'hover:bg-museum-800/50'}`}
            >
              <BookOpen size={16} />
              <span className="text-sm font-medium whitespace-nowrap">Biography</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-museum-500 uppercase tracking-wider mb-2 md:mb-3 px-2">Collections</h3>
          <div className="flex md:block gap-2 space-y-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => onSelectCategory('All')}
              className={`flex-shrink-0 md:w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${currentCategory === 'All' ? 'bg-museum-800 text-white' : 'hover:bg-museum-800/50'}`}
            >
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">A</span>
              <span className="text-sm font-medium whitespace-nowrap">All Entries</span>
            </button>
            
            {Object.values(Category).map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button 
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`flex-shrink-0 md:w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${currentCategory === cat ? 'bg-museum-800 text-white' : 'hover:bg-museum-800/50'}`}
                >
                  <Icon size={16} className={currentCategory === cat ? 'text-amber-500' : 'text-museum-400'} />
                  <span className="text-sm font-medium whitespace-nowrap">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hidden md:block p-4 border-t border-museum-800">
        <button 
          onClick={onSignOut}
          className="w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-red-900/30 text-museum-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};