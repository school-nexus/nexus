import { TermsClient } from '@/components/terms/TermsClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function TermsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  const terms = [
    {
      id: 'TERM-001',
      name: 'Term 2',
      code: 'T2-2025',
      academicYear: '2025-2026',
      startDate: '2025-05-26',
      endDate: '2025-09-30',
      status: 'active',
      totalWeeks: '18',
      feeAmount: '500000',
      description: 'Second term of academic year 2025-2026'
    }
  ]

  return (
    <TermsClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialTerms={terms}
    />
  )
}