import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FileText, Plus, Edit, Trash2, Clock, CheckCircle, BarChart3 } from 'lucide-react'

export default async function ExamsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  const exams = [
    {
      name: 'ENGLISH',
      class: 'P.7 A',
      subject: 'ENGLISH',
      totalMarks: '100',
      duration: 'N/A',
      dateTime: '08/06/2025',
      status: 'scheduled'
    }
  ]

  return (
    <DashboardLayout 
      title="Exams Management" 
      subtitle="Manage exams, schedules, and student assessments"
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Exam</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Exams</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <BarChart3 className="h-8 w-8 opacity-30" />
            </div>
          </div>
          <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Scheduled</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <Clock className="h-8 w-8 opacity-30" />
            </div>
          </div>
          <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ongoing</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <FileText className="h-8 w-8 opacity-30" />
            </div>
          </div>
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Completed</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-30" />
            </div>
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-md shadow-sm">All Exams</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md">Scheduled</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md">Ongoing</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md">Completed</button>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Exams (1)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Class</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total Marks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{exam.name}</td>
                    <td className="py-4 px-4">{exam.class}</td>
                    <td className="py-4 px-4">{exam.subject}</td>
                    <td className="py-4 px-4">{exam.totalMarks}</td>
                    <td className="py-4 px-4">{exam.duration}</td>
                    <td className="py-4 px-4">{exam.dateTime}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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