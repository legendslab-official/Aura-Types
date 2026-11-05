import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { LeaderboardEntry, RacerBot, KeyboardTheme, SwitchType, PetCompanionData } from '../types';
import { VOCABULARY_DECKS } from '../data/vocabulary';
import { soundEngine } from '../utils/audio';
import { recordStreakActivity } from '../utils/streak';

interface MultiplayerArenaProps {
  theme: KeyboardTheme;
  switchType: SwitchType;
  pet: PetCompanionData;
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    rank: 1,
    username: 'QuantumPhantom',
    avatar: '🌌',
    petSpecies: 'Cyber Kitten',
    wpm: 142,
    accuracy: 99.4,
    score: 18450,
    mode: 'rain',
    difficulty: 'godspeed',
    country: 'JP',
    timestamp: '12m ago',
  },
  {
    id: 'lb-2',
    rank: 2,
    username: 'Valkyrie_Type',
    avatar: '⚡',
    petSpecies: 'Mecha Wyvern',
    wpm: 135,
    accuracy: 98.8,
    score: 16920,
    mode: 'rain',
    difficulty: 'godspeed',
    country: 'DE',
    timestamp: '45m ago',
  },
  {
    id: 'lb-3',
    rank: 3,
    username: 'SynthwaveSamurai',
    avatar: '⚔️',
    petSpecies: 'Omniscient Owl',
    wpm: 128,
    accuracy: 100,
    score: 15400,
    mode: 'boss',
    difficulty: 'wizard',
    country: 'US',
    timestamp: '2h ago',
  },
  {
    id: 'lb-4',
    rank: 4,
    username: 'AuraNova',
    avatar: '✨',
    petSpecies: 'Hologram Sprite',
    wpm: 119,
    accuracy: 97.5,
    score: 13800,
    mode: 'rain',
    difficulty: 'wizard',
    country: 'KR',
    timestamp: '4h ago',
  },
  {
    id: 'lb-5',
    rank: 5,
    username: 'PixelPilot',
    avatar: '🚀',
    petSpecies: 'Quantum Shiba',
    wpm: 108,
    accuracy: 96.9,
    score: 12100,
    mode: 'synonym',
    difficulty: 'knight',
    country: 'CA',
    timestamp: '6h ago',
  },
  {
    id: 'lb-6',
    rank: 6,
    username: 'CyberMonk',
    avatar: '🧘‍♂️',
    petSpecies: 'Cyber Kitten',
    wpm: 99,
    accuracy: 99.1,
    score: 10950,
    mode: 'zen',
    difficulty: 'knight',
    country: 'SG',
    timestamp: '8h ago',
  },
];

const INITIAL_BOTS: RacerBot[] = [
  { id: 'bot-1', name: 'SpeedDemon_99', avatar: '🏎️', targetWpm: 95, currentProgress: 0, currentWpm: 92, color: '#06B6D4', finished: false },
  { id: 'bot-2', name: 'NeonValkyrie', avatar: '⚡', targetWpm: 82, currentProgress: 0, currentWpm: 80, color: '#EC4899', finished: false },
  { id: 'bot-3', name: 'Ghost_Byte', avatar: '👾', targetWpm: 68, currentProgress: 0, currentWpm: 66, color: '#F59E0B', finished: false },
];

export const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({ theme, switchType, pet }) => {
  const [activeTab, setActiveTab] = useState<'race' | 'leaderboard' | 'customRoom'>('race');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'today' | 'weekly' | 'allTime'>('today');

  // Race States
  const [isRacing, setIsRacing] = useState(false);
  const [raceCountdown, setRaceCountdown] = useState<number | null>(null);
  const [targetParagraph, setTargetParagraph] = useState('');
  const [playerInput, setPlayerInput] = useState('');
  const [playerProgress, setPlayerProgress] = useState(0);
  const [playerWpm, setPlayerWpm] = useState(0);
  const [raceBots, setRaceBots] = useState<RacerBot[]>(INITIAL_BOTS);
  const [raceResult, setRaceResult] = useState<{ rank: number; wpm: number; timeSec: number } | null>(null);

  const startTimeRef = useRef<number>(0);
  const raceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate race passage
  const generateRaceText = () => {
    const pool = [...VOCABULARY_DECKS.essential, ...VOCABULARY_DECKS.cyberTech];
    const words: string[] = [];
    for (let i = 0; i < 24; i++) {
      words.push(pool[Math.floor(Math.random() * pool.length)].text);
    }
    return words.join(' ');
  };

  const startRace = () => {
    const text = generateRaceText();
    setTargetParagraph(text);
    setPlayerInput('');
    setPlayerProgress(0);
    setPlayerWpm(0);
    setRaceResult(null);

    setRaceBots([
      { id: 'bot-1', name: 'SpeedDemon_99', avatar: '🏎️', targetWpm: 85 + Math.floor(Math.random() * 20), currentProgress: 0, currentWpm: 90, color: '#06B6D4', finished: false },
      { id: 'bot-2', name: 'NeonValkyrie', avatar: '⚡', targetWpm: 75 + Math.floor(Math.random() * 15), currentProgress: 0, currentWpm: 78, color: '#EC4899', finished: false },
      { id: 'bot-3', name: 'Ghost_Byte', avatar: '👾', targetWpm: 60 + Math.floor(Math.random() * 15), currentProgress: 0, currentWpm: 64, color: '#F59E0B', finished: false },
    ]);

    setRaceCountdown(3);
    soundEngine.playKeySwitch('crystal-pop');
  };

  // Countdown timer
  useEffect(() => {
    if (raceCountdown === null) return;
    if (raceCountdown > 0) {
      const timer = setTimeout(() => {
        soundEngine.playKeySwitch('crystal-pop');
        setRaceCountdown(raceCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setRaceCountdown(null);
      setIsRacing(true);
      startTimeRef.current = Date.now();
      soundEngine.playLevelUp();
    }
  }, [raceCountdown]);

  // Handle player typing during race
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRacing) return;
    const val = e.target.value;
    soundEngine.playKeySwitch(switchType);

    // Only allow correct prefix
    if (targetParagraph.startsWith(val)) {
      setPlayerInput(val);
      const prog = Math.round((val.length / targetParagraph.length) * 100);
      setPlayerProgress(prog);

      const elapsedMinutes = (Date.now() - startTimeRef.current) / 1000 / 60;
      const currentWpm = elapsedMinutes > 0 ? Math.round((val.length / 5) / elapsedMinutes) : 0;
      setPlayerWpm(currentWpm);

      // Check win
      if (val === targetParagraph) {
        finishPlayerRace(currentWpm);
      }
    } else {
      soundEngine.playError();
    }
  };

  const finishPlayerRace = useCallback((finalWpm: number) => {
    setIsRacing(false);
    const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
    const botFinishedCount = raceBots.filter((b) => b.finished).length;
    const finalRank = botFinishedCount + 1;

    setRaceResult({
      rank: finalRank,
      wpm: finalWpm,
      timeSec: Math.round(elapsedSec * 10) / 10,
    });

    recordStreakActivity();

    if (finalRank === 1) {
      soundEngine.playLevelUp();
      confetti({ particleCount: 150, spread: 90 });
    } else {
      soundEngine.playWordComplete(10);
    }
  }, [raceBots]);

  // Bots progression simulation loop
  useEffect(() => {
    if (!isRacing) return;

    raceIntervalRef.current = setInterval(() => {
      setRaceBots((prevBots) =>
        prevBots.map((bot) => {
          if (bot.finished) return bot;

          const jitter = (Math.random() - 0.5) * 4;
          const currentSpd = Math.max(30, bot.targetWpm + jitter);
          // 1 wpm = 5 chars per min = (5 / 60) chars per sec
          const charsPerSec = (currentSpd * 5) / 60;
          const charsAdded = (charsPerSec * 0.2);
          const nextProg = Math.min(100, bot.currentProgress + (charsAdded / targetParagraph.length) * 100);

          return {
            ...bot,
            currentProgress: nextProg,
            currentWpm: Math.round(currentSpd),
            finished: nextProg >= 100,
          };
        })
      );
    }, 200);

    return () => {
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    };
  }, [isRacing, targetParagraph]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('race')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'race' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏎️ Cyber Grand Prix Race
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏆 Global Leaderboards
          </button>
          <button
            onClick={() => setActiveTab('customRoom')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'customRoom' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔑 Custom Challenge Room
          </button>
        </div>
      </div>

      {/* Mode: Grand Prix Race */}
      {activeTab === 'race' && (
        <div className="flex flex-col gap-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">4-Player Ghost Speed Track</h2>
              <p className="text-xs text-slate-400">Race your customized pet companion against global challenger ghosts!</p>
            </div>

            {!isRacing && raceCountdown === null && (
              <button
                onClick={startRace}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                Start Ghost Match
              </button>
            )}
          </div>

          {/* Countdown Display */}
          {raceCountdown !== null && (
            <div className="py-12 text-center">
              <span className="text-6xl font-display font-bold text-cyan-400 animate-ping">
                {raceCountdown === 0 ? 'GO!' : raceCountdown}
              </span>
            </div>
          )}

          {/* Race Track Lanes */}
          {(isRacing || raceResult || raceCountdown !== null) && (
            <div className="flex flex-col gap-3 my-2">
              {/* Player Lane */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/40 relative overflow-hidden">
                <div className="flex justify-between text-xs mb-1.5 font-semibold">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="text-base">{pet.avatarImage ? '🐾' : '👤'}</span>
                    <span>{pet.name} (You)</span>
                  </div>
                  <span className="font-mono text-cyan-400 tabular-nums">{playerWpm} WPM</span>
                </div>

                <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden relative border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-150"
                    style={{ width: `${playerProgress}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 text-xs flex items-center -ml-3 transition-all duration-150"
                    style={{ left: `${playerProgress}%` }}
                  >
                    🏎️
                  </div>
                </div>
              </div>

              {/* Bot Lanes */}
              {raceBots.map((bot) => (
                <div key={bot.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 relative">
                  <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>{bot.avatar}</span>
                      <span>{bot.name}</span>
                    </div>
                    <span className="font-mono tabular-nums">{bot.currentWpm} WPM</span>
                  </div>

                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden relative border border-slate-800/80">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{ width: `${bot.currentProgress}%`, backgroundColor: bot.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Race Typing Arena */}
          {isRacing && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-lg leading-relaxed select-none">
                {targetParagraph.split('').map((char, idx) => {
                  let color = 'text-slate-500';
                  let isCurrent = idx === playerInput.length;
                  if (idx < playerInput.length) {
                    color = playerInput[idx] === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/20';
                  }

                  return (
                    <span
                      key={idx}
                      className={`${color} ${
                        isCurrent ? 'bg-cyan-500/30 text-white border-b-2 border-cyan-400 px-0.5' : ''
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              <input
                type="text"
                autoFocus
                value={playerInput}
                onChange={handleTyping}
                placeholder="Type here to race..."
                className="w-full px-5 py-3.5 bg-slate-950 border-2 border-cyan-500/50 rounded-xl text-white font-mono text-base focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {/* Race Result Modal Card */}
          {raceResult && (
            <div className="p-6 bg-slate-950 rounded-2xl border border-cyan-500/40 text-center flex flex-col items-center">
              <span className="text-4xl mb-2">{raceResult.rank === 1 ? '🥇' : raceResult.rank === 2 ? '🥈' : '🥉'}</span>
              <h3 className="text-2xl font-bold text-white">
                {raceResult.rank === 1 ? '1st Place! Victory!' : `Finished #${raceResult.rank}`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completed race in {raceResult.timeSec}s with a blistering {raceResult.wpm} WPM!
              </p>

              <button
                onClick={startRace}
                className="mt-5 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                Race Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Global Typing Leaderboard</h2>
              <p className="text-xs text-slate-400">Verified WPM & accuracy rankings across the cyber matrix</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(['today', 'weekly', 'allTime'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLeaderboardFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    leaderboardFilter === filter ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Pilot</th>
                  <th className="py-3 px-3">Companion</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">Speed</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {INITIAL_LEADERBOARD.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold">
                      {entry.rank === 1 ? (
                        <span className="text-amber-400">👑 #1</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-slate-300">🥈 #2</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-600">🥉 #3</span>
                      ) : (
                        <span className="text-slate-500 font-mono">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{entry.avatar}</span>
                        <span className="font-semibold text-white">{entry.username}</span>
                        <span className="text-[10px] text-slate-500 font-mono">[{entry.country}]</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{entry.petSpecies}</td>
                    <td className="py-3.5 px-3 capitalize text-cyan-400">{entry.mode}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-300 tabular-nums">{entry.wpm} WPM</td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400 tabular-nums">{entry.accuracy}%</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400 tabular-nums">
                      {entry.score.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mode: Custom Room */}
      {activeTab === 'customRoom' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-xl mx-auto w-full text-center">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-2xl mx-auto mb-3">
            🔑
          </div>
          <h3 className="text-lg font-bold text-white">Create Private Challenge Arena</h3>
          <p className="text-xs text-slate-400 mt-1">Host a custom speed trial with your own vocabulary decks and difficulty</p>

          <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800 text-left flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Room Passcode</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value="AURA-8829-NEON"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-400"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('AURA-8829-NEON');
                    soundEngine.playKeySwitch('crystal-pop');
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg font-semibold cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Vocabulary Set</label>
              <select className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200">
                <option>Advanced SAT/GRE Lexicon</option>
                <option>Cyberpunk & Sci-Fi Tech</option>
                <option>Essential 1000 Fast Words</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('race')}
            className="mt-5 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            Launch Private Room
          </button>
        </div>
      )}
    </div>
  );
};
