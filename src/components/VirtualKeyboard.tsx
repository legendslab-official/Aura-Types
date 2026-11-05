import React, { useState, useEffect } from 'react';
import { KeyboardTheme, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import leftHandImg from '../assets/images/real_left_hand_typing_correct_1790594641983.jpg';
import rightHandImg from '../assets/images/photo_realistic_right_hand_1790593645749.jpg';

interface VirtualKeyboardProps {
  theme: KeyboardTheme;
  activeKeys: Set<string>;
  nextKeyToPress?: string;
  showFingerGuides?: boolean;
  appLanguage?: AppLanguage;
  onKeyClick?: (char: string) => void;
}

interface KeyDef {
  key: string;
  label: string;
  shiftLabel?: string;
  width?: string;
  finger: string;
  fingerIndex: number; // 0..4 left hand, 5..9 right hand
  fingerName: string;
  fingerColor: string;
  home?: boolean;
  bump?: boolean;
}

// Complete 5-Row Standard Mechanical Keyboard Layout
const KEY_LAYOUT: KeyDef[][] = [
  // ROW 0: Number & Function Symbols Row (1 2 3 4 5 6 7 8 9 0 - =)
  [
    { key: '`', label: '`', shiftLabel: '~', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: '1', label: '1', shiftLabel: '!', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: '2', label: '2', shiftLabel: '@', finger: 'l-ring', fingerIndex: 1, fingerName: 'Left Ring', fingerColor: 'bg-blue-500' },
    { key: '3', label: '3', shiftLabel: '#', finger: 'l-mid', fingerIndex: 2, fingerName: 'Left Middle', fingerColor: 'bg-teal-500' },
    { key: '4', label: '4', shiftLabel: '$', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: '5', label: '5', shiftLabel: '%', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: '6', label: '6', shiftLabel: '^', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: '7', label: '7', shiftLabel: '&', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: '8', label: '8', shiftLabel: '*', finger: 'r-mid', fingerIndex: 7, fingerName: 'Right Middle', fingerColor: 'bg-teal-500' },
    { key: '9', label: '9', shiftLabel: '(', finger: 'r-ring', fingerIndex: 8, fingerName: 'Right Ring', fingerColor: 'bg-blue-500' },
    { key: '0', label: '0', shiftLabel: ')', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: '-', label: '-', shiftLabel: '_', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: '=', label: '=', shiftLabel: '+', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: 'Backspace', label: 'DEL ⌫', width: 'w-12 sm:w-14 md:w-18', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
  ],
  // ROW 1: Top Letter Row (Q W E R T Y U I O P)
  [
    { key: 'Tab', label: 'TAB ⇥', width: 'w-11 sm:w-13 md:w-15', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: 'q', label: 'Q', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: 'w', label: 'W', finger: 'l-ring', fingerIndex: 1, fingerName: 'Left Ring', fingerColor: 'bg-blue-500' },
    { key: 'e', label: 'E', finger: 'l-mid', fingerIndex: 2, fingerName: 'Left Middle', fingerColor: 'bg-teal-500' },
    { key: 'r', label: 'R', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: 't', label: 'T', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: 'y', label: 'Y', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: 'u', label: 'U', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: 'i', label: 'I', finger: 'r-mid', fingerIndex: 7, fingerName: 'Right Middle', fingerColor: 'bg-teal-500' },
    { key: 'o', label: 'O', finger: 'r-ring', fingerIndex: 8, fingerName: 'Right Ring', fingerColor: 'bg-blue-500' },
    { key: 'p', label: 'P', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: '[', label: '[', shiftLabel: '{', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: ']', label: ']', shiftLabel: '}', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: '\\', label: '\\', shiftLabel: '|', width: 'w-9 sm:w-11', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
  ],
  // ROW 2: Home Row (A S D F G H J K L ;)
  [
    { key: 'CapsLock', label: 'CAPS ⇪', width: 'w-12 sm:w-14 md:w-16', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: 'a', label: 'A', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500', home: true },
    { key: 's', label: 'S', finger: 'l-ring', fingerIndex: 1, fingerName: 'Left Ring', fingerColor: 'bg-blue-500', home: true },
    { key: 'd', label: 'D', finger: 'l-mid', fingerIndex: 2, fingerName: 'Left Middle', fingerColor: 'bg-teal-500', home: true },
    { key: 'f', label: 'F', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500', home: true, bump: true },
    { key: 'g', label: 'G', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: 'h', label: 'H', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: 'j', label: 'J', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500', home: true, bump: true },
    { key: 'k', label: 'K', finger: 'r-mid', fingerIndex: 7, fingerName: 'Right Middle', fingerColor: 'bg-teal-500', home: true },
    { key: 'l', label: 'L', finger: 'r-ring', fingerIndex: 8, fingerName: 'Right Ring', fingerColor: 'bg-blue-500', home: true },
    { key: ';', label: ';', shiftLabel: ':', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500', home: true },
    { key: "'", label: "'", shiftLabel: '"', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: 'Enter', label: 'ENTER ↵', width: 'w-14 sm:w-18 md:w-21', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
  ],
  // ROW 3: Bottom Row (Z X C V B N M , . /)
  [
    { key: 'Shift', label: 'SHIFT ⇧', width: 'w-14 sm:w-18 md:w-21', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: 'z', label: 'Z', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: 'x', label: 'X', finger: 'l-ring', fingerIndex: 1, fingerName: 'Left Ring', fingerColor: 'bg-blue-500' },
    { key: 'c', label: 'C', finger: 'l-mid', fingerIndex: 2, fingerName: 'Left Middle', fingerColor: 'bg-teal-500' },
    { key: 'v', label: 'V', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: 'b', label: 'B', finger: 'l-index', fingerIndex: 3, fingerName: 'Left Index', fingerColor: 'bg-emerald-500' },
    { key: 'n', label: 'N', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: 'm', label: 'M', finger: 'r-index', fingerIndex: 6, fingerName: 'Right Index', fingerColor: 'bg-emerald-500' },
    { key: ',', label: ',', shiftLabel: '<', finger: 'r-mid', fingerIndex: 7, fingerName: 'Right Middle', fingerColor: 'bg-teal-500' },
    { key: '.', label: '.', shiftLabel: '>', finger: 'r-ring', fingerIndex: 8, fingerName: 'Right Ring', fingerColor: 'bg-blue-500' },
    { key: '/', label: '/', shiftLabel: '?', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
    { key: 'ShiftRight', label: 'SHIFT ⇧', width: 'w-14 sm:w-18 md:w-21', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
  ],
  // ROW 4: Spacebar & Modifiers
  [
    { key: 'Control', label: 'CTRL', width: 'w-10 sm:w-12', finger: 'l-pinky', fingerIndex: 0, fingerName: 'Left Pinky', fingerColor: 'bg-purple-500' },
    { key: 'Alt', label: 'ALT', width: 'w-10 sm:w-12', finger: 'l-thumb', fingerIndex: 4, fingerName: 'Left Thumb', fingerColor: 'bg-amber-500' },
    { key: ' ', label: 'SPACEBAR ␣', width: 'w-44 sm:w-56 md:w-72', finger: 'thumb', fingerIndex: 4, fingerName: 'Thumbs', fingerColor: 'bg-amber-500' },
    { key: 'AltRight', label: 'ALT', width: 'w-10 sm:w-12', finger: 'r-thumb', fingerIndex: 5, fingerName: 'Right Thumb', fingerColor: 'bg-amber-500' },
    { key: 'ControlRight', label: 'CTRL', width: 'w-10 sm:w-12', finger: 'r-pinky', fingerIndex: 9, fingerName: 'Right Pinky', fingerColor: 'bg-purple-500' },
  ],
];

const FLAT_KEYS = KEY_LAYOUT.flat();

// Comprehensive character to base physical key mapping
const CHAR_TO_BASE_KEY: Record<string, string> = {
  // Number row & shifted symbols
  '`': '`', '~': '`',
  '1': '1', '!': '1',
  '2': '2', '@': '2',
  '3': '3', '#': '3',
  '4': '4', '$': '4',
  '5': '5', '%': '5',
  '6': '6', '^': '6',
  '7': '7', '&': '7',
  '8': '8', '*': '8',
  '9': '9', '(': '9',
  '0': '0', ')': '0',
  '-': '-', '_': '-',
  '=': '=', '+': '=',
  // Punctuation & symbols
  '[': '[', '{': '[',
  ']': ']', '}': ']',
  '\\': '\\', '|': '\\',
  ';': ';', ':': ';',
  "'": "'", '"': "'",
  ',': ',', '<': ',',
  '.': '.', '>': '.',
  '/': '/', '?': '/',
  ' ': ' ',
  '\n': 'Enter',
};

// Comprehensive character to finger index mapping (0..9)
const CHAR_TO_FINGER_INDEX: Record<string, number> = {
  // Left Pinky (0) - Number 1, row symbols, Q, A, Z
  '`': 0, '~': 0, '1': 0, '!': 0, 'q': 0, 'a': 0, 'z': 0, 'tab': 0, 'capslock': 0,
  // Left Ring (1) - Number 2, W, S, X
  '2': 1, '@': 1, 'w': 1, 's': 1, 'x': 1,
  // Left Middle (2) - Number 3, E, D, C
  '3': 2, '#': 2, 'e': 2, 'd': 2, 'c': 2,
  // Left Index (3) - Numbers 4 & 5, R, T, F, G, V, B
  '4': 3, '$': 3, '5': 3, '%': 3, 'r': 3, 't': 3, 'f': 3, 'g': 3, 'v': 3, 'b': 3,
  // Left Thumb (4) - Spacebar
  ' ': 4,
  // Right Index (6) - Numbers 6 & 7, Y, U, H, J, N, M
  '6': 6, '^': 6, '7': 6, '&': 6, 'y': 6, 'u': 6, 'h': 6, 'j': 6, 'n': 6, 'm': 6,
  // Right Middle (7) - Number 8, I, K, , <
  '8': 7, '*': 7, 'i': 7, 'k': 7, ',': 7, '<': 7,
  // Right Ring (8) - Number 9, O, L, . >
  '9': 8, '(': 8, 'o': 8, 'l': 8, '.': 8, '>': 8,
  // Right Pinky (9) - Numbers 0, -, =, P, ;, /, Enter
  '0': 9, ')': 9, '-': 9, '_': 9, '=': 9, '+': 9,
  'p': 9, '[': 9, '{': 9, ']': 9, '}': 9, '\\': 9, '|': 9,
  ';': 9, ':': 9, "'": 9, '"': 9, '/': 9, '?': 9, '\n': 9, 'enter': 9, 'backspace': 9,
};

export interface FingerInfo {
  id: number;
  name: string;
  nameUrdu: string;
  numberKey: string;      // Primary number row key: 1, 2, 3, 4, 5, etc.
  homeKey: string;        // Home row key: A, S, D, F, J, K, L, ;
  qwertyKey: string;      // Top letter row: Q, W, E, R, T, etc.
  bottomKey: string;      // Bottom row: Z, X, C, V, B, etc.
  allKeysText: string;
  badgeLabel: string;     // e.g. "1 · A"
  x: number;              // percentage coordinates on hand image
  y: number;
  colorDot: string;
}

// Left hand 5 fingers definition with complete multi-row coverage
const LEFT_HAND_FINGERS: FingerInfo[] = [
  {
    id: 0,
    name: 'Pinky',
    nameUrdu: 'چھوٹی انگلی',
    numberKey: '1 (~)',
    homeKey: 'A',
    qwertyKey: 'Q, Tab',
    bottomKey: 'Z, Shift',
    allKeysText: '1, ~, Q, A, Z, Tab',
    badgeLabel: '1 · A',
    x: 18,
    y: 38,
    colorDot: 'bg-purple-400',
  },
  {
    id: 1,
    name: 'Ring',
    nameUrdu: 'انگوٹھی انگلی',
    numberKey: '2 (@)',
    homeKey: 'S',
    qwertyKey: 'W',
    bottomKey: 'X',
    allKeysText: '2, @, W, S, X',
    badgeLabel: '2 · S',
    x: 35,
    y: 22,
    colorDot: 'bg-blue-400',
  },
  {
    id: 2,
    name: 'Middle',
    nameUrdu: 'درمیانی انگلی',
    numberKey: '3 (#)',
    homeKey: 'D',
    qwertyKey: 'E',
    bottomKey: 'C',
    allKeysText: '3, #, E, D, C',
    badgeLabel: '3 · D',
    x: 53,
    y: 14,
    colorDot: 'bg-teal-400',
  },
  {
    id: 3,
    name: 'Index',
    nameUrdu: 'شہادت انگلی',
    numberKey: '4, 5 ($, %)',
    homeKey: 'F',
    qwertyKey: 'R, T',
    bottomKey: 'V, B',
    allKeysText: '4, 5, R, T, F, G, V, B',
    badgeLabel: '4,5 · F',
    x: 72,
    y: 24,
    colorDot: 'bg-emerald-400',
  },
  {
    id: 4,
    name: 'Thumb',
    nameUrdu: 'انگوٹھا',
    numberKey: '—',
    homeKey: 'SPACE',
    qwertyKey: '—',
    bottomKey: 'Spacebar',
    allKeysText: 'Spacebar ␣',
    badgeLabel: 'SPACE',
    x: 88,
    y: 58,
    colorDot: 'bg-amber-400',
  },
];

// Right hand 5 fingers definition with complete multi-row coverage
const RIGHT_HAND_FINGERS: FingerInfo[] = [
  {
    id: 5,
    name: 'Thumb',
    nameUrdu: 'انگوٹھا',
    numberKey: '—',
    homeKey: 'SPACE',
    qwertyKey: '—',
    bottomKey: 'Spacebar',
    allKeysText: 'Spacebar ␣',
    badgeLabel: 'SPACE',
    x: 12,
    y: 58,
    colorDot: 'bg-amber-400',
  },
  {
    id: 6,
    name: 'Index',
    nameUrdu: 'شہادت انگلی',
    numberKey: '6, 7 (^, &)',
    homeKey: 'J',
    qwertyKey: 'Y, U',
    bottomKey: 'N, M',
    allKeysText: '6, 7, Y, U, H, J, N, M',
    badgeLabel: '6,7 · J',
    x: 28,
    y: 24,
    colorDot: 'bg-emerald-400',
  },
  {
    id: 7,
    name: 'Middle',
    nameUrdu: 'درمیانی انگلی',
    numberKey: '8 (*)',
    homeKey: 'K',
    qwertyKey: 'I',
    bottomKey: ', (<)',
    allKeysText: '8, *, I, K, ,',
    badgeLabel: '8 · K',
    x: 47,
    y: 14,
    colorDot: 'bg-teal-400',
  },
  {
    id: 8,
    name: 'Ring',
    nameUrdu: 'انگوٹھی انگلی',
    numberKey: '9 (()',
    homeKey: 'L',
    qwertyKey: 'O',
    bottomKey: '. (>)',
    allKeysText: '9, (, O, L, .',
    badgeLabel: '9 · L',
    x: 65,
    y: 22,
    colorDot: 'bg-blue-400',
  },
  {
    id: 9,
    name: 'Pinky',
    nameUrdu: 'چھوٹی انگلی',
    numberKey: '0, -, =',
    homeKey: ';',
    qwertyKey: 'P, [, ]',
    bottomKey: '/ (?), Enter',
    allKeysText: '0, -, =, P, ;, /, Enter',
    badgeLabel: '0 · ;',
    x: 82,
    y: 38,
    colorDot: 'bg-purple-400',
  },
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  theme,
  activeKeys,
  nextKeyToPress,
  appLanguage = 'en',
  onKeyClick,
}) => {
  const t = TRANSLATIONS[appLanguage];
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [rgbLighting, setRgbLighting] = useState<'rainbow' | 'cyan' | 'neon-pink' | 'matrix'>('rainbow');
  const [pressedAnimationKey, setPressedAnimationKey] = useState<string | null>(null);
  const [showFullMatrixGuide, setShowFullMatrixGuide] = useState<boolean>(true);

  // Determine physical base key & finger index for ANY target character
  const targetChar = nextKeyToPress && typeof nextKeyToPress === 'string' ? nextKeyToPress : '';
  const lowerTarget = targetChar.toLowerCase();
  
  // 1. Resolve base key (e.g. '!' -> '1', '@' -> '2', 'A' -> 'a')
  const baseKeyToHighlight = targetChar ? (CHAR_TO_BASE_KEY[targetChar] || lowerTarget) : '';
  
  // 2. Resolve finger index (0..9)
  const activeFingerIdx: number = targetChar
    ? (CHAR_TO_FINGER_INDEX[targetChar] !== undefined
        ? CHAR_TO_FINGER_INDEX[targetChar]
        : CHAR_TO_FINGER_INDEX[lowerTarget] !== undefined
        ? CHAR_TO_FINGER_INDEX[lowerTarget]
        : -1)
    : -1;

  const targetDisplay =
    targetChar === ' '
      ? 'SPACE'
      : targetChar === '\n'
      ? 'ENTER ↵'
      : targetChar;

  // Track keypress ripples
  useEffect(() => {
    if (activeKeys.size > 0) {
      const lastKey = Array.from(activeKeys)[activeKeys.size - 1];
      setPressedAnimationKey(lastKey);
      const timer = setTimeout(() => setPressedAnimationKey(null), 250);
      return () => clearTimeout(timer);
    }
  }, [activeKeys]);

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950/90 backdrop-blur-2xl transition-all duration-500 shadow-2xl max-w-5xl mx-auto select-none relative overflow-hidden">
      {/* Dynamic Ambient RGB Underglow */}
      <div
        className={`absolute -inset-10 opacity-30 blur-3xl pointer-events-none transition-all duration-700 ${
          rgbLighting === 'rainbow'
            ? 'bg-gradient-to-r from-pink-500 via-cyan-400 via-amber-400 to-emerald-400 animate-pulse'
            : rgbLighting === 'cyan'
            ? 'bg-cyan-500 shadow-[0_0_80px_#06b6d4]'
            : rgbLighting === 'neon-pink'
            ? 'bg-pink-500 shadow-[0_0_80px_#ec4899]'
            : 'bg-emerald-500 shadow-[0_0_80px_#10b981]'
        }`}
      />

      {/* Top Controls Bar (3D Angle & Lighting Selector) */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10 px-1 text-[11px] sm:text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <span>⌨️</span> {t.mechanicalKeyboard}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
            {is3DMode ? t.tactile3DProfile : t.flat2DProfile}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide Matrix Details Toggle */}
          <button
            onClick={() => setShowFullMatrixGuide((v) => !v)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold text-[10px] sm:text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span>{showFullMatrixGuide ? '📋 ' + t.hideKeyDetails : '📋 ' + t.showKeyDetails}</span>
          </button>

          {/* RGB Mode Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setRgbLighting('rainbow')}
              className={`px-2 py-0.5 rounded-lg text-[10px] transition-all cursor-pointer ${
                rgbLighting === 'rainbow' ? 'bg-pink-500/30 text-pink-300 font-bold border border-pink-400' : 'text-slate-400'
              }`}
            >
              🌈 Chroma
            </button>
            <button
              onClick={() => setRgbLighting('cyan')}
              className={`px-2 py-0.5 rounded-lg text-[10px] transition-all cursor-pointer ${
                rgbLighting === 'cyan' ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400' : 'text-slate-400'
              }`}
            >
              ⚡ Cyan
            </button>
            <button
              onClick={() => setRgbLighting('matrix')}
              className={`px-2 py-0.5 rounded-lg text-[10px] transition-all cursor-pointer ${
                rgbLighting === 'matrix' ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400' : 'text-slate-400'
              }`}
            >
              🟢 Matrix
            </button>
          </div>

          {/* 3D / 2D Profile Toggle */}
          <button
            onClick={() => setIs3DMode((v) => !v)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-semibold text-[10px] sm:text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-md active:scale-95"
          >
            <span>{is3DMode ? '🔄 ' + t.switchTo2D : '📐 ' + t.switchTo3D}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. KEYBOARD CHASSIS - Keycaps Stay 100% Solidly Locked In Exact Row Sockets */}
      {/* ========================================================================= */}
      <div
        className={`w-full transition-all duration-300 relative z-10 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 ${
          is3DMode
            ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-slate-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)]'
            : 'bg-slate-950/90 border-slate-800 shadow-xl'
        }`}
      >
        <div className="w-full flex flex-col gap-1 sm:gap-1.5 select-none items-center">
          {KEY_LAYOUT.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full flex-nowrap">
              {row.map((k) => {
                const lowerKey = k.key ? k.key.toLowerCase() : '';
                const isPressed =
                  (lowerKey && activeKeys.has(lowerKey)) ||
                  activeKeys.has(k.key) ||
                  pressedAnimationKey === lowerKey;

                // Precision target detection (including numbers and shifted characters)
                const isNext =
                  baseKeyToHighlight === lowerKey ||
                  (k.key === ' ' && targetChar === ' ') ||
                  (k.key === 'Enter' && targetChar === '\n');

                return (
                  <button
                    key={k.key}
                    onClick={() => onKeyClick?.(k.key)}
                    type="button"
                    className={`
                      shrink-0 flex-none
                      h-8 sm:h-9 md:h-10.5 ${k.width || 'w-7 sm:w-8.5 md:w-10.5'}
                      flex flex-col items-center justify-center rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-bold
                      transition-all duration-75 relative cursor-pointer overflow-hidden
                      ${
                        isPressed
                          ? is3DMode
                            ? 'translate-y-[2px] shadow-[0_1px_0_#0f172a] bg-gradient-to-b from-cyan-400 to-blue-600 text-slate-950 border border-cyan-300'
                            : 'bg-cyan-500 text-slate-950 border border-cyan-300'
                          : isNext
                          ? 'translate-y-0 bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-700 text-white border-2 border-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.9)] ring-2 ring-emerald-400/80'
                          : is3DMode
                          ? 'translate-y-0 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 text-slate-200 border border-slate-700 shadow-[0_3px_0_#0f172a,0_4px_6px_rgba(0,0,0,0.5)] hover:border-slate-500 hover:text-white'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-600 hover:text-white'
                      }
                    `}
                  >
                    {/* Keycap Beveled Top Surface Inner Glint */}
                    <div className="absolute inset-0.5 rounded-lg border-t border-white/15 pointer-events-none" />

                    {/* Number Row / Dual Symbol Layout Display */}
                    {k.shiftLabel ? (
                      <div className="flex flex-col items-center justify-center leading-none pointer-events-none">
                        <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 opacity-90">
                          {k.shiftLabel}
                        </span>
                        <span className="text-[10px] sm:text-xs md:text-sm font-extrabold tracking-wide drop-shadow-md">
                          {k.label}
                        </span>
                      </div>
                    ) : (
                      <span className="truncate tracking-wide drop-shadow-md z-10">
                        {k.label}
                      </span>
                    )}

                    {/* Tactile Home Row Bumps (F & J) */}
                    {k.bump && (
                      <span className="absolute bottom-1 w-2.5 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee]" />
                    )}

                    {/* Clean IN-BOUNDS Next Key Highlight Dot (Does NOT stick out or bounce above keyboard) */}
                    {isNext && (
                      <span className="absolute top-1 right-1 flex h-2 w-2 pointer-events-none">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300 shadow-[0_0_8px_#10b981]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL HANDS WITH COMPLETE NUMBER ROW (1-0) & LETTER ROWS GUIDANCE */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2 p-2.5 sm:p-3.5 bg-slate-950/85 border border-slate-800/80 rounded-xl sm:rounded-2xl z-10">
        {/* Clear Guidance Banner Informing User About All Rows (Numbers 1-0 & Letters) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">👐</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>{t.handPlacementTitle}</span>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                  {t.handPlacementBadge}
                </span>
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                {t.handPlacementSubtitle}
              </p>
            </div>
          </div>

          {targetChar && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400">{t.nextTarget}</span>
              <span className="font-mono font-black text-sm text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/50">
                {targetDisplay}
              </span>
            </div>
          )}
        </div>

        {/* Dual Hands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* ========================================================================= */}
          {/* AUTHENTIC LEFT HUMAN HAND (1, 2, 3, 4, 5 + QWERT + ASDFG + ZXCVB) */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between w-full mb-1.5 px-1">
              <span className="text-[11px] sm:text-xs font-bold font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                <span>👈</span> {t.leftHand}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                {t.numbers}: 1, 2, 3, 4, 5
              </span>
            </div>

            {/* Left Hand Image & Interactive Nodes Overlay */}
            <div className="relative w-full max-w-[170px] sm:max-w-[195px] aspect-square flex items-center justify-center my-1">
              <img
                src={leftHandImg}
                alt="Left Hand Typing"
                className="w-full h-full object-contain rounded-xl opacity-90 filter contrast-110 drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"
              />

              {/* 5 Fingertip Nodes on Left Hand */}
              {LEFT_HAND_FINGERS.map((f) => {
                const isBlinking = f.id === activeFingerIdx;

                return (
                  <div
                    key={f.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-200 z-10"
                    style={{ left: `${f.x}%`, top: `${f.y}%` }}
                  >
                    {/* Vibrant Green Pulsing Ping Beacon When Active */}
                    {isBlinking && (
                      <div className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500/50 animate-ping pointer-events-none" />
                    )}

                    {/* Dual-Label Badge: Displays Active Target OR (Number + Home Key) */}
                    <div
                      className={`px-1.5 py-0.5 rounded-full flex items-center justify-center font-mono font-extrabold text-[9px] sm:text-[10px] shadow-lg transition-all duration-200 border-2 ${
                        isBlinking
                          ? 'bg-emerald-500 text-slate-950 border-white shadow-[0_0_20px_#10b981] scale-125 animate-pulse'
                          : 'bg-slate-950/95 text-slate-200 border-slate-700 shadow-md'
                      }`}
                    >
                      {isBlinking ? targetDisplay : f.badgeLabel}
                    </div>

                    <span
                      className={`text-[8px] sm:text-[9px] font-bold mt-0.5 px-1 py-0.2 rounded font-mono whitespace-nowrap ${
                        isBlinking
                          ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold scale-110'
                          : 'bg-slate-950/90 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {appLanguage === 'ur' ? f.nameUrdu : f.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Left Hand Keys Responsibility Matrix Card */}
            {showFullMatrixGuide && (
              <div className="w-full mt-2 grid grid-cols-1 gap-1 text-[10px] font-mono">
                {LEFT_HAND_FINGERS.map((f) => {
                  const isActive = f.id === activeFingerIdx;
                  return (
                    <div
                      key={f.id}
                      className={`flex items-center justify-between px-2 py-1 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${f.colorDot}`} />
                        <span className="font-bold text-slate-200">{appLanguage === 'ur' ? f.nameUrdu : f.name}:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/25">
                          {t.top}: {f.numberKey}
                        </span>
                        <span className="text-slate-400">
                          {t.keys}: <strong className="text-slate-200">{f.homeKey}, {f.qwertyKey}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* AUTHENTIC RIGHT HUMAN HAND (6, 7, 8, 9, 0 + YUIOP + HJKL; + NM,./) */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between w-full mb-1.5 px-1">
              <span className="text-[11px] sm:text-xs font-bold font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                {t.rightHand} <span>👉</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                {t.numbers}: 6, 7, 8, 9, 0
              </span>
            </div>

            {/* Right Hand Image & Interactive Nodes Overlay */}
            <div className="relative w-full max-w-[170px] sm:max-w-[195px] aspect-square flex items-center justify-center my-1">
              <img
                src={rightHandImg}
                alt="Right Hand Typing"
                className="w-full h-full object-contain rounded-xl opacity-90 filter contrast-110 drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"
              />

              {/* 5 Fingertip Nodes on Right Hand */}
              {RIGHT_HAND_FINGERS.map((f) => {
                const isBlinking = f.id === activeFingerIdx;

                return (
                  <div
                    key={f.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-200 z-10"
                    style={{ left: `${f.x}%`, top: `${f.y}%` }}
                  >
                    {/* Vibrant Green Pulsing Ping Beacon When Active */}
                    {isBlinking && (
                      <div className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500/50 animate-ping pointer-events-none" />
                    )}

                    {/* Dual-Label Badge: Displays Active Target OR (Number + Home Key) */}
                    <div
                      className={`px-1.5 py-0.5 rounded-full flex items-center justify-center font-mono font-extrabold text-[9px] sm:text-[10px] shadow-lg transition-all duration-200 border-2 ${
                        isBlinking
                          ? 'bg-emerald-500 text-slate-950 border-white shadow-[0_0_20px_#10b981] scale-125 animate-pulse'
                          : 'bg-slate-950/95 text-slate-200 border-slate-700 shadow-md'
                      }`}
                    >
                      {isBlinking ? targetDisplay : f.badgeLabel}
                    </div>

                    <span
                      className={`text-[8px] sm:text-[9px] font-bold mt-0.5 px-1 py-0.2 rounded font-mono whitespace-nowrap ${
                        isBlinking
                          ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold scale-110'
                          : 'bg-slate-950/90 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {appLanguage === 'ur' ? f.nameUrdu : f.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Hand Keys Responsibility Matrix Card */}
            {showFullMatrixGuide && (
              <div className="w-full mt-2 grid grid-cols-1 gap-1 text-[10px] font-mono">
                {RIGHT_HAND_FINGERS.map((f) => {
                  const isActive = f.id === activeFingerIdx;
                  return (
                    <div
                      key={f.id}
                      className={`flex items-center justify-between px-2 py-1 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${f.colorDot}`} />
                        <span className="font-bold text-slate-200">{appLanguage === 'ur' ? f.nameUrdu : f.name}:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/25">
                          {t.top}: {f.numberKey}
                        </span>
                        <span className="text-slate-400">
                          {t.keys}: <strong className="text-slate-200">{f.homeKey}, {f.qwertyKey}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
