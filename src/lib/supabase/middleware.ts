import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_PATH, LOGIN_PATH } from '@/lib/constants'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Always use getUser(), NEVER getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes (except login page)
  const isAdminRoute =
    request.nextUrl.pathname.startsWith(ADMIN_PATH) &&
    !request.nextUrl.pathname.startsWith(LOGIN_PATH)

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login page
  if (request.nextUrl.pathname.startsWith(LOGIN_PATH) && user) {
    const url = request.nextUrl.clone()
    url.pathname = ADMIN_PATH
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
