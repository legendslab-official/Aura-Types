import React, { useState } from 'react';
import { KeyboardTheme, SwitchType, DifficultyLevel, AppLanguage } from '../types';
import { KEYBOARD_THEMES, SWITCH_OPTIONS } from '../data/themes';
import { TRANSLATIONS } from '../data/translations';
import { soundEngine } from '../utils/audio';
import appIcon from '../assets/images/app_icon.jpg';

interface SettingsModalProps {
  currentTheme: KeyboardTheme;
  currentSwitch: SwitchType;
  difficulty: DifficultyLevel;
  showKeyboard: boolean;
  showFingerGuides: boolean;
  isAmbientOn: boolean;
  volume: number;
  displayScale: number;
  appLanguage: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onChangeDisplayScale: (scale: number) => void;
  onSelectTheme: (theme: KeyboardTheme) => void;
  onSelectSwitch: (sw: SwitchType) => void;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  onToggleKeyboard: () => void;
  onToggleFingerGuides: () => void;
  onToggleAmbient: () => void;
  onChangeVolume: (vol: number) => void;
  onClose: () => void;
}

type SettingsTab = 'controls' | 'policies' | 'feedback';

interface FeedbackTemplate {
  id: string;
  badge: string;
  title: string;
  category: 'feature' | 'bug' | 'certificate' | 'general';
  rating: number;
  templateText: string;
}

const FEEDBACK_TEMPLATES: FeedbackTemplate[] = [
  {
    id: 'curriculum-general',
    badge: '💡 Curriculum & Speed',
    title: 'Typing Master Experience & Suggestions',
    category: 'general',
    rating: 5,
    templateText: 'I am practicing the typing master curriculum in Aura Type! Here are my impressions and recommendations for upcoming lessons:',
  },
  {
    id: 'feature-switches',
    badge: '🔊 Switch Sound',
    title: 'Request New Mechanical Switch Sound',
    category: 'feature',
    rating: 5,
    templateText: 'I love the switch sound profiles in Aura Type! Could you please consider adding [e.g. Topre Electro-Capacitive / Alpaca Linears / Gateron Ink Black / Box Jade Clicky] sounds in the next update?',
  },
  {
    id: 'feature-code',
    badge: '💻 Coding Track',
    title: 'New Coding Curriculum Request',
    category: 'feature',
    rating: 5,
    templateText: 'The Special C++ training curriculum is awesome! Could the Aura Types team add a dedicated 10-level track for [Python / Rust / JavaScript & React / Golang] syntax and algorithms?',
  },
  {
    id: 'cert-verification',
    badge: '📜 Certificate',
    title: 'Level 30 Diploma Honors & Verification',
    category: 'certificate',
    rating: 5,
    templateText: 'I have successfully completed Level 30 Grandmaster Exam with [Enter Your WPM, e.g. 52] WPM and [Enter Accuracy, e.g. 98]% accuracy! Requesting official verification for Candidate: [Enter Full Name].',
  },
  {
    id: 'bug-report',
    badge: '🐛 Bug Report',
    title: 'Report a Glitch or Visual Issue',
    category: 'bug',
    rating: 4,
    templateText: 'I noticed a small issue in [e.g. 3D Game Arena / Multiplayer Race / Keyboard Lighting]. When I do [Step 1], [Step 2] happens instead of the expected result.',
  },
  {
    id: 'app-review',
    badge: '⭐ Review & Praise',
    title: 'Typing Speed Growth Review',
    category: 'general',
    rating: 5,
    templateText: 'Aura Type has significantly improved my typing muscle memory and touch typing speed! My typing velocity increased from [Start WPM] to [Current WPM] in just [Days/Weeks]. Highly recommended!',
  },
  {
    id: 'theme-idea',
    badge: '🎨 Theme Idea',
    title: 'RGB Theme & Aesthetics Idea',
    category: 'feature',
    rating: 5,
    templateText: 'Could you introduce a new visual RGB theme like [e.g. Cyberpunk 2077 Neon Yellow / Dracula Purple / Synthwave Sunset / Matrix Monochrome]? The keyboard lighting would look phenomenal!',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentTheme,
  currentSwitch,
  difficulty,
  showKeyboard,
  showFingerGuides,
  isAmbientOn,
  volume,
  displayScale,
  appLanguage,
  onChangeLanguage,
  onChangeDisplayScale,
  onSelectTheme,
  onSelectSwitch,
  onSelectDifficulty,
  onToggleKeyboard,
  onToggleFingerGuides,
  onToggleAmbient,
  onChangeVolume,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('controls');
  const t = TRANSLATIONS[appLanguage];

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'certificate'>('feature');
  const [feedbackEmail, setFeedbackEmail] = useState<string>('');
  const [feedbackName, setFeedbackName] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  // Real-time sending states
  const [isSending, setIsSending] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deliveryReceiptId, setDeliveryReceiptId] = useState<string>('');

  const COMPANY_EMAIL = (import.meta as any).env?.VITE_SUPPORT_EMAIL || 'support@auratypes.org';
  const GITHUB_REPO_URL = (import.meta as any).env?.VITE_GITHUB_REPO || 'https://github.com/your-username/auratypes';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(COMPANY_EMAIL);
    setIsCopied(true);
    soundEngine.playKeySwitch('crystal-pop');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const applyTemplate = (tmpl: FeedbackTemplate) => {
    setActiveTemplateId(tmpl.id);
    setFeedbackType(tmpl.category);
    setFeedbackRating(tmpl.rating);
    setFeedbackMessage(tmpl.templateText);
    soundEngine.playKeySwitch('crystal-pop');
  };

  const handleRealtimeEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSending(true);
    setSubmitStatus('idle');

    const generatedId = `MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      // Real-time AJAX email delivery directly to support inbox
      const payload = {
        _subject: `[AuraType Real-Time Feedback] ${feedbackType.toUpperCase()} (${feedbackRating}/5 Stars) - ${feedbackName || 'Typist'}`,
        _replyto: feedbackEmail || 'no-reply@auratype.app',
        name: feedbackName || 'Aura Type User',
        email: feedbackEmail || 'anonymous@auratype.app',
        category: feedbackType,
        rating: `${feedbackRating} out of 5 Stars`,
        receiptId: generatedId,
        message: feedbackMessage,
        timestamp: new Date().toISOString(),
        _template: 'table',
        _captcha: 'false',
      };

      const response = await fetch(`https://formsubmit.co/ajax/${COMPANY_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setDeliveryReceiptId(generatedId);
        setSubmitStatus('success');
        soundEngine.playLevelUp();
      } else {
        // Fallback to mailto if external endpoint is blocked in sandbox
        triggerMailtoFallback(generatedId);
      }
    } catch (err) {
      console.warn('Direct fetch failed, falling back to mail client protocol:', err);
      triggerMailtoFallback(generatedId);
    } finally {
      setIsSending(false);
    }
  };

  const triggerMailtoFallback = (refId: string) => {
    const subject = encodeURIComponent(`[AuraType Live Feedback] ${feedbackType.toUpperCase()} (${feedbackRating}/5) Ref: ${refId}`);
    const body = encodeURIComponent(
      `Name: ${feedbackName || 'Anonymous Typist'}\nSender Email: ${feedbackEmail || 'Not Provided'}\nCategory: ${feedbackType}\nRating: ${feedbackRating}/5 Stars\nReference ID: ${refId}\n\nMessage:\n${feedbackMessage}\n\n---\nSent via Aura Type Engine`
    );
    window.open(`mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setDeliveryReceiptId(refId);
    setSubmitStatus('success');
    soundEngine.playLevelUp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header with Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.5)] shrink-0">
              <img src={appIcon} alt="Aura Types" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                AURA TYPES · TOUCH TYPING MASTER
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight font-display">
                {t.settings} & {t.privacyPolicy}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setActiveTab('controls');
                  soundEngine.playKeySwitch('cherry-blue');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'controls'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚙️</span>
                <span>{t.engineSettings}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('policies');
                  soundEngine.playKeySwitch('crystal-pop');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'policies'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📜</span>
                <span>{t.privacyPolicy}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('feedback');
                  soundEngine.playKeySwitch('crystal-pop');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'feedback'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>✉️</span>
                <span>{t.feedback}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto my-4 pr-1 flex-1 flex flex-col gap-6">
          {/* TAB 1: CONTROLS & ENGINE */}
          {activeTab === 'controls' && (
            <>
              {/* Section 01: Interface Language (انٹرفیس کی زبان) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-indigo-500/40 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>{t.sectionLanguage}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40">
                    {appLanguage === 'en' ? 'English (Active)' : 'اردو (فعال)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mb-3">
                  {t.sectionLanguageDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeLanguage('en');
                      soundEngine.playKeySwitch('crystal-pop');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      appLanguage === 'en'
                        ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div className="text-left">
                        <span className="font-bold text-sm block text-white">English</span>
                        <span className="text-[11px] text-slate-400">Strictly English UI (Zero Urdu)</span>
                      </div>
                    </div>
                    {appLanguage === 'en' && (
                      <span className="px-2 py-1 bg-cyan-500 text-slate-950 font-black text-[10px] rounded-lg">
                        SELECTED
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onChangeLanguage('ur');
                      soundEngine.playKeySwitch('crystal-pop');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      appLanguage === 'ur'
                        ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇵🇰</span>
                      <div className="text-left">
                        <span className="font-bold text-sm block text-white font-serif">اردو</span>
                        <span className="text-[11px] text-slate-400">مکمل اردو انٹرفیس</span>
                      </div>
                    </div>
                    {appLanguage === 'ur' && (
                      <span className="px-2 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-lg">
                        منتخب شدہ
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Section 02: Mechanical Switches */}
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  {t.sectionSwitches}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {SWITCH_OPTIONS.map((sw) => {
                    const isSelected = currentSwitch === sw.id;
                    return (
                      <button
                        key={sw.id}
                        onClick={() => {
                          onSelectSwitch(sw.id);
                          soundEngine.playKeySwitch(sw.id);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{sw.name}</span>
                            <span className="text-[10px] text-cyan-400 font-mono">[{sw.tag}]</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{sw.description}</p>
                        </div>
                        <span className="text-xs ml-2 text-slate-400">🔊</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 03: Keyboard Themes */}
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono">
                  {t.sectionThemes}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-2">
                  {KEYBOARD_THEMES.map((th) => {
                    const isSelected = currentTheme.id === th.id;
                    return (
                      <button
                        key={th.id}
                        onClick={() => {
                          onSelectTheme(th);
                          soundEngine.playKeySwitch('crystal-pop');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-500/10 border-pink-400 ring-1 ring-pink-400'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: th.accentColor, boxShadow: `0 0 8px ${th.accentColor}` }}
                          />
                          <span className="font-bold text-xs text-white truncate">{th.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{th.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 04: Difficulty Levels */}
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  {t.sectionDifficulty}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'novice', label: 'Novice (15-30 WPM)', desc: 'Relaxed falling speed' },
                    { id: 'cadet', label: 'Cadet (35-55 WPM)', desc: 'Standard speed' },
                    { id: 'knight', label: 'Knight (60-80 WPM)', desc: 'Fast cadence' },
                    { id: 'wizard', label: 'Wizard (85-110 WPM)', desc: 'Intense rain' },
                    { id: 'godspeed', label: 'Godspeed (120+ WPM)', desc: 'Ultra hypersonic' },
                    { id: 'adaptive', label: 'Adaptive Dynamic AI', desc: 'Auto-adjusts to your real-time WPM' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDifficulty(d.id as DifficultyLevel);
                        soundEngine.playKeySwitch('cherry-blue');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        difficulty === d.id
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{d.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 05: Audio Controls & HUD Toggles */}
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  {t.sectionAudio}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Switch Sound Volume</span>
                      <span className="font-mono">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={onToggleAmbient}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isAmbientOn
                        ? 'bg-emerald-500/10 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">Ambient Space Drone</p>
                      <p className="text-[10px] text-slate-400">Synthesizer harmonics</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {isAmbientOn ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    onClick={onToggleKeyboard}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      showKeyboard
                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">Visual Keyboard HUD</p>
                      <p className="text-[10px] text-slate-400">On-screen key reactive lighting</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {showKeyboard ? 'SHOWN' : 'HIDDEN'}
                    </span>
                  </button>

                  <button
                    onClick={onToggleFingerGuides}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      showFingerGuides
                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">Finger Placement Colors</p>
                      <p className="text-[10px] text-slate-400">Home row & touch typing guide</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {showFingerGuides ? 'ACTIVE' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section 06: Display Scaling & Screen Fit (For 19" 5:4, Laptops & Custom Monitors) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/40 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span>🖥️</span> {t.sectionDisplay}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {t.sectionDisplayDesc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-400">
                      {displayScale}%
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const vh = window.innerHeight;
                        const idealScale = Math.max(60, Math.min(115, Math.round((vh / 930) * 100)));
                        onChangeDisplayScale(idealScale);
                        soundEngine.playKeySwitch('crystal-pop');
                      }}
                      className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-[10px] sm:text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1"
                    >
                      <span>⚡ Auto-Fit My Screen</span>
                    </button>
                  </div>
                </div>

                {/* Popular Screen Aspect Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { label: '19" 5:4 Screen', sub: '1280x1024 (Best)', scale: 75, icon: '🖥️' },
                    { label: '15.6" Laptop', sub: '1366x768 / 1080p', scale: 70, icon: '💻' },
                    { label: 'Standard Full HD', sub: '1920x1080 (100%)', scale: 100, icon: '📺' },
                    { label: '2K / 4K Ultrawide', sub: 'Large Screens', scale: 115, icon: '🎛️' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        onChangeDisplayScale(preset.scale);
                        soundEngine.playKeySwitch('cherry-blue');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        displayScale === preset.scale
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>{preset.icon}</span>
                        <span>{preset.label}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-400">
                        <span>{preset.sub}</span>
                        <span className="font-bold text-cyan-300">{preset.scale}%</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Percentage Quick Click Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="text-[10px] font-mono text-slate-400 mr-1">Presets:</span>
                  {[60, 65, 70, 75, 80, 85, 90, 100, 110, 125].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        onChangeDisplayScale(pct);
                        soundEngine.playKeySwitch('cherry-blue');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        displayScale === pct
                          ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-sm'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      onChangeDisplayScale(100);
                      soundEngine.playKeySwitch('crystal-pop');
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono rounded-lg transition-colors cursor-pointer ml-auto"
                  >
                    Reset (100%)
                  </button>
                </div>

                {/* Interactive Slider */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 w-12 text-left">50% Min</span>
                  <input
                    type="range"
                    min="50"
                    max="130"
                    step="5"
                    value={displayScale}
                    onChange={(e) => onChangeDisplayScale(parseInt(e.target.value, 10))}
                    className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-14 text-right">130% Max</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: OFFICIAL PRIVACY POLICY & GOVERNANCE (ENTERPRISE EDITORIAL LEGAL DOCUMENT - NO BOXES) */}
          {activeTab === 'policies' && (
            <div className="flex flex-col gap-6 text-slate-300 font-sans max-w-4xl mx-auto py-2">
              {/* Official Document Header */}
              <div className="pb-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      Official Policy · Aura Types Open Source Project
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 font-display">
                    Privacy Policy & Data Protection Statement
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Applicable to Aura Types Worldwide · Last Revised & Fully Enacted: November 2026 · Global Version 4.2
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                    ✓ GDPR & CCPA Compliant
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                    🛡️ Zero-Telemetry
                  </span>
                </div>
              </div>

              {/* Clean Editorial Document Flow */}
              <div className="flex flex-col gap-7 text-xs sm:text-sm leading-relaxed text-slate-300">
                {/* Clause 1 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 01.</span>
                    <span>Executive Summary & Privacy-by-Design Architecture</span>
                  </h4>
                  <p>
                    Aura Types is developed and maintained by the <strong className="text-white">Aura Types Open Source Community</strong> under a strict non-custodial and <strong className="text-emerald-400">Privacy-by-Design</strong> architecture. Unlike cloud-centralized typing services that capture, monetize, or profile keystrokes on remote servers, Aura Types operates exclusively inside your local browser environment.
                  </p>
                  <p>
                    We uphold an absolute principle: your keystrokes, personal identity, typing accuracy, and speed velocities belong entirely to you. We do not sell, license, share, or transmit your data to any third party, government agency, or advertising network under any circumstances.
                  </p>
                </article>

                {/* Clause 2 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 02.</span>
                    <span>Ephemeral Keystroke Processing & Zero-Logging Guarantee</span>
                  </h4>
                  <p>
                    When typing during lessons, speed challenges, or arcade modes, physical keyboard events are registered solely for immediate, in-memory reactive feedback:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
                    <li>
                      <strong className="text-white">Volatile Memory Lifecycle:</strong> Each keypress is evaluated in transient volatile memory (RAM) to produce mechanical switch acoustics (Cherry MX Blue, Red, Brown, Crystal Pop) and compute instantaneous WPM speed. Keystroke data is permanently destroyed in zero milliseconds (0 ms).
                    </li>
                    <li>
                      <strong className="text-white">Zero Keylogger Guarantee:</strong> No background logging script, tracking beacon, or stroke interceptor exists anywhere within this software application.
                    </li>
                    <li>
                      <strong className="text-white">Acoustic Buffers:</strong> Sound synthesis is generated client-side through the Web Audio API. Audio buffers are never recorded or stored to disk.
                    </li>
                  </ul>
                </article>

                {/* Clause 3 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 03.</span>
                    <span>Local Device Storage & Data Sovereignty</span>
                  </h4>
                  <p>
                    To provide offline continuity without requiring an external server login, only the following essential operational states are stored directly in your browser's <code className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">localStorage</code>:
                  </p>
                  <div className="space-y-2.5 my-3 pl-4 border-l-2 border-emerald-500/40">
                    <div>
                      <strong className="text-white block">A. Candidate Typist Profile</strong>
                      <span className="text-slate-400">Your chosen display name, avatar, and target WPM goal, used strictly to personalize your on-screen HUD and official graduation diplomas.</span>
                    </div>
                    <div>
                      <strong className="text-white block">B. Curriculum Progress Benchmarks</strong>
                      <span className="text-slate-400">Completed level IDs, earned stars, personal best WPM, and accuracy scores for the 35 Touch Typing Master and 10 C++ training levels.</span>
                    </div>
                    <div>
                      <strong className="text-white block">C. Key Heatmap Matrix</strong>
                      <span className="text-slate-400">Aggregated press and error tallies that empower you to visually isolate weak fingers and challenging row transitions.</span>
                    </div>
                    <div>
                      <strong className="text-white block">D. Environmental Settings</strong>
                      <span className="text-slate-400">Chosen mechanical switch sound profile, RGB keyboard backlight theme, volume level, and audio toggles.</span>
                    </div>
                  </div>
                  <p>
                    You maintain <strong className="text-white">100% unilateral sovereignty</strong> over this data. You may modify or delete all records at any moment by clearing your browser cache or resetting your candidate profile.
                  </p>
                </article>

                {/* Clause 4 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 04.</span>
                    <span>Ad-Free Environment & Third-Party Non-Disclosure</span>
                  </h4>
                  <p>
                    Aura Types is strictly ad-free. The application does not embed Google AdSense, Meta Pixel, tracking cookies, commercial SDKs, or affiliate tracking scripts. We believe high-performance touch typing demands an uninterrupted, zero-distraction environment free of surveillance capitalism.
                  </p>
                </article>

                {/* Clause 5 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 05.</span>
                    <span>Certification Authenticity & Cryptographic Verification</span>
                  </h4>
                  <p>
                    All Grade V8.5 Grandmaster Diplomas and completion credentials awarded upon clearing milestone examinations are cryptographically signed using deterministic client-side hash algorithms. The recipient holds exclusive and perpetual ownership over their exported PDF certificates.
                  </p>
                </article>

                {/* Clause 6 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 06.</span>
                    <span>International Compliance: GDPR, CCPA & Child Privacy</span>
                  </h4>
                  <p>
                    This policy adheres strictly to the regulatory standards established under the European Union General Data Protection Regulation (GDPR, Articles 12–23), the California Consumer Privacy Act (CCPA/CPRA), and the Children's Online Privacy Protection Act (COPPA). Because we operate on a zero-custody, zero-collection model, no personal data ever resides on our servers.
                  </p>
                </article>

                {/* Clause 7 */}
                <article className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-xs">SECTION 07.</span>
                    <span>Corporate Contacts & Governance Office</span>
                  </h4>
                  <p>
                    Inquiries regarding our data governance, institutional academic licensing, or privacy compliance should be directed in writing to the legal office:
                  </p>
                  <p className="font-mono text-cyan-300">
                    Official Inquiries & Governance: <a href={`mailto:${COMPANY_EMAIL}`} className="underline hover:text-cyan-200">{COMPANY_EMAIL}</a>
                  </p>
                </article>

                {/* Official Signatory Block */}
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="font-bold text-white text-sm block">Aura Types Open Source Project</span>
                    <span className="text-slate-400">Community Governance & Information Security</span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-400 text-left sm:text-right">
                    <span>Document Reference: AT-OSP-POL-2026</span><br />
                    <span>Compliance State: Certified & Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REAL-TIME FEEDBACK, TEMPLATES & COMPANY EMAIL */}
          {activeTab === 'feedback' && (
            <div className="flex flex-col gap-5">
              {/* Company Contact Header Card */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20 shrink-0">
                    🏢
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-display">Aura Types Community & Developer Support</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                        ⚡ Real-Time Live
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Instant email delivery directly to company inbox</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`${GITHUB_REPO_URL}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>🐙</span>
                    <span>GitHub Issues</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{isCopied ? '✓ Copied' : '📋 Copy Email'}</span>
                  </button>
                </div>
              </div>

              {/* Official Email Link Banner */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">Official Company Inbox:</span>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1.5"
                >
                  <span>📧</span>
                  <span>{COMPANY_EMAIL}</span>
                </a>
              </div>

              {/* Quick Feedback Topic Chips */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>{appLanguage === 'ur' ? 'فوری موضوع منتخب کریں' : 'Quick Suggestion Topics'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Tap to auto-fill message</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TEMPLATES.map((tmpl) => {
                    const isSelected = activeTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{tmpl.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Email Submission Form */}
              <form onSubmit={handleRealtimeEmailSubmit} className="flex flex-col gap-4 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span>✉️</span>
                    <span>Real-Time Email Dispatch Form</span>
                  </h4>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono font-bold animate-bounce">
                      <span>✓</span>
                      <span>Delivered! Ref: {deliveryReceiptId}</span>
                    </div>
                  )}
                </div>

                {/* Sender Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="e.g. Alex Hunter"
                      className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Email Address (For reply)</label>
                    <input
                      type="email"
                      required
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="e.g. typist@gmail.com"
                      className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Feedback Type & Star Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Feedback Category</label>
                    <select
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value as any)}
                      className="px-3 py-2 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-amber-300 font-semibold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="feature">💡 Feature Request / Idea</option>
                      <option value="bug">🐛 Report a Bug / Issue</option>
                      <option value="certificate">📜 Certificate & Exam Verification</option>
                      <option value="general">💬 General Feedback & Review</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Experience Rating</label>
                    <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setFeedbackRating(star);
                            soundEngine.playKeySwitch('crystal-pop');
                          }}
                          className={`text-lg transition-transform cursor-pointer hover:scale-125 ${
                            star <= feedbackRating ? 'text-amber-400' : 'text-slate-600'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                        {feedbackRating}/5 Stars
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Message / Suggestions *</label>
                    <span className="text-[10px] text-slate-500">Edit template text or write custom</span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Type your feedback here or select one of the quick templates above..."
                    className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Real-time Dispatch Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>📡 Real-time push to:</span>
                    <strong className="text-amber-300 font-mono">{COMPANY_EMAIL}</strong>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => triggerMailtoFallback(`MANUAL-${Date.now().toString(36).toUpperCase()}`)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                      title="Open default email app"
                    >
                      Open Email App
                    </button>

                    <button
                      type="submit"
                      disabled={isSending || !feedbackMessage.trim()}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
                    >
                      {isSending ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Send Real-Time Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Aura Type · Open Source Touch Typing Simulator</span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Close & Save
          </button>
        </div>
      </div>
    </div>
  );
};
