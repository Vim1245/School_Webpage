import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  BrainCircuit,
  Database,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
} from 'lucide-react';
import { SCHOOL_STATS } from '../data/mockData';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenSupabaseGuide: () => void;
  onOpenAiAssistant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenSupabaseGuide,
  onOpenAiAssistant,
}) => {
  return (
    <div className="relative pt-28 pb-16 overflow-hidden bg-[#0A0C10]">
      {/* Soft Background Radial Gradient & Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Hero Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CBSE & IB World School Accredited • Ranked #1 STEM Academy</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Empowering Minds, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Shaping Future Leaders
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              MNJUA International School provides a holistic 21st-century educational journey. Combining academic rigor, cutting-edge STEM robotics labs, world-class athletic facilities, and values-based character development.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('admission')}
                className="px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 group"
              >
                <span>Apply for Admission 2026</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('notices')}
                className="px-6 py-3.5 rounded-lg bg-[#1E293B] border border-slate-700 text-white font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Notice Board & Events</span>
              </button>

              <button
                onClick={onOpenSupabaseGuide}
                className="px-5 py-3.5 rounded-lg bg-[#161A23] border border-emerald-500/30 text-emerald-400 font-mono text-xs hover:bg-emerald-500/10 transition-all flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Local Supabase Guide</span>
              </button>
            </div>

            {/* Quick Feature Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-slate-400 border-t border-[#1E293B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Board Pass Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>GPS-Tracked AC Buses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Scholarships Available</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#1E293B] bg-[#11141B]">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                  alt="Students at MNJUA School"
                  className="w-full h-[420px] object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#161A23]/90 border border-[#1E293B] text-xs font-mono text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> State-of-the-Art Campus
                  </div>
                  <h3 className="text-xl font-bold">25-Acre Eco-Friendly Infrastructure</h3>
                  <p className="text-xs text-slate-400">
                    Equipped with modern science labs, smart digital classrooms, robotics arenas, and indoor athletic courts.
                  </p>
                </div>
              </div>

              {/* Floating Quick Feature Card 1 */}
              <div className="absolute -top-6 -left-6 bg-[#161A23] p-4 rounded-xl shadow-2xl border border-[#1E293B] hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Innovation Hub</div>
                  <div className="text-sm font-bold text-white">AI & Robotics Lab</div>
                </div>
              </div>

              {/* Floating Quick Feature Card 2 */}
              <div
                onClick={() => onNavigate('portal')}
                className="absolute -bottom-6 -right-6 bg-[#161A23] p-4 rounded-xl shadow-2xl border border-[#1E293B] flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Student Portal</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    <span>Gradebook & Fees</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
          {SCHOOL_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#11141B] p-5 rounded-xl border border-[#1E293B] text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* School Core Pillars */}
        <div className="mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 font-mono">
              Why Choose MNJUA International
            </h2>
            <p className="text-3xl font-extrabold text-white">
              A Culture Built Around Excellence & Discovery
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#161A23] border border-[#1E293B] text-emerald-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Global Pedagogy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless integration of national CBSE curricula with international Cambridge and IB frameworks.
              </p>
            </div>

            <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#161A23] border border-[#1E293B] text-emerald-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">STEM & AI Labs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hands-on robotics, 3D printing, machine learning basics, and competitive olympiad mentoring.
              </p>
            </div>

            <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#161A23] border border-[#1E293B] text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Sports & Arts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Olympic swimming pool, basketball courts, martial arts, drama theater, and orchestral music.
              </p>
            </div>

            <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#161A23] border border-[#1E293B] text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Values & Safety</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                24/7 CCTV security, trained medical staff, counselor guidance, and character building programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
