'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { DollarSign, User, Calendar } from 'lucide-react'

interface FeeRecordFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function FeeRecordForm({ isOpen, onClose, onSubmit }: FeeRecordFormProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    feeType: '',
    totalAmount: '',
    paidAmount: '',
    paymentMethod: '',
    dueDate: '',
    paymentDate: '',
    description: '',
    discountAmount: '',
    lateFeePenalty: ''
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateBalance = () => {
    const total = parseFloat(formData.totalAmount) || 0
    const paid = parseFloat(formData.paidAmount) || 0
    const discount = parseFloat(formData.discountAmount) || 0
    const lateFee = parseFloat(formData.lateFeePenalty) || 0
    return (total + lateFee - discount - paid).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const feeId = `FEE-${String(Date.now()).slice(-6)}`
      const balance = calculateBalance()
      const status = parseFloat(balance) <= 0 ? 'paid' : parseFloat(formData.paidAmount) > 0 ? 'partial' : 'pending'
      
      const submissionData = {
        ...formData,
        id: feeId,
        balance,
        status,
        createdDate: new Date().toISOString().split('T')[0]
      }
      
      await onSubmit(submissionData)
      onClose()
      setFormData({
        studentId: '',
        studentName: '',
        class: '',
        feeType: '',
        totalAmount: '',
        paidAmount: '',
        paymentMethod: '',
        dueDate: '',
        paymentDate: '',
        description: '',
        discountAmount: '',
        lateFeePenalty: ''
      })
    } catch (error) {
      console.error('Error creating fee record:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Fee Record" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Student Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., STU-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter student name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            >
              <option value="">Select Class</option>
              <option value="P.1 A">P.1 A</option>
              <option value="P.2 A">P.2 A</option>
              <option value="P.3 A">P.3 A</option>
              <option value="P.4 A">P.4 A</option>
              <option value="P.5 A">P.5 A</option>
              <option value="P.6 A">P.6 A</option>
              <option value="P.7 A">P.7 A</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            >
              <option value="">Select Fee Type</option>
              <option value="Tuition">Tuition</option>
              <option value="Library">Library</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Sports">Sports</option>
              <option value="Transport">Transport</option>
              <option value="Exam">Exam</option>
              <option value="Admission">Admission</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
        </div>

        {/* Fee Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">Fee Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (UGX) *</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 500000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (UGX)</label>
            <input
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 300000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (UGX)</label>
            <input
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Penalty (UGX)</label>
            <input
              type="number"
              name="lateFeePenalty"
              value={formData.lateFeePenalty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., 0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>
        </div>

        {/* Balance Calculation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Fee Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <span className="float-right font-medium">UGX {formData.totalAmount || '0'}</span>
            </div>
            <div>
              <span className="text-gray-600">Paid Amount:</span>
              <span className="float-right font-medium text-green-600">UGX {formData.paidAmount || '0'}</span>
            </div>
            <div>
              <span className="text-gray-600">Discount:</span>
              <span className="float-right font-medium">UGX {formData.discountAmount || '0'}</span>
            </div>
            <div>
              <span className="text-gray-600">Late Fee:</span>
              <span className="float-right font-medium">UGX {formData.lateFeePenalty || '0'}</span>
            </div>
            <div className="col-span-2 border-t pt-2">
              <span className="text-gray-900 font-medium">Balance:</span>
              <span className="float-right font-bold text-red-600">UGX {calculateBalance()}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description/Notes</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Additional notes about this fee record..."
          />
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
            {loading ? 'Creating...' : 'Create Fee Record'}
          </button>
        </div>
      </form>
    </Modal>
  )
}