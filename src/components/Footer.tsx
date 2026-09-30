import React from 'react';
import { GraduationCap, ShieldCheck, Heart, Database, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenSupabaseGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabaseGuide }) => {
  return (
    <footer className="bg-[#0A0C10] text-slate-400 border-t border-[#1E293B] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-base text-white">
                MNJUA <span className="text-emerald-400 font-mono font-light">International</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Excellence in Academics, Character & World Innovation. CBSE & IB World School accredited.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Full-Stack App + Supabase DB Ready</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-emerald-400 transition-colors">
                  Academic Pathways
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notices')} className="hover:text-emerald-400 transition-colors">
                  Notice Board & Circulars
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faculty')} className="hover:text-emerald-400 transition-colors">
                  Faculty Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-emerald-400 transition-colors">
                  Student & Parent Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Admissions & Local Setup */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Admissions & Database
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('admission')} className="hover:text-emerald-400 transition-colors">
                  Apply Online (2026-27)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors">
                  Book a Campus Tour
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSupabaseGuide}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Setup Supabase Local DB</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Campus Contact
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+1 (800) 555-MNJUA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>admissions@mnjua-school.edu</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                MNJUA International Campus, 100 Academy Blvd, Innovation City.
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1E293B] text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} MNJUA International School. All Rights Reserved.</div>
          <div className="flex items-center gap-1">
            <span>Built with React, Express, Vite & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
