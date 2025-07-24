'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  userRole?: string
  userName?: string
  userEmail?: string
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  userRole = 'admin',
  userName,
  userEmail 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <div className="lg:pl-64">
        <Header 
          title={title}
          subtitle={subtitle}
          userName={userName}
          userEmail={userEmail}
        />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}