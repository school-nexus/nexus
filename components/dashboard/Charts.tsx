'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

const genderData = [
  { name: 'Boys', value: 50, color: '#3b82f6' },
  { name: 'Girls', value: 50, color: '#ec4899' },
]

const feeCollectionData = [
  { name: 'P.7', collected: 1500, total: 1500 },
  { name: 'P.6', collected: 1400, total: 1500 },
]

const COLORS = ['#3b82f6', '#ec4899']

export function GenderChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Students by Gender</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value}: {entry.payload.value}%
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function FeeCollectionChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Fee Collections by Class</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={feeCollectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="collected" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}