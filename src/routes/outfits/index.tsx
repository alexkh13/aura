import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Plus, Shirt } from 'lucide-react'
import { useOutfits, useItems } from '@/hooks/useData'
import { OutfitThumbnail } from '@/components/OutfitThumbnail'
import { useProfile } from '@/hooks/useProfile'

export const Route = createFileRoute('/outfits/')({ component: OutfitsPage })

function OutfitsPage() {
  const navigate = useNavigate()
  const { activeProfile } = useProfile()
  const { data: outfits, isLoading, error } = useOutfits(activeProfile?.id)
  const { data: items, isLoading: itemsLoading } = useItems(activeProfile?.id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading outfits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load outfits</p>
        </div>
      </div>
    )
  }

  const hasOutfits = outfits && outfits.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              My Outfits
            </button>
            <Link
              to="/outfits/new"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </Link>
          </div>
        </div>

        <div className="px-4 py-6">
          {hasOutfits ? (
            <div className="grid grid-cols-2 gap-4">
              {outfits.map((outfit) => (
                <Link
                  key={outfit.id}
                  to="/outfits/$outfitId"
                  params={{ outfitId: outfit.id }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <OutfitThumbnail
                    itemIds={outfit.itemIds}
                    items={items}
                    size="medium"
                    className="mb-3"
                    loading={itemsLoading}
                  />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{outfit.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{outfit.season}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-sm">
                <Shirt className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  No Outfits Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start creating outfits by combining your wardrobe items into stylish looks.
                </p>
                <Link
                  to="/outfits/new"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Outfit
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
