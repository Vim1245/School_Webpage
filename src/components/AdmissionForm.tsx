import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle, FileText, User, Mail, Phone, MapPin, Calendar, Database, AlertCircle } from 'lucide-react';
import { SupabaseConfigStatus } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface AdmissionFormProps {
  supabaseStatus: SupabaseConfigStatus | null;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ supabaseStatus }) => {
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [gradeApplying, setGradeApplying] = useState('Grade 1');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const submissionPayload = {
      student_name: studentName.trim(),
      dob: dob || new Date().toISOString().split('T')[0],
      grade_applying: gradeApplying,
      parent_name: parentName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || '',
      status: 'Pending',
    };

    let savedData: any = null;
    let savedInDatabase = false;

    // PATH 1: Try backend API (/api/admissions)
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: submissionPayload.student_name,
          dob: submissionPayload.dob,
          gradeApplying: submissionPayload.grade_applying,
          parentName: submissionPayload.parent_name,
          email: submissionPayload.email,
          phone: submissionPayload.phone,
          address: submissionPayload.address,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.supabaseSynced && data.data) {
          savedData = data;
          savedInDatabase = true;
        }
      }
    } catch (apiErr) {
      console.warn('Backend /api/admissions call not available, falling back to direct database insertion:', apiErr);
    }

    // PATH 2: Direct Supabase client insertion (ensures production & static deployments write to the database)
    if (!savedInDatabase) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          // Attempt insert with select('id'); if RLS denies select for public users (42501), retry insert without select
          let insertRes = await supabase
            .from('admissions')
            .insert([submissionPayload])
            .select('id');

          if (insertRes.error && (insertRes.error.code === '42501' || insertRes.error.message?.includes('violates row-level security'))) {
            insertRes = await supabase
              .from('admissions')
              .insert([submissionPayload]);
          }

          if (!insertRes.error) {
            const appId = (insertRes.data && insertRes.data[0]?.id) || 'ADM-' + Math.floor(100000 + Math.random() * 900000);
            savedData = {
              success: true,
              applicationNumber: appId,
              message: 'Application submitted successfully & saved to your Supabase Admissions table!',
              data: (insertRes.data && insertRes.data[0]) || { ...submissionPayload, id: appId },
              supabaseSynced: true,
            };
            savedInDatabase = true;
          } else {
            console.error('Supabase direct admission insert error:', insertRes.error);
            setErrorMessage(`Failed to save application to database: ${insertRes.error.message}`);
          }
        } else {
          setErrorMessage('Database connection could not be established. Please check Supabase credentials.');
        }
      } catch (dbErr: any) {
        console.error('Database connection error:', dbErr);
        setErrorMessage(`Database error: ${dbErr.message || 'Could not connect to database.'}`);
      }
    }

    if (savedInDatabase && savedData) {
      setSubmittedData(savedData);
      setErrorMessage(null);
    } else if (!errorMessage) {
      setErrorMessage('Could not record application in the database. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Admissions Session 2026 - 2027
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Online Student Admission Application
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Begin your child’s transformative journey at MNJUA International School. Complete the simple form below to initiate review.
        </p>
      </div>

      {submittedData ? (
        <div className="bg-[#11141B] p-8 rounded-xl border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">
              Application Submitted Successfully!
            </h2>
            <p className="text-xs text-slate-300">
              {submittedData.message}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0A0C10] border border-[#1E293B] text-left max-w-md mx-auto space-y-2 text-xs font-mono">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Application ID:</span>
              <span className="text-emerald-400">{submittedData.applicationNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Student Name:</span>
              <span className="text-slate-200">{studentName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Grade Applying:</span>
              <span className="text-slate-200">{gradeApplying}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Database Sync:</span>
              <span className={`font-bold ${submittedData.supabaseSynced ? 'text-emerald-400' : 'text-amber-400'}`}>
                {submittedData.supabaseSynced
                  ? 'Synced directly to Supabase DB'
                  : 'Saved in Local Server Fallback'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmittedData(null);
              setStudentName('');
              setParentName('');
              setEmail('');
              setPhone('');
              setAddress('');
            }}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <div className="bg-[#11141B] p-8 sm:p-10 rounded-xl border border-[#1E293B] shadow-2xl space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-[#1E293B] pb-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-4 h-4 text-emerald-400" />
              Submissions sync directly with production Supabase Table "admissions"
            </span>
            <span className="font-semibold text-rose-400">* Required Fields</span>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3 text-xs font-mono">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                1. Student Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya K. Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Grade Applying For *
                </label>
                <select
                  value={gradeApplying}
                  onChange={(e) => setGradeApplying(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pre-Kindergarten">Pre-Kindergarten (Age 3+)</option>
                  <option value="Kindergarten">Kindergarten (Age 4+)</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6 (Middle School STEM Track)</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9 (High School CBSE/IB)</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11 (Science / Commerce / Arts)</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
            </div>

            {/* Parent Section */}
            <div className="space-y-4 pt-4 border-t border-[#1E293B]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                2. Parent / Guardian Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City, State, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Submit Admission Application'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
