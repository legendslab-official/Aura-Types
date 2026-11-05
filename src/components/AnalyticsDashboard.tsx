import React, { useState } from 'react';
import { HistorySession, KeyHeatmapData } from '../types';
import { soundEngine } from '../utils/audio';

interface AnalyticsDashboardProps {
  sessions: HistorySession[];
  heatmap: KeyHeatmapData;
  onClearHistory: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  sessions,
  heatmap,
  onClearHistory,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  // Compute lifetime metrics
  const totalSessions = sessions.length;
  const peakWpm = sessions.reduce((max, s) => Math.max(max, s.wpm), 0);
  const avgWpm = totalSessions > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / totalSessions) : 0;
  const avgAccuracy = totalSessions > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions) : 100;
  const totalWords = sessions.reduce((sum, s) => sum + s.wordsCount, 0);
  const totalMinutes = Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);

  // Identify weak keys from heatmap
  const keysWithErrors = Object.entries(heatmap)
    .filter(([key, data]) => key.length === 1 && data.presses >= 5)
    .map(([key, data]) => ({
      key: key.toUpperCase(),
      errorRate: Math.round((data.errors / data.presses) * 100),
      errors: data.errors,
      presses: data.presses,
    }))
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 5);

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner & Lifetime Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-slate-400">Peak Speed</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">{peakWpm}</span>
            <span className="text-xs text-slate-400 font-mono">WPM</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-slate-400">Average Speed</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold font-mono text-cyan-300 tabular-nums">{avgWpm}</span>
            <span className="text-xs text-slate-400 font-mono">WPM</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-slate-400">Avg Accuracy</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">{avgAccuracy}</span>
            <span className="text-xs text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-slate-400">Total Words</span>
          <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums mt-1">{totalWords}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-slate-400">Time Practiced</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold font-mono text-purple-400 tabular-nums">{totalMinutes}</span>
            <span className="text-xs text-slate-400 font-mono">min</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-slate-400">Sessions</span>
          <span className="text-3xl font-bold font-mono text-pink-400 tabular-nums mt-1">{totalSessions}</span>
        </div>
      </div>

      {/* Main Grid: Heatmap & Weak Key Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Visualizer */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Keystroke Heatmap & Error Density</h3>
              <p className="text-xs text-slate-400">Identifies finger fatigue and character precision across sessions</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 select-none items-center my-4">
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1.5 justify-center">
                {row.map((letter) => {
                  const data = heatmap[letter.toLowerCase()] || { presses: 0, errors: 0 };
                  const errorRate = data.presses > 0 ? (data.errors / data.presses) * 100 : 0;

                  let heatBg = 'bg-slate-950 border-slate-800 text-slate-400';
                  if (data.presses > 0) {
                    if (errorRate > 20) {
                      heatBg = 'bg-rose-500/30 border-rose-500 text-rose-300 shadow-[0_0_8px_#f43f5e]';
                    } else if (errorRate > 10) {
                      heatBg = 'bg-amber-500/25 border-amber-500 text-amber-300';
                    } else {
                      heatBg = 'bg-cyan-500/20 border-cyan-500 text-cyan-300';
                    }
                  }

                  return (
                    <div
                      key={letter}
                      title={`${letter}: ${data.presses} presses, ${data.errors} errors (${Math.round(errorRate)}%)`}
                      className={`w-9 h-10 sm:w-11 sm:h-12 rounded-lg border flex flex-col items-center justify-center font-mono transition-all ${heatBg}`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{letter}</span>
                      <span className="text-[9px] opacity-70 tabular-nums">{data.presses}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500/40 border border-cyan-500" /> Optimal (0-10% error)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500" /> Moderate (10-20%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-500" /> High Error (&gt;20%)
              </span>
            </div>
          </div>
        </div>

        {/* Weak Key Diagnostics & Personalized AI Coaching */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Personalized Recommendations</h3>
            <p className="text-xs text-slate-400">Targeted drills to eliminate key hesitations</p>

            <div className="mt-4 flex flex-col gap-3">
              {keysWithErrors.length > 0 ? (
                keysWithErrors.map((item) => (
                  <div key={item.key} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold flex items-center justify-center">
                        {item.key}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{item.errorRate}% Error Rate</p>
                        <p className="text-[11px] text-slate-400">
                          {item.errors} errors / {item.presses} strokes
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                  Keep typing! Complete more sessions to unlock deep keystroke diagnostics.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setShowShareModal(true);
              soundEngine.playKeySwitch('crystal-pop');
            }}
            className="mt-4 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Generate Cyber Certificate Card
          </button>
        </div>
      </div>

      {/* History Session Records */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Flight Logs</h3>
            <p className="text-xs text-slate-400">Chronological history of typing sessions</p>
          </div>
          {sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                  <th className="py-2.5 px-3">Speed</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Words</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {sessions.slice(0, 8).map((s, index) => (
                  <tr key={`${s.id || 'session'}-${index}`} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{s.date}</td>
                    <td className="py-2.5 px-3 capitalize font-semibold text-cyan-400">{s.mode}</td>
                    <td className="py-2.5 px-3 capitalize text-slate-300">{s.difficulty}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300 tabular-nums">{s.wpm} WPM</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 tabular-nums">{s.accuracy}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300 tabular-nums">{s.wordsCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400 tabular-nums">
                      {s.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No flight logs yet. Start typing in 3D Rain Defense to record stats!
          </div>
        )}
      </div>

      {/* Shareable Certificate Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-2xl shadow-2xl p-6 text-center">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-3xl mx-auto mb-3">
              ⚡
            </div>
            <span className="text-[10px] tracking-widest text-cyan-400 font-mono uppercase font-bold">
              Aura Type Cyber Matrix
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">Typing Mastery Certification</h3>
            <p className="text-xs text-slate-400 mt-0.5">Official Performance Verification Record</p>

            <div className="grid grid-cols-2 gap-3 my-6 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="p-2">
                <span className="text-[10px] text-slate-400">Peak Velocity</span>
                <p className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">{peakWpm} WPM</p>
              </div>
              <div className="p-2">
                <span className="text-[10px] text-slate-400">Average Accuracy</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{avgAccuracy}%</p>
              </div>
              <div className="p-2">
                <span className="text-[10px] text-slate-400">Words Mastered</span>
                <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{totalWords}</p>
              </div>
              <div className="p-2">
                <span className="text-[10px] text-slate-400">Matrix Rank</span>
                <p className="text-lg font-bold text-pink-400">
                  {peakWpm >= 100 ? 'Cyber Wizard' : peakWpm >= 70 ? 'Neon Knight' : 'Speed Cadet'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`⚡ Aura Type Stats: ${peakWpm} Peak WPM | ${avgAccuracy}% Accuracy | ${totalWords} Words Mastered!`);
                alert('Stats copied to clipboard!');
              }}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              Copy Shareable Cyber Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
