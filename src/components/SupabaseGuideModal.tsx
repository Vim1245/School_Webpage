import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle,
  Copy,
  Terminal,
  ExternalLink,
  Play,
  HelpCircle,
  Key,
  Layers,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { SupabaseConfigStatus } from '../types';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabaseStatus: SupabaseConfigStatus | null;
  onRefreshStatus: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({
  isOpen,
  onClose,
  supabaseStatus,
  onRefreshStatus,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const projectId = supabaseStatus?.projectId || 'gbmkshrvjqdbklufjoli';
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;

  // If credentials are set but tables are missing, default to step 4 (Paste SQL Schema)
  useEffect(() => {
    if (supabaseStatus?.urlSet && !supabaseStatus?.configured) {
      setActiveStep(4);
    }
  }, [supabaseStatus?.urlSet, supabaseStatus?.configured]);

  const sqlScript = `-- ====================================================================
-- MNJUA International School Portal - Supabase Database Schema Script
-- Project ID: ${projectId}
-- Run this in your Supabase SQL Editor:
-- ${sqlEditorUrl}
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Notices & Circulars Table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Academics', 'Events', 'Exams', 'Sports', 'Holidays')),
  date DATE DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  important BOOLEAN DEFAULT FALSE,
  audience TEXT DEFAULT 'All',
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial School Notices
INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Annual Sports Meet 2026 Registration Open', 'Sports', '2026-08-15'::DATE, 'Registrations for track & field, basketball, and swimming events are now open.', true, 'All'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Annual Sports Meet 2026 Registration Open');

INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Parent-Teacher Association (PTA) Meeting', 'Events', '2026-08-20'::DATE, 'Term 1 Parent-Teacher Conference scheduled at Main Auditorium.', true, 'Parents'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Parent-Teacher Association (PTA) Meeting');

INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Term 1 Mid-Semester Examination Schedule', 'Exams', '2026-09-01'::DATE, 'Mid-semester examinations will commence from September 10th.', false, 'Students'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Term 1 Mid-Semester Examination Schedule');

-- 3. Contact Messages & Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Admissions Applications Table
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  dob DATE NOT NULL,
  grade_applying TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Accepted', 'Waitlisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Clean up any prior policies
DROP POLICY IF EXISTS "Allow public read on notices" ON public.notices;
DROP POLICY IF EXISTS "Allow insert on notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public read notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public insert notices" ON public.notices;

DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public read contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public insert contact" ON public.contact_messages;

DROP POLICY IF EXISTS "Allow public insert on admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow public select on admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow public read admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow public insert admissions" ON public.admissions;

-- Policies for public portal operations
CREATE POLICY "Allow public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert notices" ON public.notices FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read contact" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert contact" ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read admissions" ON public.admissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert admissions" ON public.admissions FOR INSERT WITH CHECK (true);

-- Grant privileges to anon and authenticated clients
GRANT ALL ON TABLE public.notices TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.contact_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admissions TO anon, authenticated, service_role;

SELECT 'Success! All 3 tables created and ready for portal data.' AS status;
`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#11141B] border border-[#1E293B] rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#1E293B] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              <Database className="w-3.5 h-3.5" /> Beginner's Local & Supabase Setup Guide
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              How to Run This App Locally with Supabase
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Follow these simple step-by-step instructions even if you have zero coding experience!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161A23]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Live Database Connection Inspector */}
        <div className="p-4 rounded-lg bg-[#0A0C10] border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 font-mono">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Database Connection Status:
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  supabaseStatus?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-bold text-white">
                {supabaseStatus?.configured
                  ? 'Supabase Connected & Active!'
                  : 'Running in Fallback Local API Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {supabaseStatus?.message}
            </p>
          </div>

          <button
            onClick={onRefreshStatus}
            className="px-3.5 py-2 rounded-lg bg-[#161A23] border border-[#1E293B] text-slate-200 text-xs font-mono font-semibold hover:bg-emerald-600 hover:text-white flex items-center gap-1.5 flex-shrink-0 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Connection</span>
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2 overflow-x-auto font-mono">
          {[
            { step: 1, label: '1. Prerequisites' },
            { step: 2, label: '2. Run Locally' },
            { step: 3, label: '3. Supabase Account' },
            { step: 4, label: '4. Paste SQL Schema' },
            { step: 5, label: '5. Set Environment Vars' },
          ].map((st) => (
            <button
              key={st.step}
              onClick={() => setActiveStep(st.step)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeStep === st.step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#161A23] text-slate-400 hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {activeStep === 1 && (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Step 1: Install Node.js on Your Computer
              </h3>
              <p>
                To run this app on your local computer, you only need one free tool called <strong>Node.js</strong>.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs bg-[#0A0C10] p-4 rounded-lg border border-[#1E293B]">
                <li>
                  Go to <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">https://nodejs.org</a> and download the <strong>LTS (Recommended)</strong> installer for Windows or Mac.
                </li>
                <li>Run the installer and click "Next" until finished.</li>
                <li>Open your computer's terminal (Command Prompt / PowerShell on Windows, or Terminal on Mac).</li>
                <li>Type <code className="bg-[#161A23] text-emerald-400 px-1.5 py-0.5 rounded">node -v</code> to verify it's installed.</li>
              </ol>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                Step 2: Run the App on Your Computer
              </h3>
              <p>In your terminal inside the project folder, run these two commands:</p>

              <div className="space-y-2">
                <div className="bg-[#0A0C10] border border-[#1E293B] text-emerald-400 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <span>npm install</span>
                  <button
                    onClick={() => copyToClipboard('npm install', 'cmd1')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedCode === 'cmd1' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="bg-[#0A0C10] border border-[#1E293B] text-emerald-400 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <span>npm run dev</span>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'cmd2')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedCode === 'cmd2' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Open your browser and navigate to <code className="font-mono bg-[#0A0C10] text-emerald-400 px-1 rounded">http://localhost:3000</code>. Your app is now running locally!
              </p>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Step 3: Create a Free Supabase Project
              </h3>
              <p>Supabase provides your database (Postgres) in the cloud for free:</p>

              <ol className="list-decimal list-inside space-y-2 text-xs bg-[#0A0C10] p-4 rounded-lg border border-[#1E293B]">
                <li>
                  Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-bold">https://supabase.com</a> and click <strong>Start your project</strong>.
                </li>
                <li>Sign up with GitHub or Email.</li>
                <li>Click <strong>New Project</strong> and enter a name (e.g. "mnjua-school-db") and set a database password.</li>
                <li>Wait 1 minute for your database to finish initializing.</li>
              </ol>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Step 4: Create Database Tables in Supabase
                </h3>
                <a
                  href={sqlEditorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow transition-all self-start sm:self-auto"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Table Status Tracker */}
              <div className="bg-[#0A0C10] p-3 rounded-lg border border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      supabaseStatus?.tableCheck?.notices ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-slate-300 font-bold">notices:</span>
                  <span className={supabaseStatus?.tableCheck?.notices ? 'text-emerald-400' : 'text-amber-400'}>
                    {supabaseStatus?.tableCheck?.notices ? 'Created ✓' : 'Pending SQL'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      supabaseStatus?.tableCheck?.contact_messages ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-slate-300 font-bold">contact_messages:</span>
                  <span className={supabaseStatus?.tableCheck?.contact_messages ? 'text-emerald-400' : 'text-amber-400'}>
                    {supabaseStatus?.tableCheck?.contact_messages ? 'Created ✓' : 'Pending SQL'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      supabaseStatus?.tableCheck?.admissions ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-slate-300 font-bold">admissions:</span>
                  <span className={supabaseStatus?.tableCheck?.admissions ? 'text-emerald-400' : 'text-amber-400'}>
                    {supabaseStatus?.tableCheck?.admissions ? 'Created ✓' : 'Pending SQL'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                1. Click the <strong>Open Supabase SQL Editor</strong> button above (or open your Supabase project &rarr; <strong>SQL Editor</strong> &rarr; <strong>New query</strong>).
                <br />
                2. Click the <strong>Copy SQL Script</strong> button below.
                <br />
                3. Paste into the SQL editor and click <strong>RUN</strong>.
                <br />
                4. Come back here and click <strong>Check Connection</strong> — all three tables will turn green!
              </p>

              <div className="relative bg-[#0A0C10] border border-[#1E293B] text-slate-300 p-4 rounded-lg font-mono text-[11px] max-h-56 overflow-y-auto">
                <pre>{sqlScript}</pre>
                <button
                  onClick={() => copyToClipboard(sqlScript, 'sql')}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded-lg flex items-center gap-1 shadow"
                >
                  {copiedCode === 'sql' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy SQL Script
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Step 5: Connected Supabase Keys in Local .env
              </h3>
              <p className="text-xs">
                Your Supabase project keys are already configured in this environment:
              </p>

              <div className="bg-[#0A0C10] border border-[#1E293B] text-slate-200 p-4 rounded-lg font-mono text-xs space-y-1 relative break-all">
                <div className="text-emerald-400 font-bold"># Project: {projectId}</div>
                <div>SUPABASE_URL="https://gbmkshrvjqdbklufjoli.supabase.co"</div>
                <div>SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'SUPABASE_URL="https://gbmkshrvjqdbklufjoli.supabase.co"\nSUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWtzaHJ2anFkYmtsdWZqb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODU2MDEsImV4cCI6MjEwNjE2MTYwMX0.H7IJMFLCDaOb0RUDXNjbo60WESk46_OG1n_zR4EMecw"',
                      'env'
                    )
                  }
                  className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                  {copiedCode === 'env' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                When running locally on your computer, paste these lines into a file named <code className="text-emerald-400 font-bold">.env</code> in your project root folder.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#1E293B] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
