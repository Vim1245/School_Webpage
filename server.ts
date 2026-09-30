import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_NOTICES, ACADEMIC_PROGRAMS, FACULTY_MEMBERS, DEMO_STUDENT_RECORD } from './src/data/mockData.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Storage for Fallback Mode
let inMemoryNotices = [...INITIAL_NOTICES];
let inMemoryContacts: any[] = [];
let inMemoryAdmissions: any[] = [];
let inMemoryFaculty = [...FACULTY_MEMBERS];

// Default user-provided credentials
const DEFAULT_SUPABASE_URL = 'https://gbmkshrvjqdbklufjoli.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWtzaHJ2anFkYmtsdWZqb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODU2MDEsImV4cCI6MjEwNjE2MTYwMX0.H7IJMFLCDaOb0RUDXNjbo60WESk46_OG1n_zR4EMecw';

// Helper to get Supabase Server Client
function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (url && key && url.startsWith('https://') && !url.includes('placeholder')) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error('Supabase client init error:', e);
    }
  }
  return null;
}

// -------------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MNJUA International School Portal API',
    timestamp: new Date().toISOString(),
  });
});

// 2. Supabase Connection & Configuration Status
app.get('/api/supabase/status', async (req, res) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  const urlSet = Boolean(url && url.startsWith('https://'));
  const keySet = Boolean(key && key.length > 20);

  // Extract project ref (e.g. gbmkshrvjqdbklufjoli)
  const projectId = url ? url.replace(/^https?:\/\//, '').split('.')[0] : 'gbmkshrvjqdbklufjoli';

  const client = getSupabaseServerClient();
  let configured = false;
  let message = 'Supabase keys not detected in environment variables. Running in local fallback mode.';
  let errors: Record<string, string> = {};
  let tableCheck = {
    notices: false,
    contact_messages: false,
    admissions: false,
  };

  if (client) {
    try {
      // Check notices table
      const { data: nData, error: nError } = await client.from('notices').select('id').limit(1);
      if (!nError) {
        tableCheck.notices = true;
      } else {
        errors.notices = nError.message;
      }

      // Check contact_messages table
      const { data: cData, error: cError } = await client.from('contact_messages').select('id').limit(1);
      if (!cError) {
        tableCheck.contact_messages = true;
      } else {
        errors.contact_messages = cError.message;
      }

      // Check admissions table
      const { data: aData, error: aError } = await client.from('admissions').select('id').limit(1);
      if (!aError) {
        tableCheck.admissions = true;
      } else {
        errors.admissions = aError.message;
      }

      const missing = Object.entries(tableCheck)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);

      if (missing.length === 0) {
        configured = true;
        message = 'Connected live to Supabase! All 3 tables (notices, contact_messages, admissions) are accessible and storing data.';
      } else {
        configured = false;
        message = `Connected to Supabase project (${projectId}), but the SQL tables (${missing.join(', ')}) have not been created yet in your Supabase SQL Editor. Copy the SQL schema and run it in Supabase to start storing data!`;
      }
    } catch (err: any) {
      message = `Failed to connect to Supabase: ${err.message}`;
    }
  }

  const missingTables = Object.entries(tableCheck)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name);

  res.json({
    configured,
    urlSet,
    keySet,
    projectId,
    tableCheck,
    missingTables,
    errors,
    message,
  });
});

// 3. GET Notices
app.get('/api/notices', async (req, res) => {
  const client = getSupabaseServerClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json(data);
      } else if (error) {
        console.warn('Supabase fetch notices query notice:', error.message);
      }
    } catch (err) {
      console.warn('Falling back to in-memory notices due to error:', err);
    }
  }

  res.json(inMemoryNotices);
});

// 4. POST Notice
app.post('/api/notices', async (req, res) => {
  const { title, category, date, content, important, audience } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('notices')
        .insert([
          {
            title,
            category: category || 'Academics',
            date: date || new Date().toISOString().split('T')[0],
            content,
            important: Boolean(important),
            audience: audience || 'All',
          },
        ])
        .select('*');

      if (!error && data && data[0]) {
        console.log('Successfully inserted notice into Supabase:', data[0].id);
        return res.status(201).json({
          ...data[0],
          supabaseSynced: true,
        });
      } else if (error) {
        console.error('Supabase notice insert error:', error.message, error.details, error.hint);
        const fallbackNotice = {
          id: 'n-' + Date.now(),
          title,
          category: category || 'Academics',
          date: date || new Date().toISOString().split('T')[0],
          content,
          important: Boolean(important),
          audience: audience || 'All',
          created_at: new Date().toISOString(),
          supabaseSynced: false,
          needsSchema: error.code === 'PGRST205',
          notice: error.code === 'PGRST205'
            ? 'Saved to local server! Note: Supabase table "notices" does not exist yet. Please run the SQL schema in Supabase SQL editor.'
            : undefined,
        };
        inMemoryNotices.unshift(fallbackNotice);
        return res.status(201).json(fallbackNotice);
      }
    } catch (err: any) {
      console.warn('Failed to insert into Supabase notices:', err.message);
    }
  }

  const fallbackNotice = {
    id: 'n-' + Date.now(),
    title,
    category: category || 'Academics',
    date: date || new Date().toISOString().split('T')[0],
    content,
    important: Boolean(important),
    audience: audience || 'All',
    created_at: new Date().toISOString(),
    supabaseSynced: false,
  };

  inMemoryNotices.unshift(fallbackNotice);
  res.status(201).json(fallbackNotice);
});

// 5. POST Contact Inquiry
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('contact_messages')
        .insert([
          {
            name,
            email,
            phone: phone || '',
            subject: subject || 'General Inquiry',
            message,
          },
        ])
        .select('*');

      if (!error && data && data[0]) {
        console.log('Successfully inserted contact message into Supabase:', data[0].id);
        return res.status(201).json({
          success: true,
          message: 'Thank you! Your message has been saved to your Supabase database.',
          data: data[0],
          supabaseSynced: true,
        });
      } else if (error) {
        console.error('Supabase contact message insert error:', error.message, error.details, error.hint);
        const fallbackContact = {
          id: 'c-' + Date.now(),
          name,
          email,
          phone: phone || '',
          subject: subject || 'General Inquiry',
          message,
          created_at: new Date().toISOString(),
          supabaseSynced: false,
          needsSchema: error.code === 'PGRST205',
        };
        inMemoryContacts.push(fallbackContact);
        return res.status(201).json({
          success: true,
          message: error.code === 'PGRST205'
            ? 'Message received! (Saved in local server because Supabase table "contact_messages" has not been created yet in SQL editor).'
            : `Message received! (Saved locally: ${error.message})`,
          data: fallbackContact,
          supabaseSynced: false,
          needsSchema: error.code === 'PGRST205',
        });
      }
    } catch (err: any) {
      console.warn('Failed to insert contact message into Supabase:', err.message);
    }
  }

  const fallbackContact = {
    id: 'c-' + Date.now(),
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    created_at: new Date().toISOString(),
    supabaseSynced: false,
  };

  inMemoryContacts.push(fallbackContact);
  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received by MNJUA School Office (Saved locally).',
    data: fallbackContact,
    supabaseSynced: false,
  });
});

// 6. POST Admission Application
app.post('/api/admissions', async (req, res) => {
  const { studentName, dob, gradeApplying, parentName, email, phone, address } = req.body;

  if (!studentName || !gradeApplying || !parentName || !email || !phone) {
    return res.status(400).json({ error: 'Please fill in all required admission fields.' });
  }

  const client = getSupabaseServerClient();
  if (client) {
    try {
      // NOTE: Do NOT pass client-side generated string 'id' because Supabase id column is UUID type
      const { data, error } = await client
        .from('admissions')
        .insert([
          {
            student_name: studentName,
            dob: dob || new Date().toISOString().split('T')[0],
            grade_applying: gradeApplying,
            parent_name: parentName,
            email: email,
            phone: phone,
            address: address || '',
            status: 'Pending',
          },
        ])
        .select('*');

      if (!error && data && data[0]) {
        console.log('Successfully inserted admission into Supabase:', data[0].id);
        return res.status(201).json({
          success: true,
          applicationNumber: data[0].id,
          message: 'Application submitted successfully & saved to your Supabase Admissions table!',
          data: data[0],
          supabaseSynced: true,
        });
      } else if (error) {
        console.error('Supabase admission insert error:', error.message, error.details, error.hint);
        const fallbackApp = {
          id: 'adm-' + Date.now(),
          student_name: studentName,
          dob,
          grade_applying: gradeApplying,
          parent_name: parentName,
          email,
          phone,
          address,
          status: 'Pending',
          created_at: new Date().toISOString(),
          supabaseSynced: false,
          needsSchema: error.code === 'PGRST205',
        };
        inMemoryAdmissions.push(fallbackApp);
        return res.status(201).json({
          success: true,
          applicationNumber: fallbackApp.id,
          message: error.code === 'PGRST205'
            ? 'Application received! Notice: Supabase table "admissions" is not created yet, so application was saved in local memory. Run the SQL schema in Supabase SQL editor to store in Supabase.'
            : `Application submitted! (Local fallback: ${error.message})`,
          data: fallbackApp,
          supabaseSynced: false,
          needsSchema: error.code === 'PGRST205',
        });
      }
    } catch (err: any) {
      console.warn('Failed to insert admission into Supabase:', err.message);
    }
  }

  const fallbackApp = {
    id: 'adm-' + Date.now(),
    student_name: studentName,
    dob,
    grade_applying: gradeApplying,
    parent_name: parentName,
    email,
    phone,
    address,
    status: 'Pending',
    created_at: new Date().toISOString(),
    supabaseSynced: false,
  };

  inMemoryAdmissions.push(fallbackApp);
  res.status(201).json({
    success: true,
    applicationNumber: fallbackApp.id,
    message: 'Application submitted successfully! (Saved in local server memory)',
    data: fallbackApp,
    supabaseSynced: false,
  });
});

// 7. GET Academic Programs & Faculty (Convenience endpoints)
app.get('/api/programs', (req, res) => {
  res.json(ACADEMIC_PROGRAMS);
});

app.get('/api/faculty', async (req, res) => {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('faculty')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          department: item.department,
          qualification: item.qualification,
          experience: item.experience,
          image: item.image_url || item.image || '',
          email: item.email || '',
          bio: item.bio || '',
        }));

        // Synchronize in-memory cache with all DB records
        mapped.forEach((dbItem: any) => {
          const idx = inMemoryFaculty.findIndex((f) => f.id === dbItem.id);
          if (idx !== -1) {
            inMemoryFaculty[idx] = { ...dbItem, ...inMemoryFaculty[idx] };
          } else {
            inMemoryFaculty.push(dbItem);
          }
        });

        const merged = mapped;

        return res.json(merged);
      }
    } catch (err: any) {
      console.warn('Failed to fetch from Supabase faculty:', err.message);
    }
  }

  res.json(inMemoryFaculty);
});

// Update existing faculty member
const handleUpdateFaculty = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { name, role, department, qualification, experience, image, email, bio } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Faculty name is required.' });
  }
  if (!role || typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ error: 'Role / Designation is required.' });
  }
  if (!department || typeof department !== 'string' || !department.trim()) {
    return res.status(400).json({ error: 'Department is required.' });
  }
  if (!qualification || typeof qualification !== 'string' || !qualification.trim()) {
    return res.status(400).json({ error: 'Qualification is required.' });
  }
  if (!experience || typeof experience !== 'string' || !experience.trim()) {
    return res.status(400).json({ error: 'Experience is required.' });
  }
  if (!bio || typeof bio !== 'string' || !bio.trim()) {
    return res.status(400).json({ error: 'Biography is required.' });
  }
  if (email && typeof email === 'string' && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
  }

  const updatedPayload = {
    id,
    name: name.trim(),
    role: role.trim(),
    department: department.trim(),
    qualification: qualification.trim(),
    experience: experience.trim(),
    image: typeof image === 'string' ? image.trim() : (image || ''),
    email: email && typeof email === 'string' ? email.trim() : '',
    bio: bio.trim(),
  };

  const client = getSupabaseServerClient();
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  let supabaseSynced = false;
  let supabaseData: any = null;

  if (client && isValidUUID) {
    try {
      const { data, error } = await client
        .from('faculty')
        .update({
          name: updatedPayload.name,
          role: updatedPayload.role,
          department: updatedPayload.department,
          qualification: updatedPayload.qualification,
          experience: updatedPayload.experience,
          image_url: updatedPayload.image,
          email: updatedPayload.email || null,
          bio: updatedPayload.bio,
        })
        .eq('id', id)
        .select('*');

      if (!error && data && data.length > 0) {
        supabaseSynced = true;
        const item = data[0];
        supabaseData = {
          id: item.id,
          name: item.name,
          role: item.role,
          department: item.department,
          qualification: item.qualification,
          experience: item.experience,
          image: item.image_url || item.image || updatedPayload.image,
          email: item.email || '',
          bio: item.bio || '',
          supabaseSynced: true,
        };
      } else if (error) {
        console.warn('Supabase faculty update error:', error.message);
      }
    } catch (err: any) {
      console.warn('Failed to update faculty in Supabase:', err.message);
    }
  }

  const finalRecord = supabaseData || {
    ...updatedPayload,
    supabaseSynced,
  };

  // Update in inMemoryFaculty
  const index = inMemoryFaculty.findIndex((f) => f.id === id);
  if (index !== -1) {
    inMemoryFaculty[index] = finalRecord;
  } else {
    inMemoryFaculty.push(finalRecord);
  }

  return res.json({
    success: true,
    message: supabaseSynced
      ? 'Faculty details updated and saved to Supabase database!'
      : 'Faculty details updated successfully!',
    data: finalRecord,
  });
};

app.put('/api/faculty/:id', handleUpdateFaculty);
app.patch('/api/faculty/:id', handleUpdateFaculty);

app.get('/api/student-portal/demo', (req, res) => {
  res.json(DEMO_STUDENT_RECORD);
});

// 8. Gemini AI School Assistant Endpoint
app.post('/api/ai/assistant', async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      reply:
        "I'm the MNJUA School AI Virtual Assistant! (To activate my real-time Gemini AI intelligence, please ensure GEMINI_API_KEY is configured in your secrets). \n\nHere are quick details about MNJUA International School:\n- **Admissions**: Open for 2026-2027 Academic Session (Pre-K to Grade 12).\n- **Facilities**: Robotics Labs, Olympic Swimming Pool, Indoor Sports Arena, Smart Classrooms.\n- **Timings**: 8:00 AM to 3:15 PM (Mon - Fri).\n- **Contact**: admissions@mnjua-school.edu | +1 (800) 555-MNJUA.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the friendly, professional, and knowledgeable AI Virtual Concierge for "MNJUA International School".
Your goal is to assist parents, students, and prospective applicants with clear, warm, and structured information about the school.

School Details:
- Name: MNJUA International School
- Motto: "Excellence in Academics, Character & Innovation"
- Affiliations: CBSE, IB World School & Cambridge Assessment
- Grades Offered: Early Years (Pre-K to KG), Primary (1-5), Middle School (6-8), High School (9-12)
- Campus Features: 25-acre green eco campus, STEM & AI Robotics Hub, Olympic Swimming Pool, Planetarium, Performing Arts Theater, 100% Board Exam Pass Rate.
- Admissions: Open for 2026-2027. Online application form available on portal.
- Annual Fee Structure: Pre-K/KG ($4,500/yr), Primary ($6,200/yr), Middle ($7,800/yr), High School ($9,500/yr). Scholarships available for sports and academic merit.
- Transport: GPS-tracked AC buses covering 35+ routes.

Be polite, helpful, concise, and encourage parents to submit an online admission form or book a campus tour.`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const reply = response.text || 'Thank you for reaching out to MNJUA International School!';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      reply:
        'Thank you for asking about MNJUA International School. Admissions for the 2026-2027 session are currently open! You can fill out the Admission Application directly in the portal or email admissions@mnjua-school.edu.',
    });
  }
});

// -------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// -------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
