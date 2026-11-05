import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Layers,
  Terminal,
  Zap,
  Sword,
  Compass,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Shield,
  Lightbulb,
  Newspaper,
  Flame,
  Check,
} from 'lucide-react';
import { MINECRAFT_NEWS, MINECRAFT_TIPS } from '../data/minecraftData';

interface DashboardViewProps {
  onStartChat: (initialPrompt?: string) => void;
  onOpenTool: (toolId: string) => void;
  onOpenProjects: () => void;
  favorites: string[];
  onToggleFavorite: (item: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartChat,
  onOpenTool,
  onOpenProjects,
  favorites,
  onToggleFavorite,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [copiedTip, setCopiedTip] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onStartChat(quickInput);
    setQuickInput('');
  };

  const handleCopyTip = () => {
    navigator.clipboard.writeText(MINECRAFT_TIPS[activeTipIndex]);
    setCopiedTip(true);
    setTimeout(() => setCopiedTip(false), 2000);
  };

  const nextTip = () => {
    setActiveTipIndex((prev) => (prev + 1) % MINECRAFT_TIPS.length);
  };

  const quickActions = [
    {
      id: 'crafting',
      title: 'Crafting Recipes',
      desc: '3x3 grid & shapeless items',
      icon: Layers,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'enchantments',
      title: 'Enchantment Guide',
      desc: 'Max levels & combinations',
      icon: Sparkles,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    },
    {
      id: 'commands',
      title: 'Command Generator',
      desc: '/give, /summon, & 1.21 items',
      icon: Terminal,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      id: 'redstone',
      title: 'Redstone Circuits',
      desc: 'Clocks, gates & sorters',
      icon: Zap,
      color: 'from-red-500/20 to-amber-500/10 border-red-500/30 text-red-400',
    },
    {
      id: 'building',
      title: 'Building Blueprints',
      desc: 'Palettes & room layouts',
      icon: Compass,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'gear',
      title: 'Armor & Weapons',
      desc: 'Mace, Netherite & DPS math',
      icon: Sword,
      color: 'from-blue-500/20 to-emerald-500/10 border-blue-500/30 text-blue-400',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121926] via-[#101724] to-[#0a0e17] border border-emerald-500/25 p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="/icon.png"
                alt="Nexus Character Logo"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-black shadow-md">
                ONLINE
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Hello, Crafter!
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Nexus AI
                </span>
              </div>
              <p className="text-gray-300 text-sm md:text-base mt-1 max-w-lg">
                Your intelligent Minecraft assistant. Ask questions, explore recipes, design redstone, or scaffold mods and plugins.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onStartChat()}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Launch AI Chat</span>
            </button>
            <button
              onClick={onOpenProjects}
              className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-[#16202e] hover:bg-[#1e2a3c] border border-[#2b394f] text-gray-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>My Projects</span>
            </button>
          </div>
        </div>

        {/* Quick Question Bar */}
        <form onSubmit={handleQuickSubmit} className="mt-6 relative z-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Ask Nexus anything: e.g. How do I brew a Fire Resistance potion in 1.21?"
              className="w-full bg-[#182333]/90 border border-emerald-500/30 focus:border-emerald-500 text-white placeholder-gray-400 text-sm rounded-2xl py-3.5 pl-4 pr-12 outline-none shadow-inner transition-colors"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="absolute right-2 p-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 transition-all"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <span className="text-[11px] text-gray-400">Try:</span>
            {[
              'How to craft a Mace in 1.21?',
              'Best Netherite armor enchantments',
              'Give me a 1.21 summon lightning command',
              'Explain Etho hopper clock',
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onStartChat(prompt)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.5 rounded-lg transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Quick Action Tools Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Essential Minecraft Tools</span>
            </h3>
            <p className="text-xs text-gray-400">10 working interactive utilities</p>
          </div>
          <button
            onClick={() => onOpenTool('crafting')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <span>View All Tools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onOpenTool(action.id)}
                className={`group text-left p-4 rounded-2xl bg-gradient-to-b ${action.color} border hover:border-emerald-400/60 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex flex-col justify-between h-36`}
              >
                <div className="p-2 rounded-xl bg-[#0e141e]/80 w-fit group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">{action.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Two Column Section: Tips & News */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minecraft Tips & Tricks */}
        <section className="bg-[#121824] border border-[#232d3d] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Daily Survival Pro-Tip</h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                #{activeTipIndex + 1} of {MINECRAFT_TIPS.length}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0f17] border border-[#1b2330] text-sm text-gray-200 leading-relaxed min-h-[90px] flex items-center">
              "{MINECRAFT_TIPS[activeTipIndex]}"
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e2736]">
            <button
              onClick={handleCopyTip}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#192230] hover:bg-[#202c3e] transition-colors"
            >
              {copiedTip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{copiedTip ? 'Copied!' : 'Copy Tip'}</span>
            </button>

            <button
              onClick={nextTip}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Next Tip →
            </button>
          </div>
        </section>

        {/* Latest Minecraft Updates & News */}
        <section className="bg-[#121824] border border-[#232d3d] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Minecraft 1.21 Updates</h3>
          </div>

          <div className="space-y-3">
            {MINECRAFT_NEWS.map((news) => (
              <div
                key={news.id}
                className="p-3 rounded-xl bg-[#0b0f17] border border-[#1b2330] hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {news.tag}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">{news.date}</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{news.title}</h4>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-2">{news.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
