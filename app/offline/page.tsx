import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <WifiOff className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            It looks like you've lost your internet connection. Don't worry, School Nexus works offline too!
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-medium text-blue-900 mb-2">Offline Features Available:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• View cached student data</li>
              <li>• Access previously loaded pages</li>
              <li>• View dashboard statistics</li>
              <li>• Sync when connection returns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}