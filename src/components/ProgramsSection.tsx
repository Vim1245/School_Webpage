import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  GraduationCap,
  Sparkles,
  Download,
  Brain,
  Baby,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ACADEMIC_PROGRAMS } from '../data/mockData';

interface ProgramsSectionProps {
  onApply: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onApply }) => {
  const [activeProgramId, setActiveProgramId] = useState<string>(ACADEMIC_PROGRAMS[0].id);

  const selectedProgram =
    ACADEMIC_PROGRAMS.find((p) => p.id === activeProgramId) || ACADEMIC_PROGRAMS[0];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Academic Excellence Pathways
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Curriculum Designed for 21st Century Innovators
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          From play-based early discovery to advanced pre-university STEM & IB streams, MNJUA International empowers every student to excel.
        </p>
      </div>

      {/* Program Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACADEMIC_PROGRAMS.map((prog) => {
          const isSelected = prog.id === activeProgramId;
          return (
            <button
              key={prog.id}
              onClick={() => setActiveProgramId(prog.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#1E293B] text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-[#11141B] text-slate-300 border-[#1E293B] hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-400">
                {prog.gradeRange}
              </div>
              <div className="text-sm font-bold mt-1 text-white">{prog.level}</div>
              <div className="text-xs mt-1 line-clamp-1 text-slate-400">{prog.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Program Showcase Card */}
      <div className="bg-[#11141B] rounded-xl border border-[#1E293B] overflow-hidden shadow-2xl grid lg:grid-cols-12">
        {/* Left Info Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-[#161A23] border border-[#1E293B] text-emerald-400 font-mono text-xs font-bold">
                {selectedProgram.gradeRange}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Curriculum: <strong className="text-white">{selectedProgram.curriculum}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedProgram.level}: {selectedProgram.title}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedProgram.description}
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                Key Learning Pillars & Facilities
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedProgram.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
                    <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1E293B] flex flex-wrap items-center gap-4">
            <button
              onClick={onApply}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
            >
              <span>Apply for {selectedProgram.level}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert(`Downloading official syllabus prospectus for ${selectedProgram.level}...`)}
              className="px-5 py-3 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-slate-300 font-mono text-xs hover:border-slate-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Prospectus PDF</span>
            </button>
          </div>
        </div>

        {/* Right Feature Photo */}
        <div className="lg:col-span-5 relative min-h-[300px]">
          <img
            src={selectedProgram.image}
            alt={selectedProgram.level}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <div className="text-xs font-mono text-emerald-400">MNJUA Campus Life</div>
            <div className="text-base font-bold">{selectedProgram.level} Classroom Environment</div>
          </div>
        </div>
      </div>
    </div>
  );
};
