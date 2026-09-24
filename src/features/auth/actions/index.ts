'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { failure, getErrorMessage, type ActionResult } from '@/lib/errors'
import { loginSchema } from '@/features/auth/schemas'
import { ADMIN_PATH, LOGIN_PATH } from '@/lib/constants'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'

export async function login(formData: FormData): Promise<ActionResult> {
  let isSuccess = false

  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const parsed = loginSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure('Invalid email or password')
    }

    // Rate limit by IP + email to prevent brute-force attacks
    const reqHeaders = await headers()
    const ip = reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip') || 'unknown-ip'
    const rateLimitKey = `login:${ip}:${parsed.data.email.toLowerCase().trim()}`

    const rateLimit = checkRateLimit(rateLimitKey, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    })

    if (!rateLimit.success) {
      const minutesRemaining = Math.ceil((rateLimit.resetTime - Date.now()) / 60000)
      return failure(
        `Too many failed login attempts. Please try again in ${minutesRemaining} minutes.`
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      console.error('Login authentication error:', error.message)
      return failure('Invalid email or password')
    }

    // Reset rate limit counter on successful login
    resetRateLimit(rateLimitKey)
    isSuccess = true
  } catch (err) {
    console.error('Unexpected login error:', err)
    return failure(getErrorMessage(err))
  }

  if (isSuccess) {
    redirect(ADMIN_PATH)
  }

  return failure('Unexpected error occurred')
}

export async function logout(): Promise<ActionResult> {
  let isSuccess = false

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error.message)
      return failure(getErrorMessage(error))
    }

    isSuccess = true
  } catch (err) {
    console.error('Unexpected logout error:', err)
    return failure(getErrorMessage(err))
  }

  if (isSuccess) {
    redirect(LOGIN_PATH)
  }

  return failure('Unexpected error occurred')
}
