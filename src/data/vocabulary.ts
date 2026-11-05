import { WordItem } from '../types';

export const VOCABULARY_DECKS: { [category: string]: WordItem[] } = {
  essential: [
    { id: 'es-1', text: 'focus', meaning: 'The center of interest or activity', difficulty: 1 },
    { id: 'es-2', text: 'quick', meaning: 'Moving fast or doing something promptly', difficulty: 1 },
    { id: 'es-3', text: 'brave', meaning: 'Ready to face danger or pain', difficulty: 1 },
    { id: 'es-4', text: 'stream', meaning: 'A continuous flow of data or liquid', difficulty: 1 },
    { id: 'es-5', text: 'spark', meaning: 'A small fiery particle or trace of quality', difficulty: 1 },
    { id: 'es-6', text: 'light', meaning: 'The natural agent that stimulates sight', difficulty: 1 },
    { id: 'es-7', text: 'power', meaning: 'The ability or capacity to do something', difficulty: 1 },
    { id: 'es-8', text: 'dream', meaning: 'A series of thoughts, images or aspirations', difficulty: 1 },
    { id: 'es-9', text: 'swift', meaning: 'Happening quickly or moving fast', difficulty: 1 },
    { id: 'es-10', text: 'tempo', meaning: 'The speed at which a passage or action proceeds', difficulty: 1 },
    { id: 'es-11', text: 'rhythm', meaning: 'A strong, regular repeated pattern of movement or sound', difficulty: 2 },
    { id: 'es-12', text: 'crystal', meaning: 'A clear, transparent mineral or glass', difficulty: 2 },
    { id: 'es-13', text: 'gravity', meaning: 'The force that attracts a body toward center', difficulty: 2 },
    { id: 'es-14', text: 'harmony', meaning: 'The combination of simultaneously sounded musical notes', difficulty: 2 },
    { id: 'es-15', text: 'horizon', meaning: 'The line at which earth and sky appear to meet', difficulty: 2 },
    { id: 'es-16', text: 'journey', meaning: 'An act of traveling from one place to another', difficulty: 2 },
    { id: 'es-17', text: 'dynamic', meaning: 'Constant change, activity, or progress', difficulty: 2 },
    { id: 'es-18', text: 'balance', meaning: 'An even distribution of weight or equilibrium', difficulty: 2 },
    { id: 'es-19', text: 'velocity', meaning: 'The speed of something in a given direction', difficulty: 2 },
    { id: 'es-20', text: 'clarity', meaning: 'The quality of being clear and easy to understand', difficulty: 2 },
  ],

  academic: [
    { id: 'ac-1', text: 'ephemeral', meaning: 'Lasting for a very short time; fleeting', difficulty: 4, synonyms: ['transient', 'fleeting'], antonyms: ['permanent', 'eternal'] },
    { id: 'ac-2', text: 'ubiquitous', meaning: 'Present, appearing, or found everywhere', difficulty: 4, synonyms: ['omnipresent', 'pervasive'], antonyms: ['rare', 'scarce'] },
    { id: 'ac-3', text: 'serendipity', meaning: 'The occurrence of events by chance in a happy way', difficulty: 4, synonyms: ['fortune', 'chance'], antonyms: ['misfortune', 'adversity'] },
    { id: 'ac-4', text: 'incandescent', meaning: 'Emitting light as a result of being heated; brilliant', difficulty: 4, synonyms: ['radiant', 'luminous'], antonyms: ['dim', 'dull'] },
    { id: 'ac-5', text: 'magnanimous', meaning: 'Generous or forgiving, especially toward a rival', difficulty: 5, synonyms: ['benevolent', 'altruistic'], antonyms: ['spiteful', 'petty'] },
    { id: 'ac-6', text: 'perspicacious', meaning: 'Having a ready insight into and understanding of things', difficulty: 5, synonyms: ['insightful', 'astute'], antonyms: ['ignorant', 'obtuse'] },
    { id: 'ac-7', text: 'juxtaposition', meaning: 'The fact of placing things close together for contrast', difficulty: 5, synonyms: ['comparison', 'collocation'] },
    { id: 'ac-8', text: 'eloquent', meaning: 'Fluent or persuasive in speaking or writing', difficulty: 3, synonyms: ['articulate', 'expressive'], antonyms: ['inarticulate'] },
    { id: 'ac-9', text: 'resplendent', meaning: 'Attractive and impressive through being richly colorful', difficulty: 4, synonyms: ['dazzling', 'splendid'], antonyms: ['drab', 'somber'] },
    { id: 'ac-10', text: 'labyrinth', meaning: 'A complicated irregular network of passages or paths', difficulty: 3, synonyms: ['maze', 'tangle'] },
    { id: 'ac-11', text: 'conundrum', meaning: 'A confusing and difficult problem or question', difficulty: 3, synonyms: ['enigma', 'puzzle'] },
    { id: 'ac-12', text: 'mellifluous', meaning: 'Sweet or musical; pleasant to hear', difficulty: 5, synonyms: ['dulcet', 'harmonious'], antonyms: ['cacophonous', 'harsh'] },
    { id: 'ac-13', text: 'quintessential', meaning: 'Representing the most perfect or typical example', difficulty: 4, synonyms: ['archetypal', 'exemplary'] },
    { id: 'ac-14', text: 'effervescent', meaning: 'Vivacious and enthusiastic; giving off bubbles', difficulty: 4, synonyms: ['bubbly', 'exuberant'], antonyms: ['depressed', 'dull'] },
    { id: 'ac-15', text: 'surreptitious', meaning: 'Kept secret, especially because it would not be approved of', difficulty: 5, synonyms: ['stealthy', 'clandestine'], antonyms: ['overt', 'candid'] },
  ],

  cyberTech: [
    { id: 'cy-1', text: 'algorithm', meaning: 'A process or set of rules followed in calculations', difficulty: 3 },
    { id: 'cy-2', text: 'cybernetic', meaning: 'Relating to automatic control systems in tech and living bodies', difficulty: 3 },
    { id: 'cy-3', text: 'telemetry', meaning: 'The process of recording and transmitting the readings of an instrument', difficulty: 4 },
    { id: 'cy-4', text: 'synaptic', meaning: 'Relating to a junction between nerve cells or neural networks', difficulty: 4 },
    { id: 'cy-5', text: 'quantum', meaning: 'The minimum amount of any physical entity involved in an interaction', difficulty: 3 },
    { id: 'cy-6', text: 'firewall', meaning: 'A system designed to prevent unauthorized access to a network', difficulty: 2 },
    { id: 'cy-7', text: 'holographic', meaning: 'Producing three-dimensional images generated by light beams', difficulty: 3 },
    { id: 'cy-8', text: 'singularity', meaning: 'A hypothetical point in time at which technological growth becomes uncontrollable', difficulty: 4 },
    { id: 'cy-9', text: 'cryptography', meaning: 'The art of writing or solving codes', difficulty: 4 },
    { id: 'cy-10', text: 'wavelength', meaning: 'The distance between successive crests of a wave', difficulty: 3 },
    { id: 'cy-11', text: 'hyperdrive', meaning: 'A propulsion system that allows faster-than-light travel', difficulty: 3 },
    { id: 'cy-12', text: 'bandwidth', meaning: 'The transmission capacity of an electronic communications network', difficulty: 3 },
    { id: 'cy-13', text: 'matrix', meaning: 'An environment or material in which something develops', difficulty: 2 },
    { id: 'cy-14', text: 'neon', meaning: 'A noble gas glowing with reddish-orange or vivid light', difficulty: 1 },
    { id: 'cy-15', text: 'protocol', meaning: 'An official procedure or system of computing rules', difficulty: 2 },
  ],

  synonymsBattle: [
    {
      id: 'syn-1',
      text: 'GIGANTIC',
      meaning: 'Extremely large in size or scale',
      category: 'Synonym of ENORMOUS',
      difficulty: 2,
    },
    {
      id: 'syn-2',
      text: 'TRANQUIL',
      meaning: 'Free from disturbance; calm and quiet',
      category: 'Synonym of PEACEFUL',
      difficulty: 3,
    },
    {
      id: 'syn-3',
      text: 'COURAGEOUS',
      meaning: 'Not deterred by danger or pain; brave',
      category: 'Synonym of VALIANT',
      difficulty: 3,
    },
    {
      id: 'syn-4',
      text: 'RADIANT',
      meaning: 'Shining or glowing brightly',
      category: 'Synonym of LUMINOUS',
      difficulty: 3,
    },
    {
      id: 'syn-5',
      text: 'ABUNDANT',
      meaning: 'Existing or available in large quantities; plentiful',
      category: 'Synonym of COPIOUS',
      difficulty: 4,
    },
    {
      id: 'syn-6',
      text: 'SWIFT',
      meaning: 'Happening in a short time or moving fast',
      category: 'Synonym of RAPID',
      difficulty: 2,
    },
    {
      id: 'syn-7',
      text: 'METICULOUS',
      meaning: 'Showing great attention to detail; very careful',
      category: 'Synonym of THOROUGH',
      difficulty: 4,
    },
    {
      id: 'syn-8',
      text: 'AUTHENTIC',
      meaning: 'Of undisputed origin; genuine',
      category: 'Synonym of GENUINE',
      difficulty: 3,
    },
  ]
};

export const ZEN_PASSAGES: { title: string; author: string; text: string }[] = [
  {
    title: 'The Flow State',
    author: 'Psychology of Optimal Experience',
    text: 'When your hands dance across the keyboard without conscious hesitation, you enter a state of seamless immersion where speed and clarity become one harmonious rhythm.'
  },
  {
    title: 'Digital Horizons',
    author: 'Cybernetics Archive',
    text: 'Information flows like water through fiber optic highways. Each keystroke constructs bridges between imagination and code, crafting virtual worlds from electric pulses.'
  },
  {
    title: 'Echoes in the Starlight',
    author: 'Cosmic Reflections',
    text: 'The universe does not rush, yet everything is accomplished. Calm your breathing, let your fingers rest on home row, and let accuracy guide your journey toward mastery.'
  },
  {
    title: 'Mastery of Language',
    author: 'Lexical Renaissance',
    text: 'Vocabulary is the architecture of thought. The more precise your words, the sharper your expression becomes, empowering you to illuminate intricate ideas with ease.'
  }
];
