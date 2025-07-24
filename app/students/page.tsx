import { StudentsClient } from '@/components/students/StudentsClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function StudentsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock student data based on the images
  const students = [
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

    return (
    <StudentsClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialStudents={students}
    />
  )
}