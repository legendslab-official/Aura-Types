import React, { useState } from 'react';
import { UserProfile, SwitchType, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { soundEngine } from '../utils/audio';

interface OnboardingProfileModalProps {
  initialProfile?: UserProfile;
  appLanguage?: AppLanguage;
  onSave: (profile: UserProfile, preferredSwitch?: SwitchType) => void;
  isEditMode?: boolean;
  onClose?: () => void;
}

const AVATAR_CHOICES = ['⚡', '💻', '🚀', '🧠', '👑', '🎯', '🏎️', '💎', '🛡️', '🐉', '✨', '🔥'];

export const OnboardingProfileModal: React.FC<OnboardingProfileModalProps> = ({
  initialProfile,
  appLanguage = 'en',
  onSave,
  isEditMode = false,
  onClose,
}) => {
  const t = TRANSLATIONS[appLanguage];
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [title, setTitle] = useState<string>(initialProfile?.title || 'Certified Keyboard Systems Specialist');
  const [avatar, setAvatar] = useState<string>(initialProfile?.avatar || '⚡');
  const [goalWpm, setGoalWpm] = useState<number>(initialProfile?.goalWpm || 60);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'expert'>(
    initialProfile?.experienceLevel || 'beginner'
  );
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchType>('cherry-blue');
  const [nameError, setNameError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Please enter your name to personalize your certificates and stats.');
      soundEngine.playError();
      return;
    }

    const finalProfile: UserProfile = {
      name: name.trim(),
      title: title.trim() || 'Touch Typing Practitioner',
      avatar,
      goalWpm,
      experienceLevel,
      registeredAt: initialProfile?.registeredAt || new Date().toISOString(),
    };

    localStorage.setItem('auratype_user_profile', JSON.stringify(finalProfile));
    soundEngine.playLevelUp();
    onSave(finalProfile, selectedSwitch);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col gap-5 my-auto">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 text-slate-950 font-bold shrink-0">
              {avatar}
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                {isEditMode ? 'Profile Settings' : 'Welcome to Aura Type'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                {isEditMode ? 'Edit Typist Profile' : 'Setup Your Typist Profile'}
              </h2>
            </div>
          </div>

          {isEditMode && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400">
          {appLanguage === 'ur'
            ? 'آپ کا نام سرکاری سرٹیفکیٹس، لائیو تجزیات اور لیڈر بورڈز پر شائع ہوگا۔'
            : 'Your candidate name will appear on official diplomas, certificates, live analytics, and leaderboards.'}
        </p>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. Name & Professional Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>{t.fullNameLabel}</span>
              <span className="text-[10px] text-cyan-400 font-mono">Appears on Certificate</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="e.g. Alex Hunter / CyberTypist"
              className="px-4 py-3 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
              autoFocus={!isEditMode}
            />
            {nameError && <span className="text-[11px] text-rose-400 font-medium">{nameError}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {t.designationLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer / C++ Developer / Student"
              className="px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
            />
          </div>

          {/* 2. Choose Avatar Icon */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {t.avatarChoice}
            </label>
            <div className="grid grid-cols-6 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              {AVATAR_CHOICES.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    setAvatar(icon);
                    soundEngine.playKeySwitch('crystal-pop');
                  }}
                  className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    avatar === icon
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                      : 'bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Target Speed Goal & Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Speed Goal</label>
              <select
                value={goalWpm}
                onChange={(e) => setGoalWpm(Number(e.target.value))}
                className="px-3 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-cyan-300 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value={30}>30 WPM (Foundation)</option>
                <option value={45}>45 WPM (Proficient)</option>
                <option value={60}>60 WPM (Professional)</option>
                <option value={80}>80 WPM (Grandmaster)</option>
                <option value={100}>100+ WPM (Godspeed)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Experience Tier</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as 'beginner' | 'intermediate' | 'expert')}
                className="px-3 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-emerald-300 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="beginner">Beginner (1-20 WPM)</option>
                <option value="intermediate">Intermediate (20-50 WPM)</option>
                <option value="expert">Advanced (50+ WPM)</option>
              </select>
            </div>
          </div>

          {/* 4. Mechanical Switch Audio Profile */}
          {!isEditMode && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Mechanical Switch Sound
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cherry-blue', name: 'Cherry MX Blue (Clicky)', icon: '🟦' },
                  { id: 'linear-red', name: 'Linear Red (Smooth)', icon: '🟥' },
                  { id: 'crystal-pop', name: 'Crystal Pop (Thock)', icon: '🔮' },
                ].map((sw) => (
                  <button
                    key={sw.id}
                    type="button"
                    onClick={() => {
                      setSelectedSwitch(sw.id as SwitchType);
                      soundEngine.playKeySwitch(sw.id as SwitchType);
                    }}
                    className={`p-2 rounded-xl text-[11px] font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedSwitch === sw.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{sw.icon}</span>
                    <span className="truncate text-center">{sw.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Submit */}
          <div className="mt-3 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            {isEditMode && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
              >
                {appLanguage === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </button>
            )}

            <button
              type="submit"
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              <span>🚀</span>
              <span>
                {isEditMode
                  ? appLanguage === 'ur'
                    ? 'پروفائل اپ ڈیٹ کریں'
                    : 'Update Profile'
                  : t.saveProfile}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
