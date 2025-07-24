import { TeachersClient } from '@/components/teachers/TeachersClient'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function TeachersPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock teacher data
  const teachers = [
    {
      id: 'TCH-001',
      name: 'Nuwabaga Nelson',
      email: 'nelsonnuwagaba160@gmail.com',
      phone: '0708174855',
      subjects: ['Mathematics', 'Science'],
      designation: 'Senior Teacher',
      status: 'Active'
    }
  ]

  return (
    <TeachersClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialTeachers={teachers}
    />
  )
}