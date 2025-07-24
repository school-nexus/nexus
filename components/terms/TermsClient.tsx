'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TermForm } from '@/components/forms/TermForm'
import { termsService } from '@/lib/database'
import { 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  X,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react'

interface Term {
  id: string
  name: string
  code?: string
  academicYear: string
  startDate: string
  endDate: string
  status: string
  description?: string
  totalWeeks?: string
  feeAmount?: string
}

interface TermsClientProps {
  userRole: string
  userName: string
  userEmail: string
  initialTerms: Term[]
}

export function TermsClient({ userRole, userName, userEmail, initialTerms }: TermsClientProps) {
  const [terms, setTerms] = useState<Term[]>(initialTerms)
  const [isAddTermOpen, setIsAddTermOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [yearFilter, setYearFilter] = useState('All Years')

  // Filter terms based on search and filters
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchesSearch = 
        term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.academicYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (term.code && term.code.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesStatus = statusFilter === 'All Status' || term.status === statusFilter
      const matchesYear = yearFilter === 'All Years' || term.academicYear === yearFilter
      
      return matchesSearch && matchesStatus && matchesYear
    })
  }, [terms, searchQuery, statusFilter, yearFilter])

  const handleAddTerm = async (data: any) => {
    try {
      // Prepare term data for database
      const termData = {
        name: data.name,
        code: data.code,
        start_date: data.startDate,
        end_date: data.endDate,
        registration_start: data.registrationStart,
        registration_end: data.registrationEnd,
        exam_start: data.examStart,
        exam_end: data.examEnd,
        result_date: data.resultDate,
        status: data.status || 'upcoming',
        total_weeks: parseInt(data.totalWeeks) || null,
        holiday_days: parseInt(data.holidays) || null,
        fee_amount: parseFloat(data.feeAmount) || null,
        description: data.description,
        is_active: data.isActive !== false
      }

      // Create term in database
      const newTerm = await termsService.create(termData)
      
      // Transform for UI
      const uiTerm: Term = {
        id: newTerm.id,
        name: newTerm.name,
        code: newTerm.code || '',
        academicYear: '2024-2025',
        startDate: newTerm.start_date,
        endDate: newTerm.end_date,
        status: newTerm.status || 'upcoming',
        description: newTerm.description || '',
        totalWeeks: newTerm.total_weeks?.toString() || '',
        feeAmount: newTerm.fee_amount?.toString() || '',
        ...newTerm
      }
      
      setTerms(prev => [uiTerm, ...prev])
    } catch (error) {
      console.error('Error adding term:', error)
      throw error // Re-throw to show error toast
    }
  }

  const handleEditTerm = async (data: any) => {
    try {
      // Prepare term data for database
      const termData = {
        name: data.name,
        code: data.code,
        start_date: data.startDate,
        end_date: data.endDate,
        registration_start: data.registrationStart,
        registration_end: data.registrationEnd,
        exam_start: data.examStart,
        exam_end: data.examEnd,
        result_date: data.resultDate,
        status: data.status || 'upcoming',
        total_weeks: parseInt(data.totalWeeks) || null,
        holiday_days: parseInt(data.holidays) || null,
        fee_amount: parseFloat(data.feeAmount) || null,
        description: data.description,
        is_active: data.isActive !== false
      }

      // Update term in database
      const updatedTerm = await termsService.update(data.id, termData)
      
      // Transform for UI
      const uiTerm: Term = {
        id: updatedTerm.id,
        name: updatedTerm.name,
        code: updatedTerm.code || '',
        academicYear: '2024-2025',
        startDate: updatedTerm.start_date,
        endDate: updatedTerm.end_date,
        status: updatedTerm.status || 'upcoming',
        description: updatedTerm.description || '',
        totalWeeks: updatedTerm.total_weeks?.toString() || '',
        feeAmount: updatedTerm.fee_amount?.toString() || '',
        ...updatedTerm
      }
      
      setTerms(prev => prev.map(term => 
        term.id === data.id ? uiTerm : term
      ))
      setEditingTerm(null)
    } catch (error) {
      console.error('Error updating term:', error)
      throw error // Re-throw to show error toast
    }
  }

  const handleDeleteTerm = async (termId: string) => {
    if (confirm('Are you sure you want to delete this term?')) {
      try {
        await termsService.delete(termId)
        setTerms(prev => prev.filter(t => t.id !== termId))
      } catch (error) {
        console.error('Error deleting term:', error)
        alert('Failed to delete term. Please try again.')
      }
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('All Status')
    setYearFilter('All Years')
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Academic Year', 'Start Date', 'End Date', 'Status', 'Total Weeks', 'Fee Amount'],
      ...filteredTerms.map(term => [
        term.name,
        term.academicYear,
        term.startDate,
        term.endDate,
        term.status,
        term.totalWeeks || '',
        term.feeAmount || ''
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'terms.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  return (
    <>
      <DashboardLayout 
        title="Terms Management" 
        subtitle="Manage academic terms and sessions"
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
            <button 
              onClick={() => setIsAddTermOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Term</span>
            </button>
          </div>

          {/* Terms Directory */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Terms ({filteredTerms.length})</h2>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms..."
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
                  <option>Upcoming</option>
                  <option>Completed</option>
                  <option>Suspended</option>
                </select>
                <select 
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option>All Years</option>
                  <option>2024-2025</option>
                  <option>2025-2026</option>
                  <option>2023-2024</option>
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

            {/* Terms Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Academic Session</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Start Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">End Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Fee Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTerms.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                        No terms found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredTerms.map((term) => (
                      <tr key={term.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{term.name}</p>
                            {term.code && (
                              <p className="text-sm text-gray-500">Code: {term.code}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{term.academicYear}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{formatDate(term.startDate)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{formatDate(term.endDate)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {term.totalWeeks ? `${term.totalWeeks} weeks` : 'Not set'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {term.feeAmount ? `UGX ${parseInt(term.feeAmount).toLocaleString()}` : 'Not set'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(term.status)}`}>
                            {term.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingTerm(term)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTerm(term.id)}
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

      {/* Add/Edit Term Modal */}
      <TermForm
        isOpen={isAddTermOpen || !!editingTerm}
        onClose={() => {
          setIsAddTermOpen(false)
          setEditingTerm(null)
        }}
        onSubmit={editingTerm ? handleEditTerm : handleAddTerm}
        editData={editingTerm}
      />
    </>
  )
}