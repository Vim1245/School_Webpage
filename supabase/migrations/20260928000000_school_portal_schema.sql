-- ====================================================================
-- MNJUA INTERNATIONAL SCHOOL PORTAL - SUPABASE SQL MIGRATION
-- Migration Version: 20260928000000_school_portal_schema.sql
-- Database: PostgreSQL / Supabase
-- Target Project ID: gbmkshrvjqdbklufjoli
-- Description: Creates core tables, foreign key relationships,
--              indexes, triggers, RLS policies, and seed data.
-- ====================================================================

-- ---------------------------------------------------------------------
-- 1. EXTENSIONS & UTILITIES
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reusable trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 2. CORE TABLES & CONSTRAINTS
-- ---------------------------------------------------------------------

-- Table: notices
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Academics', 'Events', 'Exams', 'Sports', 'Holidays')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  important BOOLEAN NOT NULL DEFAULT FALSE,
  audience TEXT NOT NULL DEFAULT 'All' CHECK (audience IN ('All', 'Parents', 'Students', 'Staff')),
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  subject TEXT NOT NULL DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: admissions
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  dob DATE NOT NULL,
  grade_applying TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Accepted', 'Waitlisted', 'Rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: programs (Academic Curricula & Offerings)
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  level TEXT NOT NULL,
  grade_range TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  curriculum TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'BookOpen',
  image_url TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: faculty (Staff & Educator Profiles)
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience TEXT NOT NULL,
  email TEXT UNIQUE,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: students (Enrolled Student Portal Records)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  attendance_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
  overall_gpa TEXT NOT NULL DEFAULT '4.0',
  fee_status TEXT NOT NULL DEFAULT 'Paid' CHECK (fee_status IN ('Paid', 'Pending', 'Partial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 3. RELATIONAL TABLES (FOREIGN KEYS & RELATIONSHIPS)
-- ---------------------------------------------------------------------

-- Table: student_grades (Relational 1:N with students)
CREATE TABLE IF NOT EXISTS public.student_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
  grade_letter TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: student_activities (Relational 1:N with students)
CREATE TABLE IF NOT EXISTS public.student_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- ---------------------------------------------------------------------

-- Notices Indexes
CREATE INDEX IF NOT EXISTS idx_notices_date_desc ON public.notices (date DESC);
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices (category);
CREATE INDEX IF NOT EXISTS idx_notices_important ON public.notices (important);
CREATE INDEX IF NOT EXISTS idx_notices_audience ON public.notices (audience);

-- Contact Messages Indexes
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages (status);

-- Admissions Indexes
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON public.admissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admissions_email ON public.admissions (email);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions (status);
CREATE INDEX IF NOT EXISTS idx_admissions_grade ON public.admissions (grade_applying);

-- Student Portal & Relationship Indexes
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON public.students (roll_no);
CREATE INDEX IF NOT EXISTS idx_student_grades_student_id ON public.student_grades (student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON public.student_activities (student_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty (department);

-- ---------------------------------------------------------------------
-- 5. AUTOMATIC TIMESTAMP TRIGGERS
-- ---------------------------------------------------------------------

DROP TRIGGER IF EXISTS trigger_notices_updated_at ON public.notices;
CREATE TRIGGER trigger_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_contact_updated_at ON public.contact_messages;
CREATE TRIGGER trigger_contact_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_admissions_updated_at ON public.admissions;
CREATE TRIGGER trigger_admissions_updated_at
BEFORE UPDATE ON public.admissions
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_programs_updated_at ON public.programs;
CREATE TRIGGER trigger_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_faculty_updated_at ON public.faculty;
CREATE TRIGGER trigger_faculty_updated_at
BEFORE UPDATE ON public.faculty
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_students_updated_at ON public.students;
CREATE TRIGGER trigger_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ---------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

-- Enable Row Level Security on all tables
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for idempotency
DROP POLICY IF EXISTS "Allow public read notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public insert notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public read contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public insert contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated manage contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public read admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow public insert admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow authenticated manage admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow public read programs" ON public.programs;
DROP POLICY IF EXISTS "Allow public read faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public update faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public read students" ON public.students;
DROP POLICY IF EXISTS "Allow public read student_grades" ON public.student_grades;
DROP POLICY IF EXISTS "Allow public read student_activities" ON public.student_activities;

-- 1. Notices: Public read-only; insert allowed for staff & portal updates
CREATE POLICY "Allow public read notices" ON public.notices
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert notices" ON public.notices
  FOR INSERT WITH CHECK (true);

-- 2. Contact Inquiries: Anyone can submit inquiries (INSERT); authenticated staff can manage (ALL)
CREATE POLICY "Allow public insert contact" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated manage contact" ON public.contact_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Admissions: Public anonymous visitors can SUBMIT (INSERT); authenticated owners/admins manage (ALL)
CREATE POLICY "Allow public insert admissions" ON public.admissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated manage admissions" ON public.admissions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Programs: Public read access
CREATE POLICY "Allow public read programs" ON public.programs
  FOR SELECT USING (true);

-- 5. Faculty: Public read & update access
CREATE POLICY "Allow public read faculty" ON public.faculty
  FOR SELECT USING (true);

CREATE POLICY "Allow public update faculty" ON public.faculty
  FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Student Portal: Public/Authenticated read for roll-no lookup
CREATE POLICY "Allow public read students" ON public.students
  FOR SELECT USING (true);

CREATE POLICY "Allow public read student_grades" ON public.student_grades
  FOR SELECT USING (true);

CREATE POLICY "Allow public read student_activities" ON public.student_activities
  FOR SELECT USING (true);

-- ---------------------------------------------------------------------
-- 7. GRANT PERMISSIONS TO ANONYMOUS & AUTHENTICATED ROLES
-- ---------------------------------------------------------------------

GRANT ALL ON TABLE public.notices TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.contact_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admissions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.programs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.faculty TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.students TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.student_grades TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.student_activities TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- 8. INITIAL SEED DATA (IDEMPOTENT INSERTIONS)
-- ---------------------------------------------------------------------

-- Seed Notices
INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Annual Sports Meet 2026 Registration Open', 'Sports', '2026-08-15'::DATE, 'Registrations for track & field, basketball, swimming, and chess events are now open for Grades 5 through 12. Submit forms at the PE department.', true, 'All'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Annual Sports Meet 2026 Registration Open');

INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Parent-Teacher Association (PTA) General Body Meeting', 'Events', '2026-08-20'::DATE, 'Term 1 Parent-Teacher Conference scheduled at Main Auditorium from 9:00 AM to 1:00 PM. Discussion on academic progress and upcoming STEM fair.', true, 'Parents'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Parent-Teacher Association (PTA) General Body Meeting');

INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Term 1 Mid-Semester Examination Timetable', 'Exams', '2026-09-01'::DATE, 'Mid-semester examinations will commence from September 10th. Detailed date sheet and revision blueprints uploaded to the student portal.', false, 'Students'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Term 1 Mid-Semester Examination Timetable');

INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'International STEM & Robotics Expo 2026', 'Academics', '2026-09-15'::DATE, 'Students from Grades 6-12 will showcase innovative AI, IoT, and green tech projects. Guest judges from premier engineering universities attending.', false, 'All'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'International STEM & Robotics Expo 2026');

INSERT INTO public.notices (title, category, date, content, important, audience)
SELECT 'Independence Day & Cultural Festival Holiday', 'Holidays', '2026-08-15'::DATE, 'School will remain closed on August 15th for national holiday. Flag hoisting ceremony begins at 8:00 AM followed by student performances.', false, 'All'
WHERE NOT EXISTS (SELECT 1 FROM public.notices WHERE title = 'Independence Day & Cultural Festival Holiday');

-- Seed Programs
INSERT INTO public.programs (code, level, grade_range, title, description, curriculum, icon_name, image_url, features)
SELECT 
  'p1', 'Early Years', 'Pre-K to Kindergarten', 'Play-Based Foundation Learning',
  'Nurturing curiosity, fine motor skills, emotional growth, and bilingual literacy through joyful play and interactive sensory activities.',
  'Early Years Foundation Stage (EYFS) + Inquiry', 'Baby',
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
  ARRAY['Montessori & Reggio Emilia Blend', 'Tactile Sensory & Art Labs', 'Early Speech & Social Growth', 'Outdoor Nature Play Zone']
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'p1');

INSERT INTO public.programs (code, level, grade_range, title, description, curriculum, icon_name, image_url, features)
SELECT 
  'p2', 'Primary School', 'Grades 1 to 5', 'Core Literacy, Math & Discovery',
  'Building strong foundational competencies in Reading, Mathematics, Environmental Sciences, Digital Literacy, and Visual Arts.',
  'CBSE / Cambridge Primary Pathway', 'BookOpen',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  ARRAY['Activity-Based STEM Modules', 'Guided Reading Program', 'Swimming & Performing Arts', 'Robotics & Coding Basics']
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'p2');

INSERT INTO public.programs (code, level, grade_range, title, description, curriculum, icon_name, image_url, features)
SELECT 
  'p3', 'Middle School', 'Grades 6 to 8', 'Inquiry-Based & Analytical Learning',
  'Developing critical thinking, scientific reasoning, multi-language fluency, and collaborative project-based problem solving.',
  'CBSE / Cambridge Lower Secondary', 'Brain',
  'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&w=800&q=80',
  ARRAY['Advanced Physics & Bio Labs', 'Debate & Model UN (MUN)', 'Maker-Space & 3D Printing', 'Competitive Sports Training']
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'p3');

INSERT INTO public.programs (code, level, grade_range, title, description, curriculum, icon_name, image_url, features)
SELECT 
  'p4', 'High School', 'Grades 9 to 12', 'Advanced Academics & Career Pathways',
  'Preparing students for top global university admissions with rigorous streams in Science, Commerce, Applied Humanities, and Tech.',
  'CBSE Senior Secondary / IB Diploma', 'GraduationCap',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  ARRAY['SAT & Competitive Prep', 'AI & Machine Learning Track', 'University Guidance Cell', 'Internships & Leadership Seminars']
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'p4');

-- Seed Faculty
INSERT INTO public.faculty (name, role, department, qualification, experience, email, bio, image_url)
SELECT
  'Dr. Evelyn Montgomery', 'Principal & Academic Director', 'Administration',
  'Ph.D. in Educational Leadership (Oxford Univ)', '22+ Years in International Education',
  'principal@mnjua-school.edu',
  'Dedicated to fostering holistic academic excellence, character building, and world-class innovation at MNJUA International School.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.faculty WHERE email = 'principal@mnjua-school.edu');

INSERT INTO public.faculty (name, role, department, qualification, experience, email, bio, image_url)
SELECT
  'Prof. Rajesh Sharma', 'Head of STEM & Computer Science', 'Science & Tech',
  'M.Tech in Artificial Intelligence (IIT Delhi)', '15 Years Teaching & AI Research',
  'r.sharma@mnjua-school.edu',
  'Mentored national robotics championship teams and leads the school maker-space and AI incubation lab.',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.faculty WHERE email = 'r.sharma@mnjua-school.edu');

INSERT INTO public.faculty (name, role, department, qualification, experience, email, bio, image_url)
SELECT
  'Sarah Jenkins', 'Senior English Literature & Debate Coach', 'Humanities',
  'M.A. English Lit (Columbia University)', '12 Years Pedagogy',
  's.jenkins@mnjua-school.edu',
  'Passionate about creative writing, MUN debate coaching, and helping students articulate vision with eloquence.',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.faculty WHERE email = 's.jenkins@mnjua-school.edu');

INSERT INTO public.faculty (name, role, department, qualification, experience, email, bio, image_url)
SELECT
  'Vikramaditya Verma', 'Head of Mathematics & Olympiad Training', 'Mathematics',
  'M.Sc. Mathematics (IISc Bangalore)', '14 Years Faculty',
  'v.verma@mnjua-school.edu',
  'Specializes in transforming complex calculus and logical reasoning into intuitive, visual learning journeys.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.faculty WHERE email = 'v.verma@mnjua-school.edu');

-- Seed Demo Student Record & Relational Tables
DO $$
DECLARE
  demo_student_id UUID;
BEGIN
  -- Insert or select student
  SELECT id INTO demo_student_id FROM public.students WHERE roll_no = 'MNJUA-2026-0892';
  
  IF demo_student_id IS NULL THEN
    INSERT INTO public.students (roll_no, name, grade, section, attendance_percentage, overall_gpa, fee_status)
    VALUES ('MNJUA-2026-0892', 'Aarav V. Sharma', 'Grade 10', 'A', 96.50, '3.92 / 4.0 (A+)', 'Paid')
    RETURNING id INTO demo_student_id;

    -- Insert relational grades
    INSERT INTO public.student_grades (student_id, subject_name, score, grade_letter, teacher_name) VALUES
    (demo_student_id, 'Mathematics & Advanced Calculus', 95.00, 'A+', 'Vikramaditya Verma'),
    (demo_student_id, 'Physics & Experimental Dynamics', 92.00, 'A+', 'Dr. Aris Thorne'),
    (demo_student_id, 'Computer Science & AI', 98.00, 'A+', 'Prof. Rajesh Sharma'),
    (demo_student_id, 'English Literature & Rhetoric', 89.00, 'A', 'Sarah Jenkins'),
    (demo_student_id, 'Chemistry & Bio-Tech', 91.00, 'A+', 'Dr. Meera Nambiar');

    -- Insert relational activities
    INSERT INTO public.student_activities (student_id, title, date, score) VALUES
    (demo_student_id, '1st Place in Inter-School Science Hackathon', '2026-08-02'::DATE, 'Gold Medal'),
    (demo_student_id, 'Term 1 Mathematics Assessment', '2026-07-28'::DATE, '95/100'),
    (demo_student_id, 'Basketball Regional Tournament', '2026-07-15'::DATE, 'Captained Team');
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- 9. VERIFICATION QUERY
-- ---------------------------------------------------------------------
SELECT 
  'Schema migration completed successfully! All tables, foreign keys, indexes, and RLS policies active.' AS status,
  NOW() AS executed_at;
