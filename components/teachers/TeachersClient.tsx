'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TeacherRegistrationForm } from '@/components/forms/TeacherRegistrationForm'
import { 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  X,
  GraduationCap,
  Phone,
  Mail
} from 'lucide-react'

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subjects: string[]
  designation: string
  status: string
  joiningDate?: string
  experience?: string
}

interface TeachersClientProps {
  userRole: string
  userName: string
  userEmail: string
  initialTeachers: Teacher[]
}

export function TeachersClient({ userRole, userName, userEmail, initialTeachers }: TeachersClientProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')

  // Filter teachers based on search and filters
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch = 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.designation.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'All Status' || teacher.status === statusFilter
      const matchesSubject = subjectFilter === 'All Subjects' || 
        teacher.subjects.some(subject => subject.toLowerCase().includes(subjectFilter.toLowerCase()))
      
      return matchesSearch && matchesStatus && matchesSubject
    })
  }, [teachers, searchQuery, statusFilter, subjectFilter])

  const handleAddTeacher = async (data: any) => {
    const newTeacher: Teacher = {
      id: data.id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      subjects: data.subjects,
      designation: data.designation,
      status: 'Active',
      joiningDate: data.joiningDate,
      experience: data.experience
    }
    
    setTeachers(prev => [newTeacher, ...prev])
    console.log('New teacher added:', newTeacher)
  }

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(prev => prev.filter(t => t.id !== teacherId))
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('All Status')
    setSubjectFilter('All Subjects')
  }

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Subjects', 'Designation', 'Status'],
      ...filteredTeachers.map(teacher => [
        teacher.id,
        teacher.name,
        teacher.email,
        teacher.phone,
        teacher.subjects.join('; '),
        teacher.designation,
        teacher.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teachers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <DashboardLayout 
        title="Teachers Management" 
        subtitle="Manage teacher registrations and assignments"
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
              <GraduationCap className="h-4 w-4" />
              <span>All Teachers</span>
            </button>
            <button 
              onClick={() => setIsAddTeacherOpen(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Teacher</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Details</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Assignments</span>
            </button>
          </div>

          {/* Teachers Directory */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Teachers Directory</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filteredTeachers.length} teachers
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <select 
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option>All Subjects</option>
                  <option>English</option>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>Social Studies</option>
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

            {/* Teachers Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Photo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Teacher Details</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Contact Info</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subjects</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Designation</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                        No teachers found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{teacher.name}</p>
                            <p className="text-sm text-gray-500">ID: {teacher.id}</p>
                            {teacher.experience && (
                              <p className="text-xs text-gray-400">{teacher.experience} years exp.</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-900">{teacher.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-500">{teacher.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map((subject, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {teacher.designation}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            teacher.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTeacher(teacher.id)}
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

      {/* Add Teacher Modal */}
      <TeacherRegistrationForm
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        onSubmit={handleAddTeacher}
      />
    </>
  )
}