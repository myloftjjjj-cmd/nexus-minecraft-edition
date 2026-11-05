import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Key,
  Palette,
  RotateCcw,
  Check,
  Smartphone,
  ExternalLink,
  Lock,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { UserSettings, LoaderType } from '../types/minecraft';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const [currentSettings, setCurrentSettings] = useState<UserSettings>(settings);
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey || '');
  const [saveToast, setSaveToast] = useState(false);

  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleSave = (newVal?: Partial<UserSettings>) => {
    const updated = {
      ...currentSettings,
      apiKey: apiKeyInput.trim(),
      ...(newVal || {}),
    };
    setCurrentSettings(updated);
    onUpdateSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleAuthSubmit = async (mode: 'signin' | 'signup') => {
    if (!isSupabaseConfigured()) {
      // Offline Demo Mode login simulation
      if (!email.trim()) {
        setAuthError('Please enter an email.');
        return;
      }
      setIsAuthLoading(true);
      setTimeout(() => {
        setCurrentUser(email.trim());
        setIsAuthLoading(false);
        setAuthError('');
      }, 500);
      return;
    }

    setIsAuthLoading(true);
    setAuthError('');
    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setCurrentUser(data.user?.email || email);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setCurrentUser(data.user?.email || email);
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Settings & Profile</span>
          </h2>
          <p className="text-xs text-gray-400">Manage account, AI preferences, and Minecraft defaults</p>
        </div>

        {saveToast && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Account & Auth Section */}
      <section className="p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Crafter Profile & Account</h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              currentUser
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {currentUser ? 'Signed In' : 'Local Demo Mode'}
          </span>
        </div>

        {currentUser ? (
          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1b2536] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30" />
              <div>
                <p className="text-xs font-bold text-white">{currentUser}</p>
                <p className="text-[10px] text-gray-400">Minecraft Creator • Connected</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-red-300 border border-red-500/30 text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              Nexus MC Edition is fully operational in <strong>Offline Demo Mode</strong>. Sign in below if you wish to link cloud databases.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                placeholder="creator@minecraft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#090d14] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#090d14] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            {authError && <div className="text-xs text-red-400">{authError}</div>}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isAuthLoading}
                onClick={() => handleAuthSubmit('signin')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors"
              >
                {isAuthLoading ? 'Connecting...' : 'Sign In'}
              </button>
              <button
                type="button"
                disabled={isAuthLoading}
                onClick={() => handleAuthSubmit('signup')}
                className="px-4 py-2 rounded-xl bg-[#192333] hover:bg-[#212e44] text-white text-xs transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Minecraft Target Configuration */}
      <section className="p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Minecraft Environment Defaults</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-300 block mb-1.5">Target Game Version</label>
            <select
              value={currentSettings.defaultVersion}
              onChange={(e) => handleSave({ defaultVersion: e.target.value })}
              className="w-full bg-[#090d14] border border-[#232d3d] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
            >
              <option value="1.21.4">1.21.4 (Tricky Trials / Bundles)</option>
              <option value="1.21.1">1.21.1</option>
              <option value="1.20.4">1.20.4</option>
              <option value="1.20.1">1.20.1</option>
              <option value="1.19.4">1.19.4</option>
              <option value="1.16.5">1.16.5 (Legacy Net)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1.5">Preferred Modding Loader</label>
            <select
              value={currentSettings.defaultLoader}
              onChange={(e) => handleSave({ defaultLoader: e.target.value as LoaderType })}
              className="w-full bg-[#090d14] border border-[#232d3d] rounded-xl px-3 py-2.5 text-xs text-white"
            >
              <option value="Fabric">Fabric (Fast / Modern)</option>
              <option value="Paper">Paper (High Performance Plugin)</option>
              <option value="NeoForge">NeoForge (Modern Forge)</option>
              <option value="Forge">Forge</option>
              <option value="Bedrock Script API">Bedrock Script API</option>
            </select>
          </div>
        </div>
      </section>

      {/* AI Engine & API Key */}
      <section className="p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>AI Engine Configuration</span>
        </h3>

        <div>
          <label className="text-xs text-gray-300 block mb-1">Optional Gemini API Key</label>
          <p className="text-[11px] text-gray-400 mb-2">
            Leave blank to use the built-in offline Nexus knowledge engine, or provide your Google Gemini API key for open-ended questions.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-[#090d14] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <button
              onClick={() => handleSave()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs"
            >
              Update Key
            </button>
          </div>
        </div>
      </section>

      {/* App & Android Info */}
      <section className="p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-3 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Android & Capacitor 7 Architecture</span>
        </h3>

        <div className="p-3 rounded-xl bg-[#090d14] border border-[#1b2536] text-xs font-mono space-y-1 text-gray-300">
          <div>App Name: <strong className="text-white">Nexus MC Edition</strong></div>
          <div>Package ID: <strong className="text-emerald-400">com.nexusmc.edition</strong></div>
          <div>Capacitor Version: <strong className="text-white">@capacitor/core 7.0</strong></div>
          <div>Platform: <strong className="text-white">Android First • Responsive Web</strong></div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              if (confirm('Reset all saved projects and local cache to defaults?')) {
                onResetData();
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/20 border border-red-500/20 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Database to Sample Defaults</span>
          </button>
        </div>
      </section>
    </div>
  );
};
