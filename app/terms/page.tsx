import { TermsClient } from '@/components/terms/TermsClient'
import { createClient } from '@/utils/supabase/server'
import { termsService } from '@/lib/database'
import { cookies } from 'next/headers'

export default async function TermsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Fetch terms from database
  let terms = []
  try {
    const dbTerms = await termsService.getAll()
    terms = dbTerms.map(term => ({
      id: term.id,
      name: term.name,
      code: term.code || '',
      academicYear: '2024-2025', // From academic year relation
      startDate: term.start_date,
      endDate: term.end_date,
      status: term.status || 'upcoming',
      totalWeeks: term.total_weeks?.toString() || '',
      feeAmount: term.fee_amount?.toString() || '',
      description: term.description || '',
      // Include all database fields
      ...term
    }))
  } catch (error) {
    console.error('Error fetching terms:', error)
    // Fallback to mock data if database fails
    terms = [
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
  }

  return (
    <TermsClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialTerms={terms}
    />
  )
}