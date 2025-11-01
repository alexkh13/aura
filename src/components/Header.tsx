import { Link } from '@tanstack/react-router'
import { Bell, User, Settings, ChevronDown } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

export default function Header() {
  const { activeProfile } = useProfile()

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-blue-500 dark:text-blue-400">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  {/* Shark fin shaped hanger with cutout */}
                  <path d="M12 2c-1.5 0-2 1-2 2v1c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V4c0-1-0.5-2-2-2z" />
                  <path d="M12 6L5 20c-0.5 1 0 2 1 2h12c1 0 1.5-1 1-2L12 6z M12 14l-3 5h6l-3-5z" fillRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Aura<span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">Wardrobe</span>
              </span>
            </Link>

            {/* Active Profile Indicator */}
            {activeProfile && (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {activeProfile.avatar && (
                  <span className="text-sm">{activeProfile.avatar}</span>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeProfile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <Link
              to="/profile"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <Link
              to="/settings"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
