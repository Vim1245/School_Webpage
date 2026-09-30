import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Award,
  Search,
  Edit2,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Database,
  RefreshCw,
} from 'lucide-react';
import { FACULTY_MEMBERS } from '../data/mockData';
import { FacultyMember, SupabaseConfigStatus } from '../types';

interface FacultySectionProps {
  supabaseStatus?: SupabaseConfigStatus | null;
}

export const FacultySection: React.FC<FacultySectionProps> = ({ supabaseStatus }) => {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  // Edit Modal State
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Administration');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');

  const departments = ['All', 'Administration', 'Science & Tech', 'Humanities', 'Mathematics'];
  const departmentOptions = ['Administration', 'Science & Tech', 'Humanities', 'Mathematics'];

  // Fetch faculty from backend API
  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faculty');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFacultyList(data);
        }
      }
    } catch (err) {
      console.warn('Failed to load faculty from API, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Open Edit Modal and prefill existing data
  const handleOpenEdit = (member: FacultyMember) => {
    setEditingMember(member);
    setName(member.name || '');
    setRole(member.role || '');
    setDepartment(member.department || 'Administration');
    setQualification(member.qualification || '');
    setExperience(member.experience || '');
    setEmail(member.email || '');
    setImage(member.image || '');
    setBio(member.bio || '');
    setFormError(null);
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    if (saving) return;
    setEditingMember(null);
    setFormError(null);
  };

  // Submit Updated Faculty Details
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    // Client-side Validation
    if (!name.trim()) {
      setFormError('Faculty name is required.');
      return;
    }
    if (!role.trim()) {
      setFormError('Role / Title is required.');
      return;
    }
    if (!department.trim()) {
      setFormError('Department selection is required.');
      return;
    }
    if (!qualification.trim()) {
      setFormError('Academic qualification is required.');
      return;
    }
    if (!experience.trim()) {
      setFormError('Years of experience is required.');
      return;
    }
    if (!bio.trim()) {
      setFormError('Biography / Description is required.');
      return;
    }
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setFormError('Please enter a valid email address (e.g. name@school.edu).');
        return;
      }
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      name: name.trim(),
      role: role.trim(),
      department: department.trim(),
      qualification: qualification.trim(),
      experience: experience.trim(),
      email: email.trim(),
      image: image.trim(),
      bio: bio.trim(),
    };

    try {
      const res = await fetch(`/api/faculty/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to update faculty member. Please try again.');
      }

      // Updated record from server
      const updatedRecord: FacultyMember = resData.data || {
        ...editingMember,
        ...payload,
      };

      // Immediately reflect changes in the UI list
      setFacultyList((prev) =>
        prev.map((m) => (m.id === editingMember.id ? updatedRecord : m))
      );

      // Show success message
      setSuccessMessage(`Faculty details for "${updatedRecord.name}" updated successfully!`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);

      // Close modal
      setEditingMember(null);
    } catch (err: any) {
      console.error('Error updating faculty:', err);
      setFormError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = facultyList.filter((member) => {
    const matchesDept = dept === 'All' || member.department === dept;
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()) ||
      member.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" /> World-Class Educators
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Meet Our Distinguished Faculty & Leadership
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Our team comprises international scholars, Olympiad mentors, and passionate educators dedicated to student growth.
          </p>
        </div>

        <button
          onClick={fetchFaculty}
          disabled={loading}
          className="self-start md:self-auto px-3.5 py-2 rounded-lg bg-[#11141B] border border-[#1E293B] text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono flex items-center gap-2 transition-colors"
          title="Refresh faculty list"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Database Mode Notice Badge */}
      <div className="flex items-center justify-between bg-[#161A23] p-4 rounded-xl border border-[#1E293B] text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>
            {supabaseStatus?.configured
              ? 'Data Source: Live Supabase Postgres Table ("faculty")'
              : 'Data Source: Active Application Database (Edits sync live)'}
          </span>
        </div>
        <span className="font-semibold text-emerald-400">
          Total Faculty: {filtered.length}
        </span>
      </div>

      {/* Success Notification Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search faculty by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-semibold whitespace-nowrap transition-colors ${
                dept === d
                  ? 'bg-[#1E293B] text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#11141B] text-slate-400 border border-[#1E293B] hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#11141B] rounded-xl border border-[#1E293B] p-8 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-mono text-slate-400">No faculty members found matching your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-[#11141B] rounded-xl border border-[#1E293B] overflow-hidden hover:border-slate-700 transition-all flex flex-col group"
            >
              {/* Image & Header */}
              <div className="relative h-64 overflow-hidden bg-slate-900">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                    <Users className="w-12 h-12 opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="px-2 py-0.5 rounded bg-emerald-600/90 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {member.department}
                  </span>
                  <h3 className="text-base font-bold mt-1 text-white">{member.name}</h3>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {member.role}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{member.qualification}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 truncate mr-2">
                    {member.experience}
                  </span>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Functional Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="px-2.5 py-1.5 rounded bg-[#161A23] border border-[#1E293B] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center gap-1.5 transition-colors"
                      title={`Edit ${member.name}'s details`}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Edit</span>
                    </button>

                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-1.5 rounded bg-[#161A23] border border-[#1E293B] text-emerald-400 hover:border-emerald-500/50 transition-colors"
                        title={`Email ${member.name}`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Faculty Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11141B] border border-[#1E293B] rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1E293B] pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs uppercase font-bold tracking-wider">
                  <Edit2 className="w-3.5 h-3.5" /> Edit Faculty Details
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  Updating: {editingMember.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: <span className="text-emerald-400">{editingMember.id}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={saving}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161A23] transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message inside Modal */}
            {formError && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Role / Designation <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Head of Mathematics & Olympiad Training"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    {departmentOptions.map((deptName) => (
                      <option key={deptName} value={deptName}>
                        {deptName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Academic Qualification <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Ph.D. in Educational Leadership"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Experience <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 15+ Years Faculty"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. educator@mnjua-school.edu"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Photo Image URL */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter faculty photo URL"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Biography & Specialization <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe academic credentials, mentorship focus, and research background..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end gap-3 font-mono">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-[#161A23] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
