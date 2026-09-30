import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Lock,
  Search,
  Sparkles,
} from 'lucide-react';
import { DEMO_STUDENT_RECORD } from '../data/mockData';

export const StudentPortal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [rollInput, setRollInput] = useState('MNJUA-2026-0892');
  const student = DEMO_STUDENT_RECORD;

  const handleSimulatedDownload = (title: string) => {
    alert(`Downloading ${title} PDF for ${student.name} (${student.rollNo})...`);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-widest">
            <UserCheck className="w-4 h-4 text-emerald-400" /> Student & Parent Digital Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Academic Performance & Fee Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View real-time term grades, attendance metrics, exam blueprints, and digital fee receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="px-4 py-2 rounded-lg border border-[#1E293B] bg-[#11141B] text-slate-300 font-mono text-xs hover:border-slate-700 flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isLoggedIn ? 'Sign Out Demo' : 'Sign In Demo'}</span>
          </button>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="max-w-md mx-auto my-12 bg-[#11141B] p-8 rounded-xl border border-[#1E293B] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Student Portal Sign In</h3>
            <p className="text-xs text-slate-400">
              Enter Roll Number or Student ID to view gradebook & attendance records.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Student Roll Number / ID
              </label>
              <input
                type="text"
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              Access Student Record
            </button>

            <p className="text-[11px] font-mono text-center text-slate-500">
              Demo Mode Active: Pre-loaded with student record <strong className="text-slate-300">Aarav V. Sharma</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Student Profile Overview Card */}
          <div className="bg-[#11141B] border border-[#1E293B] text-white p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-[#161A23] border border-[#1E293B] flex items-center justify-center text-xl font-bold font-mono text-emerald-400">
                AS
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                    Active Student
                  </span>
                  <span className="text-xs font-mono text-slate-400">Roll No: {student.rollNo}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">{student.name}</h2>
                <div className="text-xs font-mono text-slate-400">
                  {student.grade} - Section {student.section} • CBSE Senior Secondary Pathway
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-[#0A0C10] p-4 rounded-lg border border-[#1E293B]">
              <div className="text-center px-3 border-r border-[#1E293B]">
                <div className="text-xl font-mono font-bold text-amber-400">{student.overallGpa}</div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Overall Cumulative GPA</div>
              </div>

              <div className="text-center px-3 border-r border-[#1E293B]">
                <div className="text-xl font-mono font-bold text-emerald-400">{student.attendancePercentage}%</div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Term Attendance Rate</div>
              </div>

              <div className="text-center px-3">
                <div className="text-xl font-mono font-bold text-emerald-400">{student.feeStatus}</div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Term 1 Tuition Status</div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Gradebook & Fee Downloads */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Subject Gradebook */}
            <div className="lg:col-span-8 bg-[#11141B] p-6 sm:p-8 rounded-xl border border-[#1E293B] space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Term 1 Subject Performance Breakdown
                </h3>
                <button
                  onClick={() => handleSimulatedDownload('Term Report Card')}
                  className="px-3 py-1.5 rounded bg-[#161A23] border border-[#1E293B] text-emerald-400 font-mono text-xs flex items-center gap-1.5 hover:border-emerald-500/50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Report Card PDF</span>
                </button>
              </div>

              <div className="space-y-3">
                {student.subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#0A0C10] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">
                        {sub.name}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Instructor: {sub.teacher}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Score Bar */}
                      <div className="w-32 hidden sm:block bg-[#161A23] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${sub.score}%` }}
                        />
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-white">
                          {sub.score}/100
                        </div>
                        <div className="text-[10px] font-bold text-emerald-400">
                          Grade: {sub.grade}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Fee Center & Recent Activity */}
            <div className="lg:col-span-4 space-y-6">
              {/* Fee Receipt Card */}
              <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Digital Fee Receipts & Payments
                </h3>

                <div className="p-4 rounded-lg bg-[#0A0C10] border border-[#1E293B] space-y-2">
                  <div className="flex justify-between text-xs font-mono text-emerald-400 font-semibold">
                    <span>Term 1 Tuition & STEM Fee</span>
                    <span>PAID</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-white">
                    $2,450.00
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Paid via Bank Transfer on July 10, 2026 • Ref: TXN-99812
                  </div>
                </div>

                <button
                  onClick={() => handleSimulatedDownload('Official Fee Receipt #TXN-99812')}
                  className="w-full py-2.5 rounded-lg border border-[#1E293B] bg-[#161A23] text-slate-300 font-mono text-xs hover:border-slate-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Tax Fee Receipt</span>
                </button>
              </div>

              {/* Achievements & Activities */}
              <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Recent Achievements & Badges
                </h3>

                <div className="space-y-2.5">
                  {student.recentActivities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0A0C10] border border-[#1E293B] text-xs font-mono space-y-1"
                    >
                      <div className="font-bold text-slate-200">
                        {act.title}
                      </div>
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>{act.date}</span>
                        <span className="font-bold text-emerald-400">
                          {act.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
