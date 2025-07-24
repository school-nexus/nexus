'use client'

import { useEffect, useState } from 'react'

export function PWALifecycle() {
  const [isOffline, setIsOffline] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }

    // Handle offline/online status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial offline status
    setIsOffline(!navigator.onLine)

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
    }
  }

  return (
    <>
      {isOffline && (
        <div className="offline-indicator">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm">You're offline</span>
          </div>
        </div>
      )}
      
      {deferredPrompt && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <div>
              <p className="font-medium">Install School Nexus</p>
              <p className="text-sm text-purple-100">Get the full app experience</p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium hover:bg-purple-50 transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      )}
    </>
  )
}