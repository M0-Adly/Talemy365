'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'ar' | 'en'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
  dir: 'rtl' | 'ltr'
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Nav
    brandName: 'تعلّمي',
    home: 'الرئيسية',
    curriculum: 'المنهج الدراسي',
    foundation: 'الدورة التأسيسية',
    contact: 'تواصل معنا',
    exploreUnits: 'استكشف الوحدات',
    getInTouch: 'تواصل معنا',

    // Hero
    heroBadge: 'مسار منهجي ونظامي للتعلم',
    heroTitle: 'مرحباً بكم في',
    heroDesc: 'مؤسسة تعليمية مكرسة لتقديم مناهج أكاديمية وعملية عالية المستوى. بدءاً من التدريب التأسيسي الشامل وصولاً إلى 13 وحدة دراسية متخصصة.',
    explore13Units: 'استكشف 13 وحدة',
    foundationCourseBtn: 'الدورة التأسيسية',

    // Features
    pedagogyTitle: 'تعليم متميز ومنهجي',
    pedagogyDesc: 'مناهج متسلسلة صُممت خصيصاً لترسيخ الفهم العميق والتحصيل المستدام.',
    foundation4Title: 'تأسيس من 4 مراحل',
    foundation4Desc: 'مراحل تمهيدية منظمة تضمن إتقان المبادئ والأساسيات قبل التخصص.',
    progressionTitle: 'متابعة وتقييم مستمر',
    progressionDesc: 'معايير واضحة ومخرجات محددة وتغطية شاملة للمواد في كل وحدة.',

    // Curriculum Section
    mainSyllabus: 'المنهج الرئيسي',
    specializedUnits: 'الوحدات الدراسية المتخصصة',
    viewAllUnits: 'عرض جميع الوحدات',
    unit: 'الوحدة',
    duration: 'المدة',
    viewUnit: 'عرض التفاصيل',
    noCourses: 'لا توجد كورسات متاحة حالياً',
    unitsCounter: 'عرض',
    publishedUnits: 'وحدات دراسية منشورة',
    sequentialProgression: 'تسلسل أكاديمي',

    // Foundation Page
    foundationHeroTitle: 'الدورة التأسيسية من 4 مراحل',
    foundationHeroDesc: 'برنامج تمهيدي مكثف. يمر كل طالب بأربع مراحل تدريجية لبناء أساس متين قبل البدء في الوحدات المتخصصة.',
    phase: 'المرحلة',
    phaseDetails: 'تفاصيل المرحلة',
    keyCompetencies: 'الموضوعات والكفاءات الرئيسية',
    beginPhase1: 'ابدأ من المرحلة الأولى',
    foundationEnrollDesc: 'باب التسجيل مفتوح للدفعات القادمة. تواصل معنا للحصول على دليل التأسيس ومتطلبات الانضمام.',
    enrollFoundation: 'سجّل في التأسيس',

    // Contact Page
    contactTitle: 'تواصل معنا',
    contactDesc: 'هل لديك استفسارات حول المنهج أو مواعيد الدفعات أو التأسيس؟ أرسل لنا رسالة وسيتواصل معك مستشار أكاديمي.',
    admissionsOffice: 'مكتب القبول والتسجيل',
    officeHours: 'أوقات العمل',
    officeHoursVal: 'الأحد – الخميس، 9:00 صباحاً – 5:00 مساءً',
    campus: 'المقر',
    campusVal: 'مركز تعلّمي للدراسات والتعليم',
    fullName: 'الاسم الكامل',
    emailAddress: 'البريد الإلكتروني',
    yourMessage: 'رسالتك',
    sendMessage: 'إرسال الرسالة',
    msgSuccess: 'تم إرسال الرسالة بنجاح',
    msgSuccessDesc: 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.',
    msgError: 'تعذر إرسال الرسالة',

    // Admin
    adminPortal: 'لوحة التحكم والأدمن',
    adminLogin: 'تسجيل دخول الإدارة',
    dashboard: 'لوحة الإحصائيات',
    coursesAndUnits: 'إدارة الكورسات والمنهج',
    inquiries: 'الرسائل والاستفسارات',
    signOut: 'تسجيل الخروج',
    newCourse: 'كورس جديد',
  },
  en: {
    // Nav
    brandName: 'Taal3amy',
    home: 'Home',
    curriculum: 'Curriculum',
    foundation: 'Foundation Course',
    contact: 'Contact Us',
    exploreUnits: 'Explore Units',
    getInTouch: 'Get in Touch',

    // Hero
    heroBadge: 'A Structured Path to Mastery',
    heroTitle: 'Welcome to',
    heroDesc: 'An educational institution dedicated to high-standard academic and practical curriculums. From comprehensive foundational training to our 13 specialized units.',
    explore13Units: 'Explore 13 Units',
    foundationCourseBtn: 'Foundation Course',

    // Features
    pedagogyTitle: 'Rigorous Pedagogy',
    pedagogyDesc: 'Sequenced curricula designed for deep comprehension rather than superficial memorization.',
    foundation4Title: '4-Phase Foundation',
    foundation4Desc: 'Structured preparatory stages ensuring core prerequisites are mastered before specialization.',
    progressionTitle: 'Verified Progression',
    progressionDesc: 'Regular checkpoints, clear deliverables, and comprehensive material coverage in every unit.',

    // Curriculum Section
    mainSyllabus: 'Main Syllabus',
    specializedUnits: 'Specialized Curriculum Units',
    viewAllUnits: 'View all units',
    unit: 'Unit',
    duration: 'Duration',
    viewUnit: 'View Details',
    noCourses: 'No courses available yet',
    unitsCounter: 'Showing',
    publishedUnits: 'published units',
    sequentialProgression: 'Sequential Progression',

    // Foundation Page
    foundationHeroTitle: 'The 4-Phase Foundation Course',
    foundationHeroDesc: 'A comprehensive, rigorous preparatory program. Before entering advanced specialized units, each student navigates four distinct progressive phases.',
    phase: 'Phase',
    phaseDetails: 'Phase Details',
    keyCompetencies: 'Key Competencies & Topics',
    beginPhase1: 'Begin with Phase 1',
    foundationEnrollDesc: 'Our next foundation cohort is enrolling now. Contact us to receive the orientation pack.',
    enrollFoundation: 'Enroll in Foundation',

    // Contact Page
    contactTitle: 'Get in Touch',
    contactDesc: 'Have questions about our syllabus, cohort timings, or the 4-Phase Foundation? Send us a message.',
    admissionsOffice: 'Admissions Office',
    officeHours: 'Office Hours',
    officeHoursVal: 'Monday – Friday, 9:00 AM – 5:00 PM',
    campus: 'Campus',
    campusVal: 'Taal3amy Center for Academic Learning',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    yourMessage: 'Your Message',
    sendMessage: 'Send Message',
    msgSuccess: 'Message sent successfully',
    msgSuccessDesc: 'Thank you for reaching out. We will get back to you shortly.',
    msgError: 'Unable to send message',

    // Admin
    adminPortal: 'Faculty & Admin Portal',
    adminLogin: 'Admin Sign In',
    dashboard: 'Dashboard',
    coursesAndUnits: 'Courses & Units',
    inquiries: 'Inquiries',
    signOut: 'Sign Out',
    newCourse: 'New Course',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar') // Default to Arabic per user request

  useEffect(() => {
    const saved = localStorage.getItem('taal3amy_lang') as Language
    if (saved === 'ar' || saved === 'en') {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('taal3amy_lang', newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider')
  }
  return context
}
