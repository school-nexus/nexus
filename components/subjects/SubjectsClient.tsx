'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SubjectForm } from '@/components/forms/SubjectForm'
import { 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  X,
  BookOpen,
  Users,
  Clock
} from 'lucide-react'

interface Subject {
  id: string
  code: string
  name: string
  category: string
  credits?: string
  totalMarks?: string
  status: string
  description?: string
}

interface SubjectsClientProps {
  userRole: string
  userName: string
  userEmail: string
  initialSubjects: Subject[]
}

export function SubjectsClient({ userRole, userName, userEmail, initialSubjects }: SubjectsClientProps) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')

  // Filter subjects based on search and filters
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const matchesSearch = 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = categoryFilter === 'All Categories' || subject.category === categoryFilter
      const matchesStatus = statusFilter === 'All Status' || subject.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [subjects, searchQuery, categoryFilter, statusFilter])

  const handleAddSubject = async (data: any) => {
    const newSubject: Subject = {
      id: data.id,
      code: data.code,
      name: data.name,
      category: data.category,
      credits: data.credits,
      totalMarks: data.totalMarks,
      status: data.status,
      description: data.description
    }
    
    setSubjects(prev => [newSubject, ...prev])
    console.log('New subject added:', newSubject)
  }

  const handleEditSubject = async (data: any) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === data.id ? { ...subject, ...data } : subject
    ))
    setEditingSubject(null)
    console.log('Subject updated:', data)
  }

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      setSubjects(prev => prev.filter(s => s.id !== subjectId))
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('All Categories')
    setStatusFilter('All Status')
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Code', 'Name', 'Category', 'Credits', 'Total Marks', 'Status'],
      ...filteredSubjects.map(subject => [
        subject.code,
        subject.name,
        subject.category,
        subject.credits || '',
        subject.totalMarks || '',
        subject.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subjects.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <DashboardLayout 
        title="Subjects Management" 
        subtitle="Manage subjects and curriculum"
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
              <BookOpen className="h-4 w-4" />
              <span>All Subjects</span>
            </button>
            <button 
              onClick={() => setIsAddSubjectOpen(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Subject</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Assign Subjects</span>
            </button>
          </div>

          {/* Subjects Directory */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Subjects Directory</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filteredSubjects.length} subjects
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option>All Categories</option>
                  <option>Core</option>
                  <option>Optional</option>
                  <option>Extra-curricular</option>
                  <option>Practical</option>
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

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subject Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Credits</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total Marks</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                        No subjects found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm font-medium text-purple-600">
                            {subject.code}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{subject.name}</p>
                            {subject.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {subject.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subject.category === 'Core' ? 'bg-blue-100 text-blue-800' :
                            subject.category === 'Optional' ? 'bg-green-100 text-green-800' :
                            subject.category === 'Extra-curricular' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {subject.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">
                            {subject.credits || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">
                            {subject.totalMarks || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subject.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subject.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingSubject(subject)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSubject(subject.id)}
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

      {/* Add/Edit Subject Modal */}
      <SubjectForm
        isOpen={isAddSubjectOpen || !!editingSubject}
        onClose={() => {
          setIsAddSubjectOpen(false)
          setEditingSubject(null)
        }}
        onSubmit={editingSubject ? handleEditSubject : handleAddSubject}
        editData={editingSubject}
      />
    </>
  )
}