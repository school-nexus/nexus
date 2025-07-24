import { createClient } from '@/utils/supabase/client'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// Types
export interface Student {
  id?: string
  student_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  blood_group?: string
  photo_url?: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  class_id?: string
  roll_number?: string
  admission_date?: string
  admission_number?: string
  status?: 'active' | 'inactive' | 'suspended'
  class?: {
    name: string
    section: string
    grade: string
  }
}

export interface Teacher {
  id?: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  photo_url?: string
  designation: string
  qualification: string
  experience?: number
  joining_date: string
  salary?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  status?: 'active' | 'inactive'
  subjects?: string[]
}

export interface Subject {
  id?: string
  code: string
  name: string
  description?: string
  category: string
  credits?: number
  total_marks?: number
  passing_marks?: number
  duration_hours?: number
  objectives?: string
  syllabus?: string
  prerequisites?: string
  is_active?: boolean
}

export interface ClassRoom {
  id?: string
  name: string
  section: string
  grade: string
  academic_year_id?: string
  class_teacher_id?: string
  room?: string
  capacity?: number
  current_students?: number
  schedule?: string
  description?: string
  is_active?: boolean
  class_teacher?: {
    first_name: string
    last_name: string
  }
  subjects?: string[]
}

export interface Term {
  id?: string
  name: string
  code?: string
  academic_year_id?: string
  start_date: string
  end_date: string
  registration_start?: string
  registration_end?: string
  exam_start?: string
  exam_end?: string
  result_date?: string
  status?: 'upcoming' | 'active' | 'completed' | 'suspended'
  total_weeks?: number
  holiday_days?: number
  fee_amount?: number
  description?: string
  is_active?: boolean
}

export interface Exam {
  id?: string
  name: string
  exam_type: string
  subject_id: string
  class_id: string
  term_id?: string
  exam_date: string
  start_time: string
  duration_minutes?: number
  total_marks: number
  passing_marks?: number
  instructions?: string
  venue?: string
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  subject?: {
    name: string
    code: string
  }
  class?: {
    name: string
    section: string
  }
}

export interface StudentFee {
  id?: string
  student_id: string
  term_id?: string
  fee_type_id: string
  total_amount: number
  paid_amount?: number
  discount_amount?: number
  late_fee_penalty?: number
  due_date: string
  payment_date?: string
  payment_method?: string
  description?: string
  status?: 'paid' | 'partial' | 'pending' | 'overdue'
  student?: {
    first_name: string
    last_name: string
    student_id: string
  }
  fee_type?: {
    name: string
  }
}

// Helper function to get Supabase client
export function getSupabaseClient() {
  if (typeof window !== 'undefined') {
    return createClient()
  } else {
    const cookieStore = cookies()
    return createServerClient(cookieStore)
  }
}

// Students CRUD operations
export const studentsService = {
  async getAll(): Promise<Student[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        class:classes (
          name,
          section,
          grade
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Student | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        class:classes (
          name,
          section,
          grade
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, student: Partial<Student>): Promise<Student> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Teachers CRUD operations
export const teachersService = {
  async getAll(): Promise<Teacher[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        teacher_subjects (
          subject:subjects (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform the data to include subjects array
    return data?.map(teacher => ({
      ...teacher,
      subjects: teacher.teacher_subjects?.map((ts: any) => ts.subject.name) || []
    })) || []
  },

  async create(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    const supabase = getSupabaseClient()
    
    // Extract subjects from teacher data
    const { subjects, ...teacherData } = teacher
    
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacherData])
      .select()
      .single()

    if (error) throw error

    // If subjects are provided, create teacher-subject associations
    if (subjects && subjects.length > 0) {
      // First get subject IDs
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id, name')
        .in('name', subjects)

      if (subjectData) {
        const teacherSubjects = subjectData.map(subject => ({
          teacher_id: data.id,
          subject_id: subject.id
        }))

        await supabase
          .from('teacher_subjects')
          .insert(teacherSubjects)
      }
    }

    return { ...data, subjects: subjects || [] }
  },

  async update(id: string, teacher: Partial<Teacher>): Promise<Teacher> {
    const supabase = getSupabaseClient()
    
    const { subjects, ...teacherData } = teacher
    
    const { data, error } = await supabase
      .from('teachers')
      .update(teacherData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update subjects if provided
    if (subjects !== undefined) {
      // Delete existing associations
      await supabase
        .from('teacher_subjects')
        .delete()
        .eq('teacher_id', id)

      // Add new associations
      if (subjects.length > 0) {
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id, name')
          .in('name', subjects)

        if (subjectData) {
          const teacherSubjects = subjectData.map(subject => ({
            teacher_id: id,
            subject_id: subject.id
          }))

          await supabase
            .from('teacher_subjects')
            .insert(teacherSubjects)
        }
      }
    }

    return { ...data, subjects: subjects || [] }
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Subjects CRUD operations
export const subjectsService = {
  async getAll(): Promise<Subject[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  async create(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, subject: Partial<Subject>): Promise<Subject> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('subjects')
      .update(subject)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Classes CRUD operations
export const classesService = {
  async getAll(): Promise<ClassRoom[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        class_teacher:teachers (
          first_name,
          last_name
        ),
        class_subjects (
          subject:subjects (
            name
          )
        )
      `)
      .order('grade', { ascending: true })

    if (error) throw error

    // Transform the data to include subjects array
    return data?.map(classRoom => ({
      ...classRoom,
      subjects: classRoom.class_subjects?.map((cs: any) => cs.subject.name) || []
    })) || []
  },

  async create(classRoom: Omit<ClassRoom, 'id'>): Promise<ClassRoom> {
    const supabase = getSupabaseClient()
    
    // Get current academic year
    const { data: academicYear } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_current', true)
      .single()

    const { subjects, ...classData } = classRoom
    
    const classToInsert = {
      ...classData,
      academic_year_id: academicYear?.id
    }
    
    const { data, error } = await supabase
      .from('classes')
      .insert([classToInsert])
      .select()
      .single()

    if (error) throw error

    // Add subject associations
    if (subjects && subjects.length > 0) {
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id, name')
        .in('name', subjects)

      if (subjectData) {
        const classSubjects = subjectData.map(subject => ({
          class_id: data.id,
          subject_id: subject.id
        }))

        await supabase
          .from('class_subjects')
          .insert(classSubjects)
      }
    }

    return { ...data, subjects: subjects || [] }
  },

  async update(id: string, classRoom: Partial<ClassRoom>): Promise<ClassRoom> {
    const supabase = getSupabaseClient()
    
    const { subjects, ...classData } = classRoom
    
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update subjects if provided
    if (subjects !== undefined) {
      // Delete existing associations
      await supabase
        .from('class_subjects')
        .delete()
        .eq('class_id', id)

      // Add new associations
      if (subjects.length > 0) {
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id, name')
          .in('name', subjects)

        if (subjectData) {
          const classSubjects = subjectData.map(subject => ({
            class_id: id,
            subject_id: subject.id
          }))

          await supabase
            .from('class_subjects')
            .insert(classSubjects)
        }
      }
    }

    return { ...data, subjects: subjects || [] }
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Terms CRUD operations
export const termsService = {
  async getAll(): Promise<Term[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('terms')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(term: Omit<Term, 'id'>): Promise<Term> {
    const supabase = getSupabaseClient()
    
    // Get current academic year if not provided
    if (!term.academic_year_id) {
      const { data: academicYear } = await supabase
        .from('academic_years')
        .select('id')
        .eq('is_current', true)
        .single()

      term.academic_year_id = academicYear?.id
    }
    
    const { data, error } = await supabase
      .from('terms')
      .insert([term])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, term: Partial<Term>): Promise<Term> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('terms')
      .update(term)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('terms')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Exams CRUD operations
export const examsService = {
  async getAll(): Promise<Exam[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        subject:subjects (
          name,
          code
        ),
        class:classes (
          name,
          section
        )
      `)
      .order('exam_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(exam: Omit<Exam, 'id'>): Promise<Exam> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('exams')
      .insert([exam])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, exam: Partial<Exam>): Promise<Exam> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('exams')
      .update(exam)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Student Fees CRUD operations
export const studentFeesService = {
  async getAll(): Promise<StudentFee[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('student_fees')
      .select(`
        *,
        student:students (
          first_name,
          last_name,
          student_id
        ),
        fee_type:fee_types (
          name
        )
      `)
      .order('due_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(fee: Omit<StudentFee, 'id'>): Promise<StudentFee> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('student_fees')
      .insert([fee])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, fee: Partial<StudentFee>): Promise<StudentFee> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('student_fees')
      .update(fee)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('student_fees')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Utility functions
export const utilityService = {
  async getFeeTypes() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('fee_types')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  async getAcademicYears() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getCurrentAcademicYear() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .eq('is_current', true)
      .single()

    if (error) throw error
    return data
  }
}