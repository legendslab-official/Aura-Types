import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GameMode,
  DifficultyLevel,
  ActiveRainWord,
  WordItem,
  TypingStats,
  KeyboardTheme,
  SwitchType,
  PetCompanionData,
  HistorySession,
} from '../types';
import { VOCABULARY_DECKS, ZEN_PASSAGES } from '../data/vocabulary';
import { ThreeRainScene } from './ThreeRainScene';
import { VirtualKeyboard } from './VirtualKeyboard';
import { PetCompanion } from './PetCompanion';
import { soundEngine } from '../utils/audio';
import { recordStreakActivity } from '../utils/streak';

interface GameArenaProps {
  mode: GameMode;
  difficulty: DifficultyLevel;
  theme: KeyboardTheme;
  switchType: SwitchType;
  pet: PetCompanionData;
  showKeyboard: boolean;
  showFingerGuides: boolean;
  onUpdatePet: (pet: PetCompanionData) => void;
  availablePets: PetCompanionData[];
  onSelectPet: (petId: string) => void;
  onSessionComplete: (session: HistorySession, heatmapUpdate: { [key: string]: { presses: number; errors: number } }) => void;
  onExitMode: () => void;
}

const DIFFICULTY_CONFIG = {
  novice: { baseSpeed: 0.8, spawnInterval: 3200, maxActiveWords: 3, label: 'Novice (15-30 WPM)' },
  cadet: { baseSpeed: 1.4, spawnInterval: 2400, maxActiveWords: 4, label: 'Cadet (35-55 WPM)' },
  knight: { baseSpeed: 2.2, spawnInterval: 1800, maxActiveWords: 6, label: 'Knight (60-80 WPM)' },
  wizard: { baseSpeed: 3.2, spawnInterval: 1400, maxActiveWords: 8, label: 'Wizard (85-110 WPM)' },
  godspeed: { baseSpeed: 4.5, spawnInterval: 1000, maxActiveWords: 10, label: 'Godspeed (120+ WPM)' },
  adaptive: { baseSpeed: 1.5, spawnInterval: 2000, maxActiveWords: 5, label: 'Adaptive Dynamic AI' },
};

export const GameArena: React.FC<GameArenaProps> = ({
  mode,
  difficulty,
  theme,
  switchType,
  pet,
  showKeyboard,
  showFingerGuides,
  onUpdatePet,
  availablePets,
  onSelectPet,
  onSessionComplete,
  onExitMode,
}) => {
  // Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // Active Words in 3D Rain
  const [words, setWords] = useState<ActiveRainWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // Shield / Health
  const [shieldHealth, setShieldHealth] = useState(100);
  const [maxShieldHealth] = useState(100);

  // Boss Battle Stats
  const [bossHp, setBossHp] = useState(3000);
  const [maxBossHp] = useState(3000);

  // Zen Passage
  const [zenPassageIndex, setZenPassageIndex] = useState(0);
  const [zenInput, setZenInput] = useState('');

  // Real-time Stats
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    consistency: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
    wordsCompleted: 0,
    streak: 0,
    maxStreak: 0,
    score: 0,
    elapsedSeconds: 0,
  });

  // Active pressed keys for visualizer
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const localHeatmapRef = useRef<{ [key: string]: { presses: number; errors: number } }>({});

  // Dynamic Speed state for Adaptive Mode
  const [adaptiveSpeedMultiplier, setAdaptiveSpeedMultiplier] = useState(1);

  // Refs for loop management
  const wordsRef = useRef<ActiveRainWord[]>([]);
  wordsRef.current = words;
  const currentIdxRef = useRef<number>(0);
  currentIdxRef.current = currentWordIndex;
  const statsRef = useRef<TypingStats>(stats);
  statsRef.current = stats;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Vocabulary Source Pool
  const getWordPool = useCallback((): WordItem[] => {
    if (mode === 'boss') {
      return [...VOCABULARY_DECKS.academic, ...VOCABULARY_DECKS.cyberTech];
    }
    if (mode === 'synonym') {
      return VOCABULARY_DECKS.synonymsBattle;
    }
    if (difficulty === 'novice') {
      return VOCABULARY_DECKS.essential;
    }
    if (difficulty === 'wizard' || difficulty === 'godspeed') {
      return [...VOCABULARY_DECKS.academic, ...VOCABULARY_DECKS.cyberTech];
    }
    return [...VOCABULARY_DECKS.essential, ...VOCABULARY_DECKS.cyberTech, ...VOCABULARY_DECKS.academic];
  }, [mode, difficulty]);

  // Spawn a new raining word
  const spawnWord = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current) return;
    const pool = getWordPool();
    const randomItem = pool[Math.floor(Math.random() * pool.length)];

    const config = DIFFICULTY_CONFIG[difficulty];
    let baseSpd = config.baseSpeed;
    if (difficulty === 'adaptive') {
      baseSpd *= adaptiveSpeedMultiplier;
    }

    const newWord: ActiveRainWord = {
      id: `${randomItem.id}-${Date.now()}-${Math.random()}`,
      text: randomItem.text,
      typedLength: 0,
      x: (Math.random() - 0.5) * 16,
      y: 18 + Math.random() * 2,
      z: (Math.random() - 0.5) * 8 - 4,
      speed: baseSpd * (0.85 + Math.random() * 0.3),
      meaning: randomItem.meaning,
      category: randomItem.category,
    };

    setWords((prev) => {
      if (prev.length >= config.maxActiveWords) return prev;
      return [...prev, newWord];
    });
  }, [difficulty, getWordPool, adaptiveSpeedMultiplier]);

  // Start Game
  const handleStartGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setIsGameOver(false);
    setIsVictory(false);
    setWords([]);
    setCurrentWordIndex(0);
    setShieldHealth(100);
    setBossHp(maxBossHp);
    setZenInput('');
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 100,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      errorKeystrokes: 0,
      wordsCompleted: 0,
      streak: 0,
      maxStreak: 0,
      score: 0,
      elapsedSeconds: 0,
    });
    localHeatmapRef.current = {};

    // Initial words
    const pool = getWordPool();
    const initialWords: ActiveRainWord[] = [];
    const count = mode === 'boss' ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      initialWords.push({
        id: `${item.id}-${Date.now()}-${i}`,
        text: item.text,
        typedLength: 0,
        x: (Math.random() - 0.5) * 14,
        y: 16 + i * 2,
        z: (Math.random() - 0.5) * 6 - 4,
        speed: DIFFICULTY_CONFIG[difficulty].baseSpeed,
        meaning: item.meaning,
        category: item.category,
      });
    }
    setWords(initialWords);
  };

  // Game Loop: Update words positions & elapsed time
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || isVictory) return;

    const intervalTime = 50; // 20 updates per sec
    const loop = setInterval(() => {
      setWords((prevWords) => {
        let damageToShield = 0;
        const nextWords: ActiveRainWord[] = [];

        prevWords.forEach((w) => {
          const nextY = w.y - (w.speed * intervalTime) / 1000;
          if (nextY <= 0.5) {
            // Word hit shield!
            damageToShield += 15;
            soundEngine.playError();
          } else {
            nextWords.push({ ...w, y: nextY });
          }
        });

        if (damageToShield > 0) {
          setShieldHealth((curr) => {
            const updated = Math.max(0, curr - damageToShield);
            if (updated <= 0) {
              handleGameOver(false);
            }
            return updated;
          });

          // Reset streak on shield damage
          setStats((s) => ({ ...s, streak: 0 }));
        }

        return nextWords;
      });
    }, intervalTime);

    return () => clearInterval(loop);
  }, [isPlaying, isPaused, isGameOver, isVictory]);

  // Spawner timer
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || isVictory || mode === 'zen') return;

    const spawnFreq = DIFFICULTY_CONFIG[difficulty].spawnInterval / (difficulty === 'adaptive' ? adaptiveSpeedMultiplier : 1);
    const spawner = setInterval(() => {
      spawnWord();
    }, spawnFreq);

    return () => clearInterval(spawner);
  }, [isPlaying, isPaused, isGameOver, isVictory, spawnWord, difficulty, adaptiveSpeedMultiplier, mode]);

  // Stats & Elapsed Timer
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || isVictory) return;

    timerRef.current = setInterval(() => {
      setStats((s) => {
        const nextSec = s.elapsedSeconds + 1;
        const minutes = nextSec / 60;
        const currentWpm = minutes > 0 ? Math.round((s.correctKeystrokes / 5) / minutes) : 0;
        const rawWpm = minutes > 0 ? Math.round((s.totalKeystrokes / 5) / minutes) : 0;
        const acc = s.totalKeystrokes > 0 ? Math.round((s.correctKeystrokes / s.totalKeystrokes) * 100) : 100;

        // Adaptive Dynamic Speed computation
        if (difficulty === 'adaptive') {
          if (currentWpm > 70 && acc >= 95) {
            setAdaptiveSpeedMultiplier((m) => Math.min(2.5, m + 0.05));
          } else if (acc < 85 || (s.streak === 0 && currentWpm < 30)) {
            setAdaptiveSpeedMultiplier((m) => Math.max(0.7, m - 0.05));
          }
        }

        return {
          ...s,
          elapsedSeconds: nextSec,
          wpm: currentWpm,
          rawWpm: rawWpm,
          accuracy: acc,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, isVictory, difficulty]);

  // Handle Game Over
  const handleGameOver = useCallback((victory: boolean) => {
    setIsPlaying(false);
    setIsGameOver(true);
    setIsVictory(victory);

    if (victory) {
      soundEngine.playLevelUp();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      soundEngine.playError();
    }

    // Award XP to Pet Companion
    const earnedXp = Math.round(
      (statsRef.current.wordsCompleted * 8 + statsRef.current.score / 50) *
        (pet.id === 'byte-shiba' ? 1.25 : 1)
    );
    const newTotalXp = pet.xp + earnedXp;
    const newLevel = 1 + Math.floor(newTotalXp / 100);
    if (newLevel > pet.level) {
      soundEngine.playLevelUp();
    }

    onUpdatePet({
      ...pet,
      xp: newTotalXp,
      level: newLevel,
    });

    // Record session history
    const session: HistorySession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode,
      difficulty,
      wpm: statsRef.current.wpm,
      accuracy: statsRef.current.accuracy,
      score: statsRef.current.score,
      durationSeconds: statsRef.current.elapsedSeconds,
      wordsCount: statsRef.current.wordsCompleted,
    };

    recordStreakActivity();
    onSessionComplete(session, localHeatmapRef.current);
  }, [mode, difficulty, pet, onUpdatePet, onSessionComplete]);

  // Handle Keystrokes
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying || isPaused || isGameOver || isVictory) return;

      // Avoid scrolling on spacebar
      if (e.key === ' ') {
        e.preventDefault();
      }

      const keyChar = e.key || '';
      if (!keyChar) return;

      // Track active keys for visual keyboard
      const lowerKeyChar = keyChar.toLowerCase();
      setActiveKeys((prev) => new Set(prev).add(lowerKeyChar));
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(lowerKeyChar);
          return next;
        });
      }, 150);

      // Play mechanical sound
      soundEngine.playKeySwitch(switchType);

      // Record heatmap keypress
      if (!localHeatmapRef.current[lowerKeyChar]) {
        localHeatmapRef.current[lowerKeyChar] = { presses: 0, errors: 0 };
      }
      localHeatmapRef.current[lowerKeyChar].presses += 1;

      // Mode 1, 2, 3: Word Rain / Boss / Synonym
      if (mode !== 'zen') {
        const activeWords = wordsRef.current;
        if (activeWords.length === 0) return;

        const targetWord = activeWords[currentIdxRef.current] || activeWords[0];
        if (!targetWord || !targetWord.text) return;

        const nextExpectedChar = targetWord.text[targetWord.typedLength];
        if (!nextExpectedChar) return;

        if (lowerKeyChar === nextExpectedChar.toLowerCase()) {
          // CORRECT STROKE
          const newTypedLen = targetWord.typedLength + 1;

          setStats((s) => {
            const nextCorrect = s.correctKeystrokes + 1;
            const nextTotal = s.totalKeystrokes + 1;
            const nextStreak = s.streak + 1;
            const comboMultiplier = 1 + Math.min(Math.floor(nextStreak / 5) * 0.25, 3);
            const addScore = Math.round(10 * comboMultiplier);

            return {
              ...s,
              correctKeystrokes: nextCorrect,
              totalKeystrokes: nextTotal,
              streak: nextStreak,
              maxStreak: Math.max(s.maxStreak, nextStreak),
              score: s.score + addScore,
            };
          });

          // Check if word complete
          if (newTypedLen >= targetWord.text.length) {
            // WORD FINISHED!
            soundEngine.playWordComplete(statsRef.current.streak);

            // Boss damage or word completion
            if (mode === 'boss') {
              soundEngine.playBossHit();
              const dmg = targetWord.text.length * 150;
              setBossHp((curr) => {
                const nextHp = Math.max(0, curr - dmg);
                if (nextHp <= 0) {
                  handleGameOver(true);
                }
                return nextHp;
              });
            }

            // Remove finished word
            setWords((prev) => {
              const filtered = prev.filter((w) => w.id !== targetWord.id);
              return filtered;
            });

            setStats((s) => ({
              ...s,
              wordsCompleted: s.wordsCompleted + 1,
            }));

            // Reset current index
            setCurrentWordIndex(0);

            // Ignis Pet Perk: Meteor Blast on 15x streaks
            if (pet.id === 'ignis-dragon' && statsRef.current.streak > 0 && statsRef.current.streak % 15 === 0) {
              soundEngine.playBossHit();
              setWords((prev) => prev.slice(0, 1)); // Clears all other falling words
            }
          } else {
            // Update typed length of target
            setWords((prev) =>
              prev.map((w) => (w.id === targetWord.id ? { ...w, typedLength: newTypedLen } : w))
            );
          }
        } else {
          // TYPO / ERROR
          soundEngine.playError();
          if (localHeatmapRef.current[lowerKeyChar]) {
            localHeatmapRef.current[lowerKeyChar].errors += 1;
          }

          setStats((s) => ({
            ...s,
            errorKeystrokes: s.errorKeystrokes + 1,
            totalKeystrokes: s.totalKeystrokes + 1,
            streak: 0,
          }));
        }
      } else {
        // ZEN PASSAGE MODE
        const currentPassage = ZEN_PASSAGES[zenPassageIndex];
        const targetText = currentPassage.text;

        if (keyChar === 'Backspace') {
          setZenInput((prev) => prev.slice(0, -1));
          return;
        }

        if (keyChar.length === 1) {
          const expectedChar = targetText[zenInput.length];
          const isCorrect = keyChar === expectedChar;

          if (isCorrect) {
            const nextInput = zenInput + keyChar;
            setZenInput(nextInput);

            setStats((s) => ({
              ...s,
              correctKeystrokes: s.correctKeystrokes + 1,
              totalKeystrokes: s.totalKeystrokes + 1,
              streak: s.streak + 1,
              maxStreak: Math.max(s.maxStreak, s.streak + 1),
              score: s.score + 15,
            }));

            if (nextInput.length >= targetText.length) {
              soundEngine.playWordComplete(20);
              confetti({ particleCount: 100, spread: 70 });
              setZenPassageIndex((prev) => (prev + 1) % ZEN_PASSAGES.length);
              setZenInput('');
              setStats((s) => ({ ...s, wordsCompleted: s.wordsCompleted + targetText.split(' ').length }));
            }
          } else {
            soundEngine.playError();
            if (localHeatmapRef.current[lowerKeyChar]) {
              localHeatmapRef.current[lowerKeyChar].errors += 1;
            }
            setStats((s) => ({
              ...s,
              errorKeystrokes: s.errorKeystrokes + 1,
              totalKeystrokes: s.totalKeystrokes + 1,
              streak: 0,
            }));
          }
        }
      }
    },
    [isPlaying, isPaused, isGameOver, isVictory, switchType, mode, zenPassageIndex, zenInput, pet, handleGameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Compute next expected key for keyboard highlight
  let nextKey: string | undefined;
  if (mode !== 'zen') {
    const currentWord = words[currentWordIndex] || words[0];
    if (currentWord && currentWord.typedLength < currentWord.text.length) {
      nextKey = currentWord.text[currentWord.typedLength];
    }
  } else {
    const currentPassage = ZEN_PASSAGES[zenPassageIndex];
    if (currentPassage && zenInput.length < currentPassage.text.length) {
      nextKey = currentPassage.text[zenInput.length];
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto">
      {/* Top HUD: Speedometer, Accuracy, Streak, Shield/Boss HP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 items-center">
        {/* WPM Speedometer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <span className="text-[11px] font-medium text-slate-400">Typing Speed</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{stats.wpm}</span>
            <span className="text-[10px] text-slate-400 font-mono">WPM</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <span className="text-[11px] font-medium text-slate-400">Accuracy</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                stats.accuracy >= 95 ? 'text-emerald-400' : stats.accuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {stats.accuracy}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">%</span>
          </div>
        </div>

        {/* Combo Streak */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <span className="text-[11px] font-medium text-slate-400">Combo Streak</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold font-mono text-pink-400 tabular-nums">{stats.streak}x</span>
          </div>
        </div>

        {/* Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <span className="text-[11px] font-medium text-slate-400">Cyber Score</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">{stats.score}</span>
        </div>

        {/* Shield / Health Bar or Boss HP */}
        <div className="col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          {mode === 'boss' ? (
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-400">Titan Sentinel Barrier</span>
                <span className="font-mono text-rose-300 tabular-nums">
                  {bossHp} / {maxBossHp} HP
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${(bossHp / maxBossHp) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-cyan-400">Base Shield Integrity</span>
                <span className="font-mono text-cyan-300 tabular-nums">
                  {shieldHealth} / {maxShieldHealth}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    shieldHealth > 50
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                      : shieldHealth > 25
                      ? 'bg-amber-500'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${shieldHealth}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 3D Viewport or Zen Practice Arena */}
      <div className="relative w-full h-[460px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        {mode !== 'zen' ? (
          <ThreeRainScene
            words={words}
            currentWordIndex={currentWordIndex}
            combo={stats.streak}
            streak={stats.streak}
            themeAccent={theme.accentColor}
            isPaused={isPaused || !isPlaying}
          />
        ) : (
          /* Zen Passage Flow Interface */
          <div className="w-full max-w-3xl px-8 py-10 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-cyan-300 font-display">
                {ZEN_PASSAGES[zenPassageIndex].title}
              </h3>
              <p className="text-xs text-slate-400">· {ZEN_PASSAGES[zenPassageIndex].author}</p>
            </div>

            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl text-lg sm:text-xl font-mono leading-relaxed select-none tracking-wide text-slate-400">
              {ZEN_PASSAGES[zenPassageIndex].text.split('').map((char, idx) => {
                let colorClass = 'text-slate-500';
                let isCurrent = idx === zenInput.length;
                if (idx < zenInput.length) {
                  colorClass = zenInput[idx] === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/20';
                }

                return (
                  <span
                    key={idx}
                    className={`${colorClass} ${
                      isCurrent ? 'border-b-2 border-cyan-400 text-white bg-cyan-400/20 px-0.5' : ''
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Start / Pause Overlay */}
        {!isPlaying && !isGameOver && !isVictory && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-3xl mb-4 animate-bounce">
              ⚡
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {mode === 'rain'
                ? '3D Lexical Rain Defense'
                : mode === 'boss'
                ? 'Titan Sentinel Arena'
                : mode === 'synonym'
                ? 'Synonym & Antonym Blitz'
                : 'Zen Flow Meditation'}
            </h2>
            <p className="text-sm text-slate-400 max-w-md mt-2">
              Type the falling words before they hit the base shield. Maintain combos to unleash companion powers!
            </p>

            <button
              onClick={handleStartGame}
              className="mt-6 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-base tracking-wide shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Engage System (Space / Click)
            </button>
          </div>
        )}

        {/* Game Over / Victory Modal Overlay */}
        {(isGameOver || isVictory) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="text-5xl mb-3">{isVictory ? '🏆' : '💥'}</div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isVictory ? 'Victory! Titan Defeated!' : 'Defense Shield Depleted'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isVictory ? 'Sensational keyboard wizardry!' : 'Refine your rhythm and defend again.'}
            </p>

            <div className="grid grid-cols-3 gap-4 my-6 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div>
                <span className="text-[11px] text-slate-400">Peak WPM</span>
                <p className="text-xl font-bold font-mono text-cyan-400 tabular-nums">{stats.wpm}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Accuracy</span>
                <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{stats.accuracy}%</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Words Typed</span>
                <p className="text-xl font-bold font-mono text-amber-400 tabular-nums">{stats.wordsCompleted}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleStartGame}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                Play Again
              </button>
              <button
                onClick={onExitMode}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Back to Hub
              </button>
            </div>
          </div>
        )}

        {/* Floating Mini Companion during gameplay */}
        {isPlaying && (
          <div className="absolute top-4 right-4 z-10 w-72">
            <PetCompanion
              pet={pet}
              combo={stats.streak}
              accuracy={stats.accuracy}
              isDanger={shieldHealth < 30}
              onUpdatePet={onUpdatePet}
              availablePets={availablePets}
              onSelectPet={onSelectPet}
              compact={true}
            />
          </div>
        )}

        {/* Current Target Definition Card Helper */}
        {isPlaying && words.length > 0 && words[currentWordIndex]?.meaning && (
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 max-w-sm">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
              <span>📖 Target Lexicon:</span>
              <span className="text-white uppercase font-mono">{words[currentWordIndex].text}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{words[currentWordIndex].meaning}</p>
          </div>
        )}
      </div>

      {/* Interactive Virtual Keyboard */}
      {showKeyboard && (
        <div className="mt-2">
          <VirtualKeyboard
            theme={theme}
            activeKeys={activeKeys}
            nextKeyToPress={nextKey}
            showFingerGuides={showFingerGuides}
            onKeyClick={(char) => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
            }}
          />
        </div>
      )}
    </div>
  );
};
