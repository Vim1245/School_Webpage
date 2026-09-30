import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  Tag,
  Users,
  X,
  Database,
  Sparkles,
} from 'lucide-react';
import { Notice, SupabaseConfigStatus } from '../types';

interface NoticeBoardProps {
  supabaseStatus: SupabaseConfigStatus | null;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ supabaseStatus }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New Notice Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Academics' | 'Events' | 'Exams' | 'Sports' | 'Holidays'>('Academics');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [audience, setAudience] = useState<'All' | 'Parents' | 'Students' | 'Staff'>('All');

  const categories = ['All', 'Academics', 'Events', 'Exams', 'Sports', 'Holidays'];

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setPosting(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          date: new Date().toISOString().split('T')[0],
          content,
          important,
          audience,
        }),
      });

      if (res.ok) {
        setSuccessMsg(
          supabaseStatus?.configured
            ? 'Notice posted and saved to Supabase database!'
            : 'Notice posted successfully!'
        );
        setTitle('');
        setContent('');
        setImportant(false);
        setShowAddModal(false);
        fetchNotices();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error posting notice:', err);
    } finally {
      setPosting(false);
    }
  };

  const filteredNotices = notices.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-widest">
            <Bell className="w-4 h-4 text-emerald-400" /> Live Circulars & School Announcements
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Notice Board & Event Circulars
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Stay updated with official academic schedules, exam timetables, sports meets, and holiday alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Official Notice</span>
          </button>
        </div>
      </div>

      {/* Database Mode Notice Badge */}
      <div className="flex items-center justify-between bg-[#161A23] p-4 rounded-xl border border-[#1E293B] text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>
            {supabaseStatus?.configured
              ? 'Data Source: Live Supabase Postgres Table ("notices")'
              : 'Data Source: Active Local API Server (Connect Supabase to sync across devices)'}
          </span>
        </div>
        <span className="font-semibold text-emerald-400">
          Total Circulars: {filteredNotices.length}
        </span>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search circulars, exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1E293B] text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#11141B] text-slate-400 border border-[#1E293B] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono">Loading official circulars...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="py-16 text-center bg-[#11141B] rounded-xl border border-[#1E293B] space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Circulars Found</h3>
          <p className="text-xs text-slate-400">
            No notices match your search term or selected category filter.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-xl bg-[#11141B] border transition-all ${
                notice.important
                  ? 'border-amber-500/40 bg-[#161A23]'
                  : 'border-[#1E293B] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        notice.category === 'Sports'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : notice.category === 'Exams'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : notice.category === 'Events'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {notice.category}
                    </span>

                    {notice.important && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                        High Priority
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white pt-1">
                    {notice.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-slate-400 font-mono text-xs whitespace-nowrap bg-[#0A0C10] px-2.5 py-1 rounded border border-[#1E293B]">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{notice.date}</span>
                </div>
              </div>

              <p className="mt-3 text-slate-300 text-xs leading-relaxed">
                {notice.content}
              </p>

              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Audience: {notice.audience || 'All'}
                </span>
                <span className="text-emerald-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  <span>View Details</span> &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0C10]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141B] border border-[#1E293B] rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Post Official School Notice
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fair Registration Deadline Extended"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Events">Events</option>
                    <option value="Exams">Exams</option>
                    <option value="Sports">Sports</option>
                    <option value="Holidays">Holidays</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e: any) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All</option>
                    <option value="Parents">Parents</option>
                    <option value="Students">Students</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Circular Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed information regarding timing, venue, instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="importantNotice"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0A0C10] border-[#1E293B] text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="importantNotice" className="text-xs font-mono text-slate-300">
                  Mark as High-Priority Notice
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  {posting ? 'Publishing...' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
