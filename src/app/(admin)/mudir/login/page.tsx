import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'تسجيل دخول الإدارة | تعلّمي 365',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#EDE7FB]/70 via-[#F8F5FF] to-[#F8F5FF] px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
