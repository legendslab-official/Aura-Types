import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  KeyboardTheme,
  SwitchType,
  PetCompanionData,
  HistorySession,
} from '../types';
import { soundEngine } from '../utils/audio';
import { recordStreakActivity } from '../utils/streak';

interface StickmanFighterGameProps {
  theme: KeyboardTheme;
  switchType: SwitchType;
  pet: PetCompanionData;
  onUpdatePet: (pet: PetCompanionData) => void;
  onSessionComplete: (session: HistorySession, heatmap: { [k: string]: { presses: number; errors: number } }) => void;
  onOpenTraining?: () => void;
}

export type CombatWordMode = 'single-action-words' | 'single-keys';

export type SolidActionMove =
  | 'idle'
  | 'jab'
  | 'cross'
  | 'dragon-uppercut'
  | 'flying-knee'
  | 'hurricane-kick'
  | 'axe-slam'
  | 'katana-cleave'
  | 'dual-blade-x'
  | 'hadouken-beam'
  | 'seismic-slam'
  | 'shadow-teleport'
  | 'fury-100-fist'
  | 'block-counter'
  | 'ninja-flip'
  | 'hurt'
  | 'juggle-air'
  | 'wall-bounce'
  | 'knockdown'
  | 'victory';

export interface ActionMoveDefinition {
  id: SolidActionMove;
  name: string;
  word: string;
  icon: string;
  color: string;
  damage: number;
  description: string;
}

export const SOLID_ACTION_MOVES: ActionMoveDefinition[] = [
  { id: 'jab', name: 'Direct Jab', word: 'hit', icon: '👊', color: '#38BDF8', damage: 22, description: 'Rapid piercing jab' },
  { id: 'cross', name: 'Heavy Fire Cross', word: 'punch', icon: '💥', color: '#F97316', damage: 26, description: 'Heavy flaming straight punch' },
  { id: 'dragon-uppercut', name: 'Rising Dragon Uppercut', word: 'upper', icon: '🌋', color: '#EF4444', damage: 34, description: 'Launches rival 30ft into the air' },
  { id: 'flying-knee', name: 'Flying Tiger Knee', word: 'leap', icon: '🐯', color: '#FBBF24', damage: 28, description: 'Leaping knee strike crushing rival' },
  { id: 'hurricane-kick', name: 'Hurricane 360 Spin Kick', word: 'kick', icon: '🌪️', color: '#10B981', damage: 30, description: 'Whirlwind spinning roundhouse' },
  { id: 'axe-slam', name: 'Meteor Axe Kick', word: 'slam', icon: '⚡', color: '#E11D48', damage: 32, description: 'Overhead downward axe smash' },
  { id: 'katana-cleave', name: 'Emerald Katana Cleave', word: 'slash', icon: '🗡️', color: '#10B981', damage: 35, description: 'Fast lightning sword draw' },
  { id: 'dual-blade-x', name: 'Dual Blade X-Slash', word: 'cut', icon: '⚔️', color: '#06B6D4', damage: 36, description: 'Twin blades cross execution' },
  { id: 'hadouken-beam', name: 'Plasma Hadouken Blast', word: 'fire', icon: '🔥', color: '#0EA5E9', damage: 34, description: 'Pulsating energy fireball' },
  { id: 'seismic-slam', name: 'Ground Eruption Slam', word: 'smash', icon: '💥', color: '#D97706', damage: 35, description: 'Seismic ground crater slam' },
  { id: 'shadow-teleport', name: 'Shadow Dash Teleport', word: 'dash', icon: '💨', color: '#8B5CF6', damage: 30, description: 'Flits behind rival for spine kick' },
  { id: 'fury-100-fist', name: '100-Fist Hyper Barrage', word: 'fury', icon: '🔥', color: '#EC4899', damage: 42, description: 'High-speed 10-hit combo barrage' },
  { id: 'block-counter', name: 'Aegis Parry Shield', word: 'block', icon: '🛡️', color: '#14B8A6', damage: 18, description: 'Deflects rival strike and resets timer' },
  { id: 'ninja-flip', name: 'Acrobatic Backflip Dodge', word: 'dodge', icon: '🤸', color: '#6366F1', damage: 20, description: 'Somersault counter' },
  { id: 'hadouken-beam', name: 'Cosmic Thunder Blast', word: 'blast', icon: '⚡', color: '#FACC15', damage: 32, description: 'Lightning beam shock' },
  { id: 'katana-cleave', name: 'Karate Blade Chop', word: 'chop', icon: '🗡️', color: '#34D399', damage: 28, description: 'Heavy downward chop' },
  { id: 'dragon-uppercut', name: 'Dragon Fist Blast', word: 'dragon', icon: '🐉', color: '#F97316', damage: 38, description: 'Full dragon aura strike' },
  { id: 'cross', name: 'Power Impact', word: 'pow', icon: '💥', color: '#FB923C', damage: 25, description: 'Heavy explosive punch' },
  { id: 'hurricane-kick', name: 'Spin Cyclone', word: 'spin', icon: '🌪️', color: '#10B981', damage: 28, description: 'Fast spin kick' },
  { id: 'axe-slam', name: 'Skyfall Stomp', word: 'drop', icon: '🦅', color: '#F43F5E', damage: 30, description: 'Aerial dive stomp' },
];

const SINGLE_COMBAT_KEYS: string[] = [
  'f', 'j', 'd', 'k', 's', 'l', 'a', 'g', 'h', 'r', 'u', 'e', 'i', 'w', 'o', 'v', 'b', 'c', 'm', 't', 'y', 'z', 'x', 'q', 'p'
];

interface RivalBoss {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  maxHp: number;
  currentHp: number;
  attackSpeedSec: number;
  attackDmg: number;
  specialMoveName: string;
  roundNumber: number;
}

const RIVAL_ROSTER = [
  { name: 'Shadow Shinobi', title: 'Twin-Blade Assassin', avatar: '🥷', color: '#EF4444', move: 'Shadow Death Swipe' },
  { name: 'Titan Rex', title: 'Iron Fist Heavyweight', avatar: '🥊', color: '#F59E0B', move: 'Seismic Iron Hammer' },
  { name: 'Emerald Jin', title: 'Samurai Sword Master', avatar: '🗡️', color: '#10B981', move: 'Dragon Cleave' },
  { name: 'Grandmaster Ryu', title: 'Heavenly Dragon Sage', avatar: '⚡', color: '#A855F7', move: 'Heavenly Wave' },
  { name: 'Crimson Akuma', title: 'Infernal Brawler', avatar: '👺', color: '#F43F5E', move: 'Inferno Eruption' },
  { name: 'Frost Monk Kai', title: 'Glacial Guardian', avatar: '❄️', color: '#06B6D4', move: 'Absolute Zero Fist' },
  { name: 'Thunder Thor', title: 'Lightning Lord', avatar: '🌩️', color: '#EAB308', move: 'Thunder God Strike' },
  { name: 'Void Phantom', title: 'Abyss Warlord', avatar: '👻', color: '#8B5CF6', move: 'Void Oblivion' },
];

const generateRivalForRound = (round: number): RivalBoss => {
  const base = RIVAL_ROSTER[(round - 1) % RIVAL_ROSTER.length];
  // Start with very achievable, solid HP (~3-4 single action words to beat)
  const hp = Math.min(130, 55 + (round - 1) * 8);
  const attackSpeed = Math.max(7.5, 10.5 - (round - 1) * 0.3); // 10.5s down to 7.5s
  const attackDmg = Math.min(18, 7 + Math.floor(round * 0.7));

  return {
    id: `rival-${round}-${Date.now()}`,
    name: `${base.name} ${round > RIVAL_ROSTER.length ? `II (Round ${round})` : ''}`,
    title: base.title,
    avatar: base.avatar,
    color: base.color,
    maxHp: hp,
    currentHp: hp,
    attackSpeedSec: attackSpeed,
    attackDmg: attackDmg,
    specialMoveName: base.move,
    roundNumber: round,
  };
};

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  radius: number;
  color: string;
  glowColor: string;
  tailLength: number;
  isPlayer: boolean;
}

interface GhostShadow {
  x: number;
  y: number;
  move: SolidActionMove;
  facing: number;
  color: string;
  alpha: number;
}

interface HitSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface SlashArc {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
  width: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface FloatingCombatText {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const StickmanFighterGame: React.FC<StickmanFighterGameProps> = ({
  theme,
  switchType,
  pet,
  onUpdatePet,
  onSessionComplete,
  onOpenTraining,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Settings & Arena
  const [wordMode, setWordMode] = useState<CombatWordMode>('single-action-words');
  const [arena, setArena] = useState<'dojo' | 'rooftop' | 'volcano'>('dojo');

  // Match State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 1v1 Round Progression (Continuous Endless Duels)
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [totalWins, setTotalWins] = useState<number>(0);
  const [currentRival, setCurrentRival] = useState<RivalBoss>(() => generateRivalForRound(1));

  // Fighter Health & Super Meter
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [maxPlayerHp] = useState<number>(100);
  const [superMeter, setSuperMeter] = useState<number>(0); // 0 to 100%
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Combat Typing Action State (2 Characters Only)
  const [currentAction, setCurrentAction] = useState<ActionMoveDefinition>(SOLID_ACTION_MOVES[0]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('hit');
  const [typedInput, setTypedInput] = useState<string>('');
  const [opponentAttackProgress, setOpponentAttackProgress] = useState<number>(0); // 0 to 100%
  const [bannerNotice, setBannerNotice] = useState<string>('⚡ 1v1 SOLID ACTION BRAWL READY!');
  const [lastFighterMove, setLastFighterMove] = useState<string>('Direct Jab');

  // Live Metrics
  const [currentWpm, setCurrentWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);

  // EXACTLY 2 CHARACTERS SKELETAL PHYSICS REFS
  // Character 1: Hero (Left)
  const playerRef = useRef({
    x: 230,
    y: 275,
    baseX: 230,
    vx: 0,
    vy: 0,
    facing: 1 as 1 | -1,
    move: 'idle' as SolidActionMove,
    animTimer: 0,
    animFrame: 0,
  });

  // Character 2: Rival Boss (Right)
  const opponentRef = useRef({
    x: 570,
    y: 275,
    baseX: 570,
    vx: 0,
    vy: 0,
    facing: -1 as 1 | -1,
    move: 'idle' as SolidActionMove,
    animTimer: 0,
    animFrame: 0,
  });

  // Visual Effects Refs
  const projectilesRef = useRef<Projectile[]>([]);
  const ghostShadowsRef = useRef<GhostShadow[]>([]);
  const hitSparksRef = useRef<HitSpark[]>([]);
  const slashArcsRef = useRef<SlashArc[]>([]);
  const floatingTextsRef = useRef<FloatingCombatText[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const dustParticlesRef = useRef<DustParticle[]>([]);
  const screenShakeRef = useRef<number>(0);
  const hitFreezeRef = useRef<number>(0);

  const localHeatmapRef = useRef<{ [k: string]: { presses: number; errors: number } }>({});
  const animationFrameRef = useRef<number | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const attackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Pick Next Action Word
  const getNextAction = useCallback((): { item: ActionMoveDefinition; prompt: string } => {
    if (wordMode === 'single-keys') {
      const key = SINGLE_COMBAT_KEYS[Math.floor(Math.random() * SINGLE_COMBAT_KEYS.length)];
      const randomAction = SOLID_ACTION_MOVES[Math.floor(Math.random() * SOLID_ACTION_MOVES.length)];
      const pseudoItem: ActionMoveDefinition = {
        ...randomAction,
        word: key,
        name: `${randomAction.name} [${key.toUpperCase()}]`,
      };
      return { item: pseudoItem, prompt: key };
    } else {
      const item = SOLID_ACTION_MOVES[Math.floor(Math.random() * SOLID_ACTION_MOVES.length)];
      return { item, prompt: item.word };
    }
  }, [wordMode]);

  // Heavy Impact Visuals (Thick shockwaves, heavy sparks, ground dust, camera shake)
  const triggerHeavyImpact = (x: number, y: number, color: string, isSuperHeavy = false) => {
    const sparkCount = isSuperHeavy ? 40 : 22;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isSuperHeavy ? 6 + Math.random() * 11 : 3 + Math.random() * 8;
      hitSparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        color,
        size: isSuperHeavy ? 4.5 + Math.random() * 4.5 : 3 + Math.random() * 3,
        life: 0,
        maxLife: isSuperHeavy ? 26 : 18,
      });
    }

    // Heavy Expanding Shockwave Ring
    shockwavesRef.current.push({
      x,
      y,
      radius: 8,
      maxRadius: isSuperHeavy ? 90 : 50,
      color,
      alpha: 1,
    });

    // Ground Dust explosion
    for (let i = 0; i < (isSuperHeavy ? 14 : 7); i++) {
      dustParticlesRef.current.push({
        x: x + (Math.random() - 0.5) * 50,
        y: 275,
        vx: (Math.random() - 0.5) * 6,
        vy: -1.5 - Math.random() * 3,
        size: 3.5 + Math.random() * 5,
        alpha: 0.85,
      });
    }

    screenShakeRef.current = isSuperHeavy ? 18 : 8;
    hitFreezeRef.current = isSuperHeavy ? 4 : 2;
  };

  const addCombatPopup = (x: number, y: number, text: string, color = '#FACC15', size = 20) => {
    floatingTextsRef.current.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y - 25,
      text,
      color,
      size,
      life: 0,
      maxLife: 32,
    });
  };

  // Advance to Next Round (Continuous Seamless 1v1)
  const advanceToNextRound = useCallback((nextRound: number) => {
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    soundEngine.playComboKO();
    soundEngine.playLevelUp();

    const newRival = generateRivalForRound(nextRound);
    setRoundNumber(nextRound);
    setTotalWins((w) => w + 1);
    setCurrentRival(newRival);
    setOpponentAttackProgress(0);

    // Heal player on victory (+30 HP)
    setPlayerHp((hp) => Math.min(100, hp + 30));
    setBannerNotice(`👑 ROUND ${nextRound} START! VS ${newRival.name.toUpperCase()} (${newRival.title})`);

    // Next rival lands dynamically from above with ground dust!
    opponentRef.current = {
      x: 570,
      y: 110,
      baseX: 570,
      vx: 0,
      vy: 10,
      facing: -1,
      move: 'idle',
      animTimer: 0,
      animFrame: 0,
    };

    const gainedXp = 40 + nextRound * 12;
    const nextTotalXp = pet.xp + gainedXp;
    const nextPetLevel = 1 + Math.floor(nextTotalXp / 100);
    onUpdatePet({
      ...pet,
      xp: nextTotalXp,
      level: nextPetLevel,
    });

    recordStreakActivity();
  }, [pet, onUpdatePet]);

  // Start Match
  const startMatch = () => {
    const rival = generateRivalForRound(1);
    setIsPlaying(true);
    setIsGameOver(false);
    setIsPaused(false);
    setRoundNumber(1);
    setTotalWins(0);
    setCurrentRival(rival);
    setPlayerHp(100);
    setSuperMeter(0);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setErrorKeystrokes(0);
    setElapsedSec(0);
    setOpponentAttackProgress(0);
    setBannerNotice('⚡ 1v1 SOLID ACTION FIGHT! TYPE TO CLASH!');

    const { item, prompt } = getNextAction();
    setCurrentAction(item);
    setCurrentPrompt(prompt);
    setTypedInput('');
    setLastFighterMove(item.name);

    playerRef.current = { x: 230, y: 275, baseX: 230, vx: 0, vy: 0, facing: 1, move: 'idle', animTimer: 0, animFrame: 0 };
    opponentRef.current = { x: 570, y: 275, baseX: 570, vx: 0, vy: 0, facing: -1, move: 'idle', animTimer: 0, animFrame: 0 };

    projectilesRef.current = [];
    ghostShadowsRef.current = [];
    hitSparksRef.current = [];
    slashArcsRef.current = [];
    floatingTextsRef.current = [];
    shockwavesRef.current = [];
    dustParticlesRef.current = [];
    localHeatmapRef.current = {};
    startTimeRef.current = Date.now();

    soundEngine.playLevelUp();
  };

  // End Game on Player K.O.
  const endMatch = useCallback((victory: boolean) => {
    setIsPlaying(false);
    setIsGameOver(true);

    if (victory) {
      soundEngine.playLevelUp();
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    } else {
      soundEngine.playError();
      playerRef.current.move = 'knockdown';
      playerRef.current.animTimer = 100;
    }

    const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const session: HistorySession = {
      id: `duel-${Date.now()}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'stickman',
      difficulty: 'knight',
      wpm: currentWpm,
      accuracy,
      score,
      durationSeconds: duration,
      wordsCount: Math.round(correctKeystrokes / 4),
    };

    onSessionComplete(session, localHeatmapRef.current);
  }, [score, currentWpm, accuracy, correctKeystrokes, onSessionComplete]);

  // Execute Solid Action Strike (Heavy 1v1 Impact between the 2 Characters)
  const executeSolidActionStrike = (actionDef: ActionMoveDefinition, isWordComplete: boolean) => {
    const p = playerRef.current;
    const opp = opponentRef.current;

    // Motion shadow trail
    ghostShadowsRef.current.push({
      x: p.x,
      y: p.y,
      move: p.move,
      facing: p.facing,
      color: actionDef.color,
      alpha: 0.8,
    });

    const move = actionDef.id;
    p.move = move;
    p.animTimer = isWordComplete ? 24 : 12;
    setLastFighterMove(actionDef.name);

    if (isWordComplete) {
      // MASSIVE SOLID FINISHER ATTACK
      const hitDamage = actionDef.damage + Math.floor(combo * 1.2);

      if (move === 'dragon-uppercut') {
        p.x = opp.x - 45;
        p.vy = -10;
        soundEngine.playPunch();
        soundEngine.playComboKO();
        opp.move = 'juggle-air';
        opp.animTimer = 28;
        opp.vx = 8;
        opp.vy = -18;
        triggerHeavyImpact(opp.x, opp.y - 45, '#EF4444', true);
        addCombatPopup(opp.x, opp.y - 75, `🌋 ${actionDef.name}! -${hitDamage}`, '#EF4444', 22);
      } else if (move === 'katana-cleave' || move === 'dual-blade-x') {
        p.x = opp.x - 52;
        slashArcsRef.current.push({
          x: opp.x,
          y: opp.y - 35,
          radius: 60,
          startAngle: -Math.PI * 0.9,
          endAngle: Math.PI * 0.45,
          color: actionDef.color,
          width: 8,
          alpha: 1,
          life: 0,
          maxLife: 16,
        });
        soundEngine.playSwordSlash();
        opp.move = 'wall-bounce';
        opp.animTimer = 22;
        opp.vx = 14;
        triggerHeavyImpact(opp.x, opp.y - 35, actionDef.color, true);
        addCombatPopup(opp.x, opp.y - 55, `🗡️ ${actionDef.name}! -${hitDamage}`, actionDef.color, 21);
      } else if (move === 'hadouken-beam') {
        soundEngine.playSpecialBlast();
        projectilesRef.current.push({
          id: Date.now() + Math.random(),
          x: p.x + 35,
          y: p.y - 35,
          vx: 20,
          radius: 18,
          color: '#38BDF8',
          glowColor: '#0284C7',
          tailLength: 40,
          isPlayer: true,
        });
        addCombatPopup(opp.x, opp.y - 55, `🔥 ${actionDef.name}! -${hitDamage}`, '#38BDF8', 21);
      } else if (move === 'hurricane-kick' || move === 'axe-slam' || move === 'flying-knee') {
        p.x = opp.x - 48;
        p.vy = -6;
        soundEngine.playKick();
        opp.move = 'juggle-air';
        opp.animTimer = 24;
        opp.vx = 15;
        opp.vy = -12;
        triggerHeavyImpact(opp.x, opp.y - 35, actionDef.color, true);
        addCombatPopup(opp.x, opp.y - 55, `${actionDef.icon} ${actionDef.name}! -${hitDamage}`, actionDef.color, 21);
      } else if (move === 'block-counter' || move === 'ninja-flip') {
        p.x = p.baseX - 35;
        soundEngine.playLevelUp();
        addCombatPopup(p.x, p.y - 55, `🛡️ PERFECT PARRY! (Timer Reset)`, '#34D399', 19);
        setOpponentAttackProgress(0); // Fully reset rival attack countdown!
      } else {
        // Heavy Cross / Fury Barrage
        p.x = opp.x - 45;
        soundEngine.playPunch();
        opp.move = 'hurt';
        opp.animTimer = 18;
        opp.vx = 10;
        triggerHeavyImpact(opp.x, opp.y - 35, actionDef.color, true);
        addCombatPopup(opp.x, opp.y - 45, `${actionDef.icon} ${actionDef.name}! -${hitDamage}`, actionDef.color, 20);
      }

      // Damage rival
      setCurrentRival((prev) => {
        const nextHp = Math.max(0, prev.currentHp - hitDamage);
        if (nextHp <= 0) {
          // Rival K.O.! Advance to next rival seamlessly!
          setTimeout(() => {
            advanceToNextRound(roundNumber + 1);
          }, 240);
        }
        return {
          ...prev,
          currentHp: nextHp,
        };
      });

      setScore((s) => s + 70 + combo * 12);
      setSuperMeter((m) => Math.min(100, m + 22));
      setOpponentAttackProgress((prev) => Math.max(0, prev - 40)); // Push back rival attack bar

      // Prompt Next Solid Action Word
      setTimeout(() => {
        const { item, prompt } = getNextAction();
        setCurrentAction(item);
        setCurrentPrompt(prompt);
        setTypedInput('');
      }, 90);
    } else {
      // Individual letter clash (Fast solid contact)
      p.x = opp.x - 44;
      soundEngine.playKeySwitch(switchType);
      opp.move = 'hurt';
      opp.animTimer = 8;
      triggerHeavyImpact(opp.x, opp.y - 32, '#64748B', false);
    }
  };

  // Execute Opponent Counter Strike
  const executeOpponentAttack = useCallback(() => {
    const p = playerRef.current;
    const opp = opponentRef.current;

    ghostShadowsRef.current.push({
      x: opp.x,
      y: opp.y,
      move: opp.move,
      facing: opp.facing,
      color: currentRival.color,
      alpha: 0.75,
    });

    opp.x = p.x + 45;
    opp.move = 'hurricane-kick';
    opp.animTimer = 22;

    p.move = 'wall-bounce';
    p.animTimer = 20;
    p.vx = -12;
    p.vy = -6;

    soundEngine.playBossHit();
    triggerHeavyImpact(p.x, p.y - 35, currentRival.color, true);

    const dmg = currentRival.attackDmg;
    addCombatPopup(p.x, p.y - 55, `⚡ ${currentRival.specialMoveName}! -${dmg} HP`, '#F43F5E', 21);

    setPlayerHp((prev) => {
      const next = Math.max(0, prev - dmg);
      if (next <= 0) {
        setTimeout(() => endMatch(false), 300);
      }
      return next;
    });

    setCombo(0);
    setOpponentAttackProgress(0);
  }, [currentRival, endMatch]);

  // Opponent Attack Progress Loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) return;

    const intervalMs = 100;
    const totalTicks = (currentRival.attackSpeedSec * 1000) / intervalMs;
    const progressPerTick = 100 / totalTicks;

    attackIntervalRef.current = setInterval(() => {
      setOpponentAttackProgress((prev) => {
        const next = prev + progressPerTick;
        if (next >= 100) {
          executeOpponentAttack();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (attackIntervalRef.current) clearInterval(attackIntervalRef.current);
    };
  }, [isPlaying, isGameOver, isPaused, currentRival, executeOpponentAttack]);

  // Elapsed Timer
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    gameTimerRef.current = setInterval(() => {
      setElapsedSec((s) => {
        const next = s + 1;
        const minutes = next / 60;
        if (minutes > 0) {
          const words = correctKeystrokes / 4;
          setCurrentWpm(Math.round(words / minutes));
        }
        return next;
      });
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying, isPaused, correctKeystrokes]);

  // Keystroke Input Handler (Pure solid 1v1 action!)
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Backspace') {
        e.preventDefault();
      }

      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }

      const keyChar = e.key.toLowerCase();
      if (!keyChar || keyChar.length !== 1) return;

      localHeatmapRef.current[keyChar] = localHeatmapRef.current[keyChar] || { presses: 0, errors: 0 };
      localHeatmapRef.current[keyChar].presses += 1;
      setTotalKeystrokes((t) => t + 1);

      const targetChar = currentPrompt[typedInput.length]?.toLowerCase();

      if (keyChar === targetChar) {
        // CORRECT KEY PRESS
        const nextInput = typedInput + currentPrompt[typedInput.length];
        setTypedInput(nextInput);
        setCorrectKeystrokes((c) => c + 1);

        setCombo((c) => {
          const next = c + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });

        const isWordFinished = nextInput.length >= currentPrompt.length;
        executeSolidActionStrike(currentAction, isWordFinished);
      } else {
        // TYPO
        setErrorKeystrokes((err) => err + 1);
        localHeatmapRef.current[keyChar].errors += 1;
        soundEngine.playError();
        setCombo(0);
      }

      setAccuracy(() => {
        const total = totalKeystrokes + 1;
        const correct = correctKeystrokes + 1;
        return Math.max(0, Math.round((correct / total) * 100));
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, isPaused, currentPrompt, currentAction, typedInput, totalKeystrokes, correctKeystrokes, combo]);

  // Direct Click-To-Strike
  const handleClickStrike = (actionMove?: ActionMoveDefinition) => {
    if (!isPlaying || isGameOver || isPaused) return;
    executeSolidActionStrike(actionMove || currentAction, true);
  };

  // Unleash 100-Fist Super Move
  const activateSuperMove = () => {
    if (superMeter < 100 || !isPlaying || isGameOver) return;
    setSuperMeter(0);

    const p = playerRef.current;
    const opp = opponentRef.current;

    soundEngine.playSpecialBlast();
    soundEngine.playComboKO();
    screenShakeRef.current = 25;
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });

    p.move = 'fury-100-fist';
    p.animTimer = 36;
    p.x = opp.x - 50;

    opp.move = 'juggle-air';
    opp.animTimer = 36;
    opp.vx = 18;
    opp.vy = -18;

    const superDmg = 75;
    addCombatPopup(opp.x, opp.y - 75, '⚡ 100-FIST DRAGON OMNI-SLASH! -75', '#EC4899', 24);
    triggerHeavyImpact(opp.x, opp.y - 35, '#EC4899', true);

    setCurrentRival((prev) => {
      const next = Math.max(0, prev.currentHp - superDmg);
      if (next <= 0) {
        setTimeout(() => advanceToNextRound(roundNumber + 1), 240);
      }
      return { ...prev, currentHp: next };
    });

    setScore((s) => s + 450);
    setOpponentAttackProgress(0);
  };

  // DRAW THICK SOLID SKELETAL 2D STICKMAN (High-Impact Articulation)
  const drawSolidStickman = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    facing: number,
    move: SolidActionMove,
    color: string,
    isHero: boolean,
    animFrame: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5.2; // Thick solid stick lines
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const bounce = Math.sin(animFrame * 0.18) * 3.5;
    const breathe = Math.sin(animFrame * 0.12) * 2;

    // HEAD
    ctx.beginPath();
    ctx.arc(0, -66 + (move === 'idle' ? bounce : 0), 14, 0, Math.PI * 2);
    ctx.fill();

    // HEAD ACCENT
    if (isHero) {
      // Dynamic Waving Cyan Headband Ribbons
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.moveTo(-10, -66 + (move === 'idle' ? bounce : 0));
      ctx.lineTo(12, -66 + (move === 'idle' ? bounce : 0));
      const ribbonWave1 = Math.sin(animFrame * 0.3) * 8;
      const ribbonWave2 = Math.cos(animFrame * 0.25) * 6;
      ctx.moveTo(-10, -66 + (move === 'idle' ? bounce : 0));
      ctx.quadraticCurveTo(-24, -60 + ribbonWave1, -38, -54 + ribbonWave1);
      ctx.moveTo(-10, -64 + (move === 'idle' ? bounce : 0));
      ctx.quadraticCurveTo(-22, -52 + ribbonWave2, -34, -44 + ribbonWave2);
      ctx.stroke();

      // Glowing Cyan Eyes
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(6, -66 + (move === 'idle' ? bounce : 0), 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Rival War Mask / Spikes
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-8, -78);
      ctx.lineTo(-15, -92);
      ctx.moveTo(8, -78);
      ctx.lineTo(15, -92);
      ctx.stroke();

      // Glowing Crimson Rival Eyes
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(5, -66, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // SPINE / TORSO
    ctx.strokeStyle = color;
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(0, -52 + (move === 'idle' ? bounce : 0));
    ctx.lineTo(0, -16 + (move === 'idle' ? breathe : 0));
    ctx.stroke();

    // MARTIAL ARTS ACTION KEYFRAMES
    if (move === 'jab') {
      // Lead Straight Punch
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-14, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(16, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(22, -46);
      ctx.lineTo(46, -46);
      ctx.moveTo(0, -44);
      ctx.lineTo(-12, -36);
      ctx.lineTo(-8, -50);
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(48, -46, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (move === 'cross') {
      // Heavy Cross
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-18, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(20, 0);
      ctx.stroke();

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(24, -42);
      ctx.lineTo(54, -42);
      ctx.stroke();

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(-16, -34);
      ctx.lineTo(-12, -50);
      ctx.stroke();

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(56, -42, 11, 0, Math.PI * 2);
      ctx.fill();
    } else if (move === 'dragon-uppercut') {
      // Rising Dragon Uppercut
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(-12, -4);
      ctx.moveTo(0, -22);
      ctx.lineTo(12, 0);
      ctx.stroke();

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(14, -62);
      ctx.lineTo(22, -90);
      ctx.stroke();

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(-18, -34);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(22, -92, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (move === 'hurricane-kick' || move === 'flying-knee') {
      // High Hurricane Kick
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(26, -38);
      ctx.lineTo(56, -40);
      ctx.moveTo(0, -28);
      ctx.lineTo(18, -50);
      ctx.lineTo(38, -54);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(-18, -44);
      ctx.lineTo(-28, -34);
      ctx.moveTo(0, -50);
      ctx.lineTo(-14, -60);
      ctx.stroke();

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(32, -40);
      ctx.lineTo(60, -40);
      ctx.stroke();
    } else if (move === 'axe-slam') {
      // Meteor Axe Kick
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-12, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(18, -70);
      ctx.lineTo(30, -82);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(-18, -34);
      ctx.moveTo(0, -44);
      ctx.lineTo(14, -36);
      ctx.stroke();
    } else if (move === 'katana-cleave' || move === 'dual-blade-x') {
      // Katana Blade Draw
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-18, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(18, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(20, -46);
      ctx.lineTo(34, -50);
      ctx.stroke();

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(34, -50);
      ctx.lineTo(68, -72);
      ctx.stroke();

      if (move === 'dual-blade-x') {
        ctx.strokeStyle = '#06B6D4';
        ctx.beginPath();
        ctx.moveTo(20, -46);
        ctx.lineTo(58, -22);
        ctx.stroke();
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(68, -72, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (move === 'hadouken-beam' || move === 'fury-100-fist') {
      // Fireball Beam / Hyper Stance
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-20, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(16, 0);
      ctx.stroke();

      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(24, -40);
      ctx.lineTo(40, -40);
      ctx.moveTo(0, -40);
      ctx.lineTo(24, -36);
      ctx.lineTo(40, -36);
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(44, -38, 15, 0, Math.PI * 2);
      ctx.fill();
    } else if (move === 'block-counter') {
      // Shield Defense
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-16, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(14, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(18, -50);
      ctx.lineTo(18, -28);
      ctx.moveTo(0, -44);
      ctx.lineTo(12, -50);
      ctx.lineTo(12, -28);
      ctx.stroke();

      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.arc(28, -40, 30, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    } else if (move === 'hurt') {
      // Flinch from Hit
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(-22, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(10, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(-22, -54);
      ctx.moveTo(0, -44);
      ctx.lineTo(-10, -30);
      ctx.stroke();
    } else if (move === 'juggle-air' || move === 'wall-bounce') {
      // Knocked Airborne
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(-20, -10);
      ctx.moveTo(0, -24);
      ctx.lineTo(20, -10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -46);
      ctx.lineTo(-18, -64);
      ctx.moveTo(0, -46);
      ctx.lineTo(18, -64);
      ctx.stroke();
    } else if (move === 'knockdown') {
      // Down on Ground
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-30, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(25, 0);
      ctx.stroke();
    } else {
      // IDLE BOUNCING SOLID FIGHTING STANCE
      ctx.beginPath();
      ctx.moveTo(0, -16 + bounce);
      ctx.lineTo(-14, 0);
      ctx.moveTo(0, -16 + bounce);
      ctx.lineTo(16, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -44 + bounce);
      ctx.lineTo(18, -48 + bounce);
      ctx.lineTo(16, -58 + bounce);
      ctx.moveTo(0, -44 + bounce);
      ctx.lineTo(-10, -38 + bounce);
      ctx.lineTo(-6, -50 + bounce);
      ctx.stroke();
    }

    ctx.restore();
  };

  // 60 FPS Render Loop (2 Characters Solid Stage)
  useEffect(() => {
    if (!isPlaying && !isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameCount = 0;

    const render = () => {
      animFrameCount += 1;

      if (hitFreezeRef.current > 0) {
        hitFreezeRef.current -= 1;
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.save();

      // Screen Shake
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 0.8);
      }

      // 2D STAGE BACKGROUND
      if (arena === 'dojo') {
        const grad = ctx.createLinearGradient(0, 0, 0, 360);
        grad.addColorStop(0, '#0a0e1a');
        grad.addColorStop(0.7, '#131f37');
        grad.addColorStop(1, '#070b14');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 360);

        ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.lineWidth = 2;
        for (let x = 40; x < 800; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 20);
          ctx.lineTo(x, 275);
          ctx.stroke();
        }
        for (let y = 40; y < 275; y += 40) {
          ctx.beginPath();
          ctx.moveTo(20, y);
          ctx.lineTo(780, y);
          ctx.stroke();
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(400, 145, 70, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 275, 800, 85);
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(0, 275);
        ctx.lineTo(800, 275);
        ctx.stroke();
      } else if (arena === 'rooftop') {
        const grad = ctx.createLinearGradient(0, 0, 0, 360);
        grad.addColorStop(0, '#040711');
        grad.addColorStop(0.8, '#1e1035');
        grad.addColorStop(1, '#090514');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 360);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(60, 60, 90, 220);
        ctx.fillRect(190, 90, 80, 190);
        ctx.fillRect(320, 40, 120, 240);
        ctx.fillRect(500, 80, 90, 200);
        ctx.fillRect(640, 110, 100, 170);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 275, 800, 85);
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(0, 275);
        ctx.lineTo(800, 275);
        ctx.stroke();
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, 360);
        grad.addColorStop(0, '#1c0a0a');
        grad.addColorStop(0.7, '#451212');
        grad.addColorStop(1, '#150606');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 360);

        ctx.fillStyle = '#450a0a';
        ctx.fillRect(0, 275, 800, 85);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(0, 275);
        ctx.lineTo(800, 275);
        ctx.stroke();
      }

      // EXACTLY 2 CHARACTERS (Player & Rival)
      const p = playerRef.current;
      const opp = opponentRef.current;

      p.x += (p.baseX - p.x) * 0.18;
      opp.x += (opp.baseX - opp.x) * 0.18;

      if (opp.move === 'juggle-air' || opp.move === 'wall-bounce') {
        opp.x += opp.vx;
        opp.y += opp.vy;
        opp.vy += 0.85;
        if (opp.y >= 275) {
          opp.y = 275;
          opp.vy = 0;
          opp.vx = 0;
        }
      }

      if (p.move === 'wall-bounce' && p.vy < 0) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.85;
        if (p.y >= 275) {
          p.y = 275;
          p.vy = 0;
          p.vx = 0;
        }
      }

      // Rival landing drop
      if (opp.y < 275 && opp.move !== 'juggle-air') {
        opp.y += opp.vy;
        opp.vy += 0.95;
        if (opp.y >= 275) {
          opp.y = 275;
          opp.vy = 0;
          triggerHeavyImpact(opp.x, 275, currentRival.color, false);
        }
      }

      if (p.animTimer > 0) {
        p.animTimer -= 1;
        if (p.animTimer <= 0) p.move = 'idle';
      }
      if (opp.animTimer > 0) {
        opp.animTimer -= 1;
        if (opp.animTimer <= 0) opp.move = 'idle';
      }

      // Draw Motion Ghost Shadows
      const nextGhosts: GhostShadow[] = [];
      ghostShadowsRef.current.forEach((g) => {
        g.alpha -= 0.08;
        if (g.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = g.alpha;
          drawSolidStickman(ctx, g.x, g.y, g.facing, g.move, g.color, true, animFrameCount);
          ctx.restore();
          nextGhosts.push(g);
        }
      });
      ghostShadowsRef.current = nextGhosts;

      // Draw CHARACTER 1: Player Hero (White/Cyan)
      drawSolidStickman(ctx, p.x, p.y, p.facing, p.move, '#FFFFFF', true, animFrameCount);

      // Draw CHARACTER 2: Rival Boss (Custom Color)
      drawSolidStickman(ctx, opp.x, opp.y, opp.facing, opp.move, currentRival.color, false, animFrameCount);

      // Draw Flying Energy Projectiles
      const nextProjectiles: Projectile[] = [];
      projectilesRef.current.forEach((proj) => {
        proj.x += proj.vx;

        ctx.save();
        ctx.shadowColor = proj.glowColor;
        ctx.shadowBlur = 20;
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = proj.glowColor;
        ctx.lineWidth = proj.radius * 1.2;
        ctx.beginPath();
        ctx.moveTo(proj.x - proj.tailLength, proj.y);
        ctx.lineTo(proj.x, proj.y);
        ctx.stroke();
        ctx.restore();

        if (proj.x >= opp.x - 20) {
          triggerHeavyImpact(opp.x, opp.y - 35, proj.color, true);
          soundEngine.playBossHit();
          opp.move = 'juggle-air';
          opp.animTimer = 24;
          opp.vx = 14;
          opp.vy = -12;
        } else {
          nextProjectiles.push(proj);
        }
      });
      projectilesRef.current = nextProjectiles;

      // Draw Slash Arcs
      const nextArcs: SlashArc[] = [];
      slashArcsRef.current.forEach((s) => {
        s.life += 1;
        const prog = 1 - s.life / s.maxLife;

        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = prog;
        ctx.lineWidth = s.width || 7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, s.startAngle, s.endAngle);
        ctx.stroke();
        ctx.restore();

        if (s.life < s.maxLife) nextArcs.push(s);
      });
      slashArcsRef.current = nextArcs;

      // Draw Shockwaves
      const nextShockwaves: Shockwave[] = [];
      shockwavesRef.current.forEach((w) => {
        w.radius += 5;
        w.alpha = 1 - w.radius / w.maxRadius;

        ctx.save();
        ctx.strokeStyle = w.color;
        ctx.globalAlpha = Math.max(0, w.alpha);
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(w.x, 275, w.radius, w.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (w.radius < w.maxRadius) nextShockwaves.push(w);
      });
      shockwavesRef.current = nextShockwaves;

      // Draw Dust Particles
      const nextDust: DustParticle[] = [];
      dustParticlesRef.current.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.alpha -= 0.04;

        if (d.alpha > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(148, 163, 184, ${d.alpha})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          nextDust.push(d);
        }
      });
      dustParticlesRef.current = nextDust;

      // Draw Hit Sparks
      const nextSparks: HitSpark[] = [];
      hitSparksRef.current.forEach((sp) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life += 1;
        const prog = 1 - sp.life / sp.maxLife;

        ctx.save();
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = prog;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * prog, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (sp.life < sp.maxLife) nextSparks.push(sp);
      });
      hitSparksRef.current = nextSparks;

      // Draw Damage & Move Popups
      const nextTexts: FloatingCombatText[] = [];
      floatingTextsRef.current.forEach((t) => {
        t.y -= 1.5;
        t.life += 1;
        const prog = 1 - t.life / t.maxLife;

        ctx.save();
        ctx.fillStyle = t.color;
        ctx.globalAlpha = prog;
        ctx.font = `bold ${t.size}px monospace`;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();

        if (t.life < t.maxLife) nextTexts.push(t);
      });
      floatingTextsRef.current = nextTexts;

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isGameOver, arena, currentRival]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 select-none animate-in fade-in duration-300">
      {/* 2-CHARACTER 1v1 SOLID BRAWLER HUD */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
        {/* Round Header & Wins */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono font-bold">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white rounded-lg text-xs font-black shadow-md shadow-red-500/20 font-display">
              🥋 ROUND {roundNumber}
            </span>
            <span className="text-cyan-400">WINS: <strong className="text-white">{totalWins}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">COMBO: <strong className="text-white">{combo}x</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold hidden sm:inline">{bannerNotice}</span>
            {isPlaying && (
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg transition-colors cursor-pointer"
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
          </div>
        </div>

        {/* 1v1 Life Bars: Player 1 (Left) vs Rival Boss (Right) */}
        <div className="grid grid-cols-11 items-center gap-3">
          {/* Player 1 Health (Left) */}
          <div className="col-span-5 flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span>🥋</span> PLAYER 1 (HERO)
              </span>
              <span className="text-white font-mono">{playerHp}%</span>
            </div>
            <div className="w-full bg-slate-950 h-5 rounded-lg border border-slate-700 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_15px_#10b981] transition-all duration-200"
                style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Center VS Crest & Timer */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <span className="text-sm font-extrabold font-display text-amber-400 bg-slate-950 border border-amber-500/40 rounded-full w-9 h-9 flex items-center justify-center shadow-lg shadow-amber-500/20">
              VS
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-0.5">{elapsedSec}s</span>
          </div>

          {/* Player 2 Opponent Health (Right) */}
          <div className="col-span-5 flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-rose-400">{currentRival.currentHp} / {currentRival.maxHp} HP</span>
              <span className="text-rose-400 flex items-center gap-1.5">
                {currentRival.name} <span>{currentRival.avatar}</span>
              </span>
            </div>
            <div className="w-full bg-slate-950 h-5 rounded-lg border border-slate-700 overflow-hidden relative flex justify-end">
              <div
                className="h-full bg-gradient-to-l from-rose-600 via-red-500 to-amber-500 shadow-[0_0_15px_#ef4444] transition-all duration-200"
                style={{ width: `${(currentRival.currentHp / currentRival.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Super Gauge & Opponent Attack Bar */}
        <div className="grid grid-cols-2 gap-6 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
          {/* Player Dragon Super Meter */}
          <div className="flex items-center gap-3">
            <span className="text-pink-400 font-bold shrink-0">⚡ DRAGON SUPER:</span>
            <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_12px_#ec4899] transition-all duration-150"
                style={{ width: `${superMeter}%` }}
              />
            </div>
            {superMeter >= 100 && (
              <button
                onClick={activateSuperMove}
                className="px-2.5 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-[10px] rounded animate-bounce shadow-[0_0_15px_#ec4899] cursor-pointer"
              >
                UNLEASH!
              </button>
            )}
          </div>

          {/* Opponent Attack Warning Countdown Bar */}
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold shrink-0">⚠️ RIVAL STRIKE:</span>
            <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-100 ${
                  opponentAttackProgress > 75
                    ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'
                    : 'bg-gradient-to-r from-cyan-500 to-amber-400'
                }`}
                style={{ width: `${opponentAttackProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{Math.round(opponentAttackProgress)}%</span>
          </div>
        </div>
      </div>

      {/* Main 2-Character Battle Stage (Canvas with Click-To-Strike) */}
      <div
        onClick={() => handleClickStrike()}
        className="relative w-full aspect-[800/360] bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl cursor-crosshair group"
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={360}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Current Move Badge (Top Right) */}
        {isPlaying && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="text-base">{currentAction.icon}</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Solid Move</span>
              <span className="text-xs font-bold text-cyan-300 font-display">
                {lastFighterMove}
              </span>
            </div>
          </div>
        )}

        {/* Live Action Prompt Banner (Floating Center) */}
        {isPlaying && !isGameOver && currentPrompt && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3.5 py-1 bg-slate-900/90 border border-cyan-400/50 rounded-full text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/20 backdrop-blur-md">
              <span className="text-sm">{currentAction.icon}</span>
              <span className="uppercase tracking-wide">{currentAction.name}</span>
            </div>

            <div className="px-8 py-3 bg-slate-950/95 border-2 border-cyan-400 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.6)] backdrop-blur-md flex items-center gap-1 font-mono text-3xl sm:text-4xl font-extrabold tracking-widest">
              <span className="text-emerald-400">{typedInput}</span>
              <span className="text-amber-400 underline decoration-cyan-400 decoration-4">
                {currentPrompt.slice(typedInput.length)}
              </span>
            </div>

            <span className="text-[11px] font-mono text-cyan-200 font-bold uppercase tracking-widest bg-slate-900/90 px-3 py-0.5 rounded-full border border-cyan-500/40">
              Type or Click to Clash · Next Key: [{currentPrompt[typedInput.length]?.toUpperCase() || '—'}]
            </span>
          </div>
        )}

        {/* Start Game Setup Screen */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/30 via-orange-500/30 to-amber-500/30 border-2 border-red-500/60 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(239,68,68,0.4)] mb-3 animate-pulse">
              🥋
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              KEYBOARD WARRIOR: 2-CHARACTER ACTION BRAWLER
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-1 mb-4">
              Solid 1v1 stickman martial arts combat! Type single action words or click to unleash heavy dragon uppercuts, katana cleaves, hurricane spin kicks, and seismic slams.
            </p>

            {/* Word Mode Selection */}
            <div className="flex items-center gap-2 mb-4 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setWordMode('single-action-words')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  wordMode === 'single-action-words'
                    ? 'bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 shadow-md shadow-red-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡</span> Single Action Words (HIT, PUNCH, KICK, SLASH)
              </button>
              <button
                onClick={() => setWordMode('single-keys')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  wordMode === 'single-keys'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎯</span> 1-Key Tap Mode (F, J, D, K)
              </button>
            </div>

            {/* Arena Selector */}
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={() => setArena('dojo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  arena === 'dojo' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                🥋 Cyber Dojo
              </button>
              <button
                onClick={() => setArena('rooftop')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  arena === 'rooftop' ? 'bg-pink-500/20 text-pink-300 border-pink-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                🌆 Neon Rooftops
              </button>
              <button
                onClick={() => setArena('volcano')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  arena === 'volcano' ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                🌋 Volcano Temple
              </button>
            </div>

            <button
              onClick={startMatch}
              className="px-8 py-3.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-extrabold rounded-2xl text-base shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95 font-display tracking-wide flex items-center gap-2"
            >
              <span>START SOLID 1v1 FIGHT! ⚔️</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center">
            <span className="text-5xl mb-2">💀</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight font-display">
              FIGHT OVER - REACHED ROUND {roundNumber}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              You won <strong className="text-amber-400">{totalWins} Duels</strong> against elite stickman masters!
            </p>

            <div className="grid grid-cols-4 gap-3 my-5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs w-full max-w-md">
              <div>
                <span className="text-slate-400">Total Wins</span>
                <p className="text-xl font-bold font-mono text-amber-400">{totalWins}</p>
              </div>
              <div>
                <span className="text-slate-400">Score</span>
                <p className="text-xl font-bold font-mono text-cyan-400">{score}</p>
              </div>
              <div>
                <span className="text-slate-400">Speed</span>
                <p className="text-xl font-bold font-mono text-emerald-400">{currentWpm} WPM</p>
              </div>
              <div>
                <span className="text-slate-400">Max Combo</span>
                <p className="text-xl font-bold font-mono text-pink-400">{maxCombo}x</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startMatch}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/30 cursor-pointer"
              >
                Rematch / Play Again ⚔️
              </button>
              {onOpenTraining && (
                <button
                  onClick={onOpenTraining}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Return to Lessons
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quick Action Strike Triggers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span> Direct Move Clash (Click to Execute):
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            {SOLID_ACTION_MOVES.length} Martial Arts Moves Active
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SOLID_ACTION_MOVES.slice(0, 10).map((m) => (
            <button
              key={m.id}
              onClick={() => handleClickStrike(m)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{m.icon}</span>
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Combat Stats & Companion Support */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <span>Speed: <strong className="text-cyan-400">{currentWpm} WPM</strong></span>
          <span>·</span>
          <span>Combo: <strong className="text-amber-400">{combo}x</strong></span>
          <span>·</span>
          <span>Score: <strong className="text-emerald-400">{score}</strong></span>
          <span>·</span>
          <span>Round Wins: <strong className="text-pink-400">{totalWins}</strong></span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
          <span>🐾 Companion Support:</span>
          <span className="font-bold">{pet.name} (Lv.{pet.level})</span>
        </div>
      </div>
    </div>
  );
};
