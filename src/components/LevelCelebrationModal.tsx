import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelItem, LEVELS_35 } from '../data/levels35';
import { PetCompanionData } from '../types';
import { soundEngine } from '../utils/audio';

interface LevelCelebrationModalProps {
  completedLevel: LevelItem;
  nextLevel: LevelItem | null;
  stars: number;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  timeTakenSec: number;
  errorCount: number;
  xpGained: number;
  pet: PetCompanionData;
  onStartNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevelMap: () => void;
}

export const LevelCelebrationModal: React.FC<LevelCelebrationModalProps> = ({
  completedLevel,
  nextLevel,
  stars,
  netWpm,
  grossWpm,
  accuracy,
  timeTakenSec,
  errorCount,
  xpGained,
  pet,
  onStartNextLevel,
  onReplayLevel,
  onOpenLevelMap,
}) => {
  useEffect(() => {
    // Sound & Confetti blast on mount
    soundEngine.playLevelUp();

    const end = Date.now() + 1500;
    const colors = ['#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#38bdf8'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  // Keyboard shortcut: Press Enter or Space to go to next level
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (nextLevel) {
          onStartNextLevel();
        } else {
          onOpenLevelMap();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextLevel, onStartNextLevel, onOpenLevelMap]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)] text-center overflow-hidden flex flex-col items-center">
        {/* Background Ambient Aura Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Phase Header Tag */}
        <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-3">
          {completedLevel.phaseTitle} · Level {completedLevel.id} Cleared
        </span>

        {/* Big Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display animate-shimmer">
          VICTORY & LEVEL UNLOCKED!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {completedLevel.title.replace(`Level ${completedLevel.id}: `, '')}
        </p>

        {/* Star Rating Animation Reveal */}
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="text-4xl sm:text-5xl drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-star-1">
            {stars >= 1 ? '⭐' : '☆'}
          </div>
          <div className="text-5xl sm:text-6xl drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-star-2">
            {stars >= 2 ? '⭐' : '☆'}
          </div>
          <div className="text-4xl sm:text-5xl drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-star-3">
            {stars >= 3 ? '⭐' : '☆'}
          </div>
        </div>

        {/* Next Level Unlocked Banner */}
        {nextLevel ? (
          <div className="w-full bg-gradient-to-r from-cyan-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/40 rounded-2xl p-4 my-2 flex items-center justify-between shadow-lg animate-unlock-slam">
            <div className="flex items-center gap-3 text-left">
              <span className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {nextLevel.icon}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    🔓 Next Level Unlocked
                  </span>
                  <span className="text-[10px] text-slate-500">·</span>
                  <span className="text-[10px] text-slate-400 font-mono">Target: {nextLevel.targetWpm} WPM</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Level {nextLevel.id}: {nextLevel.title.replace(`Level ${nextLevel.id}: `, '')}
                </h4>
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-400/40">
              READY
            </span>
          </div>
        ) : (
          <div className="w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-4 my-2 text-center">
            <span className="text-2xl mb-1">👑</span>
            <h4 className="text-base font-bold text-amber-300">All 35 Levels Mastered!</h4>
            <p className="text-xs text-slate-400">You have completed the entire Touch-Typing & C++ Curriculum!</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2.5 my-4 w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
          <div className="p-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Speed</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {grossWpm} <span className="text-[10px] font-normal text-slate-400">WPM</span>
            </p>
          </div>
          <div className="p-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Accuracy</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {accuracy}%
            </p>
          </div>
          <div className="p-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Time</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-purple-400 tabular-nums">
              {timeTakenSec}s
            </p>
          </div>
          <div className="p-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Errors</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {errorCount}
            </p>
          </div>
        </div>

        {/* Pet Companion XP Gain */}
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>🐾 {pet.name}:</span>
            <span className="text-emerald-400 font-bold font-mono">+{xpGained} XP Gained!</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Companion Lv.{pet.level}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {nextLevel ? (
            <button
              onClick={onStartNextLevel}
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold rounded-2xl text-sm transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 font-display tracking-wide"
            >
              <span>CONTINUE TO LEVEL {nextLevel.id}</span>
              <span>→</span>
              <span className="text-[10px] font-mono bg-slate-950/20 px-1.5 py-0.5 rounded ml-1 font-normal">
                [ENTER]
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLevelMap}
              className="flex-1 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-sm transition-all cursor-pointer"
            >
              View All Certifications
            </button>
          )}

          <button
            onClick={onReplayLevel}
            className="py-3 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Replay Level
          </button>

          <button
            onClick={onOpenLevelMap}
            className="py-3 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Level Map 🗺️
          </button>
        </div>
      </div>
    </div>
  );
};
