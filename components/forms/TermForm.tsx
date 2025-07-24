'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast'
import { Calendar, Clock, BookOpen } from 'lucide-react'

interface TermFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

export function TermForm({ isOpen, onClose, onSubmit, editData }: TermFormProps) {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    code: editData?.code || '',
    academicYear: editData?.academicYear || '',
    startDate: editData?.startDate || '',
    endDate: editData?.endDate || '',
    registrationStart: editData?.registrationStart || '',
    registrationEnd: editData?.registrationEnd || '',
    examStart: editData?.examStart || '',
    examEnd: editData?.examEnd || '',
    resultDate: editData?.resultDate || '',
    status: editData?.status || 'upcoming',
    description: editData?.description || '',
    totalWeeks: editData?.totalWeeks || '',
    holidays: editData?.holidays || '',
    feeAmount: editData?.feeAmount || '',
    isActive: editData?.isActive ?? true
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate dates
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('End date must be after start date')
      }

      const termId = editData?.id || `TERM-${String(Date.now()).slice(-6)}`
      const submissionData = {
        ...formData,
        id: termId,
        createdDate: editData?.createdDate || new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      }
      
      await onSubmit(submissionData)
      showSuccessToast(`Term ${submissionData.name} ${editData ? 'updated' : 'created'} successfully!`)
      onClose()
      
      // Reset form if not editing
      if (!editData) {
        setFormData({
          name: '',
          code: '',
          academicYear: '',
          startDate: '',
          endDate: '',
          registrationStart: '',
          registrationEnd: '',
          examStart: '',
          examEnd: '',
          resultDate: '',
          status: 'upcoming',
          description: '',
          totalWeeks: '',
          holidays: '',
          feeAmount: '',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showErrorToast(error instanceof Error ? error.message : `Failed to ${editData ? 'update' : 'create'} term. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? 'Edit Term' : 'Add New Term'} 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., Term 1, First Semester"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., T1-2024, SEM1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 2024-2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Brief description of the term..."
            />
          </div>
        </div>

        {/* Term Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Term Duration</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Weeks</label>
            <input
              type="number"
              name="totalWeeks"
              value={formData.totalWeeks}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 12"
              min="1"
              max="52"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Days</label>
            <input
              type="number"
              name="holidays"
              value={formData.holidays}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 5"
              min="0"
            />
          </div>
        </div>

        {/* Registration Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Registration Period</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Start</label>
            <input
              type="date"
              name="registrationStart"
              value={formData.registrationStart}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration End</label>
            <input
              type="date"
              name="registrationEnd"
              value={formData.registrationEnd}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Examination Period */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Examination Period</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Start Date</label>
            <input
              type="date"
              name="examStart"
              value={formData.examStart}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam End Date</label>
            <input
              type="date"
              name="examEnd"
              value={formData.examEnd}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Result Release Date</label>
            <input
              type="date"
              name="resultDate"
              value={formData.resultDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Financial Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term Fee Amount (UGX)</label>
            <input
              type="number"
              name="feeAmount"
              value={formData.feeAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 500000"
              min="0"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Active Term (Available for operations)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Term' : 'Create Term')}
          </button>
        </div>
      </form>
    </Modal>
  )
}