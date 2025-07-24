'use client'

import { Modal } from '@/components/ui/Modal'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  GraduationCap,
  BookOpen,
  DollarSign,
  Badge,
  Clock
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  phone: string
  class: string
  status: string
  photo?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  parentName?: string
  parentPhone?: string
  parentEmail?: string
  rollNumber?: string
  admissionDate?: string
  bloodGroup?: string
}

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

export function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  if (!student) return null

  const mockAcademicData = {
    subjects: ['English', 'Mathematics', 'Science', 'Social Studies'],
    attendance: '92%',
    totalFees: 'UGX 500,000',
    paidFees: 'UGX 300,000',
    pendingFees: 'UGX 200,000',
    lastPayment: '2024-01-15',
    examResults: [
      { subject: 'English', marks: '85/100', grade: 'A' },
      { subject: 'Mathematics', marks: '78/100', grade: 'B+' },
      { subject: 'Science', marks: '92/100', grade: 'A+' },
      { subject: 'Social Studies', marks: '80/100', grade: 'A-' }
    ]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details" size="xl">
      <div className="space-y-6">
        {/* Header with Photo and Basic Info */}
        <div className="flex items-start space-x-6 pb-6 border-b">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-2xl">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-lg text-gray-600">Student ID: {student.id}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                student.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <Badge className="w-3 h-3 mr-1" />
                {student.status}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <GraduationCap className="w-3 h-3 mr-1" />
                {student.class}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{student.email || 'Not provided'}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium">{student.phone || 'Not provided'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Date of Birth:</span>
                <span className="text-sm font-medium">{student.dateOfBirth || 'Not provided'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Gender:</span>
                <span className="text-sm font-medium">{student.gender || 'Not provided'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Address:</span>
                <span className="text-sm font-medium">{student.address || 'Not provided'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Badge className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Blood Group:</span>
                <span className="text-sm font-medium">{student.bloodGroup || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Parent/Guardian Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Parent Name:</span>
                <span className="text-sm font-medium">{student.parentName || 'Not provided'}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Parent Phone:</span>
                <span className="text-sm font-medium">{student.parentPhone || 'Not provided'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Parent Email:</span>
                <span className="text-sm font-medium">{student.parentEmail || 'Not provided'}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mt-6">Academic Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Roll Number:</span>
                <span className="text-sm font-medium">{student.rollNumber || 'Not assigned'}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Admission Date:</span>
                <span className="text-sm font-medium">{student.admissionDate || 'Not provided'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Attendance:</span>
                <span className="text-sm font-medium text-green-600">{mockAcademicData.attendance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAcademicData.examResults.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{result.subject}</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    result.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                    result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.grade}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Marks: {result.marks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Fee Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Total Fees</span>
              </div>
              <p className="text-xl font-bold text-blue-900 mt-1">{mockAcademicData.totalFees}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Paid Fees</span>
              </div>
              <p className="text-xl font-bold text-green-900 mt-1">{mockAcademicData.paidFees}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">Pending Fees</span>
              </div>
              <p className="text-xl font-bold text-orange-900 mt-1">{mockAcademicData.pendingFees}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Last Payment: {mockAcademicData.lastPayment}
          </div>
        </div>

        {/* Subjects */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Enrolled Subjects</h3>
          
          <div className="flex flex-wrap gap-2">
            {mockAcademicData.subjects.map((subject, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="btn-primary px-6 py-2">
            Edit Student
          </button>
        </div>
      </div>
    </Modal>
  )
}