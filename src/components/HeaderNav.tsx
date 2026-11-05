import React, { useState, useEffect } from 'react';
import { GameMode, UserProfile, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { soundEngine } from '../utils/audio';
import { loadStreak } from '../utils/streak';
import appIcon from '../assets/images/app_icon.jpg';

export type AppView = 'training' | 'cpp-training' | 'game' | 'stickman' | 'multiplayer' | 'analytics' | 'academy';

interface HeaderNavProps {
  currentView: AppView;
  gameMode: GameMode;
  userProfile?: UserProfile | null;
  displayScale: number;
  appLanguage?: AppLanguage;
  onChangeDisplayScale: (scale: number) => void;
  onOpenProfile?: () => void;
  onSelectView: (view: AppView, mode?: GameMode) => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface NavItem {
  id: AppView;
  mode?: GameMode;
  label: string;
  subtext: string;
  icon: string;
  activeColor: string;
  hoverBg: string;
  sound: 'cherry-blue' | 'crystal-pop';
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'training',
    label: 'General Mastery',
    subtext: '35 Progressive Levels',
    icon: '🎓',
    activeColor: 'from-cyan-500/30 to-blue-500/30 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    hoverBg: 'hover:bg-cyan-500/15 hover:text-cyan-200 hover:border-cyan-500/40',
    sound: 'cherry-blue',
  },
  {
    id: 'cpp-training',
    label: 'C++ Systems Training',
    subtext: '10 Hardcore Levels',
    icon: '💻',
    activeColor: 'from-blue-600/40 to-indigo-600/40 text-blue-300 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    hoverBg: 'hover:bg-blue-500/20 hover:text-blue-200 hover:border-blue-500/50',
    sound: 'crystal-pop',
  },
  {
    id: 'game',
    mode: 'rain',
    label: '3D Game Arena',
    subtext: 'Word Rain & Falling Matrix',
    icon: '🎮',
    activeColor: 'from-purple-500/30 to-pink-500/30 text-purple-300 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    hoverBg: 'hover:bg-purple-500/15 hover:text-purple-200 hover:border-purple-500/40',
    sound: 'cherry-blue',
  },
  {
    id: 'stickman',
    label: 'Keyboard Warrior',
    subtext: 'Stickman Horde Kombat',
    icon: '🥷',
    activeColor: 'from-red-500/30 via-rose-500/30 to-amber-500/30 text-rose-300 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    hoverBg: 'hover:bg-red-500/15 hover:text-red-200 hover:border-red-500/40',
    sound: 'crystal-pop',
  },
  {
    id: 'multiplayer',
    label: 'Multiplayer Speed Race',
    subtext: 'Live Competitions',
    icon: '🏎️',
    activeColor: 'from-amber-500/30 to-orange-500/30 text-amber-300 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    hoverBg: 'hover:bg-amber-500/15 hover:text-amber-200 hover:border-amber-500/40',
    sound: 'cherry-blue',
  },
  {
    id: 'analytics',
    label: 'Performance Analytics',
    subtext: 'Heatmaps & Velocity Curves',
    icon: '📊',
    activeColor: 'from-emerald-500/30 to-teal-500/30 text-emerald-300 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    hoverBg: 'hover:bg-emerald-500/15 hover:text-emerald-200 hover:border-emerald-500/40',
    sound: 'cherry-blue',
  },
  {
    id: 'academy',
    label: 'Lexicon Academy Vault',
    subtext: 'Word Patterns & Drills',
    icon: '📖',
    activeColor: 'from-rose-500/30 to-pink-500/30 text-rose-300 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    hoverBg: 'hover:bg-rose-500/15 hover:text-rose-200 hover:border-rose-500/40',
    sound: 'cherry-blue',
  },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  userProfile,
  displayScale,
  appLanguage = 'en',
  onChangeDisplayScale,
  onOpenProfile,
  onSelectView,
  onOpenSettings,
  isMuted,
  onToggleMute,
}) => {
  const t = TRANSLATIONS[appLanguage];
  const [streak, setStreak] = useState(() => loadStreak());
  const [showScaleMenu, setShowScaleMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => setStreak(loadStreak());
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('auratype_streak_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('auratype_streak_updated', handleUpdate);
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
      {/* Zone 1: Official App Icon & Brand wordmark */}
      <button
        onClick={() => onSelectView('training')}
        className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2.5 cursor-pointer font-display group shrink-0"
      >
        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-105 group-hover:border-cyan-300 transition-all duration-300">
          <img
            src={appIcon}
            alt="Aura Types"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="glow-cyan text-sm sm:text-base font-extrabold leading-tight tracking-wide">
            AURA TYPES
          </span>
          <span className="text-[8px] font-mono text-cyan-400/80 tracking-widest hidden sm:inline leading-none mt-0.5">
            TOUCH TYPING MASTER
          </span>
        </div>
      </button>

      {/* Zone 2: Animated Floating Icon Dock (No clutter text) */}
      <nav className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800/90 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => {
                  soundEngine.playKeySwitch(item.sound);
                  onSelectView(item.id, item.mode);
                }}
                aria-label={item.label}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 cursor-pointer transform ${
                  isActive
                    ? `bg-gradient-to-tr ${item.activeColor} border-2 scale-110`
                    : `bg-slate-950/60 border border-slate-800/80 text-slate-400 ${item.hoverBg} hover:scale-110 hover:-translate-y-0.5`
                }`}
              >
                {/* Animated Floating Icon */}
                <span className={`inline-block transition-transform duration-300 select-none ${
                  isActive ? 'scale-110 animate-pulse' : 'group-hover:scale-125 group-hover:rotate-6'
                }`}>
                  {item.icon}
                </span>

                {/* Active Indicator Under-Glow Dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
                )}
              </button>

              {/* Floating Animated Tooltip Bubble */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900/95 border border-slate-700/80 rounded-xl text-center pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 shadow-2xl shadow-black/80 z-50 whitespace-nowrap">
                <div className="text-[11px] font-bold text-white tracking-wide">
                  {item.label}
                </div>
                <div className="text-[9px] font-mono text-cyan-400/90">
                  {item.subtext}
                </div>
                {/* Arrow Pointer */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-t border-l border-slate-700 rotate-45" />
              </div>
            </div>
          );
        })}
      </nav>

      {/* Zone 3: User Profile, Daily Streak & Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* User Profile Pill */}
        {userProfile && onOpenProfile && (
          <button
            onClick={onOpenProfile}
            title="Click to edit your typist profile & name"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-xs transition-all cursor-pointer group shadow-sm hover:scale-105"
          >
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
              {userProfile.avatar || '⚡'}
            </span>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-white font-bold text-[11px] leading-tight group-hover:text-cyan-300 transition-colors truncate max-w-[90px]">
                {userProfile.name}
              </span>
              <span className="text-[9px] text-slate-400 font-mono leading-none">
                {userProfile.goalWpm} WPM
              </span>
            </div>
          </button>
        )}

        {/* DAILY STREAK BADGE */}
        <div
          title={`Daily Practice Streak: ${streak.count} consecutive days!`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/40 shadow-sm shadow-amber-500/10 cursor-help"
        >
          <span className="text-sm sm:text-base animate-bounce">🔥</span>
          <span className="text-xs font-mono font-extrabold text-amber-400">
            {streak.count} <span className="text-[9px] font-medium text-amber-300/80 hidden sm:inline">DAYS</span>
          </span>
        </div>

        {/* QUICK DISPLAY ZOOM WIDGET FOR 19" 5:4 & CUSTOM SCREENS */}
        <div className="relative">
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shadow-sm text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                onChangeDisplayScale(Math.max(50, displayScale - 5));
                soundEngine.playKeySwitch('cherry-blue');
              }}
              title={t.zoomOut}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer font-bold text-sm"
            >
              -
            </button>

            <button
              type="button"
              onClick={() => {
                setShowScaleMenu(!showScaleMenu);
                soundEngine.playKeySwitch('crystal-pop');
              }}
              title={t.displayPresets}
              className="px-2 py-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">🖥️</span>
              <span>{displayScale}%</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onChangeDisplayScale(Math.min(130, displayScale + 5));
                soundEngine.playKeySwitch('cherry-blue');
              }}
              title={t.zoomIn}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer font-bold text-sm"
            >
              +
            </button>

            <button
              type="button"
              onClick={() => {
                const vh = window.innerHeight;
                const idealScale = Math.max(60, Math.min(115, Math.round((vh / 930) * 100)));
                onChangeDisplayScale(idealScale);
                soundEngine.playKeySwitch('crystal-pop');
              }}
              title={t.fitScreen}
              className="px-1.5 py-1 text-[10px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-md transition-colors cursor-pointer font-bold"
            >
              ⚡{t.fitScreen}
            </button>
          </div>

          {/* Scale Presets Dropdown Menu */}
          {showScaleMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800 text-[10px] font-mono text-cyan-400 font-bold">
                <span>{t.displayPresets}</span>
                <button
                  type="button"
                  onClick={() => setShowScaleMenu(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {[
                { label: '19" 5:4 (1280x1024)', sub: 'Best for Square', scale: 75, icon: '🖥️' },
                { label: '15.6" Laptop (768p)', sub: 'Compact Screen', scale: 70, icon: '💻' },
                { label: 'Standard Full HD', sub: '1080p Normal (100%)', scale: 100, icon: '📺' },
                { label: '2K / 4K Ultrawide', sub: 'High Resolution', scale: 115, icon: '🎛️' },
              ].map((p) => (
                <button
                  key={p.scale}
                  type="button"
                  onClick={() => {
                    onChangeDisplayScale(p.scale);
                    setShowScaleMenu(false);
                    soundEngine.playKeySwitch('cherry-blue');
                  }}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    displayScale === p.scale
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{p.icon}</span>
                    <span className="text-[11px]">{p.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400">{p.scale}%</span>
                </button>
              ))}

              <div className="pt-1 border-t border-slate-800 mt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const vh = window.innerHeight;
                    const idealScale = Math.max(60, Math.min(115, Math.round((vh / 930) * 100)));
                    onChangeDisplayScale(idealScale);
                    setShowScaleMenu(false);
                    soundEngine.playKeySwitch('crystal-pop');
                  }}
                  className="w-full text-center py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] rounded-lg transition-colors border border-emerald-500/40"
                >
                  ⚡ Auto-Fit Screen Height
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-all hover:scale-105 cursor-pointer"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <button
          onClick={onOpenSettings}
          title="Open Settings"
          className="w-9 h-9 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all hover:scale-105 flex items-center justify-center text-sm cursor-pointer"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};
