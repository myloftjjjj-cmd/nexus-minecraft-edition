import React, { useState } from 'react';
import {
  Clock,
  Bookmark,
  Search,
  Trash2,
  MessageSquare,
  ChevronRight,
  Download,
  Check,
  Sparkles,
} from 'lucide-react';
import { ChatSession } from '../types/minecraft';

interface HistoryFavoritesViewProps {
  sessions: ChatSession[];
  favorites: string[];
  onResumeSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onRemoveFavorite: (item: string) => void;
  onClearAllHistory: () => void;
}

export const HistoryFavoritesView: React.FC<HistoryFavoritesViewProps> = ({
  sessions,
  favorites,
  onResumeSession,
  onDeleteSession,
  onRemoveFavorite,
  onClearAllHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'favorites'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFavorites = favorites.filter((f) =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Chat History & Saved Items</span>
          </h2>
          <p className="text-xs text-gray-400">Review past AI conversations and bookmarked Minecraft guides</p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all conversation history?')) {
                  onClearAllHistory();
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/20 border border-red-500/20 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#0a0e17] p-1 rounded-xl border border-[#232f42] w-fit">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'sessions' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Sessions ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'favorites' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history & saved..."
            className="w-full bg-[#121824] border border-[#232d3d] text-white text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-[#121824] border border-[#232d3d] hover:border-emerald-500/40 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onResumeSession(session)}>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{session.title}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {formatDate(session.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {session.messages[session.messages.length - 1]?.content.slice(0, 100) || 'Empty conversation'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onResumeSession(session)}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Resume</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#1a2332] transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#121824] border border-[#232d3d] text-gray-400 text-xs">
              No saved chat sessions found. Start a conversation with Nexus!
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-3">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#121824] border border-[#232d3d] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-gray-200">{item}</span>
                </div>

                <button
                  onClick={() => onRemoveFavorite(item)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#1a2332] transition-colors"
                  title="Remove favorite"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#121824] border border-[#232d3d] text-gray-400 text-xs">
              No saved favorites yet. Bookmark tips and recipes across the app!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
