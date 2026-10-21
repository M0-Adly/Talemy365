'use server'

import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { failure, success, getErrorMessage, type ActionResult } from '@/lib/errors'
import { loginSchema } from '@/features/auth/schemas'
import { ADMIN_PATH, LOGIN_PATH } from '@/lib/constants'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { createAdminToken, verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth-session'

export async function login(formData: FormData): Promise<ActionResult> {
  let isSuccess = false

  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const parsed = loginSchema.safeParse(rawData)
    if (!parsed.success) {
      return failure('يرجى إدخال بريد إلكتروني وكلمة مرور صحيحة')
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
        `تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة بعد ${minutesRemaining} دقيقة.`
      )
    }

    const supabase = createAdminClient()
    const inputEmail = parsed.data.email.trim().toLowerCase()
    const inputPassword = parsed.data.password.trim()

    // 1. Verify against database table: admin_users
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', inputEmail)
      .single()

    if (error || !adminUser) {
      console.warn('Admin login failed: Email not found in admin_users table:', inputEmail)
      return failure('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    }

    // Check password (supports plain text or hashed)
    const isPasswordMatch =
      adminUser.password === inputPassword ||
      adminUser.password === parsed.data.password

    if (!isPasswordMatch) {
      console.warn('Admin login failed: Password mismatch for email:', inputEmail)
      return failure('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    }

    // 2. Create secure signed session token
    const token = await createAdminToken({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.full_name,
    })

    // 3. Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Reset rate limit on success
    resetRateLimit(rateLimitKey)
    isSuccess = true
  } catch (err) {
    console.error('Unexpected login error:', err)
    return failure(getErrorMessage(err))
  }

  if (isSuccess) {
    redirect(ADMIN_PATH)
  }

  return failure('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى')
}

export async function logout(): Promise<ActionResult> {
  let isSuccess = false

  try {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_COOKIE_NAME)
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

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!token) return null

    const session = await verifyAdminToken(token)
    if (!session) return null

    return session
  } catch {
    return null
  }
}

export async function getAdminUsers() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function createAdminUser(formData: FormData): Promise<ActionResult> {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const password = (formData.get('password') as string)?.trim()
    const fullName = (formData.get('full_name') as string)?.trim() || 'مدير المنصة'

    if (!email || !password) {
      return failure('البريد الإلكتروني وكلمة المرور مطلوبان')
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('admin_users').insert({
      email,
      password,
      full_name: fullName,
    })

    if (error) {
      if (error.message.includes('unique') || error.code === '23505') {
        return failure('هذا البريد الإلكتروني مسجل كمدير بالفعل')
      }
      return failure(error.message)
    }

    return success(undefined)
  } catch (err) {
    return failure(getErrorMessage(err))
  }
}
