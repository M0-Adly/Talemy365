import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { LOGIN_PATH } from '@/lib/constants'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth-session'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const session = await verifyAdminToken(token)

  if (!session) {
    redirect(LOGIN_PATH)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5FF] md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
