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
    // Nav & Brand
    brandName: 'تعلّمي',
    home: 'الرئيسية',
    curriculum: 'المنهج الدراسي',
    foundation: 'الدورة التأسيسية',
    contact: 'تواصل معنا',
    exploreUnits: 'استكشف الوحدات',
    getInTouch: 'تواصل معنا',

    // Hero Section
    heroBadge: 'مسار منهجي ونظامي للتعلم',
    heroTitle: 'مرحباً بكم في',
    heroDesc: 'مؤسسة تعليمية مكرسة لتقديم مناهج أكاديمية وعملية عالية المستوى. بدءاً من التدريب التأسيسي الشامل وصولاً إلى 13 وحدة دراسية متخصصة.',
    explore13Units: 'استكشف 13 وحدة',
    foundationCourseBtn: 'الدورة التأسيسية',

    // Values / Features
    pedagogyTitle: 'تعليم متميز ومنهجي',
    pedagogyDesc: 'مناهج متسلسلة صُممت خصيصاً لترسيخ الفهم العميق والتحصيل المستدام.',
    foundation4Title: 'تأسيس من 4 مراحل',
    foundation4Desc: 'مراحل تمهيدية منظمة تضمن إتقان المبادئ والأساسيات قبل التخصص.',
    progressionTitle: 'متابعة وتقييم مستمر',
    progressionDesc: 'معايير واضحة ومخرجات محددة وتغطية شاملة للمواد في كل وحدة.',

    // Curriculum Section & Pages
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
    academicSyllabus: 'المخطط الأكاديمي',
    curriculumTitle: 'الوحدات الدراسية للمنهج',
    curriculumDesc: 'ينقسم منهجنا الشامل إلى وحدات دراسية متقدمة تهدف لبناء المعرفة بأسلوب تدريجي ومنظم.',

    // Course Detail Page
    breadcrumbCurriculum: 'المنهج الدراسي',
    unitSyllabus: 'موضوعات وعناصر الوحدة',
    topicsDesc: 'المفاهيم والدروس الرئيسية المشمولة في هذه الوحدة.',
    topic: 'درس',
    topics: 'موضوعات',
    outlineInProgress: 'جاري إعداد محتوى الوحدة',
    outlineInProgressDesc: 'يقوم الكادر الأكاديمي حالياً باستكمال إعداد العناصر التفصيلية لهذه الوحدة.',
    interestedInUnit: 'هل ترغب في الانضمام لهذه الوحدة؟',
    inquireSchedule: 'استفسر عن المواعيد القادمة وشروط الالتحاق بهذه الوحدة.',
    inquireNow: 'استفسر الآن',

    // Foundation Page
    foundationCore: 'المحور التأسيسي',
    foundationHeroTitle: 'الدورة التأسيسية من 4 مراحل',
    foundationHeroDesc: 'برنامج تمهيدي مكثف. يمر كل طالب بأربع مراحل تدريجية لبناء أساس متين قبل البدء في الوحدات المتخصصة.',
    stage: 'المرحلة',
    phaseDetails: 'تفاصيل المرحلة',
    keyCompetencies: 'الموضوعات والكفاءات الرئيسية',
    beginPhase1: 'ابدأ من المرحلة الأولى',
    foundationEnrollDesc: 'باب التسجيل مفتوح للدفعات القادمة. تواصل معنا للحصول على دليل التأسيس ومتطلبات الانضمام.',
    enrollFoundation: 'سجّل في التأسيس',

    // Contact Page & Form
    admissionsSupport: 'القبول والتسجيل',
    contactTitle: 'تواصل معنا',
    contactDesc: 'هل لديك استفسارات حول المنهج أو مواعيد الدفعات أو التأسيس؟ أرسل لنا رسالة وسيتواصل معك مستشار أكاديمي.',
    admissionsOffice: 'مكتب القبول والتسجيل',
    officeDesc: 'مستشارونا متاحون للإجابة على جميع استفسارات الطلاب الجدد وتوضيح مسارات الدراسة.',
    officeHours: 'أوقات العمل',
    officeHoursVal: 'الأحد – الخميس، 9:00 صباحاً – 5:00 مساءً',
    campus: 'المقر الأكاديمي',
    campusVal: 'مركز تعلّمي للدراسات والتعليم',
    fullName: 'الاسم الكامل',
    namePlaceholder: 'مثال: سارة أحمد',
    emailAddress: 'البريد الإلكتروني',
    emailPlaceholder: 'مثال: sarah@example.com',
    yourMessage: 'رسالتك',
    messagePlaceholder: 'كيف يمكننا مساعدتك بخصوص المنهج الدراسي أو التسجيل؟',
    sendMessage: 'إرسال الرسالة',
    msgSuccess: 'تم إرسال الرسالة بنجاح',
    msgSuccessDesc: 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.',
    msgError: 'تعذر إرسال الرسالة',
    quoteText: '«هيكلة الدورة التأسيسية غيرت تماماً طريقتي في التعلم والتحصيل العلمي. ننصح بها بشدة.»',
    quoteAuthor: '— خريج الدورة التأسيسية',
    readyToConnect: 'هل لديك أسئلة أو تود التسجيل؟',
    readyToConnectDesc: 'فريق القبول والدعم الأكاديمي متواجد دائماً لمساعدتك في اختيار المسار الأنسب.',

    // Footer
    footerDesc: 'مؤسسة تعليمية مكرسة لتقديم مناهج أكاديمية وعملية عالية المستوى وبناء المعرفة بطرق علمية رصينة.',
    navigation: 'التنقل',
    fullCurriculum: 'المنهج الدراسي الكامل',
    inquiries: 'الاستفسارات',
    inquiriesDesc: 'هل لديك أسئلة بخصوص شروط القبول أو مسارات الدراسة؟',
    sendAMessage: 'أرسل لنا رسالة',
    rightsReserved: 'جميع الحقوق محفوظة.',
    designQuality: 'صُمم بدقة عالية ووضوح للأداء والسهولة.',

    // Admin & Auth
    adminPortal: 'لوحة التحكم والإدارة الأكاديمية',
    adminLoginDesc: 'قم بتسجيل الدخول لإدارة المنهج والدروس ورسائل الطلاب.',
    adminEmailLabel: 'بريد المدير',
    passwordLabel: 'كلمة المرور',
    signInBtn: 'تسجيل الدخول للوحة التحكم',
    restrictedAccess: 'منطقة محمية. جميع العمليات مسجلة ومراقب وصولها.',
    dashboard: 'لوحة الإحصائيات',
    coursesAndUnits: 'إدارة الكورسات والمنهج',
    inquiriesNav: 'الرسائل والاستفسارات',
    signOut: 'تسجيل الخروج',
    newCourse: 'كورس جديد',
    viewPublicWeb: 'معاينة الموقع العام',
  },
  en: {
    // Nav & Brand
    brandName: 'Taal3amy',
    home: 'Home',
    curriculum: 'Curriculum',
    foundation: 'Foundation Course',
    contact: 'Contact Us',
    exploreUnits: 'Explore Units',
    getInTouch: 'Get in Touch',

    // Hero Section
    heroBadge: 'A Structured Path to Mastery',
    heroTitle: 'Welcome to',
    heroDesc: 'An educational institution dedicated to high-standard academic and practical curriculums. From comprehensive foundational training to our 13 specialized units.',
    explore13Units: 'Explore 13 Units',
    foundationCourseBtn: 'Foundation Course',

    // Values / Features
    pedagogyTitle: 'Rigorous Pedagogy',
    pedagogyDesc: 'Sequenced curricula designed for deep comprehension rather than superficial memorization.',
    foundation4Title: '4-Phase Foundation',
    foundation4Desc: 'Structured preparatory stages ensuring core prerequisites are mastered before specialization.',
    progressionTitle: 'Verified Progression',
    progressionDesc: 'Regular checkpoints, clear deliverables, and comprehensive material coverage in every unit.',

    // Curriculum Section & Pages
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
    academicSyllabus: 'Academic Syllabus',
    curriculumTitle: 'Curriculum Units',
    curriculumDesc: 'Our comprehensive curriculum is organized into distinct, progressive units designed to foster rigorous mastery.',

    // Course Detail Page
    breadcrumbCurriculum: 'Curriculum',
    unitSyllabus: 'Unit Syllabus & Topics',
    topicsDesc: 'Key concepts, lectures, and milestones included within this unit.',
    topic: 'Topic',
    topics: 'Topics',
    outlineInProgress: 'Curriculum outline in progress',
    outlineInProgressDesc: 'The specific content breakdown for this unit is being finalized by faculty.',
    interestedInUnit: 'Interested in this unit?',
    inquireSchedule: 'Inquire about current schedules, prerequisites, and registration details.',
    inquireNow: 'Inquire Now',

    // Foundation Page
    foundationCore: 'Foundational Core',
    foundationHeroTitle: 'The 4-Phase Foundation Course',
    foundationHeroDesc: 'A comprehensive, rigorous preparatory program. Before entering advanced specialized units, each student navigates four distinct progressive phases.',
    stage: 'Stage',
    phaseDetails: 'Phase Details',
    keyCompetencies: 'Key Competencies & Topics',
    beginPhase1: 'Begin with Phase 1',
    foundationEnrollDesc: 'Our next foundation cohort is enrolling now. Contact us to receive the orientation pack.',
    enrollFoundation: 'Enroll in Foundation',

    // Contact Page & Form
    admissionsSupport: 'Admissions & Support',
    contactTitle: 'Get in Touch',
    contactDesc: 'Have questions about our syllabus, cohort timings, or the 4-Phase Foundation? Send us a message.',
    admissionsOffice: 'Admissions Office',
    officeDesc: 'Our advisors are available for prospective students seeking curriculum details, prerequisites, or guidance.',
    officeHours: 'Office Hours',
    officeHoursVal: 'Monday – Friday, 9:00 AM – 5:00 PM',
    campus: 'Campus',
    campusVal: 'Taal3amy Center for Academic Learning',
    fullName: 'Full Name',
    namePlaceholder: 'e.g. Sarah Ahmad',
    emailAddress: 'Email Address',
    emailPlaceholder: 'e.g. sarah@example.com',
    yourMessage: 'Your Message',
    messagePlaceholder: 'How can we assist you with our curriculum or enrollment?',
    sendMessage: 'Send Message',
    msgSuccess: 'Message sent successfully',
    msgSuccessDesc: 'Thank you for reaching out. We will get back to you shortly.',
    msgError: 'Unable to send message',
    quoteText: '“The structure of the foundation course completely transformed how I approached study units. Highly recommended.”',
    quoteAuthor: '— Foundation Graduate',
    readyToConnect: 'Have questions or ready to enroll?',
    readyToConnectDesc: 'Our admissions and curriculum advisory team is always available to guide your learning journey.',

    // Footer
    footerDesc: 'An educational institution committed to structured, rigorous, and inspiring learning. Empowering individuals across foundational principles.',
    navigation: 'Navigation',
    fullCurriculum: 'Full Curriculum',
    inquiries: 'Inquiries',
    inquiriesDesc: 'Have questions regarding admissions, the curriculum, or study paths?',
    sendAMessage: 'Send a message',
    rightsReserved: 'All rights reserved.',
    designQuality: 'Designed for clarity, performance, and accessibility.',

    // Admin & Auth
    adminPortal: 'Faculty & Admin Portal',
    adminLoginDesc: 'Sign in to manage curriculum, units, and site inquiries.',
    adminEmailLabel: 'Admin Email',
    passwordLabel: 'Password',
    signInBtn: 'Sign In to Dashboard',
    restrictedAccess: 'Restricted access. All actions are logged and audited.',
    dashboard: 'Dashboard',
    coursesAndUnits: 'Courses & Units',
    inquiriesNav: 'Inquiries',
    signOut: 'Sign Out',
    newCourse: 'New Course',
    viewPublicWeb: 'View Public Website',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar')

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
