import { StudentsClient } from '@/components/students/StudentsClient'
import { createClient } from '@/utils/supabase/server'
import { studentsService } from '@/lib/database'
import { cookies } from 'next/headers'

export default async function StudentsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Fetch students from database
  let students = []
  try {
    const dbStudents = await studentsService.getAll()
    students = dbStudents.map(student => ({
      id: student.id,
      name: `${student.first_name} ${student.last_name}`,
      email: student.email || '',
      phone: student.phone || '',
      class: student.class ? `${student.class.name} ${student.class.section}` : 'Not assigned',
      status: student.status === 'active' ? 'Active' : 'Inactive',
      // Include all database fields for detailed view
      ...student
    }))
  } catch (error) {
    console.error('Error fetching students:', error)
    // Fallback to mock data if database fails
    students = [
      {
        id: 'STU-001',
        name: 'Nash Files',
        email: 'creamland179@gmail.com',
        phone: '0758601100',
        class: 'P.7 - A',
        status: 'Active',
        photo: '/placeholder-avatar.png'
      },
      {
        id: 'STU-002',
        name: 'Nuwabaga Paul',
        email: 'nelsonnuwagaba160@gmail.com',
        phone: '0708174855',
        class: 'P.7 - A',
        status: 'Active',
        photo: '/placeholder-avatar.png'
      }
    ]
  }

  return (
    <StudentsClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialStudents={students}
    />
  )
}