import { Plus, Shirt } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface ActionDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ActionDrawer({ isOpen, onClose }: ActionDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-64 animate-in slide-in-from-bottom-2 duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-2 space-y-1">
            {/* New Item Option */}
            <Link
              to="/items/new"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Shirt className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
