import { ClassesClient } from '@/components/classes/ClassesClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function ClassesPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock classes data
  const classes = [
    {
      id: 'CLS-001',
      name: 'P.7',
      section: 'A',
      grade: 'P.7',
      academicYear: '2024-2025',
      classTeacher: 'Nuwabaga Nelson',
      room: 'Room 101',
      capacity: '40',
      currentStudents: '32',
      subjects: ['English', 'Mathematics', 'Science', 'Social Studies'],
      status: 'Active',
      description: 'Primary 7 Section A - Main classroom'
    }
  ]

  return (
    <ClassesClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialClasses={classes}
    />
  )
}