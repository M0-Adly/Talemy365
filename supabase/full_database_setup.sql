-- ============================================================
-- TAAL3AMY 365 (تعلّمي 365) - MASTER DATABASE RESET & SETUP
-- Run this ENTIRE script in Supabase Dashboard -> SQL Editor -> New query
-- This drops all old tables and recreates clean tables ready for your content!
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- 2. DROP OLD TABLES & POLICIES CLEANLY
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.course_contents CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.admin_profiles CASCADE;

-- 3. ADMIN PROFILES TABLE
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT DEFAULT 'المدير الأكاديمي',
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. COURSES & CURRICULUM TABLE
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'curriculum',
  duration TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  icon TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('curriculum', 'course'))
);

-- 5. COURSE CONTENTS TABLE
CREATE TABLE public.course_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CONTACT SUBMISSIONS TABLE
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. AUTO-UPDATE TIMESTAMP TRIGGER
CREATE TRIGGER handle_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX idx_courses_published_category_order
  ON public.courses (category, display_order)
  WHERE is_published = true;

CREATE INDEX idx_course_contents_course_id_order
  ON public.course_contents (course_id, display_order);

CREATE INDEX idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- 9. SECURITY DEFINER FUNCTION FOR ADMIN CHECK
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admin profiles policies
CREATE POLICY "Admins can view own profile"
  ON public.admin_profiles FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

-- Courses policies (Public reads published, Admin has full CRUD)
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can view all courses"
  ON public.courses FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE TO authenticated
  USING (public.is_admin());

-- Course contents policies
CREATE POLICY "Public can view content of published courses"
  ON public.course_contents FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_contents.course_id AND courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage all content"
  ON public.course_contents FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Contact submissions policies
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.is_admin());

-- 11. LINK / REGISTER ADMIN USER
-- Ensures Talemy365.eg@gmail.com is an admin in admin_profiles
INSERT INTO public.admin_profiles (id, full_name, role)
SELECT id, 'المدير الأكاديمي', 'admin'
FROM auth.users
WHERE lower(email) = 'talemy365.eg@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Tables remain clean and empty, ready for you to add your courses and curriculums!
