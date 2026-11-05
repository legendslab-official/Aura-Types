import React, { useState, useRef } from 'react';
import { soundEngine } from '../utils/audio';

export interface CertificateData {
  recipientName: string;
  wpm: number;
  accuracy: number;
  durationMinutes: number;
  examTitle: string;
  verificationId: string;
  date: string;
  grade?: string;
}

interface TypingCertificateModalProps {
  data: CertificateData;
  onClose: () => void;
}

export const TypingCertificateModal: React.FC<TypingCertificateModalProps> = ({
  data,
  onClose,
}) => {
  const [candidateName, setCandidateName] = useState<string>(data.recipientName || 'Typing Master Candidate');
  const [candidateTitle, setCandidateTitle] = useState<string>('Certified Keyboard Systems Specialist');
  const [selectedGrade, setSelectedGrade] = useState<string>(data.grade || 'V8.5');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    soundEngine.playKeySwitch('crystal-pop');
    window.print();
  };

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(`https://auratype.academy/verify/${data.verificationId}?grade=${selectedGrade}`);
    setCopied(true);
    soundEngine.playKeySwitch('cherry-blue');
    setTimeout(() => setCopied(false), 2500);
  };

  const getDistinctionTier = (wpm: number, gradeStr: string) => {
    if (gradeStr === 'V8.5' || wpm >= 50) {
      return {
        title: 'SUMMA CUM LAUDE (GRANDMASTER)',
        gradeBadge: 'GRADE V8.5',
        subtext: 'Apex International Grandmaster Standard',
        color: 'text-amber-300',
        badgeGlow: 'border-amber-400/70 bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      };
    }
    if (gradeStr === 'V8.0' || wpm >= 35) {
      return {
        title: 'MAGNA CUM LAUDE (ELITE)',
        gradeBadge: 'GRADE V8.0',
        subtext: 'Elite Systems Typing Standard',
        color: 'text-yellow-400',
        badgeGlow: 'border-yellow-400/70 bg-gradient-to-r from-yellow-500/25 via-amber-400/30 to-yellow-500/25',
      };
    }
    return {
      title: 'FIRST CLASS HONORS (MASTER)',
      gradeBadge: `GRADE ${gradeStr || 'V7.5'}`,
      subtext: 'Professional Certified Velocity',
      color: 'text-cyan-300',
      badgeGlow: 'border-cyan-400/70 bg-gradient-to-r from-cyan-500/25 via-blue-400/30 to-cyan-500/25',
    };
  };

  const tier = getDistinctionTier(data.wpm, selectedGrade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.2)] flex flex-col gap-6 my-auto print:border-none print:shadow-none print:p-0 print:bg-transparent">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              📜
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                Official Executive Diploma & Certification
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                International Standard for Professional Touch Typing Mastery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>✏️</span>
              <span>{isEditing ? 'Done Editing' : 'Edit Candidate Details'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WORLD-CLASS EXECUTIVE DIPLOMA CERTIFICATE CANVAS */}
        {/* ========================================================================= */}
        <div
          ref={certRef}
          className="relative w-full bg-[#0a0f1d] text-slate-100 rounded-2xl p-8 sm:p-12 border-8 border-double border-amber-500/60 shadow-2xl flex flex-col items-center text-center overflow-hidden print:border-8 print:border-amber-700 print:text-black print:bg-white"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 80%)`,
          }}
        >
          {/* Subtle Background Watermark Heraldic Emblem */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-[320px] font-serif text-amber-300">
            🏛️
          </div>

          {/* Ornate Corner Accents */}
          <div className="absolute top-3 left-3 text-amber-400/60 text-2xl select-none font-serif">✥</div>
          <div className="absolute top-3 right-3 text-amber-400/60 text-2xl select-none font-serif">✥</div>
          <div className="absolute bottom-3 left-3 text-amber-400/60 text-2xl select-none font-serif">✥</div>
          <div className="absolute bottom-3 right-3 text-amber-400/60 text-2xl select-none font-serif">✥</div>

          {/* Institutional Top Crest & Header */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center mb-1">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-2xl">
                ⚡
              </div>
            </div>

            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.35em] text-amber-400 font-bold">
              International Keyboard Academy of Computing
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Global Directorate of Ergonomics & Speed Assessment
            </span>
          </div>

          {/* Certificate Main Title */}
          <div className="my-6">
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-200 font-display">
              Certificate of Touch Typing Mastery
            </h1>
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
          </div>

          {/* Formal Attestation Wording */}
          <p className="text-xs sm:text-sm text-slate-300 italic max-w-xl leading-relaxed">
            By authority of the Academic Council and Global Keyboard Certification Board, be it known that the candidate has undergone comprehensive bilateral touch typing assessment and is hereby awarded this professional diploma:
          </p>

          {/* Candidate Profile Box */}
          <div className="my-6 w-full max-w-lg flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400/90 font-bold mb-1">
              Candidate Credential Conferred Upon
            </span>

            {isEditing ? (
              <div className="flex flex-col gap-2.5 w-full max-w-md bg-slate-900/95 p-4 rounded-xl border border-amber-400/60 shadow-xl">
                <label className="text-[10px] font-mono text-slate-400 text-left">Full Name of Candidate:</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 text-amber-300 font-serif font-bold text-xl text-center border border-amber-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter Candidate Full Name"
                />
                <label className="text-[10px] font-mono text-slate-400 text-left mt-1">Professional Title / Designation:</label>
                <input
                  type="text"
                  value={candidateTitle}
                  onChange={(e) => setCandidateTitle(e.target.value)}
                  className="px-3 py-1 bg-slate-950 text-slate-200 font-mono text-xs text-center border border-slate-700 rounded-lg focus:outline-none"
                  placeholder="Designation / Title"
                />
                <label className="text-[10px] font-mono text-amber-400 font-bold text-left mt-1">Official Certification Grade:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['V8.5', 'V8.0', 'V7.5'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(g);
                        soundEngine.playKeySwitch('cherry-blue');
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        selectedGrade === g
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                          : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-amber-500/50'
                      }`}
                    >
                      Grade {g}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-[1.02]"
                title="Click to edit Candidate Name & Grade"
              >
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-wide border-b-2 border-amber-400/80 pb-1 text-center group-hover:text-amber-300 transition-colors">
                  {candidateName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-amber-400/90 font-semibold tracking-wider">
                    {candidateTitle}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-400/50">
                    Grade {selectedGrade}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-400 font-mono mt-0.5 print:hidden">
                  (Click to edit name & grade)
                </span>
              </div>
            )}
          </div>

          {/* Distinction Honors Badge */}
          <div className={`mb-6 px-5 py-2 rounded-full border text-xs font-mono font-bold tracking-widest flex items-center gap-2 ${tier.badgeGlow}`}>
            <span className={tier.color}>★ {tier.title} ★</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-200 font-extrabold uppercase bg-amber-500/30 px-2 py-0.5 rounded border border-amber-400/50">
              {tier.gradeBadge}
            </span>
          </div>

          {/* Performance Assessment Grid - 4 Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-inner">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Certified Velocity</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tabular-nums mt-0.5">
                {data.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500 mt-0.5">Words Per Minute</span>
            </div>

            <div className="flex flex-col items-center border-l sm:border-x border-slate-800/90">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Fingertip Precision</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums mt-0.5">
                {data.accuracy}%
              </span>
              <span className="text-[9px] font-mono text-slate-500 mt-0.5">Zero Fatigue Form</span>
            </div>

            <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-r border-slate-800/90 pt-2 sm:pt-0">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">Standard Grade</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tabular-nums mt-0.5">
                {selectedGrade}
              </span>
              <span className="text-[9px] font-mono text-amber-300 mt-0.5 font-semibold">Apex Grandmaster</span>
            </div>

            <div className="flex flex-col items-center border-t sm:border-t-0 border-slate-800/90 pt-2 sm:pt-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Assessment</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums mt-0.5">
                {data.durationMinutes} <span className="text-xs font-normal text-slate-400">Min</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500 mt-0.5">Bilateral 10-Finger</span>
            </div>
          </div>

          {/* Institutional Signatures & Metallic Stamp Seal */}
          <div className="w-full max-w-2xl grid grid-cols-3 items-end justify-between mt-8 pt-6 border-t border-slate-800 text-left">
            {/* Left Authority Signature */}
            <div className="flex flex-col items-start">
              <span className="font-serif italic text-amber-300 text-base sm:text-lg">Dr. Eleanor Vance</span>
              <div className="w-32 h-0.5 bg-amber-400/60 my-1" />
              <span className="text-[10px] font-mono font-bold text-slate-300">Dean of Academic Standards</span>
              <span className="text-[9px] font-mono text-slate-500">Board of Examiners</span>
            </div>

            {/* Center Embossed 3D Gold Medal Ribbon Seal with Grade V8.5 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-1 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.65)] transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-1 border-2 border-dashed border-amber-300">
                  <span className="text-base sm:text-lg">👑</span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-300 uppercase tracking-wide leading-tight">
                    GRADE {selectedGrade}
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-mono font-extrabold text-amber-200 uppercase tracking-tighter leading-tight mt-0.5">
                    AUTHENTICATED
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-mono text-amber-400/80 uppercase">
                    ISO CERTIFIED 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Right Authority Signature */}
            <div className="flex flex-col items-end text-right">
              <span className="font-serif italic text-amber-300 text-base sm:text-lg">Marcus Sterling</span>
              <div className="w-32 h-0.5 bg-amber-400/60 my-1 ml-auto" />
              <span className="text-[10px] font-mono font-bold text-slate-300">Director of Certification</span>
              <span className="text-[9px] font-mono text-slate-500">Global Keyboard Institute</span>
            </div>
          </div>

          {/* Footer Accreditation & Verification Metadata */}
          <div className="w-full max-w-2xl flex flex-wrap items-center justify-between mt-6 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-400 gap-2">
            <div>
              <span>Credential ID: </span>
              <strong className="text-amber-400 font-bold">{data.verificationId}</strong>
            </div>
            <div>
              <span>Official Grade: </span>
              <strong className="text-amber-300 font-bold">Grade {selectedGrade} (Standard 8.5)</strong>
            </div>
            <div>
              <span>Date Issued: </span>
              <strong className="text-slate-200">{data.date}</strong>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span>🔒 Digitally Verified & Signed</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Toolbar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Official Credential URL:</span>
            <button
              onClick={copyVerifyLink}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300 font-mono rounded-lg transition-colors cursor-pointer text-xs"
            >
              {copied ? '✓ Link Copied!' : '📋 Copy Verification Link'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span>🖨️</span>
              <span>Print Official Diploma / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
