-- ============================================================
-- SEED DATA: 4 Foundation Course Phases & 13 Curriculum Units
-- ============================================================

-- Clean existing data (optional for fresh runs)
-- TRUNCATE public.course_contents, public.courses CASCADE;

-- ------------------------------------------------------------
-- 1. FOUNDATION COURSE (4 Phases)
-- ------------------------------------------------------------

-- Phase 1
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '11111111-1111-1111-1111-111111111101',
  'Phase 1: Academic Orientation & Intellectual Principles',
  'The opening foundation phase immerses the student in core scholarly principles, foundational reading methodologies, note taking, and academic ethics.',
  'foundation',
  '4 Weeks',
  0,
  true,
  'Compass'
);

INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Orientation and Academic Standards', 0),
  ('11111111-1111-1111-1111-111111111101', 'Epistemology and Methods of Intellectual Inquiry', 1),
  ('11111111-1111-1111-1111-111111111101', 'Critical Reading of Classical and Modern Texts', 2),
  ('11111111-1111-1111-1111-111111111101', 'Scholarly Writing & Citation Discipline', 3);

-- Phase 2
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '11111111-1111-1111-1111-111111111102',
  'Phase 2: Core Conceptual Frameworks & Logic',
  'Deepening analytical ability through formal and informal logic, dialectical reasoning, and cognitive mapping across disciplines.',
  'foundation',
  '5 Weeks',
  1,
  true,
  'Brain'
);

INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111102', 'Foundations of Propositional Logic', 0),
  ('11111111-1111-1111-1111-111111111102', 'Argument Structure and Fallacy Detection', 1),
  ('11111111-1111-1111-1111-111111111102', 'Conceptual Categorization and Definitions', 2),
  ('11111111-1111-1111-1111-111111111102', 'Analytical Dialectics and Debate Frameworks', 3);

-- Phase 3
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '11111111-1111-1111-1111-111111111103',
  'Phase 3: Applied Methodologies & Synthesis',
  'Translating theoretical reasoning into practical research models, hypothesis testing, and cross-disciplinary comparative synthesis.',
  'foundation',
  '5 Weeks',
  2,
  true,
  'Layers'
);

INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111103', 'Qualitative and Quantitative Research Methodologies', 0),
  ('11111111-1111-1111-1111-111111111103', 'Source Analysis, Verification, and Archival Research', 1),
  ('11111111-1111-1111-1111-111111111103', 'Synthesis and Interdisciplinary Problem Solving', 2);

-- Phase 4
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '11111111-1111-1111-1111-111111111104',
  'Phase 4: Capstone Integration & Examination',
  'Culmination of foundational training with a comprehensive defense, academic monograph, and faculty review before curriculum entry.',
  'foundation',
  '4 Weeks',
  3,
  true,
  'Award'
);

INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('11111111-1111-1111-1111-111111111104', 'Monograph Proposal and Literature Review', 0),
  ('11111111-1111-1111-1111-111111111104', 'Drafting, Peer Review, and Revision Cycles', 1),
  ('11111111-1111-1111-1111-111111111104', 'Faculty Defense and Oral Comprehensive Exam', 2);

-- ------------------------------------------------------------
-- 2. CURRICULUM (All 13 Units)
-- ------------------------------------------------------------

-- Unit 1
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222201',
  'Unit 01: Foundations of Structural Reasoning',
  'An introduction to deductive systems, mathematical logic, and formal conceptual modeling.',
  'curriculum',
  '6 Weeks',
  0,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Deductive Systems and Proof Techniques', 0),
  ('22222222-2222-2222-2222-222222222201', 'Set Theory and Relational Algebra', 1),
  ('22222222-2222-2222-2222-222222222201', 'Axiomatic Foundations', 2);

-- Unit 2
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222202',
  'Unit 02: Language, Semantics & Hermeneutics',
  'Analysis of linguistic structures, textual interpretation, and context-dependent semantic extraction.',
  'curriculum',
  '6 Weeks',
  1,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222202', 'Linguistic Structures and Syntax Trees', 0),
  ('22222222-2222-2222-2222-222222222202', 'Classical and Contemporary Hermeneutics', 1),
  ('22222222-2222-2222-2222-222222222202', 'Pragmatics and Discourse Analysis', 2);

-- Unit 3
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222203',
  'Unit 03: Historical Epochs & Paradigm Shifts',
  'A rigorous survey of intellectual history, scientific revolutions, and cultural evolutions.',
  'curriculum',
  '5 Weeks',
  2,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222203', 'Antiquity to the Golden Ages of Inquiry', 0),
  ('22222222-2222-2222-2222-222222222203', 'The Scientific Enlightenment & Modernity', 1),
  ('22222222-2222-2222-2222-222222222203', 'Kuhnian Revolutions and Paradigm Analysis', 2);

-- Unit 4
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222204',
  'Unit 04: Moral Philosophy & Applied Ethics',
  'Exploration of normative ethics, deontological vs consequentialist frameworks, and bioethics.',
  'curriculum',
  '6 Weeks',
  3,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222204', 'Normative Ethical Theories', 0),
  ('22222222-2222-2222-2222-222222222204', 'Virtue Ethics and Character Cultivation', 1),
  ('22222222-2222-2222-2222-222222222204', 'Case Studies in Applied and Technology Ethics', 2);

-- Unit 5
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222205',
  'Unit 05: Empirical Inquiry & Data Reasoning',
  'Statistical literacy, probability theory, causal inference, and experimental design.',
  'curriculum',
  '6 Weeks',
  4,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222205', 'Probability and Distributions in Real-World Contexts', 0),
  ('22222222-2222-2222-2222-222222222205', 'Hypothesis Testing and Statistical Pitfalls', 1),
  ('22222222-2222-2222-2222-222222222205', 'Causality vs Correlation Analysis', 2);

-- Unit 6
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222206',
  'Unit 06: Sociological Systems & Institutions',
  'Structure of social institutions, collective behavior, social stratification, and institutional change.',
  'curriculum',
  '5 Weeks',
  5,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222206', 'Classical Sociological Theories', 0),
  ('22222222-2222-2222-2222-222222222206', 'Institutions, Power Dynamics, and Norms', 1),
  ('22222222-2222-2222-2222-222222222206', 'Dynamics of Collective Action', 2);

-- Unit 7
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222207',
  'Unit 07: Economic Models & Resource Allocation',
  'Micro and macroeconomic theory, game theory fundamentals, and market mechanism design.',
  'curriculum',
  '6 Weeks',
  6,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222207', 'Supply, Demand, and Price Formations', 0),
  ('22222222-2222-2222-2222-222222222207', 'Introduction to Game Theoretic Equilibria', 1),
  ('22222222-2222-2222-2222-222222222207', 'Public Goods and Market Failures', 2);

-- Unit 8
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222208',
  'Unit 08: Political Philosophy & Governance',
  'Theories of sovereignty, justice, liberty, and legal architecture across human civilizations.',
  'curriculum',
  '5 Weeks',
  7,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222208', 'Theories of the State and Social Contract', 0),
  ('22222222-2222-2222-2222-222222222208', 'Constitutionalism and Separation of Powers', 1),
  ('22222222-2222-2222-2222-222222222208', 'Comparative Governance Models', 2);

-- Unit 9
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222209',
  'Unit 09: Cognitive Science & Psychology',
  'Human cognition, decision-making biases, neuroplasticity, and behavioral models.',
  'curriculum',
  '6 Weeks',
  8,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222209', 'Perception, Memory, and Attention Systems', 0),
  ('22222222-2222-2222-2222-222222222209', 'Heuristics and Systematic Cognitive Biases', 1),
  ('22222222-2222-2222-2222-222222222209', 'Learning Theories and Habit Architecture', 2);

-- Unit 10
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222210',
  'Unit 10: Environmental Systems & Global Ecology',
  'Ecosystem mechanics, climate models, biodiversity preservation, and sustainable development.',
  'curriculum',
  '5 Weeks',
  9,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222210', 'Biogeochemical Cycles and Thermodynamics', 0),
  ('22222222-2222-2222-2222-222222222210', 'Ecosystem Resilience and Anthropogenic Pressures', 1),
  ('22222222-2222-2222-2222-222222222210', 'Ecological Economics and Policy Interventions', 2);

-- Unit 11
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222211',
  'Unit 11: Computational Thinking & Information Systems',
  'Algorithmic problem-solving, computational complexity, cryptography, and artificial intelligence ethics.',
  'curriculum',
  '6 Weeks',
  10,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222211', 'Algorithmic Complexity (Big-O) and Data Structures', 0),
  ('22222222-2222-2222-2222-222222222211', 'Cryptography, Network Architecture, and Trust Models', 1),
  ('22222222-2222-2222-2222-222222222211', 'Machine Intelligence and Epistemic Risk', 2);

-- Unit 12
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222212',
  'Unit 12: Aesthetics, Rhetoric & Public Discourse',
  'The art of persuasive discourse, aesthetic theory, narrative framing, and media ecology.',
  'curriculum',
  '5 Weeks',
  11,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222212', 'Classical Rhetoric: Ethos, Pathos, and Logos', 0),
  ('22222222-2222-2222-2222-222222222212', 'Theories of Form, Harmony, and Aesthetics', 1),
  ('22222222-2222-2222-2222-222222222212', 'Modern Media Literacy and Public Debate', 2);

-- Unit 13
INSERT INTO public.courses (id, title, description, category, duration, display_order, is_published, icon)
VALUES (
  '22222222-2222-2222-2222-222222222213',
  'Unit 13: Advanced Synthesis & Research Dissertation',
  'The definitive culminating unit where students write and defend an extensive research thesis.',
  'curriculum',
  '8 Weeks',
  12,
  true,
  'BookOpen'
);
INSERT INTO public.course_contents (course_id, title, display_order) VALUES
  ('22222222-2222-2222-2222-222222222213', 'Thesis Defense Preparation and Methodology Validation', 0),
  ('22222222-2222-2222-2222-222222222213', 'Comprehensive Faculty Review and Peer Critique', 1),
  ('22222222-2222-2222-2222-222222222213', 'Final Academic Publication and Archival Submission', 2);
