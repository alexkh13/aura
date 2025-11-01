import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Home, Shirt, Plus, Lightbulb, Calendar } from 'lucide-react'
import { ActionDrawer } from './ActionDrawer'

export default function BottomNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <ActionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-md mx-auto px-3">
          <div className="flex items-center justify-around py-1">
            <Link
              to="/wardrobe"
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              activeProps={{
                className:
                  'flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400',
              }}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Wardrobe</span>
            </Link>

            <Link
              to="/outfits"
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              activeProps={{
                className:
                  'flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400',
              }}
            >
              <Shirt className="w-5 h-5" />
              <span className="text-[10px] font-medium">Outfits</span>
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex flex-col items-center gap-0.5 -mt-3 -translate-y-[2vh]"
            >
              <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors active:scale-95">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </button>

            <Link
              to="/discover"
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              activeProps={{
                className:
                  'flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400',
              }}
            >
              <Lightbulb className="w-5 h-5" />
              <span className="text-[10px] font-medium">Discover</span>
            </Link>

            <Link
              to="/calendar"
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              activeProps={{
                className:
                  'flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400',
              }}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-medium">Calendar</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
