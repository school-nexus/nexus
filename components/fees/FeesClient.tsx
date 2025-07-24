'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FeeRecordForm } from '@/components/forms/FeeRecordForm'
import { 
  Plus,
  Search,
  Eye,
  Edit,
  DollarSign,
  Download,
  AlertCircle,
  CheckCircle,
  FileText,
  BarChart3,
  Receipt
} from 'lucide-react'

interface FeeRecord {
  id: string
  student: string
  class: string
  feeType: string
  totalAmount: string
  paidAmount: string
  balance: string
  dueDate: string
  status: string
}

interface FeesClientProps {
  userRole: string
  userName: string
  userEmail: string
  initialFeeRecords: FeeRecord[]
}

export function FeesClient({ userRole, userName, userEmail, initialFeeRecords }: FeesClientProps) {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(initialFeeRecords)
  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('collect')
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalFees = feeRecords.reduce((sum, record) => {
      return sum + parseFloat(record.totalAmount.replace(/[^\d]/g, ''))
    }, 0)
    
    const collected = feeRecords.reduce((sum, record) => {
      return sum + parseFloat(record.paidAmount.replace(/[^\d]/g, ''))
    }, 0)
    
    const pending = totalFees - collected

    return {
      totalFees: totalFees.toLocaleString(),
      collected: collected.toLocaleString(),
      pending: pending.toLocaleString()
    }
  }, [feeRecords])

  // Filter records based on search
  const filteredRecords = useMemo(() => {
    return feeRecords.filter(record =>
      record.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.feeType.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [feeRecords, searchQuery])

  const handleAddFeeRecord = async (data: any) => {
    const newRecord: FeeRecord = {
      id: data.id,
      student: data.studentName,
      class: data.class,
      feeType: data.feeType,
      totalAmount: `UGX ${parseFloat(data.totalAmount).toLocaleString()}`,
      paidAmount: `UGX ${parseFloat(data.paidAmount || '0').toLocaleString()}`,
      balance: `UGX ${parseFloat(data.balance).toLocaleString()}`,
      dueDate: data.dueDate,
      status: data.status
    }
    
    setFeeRecords(prev => [newRecord, ...prev])
    console.log('New fee record added:', newRecord)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Student', 'Class', 'Fee Type', 'Total Amount', 'Paid Amount', 'Balance', 'Due Date', 'Status'],
      ...filteredRecords.map(record => [
        record.student,
        record.class,
        record.feeType,
        record.totalAmount,
        record.paidAmount,
        record.balance,
        record.dueDate,
        record.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fee-records.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <DashboardLayout 
        title="Fees Management" 
        subtitle="Manage fee collections and payment tracking"
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
      >
        <div className="space-y-6">
          {/* Fee Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-r from-gray-500 to-gray-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Total Fees</p>
                  <p className="text-3xl font-bold">{stats.totalFees}</p>
                </div>
                <DollarSign className="h-12 w-12 opacity-30" />
              </div>
            </div>
            
            <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Collected</p>
                  <p className="text-3xl font-bold">{stats.collected}</p>
                </div>
                <CheckCircle className="h-12 w-12 opacity-30" />
              </div>
            </div>
            
            <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <AlertCircle className="h-12 w-12 opacity-30" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('collect')}
              className={`px-4 py-2 font-medium rounded-md flex items-center space-x-2 transition-colors ${
                activeTab === 'collect' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Collect Fees</span>
            </button>
            <button 
              onClick={() => setActiveTab('due')}
              className={`px-4 py-2 font-medium rounded-md flex items-center space-x-2 transition-colors ${
                activeTab === 'due' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              <span>Due Fees</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Payment History</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Receipts</span>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Fee Types</span>
            </button>
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div></div>
            <div className="flex space-x-2">
              <button 
                onClick={exportToCSV}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Collect Fees Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {activeTab === 'collect' ? 'Collect Fees' : 'Due Fees'}
              </h2>
              <button 
                onClick={() => setIsAddFeeOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Fee Record</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Fees Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Class</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Fee Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Paid Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 px-4 text-center text-gray-500">
                        No fee records found
                      </td>
                    </tr>
                  ) : (
                    filteredRecords
                      .filter(record => activeTab === 'collect' || record.status !== 'paid')
                      .map((record) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">{record.student}</td>
                          <td className="py-4 px-4">{record.class}</td>
                          <td className="py-4 px-4">{record.feeType}</td>
                          <td className="py-4 px-4">{record.totalAmount}</td>
                          <td className="py-4 px-4 text-green-600">{record.paidAmount}</td>
                          <td className="py-4 px-4 text-red-600">{record.balance}</td>
                          <td className="py-4 px-4">{record.dueDate}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : record.status === 'partial'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              {record.status !== 'paid' && (
                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                              )}
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

      {/* Add Fee Record Modal */}
      <FeeRecordForm
        isOpen={isAddFeeOpen}
        onClose={() => setIsAddFeeOpen(false)}
        onSubmit={handleAddFeeRecord}
      />
    </>
  )
}