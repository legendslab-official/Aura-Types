import React, { useState } from 'react';
import { PetCompanionData, PetHat, PetAura, PetAccessory } from '../types';
import { PET_HATS, PET_AURAS, PET_ACCESSORIES } from '../data/pets';
import { soundEngine } from '../utils/audio';

interface PetCompanionProps {
  pet: PetCompanionData;
  combo: number;
  accuracy: number;
  isDanger: boolean;
  onUpdatePet: (updated: PetCompanionData) => void;
  availablePets: PetCompanionData[];
  onSelectPet: (petId: string) => void;
  compact?: boolean;
}

export const PetCompanion: React.FC<PetCompanionProps> = ({
  pet,
  combo,
  accuracy,
  isDanger,
  onUpdatePet,
  availablePets,
  onSelectPet,
  compact = false,
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [activeTab, setActiveTab] = useState<'pets' | 'hats' | 'auras' | 'accessories'>('pets');

  // Compute speech reaction
  let speech = `Ready to type with ${pet.name}!`;
  let moodEmoji = '✨';

  if (isDanger) {
    speech = 'Watch out! Protect the shield!';
    moodEmoji = '⚡';
  } else if (combo >= 25) {
    speech = `GODSPEED! ${combo}x STREAK! You are unstoppable!`;
    moodEmoji = '🔥';
  } else if (combo >= 10) {
    speech = `Great flow! ${combo} combos! Keep the rhythm!`;
    moodEmoji = '🚀';
  } else if (accuracy < 90 && combo === 0) {
    speech = 'Steady your fingers. Precision beats speed!';
    moodEmoji = '🎯';
  }

  const xpProgress = Math.min(100, ((pet.xp % 100) / 100) * 100);

  const selectedHatObj = PET_HATS.find((h) => h.id === pet.selectedHat) || PET_HATS[0];
  const selectedAuraObj = PET_AURAS.find((a) => a.id === pet.selectedAura) || PET_AURAS[0];
  const selectedAccObj = PET_ACCESSORIES.find((a) => a.id === pet.selectedAccessory) || PET_ACCESSORIES[0];

  const handleEquipHat = (hat: PetHat) => {
    if (pet.level < hat.requiredLevel) return;
    soundEngine.playKeySwitch('crystal-pop');
    onUpdatePet({ ...pet, selectedHat: hat.id });
  };

  const handleEquipAura = (aura: PetAura) => {
    if (pet.level < aura.requiredLevel) return;
    soundEngine.playKeySwitch('crystal-pop');
    onUpdatePet({ ...pet, selectedAura: aura.id });
  };

  const handleEquipAccessory = (acc: PetAccessory) => {
    if (pet.level < acc.requiredLevel) return;
    soundEngine.playKeySwitch('crystal-pop');
    onUpdatePet({ ...pet, selectedAccessory: acc.id });
  };

  if (compact) {
    return (
      <div className="relative flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-lg">
        <div
          className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-transform duration-300 ${
            combo >= 10 ? 'scale-110' : ''
          }`}
          style={{ borderColor: selectedAuraObj.color, boxShadow: `0 0 15px ${selectedAuraObj.color}66` }}
        >
          <img
            src={pet.avatarImage}
            alt={pet.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {selectedHatObj.id !== 'none' && (
            <span className="absolute -top-1 -right-1 text-sm">{selectedHatObj.icon}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-xs text-slate-200 truncate">{pet.name}</span>
            <span className="text-[10px] font-mono text-cyan-400">Lv.{pet.level}</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{speech}</p>
        </div>

        <button
          onClick={() => setShowCustomizer(true)}
          className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Gear
        </button>

        {/* Customizer Modal */}
        {showCustomizer && (
          <PetCustomizerModal
            pet={pet}
            availablePets={availablePets}
            onClose={() => setShowCustomizer(false)}
            onSelectPet={onSelectPet}
            onEquipHat={handleEquipHat}
            onEquipAura={handleEquipAura}
            onEquipAccessory={handleEquipAccessory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: selectedAuraObj.color }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Pet Avatar with dynamic aura & floating animation */}
        <div className="relative group">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 transition-all duration-300 group-hover:scale-105"
            style={{
              borderColor: selectedAuraObj.color,
              boxShadow: `0 0 25px ${selectedAuraObj.color}88`,
            }}
          >
            <img
              src={pet.avatarImage}
              alt={pet.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Equipped Hat Overlay */}
          {selectedHatObj.id !== 'none' && (
            <div className="absolute -top-3 -right-2 text-2xl bg-slate-900/90 border border-slate-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              {selectedHatObj.icon}
            </div>
          )}

          {/* Equipped Accessory Overlay */}
          {selectedAccObj.id !== 'none' && (
            <div className="absolute -bottom-2 -left-2 text-lg bg-slate-900/90 border border-slate-700 rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              {selectedAccObj.icon}
            </div>
          )}

          <div className="absolute -bottom-2 right-2 bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-[11px] px-2 py-0.5 rounded-full font-bold">
            Lv.{pet.level}
          </div>
        </div>

        {/* Pet Info & Speech */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{pet.name}</h3>
            <span className="text-xs text-slate-400 font-medium">{pet.species}</span>
            <span className="text-xs text-cyan-400">· {pet.title}</span>
          </div>

          {/* Dialogue bubble */}
          <div className="mt-2.5 p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 flex items-center gap-2">
            <span className="text-base">{moodEmoji}</span>
            <p className="italic">{speech}</p>
          </div>

          {/* Companion Passive Perk */}
          <div className="mt-2 text-xs text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
            <span>✨ Perk:</span>
            <span>{pet.bonusDescription}</span>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Bond & Mastery XP</span>
              <span className="font-mono">{pet.xp % 100} / 100 XP</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Customize Button */}
        <div className="sm:self-center">
          <button
            onClick={() => setShowCustomizer(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold tracking-wide transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer whitespace-nowrap"
          >
            Customize Pet Gear
          </button>
        </div>
      </div>

      {showCustomizer && (
        <PetCustomizerModal
          pet={pet}
          availablePets={availablePets}
          onClose={() => setShowCustomizer(false)}
          onSelectPet={onSelectPet}
          onEquipHat={handleEquipHat}
          onEquipAura={handleEquipAura}
          onEquipAccessory={handleEquipAccessory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

interface PetCustomizerModalProps {
  pet: PetCompanionData;
  availablePets: PetCompanionData[];
  onClose: () => void;
  onSelectPet: (petId: string) => void;
  onEquipHat: (hat: PetHat) => void;
  onEquipAura: (aura: PetAura) => void;
  onEquipAccessory: (acc: PetAccessory) => void;
  activeTab: 'pets' | 'hats' | 'auras' | 'accessories';
  setActiveTab: (t: 'pets' | 'hats' | 'auras' | 'accessories') => void;
}

const PetCustomizerModal: React.FC<PetCustomizerModalProps> = ({
  pet,
  availablePets,
  onClose,
  onSelectPet,
  onEquipHat,
  onEquipAura,
  onEquipAccessory,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Pet Companion Workshop</h3>
            <p className="text-xs text-slate-400">Level up your typing companion to unlock exclusive gear & cosmic auras</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          {(['pets', 'hats', 'auras', 'accessories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-5 overflow-y-auto pr-1 flex-1">
          {activeTab === 'pets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePets.map((p) => {
                const isSelected = p.id === pet.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPet(p.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={p.avatarImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white truncate">{p.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400">Lv.{p.level}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{p.species}</p>
                      <p className="text-[10px] text-emerald-400 mt-1 truncate">{p.bonusDescription}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'hats' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PET_HATS.map((hat) => {
                const isLocked = pet.level < hat.requiredLevel;
                const isEquipped = pet.selectedHat === hat.id;
                return (
                  <button
                    key={hat.id}
                    disabled={isLocked}
                    onClick={() => onEquipHat(hat)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isEquipped
                        ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400'
                        : isLocked
                        ? 'bg-slate-950/30 border-slate-800/40 opacity-50 cursor-not-allowed'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    <div className="text-3xl mb-1">{hat.icon}</div>
                    <p className="text-xs font-semibold text-white">{hat.name}</p>
                    {isLocked ? (
                      <span className="text-[10px] text-rose-400">Req. Lv.{hat.requiredLevel}</span>
                    ) : isEquipped ? (
                      <span className="text-[10px] text-cyan-400 font-bold">Equipped</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Click to Equip</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'auras' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PET_AURAS.map((aura) => {
                const isLocked = pet.level < aura.requiredLevel;
                const isEquipped = pet.selectedAura === aura.id;
                return (
                  <button
                    key={aura.id}
                    disabled={isLocked}
                    onClick={() => onEquipAura(aura)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isEquipped
                        ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400'
                        : isLocked
                        ? 'bg-slate-950/30 border-slate-800/40 opacity-50 cursor-not-allowed'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full border border-white/20 shrink-0 shadow-lg"
                      style={{ backgroundColor: aura.color, boxShadow: `0 0 15px ${aura.color}` }}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">{aura.name}</p>
                      {isLocked ? (
                        <span className="text-[10px] text-rose-400">Unlock at Lv.{aura.requiredLevel}</span>
                      ) : isEquipped ? (
                        <span className="text-[10px] text-cyan-400 font-bold">Active Aura</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Equip</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'accessories' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PET_ACCESSORIES.map((acc) => {
                const isLocked = pet.level < acc.requiredLevel;
                const isEquipped = pet.selectedAccessory === acc.id;
                return (
                  <button
                    key={acc.id}
                    disabled={isLocked}
                    onClick={() => onEquipAccessory(acc)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isEquipped
                        ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400'
                        : isLocked
                        ? 'bg-slate-950/30 border-slate-800/40 opacity-50 cursor-not-allowed'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    <div className="text-3xl mb-1">{acc.icon}</div>
                    <p className="text-xs font-semibold text-white">{acc.name}</p>
                    {isLocked ? (
                      <span className="text-[10px] text-rose-400">Req. Lv.{acc.requiredLevel}</span>
                    ) : isEquipped ? (
                      <span className="text-[10px] text-cyan-400 font-bold">Equipped</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Click to Equip</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
