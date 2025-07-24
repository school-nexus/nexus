import { SubjectsClient } from '@/components/subjects/SubjectsClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function SubjectsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock subjects data
  const subjects = [
    {
      id: 'SUB-001',
      code: 'ENG',
      name: 'English',
      category: 'Core',
      credits: '3',
      totalMarks: '100',
      status: 'Active',
      description: 'English Language and Literature'
    }
  ]

  return (
    <SubjectsClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialSubjects={subjects}
    />
  )
}