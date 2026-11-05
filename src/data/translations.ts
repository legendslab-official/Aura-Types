import { AppLanguage } from '../types';

export interface TranslationDictionary {
  // Navigation
  generalMastery: string;
  generalMasterySub: string;
  cppTraining: string;
  cppTrainingSub: string;
  gameArena: string;
  gameArenaSub: string;
  keyboardWarrior: string;
  keyboardWarriorSub: string;
  multiplayerRace: string;
  multiplayerRaceSub: string;
  analytics: string;
  analyticsSub: string;
  academyVault: string;
  academyVaultSub: string;
  days: string;
  streakTitle: string;
  settings: string;
  unmute: string;
  mute: string;
  fitScreen: string;
  zoomIn: string;
  zoomOut: string;
  displayPresets: string;

  // Virtual Keyboard
  mechanicalKeyboard: string;
  tactile3DProfile: string;
  flat2DProfile: string;
  switchTo2D: string;
  switchTo3D: string;
  hideKeyDetails: string;
  showKeyDetails: string;
  handPlacementTitle: string;
  handPlacementBadge: string;
  handPlacementSubtitle: string;
  nextTarget: string;
  leftHand: string;
  rightHand: string;
  numbers: string;
  top: string;
  keys: string;

  // Fingers
  pinky: string;
  ring: string;
  middle: string;
  index: string;
  thumb: string;
  thumbs: string;
  spacebar: string;

  // Dashboard
  nextCharacter: string;
  finger: string;
  roadmap: string;
  speed: string;
  accuracy: string;
  time: string;
  minDrill: string;
  generalTypingMode: string;
  cppCodingMode: string;

  // Settings
  engineSettings: string;
  privacyPolicy: string;
  feedback: string;
  sectionLanguage: string;
  sectionLanguageDesc: string;
  sectionSwitches: string;
  sectionThemes: string;
  sectionDifficulty: string;
  sectionAudio: string;
  sectionDisplay: string;
  sectionDisplayDesc: string;
  preset19Inch: string;
  presetLaptop: string;
  presetFHD: string;
  preset4K: string;
  autoFitBtn: string;
  resetScale: string;
  englishOnly: string;
  urduOnly: string;

  // Onboarding Profile
  profileTitle: string;
  profileSubtitle: string;
  fullNameLabel: string;
  designationLabel: string;
  avatarChoice: string;
  targetWpm: string;
  experienceLevel: string;
  beginner: string;
  intermediate: string;
  expert: string;
  saveProfile: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  en: {
    // Navigation
    generalMastery: 'General Mastery',
    generalMasterySub: '35 Progressive Levels',
    cppTraining: 'C++ Systems Training',
    cppTrainingSub: '10 Hardcore Levels',
    gameArena: '3D Game Arena',
    gameArenaSub: 'Word Rain & Falling Matrix',
    keyboardWarrior: 'Keyboard Warrior',
    keyboardWarriorSub: 'Stickman Horde Kombat',
    multiplayerRace: 'Multiplayer Speed Race',
    multiplayerRaceSub: 'Live Competitions',
    analytics: 'Performance Analytics',
    analyticsSub: 'Heatmaps & Velocity Curves',
    academyVault: 'Lexicon Academy Vault',
    academyVaultSub: 'Word Patterns & Drills',
    days: 'DAYS',
    streakTitle: 'Daily Practice Streak',
    settings: 'Settings',
    unmute: 'Unmute Audio',
    mute: 'Mute Audio',
    fitScreen: 'Fit',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    displayPresets: 'SELECT SCREEN SIZE:',

    // Virtual Keyboard
    mechanicalKeyboard: 'MECHANICAL TACTILE KEYBOARD',
    tactile3DProfile: '3D Tactile Profile',
    flat2DProfile: '2D Low Profile',
    switchTo2D: '2D Flat Mode',
    switchTo3D: '3D Tactile Mode',
    hideKeyDetails: 'Hide Key Details',
    showKeyDetails: 'Show Full Keys Guide',
    handPlacementTitle: 'Hand Finger Placement & Key Responsibilities',
    handPlacementBadge: 'All 4 Rows & Number Row (1 2 3 4 5 6 7 8 9 0)',
    handPlacementSubtitle: 'Numbers and letters for each finger are clearly mapped below. Active finger pulses green:',
    nextTarget: 'Next Target:',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    numbers: 'Numbers',
    top: 'Top',
    keys: 'Keys',

    // Fingers
    pinky: 'Pinky',
    ring: 'Ring',
    middle: 'Middle',
    index: 'Index',
    thumb: 'Thumb',
    thumbs: 'Thumbs',
    spacebar: 'Spacebar',

    // Dashboard
    nextCharacter: 'Next Character:',
    finger: 'Finger:',
    roadmap: 'Roadmap',
    speed: 'Speed',
    accuracy: 'Accuracy',
    time: 'Time',
    minDrill: '~5 Min Drill',
    generalTypingMode: 'General Typing (35 Levels)',
    cppCodingMode: 'Special C++ Training (10 Levels: 0 to Hardcore)',

    // Settings
    engineSettings: 'Engine & Settings',
    privacyPolicy: 'Privacy Policy',
    feedback: 'Real-Time Feedback',
    sectionLanguage: '01. Interface Language',
    sectionLanguageDesc: 'Select your preferred language. Switch between English-only or Urdu-only mode:',
    sectionSwitches: '02. Mechanical Switches & Sound Profiles',
    sectionThemes: '03. RGB Backlight Themes',
    sectionDifficulty: '04. Dynamic Difficulty Curve',
    sectionAudio: '05. Audio Controls & HUD Toggles',
    sectionDisplay: '06. Display Scaling & Screen Fit',
    sectionDisplayDesc: 'Adjust display scale to fit keyboard and both hands on 19" (5:4 / 1280x1024) or laptop screens:',
    preset19Inch: '19" 5:4 Screen',
    presetLaptop: '15.6" Laptop',
    presetFHD: 'Standard Full HD',
    preset4K: '2K / 4K Ultrawide',
    autoFitBtn: 'Auto-Fit My Screen',
    resetScale: 'Reset (100%)',
    englishOnly: 'English (خالص انگریزی)',
    urduOnly: 'اردو (خالص اردو)',

    // Onboarding Profile
    profileTitle: 'Welcome to Aura Types',
    profileSubtitle: 'Set up your typist candidate credential profile for real certificates and analytics:',
    fullNameLabel: 'Candidate Full Name *',
    designationLabel: 'Professional Designation / Role',
    avatarChoice: 'Choose Your Cyber Avatar',
    targetWpm: 'Target Speed Goal (WPM)',
    experienceLevel: 'Experience Level',
    beginner: 'Beginner (15-30 WPM)',
    intermediate: 'Intermediate (35-60 WPM)',
    expert: 'Expert (65+ WPM)',
    saveProfile: 'Save Profile & Begin Practice',
  },
  ur: {
    // Navigation
    generalMastery: 'عمومی مہارت',
    generalMasterySub: '35 مسلسل مراحل',
    cppTraining: 'سی پلس پلس کوڈنگ',
    cppTrainingSub: '10 اعلیٰ سطح کے مراحل',
    gameArena: 'تھری ڈی گیم ایرینا',
    gameArenaSub: 'الفاظ کی بارش اور دفاع',
    keyboardWarrior: 'کی بورڈ واریئر',
    keyboardWarriorSub: 'اسٹک مین جنگی کھیل',
    multiplayerRace: 'ملٹی پلیئر ریس',
    multiplayerRaceSub: 'براہِ راست اسپیڈ مقابلے',
    analytics: 'کارکردگی کے تجزیات',
    analyticsSub: 'رفتار کے گراف اور ہیٹ میپ',
    academyVault: 'الفاظ اکیڈمی والٹ',
    academyVaultSub: 'الفاظ کے پیٹرنز اور مشقیں',
    days: 'دن',
    streakTitle: 'مسلسل روزانہ مشق',
    settings: 'سیٹنگز',
    unmute: 'آواز آن کریں',
    mute: 'آواز بند کریں',
    fitScreen: 'فٹ',
    zoomIn: 'بڑا کریں',
    zoomOut: 'چھوٹا کریں',
    displayPresets: 'اسکرین کا سائز منتخب کریں:',

    // Virtual Keyboard
    mechanicalKeyboard: 'مکینیکل ٹیکٹائل کی بورڈ',
    tactile3DProfile: 'تھری ڈی ٹیکٹائل پروفائل',
    flat2DProfile: 'ٹو ڈی فلیٹ پروفائل',
    switchTo2D: 'ٹو ڈی فلیٹ موڈ',
    switchTo3D: 'تھری ڈی ٹیکٹائل موڈ',
    hideKeyDetails: 'تفصیلات چھپائیں',
    showKeyDetails: 'مکمل تفصیلات دکھائیں',
    handPlacementTitle: 'ہاتھوں کی انگلیاں اور بٹنوں کی رہنمائی',
    handPlacementBadge: 'تمام قطاریں اور نمبرز (1 2 3 4 5 6 7 8 9 0)',
    handPlacementSubtitle: 'ہر انگلی کے نمبرز اور حروف نیچے واضح بتائے گئے ہیں۔ اگلا بٹن دبانے والی انگلی پر سبز لائٹ چمکے گی:',
    nextTarget: 'اگلا ہدف:',
    leftHand: 'بایاں ہاتھ',
    rightHand: 'دایاں ہاتھ',
    numbers: 'نمبرز',
    top: 'اوپر',
    keys: 'بٹن',

    // Fingers
    pinky: 'چھوٹی انگلی',
    ring: 'انگوٹھی انگلی',
    middle: 'درمیانی انگلی',
    index: 'شہادت انگلی',
    thumb: 'انگوٹھا',
    thumbs: 'دونوں انگوٹھے',
    spacebar: 'اسپیس بار',

    // Dashboard
    nextCharacter: 'اگلا حرف:',
    finger: 'انگلی:',
    roadmap: 'روڈ میپ',
    speed: 'رفتار',
    accuracy: 'درستگی',
    time: 'وقت',
    minDrill: '~5 منٹ مشق',
    generalTypingMode: 'جنرل ٹائپنگ (35 لیولز)',
    cppCodingMode: 'خصوصی سی پلس پلس ٹریننگ (10 لیولز)',

    // Settings
    engineSettings: 'انجن اور سیٹنگز',
    privacyPolicy: 'پرائیویسی پالیسی',
    feedback: 'فیڈ بیک اور تجاویز',
    sectionLanguage: '01. انٹرفیس کی زبان (Language)',
    sectionLanguageDesc: 'اپنی پسندیدہ زبان منتخب کریں۔ صرف انگریزی یا مکمل اردو میں تبدیل کریں:',
    sectionSwitches: '02. مکینیکل سوئچ اور آواز کے پروفائل',
    sectionThemes: '03. آر جی بی بیک لائٹ تھیمز',
    sectionDifficulty: '04. مشکل کا درجہ (Difficulty Curve)',
    sectionAudio: '05. آواز اور اسکرین ٹوگلز',
    sectionDisplay: '06. اسکرین سائز اور ڈسپلے زوم',
    sectionDisplayDesc: '19-انچ (5:4 / 1280x1024) یا لیپ ٹاپس پر تمام کی بورڈ اور دونوں ہاتھ بغیر اسکرولنگ کے دیکھنے کے لیے سائز ایڈجسٹ کریں:',
    preset19Inch: '19" اسکوائر اسکرین (5:4)',
    presetLaptop: '15.6" لیپ ٹاپ',
    presetFHD: 'اسٹینڈرڈ فل ایچ ڈی',
    preset4K: 'بڑی اسکرین / 4K',
    autoFitBtn: 'میری اسکرین پر فٹ کریں',
    resetScale: 'ری سیٹ (100%)',
    englishOnly: 'English (خالص انگریزی)',
    urduOnly: 'اردو (خالص اردو)',

    // Onboarding Profile
    profileTitle: 'اورا ٹائپس میں خوش آمدید',
    profileSubtitle: 'اصلی سرٹیفکیٹس اور تجزیات کے لیے اپنا پروفائل تیار کریں:',
    fullNameLabel: 'امیدوار کا پورا نام *',
    designationLabel: 'پیشہ ورانہ عہدہ / شعبہ',
    avatarChoice: 'اپنا پسندیدہ اوتار منتخب کریں',
    targetWpm: 'ہدف اسپیڈ (الفاظ فی منٹ)',
    experienceLevel: 'تجربے کی سطح',
    beginner: 'مبتدی (15-30 WPM)',
    intermediate: 'درمیانہ (35-60 WPM)',
    expert: 'ماہر (65+ WPM)',
    saveProfile: 'محفوظ کریں اور ٹریننگ شروع کریں',
  },
};

// Finger Hint Generator: Strictly English when lang is 'en', Strictly Urdu when lang is 'ur'
export function getFingerHint(char: string | undefined, lang: AppLanguage): string {
  if (!char || typeof char !== 'string') return '';
  const lower = char.toLowerCase();

  if (lang === 'ur') {
    // Pure Urdu
    switch (lower) {
      case '1': return 'بایاں ہاتھ: چھوٹی انگلی (Key 1)';
      case '!': return 'بایاں ہاتھ: چھوٹی انگلی (Shift + 1)';
      case '`': case '~': case 'q': case 'a': case 'z':
        return `بایاں ہاتھ: چھوٹی انگلی (Key ${char.toUpperCase()})`;

      case '2': return 'بایاں ہاتھ: انگوٹھی انگلی (Key 2)';
      case '@': return 'بایاں ہاتھ: انگوٹھی انگلی (Shift + 2)';
      case 'w': case 's': case 'x':
        return `بایاں ہاتھ: انگوٹھی انگلی (Key ${char.toUpperCase()})`;

      case '3': return 'بایاں ہاتھ: درمیانی انگلی (Key 3)';
      case '#': return 'بایاں ہاتھ: درمیانی انگلی (Shift + 3)';
      case 'e': case 'd': case 'c':
        return `بایاں ہاتھ: درمیانی انگلی (Key ${char.toUpperCase()})`;

      case '4': return 'بایاں ہاتھ: شہادت انگلی (Key 4)';
      case '$': return 'بایاں ہاتھ: شہادت انگلی (Shift + 4)';
      case '5': return 'بایاں ہاتھ: شہادت انگلی (Key 5)';
      case '%': return 'بایاں ہاتھ: شہادت انگلی (Shift + 5)';
      case 'r': case 't': case 'f': case 'g': case 'v': case 'b':
        return `بایاں ہاتھ: شہادت انگلی (Key ${char.toUpperCase()})`;

      case '6': return 'دایاں ہاتھ: شہادت انگلی (Key 6)';
      case '^': return 'دایاں ہاتھ: شہادت انگلی (Shift + 6)';
      case '7': return 'دایاں ہاتھ: شہادت انگلی (Key 7)';
      case '&': return 'دایاں ہاتھ: شہادت انگلی (Shift + 7)';
      case 'y': case 'u': case 'h': case 'j': case 'n': case 'm':
        return `دایاں ہاتھ: شہادت انگلی (Key ${char.toUpperCase()})`;

      case '8': return 'دایاں ہاتھ: درمیانی انگلی (Key 8)';
      case '*': return 'دایاں ہاتھ: درمیانی انگلی (Shift + 8)';
      case 'i': case 'k': case ',': case '<':
        return `دایاں ہاتھ: درمیانی انگلی (Key ${char.toUpperCase()})`;

      case '9': return 'دایاں ہاتھ: انگوٹھی انگلی (Key 9)';
      case '(': return 'دایاں ہاتھ: انگوٹھی انگلی (Shift + 9)';
      case 'o': case 'l': case '.': case '>':
        return `دایاں ہاتھ: انگوٹھی انگلی (Key ${char.toUpperCase()})`;

      case '0': return 'دایاں ہاتھ: چھوٹی انگلی (Key 0)';
      case ')': return 'دایاں ہاتھ: چھوٹی انگلی (Shift + 0)';
      case '-': case '_': case '=': case '+':
      case 'p': case '[': case '{': case ']': case '}':
      case '\\': case '|': case ';': case ':':
      case "'": case '"': case '/': case '?':
        return `دایاں ہاتھ: چھوٹی انگلی (Key ${char.toUpperCase()})`;

      case '\n': return 'دایاں ہاتھ: چھوٹی انگلی (Enter ↵)';
      case ' ': return 'دونوں انگوٹھے (اسپیس بار ␣)';
      default: return 'صحیح انگلی سے دبائیں';
    }
  }

  // Pure English (Zero Urdu characters)
  switch (lower) {
    case '1': return 'Left Pinky (Key 1)';
    case '!': return 'Left Pinky (Shift + 1)';
    case '`': case '~': case 'q': case 'a': case 'z':
      return `Left Pinky (Key ${char.toUpperCase()})`;

    case '2': return 'Left Ring (Key 2)';
    case '@': return 'Left Ring (Shift + 2)';
    case 'w': case 's': case 'x':
      return `Left Ring (Key ${char.toUpperCase()})`;

    case '3': return 'Left Middle (Key 3)';
    case '#': return 'Left Middle (Shift + 3)';
    case 'e': case 'd': case 'c':
      return `Left Middle (Key ${char.toUpperCase()})`;

    case '4': return 'Left Index (Key 4)';
    case '$': return 'Left Index (Shift + 4)';
    case '5': return 'Left Index (Key 5)';
    case '%': return 'Left Index (Shift + 5)';
    case 'r': case 't': case 'f': case 'g': case 'v': case 'b':
      return `Left Index (Key ${char.toUpperCase()})`;

    case '6': return 'Right Index (Key 6)';
    case '^': return 'Right Index (Shift + 6)';
    case '7': return 'Right Index (Key 7)';
    case '&': return 'Right Index (Shift + 7)';
    case 'y': case 'u': case 'h': case 'j': case 'n': case 'm':
      return `Right Index (Key ${char.toUpperCase()})`;

    case '8': return 'Right Middle (Key 8)';
    case '*': return 'Right Middle (Shift + 8)';
    case 'i': case 'k': case ',': case '<':
      return `Right Middle (Key ${char.toUpperCase()})`;

    case '9': return 'Right Ring (Key 9)';
    case '(': return 'Right Ring (Shift + 9)';
    case 'o': case 'l': case '.': case '>':
      return `Right Ring (Key ${char.toUpperCase()})`;

    case '0': return 'Right Pinky (Key 0)';
    case ')': return 'Right Pinky (Shift + 0)';
    case '-': case '_': case '=': case '+':
    case 'p': case '[': case '{': case ']': case '}':
    case '\\': case '|': case ';': case ':':
    case "'": case '"': case '/': case '?':
      return `Right Pinky (Key ${char.toUpperCase()})`;

    case '\n': return 'Right Pinky (Enter ↵)';
    case ' ': return 'Thumbs (Spacebar ␣)';
    default: return 'Correct Finger';
  }
}
