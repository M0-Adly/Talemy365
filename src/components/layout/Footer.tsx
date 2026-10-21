'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
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
              className="flex items-center gap-3 text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg w-fit"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white p-0.5">
                <Image
                  src="/logo.jpeg"
                  alt="Talemy365 Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-black text-white">{t('brandName')}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#EDE7FB]/85">
              {t('footerDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A78BFA]">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/curriculum"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('curriculum')}
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('courses')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[36px] items-center text-sm text-[#EDE7FB] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Inquiries */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A78BFA]">
              {t('inquiries')}
            </h3>
            <p className="mt-4 text-sm text-[#EDE7FB]/85">
              {t('inquiriesDesc')}
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg"
              >
                <span>{t('contact')}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#6C2BD9]/30 pt-8 sm:flex-row">
          <p className="text-xs text-[#EDE7FB]/80">
            {t('allRightsReserved')} {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
