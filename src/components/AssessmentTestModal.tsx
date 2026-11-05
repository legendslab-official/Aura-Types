import React, { useState, useEffect, useRef } from 'react';
import { KeyboardTheme, SwitchType } from '../types';
import { VirtualKeyboard } from './VirtualKeyboard';
import { TypingCertificateModal, CertificateData } from './TypingCertificateModal';
import { soundEngine } from '../utils/audio';
import { recordStreakActivity } from '../utils/streak';

interface AssessmentTestModalProps {
  theme: KeyboardTheme;
  switchType: SwitchType;
  levelTriggered: number; // 5, 10, 15, 20, 25, 30
  onClose: () => void;
  onPassed: (wpm: number, accuracy: number) => void;
}

const ASSESSMENT_TEXT_BANK: { [level: number]: { title: string; minWpm: number; minAcc: number; text: string } } = {
  5: {
    title: 'Level 5 Gateway Test (10+ WPM Required to Unlock Level 6)',
    minWpm: 10,
    minAcc: 80,
    text: 'Keep your fingers relaxed on the home row keys. Left index on F and right index on J maintain your anchor points. Alternate smoothly between both hands and breathe naturally as you type each word.',
  },
  10: {
    title: 'Level 10 Gateway Test (15+ WPM Required to Unlock Level 11)',
    minWpm: 15,
    minAcc: 80,
    text: 'Mastering the full home row and top tier reaches creates the foundation of touch typing. When you avoid glancing at the keyboard, your fingertips develop instinctive muscle memory for every character.',
  },
  15: {
    title: 'Level 15 Gateway Test (20+ WPM Required to Unlock Level 16)',
    minWpm: 20,
    minAcc: 80,
    text: 'Fluency in punctuation, common word clusters, and sentence flow allows your typing velocity to break past barriers. Keep steady cadence between words without sudden pauses or hesitation.',
  },
  20: {
    title: 'Level 20 Gateway Test (25+ WPM Required to Unlock Level 21)',
    minWpm: 25,
    minAcc: 80,
    text: 'Special symbols, numbers, and technical formatting test true keyboard mastery: user_id #8492, score: 98%, active: [OK] & email: <dev@cloud.io>. Combining Shift keys with rapid prose unlocks elite velocity.',
  },
  25: {
    title: 'Level 25 Gateway Test (28+ WPM Required to Unlock Level 26)',
    minWpm: 28,
    minAcc: 80,
    text: 'Sustained typing endurance across long unbroken paragraphs prevents fatigue and maintains high accuracy over extended writing sessions. Relax your wrists and let kinetic momentum guide your fingers.',
  },
  30: {
    title: 'Level 30 Grand Graduation Exam (30+ WPM Required for Official Certificate)',
    minWpm: 30,
    minAcc: 80,
    text: 'Welcome to the Aura Type Master Certification Examination. Achieving thirty words per minute with over eighty percent accuracy earns you the official Accredited Touch Typing Master Diploma. Your dedication to neuromuscular training has transformed digital communication into effortless spontaneous writing.',
  },
};

export const AssessmentTestModal: React.FC<AssessmentTestModalProps> = ({
  theme,
  switchType,
  levelTriggered,
  onClose,
  onPassed,
}) => {
  const exam = ASSESSMENT_TEXT_BANK[levelTriggered] || ASSESSMENT_TEXT_BANK[5];
  const targetMinWpm = exam.minWpm;
  const targetMinAcc = exam.minAcc || 80;
  const isFinalCertExam = levelTriggered >= 30;

  // 10-Minute Assessment Countdown (600 seconds)
  const TOTAL_TEST_TIME = 600;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TEST_TIME);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [testPassed, setTestPassed] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Key Event Listener
  useEffect(() => {
    if (isCompleted) return;

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
      if (e.key === 'Enter') charToCompare = '\n';

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

      const targetText = exam.text;

      if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1));
        return;
      }

      const expectedChar = targetText[userInput.length];
      const isMatch = charToCompare === expectedChar;

      if (!isMatch) {
        soundEngine.playError();
        setTotalErrors((prev) => prev + 1);
      }

      const nextInput = userInput + charToCompare;
      setUserInput(nextInput);

      // Check if finished passage
      if (nextInput.length >= targetText.length) {
        finishExam(nextInput);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userInput, startTime, isCompleted, exam.text, switchType]);

  // 10-Minute Timer Countdown Loop
  useEffect(() => {
    if (startTime === null || isCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishExam(userInput);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted, userInput]);

  const elapsedSec = TOTAL_TEST_TIME - timeLeft;
  const durationMinutes = Math.max(0.08, elapsedSec / 60);
  const liveWpm = startTime ? Math.round((userInput.length / 5) / durationMinutes) : 0;
  const liveAccuracy = userInput.length > 0
    ? Math.max(0, Math.round(((userInput.length - totalErrors) / userInput.length) * 100))
    : 100;

  const nextChar = exam.text[userInput.length];

  const finishExam = (finalInput: string) => {
    setIsCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const testTimeMin = Math.max(0.1, (TOTAL_TEST_TIME - timeLeft) / 60);
    const totalChars = finalInput.length;
    const finalWpm = Math.max(0, Math.round(((totalChars - totalErrors * 5) / 5) / testTimeMin));
    const finalAcc = totalChars > 0 ? Math.max(0, Math.round(((totalChars - totalErrors) / totalChars) * 100)) : 100;

    const passed = finalWpm >= targetMinWpm && finalAcc >= targetMinAcc;
    setTestPassed(passed);

    if (passed) {
      soundEngine.playLevelUp();
      recordStreakActivity();
      window.dispatchEvent(new Event('auratype_streak_updated'));
      onPassed(finalWpm, finalAcc);

      if (isFinalCertExam) {
        setCertData({
          recipientName: 'Touch Typing Master',
          wpm: finalWpm,
          accuracy: finalAcc,
          durationMinutes: 10,
          examTitle: exam.title,
          verificationId: `CERT-${Date.now().toString(36).toUpperCase()}`,
          date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
          grade: 'V8.5',
        });
        setShowCertificate(true);
      }
    } else {
      soundEngine.playError();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col gap-5 my-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
                ⏱️
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {isFinalCertExam ? '🏆 Official Grand Graduation Exam' : `🔒 Level ${levelTriggered} Gateway Test (Mandatory)`}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                  {exam.title}
                </h2>
              </div>
            </div>

            {/* Metrics HUD */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400">Time Left</span>
                <p className="font-mono text-amber-400 font-bold text-base tabular-nums">{formattedTime}</p>
              </div>

              <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[75px]">
                <span className="text-[10px] text-slate-400">Target</span>
                <p className="font-mono text-cyan-400 font-bold text-base">{targetMinWpm}+ WPM</p>
              </div>

              <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[75px]">
                <span className="text-[10px] text-slate-400">Live Speed</span>
                <p className="font-mono text-emerald-400 font-bold text-base">{liveWpm} WPM</p>
              </div>
            </div>
          </div>

          {/* Test Status Banner */}
          <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-amber-200">
              ⚠️ <strong>Passing Condition:</strong> Minimum <strong className="text-white font-bold">{targetMinWpm} WPM</strong> with <strong className="text-emerald-300 font-bold">{targetMinAcc}%+ Accuracy</strong> required to unlock the next levels.
            </span>
            <span className="text-slate-400 font-mono">
              Progress: <strong className="text-cyan-400">{Math.round((userInput.length / exam.text.length) * 100)}%</strong>
            </span>
          </div>

          {/* Active Typing Focus Display Area */}
          <div className="p-6 bg-slate-950 rounded-2xl border-2 border-slate-800 text-xl sm:text-2xl font-mono leading-relaxed select-none min-h-[160px] flex flex-wrap content-start shadow-inner">
            {exam.text.split('').map((char, idx) => {
              const isTyped = idx < userInput.length;
              const isCurrent = idx === userInput.length;
              let charStyle = 'text-slate-500';

              if (isTyped) {
                const userChar = userInput[idx];
                charStyle = userChar === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/25 rounded';
              }

              return (
                <span
                  key={idx}
                  className={`relative ${charStyle} ${
                    isCurrent ? 'bg-cyan-500/40 text-white border-b-2 border-cyan-400 animate-pulse px-0.5' : ''
                  }`}
                >
                  {char === '\n' ? '↵\n' : char === ' ' && isCurrent ? '␣' : char}
                </span>
              );
            })}
          </div>

          {/* Keyboard with Dual Hands at Bottom */}
          <VirtualKeyboard
            theme={theme}
            activeKeys={activeKeys}
            nextKeyToPress={nextChar}
            onKeyClick={(char) => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
            }}
          />

          {/* Result Footer if Completed */}
          {isCompleted && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              testPassed ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-rose-950/40 border-rose-500/40'
            }`}>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{testPassed ? '🎉 Gateway Test Passed!' : '⚠️ Below Passing Requirements'}</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  You achieved <strong className="text-cyan-400">{liveWpm} WPM</strong> with <strong className="text-emerald-400">{liveAccuracy}% accuracy</strong>.
                  {testPassed
                    ? ` Next levels are now unlocked!`
                    : ` Required: ${targetMinWpm} WPM and ${targetMinAcc}% Accuracy.`}
                </p>
              </div>

              <div className="flex gap-3">
                {testPassed ? (
                  <>
                    {isFinalCertExam && (
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                      >
                        View Official Certificate 📜
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      Proceed to Next Level ➔
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setUserInput('');
                      setStartTime(null);
                      setTimeLeft(TOTAL_TEST_TIME);
                      setTotalErrors(0);
                      setIsCompleted(false);
                      setTestPassed(false);
                    }}
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Retry Test 🔁
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Graduation Certificate Modal */}
      {showCertificate && certData && (
        <TypingCertificateModal
          data={certData}
          onClose={() => {
            setShowCertificate(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
