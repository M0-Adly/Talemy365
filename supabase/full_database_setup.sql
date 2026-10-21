-- ============================================================
-- TAAL3AMY 365 (تعلّمي 365) - MASTER DATABASE RESET & SETUP
-- Run this ENTIRE script in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- 2. مسح الجداول القديمة بالكامل لبدء صفحة نظيفة
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.course_contents CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.admin_profiles CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 3. جدول حسابات المدراء في قاعدة البيانات (يمكنك إضافة أي مدير من هنا مباشرة)
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT DEFAULT 'مدير المنصة',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. جدول المناهج والكورسات (المناهج التعليمية / الكورسات)
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

-- 5. جدول موضوعات وعناصر الكورس
CREATE TABLE public.course_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. جدول رسائل واستفسارات الزوار
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. التحديث التلقائي للتاريخ
CREATE TRIGGER handle_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- 8. الفهارس لتسريع الموقع
CREATE INDEX idx_courses_published_category_order
  ON public.courses (category, display_order)
  WHERE is_published = true;

CREATE INDEX idx_course_contents_course_id_order
  ON public.course_contents (course_id, display_order);

CREATE INDEX idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- 9. حماية البيانات (Row Level Security)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- الصلاحيات على الجداول:
-- السماح للعامة برؤية الكورسات المنشورة فقط
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- السماح للجميع بإرسال رسالة تواصل
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 10. إضافة حساب المدير الافتراضي في جدول admin_users
INSERT INTO public.admin_users (email, password, full_name)
VALUES (
  'Talemy365.eg@gmail.com',
  'Talemy365##25@',
  'المدير العام'
)
ON CONFLICT (email) DO UPDATE 
SET password = 'Talemy365##25@', full_name = 'المدير العام';

-- يمكنك أيضاً إضافة أي حساب مدير إضافي مستقبلاً مباشرة عبر:
-- INSERT INTO public.admin_users (email, password, full_name) VALUES ('newadmin@mail.com', 'hispassword', 'اسم المدير');
