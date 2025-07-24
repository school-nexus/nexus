'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast'
import { School, Users, GraduationCap, MapPin } from 'lucide-react'

interface ClassFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

export function ClassForm({ isOpen, onClose, onSubmit, editData }: ClassFormProps) {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    section: editData?.section || '',
    grade: editData?.grade || '',
    academicYear: editData?.academicYear || '',
    classTeacher: editData?.classTeacher || '',
    room: editData?.room || '',
    capacity: editData?.capacity || '',
    currentStudents: editData?.currentStudents || '0',
    subjects: editData?.subjects || [],
    schedule: editData?.schedule || '',
    description: editData?.description || '',
    isActive: editData?.isActive ?? true
  })

  const [loading, setLoading] = useState(false)

  const availableSubjects = [
    'English', 'Mathematics', 'Science', 'Social Studies', 
    'Religious Education', 'Physical Education', 'Art', 'Music'
  ]

  const availableTeachers = [
    'Nuwabaga Nelson', 'Sarah Johnson', 'Michael Brown', 'Emily Davis'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s: string) => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const classId = editData?.id || `CLS-${String(Date.now()).slice(-6)}`
      const submissionData = {
        ...formData,
        id: classId,
        status: formData.isActive ? 'Active' : 'Inactive',
        lastModified: new Date().toISOString().split('T')[0]
      }
      
      await onSubmit(submissionData)
      showSuccessToast(`Class ${submissionData.name} ${editData ? 'updated' : 'created'} successfully!`)
      onClose()
      
      // Reset form if not editing
      if (!editData) {
        setFormData({
          name: '',
          section: '',
          grade: '',
          academicYear: '',
          classTeacher: '',
          room: '',
          capacity: '',
          currentStudents: '0',
          subjects: [],
          schedule: '',
          description: '',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showErrorToast(`Failed to ${editData ? 'update' : 'create'} class. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? 'Edit Class' : 'Add New Class'} 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., P.7"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            >
              <option value="">Select Grade</option>
              <option value="P.1">P.1</option>
              <option value="P.2">P.2</option>
              <option value="P.3">P.3</option>
              <option value="P.4">P.4</option>
              <option value="P.5">P.5</option>
              <option value="P.6">P.6</option>
              <option value="P.7">P.7</option>
            </select>
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

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Brief description of the class..."
            />
          </div>
        </div>

        {/* Teacher and Room Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Teacher & Room Assignment</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
            <select
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="">Select Teacher</option>
              {availableTeachers.map((teacher) => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classroom/Room</label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., Room 101, Main Hall"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 40"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Students</label>
            <input
              type="number"
              name="currentStudents"
              value={formData.currentStudents}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="0"
              min="0"
              max={formData.capacity || 100}
            />
          </div>
        </div>

        {/* Subject Assignment */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Subject Assignment</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableSubjects.map((subject) => (
              <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Schedule Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Schedule</label>
            <textarea
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., Monday-Friday 8:00 AM - 3:00 PM"
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
            Active Class (Available for enrollment)
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
            {loading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Class' : 'Create Class')}
          </button>
        </div>
      </form>
    </Modal>
  )
}