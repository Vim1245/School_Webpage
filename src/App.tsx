/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { NoticeBoard } from './components/NoticeBoard';
import { ProgramsSection } from './components/ProgramsSection';
import { FacultySection } from './components/FacultySection';
import { StudentPortal } from './components/StudentPortal';
import { AdmissionForm } from './components/AdmissionForm';
import { ContactSection } from './components/ContactSection';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { Footer } from './components/Footer';
import { SupabaseConfigStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Fetch Supabase status on load
  const checkSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (err) {
      console.warn('Could not connect to /api/supabase/status:', err);
    }
  };

  useEffect(() => {
    checkSupabaseStatus();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'dark bg-[#0A0C10] text-[#E2E8F0]' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        supabaseStatus={supabaseStatus}
        onOpenSupabaseGuide={() => setIsGuideOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Pending Supabase Schema Setup Notification Banner */}
      {supabaseStatus?.urlSet && !supabaseStatus?.configured && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-200 px-4 py-2.5 text-xs font-mono fixed top-[86px] sm:top-[74px] left-0 right-0 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                <strong>Supabase Connected:</strong> Project <code className="text-white bg-amber-500/20 px-1 py-0.5 rounded font-bold">{supabaseStatus.projectId || 'gbmkshrvjqdbklufjoli'}</code>. Run the SQL schema once to enable direct database storage for admissions & notices.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded shadow text-xs transition-colors"
              >
                Copy SQL & Instructions
              </button>
              <button
                onClick={checkSupabaseStatus}
                className="px-2.5 py-1 bg-[#1E293B] hover:bg-[#2A374A] text-slate-200 rounded border border-slate-700 text-xs transition-colors"
                title="Re-check database tables"
              >
                Re-check Tables 🔄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onNavigate={setActiveTab}
              onOpenSupabaseGuide={() => setIsGuideOpen(true)}
              onOpenAiAssistant={() => setIsAiOpen(true)}
            />
            <NoticeBoard supabaseStatus={supabaseStatus} />
            <ProgramsSection onApply={() => setActiveTab('admission')} />
          </>
        )}

        {activeTab === 'programs' && (
          <ProgramsSection onApply={() => setActiveTab('admission')} />
        )}

        {activeTab === 'notices' && (
          <NoticeBoard supabaseStatus={supabaseStatus} />
        )}

        {activeTab === 'faculty' && (
          <FacultySection supabaseStatus={supabaseStatus} />
        )}

        {activeTab === 'portal' && (
          <StudentPortal />
        )}

        {activeTab === 'admission' && (
          <AdmissionForm supabaseStatus={supabaseStatus} />
        )}

        {activeTab === 'contact' && (
          <ContactSection supabaseStatus={supabaseStatus} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenSupabaseGuide={() => setIsGuideOpen(true)}
      />

      {/* Supabase Beginner Local Setup Guide Modal */}
      <SupabaseGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        supabaseStatus={supabaseStatus}
        onRefreshStatus={checkSupabaseStatus}
      />

      {/* AI Assistant Virtual Concierge Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
}
