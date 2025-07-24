'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

let toastCounter = 0
const toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = `toast-${++toastCounter}`
  const newToast = { ...toast, id }
  toasts = [...toasts, newToast]
  
  toastListeners.forEach(listener => listener(toasts))
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
  
  return id
}

const removeToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id)
  toastListeners.forEach(listener => listener(toasts))
}

export const showSuccessToast = (message: string) => {
  return addToast({ type: 'success', message })
}

export const showErrorToast = (message: string) => {
  return addToast({ type: 'error', message })
}

export const showInfoToast = (message: string) => {
  return addToast({ type: 'info', message })
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])
  
  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts)
    }
    
    toastListeners.push(listener)
    
    return () => {
      const index = toastListeners.indexOf(listener)
      if (index > -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [])
  
  if (currentToasts.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }
  
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }
  
  return (
    <div className={`flex items-center p-4 border rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right-full ${getToastStyles()}`}>
      <div className="flex items-center space-x-3 flex-1">
        {getIcon()}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}