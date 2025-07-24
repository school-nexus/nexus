'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  FileText,
  DollarSign,
  Settings,
  School,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Teachers', href: '/teachers', icon: GraduationCap },
  { name: 'Classes', href: '/classes', icon: School },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Terms', href: '/terms', icon: Calendar },
  { name: 'Exams', href: '/exams', icon: FileText },
  { name: 'Fees Collection', href: '/fees', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole = 'admin' }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (userRole === 'student') {
      return ['Dashboard', 'Subjects', 'Exams'].includes(item.name)
    }
    if (userRole === 'teacher') {
      return ['Dashboard', 'Students', 'Classes', 'Subjects', 'Exams'].includes(item.name)
    }
    if (userRole === 'accountant') {
      return ['Dashboard', 'Students', 'Fees Collection'].includes(item.name)
    }
    return true // Admin sees all
  })

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-purple-600 text-white p-2 rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-600 to-purple-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-purple-500">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <School className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">SchoolNexus</h1>
                <p className="text-xs text-purple-200">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-purple-500">
            <div className="text-white mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {userRole === 'admin' && '👨‍💼'}
                    {userRole === 'teacher' && '👨‍🏫'}
                    {userRole === 'accountant' && '👨‍💻'}
                    {userRole === 'student' && '👨‍🎓'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{userRole}</p>
                  <p className="text-xs text-purple-200">Online</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}