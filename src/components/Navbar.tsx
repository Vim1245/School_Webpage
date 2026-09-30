import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Bell,
  UserCheck,
  Bot,
  Database,
  Moon,
  Sun,
  Menu,
  X,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SupabaseConfigStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  supabaseStatus: SupabaseConfigStatus | null;
  onOpenSupabaseGuide: () => void;
  onOpenAiAssistant: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  supabaseStatus,
  onOpenSupabaseGuide,
  onOpenAiAssistant,
  darkMode,
  setDarkMode,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'programs', label: 'Academics' },
    { id: 'notices', label: 'Notices & Events' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'portal', label: 'Student Portal' },
    { id: 'admission', label: 'Admissions 2026' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-[#0F1219]/95 backdrop-blur-md border-b border-[#1E293B] shadow-xl'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : darkMode
          ? 'bg-[#0F1219] border-b border-[#1E293B]'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      {/* Top Banner for Supabase Status & Quick Help */}
      <div className="bg-[#0E1117] border-b border-[#1E293B] text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" /> Admissions Open 2026-27
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              CBSE & IB World School • Admissions Hotline: +1 (800) 555-MNJUA
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Indicator */}
            <button
              onClick={onOpenSupabaseGuide}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                supabaseStatus?.configured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                  : supabaseStatus?.urlSet
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 animate-pulse'
                  : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:bg-[#2A374A]'
              }`}
              title="Click to view database connection status and SQL setup"
            >
              <Database
                className={`w-3 h-3 ${
                  supabaseStatus?.configured
                    ? 'text-emerald-400'
                    : supabaseStatus?.urlSet
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              />
              <span>
                {supabaseStatus?.configured
                  ? 'Supabase Live'
                  : supabaseStatus?.urlSet
                  ? 'Supabase: Run SQL'
                  : 'Supabase (Setup Local)'}
              </span>
              <HelpCircle className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-[#0A0C10] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MNJUA <span className="text-emerald-500 font-light">International</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                School & Learning Portal
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1E293B] text-white font-semibold border border-slate-700/50'
                      : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] border border-transparent hover:border-[#1E293B] transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab('admission')}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
            >
              Apply Online
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#11141B] border-b border-[#1E293B] px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === link.id
                  ? 'bg-[#1E293B] text-emerald-400 font-semibold border border-slate-700/50'
                  : 'text-slate-300 hover:bg-[#1E293B]/50 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#1E293B] flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('admission');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider text-center shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              Apply for Admission 2026
            </button>
            <button
              onClick={() => {
                onOpenSupabaseGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-slate-300 font-medium text-xs text-center flex items-center justify-center gap-2 hover:border-emerald-500/50"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Setup Supabase Local Database</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
