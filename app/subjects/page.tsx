import { SubjectsClient } from '@/components/subjects/SubjectsClient'
import { createClient } from '@/utils/supabase/server'
import { subjectsService } from '@/lib/database'
import { cookies } from 'next/headers'

export default async function SubjectsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Fetch subjects from database
  let subjects = []
  try {
    const dbSubjects = await subjectsService.getAll()
    subjects = dbSubjects.map(subject => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      category: subject.category,
      credits: subject.credits?.toString() || '',
      totalMarks: subject.total_marks?.toString() || '',
      status: subject.is_active ? 'Active' : 'Inactive',
      description: subject.description || '',
      // Include all database fields
      ...subject
    }))
  } catch (error) {
    console.error('Error fetching subjects:', error)
    // Fallback to mock data if database fails
    subjects = [
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
  }

  return (
    <SubjectsClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialSubjects={subjects}
    />
  )
}