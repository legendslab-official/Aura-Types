export type GameMode = 'rain' | 'boss' | 'synonym' | 'zen' | 'multiplayer' | 'stickman';

export type AppLanguage = 'en' | 'ur';

export type DifficultyLevel = 'novice' | 'cadet' | 'knight' | 'wizard' | 'godspeed' | 'adaptive';

export interface WordItem {
  id: string;
  text: string;
  meaning?: string;
  category?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface ActiveRainWord {
  id: string;
  text: string;
  typedLength: number;
  x: number; // -10 to 10 in 3D space
  y: number; // height (starts at 18, falls to 0)
  z: number; // depth (-20 to 10)
  speed: number;
  meaning?: string;
  category?: string;
  colorHex?: string;
  isBossWord?: boolean;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  wordsCompleted: number;
  streak: number;
  maxStreak: number;
  score: number;
  elapsedSeconds: number;
}

export interface KeyHeatmapData {
  [key: string]: {
    presses: number;
    errors: number;
  };
}

export interface HistorySession {
  id: string;
  date: string;
  mode: GameMode;
  difficulty: DifficultyLevel;
  wpm: number;
  accuracy: number;
  score: number;
  durationSeconds: number;
  wordsCount: number;
}

export type SwitchType = 'cherry-blue' | 'cherry-red' | 'holy-panda' | 'cyber-laser' | 'crystal-pop' | 'silent';

export interface KeyboardTheme {
  id: string;
  name: string;
  description: string;
  bodyBg: string;
  keyBg: string;
  keyBorder: string;
  keyText: string;
  activeKeyBg: string;
  activeGlow: string;
  accentColor: string;
  fontStyle: string;
}

export type PetId = 'nyx-cat' | 'ignis-dragon' | 'aura-pixie' | 'byte-shiba' | 'athena-owl';

export interface PetHat {
  id: string;
  name: string;
  icon: string;
  requiredLevel: number;
}

export interface PetAura {
  id: string;
  name: string;
  color: string;
  glowClass: string;
  requiredLevel: number;
}

export interface PetAccessory {
  id: string;
  name: string;
  icon: string;
  requiredLevel: number;
}

export interface PetCompanionData {
  id: PetId;
  name: string;
  species: string;
  title: string;
  description: string;
  avatarImage: string;
  bonusDescription: string;
  accentColor: string;
  level: number;
  xp: number;
  selectedHat: string;
  selectedAura: string;
  selectedAccessory: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  petSpecies: string;
  wpm: number;
  accuracy: number;
  score: number;
  mode: GameMode;
  difficulty: DifficultyLevel;
  country: string;
  timestamp: string;
}

export interface RacerBot {
  id: string;
  name: string;
  avatar: string;
  targetWpm: number;
  currentProgress: number; // 0 to 100%
  currentWpm: number;
  color: string;
  finished: boolean;
  finishTime?: number;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  goalWpm: number;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  bio?: string;
  registeredAt: string;
}

