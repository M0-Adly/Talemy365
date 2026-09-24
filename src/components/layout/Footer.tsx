'use client'

import Link from 'next/link'
import { BookOpen, ArrowUpRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto border-t border-[#6C2BD9]/30 bg-[#4C1D95] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg w-fit"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C2BD9] text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-white">{t('brandName')}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#EDE7FB]/80">
              {t('footerDesc')}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A78BFA]">
              {t('navigation')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-[#A78BFA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/curriculum"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-[#A78BFA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('fullCurriculum')}
                </Link>
              </li>
              <li>
                <Link
                  href="/foundation"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-[#A78BFA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('foundation')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-[#A78BFA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Inquiries */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A78BFA]">
              {t('inquiries')}
            </h3>
            <p className="mt-4 text-sm text-[#EDE7FB]/80">
              {t('inquiriesDesc')}
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg"
              >
                <span>{t('sendAMessage')}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#6C2BD9]/30 pt-8 sm:flex-row">
          <p className="text-xs text-[#EDE7FB]/70">
            &copy; {new Date().getFullYear()} {t('brandName')}. {t('rightsReserved')}
          </p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            <span className="text-xs text-[#A78BFA]/80">
              {t('designQuality')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
