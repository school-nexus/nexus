import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { GenderChart, FeeCollectionChart } from '@/components/dashboard/Charts'
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  BookOpen,
  Calendar,
  Plus
} from 'lucide-react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get user session and role
  const { data: { session } } = await supabase.auth.getSession()
  const userRole = session?.user?.user_metadata?.role || 'admin'
  const userName = session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || ''

  // Mock data - in a real app, this would come from Supabase
  const stats = {
    totalStudents: 2,
    totalTeachers: 1,
    feesCollected: 3000,
    totalSubjects: 1,
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Overview of your school management system"
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Exam</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register New Student</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<Users className="h-8 w-8" />}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={<GraduationCap className="h-8 w-8" />}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Fees Collections"
            value={`$${stats.feesCollected.toLocaleString()}`}
            icon={<DollarSign className="h-8 w-8" />}
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Total Subjects"
            value={stats.totalSubjects}
            icon={<BookOpen className="h-8 w-8" />}
            bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenderChart />
          <FeeCollectionChart />
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New student registered</p>
                <p className="text-sm text-gray-600">Nash Files joined P.7 A</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Fee payment received</p>
                <p className="text-sm text-gray-600">Nuwabaga Paul paid tuition fees</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Exam scheduled</p>
                <p className="text-sm text-gray-600">English exam scheduled for P.7 A</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}