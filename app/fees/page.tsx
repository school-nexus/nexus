import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
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

export default async function FeesPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock fees data
  const feeRecords = [
    {
      student: 'Nash Files',
      class: 'P.7 A',
      feeType: 'Tuition',
      totalAmount: 'UGX 500,000',
      paidAmount: 'UGX 500,000',
      balance: 'UGX 0',
      dueDate: '01/06/2025',
      status: 'paid'
    },
    {
      student: 'Nuwabaga Paul',
      class: 'P.7 A',
      feeType: 'Tuition',
      totalAmount: 'UGX 500,000',
      paidAmount: 'UGX 300,000',
      balance: 'UGX 200,000',
      dueDate: '02/06/2025',
      status: 'partial'
    }
  ]

  return (
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
                <p className="text-3xl font-bold">1000000</p>
              </div>
              <DollarSign className="h-12 w-12 opacity-30" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Collected</p>
                <p className="text-3xl font-bold">800000</p>
              </div>
              <CheckCircle className="h-12 w-12 opacity-30" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Pending</p>
                <p className="text-3xl font-bold">200000</p>
              </div>
              <AlertCircle className="h-12 w-12 opacity-30" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-md shadow-sm flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Collect Fees</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
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

        {/* Collect Fees Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Collect Fees</h2>
            <button className="btn-primary flex items-center space-x-2">
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
                {feeRecords.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
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
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {record.status === 'partial' && (
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}