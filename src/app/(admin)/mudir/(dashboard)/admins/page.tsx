import type { Metadata } from 'next'
import { getAdminUsers } from '@/features/auth/actions'
import { AdminsManager } from '@/features/admin/components/AdminsManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'إدارة حسابات المدراء',
}

export default async function AdminsPage() {
  const admins = await getAdminUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#4C1D95] sm:text-3xl">
          إدارة حسابات المدراء
        </h1>
        <p className="mt-1 text-xs text-[#6B5B95]">
          التحكم في حسابات المدراء المسجلين في قاعدة البيانات والذين يملكون صلاحية الوصول للوحة التحكم.
        </p>
      </div>

      <AdminsManager initialAdmins={admins} />
    </div>
  )
}
