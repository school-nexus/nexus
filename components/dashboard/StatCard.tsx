import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  bgColor: string
  textColor?: string
}

export function StatCard({ title, value, icon, bgColor, textColor = 'text-white' }: StatCardProps) {
  return (
    <div className={`stat-card ${bgColor} ${textColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold mt-2">
            {value}
          </p>
        </div>
        <div className="text-white/30 transform scale-150">
          {icon}
        </div>
      </div>
      
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="80" cy="20" r="20" />
          <circle cx="50" cy="50" r="15" />
          <circle cx="90" cy="70" r="10" />
        </svg>
      </div>
    </div>
  )
}