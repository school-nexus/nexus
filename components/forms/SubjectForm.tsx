'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast'
import { BookOpen, Clock, Users } from 'lucide-react'

interface SubjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

export function SubjectForm({ isOpen, onClose, onSubmit, editData }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    code: editData?.code || '',
    name: editData?.name || '',
    description: editData?.description || '',
    credits: editData?.credits || '',
    category: editData?.category || '',
    prerequisites: editData?.prerequisites || '',
    objectives: editData?.objectives || '',
    syllabus: editData?.syllabus || '',
    passingMarks: editData?.passingMarks || '',
    totalMarks: editData?.totalMarks || '',
    duration: editData?.duration || '',
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
      const subjectId = editData?.id || `SUB-${String(Date.now()).slice(-6)}`
      const submissionData = {
        ...formData,
        id: subjectId,
        status: formData.isActive ? 'Active' : 'Inactive',
        lastModified: new Date().toISOString().split('T')[0]
      }
      
      await onSubmit(submissionData)
      showSuccessToast(`Subject ${submissionData.name} ${editData ? 'updated' : 'created'} successfully!`)
      onClose()
      
      // Reset form if not editing
      if (!editData) {
        setFormData({
          code: '',
          name: '',
          description: '',
          credits: '',
          category: '',
          prerequisites: '',
          objectives: '',
          syllabus: '',
          passingMarks: '',
          totalMarks: '',
          duration: '',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showErrorToast(`Failed to ${editData ? 'update' : 'create'} subject. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? 'Edit Subject' : 'Add New Subject'} 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., ENG, MATH"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., English Language"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              <option value="Core">Core Subject</option>
              <option value="Optional">Optional Subject</option>
              <option value="Extra-curricular">Extra-curricular</option>
              <option value="Practical">Practical Subject</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 3"
              min="0"
              max="10"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Brief description of the subject..."
            />
          </div>
        </div>

        {/* Assessment Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Assessment Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
            <input
              type="number"
              name="passingMarks"
              value={formData.passingMarks}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 3"
            />
          </div>
        </div>

        {/* Curriculum Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Curriculum Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Objectives</label>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="List the main learning objectives for this subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus/Topics</label>
            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="List main topics and chapters to be covered..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
            <input
              type="text"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., Basic Mathematics, Primary English"
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
            Active Subject (Available for assignment)
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
            {loading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Subject' : 'Create Subject')}
          </button>
        </div>
      </form>
    </Modal>
  )
}