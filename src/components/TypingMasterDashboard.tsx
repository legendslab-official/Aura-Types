import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LevelItem, LEVELS_35 } from '../data/levels35';
import { SPECIAL_CPP_LEVELS } from '../data/specialCppLevels';
import { KeyboardTheme, SwitchType, PetCompanionData, UserProfile, AppLanguage } from '../types';
import { getFingerHint, TRANSLATIONS } from '../data/translations';
import { VirtualKeyboard } from './VirtualKeyboard';
import { LevelCelebrationModal } from './LevelCelebrationModal';
import { AssessmentTestModal } from './AssessmentTestModal';
import { TypingCertificateModal, CertificateData } from './TypingCertificateModal';
import { soundEngine } from '../utils/audio';
import { recordStreakActivity } from '../utils/streak';

interface LevelProgressData {
  [levelId: number]: {
    completed: boolean;
    stars: number;
    wpm: number;
    accuracy: number;
    date: string;
  };
}

export type CurriculumMode = 'general' | 'special-cpp';

interface TypingMasterDashboardProps {
  theme: KeyboardTheme;
  switchType: SwitchType;
  pet: PetCompanionData;
  userProfile?: UserProfile | null;
  appLanguage?: AppLanguage;
  onUpdatePet: (pet: PetCompanionData) => void;
  showKeyboard: boolean;
  showFingerGuides: boolean;
  initialMode?: CurriculumMode;
  onRecordSession: (session: {
    wpm: number;
    accuracy: number;
    score: number;
    durationSeconds: number;
    wordsCount: number;
    mode: 'rain' | 'boss' | 'synonym' | 'zen' | 'multiplayer';
    difficulty: 'novice' | 'cadet' | 'knight' | 'wizard' | 'godspeed' | 'adaptive';
  }, heatmapUpdate: { [key: string]: { presses: number; errors: number } }) => void;
}

const MILESTONE_LEVELS = [5, 10, 15, 20, 25, 30];

export const TypingMasterDashboard: React.FC<TypingMasterDashboardProps> = ({
  theme,
  switchType,
  pet,
  userProfile,
  appLanguage = 'en',
  onUpdatePet,
  showKeyboard,
  showFingerGuides,
  initialMode = 'general',
  onRecordSession,
}) => {
  const t = TRANSLATIONS[appLanguage];
  const [curriculumMode, setCurriculumMode] = useState<CurriculumMode>(() => {
    const saved = localStorage.getItem('auratype_curriculum_mode') as CurriculumMode;
    return saved || initialMode;
  });

  useEffect(() => {
    if (initialMode && initialMode !== curriculumMode) {
      setCurriculumMode(initialMode);
    }
  }, [initialMode]);

  const activeLevelsList = curriculumMode === 'special-cpp' ? SPECIAL_CPP_LEVELS : LEVELS_35;

  // Saved Progress per Level
  const [levelProgress, setLevelProgress] = useState<LevelProgressData>(() => {
    const key = curriculumMode === 'special-cpp' ? 'auratype_cpp10_progress' : 'auratype_35_progress';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Passed Milestone Tests Tracker
  const [passedMilestones, setPassedMilestones] = useState<{ [milestone: number]: boolean }>(() => {
    const saved = localStorage.getItem('auratype_passed_milestones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Current Active Level
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    const initMode = (localStorage.getItem('auratype_curriculum_mode') as CurriculumMode) || initialMode;
    const key = `auratype_level_${initMode}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 1;
  });
  const [showLevelMapModal, setShowLevelMapModal] = useState<boolean>(false);
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'beginner' | 'medium' | 'hardcore' | 'coding'>(() => {
    return (localStorage.getItem('auratype_phase_filter') as any) || 'all';
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('auratype_curriculum_mode', curriculumMode);
    const key = curriculumMode === 'special-cpp' ? 'auratype_cpp10_progress' : 'auratype_35_progress';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setLevelProgress(JSON.parse(saved));
      } catch {
        setLevelProgress({});
      }
    } else {
      setLevelProgress({});
    }

    const savedLvl = localStorage.getItem(`auratype_level_${curriculumMode}`);
    if (savedLvl) {
      const parsedLvl = Number(savedLvl);
      if (parsedLvl >= 1) {
        setCurrentLevelId(parsedLvl);
      }
    }
  }, [curriculumMode]);

  useEffect(() => {
    localStorage.setItem(`auratype_level_${curriculumMode}`, String(currentLevelId));
  }, [currentLevelId, curriculumMode]);

  useEffect(() => {
    localStorage.setItem('auratype_phase_filter', phaseFilter);
  }, [phaseFilter]);

  useEffect(() => {
    localStorage.setItem('auratype_passed_milestones', JSON.stringify(passedMilestones));
  }, [passedMilestones]);

  // Milestone Assessment Test Modal States
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);
  const [assessmentLevelTrigger, setAssessmentLevelTrigger] = useState<number>(5);
  const [pendingNextLevelId, setPendingNextLevelId] = useState<number | null>(null);

  // Official Certificate Modal States
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

  // Active Practice State
  const activeLevel = activeLevelsList.find((l) => l.id === currentLevelId) || activeLevelsList[0];
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // Celebration Modal State
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showFailedModal, setShowFailedModal] = useState<boolean>(false);
  const [celebrationData, setCelebrationData] = useState<{
    completedLevel: LevelItem;
    nextLevel: LevelItem | null;
    stars: number;
    netWpm: number;
    grossWpm: number;
    accuracy: number;
    timeTakenSec: number;
    errorCount: number;
    xpGained: number;
  } | null>(null);

  const localHeatmapRef = useRef<{ [key: string]: { presses: number; errors: number } }>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);

  // Auto-scroll stream to keep active typing cursor centered
  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [userInput.length]);

  // Check if a level is unlocked
  const isLevelUnlocked = (lvlId: number): boolean => {
    if (lvlId === 1) return true;
    // Any level unlocks once previous level is completed
    return Boolean(levelProgress[lvlId - 1]?.completed);
  };

  const switchCurriculumMode = (mode: CurriculumMode) => {
    setCurriculumMode(mode);
    const savedLvl = localStorage.getItem(`auratype_level_${mode}`);
    setCurrentLevelId(savedLvl ? Math.max(1, Number(savedLvl)) : 1);
    setUserInput('');
    setStartTime(null);
    setElapsedSec(0);
    setTotalErrors(0);
    setShowCelebration(false);
    setShowFailedModal(false);
    setShowLevelMapModal(false);
    setShowAssessmentModal(false);
    soundEngine.playKeySwitch('crystal-pop');
  };

  const resetPractice = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedSec(0);
    setTotalErrors(0);
    setShowCelebration(false);
    setShowFailedModal(false);
    setCelebrationData(null);
    localHeatmapRef.current = {};
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const selectLevel = (levelId: number) => {
    if (!isLevelUnlocked(levelId)) return;
    setCurrentLevelId(levelId);
    setShowLevelMapModal(false);
    resetPractice();
    soundEngine.playKeySwitch('crystal-pop');
  };

  // Finish Level Logic
  const handleFinishLevel = useCallback((finalInput: string, finalElapsed: number, finalErrors: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const durationMinutes = Math.max(0.05, finalElapsed / 60);
    const totalChars = finalInput.length;
    // Gross WPM: Actual words typed per minute (consistent with live speedometer)
    const grossWpm = Math.max(1, Math.round((totalChars / 5) / durationMinutes));
    // Net WPM: Uncorrected error penalty
    const netWpm = Math.max(1, Math.round(((totalChars - finalErrors) / 5) / durationMinutes));
    const accuracy = totalChars > 0 ? Math.max(0, Math.round(((totalChars - finalErrors) / totalChars) * 100)) : 100;

    // Friendly passing condition: accuracy meets level minimum AND gross speed meets at least 40% of target (min 5 WPM)
    const minRequiredSpeed = Math.max(5, Math.round(activeLevel.targetWpm * 0.4));
    const passed = accuracy >= activeLevel.minAccuracyToPass && grossWpm >= minRequiredSpeed;

    let stars = 1;
    if (accuracy >= activeLevel.minAccuracyToPass + 5 && grossWpm >= activeLevel.targetWpm) {
      stars = 3;
    } else if (accuracy >= activeLevel.minAccuracyToPass && grossWpm >= activeLevel.targetWpm * 0.8) {
      stars = 2;
    }

    const xpGained = stars * 40;

    if (passed) {
      // Save Level Progress (unlocks next level immediately)
      setLevelProgress((prev) => {
        const updated = {
          ...prev,
          [activeLevel.id]: {
            completed: true,
            stars: Math.max(stars, prev[activeLevel.id]?.stars || 0),
            wpm: Math.max(grossWpm, prev[activeLevel.id]?.wpm || 0),
            accuracy: Math.max(accuracy, prev[activeLevel.id]?.accuracy || 0),
            date: 'Just now',
          },
        };
        const key = curriculumMode === 'special-cpp' ? 'auratype_cpp10_progress' : 'auratype_35_progress';
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      });

      // Mark milestone passed so Level 6 and forward are never blocked
      setPassedMilestones((prev) => {
        const updated = { ...prev, [activeLevel.id]: true };
        localStorage.setItem('auratype_passed_milestones', JSON.stringify(updated));
        return updated;
      });

      // Award Pet XP
      const newXp = pet.xp + xpGained;
      const newLvl = 1 + Math.floor(newXp / 100);
      onUpdatePet({ ...pet, xp: newXp, level: newLvl });

      // Record Daily Streak Activity
      recordStreakActivity();
      window.dispatchEvent(new Event('auratype_streak_updated'));

      const nextLevelObj = activeLevelsList.find((l) => l.id === activeLevel.id + 1) || null;

      setCelebrationData({
        completedLevel: activeLevel,
        nextLevel: nextLevelObj,
        stars,
        netWpm,
        grossWpm,
        accuracy,
        timeTakenSec: finalElapsed,
        errorCount: finalErrors,
        xpGained,
      });

      setShowCelebration(true);
      soundEngine.playLevelUp();
    } else {
      soundEngine.playError();
      setCelebrationData({
        completedLevel: activeLevel,
        nextLevel: null,
        stars: 0,
        netWpm,
        grossWpm,
        accuracy,
        timeTakenSec: finalElapsed,
        errorCount: finalErrors,
        xpGained: 0,
      });
      setShowFailedModal(true);
    }

    onRecordSession(
      {
        wpm: grossWpm,
        accuracy,
        score: Math.round(grossWpm * 10 * (accuracy / 100)),
        durationSeconds: finalElapsed,
        wordsCount: Math.round(totalChars / 5),
        mode: 'zen',
        difficulty: 'adaptive',
      },
      localHeatmapRef.current
    );
  }, [activeLevel, activeLevelsList, curriculumMode, pet, onUpdatePet, onRecordSession]);

  // Key Event Listener
  useEffect(() => {
    if (showCelebration || showFailedModal || showLevelMapModal || showAssessmentModal || showCertificateModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Backspace') {
        e.preventDefault();
      }

      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }

      if (startTime === null) {
        setStartTime(Date.now());
      }

      let charToCompare = e.key;
      if (e.key === 'Enter') {
        charToCompare = '\n';
      }

      const lower = e.key.toLowerCase();
      setActiveKeys((prev) => new Set(prev).add(lower));
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(lower);
          return next;
        });
      }, 150);

      soundEngine.playKeySwitch(switchType);

      const targetText = activeLevel.text;

      if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1));
        return;
      }

      const expectedChar = targetText[userInput.length];
      const isMatch = charToCompare === expectedChar;

      if (!isMatch) {
        soundEngine.playError();
        localHeatmapRef.current[lower] = { presses: 0, errors: 0 };
        localHeatmapRef.current[lower].errors += 1;
        setTotalErrors((prev) => prev + 1);
      }

      const nextInput = userInput + charToCompare;
      setUserInput(nextInput);

      if (nextInput.length >= targetText.length) {
        const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : elapsedSec;
        handleFinishLevel(nextInput, Math.max(1, elapsed), totalErrors + (isMatch ? 0 : 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLevel, userInput, startTime, elapsedSec, totalErrors, switchType, showCelebration, showFailedModal, showLevelMapModal, showAssessmentModal, showCertificateModal, handleFinishLevel]);

  // Elapsed Timer Loop
  useEffect(() => {
    if (startTime === null || showCelebration || showFailedModal || showLevelMapModal || showAssessmentModal || showCertificateModal) return;

    timerRef.current = setInterval(() => {
      setElapsedSec(Math.round((Date.now() - startTime) / 1000));
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, showCelebration, showFailedModal, showLevelMapModal, showAssessmentModal, showCertificateModal]);

  const liveDurationMin = Math.max(0.05, elapsedSec / 60);
  const liveGrossWpm = startTime ? Math.round((userInput.length / 5) / liveDurationMin) : 0;
  const liveAccuracy = userInput.length > 0
    ? Math.max(0, Math.round(((userInput.length - totalErrors) / userInput.length) * 100))
    : 100;

  const nextChar = activeLevel?.text ? activeLevel.text[userInput.length] : undefined;
  const nextFinger = getFingerHint(nextChar, appLanguage);

  const completedCount = Object.values(levelProgress).filter((l) => l.completed).length;
  const totalStars = Object.values(levelProgress).reduce((sum, l) => sum + (l.stars || 0), 0);

  const filteredLevels = activeLevelsList.filter((l) => {
    if (phaseFilter === 'all') return true;
    return l.phase === phaseFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3.5 sm:gap-4">
      {/* CURRICULUM MODE SWITCHER */}
      <div className="flex items-center justify-between p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchCurriculumMode('general')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              curriculumMode === 'general'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🎓</span>
            <span>{t.generalTypingMode}</span>
          </button>

          <button
            onClick={() => switchCurriculumMode('special-cpp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              curriculumMode === 'special-cpp'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50 animate-pulse'
                : 'text-blue-400 hover:text-blue-200 hover:bg-blue-950/40 border border-blue-500/30'
            }`}
          >
            <span>💻</span>
            <span>{t.cppCodingMode}</span>
          </button>
        </div>
      </div>

      {/* ULTRA-CLEAN WORKSPACE CONTAINER */}
      <div className="flex flex-col gap-2.5 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Top Professional HUD Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2.5 sm:pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 ${
              curriculumMode === 'special-cpp'
                ? 'bg-blue-500/20 border border-blue-400/60 shadow-[0_0_18px_rgba(59,130,246,0.35)]'
                : 'bg-cyan-500/15 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            }`}>
              {activeLevel.icon}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {activeLevel.title}
                </h2>
                {activeLevel.id <= 15 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                    ⏱️ ~5 Min Drill
                  </span>
                )}
                {activeLevel.id >= 11 && activeLevel.id <= 15 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                    ⚡ Top & Bottom Rows Focus
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium line-clamp-1">
                {activeLevel.subtitle} · <span className="text-cyan-400/90 font-mono">{Math.round(activeLevel.text.length / 5)} words ({activeLevel.text.length} chars)</span>
              </p>
            </div>
          </div>

          {/* Level Navigator & Live Metrics */}
          <div className="flex items-center gap-2 sm:self-center">
            {/* Speed Meter */}
            <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center min-w-[68px]">
              <span className="text-[10px] text-slate-400">Live Speed</span>
              <span className="text-base sm:text-lg font-bold font-mono text-cyan-400 tabular-nums">
                {liveGrossWpm} <span className="text-[10px] font-normal text-slate-500">WPM</span>
              </span>
            </div>

            {/* Accuracy Meter */}
            <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center min-w-[68px]">
              <span className="text-[10px] text-slate-400">Accuracy</span>
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {liveAccuracy}%
              </span>
            </div>

            {/* Timer */}
            <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center min-w-[70px]">
              <span className="text-[10px] text-slate-400">Time</span>
              <span className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
                {Math.floor(elapsedSec / 60) > 0
                  ? `${Math.floor(elapsedSec / 60)}m ${(elapsedSec % 60).toString().padStart(2, '0')}s`
                  : `${elapsedSec}s`}
              </span>
            </div>

            {/* Level Map Drawer Button */}
            <button
              onClick={() => {
                setShowLevelMapModal(true);
                soundEngine.playKeySwitch('cherry-blue');
              }}
              className="px-2.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 text-xs font-semibold rounded-xl border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>🗺️</span>
              <span className="font-mono text-[11px] sm:text-xs">Roadmap ({activeLevelsList.length})</span>
            </button>
          </div>
        </div>

        {/* Sleek Minimal Progress Line */}
        <div className="w-full bg-slate-800/70 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              curriculumMode === 'special-cpp'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_12px_#3b82f6]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_#06b6d4]'
            }`}
            style={{ width: `${(userInput.length / activeLevel.text.length) * 100}%` }}
          />
        </div>

        {/* 1. SLIM / COMPACT FULL-TEXT PREVIEW STREAM */}
        <div className="w-full bg-slate-950/70 rounded-xl border border-slate-800/80 px-3 py-1.5 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-xs text-slate-500 shadow-inner select-none gap-0.5">
          {activeLevel.text.split('').map((char, idx) => {
            const isTyped = idx < userInput.length;
            const isCurrent = idx === userInput.length;
            let charStyle = 'text-slate-600';

            if (isTyped) {
              const userChar = userInput[idx];
              charStyle = userChar === char ? 'text-emerald-500/80' : 'text-rose-400 font-bold';
            } else if (isCurrent) {
              charStyle = 'text-cyan-300 font-bold bg-cyan-500/20 px-0.5 rounded';
            }

            return (
              <span
                key={idx}
                ref={isCurrent ? activeCharRef : null}
                className={charStyle}
              >
                {char === '\n' ? '↵ ' : char === ' ' && isCurrent ? '␣' : char}
              </span>
            );
          })}
        </div>

        {/* 2. LARGE & PROMINENT FOCUSED ACTIVE WORD DISPLAY */}
        {(() => {
          const targetText = activeLevel.text;
          const currentIdx = userInput.length;

          let wordStart = currentIdx;
          while (wordStart > 0 && targetText[wordStart - 1] !== ' ' && targetText[wordStart - 1] !== '\n') {
            wordStart--;
          }
          let wordEnd = currentIdx;
          while (wordEnd < targetText.length && targetText[wordEnd] !== ' ' && targetText[wordEnd] !== '\n') {
            wordEnd++;
          }

          const currentWord = targetText.slice(wordStart, wordEnd);
          const isAtSpaceOrNewline = currentIdx < targetText.length && (targetText[currentIdx] === ' ' || targetText[currentIdx] === '\n');
          const isAtNewline = currentIdx < targetText.length && targetText[currentIdx] === '\n';

          const upcomingAfter = targetText.slice(isAtSpaceOrNewline ? currentIdx + 1 : wordEnd).trimStart();
          const upcomingQueue = upcomingAfter.split(/\s+/).filter(Boolean).slice(0, 3);

          return (
            <div className={`w-full p-2.5 sm:p-3 bg-slate-950 rounded-2xl border-2 shadow-2xl flex flex-col items-center justify-center min-h-[82px] sm:min-h-[94px] relative overflow-hidden ${
              curriculumMode === 'special-cpp' ? 'border-blue-500/40' : 'border-cyan-500/40'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-cyan-500/5 pointer-events-none" />

              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 font-mono text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider z-10 select-none">
                <div className={`flex items-center bg-slate-900/90 px-3 py-1 rounded-xl border ${
                  curriculumMode === 'special-cpp' ? 'border-blue-400/50 shadow-[0_0_25px_rgba(59,130,246,0.3)]' : 'border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                }`}>
                  {currentWord.length > 0 ? (
                    currentWord.split('').map((char, cIdx) => {
                      const absoluteCharIdx = wordStart + cIdx;
                      const isCharTyped = absoluteCharIdx < userInput.length;
                      const isCharCurrent = absoluteCharIdx === userInput.length;

                      let cColor = 'text-slate-400';
                      if (isCharTyped) {
                        const typedChar = userInput[absoluteCharIdx];
                        cColor = typedChar === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/30 rounded';
                      }

                      return (
                        <span
                          key={cIdx}
                          className={`relative transition-all duration-100 ${cColor} ${
                            isCharCurrent
                              ? 'text-white bg-cyan-500/40 px-1 rounded-lg border-b-4 border-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]'
                              : ''
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })
                  ) : null}

                  {isAtSpaceOrNewline && (
                    <span className="ml-2 px-2.5 py-0.5 bg-cyan-500 text-slate-950 rounded-lg text-base sm:text-lg font-bold font-mono animate-bounce shadow-[0_0_15px_#06b6d4]">
                      {isAtNewline ? 'ENTER ↵' : 'SPACE ␣'}
                    </span>
                  )}
                </div>

                {upcomingQueue.map((w, qIdx) => (
                  <span
                    key={qIdx}
                    className={`font-semibold transition-opacity ${
                      qIdx === 0 ? 'text-slate-400 opacity-90' : qIdx === 1 ? 'text-slate-600 opacity-60 hidden sm:inline' : 'text-slate-700 opacity-40 hidden md:inline'
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono z-10">
                <span>{t.nextCharacter}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                  {nextChar === ' ' ? 'SPACE ␣' : nextChar === '\n' ? 'ENTER ↵' : nextChar}
                </span>
                <span>· {t.finger} <strong className="text-emerald-400">{nextFinger}</strong></span>
              </div>
            </div>
          );
        })()}

        {/* On-Screen Mechanical Keyboard with Dual Real Hands */}
        {showKeyboard && (
          <VirtualKeyboard
            theme={theme}
            activeKeys={activeKeys}
            nextKeyToPress={nextChar}
            showFingerGuides={showFingerGuides}
            appLanguage={appLanguage}
            onKeyClick={(char) => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
            }}
          />
        )}
      </div>

      {/* MANDATORY GATEWAY TEST MODAL (POPS UP ONLY WHEN COMPLETING LEVEL 5, 10, 15, 20, 25, 30) */}
      {showAssessmentModal && (
        <AssessmentTestModal
          theme={theme}
          switchType={switchType}
          levelTriggered={assessmentLevelTrigger}
          onClose={() => {
            setShowAssessmentModal(false);
            if (pendingNextLevelId && passedMilestones[assessmentLevelTrigger]) {
              selectLevel(pendingNextLevelId);
            }
          }}
          onPassed={(wpm, acc) => {
            // Mark milestone test as permanently passed!
            setPassedMilestones((prev) => {
              const updated = { ...prev, [assessmentLevelTrigger]: true };
              localStorage.setItem('auratype_passed_milestones', JSON.stringify(updated));
              return updated;
            });

            if (assessmentLevelTrigger >= 30) {
              setCertificateData({
                recipientName: userProfile?.name || 'Typing Master Candidate',
                wpm,
                accuracy: acc,
                durationMinutes: 10,
                examTitle: 'Grandmaster Graduation Certification Exam (Level 30)',
                verificationId: `CERT-${Date.now().toString(36).toUpperCase()}`,
                date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
                grade: 'V8.5',
              });
              setShowCertificateModal(true);
            }
          }}
        />
      )}

      {/* OFFICIAL DIPLOMA CERTIFICATE MODAL */}
      {showCertificateModal && certificateData && (
        <TypingCertificateModal
          data={certificateData}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* STYLISH LEVEL CELEBRATION MODAL ON NORMAL LEVEL COMPLETION */}
      {showCelebration && celebrationData && (
        <LevelCelebrationModal
          completedLevel={celebrationData.completedLevel}
          nextLevel={celebrationData.nextLevel}
          stars={celebrationData.stars}
          netWpm={celebrationData.netWpm}
          grossWpm={celebrationData.grossWpm}
          accuracy={celebrationData.accuracy}
          timeTakenSec={celebrationData.timeTakenSec}
          errorCount={celebrationData.errorCount}
          xpGained={celebrationData.xpGained}
          pet={pet}
          onStartNextLevel={() => {
            if (celebrationData.nextLevel) {
              selectLevel(celebrationData.nextLevel.id);
            }
          }}
          onReplayLevel={resetPractice}
          onOpenLevelMap={() => {
            setShowCelebration(false);
            setShowLevelMapModal(true);
          }}
        />
      )}

      {/* RETRY MODAL ON INSUFFICIENT ACCURACY */}
      {showFailedModal && celebrationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 text-center shadow-2xl">
            <span className="text-4xl mb-2">⚠️</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">Needs More Precision to Pass</h3>
            <p className="text-xs text-slate-300 mt-1">
              You achieved {celebrationData.grossWpm} WPM and {celebrationData.accuracy}% accuracy. Minimum requirement is {activeLevel.minAccuracyToPass}% accuracy.
            </p>

            <div className="grid grid-cols-2 gap-3 my-5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Target Speed</span>
                <p className="font-mono text-cyan-400 font-bold text-lg">{activeLevel.targetWpm} WPM</p>
              </div>
              <div>
                <span className="text-slate-400">Target Accuracy</span>
                <p className="font-mono text-emerald-400 font-bold text-lg">{activeLevel.minAccuracyToPass}%</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetPractice}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Retry Level {activeLevel.id}
              </button>
              <button
                onClick={() => {
                  setShowFailedModal(false);
                  setShowLevelMapModal(true);
                }}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Level Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROADMAP MODAL */}
      {showLevelMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[88vh] overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {curriculumMode === 'special-cpp' ? 'Special C++ 20 Roadmap (10 Levels)' : 'Curriculum Level Roadmap (35 Levels)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {completedCount} of {activeLevelsList.length} Levels Cleared · ⭐ {totalStars} Stars Earned
                </p>
              </div>
              <button
                onClick={() => setShowLevelMapModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto pr-1 flex-1 my-4">
              {filteredLevels.map((lvl) => {
                const isUnlocked = isLevelUnlocked(lvl.id);
                const record = levelProgress[lvl.id];
                const isDone = record?.completed;
                const isCurrent = lvl.id === activeLevel.id;
                const isGateLevel = MILESTONE_LEVELS.includes(lvl.id);
                const gatePassed = passedMilestones[lvl.id];

                return (
                  <button
                    key={lvl.id}
                    disabled={!isUnlocked}
                    onClick={() => selectLevel(lvl.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/60 shadow-lg'
                        : !isUnlocked
                        ? 'bg-slate-950/30 border-slate-850 opacity-40 cursor-not-allowed'
                        : isDone
                        ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          LVL {lvl.id}
                        </span>
                        {!isUnlocked ? (
                          <span className="text-[10px] text-slate-600">🔒</span>
                        ) : isDone ? (
                          <div className="flex text-amber-400 text-[10px]">
                            {'★'.repeat(record.stars)}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">{lvl.targetWpm} WPM</span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white truncate">{lvl.title.replace(`Level ${lvl.id}: `, '')}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-cyan-400">
                      <span>{isDone ? `${record.wpm} WPM` : `Acc: ${lvl.minAccuracyToPass}%`}</span>
                      {lvl.id <= 15 ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          ~5 min
                        </span>
                      ) : isGateLevel ? (
                        <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                          gatePassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {gatePassed ? 'Gate ✓' : 'Gate ⏱️'}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
