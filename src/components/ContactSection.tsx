import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { SupabaseConfigStatus } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface ContactSectionProps {
  supabaseStatus: SupabaseConfigStatus | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ supabaseStatus }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    let saved = false;

    // PATH 1: Try backend API (/api/contact)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), subject, message: message.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.supabaseSynced) {
          saved = true;
        }
      }
    } catch (err) {
      console.warn('Backend /api/contact unavailable, proceeding with direct database sync:', err);
    }

    // PATH 2: Direct Supabase client insertion (for deployed/static environments)
    if (!saved) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const contactRow = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || '',
            subject: subject || 'General Inquiry',
            message: message.trim(),
          };

          let insertRes = await supabase
            .from('contact_messages')
            .insert([contactRow])
            .select('id');

          if (insertRes.error && (insertRes.error.code === '42501' || insertRes.error.message?.includes('violates row-level security'))) {
            insertRes = await supabase
              .from('contact_messages')
              .insert([contactRow]);
          }

          if (!insertRes.error) {
            saved = true;
          } else {
            console.error('Supabase contact insert error:', insertRes.error);
            setErrorMessage(`Failed to submit message: ${insertRes.error.message}`);
          }
        }
      } catch (dbErr: any) {
        console.error('Direct database contact error:', dbErr);
        setErrorMessage(`Database error: ${dbErr.message || 'Could not connect to database.'}`);
      }
    }

    if (saved) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setErrorMessage(null);
    } else if (!errorMessage) {
      setErrorMessage('Could not send message to database. Please check your connection and try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get in Touch with MNJUA International School
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Have questions about admissions, campus tours, or academic programs? We are here to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#11141B] p-6 rounded-xl border border-[#1E293B] shadow-2xl space-y-6">
            <h3 className="text-base font-bold text-white">
              Campus Office & Helplines
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">School Campus Address</div>
                  <div className="text-slate-400 mt-0.5">
                    MNJUA International Campus, 100 Academy Boulevard, Education District, Innovation City
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Phone & Admissions Hotline</div>
                  <div className="text-slate-400 mt-0.5">
                    +1 (800) 555-MNJUA • +1 (555) 019-8821
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Email Inquiries</div>
                  <div className="text-slate-400 mt-0.5">
                    admissions@mnjua-school.edu • info@mnjua-school.edu
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Administrative Office Hours</div>
                  <div className="text-slate-400 mt-0.5">
                    Monday – Friday: 8:00 AM – 4:30 PM <br />
                    Saturday: 9:00 AM – 1:00 PM (By Appointment)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#11141B] p-8 rounded-xl border border-[#1E293B] shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <h3 className="text-base font-bold text-white">
              Send an Instant Inquiry Message
            </h3>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              {supabaseStatus?.configured ? 'Saves to Supabase' : 'Local API Active'}
            </span>
          </div>

          {submitted ? (
            <div className="p-6 rounded-lg bg-[#0A0C10] border border-emerald-500/30 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">
                Message Received!
              </h4>
              <p className="text-xs font-mono text-slate-300">
                Thank you for reaching out to MNJUA International School. Our admissions desk will respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3 text-xs font-mono">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Admissions 2026">Admissions 2026</option>
                    <option value="Campus Tour Request">Campus Tour Request</option>
                    <option value="Fee Structure & Scholarship">Fee Structure & Scholarship</option>
                    <option value="Careers / Job Application">Careers / Job Application</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#1E293B] bg-[#0A0C10] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Inquiry Message'}</span>
              </button>
            </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
