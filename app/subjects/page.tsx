import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BookOpen, Plus, Edit, Trash2, Download, RefreshCw } from 'lucide-react'

export default async function SubjectsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  const subjects = [
    { code: 'ENG', name: 'ENGLISH', description: 'English Language', credits: 1 }
  ]

  return (
    <DashboardLayout 
      title="Subjects Management" 
      subtitle="Manage academic subjects and assignments"
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="btn-primary flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button className="btn-secondary">Custom Export</button>
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-md shadow-sm flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>All Subjects</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md">
            Assign Subjects
          </button>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Subjects List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Credits</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.code} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{subject.code}</td>
                    <td className="py-4 px-4">{subject.name}</td>
                    <td className="py-4 px-4">{subject.description}</td>
                    <td className="py-4 px-4">{subject.credits}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
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