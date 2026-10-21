import type { Metadata } from 'next'
import { Mail, Clock, MapPin } from 'lucide-react'
import { ContactForm } from '@/features/contact/components/ContactForm'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: `تواصل مع إدارة ${SITE_NAME} للاستفسار عن المناهج والكورسات.`,
}

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE7FB] bg-[#EDE7FB] px-4 py-1.5 text-xs font-semibold text-[#4C1D95]">
            <Mail className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>الدعم والتواصل</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#4C1D95] sm:text-4xl">
            تواصل معنا
          </h1>

          <p className="mt-3 text-base text-[#6B5B95] leading-relaxed">
            نسعد دائماً بالإجابة على استفساراتك واقتراحاتك حول المناهج والكورسات المتاحة.
          </p>
        </div>

        {/* Form and Contact Information Grid */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Contact Details Column */}
          <div className="flex flex-col space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-[#4C1D95]">
                معلومات التواصل
              </h3>
              <p className="text-sm text-[#2D3748] leading-relaxed">
                يمكنك مراسلتنا في أي وقت عبر النموذج أو عبر البريد الإلكتروني وسنرد عليك في أقرب فرصة.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-sm text-[#2D3748]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EDE7FB] text-[#7C3AED]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#4C1D95]">البريد الإلكتروني:</span>
                    <p className="text-xs text-[#6B5B95] mt-0.5">Talemy365.eg@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-[#2D3748]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EDE7FB] text-[#7C3AED]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#4C1D95]">أوقات العمل والدعم:</span>
                    <p className="text-xs text-[#6B5B95] mt-0.5">يومياً من 9:00 صباحاً حتى 9:00 مساءً</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-[#2D3748]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EDE7FB] text-[#7C3AED]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#4C1D95]">الموقع:</span>
                    <p className="text-xs text-[#6B5B95] mt-0.5">مصر - منصة تعلّمي 365 التعليمية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
