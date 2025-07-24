'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ClassForm } from '@/components/forms/ClassForm'
import { classesService } from '@/lib/database'
import { 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  X,
  School,
  Users,
  GraduationCap,
  MapPin
} from 'lucide-react'

interface Class {
  id: string
  name: string
  section: string
  grade: string
  academicYear: string
  classTeacher?: string
  room?: string
  capacity?: string
  currentStudents: string
  subjects: string[]
  status: string
  description?: string
}

interface ClassesClientProps {
  userRole: string
  userName: string
  userEmail: string
  initialClasses: Class[]
}

export function ClassesClient({ userRole, userName, userEmail, initialClasses }: ClassesClientProps) {
  const [classes, setClasses] = useState<Class[]>(initialClasses)
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All Grades')
  const [statusFilter, setStatusFilter] = useState('All Status')

  // Filter classes based on search and filters
  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => {
      const matchesSearch = 
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (classItem.classTeacher && classItem.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesGrade = gradeFilter === 'All Grades' || classItem.grade === gradeFilter
      const matchesStatus = statusFilter === 'All Status' || classItem.status === statusFilter
      
      return matchesSearch && matchesGrade && matchesStatus
    })
  }, [classes, searchQuery, gradeFilter, statusFilter])

  const handleAddClass = async (data: any) => {
    try {
      // Prepare class data for database
      const classData = {
        name: data.name,
        section: data.section,
        grade: data.grade,
        class_teacher_id: data.classTeacher ? data.classTeacher : null,
        room: data.room,
        capacity: parseInt(data.capacity) || null,
        current_students: parseInt(data.currentStudents) || 0,
        schedule: data.schedule,
        description: data.description,
        subjects: data.subjects,
        is_active: data.isActive !== false
      }

      // Create class in database
      const newClass = await classesService.create(classData)
      
      // Transform for UI
      const uiClass: Class = {
        id: newClass.id,
        name: newClass.name,
        section: newClass.section,
        grade: newClass.grade,
        academicYear: '2024-2025',
        classTeacher: 'Not assigned',
        room: newClass.room || 'Not assigned',
        capacity: newClass.capacity?.toString() || '0',
        currentStudents: newClass.current_students?.toString() || '0',
        subjects: newClass.subjects || [],
        status: newClass.is_active ? 'Active' : 'Inactive',
        description: newClass.description || '',
        ...newClass
      }
      
      setClasses(prev => [uiClass, ...prev])
    } catch (error) {
      console.error('Error adding class:', error)
      throw error // Re-throw to show error toast
    }
  }

  const handleEditClass = async (data: any) => {
    try {
      // Prepare class data for database
      const classData = {
        name: data.name,
        section: data.section,
        grade: data.grade,
        class_teacher_id: data.classTeacher ? data.classTeacher : null,
        room: data.room,
        capacity: parseInt(data.capacity) || null,
        current_students: parseInt(data.currentStudents) || 0,
        schedule: data.schedule,
        description: data.description,
        subjects: data.subjects,
        is_active: data.isActive !== false
      }

      // Update class in database
      const updatedClass = await classesService.update(data.id, classData)
      
      // Transform for UI
      const uiClass: Class = {
        id: updatedClass.id,
        name: updatedClass.name,
        section: updatedClass.section,
        grade: updatedClass.grade,
        academicYear: '2024-2025',
        classTeacher: 'Not assigned',
        room: updatedClass.room || 'Not assigned',
        capacity: updatedClass.capacity?.toString() || '0',
        currentStudents: updatedClass.current_students?.toString() || '0',
        subjects: updatedClass.subjects || [],
        status: updatedClass.is_active ? 'Active' : 'Inactive',
        description: updatedClass.description || '',
        ...updatedClass
      }
      
      setClasses(prev => prev.map(classItem => 
        classItem.id === data.id ? uiClass : classItem
      ))
      setEditingClass(null)
    } catch (error) {
      console.error('Error updating class:', error)
      throw error // Re-throw to show error toast
    }
  }

  const handleDeleteClass = async (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await classesService.delete(classId)
        setClasses(prev => prev.filter(c => c.id !== classId))
      } catch (error) {
        console.error('Error deleting class:', error)
        alert('Failed to delete class. Please try again.')
      }
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setGradeFilter('All Grades')
    setStatusFilter('All Status')
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Class', 'Section', 'Grade', 'Teacher', 'Room', 'Capacity', 'Current Students', 'Status'],
      ...filteredClasses.map(classItem => [
        classItem.name,
        classItem.section,
        classItem.grade,
        classItem.classTeacher || '',
        classItem.room || '',
        classItem.capacity || '',
        classItem.currentStudents,
        classItem.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'classes.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getClassDisplayName = (classItem: Class) => {
    return `${classItem.name} ${classItem.section}`
  }

  const getUtilizationPercentage = (classItem: Class) => {
    if (!classItem.capacity) return 0
    return Math.round((parseInt(classItem.currentStudents) / parseInt(classItem.capacity)) * 100)
  }

  return (
    <>
      <DashboardLayout 
        title="Classes Management" 
        subtitle="Manage class schedules and assignments"
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
      >
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button 
                onClick={exportToCSV}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium rounded-md flex items-center space-x-2 transition-colors ${
                activeTab === 'all' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <School className="h-4 w-4" />
              <span>All Classes</span>
            </button>
            <button 
              onClick={() => setIsAddClassOpen(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Assign Students</span>
            </button>
          </div>

          {/* Classes Directory */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <School className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Classes Directory</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filteredClasses.length} classes
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option>All Grades</option>
                  <option>P.1</option>
                  <option>P.2</option>
                  <option>P.3</option>
                  <option>P.4</option>
                  <option>P.5</option>
                  <option>P.6</option>
                  <option>P.7</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <button 
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>

            {/* Classes Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Class</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Teacher</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subjects</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                        No classes found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((classItem) => (
                      <tr key={classItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{getClassDisplayName(classItem)}</p>
                            <p className="text-sm text-gray-500">Academic Year: {classItem.academicYear}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {classItem.grade}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {classItem.classTeacher || 'Not assigned'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {classItem.room || 'Not assigned'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {classItem.currentStudents}{classItem.capacity && `/${classItem.capacity}`}
                              </span>
                            </div>
                            {classItem.capacity && (
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      getUtilizationPercentage(classItem) > 90 ? 'bg-red-500' :
                                      getUtilizationPercentage(classItem) > 70 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${getUtilizationPercentage(classItem)}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {getUtilizationPercentage(classItem)}% full
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {classItem.subjects.slice(0, 2).map((subject, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {subject}
                              </span>
                            ))}
                            {classItem.subjects.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{classItem.subjects.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            classItem.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {classItem.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingClass(classItem)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClass(classItem.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Add/Edit Class Modal */}
      <ClassForm
        isOpen={isAddClassOpen || !!editingClass}
        onClose={() => {
          setIsAddClassOpen(false)
          setEditingClass(null)
        }}
        onSubmit={editingClass ? handleEditClass : handleAddClass}
        editData={editingClass}
      />
    </>
  )
}