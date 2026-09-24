import type { Metadata } from 'next'
import { Mail, MapPin, Clock, MessageSquareQuote } from 'lucide-react'
import { ContactForm } from '@/features/contact/components/ContactForm'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${SITE_NAME}. Contact our academic advisors regarding admissions, curriculum units, or foundation enrollment.`,
}

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
            <Mail className="h-3.5 w-3.5" />
            <span>Admissions & Support</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Get in Touch
          </h1>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Have questions about our syllabus, cohort timings, or the 4-Phase Foundation? Send us
            a message and an educational consultant will follow up promptly.
          </p>
        </div>

        {/* Form and Contact Information Grid */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Details Column */}
          <div className="flex flex-col justify-between space-y-8 lg:col-span-5">
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-6">
                <h3 className="text-base font-bold text-gray-900">
                  Admissions Office
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Our advisors are available for prospective students seeking curriculum details,
                  prerequisites, or guidance on unit sequences.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900">Email:</span>
                      <p>admissions@taal3amy.edu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900">Office Hours:</span>
                      <p>Monday – Friday, 9:00 AM – 5:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900">Campus:</span>
                      <p>Taal3amy Center for Academic Learning</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student quote card */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
                <MessageSquareQuote className="h-6 w-6 text-blue-600" />
                <p className="mt-3 text-sm italic text-blue-950">
                  &ldquo;The structure of the foundation course completely transformed how I
                  approached subsequent study units. Highly recommended for serious learners.&rdquo;
                </p>
                <span className="mt-3 block text-xs font-semibold text-blue-800">
                  — Foundation Graduate
                </span>
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
