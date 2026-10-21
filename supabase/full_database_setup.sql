-- ============================================================
-- TAAL3AMY 365 (تعلّمي 365) - DATABASE SETUP / UPDATE SCRIPT
-- يمكنك تشغيل هذا السكريبت مباشرة في Supabase Dashboard -> SQL Editor
-- السكريبت يحافظ على الجداول الموجودة ويضيف أي أعمدة أو تعديلات ناقصة بدون مسح بياناتك
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- 2. جدول حسابات المدراء
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT DEFAULT 'مدير المنصة',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. جدول المناهج والكورسات (curriculum / course)
CREATE TABLE IF NOT EXISTS public.courses (
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- تعديل قيد القسم ليشمل 'curriculum' و 'course'
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS valid_category;
ALTER TABLE public.courses ADD CONSTRAINT valid_category CHECK (category IN ('curriculum', 'course'));

-- 4. جدول محتويات الكورس
CREATE TABLE IF NOT EXISTS public.course_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. جدول رسائل واستفسارات الزوار مع دعم عمود الواتساب (whatsapp)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إضافة عمود الواتساب في حال كان الجدول موجوداً مسبقاً
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 6. تفعيل التحديث التلقائي للوقت
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_courses_updated_at'
  ) THEN
    CREATE TRIGGER handle_courses_updated_at
      BEFORE UPDATE ON public.courses
      FOR EACH ROW
      EXECUTE PROCEDURE moddatetime(updated_at);
  END IF;
END $$;

-- 7. الفهارس لتسريع الموقع
CREATE INDEX IF NOT EXISTS idx_courses_published_category_order
  ON public.courses (category, display_order)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_course_contents_course_id_order
  ON public.course_contents (course_id, display_order);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- 8. حماية البيانات (Row Level Security)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- الصلاحيات على الجداول:
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 9. التأكد من وجود حساب المدير العام الافتراضي
INSERT INTO public.admin_users (email, password, full_name)
VALUES (
  'Talemy365.eg@gmail.com',
  'Talemy365##25@',
  'المدير العام'
)
ON CONFLICT (email) DO UPDATE 
SET password = 'Talemy365##25@', full_name = 'المدير العام';
