'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen, GraduationCap, Mail, Home, Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang, t } = useTranslation()

  const NAV_LINKS = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/curriculum', label: t('curriculum'), icon: BookOpen },
    { href: '/courses', label: t('courses'), icon: GraduationCap },
    { href: '/contact', label: t('contact'), icon: Mail },
  ]

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EDE7FB] bg-[#F8F5FF]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Image */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          aria-label="Home"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-[#EDE7FB] bg-white p-1 shadow-xs transition-transform group-hover:scale-105">
            <Image
              src="/logo.jpeg"
              alt="Talemy365 Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-black text-[#4C1D95] tracking-tight group-hover:text-[#6C2BD9]">
            {t('brandName')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
                  isActive
                    ? 'bg-[#EDE7FB] text-[#6C2BD9]'
                    : 'text-[#2D3748] hover:bg-[#EDE7FB]/60 hover:text-[#4C1D95]'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop Language Switcher */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#EDE7FB] bg-white px-4 py-2 text-xs font-bold text-[#4C1D95] hover:bg-[#EDE7FB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="h-4 w-4 text-[#7C3AED]" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-11 items-center gap-1.5 rounded-xl border border-[#EDE7FB] bg-white px-3 text-xs font-bold text-[#4C1D95]"
          >
            <Globe className="h-4 w-4 text-[#7C3AED]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[#2D3748] hover:bg-[#EDE7FB] hover:text-[#4C1D95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="border-b border-[#EDE7FB] bg-white px-4 pt-2 pb-6 md:hidden">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                    isActive
                      ? 'bg-[#EDE7FB] text-[#6C2BD9]'
                      : 'text-[#2D3748] hover:bg-[#EDE7FB]/60 hover:text-[#4C1D95]'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
