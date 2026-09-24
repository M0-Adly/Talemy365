'use client'

import { useActionState, useRef } from 'react'
import { submitContact } from '@/features/contact/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'
import type { ActionResult } from '@/lib/errors'

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState(
    async (_prevState: ActionResult<unknown> | null, formData: FormData) => {
      const res = await submitContact(formData)
      if (res.success) {
        formRef.current?.reset()
      }
      return res
    },
    null
  )

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
      {state?.success && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900">Message sent successfully</h4>
            <p className="mt-1 text-sm text-emerald-700">
              Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.
            </p>
          </div>
        </div>
      )}

      {state && !state.success && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-900">Unable to send message</h4>
            <p className="mt-1 text-sm text-rose-700">{state.error}</p>
          </div>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-6">
        {/* Anti-spam honeypot */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Leave this blank</label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="name" required>
            Full Name
          </Label>
          <div className="mt-2">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Sarah Ahmad"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" required>
            Email Address
          </Label>
          <div className="mt-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. sarah@example.com"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message" required>
            Your Message
          </Label>
          <div className="mt-2">
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder="How can we assist you with our curriculum or enrollment?"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          isLoading={isPending}
          disabled={isPending}
        >
          <Send className="mr-2 h-4 w-4" />
          <span>Send Message</span>
        </Button>
      </form>
    </div>
  )
}
