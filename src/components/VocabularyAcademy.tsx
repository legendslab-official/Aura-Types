import React, { useState } from 'react';
import { WordItem } from '../types';
import { VOCABULARY_DECKS } from '../data/vocabulary';
import { soundEngine } from '../utils/audio';

interface VocabularyAcademyProps {
  onStartWordPractice: (words: WordItem[]) => void;
}

export const VocabularyAcademy: React.FC<VocabularyAcademyProps> = ({ onStartWordPractice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('auratype_vocab_category') || 'academic';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);

  React.useEffect(() => {
    localStorage.setItem('auratype_vocab_category', selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { id: 'academic', name: 'Academic & SAT/GRE', icon: '🏛️', count: VOCABULARY_DECKS.academic.length },
    { id: 'cyberTech', name: 'Cyber & Sci-Fi Tech', icon: '⚡', count: VOCABULARY_DECKS.cyberTech.length },
    { id: 'essential', name: 'Essential Fast 1000', icon: '🚀', count: VOCABULARY_DECKS.essential.length },
    { id: 'synonymsBattle', name: 'Synonyms & Antonyms', icon: '🎯', count: VOCABULARY_DECKS.synonymsBattle.length },
  ];

  const currentWords = VOCABULARY_DECKS[selectedCategory] || [];
  const normalizedQuery = (searchQuery || '').toLowerCase().trim();
  const filteredWords = currentWords.filter(
    (w) =>
      (w?.text && w.text.toLowerCase().includes(normalizedQuery)) ||
      (w?.meaning && w.meaning.toLowerCase().includes(normalizedQuery))
  );

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Lexicon Academy & Word Vault</h2>
          <p className="text-xs text-slate-400">Master formidable English vocabulary, definitions, and contextual usage</p>
        </div>

        <button
          onClick={() => {
            soundEngine.playKeySwitch('crystal-pop');
            onStartWordPractice(filteredWords);
          }}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 cursor-pointer whitespace-nowrap"
        >
          Practice This Deck in 3D Rain
        </button>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto p-1 bg-slate-900 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedWord(null);
                soundEngine.playKeySwitch('cherry-blue');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search words & meanings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            onClick={() => {
              setSelectedWord(word);
              soundEngine.playKeySwitch('crystal-pop');
            }}
            className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-base text-white group-hover:text-cyan-300 transition-colors uppercase">
                  {word.text}
                </span>
                <span className="text-[10px] font-mono text-slate-500">Tier {word.difficulty}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{word.meaning}</p>
            </div>

            {word.synonyms && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[11px] text-cyan-400/90 truncate">
                <span className="text-slate-500">Syn:</span>
                <span>{word.synonyms.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Word Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setSelectedWord(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Lexicon Master Profile
            </span>
            <h3 className="text-3xl font-mono font-bold text-white mt-1 uppercase tracking-tight">
              {selectedWord.text}
            </h3>

            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Definition:</span>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed">{selectedWord.meaning}</p>
            </div>

            {selectedWord.synonyms && (
              <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-2 text-xs">
                <span className="text-slate-400">Synonyms:</span>
                <span className="text-cyan-300 font-semibold">{selectedWord.synonyms.join(', ')}</span>
              </div>
            )}

            {selectedWord.antonyms && (
              <div className="mt-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-2 text-xs">
                <span className="text-slate-400">Antonyms:</span>
                <span className="text-pink-300 font-semibold">{selectedWord.antonyms.join(', ')}</span>
              </div>
            )}

            <button
              onClick={() => {
                onStartWordPractice([selectedWord]);
                setSelectedWord(null);
              }}
              className="mt-6 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              Launch Single-Word Reflex Drill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
