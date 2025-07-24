'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { GenderChart, FeeCollectionChart } from '@/components/dashboard/Charts'
import { StudentRegistrationForm } from '@/components/forms/StudentRegistrationForm'
import { ExamScheduleForm } from '@/components/forms/ExamScheduleForm'
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  BookOpen,
  Calendar,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react'

interface DashboardClientProps {
  userRole: string
  userName: string
  userEmail: string
  stats: {
    totalStudents: number
    totalTeachers: number
    feesCollected: number
    totalSubjects: number
  }
}

export function DashboardClient({ userRole, userName, userEmail, stats }: DashboardClientProps) {
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false)
  const [isExamFormOpen, setIsExamFormOpen] = useState(false)
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'student',
      title: 'New student registered',
      description: 'Nash Files joined P.7 A',
      time: '2 hours ago',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Fee payment received',
      description: 'Nuwabaga Paul paid tuition fees',
      time: '4 hours ago',
      icon: DollarSign,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'exam',
      title: 'Exam scheduled',
      description: 'English exam scheduled for P.7 A',
      time: '1 day ago',
      icon: Calendar,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ])

  const handleStudentRegistration = async (data: any) => {
    console.log('New student data:', data)
    // Here you would typically save to Supabase
    // For demo, we'll add to recent activities
    const newActivity = {
      id: recentActivities.length + 1,
      type: 'student',
      title: 'New student registered',
      description: `${data.firstName} ${data.lastName} joined ${data.class} ${data.section}`,
      time: 'Just now',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
    setRecentActivities([newActivity, ...recentActivities])
  }

  const handleExamSchedule = async (data: any) => {
    console.log('New exam data:', data)
    // Here you would typically save to Supabase
    const newActivity = {
      id: recentActivities.length + 1,
      type: 'exam',
      title: 'Exam scheduled',
      description: `${data.examName} scheduled for ${data.class}`,
      time: 'Just now',
      icon: Calendar,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
    setRecentActivities([newActivity, ...recentActivities])
  }

  return (
    <>
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
            <button 
              onClick={() => setIsExamFormOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Exam</span>
            </button>
            <button 
              onClick={() => setIsStudentFormOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
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
              textColor="text-white"
            />
            <StatCard
              title="Total Teachers"
              value={stats.totalTeachers}
              icon={<GraduationCap className="h-8 w-8" />}
              bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
              textColor="text-white"
            />
            <StatCard
              title="Fees Collections"
              value={`$${stats.feesCollected.toLocaleString()}`}
              icon={<DollarSign className="h-8 w-8" />}
              bgColor="bg-gradient-to-br from-green-500 to-green-600"
              textColor="text-white"
            />
            <StatCard
              title="Total Subjects"
              value={stats.totalSubjects}
              icon={<BookOpen className="h-8 w-8" />}
              bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
              textColor="text-white"
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">5 Students</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">+20% from last month</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-purple-500" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Collection</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">+5% from last month</span>
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                  <p className="text-2xl font-bold text-gray-900">UGX 200K</p>
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-600 ml-1">3 students pending</span>
                  </div>
                </div>
                <AlertCircle className="h-12 w-12 text-orange-500" />
              </div>
            </div>
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
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`h-5 w-5 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">English Exam - P.7 A</p>
                    <p className="text-sm text-blue-700">08/06/2025 - 100 marks</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Scheduled</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Fee Payment Deadline</p>
                    <p className="text-sm text-yellow-700">Term 2 fees due - 2 students pending</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Due Soon</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <StudentRegistrationForm
        isOpen={isStudentFormOpen}
        onClose={() => setIsStudentFormOpen(false)}
        onSubmit={handleStudentRegistration}
      />

      <ExamScheduleForm
        isOpen={isExamFormOpen}
        onClose={() => setIsExamFormOpen(false)}
        onSubmit={handleExamSchedule}
      />
    </>
  )
}