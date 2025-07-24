import { FeesClient } from '@/components/fees/FeesClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function FeesPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock fees data
  const feeRecords = [
    {
      id: 'FEE-001',
      student: 'Nash Files',
      class: 'P.7 A',
      feeType: 'Tuition',
      totalAmount: 'UGX 500,000',
      paidAmount: 'UGX 500,000',
      balance: 'UGX 0',
      dueDate: '01/06/2025',
      status: 'paid'
    },
    {
      id: 'FEE-002',
      student: 'Nuwabaga Paul',
      class: 'P.7 A',
      feeType: 'Tuition',
      totalAmount: 'UGX 500,000',
      paidAmount: 'UGX 300,000',
      balance: 'UGX 200,000',
      dueDate: '02/06/2025',
      status: 'partial'
    }
  ]

    return (
    <FeesClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialFeeRecords={feeRecords}
    />
  )
}