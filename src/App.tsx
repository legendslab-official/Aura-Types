/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GameMode,
  AppLanguage,
  DifficultyLevel,
  KeyboardTheme,
  SwitchType,
  PetCompanionData,
  HistorySession,
  KeyHeatmapData,
  WordItem,
  UserProfile,
} from './types';
import { KEYBOARD_THEMES } from './data/themes';
import { INITIAL_PETS } from './data/pets';
import { HeaderNav, AppView } from './components/HeaderNav';
import { TypingMasterDashboard } from './components/TypingMasterDashboard';
import { GameArena } from './components/GameArena';
import { StickmanFighterGame } from './components/StickmanFighterGame';
import { MultiplayerArena } from './components/MultiplayerArena';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { VocabularyAcademy } from './components/VocabularyAcademy';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingProfileModal } from './components/OnboardingProfileModal';
import { soundEngine } from './utils/audio';

export default function App() {
  // App Language State ('en' for 100% English, 'ur' for 100% Urdu)
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('auratype_language') as AppLanguage) || 'en';
  });

  // Navigation & View States: 'training' (Typing Master) vs 'game' (3D Arcade)
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return (localStorage.getItem('auratype_current_view') as AppView) || 'training';
  });
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return (localStorage.getItem('auratype_game_mode') as GameMode) || 'rain';
  });
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    return (localStorage.getItem('auratype_difficulty') as DifficultyLevel) || 'adaptive';
  });

  // Candidate Profile & First-Time Onboarding State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('auratype_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('auratype_user_profile');
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  // Customization & Settings
  const [currentTheme, setCurrentTheme] = useState<KeyboardTheme>(() => {
    const savedThemeId = localStorage.getItem('auratype_theme_id');
    return KEYBOARD_THEMES.find((t) => t.id === savedThemeId) || KEYBOARD_THEMES[0];
  });
  const [currentSwitch, setCurrentSwitch] = useState<SwitchType>(() => {
    return (localStorage.getItem('auratype_switch_id') as SwitchType) || 'cherry-blue';
  });
  const [showKeyboard, setShowKeyboard] = useState<boolean>(() => {
    const saved = localStorage.getItem('auratype_show_keyboard');
    return saved !== null ? saved === 'true' : true;
  });
  const [showFingerGuides, setShowFingerGuides] = useState<boolean>(() => {
    const saved = localStorage.getItem('auratype_show_finger_guides');
    return saved !== null ? saved === 'true' : true;
  });
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(() => {
    return localStorage.getItem('auratype_ambient_on') === 'true';
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('auratype_volume');
    return saved ? Math.max(0, Math.min(1, parseFloat(saved))) : 0.5;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('auratype_muted') === 'true';
  });

  // Display Scale & Screen Fit (For 19" 5:4, Laptops & Custom Monitors)
  const [displayScale, setDisplayScale] = useState<number>(() => {
    const saved = localStorage.getItem('auratype_display_scale');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 50 && parsed <= 150) return parsed;
    }
    // Auto-detect small vertical heights (e.g. 19" 5:4 1280x1024 or laptop screens)
    if (typeof window !== 'undefined' && window.innerHeight <= 980) {
      return 75;
    }
    return 100;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Pet Companion State
  const [pets, setPets] = useState<PetCompanionData[]>(() => {
    const saved = localStorage.getItem('auratype_pets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PETS;
  });
  const [selectedPetId, setSelectedPetId] = useState<string>(() => {
    return localStorage.getItem('auratype_selected_pet_id') || 'nyx-cat';
  });

  // History Sessions & Key Heatmaps (100% Real User Data Only - Zero Mock Data)
  const [sessions, setSessions] = useState<HistorySession[]>(() => {
    const saved = localStorage.getItem('auratype_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any legacy fake seed data
          return parsed.filter((s: HistorySession) => !s.id.startsWith('seed-'));
        }
      } catch {}
    }
    return [];
  });

  const [heatmap, setHeatmap] = useState<KeyHeatmapData>(() => {
    const saved = localStorage.getItem('auratype_heatmap');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('auratype_language', appLanguage);
  }, [appLanguage]);

  useEffect(() => {
    localStorage.setItem('auratype_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('auratype_game_mode', gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem('auratype_difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('auratype_theme_id', currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('auratype_switch_id', currentSwitch);
  }, [currentSwitch]);

  useEffect(() => {
    localStorage.setItem('auratype_show_keyboard', String(showKeyboard));
  }, [showKeyboard]);

  useEffect(() => {
    localStorage.setItem('auratype_show_finger_guides', String(showFingerGuides));
  }, [showFingerGuides]);

  useEffect(() => {
    localStorage.setItem('auratype_ambient_on', String(isAmbientOn));
  }, [isAmbientOn]);

  useEffect(() => {
    localStorage.setItem('auratype_volume', String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('auratype_muted', String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('auratype_display_scale', String(displayScale));
  }, [displayScale]);

  useEffect(() => {
    localStorage.setItem('auratype_selected_pet_id', selectedPetId);
  }, [selectedPetId]);

  useEffect(() => {
    localStorage.setItem('auratype_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('auratype_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('auratype_heatmap', JSON.stringify(heatmap));
  }, [heatmap]);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const handleUpdatePet = (updated: PetCompanionData) => {
    setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleSessionComplete = (
    newSession: HistorySession,
    heatmapUpdate: { [key: string]: { presses: number; errors: number } }
  ) => {
    setSessions((prev) => [newSession, ...prev]);

    setHeatmap((prev) => {
      const merged = { ...prev };
      Object.entries(heatmapUpdate).forEach(([key, val]) => {
        if (!merged[key]) {
          merged[key] = { presses: 0, errors: 0 };
        }
        merged[key].presses += val.presses;
        merged[key].errors += val.errors;
      });
      return merged;
    });
  };

  const handleClearHistory = () => {
    setSessions([]);
    setHeatmap({});
    localStorage.removeItem('auratype_sessions');
    localStorage.removeItem('auratype_heatmap');
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.setMuted(nextMute);
  };

  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    soundEngine.setVolume(vol);
  };

  const handleToggleAmbient = () => {
    const nextState = !isAmbientOn;
    setIsAmbientOn(nextState);
    soundEngine.toggleAmbientMusic(nextState);
  };

  const handleStartWordPractice = (_customWords: WordItem[]) => {
    setGameMode('rain');
    setCurrentView('game');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Top Navigation with Quick Display Zoom Widget */}
      <HeaderNav
        currentView={currentView}
        gameMode={gameMode}
        userProfile={userProfile}
        displayScale={displayScale}
        appLanguage={appLanguage}
        onChangeDisplayScale={setDisplayScale}
        onOpenProfile={() => setIsEditProfileOpen(true)}
        onSelectView={(view, mode) => {
          setCurrentView(view);
          if (mode) setGameMode(mode);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main App Body with Interactive Display Zoom / Scale */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 py-2 sm:py-3 flex flex-col items-center transition-all duration-150"
        style={{
          zoom: `${displayScale}%`,
        }}
      >
        {/* VIEW 1: Typing Master Structured Lessons & Special C++ Coding Training */}
        {(currentView === 'training' || currentView === 'cpp-training') && (
          <TypingMasterDashboard
            key={currentView}
            initialMode={currentView === 'cpp-training' ? 'special-cpp' : 'general'}
            theme={currentTheme}
            switchType={currentSwitch}
            pet={activePet}
            userProfile={userProfile}
            appLanguage={appLanguage}
            onUpdatePet={handleUpdatePet}
            showKeyboard={showKeyboard}
            showFingerGuides={showFingerGuides}
            onRecordSession={(data, hm) => {
              const session: HistorySession = {
                id: `train-${Date.now()}`,
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mode: data.mode,
                difficulty: data.difficulty,
                wpm: data.wpm,
                accuracy: data.accuracy,
                score: data.score,
                durationSeconds: data.durationSeconds,
                wordsCount: data.wordsCount,
              };
              handleSessionComplete(session, hm);
            }}
          />
        )}

        {/* VIEW 2: 3D Game Arcade (Rain, Boss, Synonym, Zen) */}
        {currentView === 'game' && (
          <div className="w-full flex flex-col gap-6">
            {/* Mode & Difficulty Selector Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              {/* Game Modes */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800/80">
                {[
                  { id: 'rain', name: '3D Rain Defense', icon: '🌧️' },
                  { id: 'boss', name: 'Titan Sentinel', icon: '⚔️' },
                  { id: 'synonym', name: 'Synonym Blitz', icon: '🎯' },
                  { id: 'zen', name: 'Zen Meditation', icon: '🌌' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setGameMode(m.id as GameMode);
                      soundEngine.playKeySwitch('cherry-blue');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      gameMode === m.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Difficulty Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Difficulty:</span>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value as DifficultyLevel);
                    soundEngine.playKeySwitch('cherry-blue');
                  }}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="adaptive">⚡ Adaptive Dynamic AI</option>
                  <option value="novice">🌱 Novice (15-30 WPM)</option>
                  <option value="cadet">🚀 Cadet (35-55 WPM)</option>
                  <option value="knight">⚔️ Knight (60-80 WPM)</option>
                  <option value="wizard">🧙‍♂️ Wizard (85-110 WPM)</option>
                  <option value="godspeed">🔥 Godspeed (120+ WPM)</option>
                </select>
              </div>
            </div>

            {/* Game Canvas Arena */}
            <GameArena
              mode={gameMode}
              difficulty={difficulty}
              theme={currentTheme}
              switchType={currentSwitch}
              pet={activePet}
              showKeyboard={showKeyboard}
              showFingerGuides={showFingerGuides}
              onUpdatePet={handleUpdatePet}
              availablePets={pets}
              onSelectPet={(id) => setSelectedPetId(id)}
              onSessionComplete={handleSessionComplete}
              onExitMode={() => setCurrentView('training')}
            />
          </div>
        )}

        {/* VIEW 3: Stickman Fighter Arcade Kombat */}
        {currentView === 'stickman' && (
          <div className="w-full flex justify-center">
            <StickmanFighterGame
              theme={currentTheme}
              switchType={currentSwitch}
              pet={activePet}
              onUpdatePet={handleUpdatePet}
              onSessionComplete={handleSessionComplete}
              onOpenTraining={() => setCurrentView('training')}
            />
          </div>
        )}

        {/* VIEW 4: Multiplayer Grand Prix */}
        {currentView === 'multiplayer' && (
          <MultiplayerArena theme={currentTheme} switchType={currentSwitch} pet={activePet} />
        )}

        {/* VIEW 5: Analytics & Keystroke Heatmap */}
        {currentView === 'analytics' && (
          <AnalyticsDashboard sessions={sessions} heatmap={heatmap} onClearHistory={handleClearHistory} />
        )}

        {/* VIEW 6: Lexicon Academy */}
        {currentView === 'academy' && (
          <VocabularyAcademy onStartWordPractice={handleStartWordPractice} />
        )}
      </main>

      {/* First-Time Welcome Onboarding & Profile Setup Modal */}
      {showOnboarding && (
        <OnboardingProfileModal
          initialProfile={userProfile || undefined}
          appLanguage={appLanguage}
          onSave={(profile, preferredSwitch) => {
            setUserProfile(profile);
            setShowOnboarding(false);
            if (preferredSwitch) setCurrentSwitch(preferredSwitch);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <OnboardingProfileModal
          isEditMode={true}
          initialProfile={userProfile || undefined}
          appLanguage={appLanguage}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(profile, preferredSwitch) => {
            setUserProfile(profile);
            setIsEditProfileOpen(false);
            if (preferredSwitch) setCurrentSwitch(preferredSwitch);
          }}
        />
      )}

      {/* Global Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          currentTheme={currentTheme}
          currentSwitch={currentSwitch}
          difficulty={difficulty}
          showKeyboard={showKeyboard}
          showFingerGuides={showFingerGuides}
          isAmbientOn={isAmbientOn}
          volume={volume}
          displayScale={displayScale}
          appLanguage={appLanguage}
          onChangeLanguage={(lang) => setAppLanguage(lang)}
          onChangeDisplayScale={(scale) => setDisplayScale(scale)}
          onSelectTheme={(t) => setCurrentTheme(t)}
          onSelectSwitch={(s) => setCurrentSwitch(s)}
          onSelectDifficulty={(d) => setDifficulty(d)}
          onToggleKeyboard={() => setShowKeyboard((prev) => !prev)}
          onToggleFingerGuides={() => setShowFingerGuides((prev) => !prev)}
          onToggleAmbient={handleToggleAmbient}
          onChangeVolume={handleChangeVolume}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Quiet Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 bg-slate-950 text-center text-xs text-slate-500">
        <span>Aura Type</span>
        <span aria-hidden="true" className="mx-2">·</span>
        <span>Touch Typing Master Curriculum & 3D Rain Arena</span>
        <span aria-hidden="true" className="mx-2">·</span>
        <span>Dynamic AI & Mechanical Switch Acoustics</span>
      </footer>
    </div>
  );
}
