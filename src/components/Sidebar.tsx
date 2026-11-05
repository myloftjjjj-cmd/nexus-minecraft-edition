import React from 'react';
import {
  Home,
  MessageSquare,
  Wrench,
  FolderGit2,
  Clock,
  Settings,
  Sparkles,
  X,
  Compass,
  Zap,
  Sword,
  FlaskConical,
  Terminal,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string, subTool?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onClose,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'Nexus AI Chat', icon: MessageSquare, badge: 'AI' },
    { id: 'tools', label: 'Minecraft Tools', icon: Wrench, count: '10' },
    { id: 'projects', label: 'Projects & Mods', icon: FolderGit2 },
    { id: 'history', label: 'History & Saved', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickTools = [
    { id: 'crafting', label: 'Crafting Guide', icon: Layers },
    { id: 'enchantments', label: 'Enchantments', icon: Sparkles },
    { id: 'potions', label: 'Potion Guide', icon: FlaskConical },
    { id: 'commands', label: 'Command Generator', icon: Terminal },
    { id: 'redstone', label: 'Redstone Circuits', icon: Zap },
    { id: 'seeds', label: 'Seed Explorer', icon: Compass },
  ];

  const handleNav = (viewId: string, subTool?: string) => {
    onSelectView(viewId, subTool);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0d1117] border-r border-[#202938] flex flex-col z-40 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#202938] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/icon.png"
                alt="Nexus Logo"
                className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0d1117]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">NEXUS</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-black">
                  MC
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Minecraft AI Edition</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a2332]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="p-3">
          <button
            onClick={() => handleNav('chat')}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>New AI Chat</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Menu
            </p>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#182333] text-emerald-400 border border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                        : 'text-gray-300 hover:text-white hover:bg-[#141b26]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                    {item.count && (
                      <span className="text-xs text-gray-400">{item.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Featured Tools
            </p>
            <nav className="space-y-1">
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleNav('tools', tool.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-[#141b26] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#202938] bg-[#090d13]">
          <div className="px-3 py-2 rounded-lg bg-[#121824] border border-[#232d3d] flex items-center justify-between text-[11px]">
            <div>
              <div className="text-gray-200 font-semibold">Java & Bedrock</div>
              <div className="text-emerald-400 font-mono">1.21.4 • Paper • Fabric</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          </div>
        </div>
      </aside>
    </>
  );
};
