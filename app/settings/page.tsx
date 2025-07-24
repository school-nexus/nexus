import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Settings } from 'lucide-react'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Configure system settings and preferences"
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="card text-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-600">Settings configuration is under development. Coming soon!</p>
      </div>
    </DashboardLayout>
  )
}