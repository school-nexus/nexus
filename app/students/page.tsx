import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Star,
  Trash2,
  Download,
  RefreshCw,
  X,
  Users
} from 'lucide-react'

export default async function StudentsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock student data based on the images
  const students = [
    {
      id: 'STU-001',
      name: 'Nash Files',
      email: 'creamland179@gmail.com',
      phone: '0758601100',
      class: 'P.7 - A',
      status: 'Active',
      photo: '/placeholder-avatar.png'
    },
    {
      id: 'STU-002',
      name: 'Nuwabaga Paul',
      email: 'nelsonnuwagaba160@gmail.com',
      phone: '0708174855',
      class: 'P.7 - A',
      status: 'Active',
      photo: '/placeholder-avatar.png'
    }
  ]

  return (
    <DashboardLayout 
      title="Students Management" 
      subtitle="Manage student registrations and information"
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
            <Users className="h-4 w-4" />
            <span>All Students</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Promotion</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Trash2 className="h-4 w-4" />
            <span>Archived</span>
          </button>
        </div>

        {/* Students Directory */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Students Directory</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                2 students
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
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
                <option>All Classes</option>
                <option>P.7 - A</option>
                <option>P.6 - A</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900">
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Photo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Contact Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Class</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">ID: {student.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{student.email}</p>
                        <p className="text-sm text-gray-500">{student.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {student.status}
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
                        <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                          <Star className="h-4 w-4" />
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