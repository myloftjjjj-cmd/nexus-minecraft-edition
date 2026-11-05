import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DashboardView } from '../components/DashboardView';
import { ChatView } from '../components/ChatView';
import { ToolsView } from '../components/ToolsView';
import { ProjectsView } from '../components/ProjectsView';
import { HistoryFavoritesView } from '../components/HistoryFavoritesView';
import { SettingsView } from '../components/SettingsView';
import { Message, ChatSession, UserSettings } from '../types/minecraft';
import {
  getChatSessions,
  saveChatSession,
  deleteChatSession,
  getUserSettings,
  saveUserSettings,
  DEFAULT_SETTINGS,
} from '../lib/projectStorage';

export default function Index() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeSubTool, setActiveSubTool] = useState<string>('crafting');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState<string>('');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([
    'Mace: Wind Burst + Density 1.21 Meta',
    'Etho Hopper Clock (51.2s item transfer)',
    'Potion of Fire Resistance (Magma Cream)',
  ]);

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSessions(getChatSessions());
    setSettings(getUserSettings());
  }, []);

  const handleToggleFavorite = (item: string) => {
    setFavorites((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleStartChatWithPrompt = (prompt?: string) => {
    if (prompt) {
      setChatPrompt(prompt);
    }
    setCurrentView('chat');
  };

  const handleOpenTool = (toolId: string) => {
    setActiveSubTool(toolId);
    setCurrentView('tools');
  };

  const handleSaveToHistory = (messages: Message[]) => {
    if (messages.length <= 1) return;
    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 40) : 'Minecraft Chat';
    const now = Date.now();

    const session: ChatSession = {
      id: `session_${now}`,
      title,
      messages,
      createdAt: now,
      updatedAt: now,
    };

    saveChatSession(session);
    setSessions(getChatSessions());
  };

  const handleResumeSession = (session: ChatSession) => {
    setCurrentView('chat');
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteChatSession(sessionId);
    setSessions(getChatSessions());
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  const handleResetData = () => {
    localStorage.clear();
    setSessions([]);
    setSettings(DEFAULT_SETTINGS);
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0e17] text-gray-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view, subTool) => {
          setCurrentView(view);
          if (subTool) setActiveSubTool(subTool);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          currentView={currentView}
          onOpenSidebar={() => setSidebarOpen(true)}
          favoritesCount={favorites.length}
          onGoToFavorites={() => setCurrentView('history')}
          onGoToSettings={() => setCurrentView('settings')}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onStartChat={handleStartChatWithPrompt}
              onOpenTool={handleOpenTool}
              onOpenProjects={() => setCurrentView('projects')}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentView === 'chat' && (
            <ChatView
              initialPrompt={chatPrompt}
              onClearInitialPrompt={() => setChatPrompt('')}
              apiKey={settings.apiKey}
              onSaveToHistory={handleSaveToHistory}
            />
          )}

          {currentView === 'tools' && (
            <ToolsView
              initialTool={activeSubTool}
              onAskNexus={(prompt) => handleStartChatWithPrompt(prompt)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              onAskNexus={(prompt) => handleStartChatWithPrompt(prompt)}
            />
          )}

          {currentView === 'history' && (
            <HistoryFavoritesView
              sessions={sessions}
              favorites={favorites}
              onResumeSession={handleResumeSession}
              onDeleteSession={handleDeleteSession}
              onRemoveFavorite={handleToggleFavorite}
              onClearAllHistory={() => {
                sessions.forEach((s) => deleteChatSession(s.id));
                setSessions([]);
              }}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
