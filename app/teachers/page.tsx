import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  X,
  GraduationCap
} from 'lucide-react'

export default async function TeachersPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock teacher data
  const teachers = [
    {
      id: 'TCH-001',
      name: 'Nuwabaga Nelson',
      email: 'nelsonnuwagaba160@gmail.com',
      phone: '0708174855',
      subject: 'Not Assigned',
      status: 'Active'
    }
  ]

  return (
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
            <button className="btn-primary flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
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
          <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-md shadow-sm flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>All Teachers</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Teacher</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </button>
        </div>

        {/* Teachers Directory */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Teachers Directory</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                1 teachers
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                <option>All Subjects</option>
                <option>English</option>
                <option>Mathematics</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900">
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">N</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-sm text-gray-500">ID: {teacher.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{teacher.email}</p>
                        <p className="text-sm text-gray-500">{teacher.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
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