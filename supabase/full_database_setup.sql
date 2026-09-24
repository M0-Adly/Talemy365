-- ============================================================
-- TAAL3AMY (تعلّمي) - COMPLETE DATABASE SETUP & ARABIC SEED DATA
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- 2. ADMIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. COURSES TABLE
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('curriculum', 'foundation'))
);

-- Ensure image_url column exists if table was created previously
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. COURSE CONTENTS TABLE
CREATE TABLE IF NOT EXISTS public.course_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. TRIGGERS FOR UPDATED_AT
DROP TRIGGER IF EXISTS handle_courses_updated_at ON public.courses;
CREATE TRIGGER handle_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- 7. INDEXES
CREATE INDEX IF NOT EXISTS idx_courses_published_category_order
  ON public.courses (category, display_order)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_course_contents_course_id_order
  ON public.course_contents (course_id, display_order);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- 8. SECURITY DEFINER FUNCTION FOR ADMIN CHECK
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

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for clean idempotency
DROP POLICY IF EXISTS "Admins can view own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Public can view content of published courses" ON public.course_contents;
DROP POLICY IF EXISTS "Admins can manage all content" ON public.course_contents;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

-- RLS Policies
CREATE POLICY "Admins can view own profile"
  ON public.admin_profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));

CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE POLICY "Admins can view all courses"
  ON public.courses FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "Public can view content of published courses"
  ON public.course_contents FOR SELECT TO anon, authenticated USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_contents.course_id AND courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage all content"
  ON public.course_contents FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_admin());


-- ------------------------------------------------------------
-- 10. ARABIC SEED DATA (4 Foundation Phases & 13 Curriculum Units)
-- ------------------------------------------------------------

TRUNCATE public.course_contents, public.courses CASCADE;

-- Foundation Phase 1
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '11111111-1111-1111-1111-111111111101',
  'المرحلة 1: التوجيه الأكاديمي والمدخل المعرفي',
  'مرحلة تمهيدية تأسيسية تهدف لترسيخ مناهج القراءة الفعالة، والتحليل المنهجي للنصوص، وأخلاقيات البحث الأكاديمي.',
  'foundation',
  '4 أسابيع',
  0,
  true,
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'التمهيد والمعايير الأكاديمية للدراسة', 0),
  ('11111111-1111-1111-1111-111111111101', 'نظرية المعرفة ومناهج التفكير العلمي', 1),
  ('11111111-1111-1111-1111-111111111101', 'القراءة الفاحصة وتفكيك النصوص التراثية والحديثة', 2),
  ('11111111-1111-1111-1111-111111111101', 'قواعد الكتابة الأكاديمية والتوثيق العلمي', 3);

-- Foundation Phase 2
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '11111111-1111-1111-1111-111111111102',
  'المرحلة 2: المنطق التأسيسي والأطر المفهومية',
  'تطوير القدرات التحليلية من خلال المنطق الصوري، ورصد المغالطات المنطقية، وبناء المقاربات الحجاجية.',
  'foundation',
  '5 أسابيع',
  1,
  true,
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111102', 'مبادئ المنطق القضوي والاستدلال المباشر', 0),
  ('11111111-1111-1111-1111-111111111102', 'هياكل الحجج وكشف المغالطات الشائعة', 1),
  ('11111111-1111-1111-1111-111111111102', 'التصنيف المفاهيمي وصياغة الحدود والتعريفات', 2);

-- Foundation Phase 3
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '11111111-1111-1111-1111-111111111103',
  'المرحلة 3: المناهج التطبيقية والتركيب المعرفي',
  'تحويل النظرية إلى أطر بحثية تطبيقية، واختبار الفرضيات، والنقد المقارن للمناهج المعاصرة.',
  'foundation',
  '5 أسابيع',
  2,
  true,
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111103', 'المناهج الكمية والنوعية في البحوث الأكاديمية', 0),
  ('11111111-1111-1111-1111-111111111103', 'تحليل المصادر والتوثيق التوثيقي التاريخي', 1);

-- Foundation Phase 4
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '11111111-1111-1111-1111-111111111104',
  'المرحلة 4: مشروع التخرج والتقييم الشامل',
  'تتويج المرحلة التأسيسية بتقديم أطروحة تمهيدية ومناقشتها أمام اللجنة الأكاديمية قبل الالتحاق بالوحدات.',
  'foundation',
  '4 أسابيع',
  3,
  true,
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111104', 'إعداد خطة البحث والدراسات السابقة', 0),
  ('11111111-1111-1111-1111-111111111104', 'المناقشة الشاملة والدفاع عن الأطروحة التأسيسية', 1);


-- 13 Curriculum Units (الوحدات الـ 13)

-- Unit 1
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222201',
  'الوحدة 01: أسس التفكير البنيوي والاستدلال',
  'مدخل شامل للأنظمة الاستنباطية، والمنطق الرياضي، والنمذجة المفاهيمية الصورية.',
  'curriculum',
  '6 أسابيع',
  0,
  true,
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222201', 'الأنظمة الاستنباطية وطرق البراهين', 0),
  ('22222222-2222-2222-2222-222222222201', 'نظرية المجموعات والمنطق الرياضي', 1);

-- Unit 2
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222202',
  'الوحدة 02: اللغة والسمعيات والتأويل (الهيرمينوطيقا)',
  'تحليل البنى اللغوية، وتفكيك المعاني، ومناهج تفسير النصوص القديمة والمعاصرة.',
  'curriculum',
  '6 أسابيع',
  1,
  true,
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222202', 'البنى اللغوية وشجيرات الإعراب الصوري', 0),
  ('22222222-2222-2222-2222-222222222202', 'المناهج التأويلية التراثية والحديثة', 1);

-- Unit 3
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222203',
  'الوحدة 03: الحقب التاريخية والتحولات الفكرية',
  'مسح دقيق لتاريخ الأفكار، والثورات العلمية، وتحولات النماذج الإرشادية (Paradigms).',
  'curriculum',
  '5 أسابيع',
  2,
  true,
  'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80'
);

-- Unit 4
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222204',
  'الوحدة 04: الفلسفة الأخلاقية والأخلاقيات التطبيقية',
  'دراسة النظريات الأخلاقية المعيارية، وأخلاق الواجب، وأخلاقيات التكنولوجيا والبيولوجيا.',
  'curriculum',
  '6 أسابيع',
  3,
  true,
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
);

-- Unit 5
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222205',
  'الوحدة 05: البحث التجريبي والاستدلال البياني',
  'الثقافة الاحتمالية، نظرية الاحتمالات، واختبار الفرضيات والتصميم التجريبي.',
  'curriculum',
  '6 أسابيع',
  4,
  true,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
);

-- Unit 6
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222206',
  'الوحدة 06: النظم الاجتماعية والمؤسسات',
  'بنية المؤسسات الاجتماعية، السلوك الجمعي، والطبقات الاجتماعية وديناميات التغيير.',
  'curriculum',
  '5 أسابيع',
  5,
  true,
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
);

-- Unit 7
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222207',
  'الوحدة 07: النماذج الاقتصادية وتوزيع الموارد',
  'التحليل الاقتصادي الكلي والجزئي، أساسيات نظرية الألعاب، وتصميم آليات السوق.',
  'curriculum',
  '6 أسابيع',
  6,
  true,
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80'
);

-- Unit 8
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222208',
  'الوحدة 08: الفلسفة السياسية وأنظمة الحكم',
  'نظريات السيادة، العدالة والحرية، وتطور الهندسة القانونية عبر الحضارات.',
  'curriculum',
  '5 أسابيع',
  7,
  true,
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'
);

-- Unit 9
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222209',
  'الوحدة 09: العلوم المعرفية وعلم النفس',
  'الإدراك البشري، انحيازات اتخاذ القرار، المرونة العصبيّة، ونماذج السلوك السلوكي.',
  'curriculum',
  '6 أسابيع',
  8,
  true,
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80'
);

-- Unit 10
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222210',
  'الوحدة 10: الأنظمة البيئية والمناخ العالمي',
  'ديناميكيات الأنظمة البيئية، النمذجة المناخية، والتنمية المستدامة والبيئية.',
  'curriculum',
  '5 أسابيع',
  9,
  true,
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
);

-- Unit 11
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222211',
  'الوحدة 11: التفكير الخوارزمي وأنظمة المعلومات',
  'حل المشكلات الخوارزمية، التعقيد الحسابي، التشفير، وأخلاقيات الذكاء الاصطناعي.',
  'curriculum',
  '6 أسابيع',
  10,
  true,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
);

-- Unit 12
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222212',
  'الوحدة 12: الجماليات والخطابة والنقد العقلاني',
  'فن الخطابة والإقناع، نظريات النقد التراثي والمعاصر، وتحليل الخطاب الفكري.',
  'curriculum',
  '5 أسابيع',
  11,
  true,
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
);

-- Unit 13
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222213',
  'الوحدة 13: التراكم المعرفي وأطروحة البحث النهائية',
  'الوحدة الختامية الحاسم حيث يقوم الطالب بكتابة ودفاع أطروحة أكاديمية شاملة.',
  'curriculum',
  '8 أسابيع',
  12,
  true,
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
);


-- 11. RE-LINK ADMIN USER (If present)
INSERT INTO public.admin_profiles (id, full_name, role)
SELECT id, 'المدير الأكاديمي', 'admin'
FROM auth.users
WHERE email = 'Talemy365.eg@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
