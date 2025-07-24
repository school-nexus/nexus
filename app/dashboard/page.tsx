import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock data - in a real app, this would come from Supabase
  const stats = {
    totalStudents: 2,
    totalTeachers: 1,
    feesCollected: 3000,
    totalSubjects: 1,
  }

    return (
    <DashboardClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      stats={stats}
    />
  )
}