export interface TypingExercise {
  id: string;
  title: string;
  category: 'keys' | 'words' | 'sentences' | 'speed_test';
  targetKeys: string[];
  description: string;
  timeLimitSec?: number;
  text: string;
  minAccuracyToPass: number;
  targetWpm: number;
}

export interface LessonModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  targetKeys: string[];
  exercises: TypingExercise[];
}

export const TYPING_MODULES: LessonModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'The Home Row Foundation',
    subtitle: 'Keys: A S D F | J K L ;',
    icon: '🏠',
    level: 'Beginner',
    description: 'Master the core anchor keys for your left and right hand fingers without looking down.',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
    exercises: [
      {
        id: 'm1-ex1',
        title: 'Exercise 1.1: Index & Middle Fingers',
        category: 'keys',
        targetKeys: ['f', 'j', 'd', 'k', ' '],
        description: 'Practice the tactile home bumps on F and J with D and K.',
        text: 'fff jjj fff jjj ddd kkk ddd kkk fjd kjf dkf jfd fk dk fj kj ff jj dd kk fd jk df kj',
        minAccuracyToPass: 90,
        targetWpm: 20,
      },
      {
        id: 'm1-ex2',
        title: 'Exercise 1.2: Ring & Pinky Fingers',
        category: 'keys',
        targetKeys: ['a', 's', 'l', ';', ' '],
        description: 'Build agility on outer fingers A, S, L and Semicolon.',
        text: 'aaa sss lll ;;; aaa sss lll ;;; asd lkj asdf ;lkj asdf ;lkj a s d f j k l ; as df jk l; salad flask',
        minAccuracyToPass: 92,
        targetWpm: 22,
      },
      {
        id: 'm1-ex3',
        title: 'Exercise 1.3: Full Home Row Words',
        category: 'words',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        description: 'Type complete English words using only home row keys.',
        text: 'ask dad fall lad all fall flask salad glad sad lass add ads alfa dash half jak fall salad',
        minAccuracyToPass: 94,
        targetWpm: 25,
      },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Top Row & Reach Keys',
    subtitle: 'Keys: Q W E R T | Y U I O P',
    icon: '⬆️',
    level: 'Beginner',
    description: 'Extend finger reaches upwards from home row into common vowel letters E, I, O and consonants.',
    targetKeys: ['e', 'i', 'r', 'u', 't', 'y', 'w', 'o', 'q', 'p'],
    exercises: [
      {
        id: 'm2-ex1',
        title: 'Exercise 2.1: Reaching for E & I',
        category: 'keys',
        targetKeys: ['e', 'i', 'd', 'k'],
        description: 'Middle finger reaches: D to E and K to I.',
        text: 'ded kik ded kik ede iki fed kid led red die lie ride tide side lake like kite seek feed',
        minAccuracyToPass: 92,
        targetWpm: 25,
      },
      {
        id: 'm2-ex2',
        title: 'Exercise 2.2: R, T, Y, U Keys',
        category: 'keys',
        targetKeys: ['r', 't', 'y', 'u'],
        description: 'Index finger stretches to R, T, Y, and U.',
        text: 'frf ftf jyj juj try you tree your true roof fire fast rust yard unit duty rule free rate',
        minAccuracyToPass: 92,
        targetWpm: 28,
      },
      {
        id: 'm2-ex3',
        title: 'Exercise 2.3: Top Row Word Flow',
        category: 'words',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        description: 'Combine home and top rows into everyday vocabulary.',
        text: 'quiet water power write report quiet people order tree route quote upper reply update pretty',
        minAccuracyToPass: 94,
        targetWpm: 30,
      },
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Bottom Row Agility',
    subtitle: 'Keys: Z X C V B | N M , . /',
    icon: '⬇️',
    level: 'Intermediate',
    description: 'Master downward finger flexion to hit Z, X, C, V, B, N, M, comma, and period with crisp precision.',
    targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    exercises: [
      {
        id: 'm3-ex1',
        title: 'Exercise 3.1: V, B, N, M Movement',
        category: 'keys',
        targetKeys: ['v', 'b', 'n', 'm'],
        description: 'Index finger downward travel.',
        text: 'fvf fbf jnj jmj van man bin ban moon move book name burn norm farm bean bomb mini view',
        minAccuracyToPass: 92,
        targetWpm: 30,
      },
      {
        id: 'm3-ex2',
        title: 'Exercise 3.2: Z, X, C and Punctuation',
        category: 'keys',
        targetKeys: ['z', 'x', 'c', ',', '.'],
        description: 'Ring and pinky bottom reaches plus comma and period.',
        text: 'aza sxs dcd k,k l.l zero box cold zoo mix next cat car come scan zoom exit fact size text.',
        minAccuracyToPass: 94,
        targetWpm: 32,
      },
      {
        id: 'm3-ex3',
        title: 'Exercise 3.3: Full Alphabet Sentences',
        category: 'sentences',
        targetKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        description: 'Practice the famous pangram with every English letter.',
        text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.',
        minAccuracyToPass: 95,
        targetWpm: 35,
      },
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Capitals & Shift Keys',
    subtitle: 'Left & Right Shift Mechanics',
    icon: '🔤',
    level: 'Intermediate',
    description: 'Learn opposite-hand shift coordination for seamless capitalization without rhythm interruption.',
    targetKeys: ['Shift', 'A-Z'],
    exercises: [
      {
        id: 'm4-ex1',
        title: 'Exercise 4.1: Proper Nouns & Capitals',
        category: 'words',
        targetKeys: ['Shift'],
        description: 'Capitals across left and right sides.',
        text: 'London Paris Tokyo NewYork Berlin Rome Madrid Sydney Toronto Cairo Chicago Dublin Seoul',
        minAccuracyToPass: 94,
        targetWpm: 35,
      },
      {
        id: 'm4-ex2',
        title: 'Exercise 4.2: Structured Dialogues',
        category: 'sentences',
        targetKeys: ['Shift', '.,?!'],
        description: 'Real sentences with dialogue and questions.',
        text: 'Hello, World! Did you see the Northern Lights in Norway? Yes, Alexander and Maria visited Oslo in December.',
        minAccuracyToPass: 95,
        targetWpm: 38,
      },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Numbers & Symbols Mastery',
    subtitle: 'Keys: 1-0 | ! @ # $ % ^ & * ( )',
    icon: '🔢',
    level: 'Advanced',
    description: 'Conquer the top number row and programmer symbols without looking at the keyboard.',
    targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!', '@', '#', '$', '%', '&', '*', '(', ')'],
    exercises: [
      {
        id: 'm5-ex1',
        title: 'Exercise 5.1: Number Drills',
        category: 'keys',
        targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        description: 'Reach upward into the number tier.',
        text: '123 456 789 012 2026 1984 100 500 750 360 404 8080 3000 999 42 1024 2048 4096 8192',
        minAccuracyToPass: 93,
        targetWpm: 30,
      },
      {
        id: 'm5-ex2',
        title: 'Exercise 5.2: Code & Currency Symbols',
        category: 'sentences',
        targetKeys: ['$', '%', '&', '*', '(', ')', '#', '@'],
        description: 'Symbols used in tech, spreadsheets, and emails.',
        text: 'Total cost: $450 (15% discount). Email: user@auratype.com & support#101. Function calculate(x * y).',
        minAccuracyToPass: 94,
        targetWpm: 32,
      },
    ],
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Official Timed Speed Tests',
    subtitle: '1 Min, 2 Min & 5 Min Evaluations',
    icon: '⏱️',
    level: 'Master',
    description: 'Test your touch typing WPM and accuracy on standard paragraphs with automated certificate scoring.',
    targetKeys: ['All Keys'],
    exercises: [
      {
        id: 'test-1min',
        title: '1-Minute Speed Certification',
        category: 'speed_test',
        targetKeys: ['All Keys'],
        description: 'Sprint test to measure your peak burst velocity.',
        timeLimitSec: 60,
        text: 'Typing is not merely pressing buttons on a plastic board; it is an intimate extension of human cognition into the digital universe. When muscle memory takes over, thoughts materialize on the screen as swiftly as they form in the mind. Continuous practice trains the synaptic pathways between vision, thought, and fingertip reflexes, unlocking effortless flow and creative freedom.',
        minAccuracyToPass: 95,
        targetWpm: 40,
      },
      {
        id: 'test-2min',
        title: '2-Minute Endurance Assessment',
        category: 'speed_test',
        targetKeys: ['All Keys'],
        description: 'Measure typing rhythm and consistency over 120 seconds.',
        timeLimitSec: 120,
        text: 'In the modern era of computing and global connectivity, rapid keyboard proficiency is one of the most transformative skills a professional can master. Whether drafting architectural specifications, writing robust software programs, or communicating across continents in real time, high typing speed and pinpoint accuracy dramatically elevate productivity. Developing proper posture, keeping wrists elevated, and trusting the home row will prevent physical strain and build lifelong typing excellence.',
        minAccuracyToPass: 95,
        targetWpm: 45,
      },
      {
        id: 'test-5min',
        title: '5-Minute Pro Master Certification',
        category: 'speed_test',
        targetKeys: ['All Keys'],
        description: 'Comprehensive test for ultimate touch typing mastery and certification.',
        timeLimitSec: 300,
        text: 'Technology continues to accelerate the pace of human communication, demanding greater efficiency and fluid expression. Touch typing represents the gold standard of keyboard fluency, allowing you to focus entirely on ideas while your fingers navigate the physical layout autonomously. As you advance through deliberate practice drills, keystroke hesitation vanishes, error correction becomes instinctual, and your overall typing cadence transforms into a rhythmic symphony. Dedicate a few minutes each day to deliberate practice, monitor your error heatmaps, and enjoy the lifelong advantages of seamless digital fluency.',
        minAccuracyToPass: 96,
        targetWpm: 50,
      },
    ],
  },
];
