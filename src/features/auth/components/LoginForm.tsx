'use client'

import { useActionState } from 'react'
import { login } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Mail, AlertCircle, Shield } from 'lucide-react'


export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      return await login(formData)
    },
    null
  )

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-lg">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Shield className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
          Faculty & Admin Portal
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to manage curriculum, units, and site inquiries.
        </p>
      </div>

      {state && !state.success && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email" required>
            Admin Email
          </Label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@taal3amy.edu"
              required
              disabled={isPending}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" required>
            Password
          </Label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
              disabled={isPending}
              className="pl-10"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-semibold"
            isLoading={isPending}
            disabled={isPending}
          >
            Sign In to Dashboard
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center">
        <p className="text-xs text-gray-400">
          Restricted access. All actions are logged and audited.
        </p>
      </div>
    </div>
  )
}
