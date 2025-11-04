import { Plus, Shirt, Sparkles } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'

interface ActionDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ActionDrawer({ isOpen, onClose }: ActionDrawerProps) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isProcessingRef = useRef(false)

  const handleAIAnalyzeClick = () => {
    // Trigger file upload immediately
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    console.log('📁 Files selected:', files?.length || 0)

    if (files && files.length > 0) {
      isProcessingRef.current = true

      // Store selected files in sessionStorage to pass to the next page
      const filePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(filePromises).then(dataUrls => {
        console.log('💾 Storing images in sessionStorage:', dataUrls.length)
        sessionStorage.setItem('aiAnalyzeImages', JSON.stringify(dataUrls))
        console.log('✅ Stored successfully, closing drawer and navigating')

        // Close drawer first
        onClose()

        // Try using window.location as a fallback
        console.log('🚀 Attempting navigation...')
        try {
          navigate({ to: '/items/ai-analyze' })
          console.log('✅ Navigate called successfully')
        } catch (err) {
          console.error('❌ Navigate failed:', err)
          // Fallback to window.location
          console.log('🔄 Trying window.location fallback...')
          window.location.href = '/items/ai-analyze'
        }
      }).catch(error => {
        console.error('❌ Error reading files:', error)
        isProcessingRef.current = false
      })
    }
  }

  const handleBackdropClick = () => {
    // Don't close if we're processing files
    if (!isProcessingRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Hidden file input for AI analyze */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Drawer */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-64 animate-in slide-in-from-bottom-2 duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-2 space-y-1">
            {/* AI Analyze Option */}
            <button
              onClick={handleAIAnalyzeClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 dark:text-white">AI Analyze</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scan wardrobe photos</p>
              </div>
            </button>

            {/* New Item Option */}
            <Link
              to="/items/new"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Shirt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">New Item</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add to wardrobe</p>
              </div>
            </Link>

            {/* New Outfit Option */}
            <Link
              to="/outfits/new"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">New Outfit</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create combination</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
