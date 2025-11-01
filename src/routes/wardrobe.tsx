import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Plus, ChevronLeft } from 'lucide-react'
import { useItems } from '@/hooks/useData'
import { useProfile } from '@/hooks/useProfile'

export const Route = createFileRoute('/wardrobe')({ component: WardrobePage })

function WardrobePage() {
  const navigate = useNavigate()
  const { activeProfile } = useProfile()
  const { data: items, isLoading, error } = useItems(activeProfile?.id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading items...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load items</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  const hasItems = items && items.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            My Wardrobe
          </button>
        </div>

        {/* Item Grid or Empty State */}
        <div className="px-4 py-6">
          {hasItems ? (
            <div className="grid grid-cols-4 gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to="/items/$itemId"
                  params={{ itemId: item.id }}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors overflow-hidden"
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center overflow-hidden">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-blue-400 dark:text-blue-600 font-medium text-center px-1">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                      {item.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-sm">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  Your Wardrobe is Empty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start building your digital closet by adding your first clothing item.
                </p>
                <Link
                  to="/items/new"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Item
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
