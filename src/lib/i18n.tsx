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
    // الهيدر والبراند
    brandName: 'تعلّمي 365',
    home: 'الرئيسية',
    curriculum: 'المناهج التعليمية',
    courses: 'الكورسات',
    contact: 'تواصل معنا',

    // قسم الهيرو والترحيب
    heroTag: 'تعليم بسيط وفعّال',
    heroTitle: 'تعلّمي | بوابتك للتعليم المتطور',
    heroDesc: 'منصتك التعليمية لتطوير مهاراتك من خلال مناهج دراسية متكاملة وكورسات عملية سهلة ومباشرة.',
    exploreCurriculum: 'المناهج التعليمية',
    exploreCourses: 'تصفح الكورسات',

    // الأقسام الرئيسية
    curriculumTitle: 'المناهج التعليمية',
    curriculumSubtitle: 'مناهج دراسية متكاملة ومنظمة لتسهيل الفهم والتحصيل.',
    coursesTitle: 'الكورسات التدريبية',
    coursesSubtitle: 'دورات تدريبية مركزة لتطوير المهارات العملية.',

    // حالة عدم وجود محتوى
    comingSoon: 'سوف يتم الإعلان قريباً',
    comingSoonDesc: 'نعمل حالياً على إعداد المحتوى وسيتم إطلاقه هنا قريباً جداً.',

    // البطاقات والتفاصيل
    viewDetails: 'عرض التفاصيل',
    unit: 'الوحدة',
    course: 'كورس',

    // صفحة التواصل
    contactTitle: 'تواصل معنا',
    contactSubtitle: 'نسعد دائماً بالإجابة على استفساراتك واقتراحاتك.',
    fullName: 'الاسم',
    namePlaceholder: 'اكتب اسمك هنا',
    emailAddress: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    whatsappNumber: 'رقم الواتساب',
    whatsappPlaceholder: '01xxxxxxxxx أو +201xxxxxxxxx',
    yourMessage: 'رسالتك',
    messagePlaceholder: 'اكتب استفسارك أو رسالتك وسنرد عليك في أقرب وقت...',
    sendMessage: 'إرسال الرسالة',
    msgSuccess: 'تم إرسال رسالتك بنجاح',
    msgSuccessDesc: 'شكراً لتواصلك معنا، سنقوم بالرد عليك قريباً.',
    msgError: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.',

    // الفوتر
    footerDesc: 'منصة تعلّمي - نساعدك على التعلم والتطور بخطوات واضحة وبسيطة.',
    quickLinks: 'روابط سريعة',
    inquiries: 'للاستفسار والدعم',
    inquiriesDesc: 'فريقنا متاح للرد على أي استفسار يخص المناهج والدورات.',
    allRightsReserved: 'جميع الحقوق محفوظة لمنصة تعلّمي ©',

    // لوحة التحكم
    adminPortal: 'لوحة التحكم',
    adminLoginDesc: 'تسجيل دخول الإدارة لإدارة المناهج والكورسات والرسائل.',
    adminEmailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    signInBtn: 'تسجيل الدخول',
    dashboard: 'الرئيسية',
    coursesAndUnits: 'إدارة المناهج والكورسات',
    inquiriesNav: 'الرسائل الواردة',
    signOut: 'تسجيل الخروج',
    newCourse: 'إضافة جديد',
    viewPublicWeb: 'زيارة الموقع',
  },
  en: {
    // Header & Brand
    brandName: 'Talemy 365',
    home: 'Home',
    curriculum: 'Curriculums',
    courses: 'Courses',
    contact: 'Contact Us',

    // Hero Section
    heroTag: 'Simple & Practical Learning',
    heroTitle: 'Talemy | Modern Learning Made Simple',
    heroDesc: 'Your learning hub to build and master skills through clear curriculums and focused hands-on courses.',
    exploreCurriculum: 'Explore Curriculums',
    exploreCourses: 'Browse Courses',

    // Main Sections
    curriculumTitle: 'Educational Curriculums',
    curriculumSubtitle: 'Structured and complete curriculums crafted for real progress.',
    coursesTitle: 'Featured Courses',
    coursesSubtitle: 'Practical training courses designed to build real-world skills.',

    // Empty state
    comingSoon: 'To be announced soon',
    comingSoonDesc: 'We are preparing new content and will announce it here very soon.',

    // Cards & Details
    viewDetails: 'View Details',
    unit: 'Unit',
    course: 'Course',

    // Contact
    contactTitle: 'Get in Touch',
    contactSubtitle: 'We are always happy to answer your questions and inquiries.',
    fullName: 'Name',
    namePlaceholder: 'Enter your name',
    emailAddress: 'Email Address',
    emailPlaceholder: 'name@example.com',
    whatsappNumber: 'WhatsApp Number',
    whatsappPlaceholder: '+20 1xxxxxxxxx',
    yourMessage: 'Message',
    messagePlaceholder: 'How can we help you? Feel free to reach out...',
    sendMessage: 'Send Message',
    msgSuccess: 'Message sent successfully',
    msgSuccessDesc: 'Thank you for reaching out. We will get back to you shortly.',
    msgError: 'Unable to send message, please try again.',

    // Footer
    footerDesc: 'Talemy - empowering your learning journey with clarity and simplicity.',
    quickLinks: 'Quick Links',
    inquiries: 'Inquiries & Support',
    inquiriesDesc: 'Our support team is here to answer any questions about our programs.',
    allRightsReserved: 'All rights reserved to Talemy ©',

    // Admin
    adminPortal: 'Admin Dashboard',
    adminLoginDesc: 'Sign in to manage curriculums, courses, and inquiries.',
    adminEmailLabel: 'Email',
    passwordLabel: 'Password',
    signInBtn: 'Sign In',
    dashboard: 'Dashboard',
    coursesAndUnits: 'Curriculums & Courses',
    inquiriesNav: 'Inquiries',
    signOut: 'Sign Out',
    newCourse: 'Add New',
    viewPublicWeb: 'View Website',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar')

  useEffect(() => {
    const saved = localStorage.getItem('taal3amy_lang') as Language
    if (saved === 'ar' || saved === 'en') {
      window.requestAnimationFrame(() => {
        setLangState(saved)
      })
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
