import { PetCompanionData, PetHat, PetAura, PetAccessory } from '../types';
const cybercatSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="cgrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%233b82f6"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="%23090d16"/><circle cx="50" cy="50" r="36" fill="url(%23cgrad)" opacity="0.25"/><polygon points="26,30 38,46 20,44" fill="%2306b6d4"/><polygon points="74,30 62,46 80,44" fill="%2306b6d4"/><circle cx="50" cy="54" r="24" fill="%230f172a" stroke="%2306b6d4" stroke-width="2.5"/><ellipse cx="41" cy="52" rx="4" ry="6" fill="%2322d3ee"/><ellipse cx="59" cy="52" rx="4" ry="6" fill="%2322d3ee"/><circle cx="42" cy="50" r="1.5" fill="%23ffffff"/><circle cx="60" cy="50" r="1.5" fill="%23ffffff"/><polygon points="50,59 47,62 53,62" fill="%2338bdf8"/><path d="M46 64 Q50 67 54 64" stroke="%2338bdf8" stroke-width="2" fill="none"/></svg>`;

const dragonSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="dgrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23ef4444"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="%23090d16"/><circle cx="50" cy="50" r="36" fill="url(%23dgrad)" opacity="0.25"/><polygon points="50,18 34,42 66,42" fill="%23f59e0b"/><polygon points="26,24 36,38 22,38" fill="%23ef4444"/><polygon points="74,24 64,38 78,38" fill="%23ef4444"/><circle cx="50" cy="54" r="24" fill="%230f172a" stroke="%23f59e0b" stroke-width="2.5"/><polygon points="41,50 45,55 38,55" fill="%23fbbf24"/><polygon points="59,50 62,55 55,55" fill="%23fbbf24"/><circle cx="43" cy="51" r="1" fill="%23ffffff"/><circle cx="60" cy="51" r="1" fill="%23ffffff"/><path d="M45 64 Q50 68 55 64" stroke="%23f97316" stroke-width="2" fill="none"/></svg>`;

const pixieSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="pgrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%238b5cf6"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="%23090d16"/><circle cx="50" cy="50" r="36" fill="url(%23pgrad)" opacity="0.25"/><ellipse cx="32" cy="46" rx="14" ry="8" fill="%23ec4899" opacity="0.6"/><ellipse cx="68" cy="46" rx="14" ry="8" fill="%23ec4899" opacity="0.6"/><circle cx="50" cy="52" r="22" fill="%230f172a" stroke="%23ec4899" stroke-width="2.5"/><circle cx="42" cy="50" r="4" fill="%23f472b6"/><circle cx="58" cy="50" r="4" fill="%23f472b6"/><circle cx="43" cy="48" r="1.5" fill="%23ffffff"/><circle cx="59" cy="48" r="1.5" fill="%23ffffff"/><path d="M46 58 Q50 62 54 58" stroke="%23ec4899" stroke-width="2" fill="none"/></svg>`;

const shibaSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="sgrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="%23090d16"/><circle cx="50" cy="50" r="36" fill="url(%23sgrad)" opacity="0.25"/><polygon points="30,26 42,42 26,42" fill="%2310b981"/><polygon points="70,26 58,42 74,42" fill="%2310b981"/><circle cx="50" cy="54" r="24" fill="%230f172a" stroke="%2310b981" stroke-width="2.5"/><ellipse cx="41" cy="51" rx="3.5" ry="5" fill="%2334d399"/><ellipse cx="59" cy="51" rx="3.5" ry="5" fill="%2334d399"/><ellipse cx="50" cy="58" rx="4" ry="3" fill="%2310b981"/><path d="M46 62 Q50 65 54 62" stroke="%2310b981" stroke-width="1.8" fill="none"/></svg>`;

const owlSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="owgrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%23c084fc"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="%23090d16"/><circle cx="50" cy="50" r="36" fill="url(%23owgrad)" opacity="0.25"/><polygon points="32,24 44,40 28,40" fill="%238b5cf6"/><polygon points="68,24 56,40 72,40" fill="%238b5cf6"/><circle cx="50" cy="54" r="25" fill="%230f172a" stroke="%238b5cf6" stroke-width="2.5"/><circle cx="41" cy="50" r="7" fill="%231e1b4b" stroke="%23c084fc" stroke-width="2"/><circle cx="59" cy="50" r="7" fill="%231e1b4b" stroke="%23c084fc" stroke-width="2"/><circle cx="41" cy="50" r="3.5" fill="%23a855f7"/><circle cx="59" cy="50" r="3.5" fill="%23a855f7"/><circle cx="42" cy="49" r="1.5" fill="%23ffffff"/><circle cx="60" cy="49" r="1.5" fill="%23ffffff"/><polygon points="50,56 46,61 54,61" fill="%23e9d5ff"/></svg>`;

export const PET_HATS: PetHat[] = [
  { id: 'none', name: 'Standard Visor', icon: '🥽', requiredLevel: 1 },
  { id: 'wizard', name: 'Archmage Hat', icon: '🧙‍♂️', requiredLevel: 3 },
  { id: 'halo', name: 'Starlight Halo', icon: '✨', requiredLevel: 6 },
  { id: 'crown', name: 'Cyber Crown', icon: '👑', requiredLevel: 10 },
  { id: 'headset', name: 'Pro Gamer Rig', icon: '🎧', requiredLevel: 15 },
  { id: 'goggles', name: 'Quantum Pilot', icon: '🕶️', requiredLevel: 20 },
];

export const PET_AURAS: PetAura[] = [
  { id: 'cyan', name: 'Cyan Starlight', color: '#06B6D4', glowClass: 'shadow-[0_0_20px_#06B6D4]', requiredLevel: 1 },
  { id: 'magenta', name: 'Neon Nebula', color: '#EC4899', glowClass: 'shadow-[0_0_20px_#EC4899]', requiredLevel: 4 },
  { id: 'amber', name: 'Solar Flare', color: '#F59E0B', glowClass: 'shadow-[0_0_20px_#F59E0B]', requiredLevel: 8 },
  { id: 'emerald', name: 'Matrix Pulse', color: '#10B981', glowClass: 'shadow-[0_0_20px_#10B981]', requiredLevel: 12 },
  { id: 'prism', name: 'Quantum Prism', color: '#8B5CF6', glowClass: 'shadow-[0_0_25px_#8B5CF6]', requiredLevel: 18 },
];

export const PET_ACCESSORIES: PetAccessory[] = [
  { id: 'none', name: 'None', icon: '—', requiredLevel: 1 },
  { id: 'cyber-wings', name: 'Energy Wings', icon: '🪽', requiredLevel: 5 },
  { id: 'orb', name: 'Orbital Bit Drone', icon: '🛸', requiredLevel: 9 },
  { id: 'cape', name: 'Holo Cape', icon: '🧣', requiredLevel: 14 },
  { id: 'shield', name: 'Aegis Barrier', icon: '🛡️', requiredLevel: 22 },
];

export const INITIAL_PETS: PetCompanionData[] = [
  {
    id: 'nyx-cat',
    name: 'Nyx-09',
    species: 'Cyber Kitten',
    title: 'Velocity Guardian',
    description: 'A nimble cybernetic kitten engineered for extreme agility and lightning reflexes.',
    avatarImage: cybercatSvg,
    bonusDescription: '+15% Combo Score multiplier & speed burst triggers',
    accentColor: '#06B6D4',
    level: 5,
    xp: 280,
    selectedHat: 'none',
    selectedAura: 'cyan',
    selectedAccessory: 'none',
  },
  {
    id: 'ignis-dragon',
    name: 'Ignis-01',
    species: 'Mecha Wyvern',
    title: 'Lexical Pyromancer',
    description: 'Forged in digital star cores, Ignis unleashes plasma bursts when maintaining 98%+ accuracy.',
    avatarImage: dragonSvg,
    bonusDescription: 'Unleashes Meteor Blast on 10x streaks clearing nearby words',
    accentColor: '#F59E0B',
    level: 3,
    xp: 140,
    selectedHat: 'wizard',
    selectedAura: 'amber',
    selectedAccessory: 'none',
  },
  {
    id: 'aura-pixie',
    name: 'Aura Core',
    species: 'Hologram Sprite',
    title: 'Shield Harmonicist',
    description: 'A pure quantum light entity that generates time-dilation shields when words get dangerously close.',
    avatarImage: pixieSvg,
    bonusDescription: 'Triggers 2-second Slow Motion shield on critical life situations',
    accentColor: '#EC4899',
    level: 2,
    xp: 80,
    selectedHat: 'halo',
    selectedAura: 'magenta',
    selectedAccessory: 'none',
  },
  {
    id: 'byte-shiba',
    name: 'Byte-Kun',
    species: 'Quantum Shiba',
    title: 'Data Retriever',
    description: 'Loyal companion that converts perfect keystrokes into bonus mastery XP.',
    avatarImage: shibaSvg,
    bonusDescription: '+25% Extra XP per session & gives accuracy cheers',
    accentColor: '#10B981',
    level: 4,
    xp: 210,
    selectedHat: 'headset',
    selectedAura: 'emerald',
    selectedAccessory: 'cyber-wings',
  },
  {
    id: 'athena-owl',
    name: 'Athena-X',
    species: 'Omniscient Owl',
    title: 'Lexicon Oracle',
    description: 'Possesses the complete English lexicon, displaying live vocabulary definitions and synonyms.',
    avatarImage: owlSvg,
    bonusDescription: 'Displays live word etymology and definition insights during gameplay',
    accentColor: '#8B5CF6',
    level: 6,
    xp: 390,
    selectedHat: 'crown',
    selectedAura: 'prism',
    selectedAccessory: 'orb',
  },
];
