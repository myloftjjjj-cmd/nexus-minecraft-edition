import React from 'react';
import { Menu, Sparkles, Shield, Bookmark, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onOpenSidebar: () => void;
  favoritesCount: number;
  onGoToFavorites: () => void;
  onGoToSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenSidebar,
  favoritesCount,
  onGoToFavorites,
  onGoToSettings,
}) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'chat':
        return 'Nexus AI Assistant';
      case 'tools':
        return 'Minecraft Tools & Guides';
      case 'projects':
        return 'Projects & Scaffolding';
      case 'history':
        return 'Chat History & Saved';
      case 'settings':
        return 'Settings & Profile';
      default:
        return 'Nexus MC Edition';
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-[#0f141c]/95 border-b border-[#232d3d] flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#1a2332] md:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src="/icon.png"
            alt="Nexus Logo"
            className="w-8 h-8 rounded-lg object-cover border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          />
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight flex items-center gap-2">
              {getTitle()}
            </h1>
            <p className="text-[11px] text-emerald-400 font-mono leading-none">v1.21.4 Ready</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onGoToFavorites}
          className="relative p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#1a2332] transition-colors"
          title="Saved Favorites"
          aria-label="Favorites"
        >
          <Bookmark className="w-4 h-4 text-emerald-400" />
          {favoritesCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 text-[10px] bg-emerald-500 text-black font-bold rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Minecraft AI Online</span>
        </div>

        <button
          onClick={onGoToSettings}
          className="p-1.5 rounded-lg border border-[#232d3d] bg-[#141b26] hover:bg-[#1c2637] text-gray-200 transition-colors"
          title="Profile & Settings"
          aria-label="Settings"
        >
          <User className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </header>
  );
};
