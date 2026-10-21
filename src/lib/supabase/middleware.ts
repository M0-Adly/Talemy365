import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_PATH, LOGIN_PATH } from '@/lib/constants'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth-session'

export async function updateSession(request: NextRequest) {
  const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const adminSession = adminToken ? await verifyAdminToken(adminToken) : null
  const isValidAdmin = Boolean(adminSession)

  const pathname = request.nextUrl.pathname

  // Protect all /mudir routes (except /mudir/login)
  const isProtectedAdminRoute =
    pathname.startsWith(ADMIN_PATH) && !pathname.startsWith(LOGIN_PATH)

  if (isProtectedAdminRoute && !isValidAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    return NextResponse.redirect(url)
  }

  // Redirect logged-in admin away from /mudir/login directly to /mudir
  if (pathname.startsWith(LOGIN_PATH) && isValidAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = ADMIN_PATH
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}
