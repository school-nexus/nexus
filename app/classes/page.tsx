import { ClassesClient } from '@/components/classes/ClassesClient'
import { createClient } from '@/utils/supabase/server'
import { classesService } from '@/lib/database'
import { cookies } from 'next/headers'

export default async function ClassesPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Fetch classes from database
  let classes = []
  try {
    const dbClasses = await classesService.getAll()
    classes = dbClasses.map(classItem => ({
      id: classItem.id,
      name: classItem.name,
      section: classItem.section,
      grade: classItem.grade,
      academicYear: '2024-2025', // From academic year relation
      classTeacher: classItem.class_teacher 
        ? `${classItem.class_teacher.first_name} ${classItem.class_teacher.last_name}`
        : 'Not assigned',
      room: classItem.room || 'Not assigned',
      capacity: classItem.capacity?.toString() || '0',
      currentStudents: classItem.current_students?.toString() || '0',
      subjects: classItem.subjects || [],
      status: classItem.is_active ? 'Active' : 'Inactive',
      description: classItem.description || '',
      // Include all database fields
      ...classItem
    }))
  } catch (error) {
    console.error('Error fetching classes:', error)
    // Fallback to mock data if database fails
    classes = [
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
  }

  return (
    <ClassesClient 
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      initialClasses={classes}
    />
  )
}