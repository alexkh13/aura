import { createFileRoute, Link } from '@tanstack/react-router'
import { Camera, Shirt, Grid3x3, Shuffle, Sparkles } from 'lucide-react'
import { useOutfits, useItems } from '@/hooks/useData'
import { OutfitThumbnail } from '@/components/OutfitThumbnail'
import { useProfile } from '@/hooks/useProfile'

export const Route = createFileRoute('/')({ component: DashboardPage })

function DashboardPage() {
  const { activeProfile } = useProfile()
  const { data: outfits, isLoading: outfitsLoading } = useOutfits(activeProfile?.id)
  const { data: items, isLoading: itemsLoading } = useItems(activeProfile?.id)

  const recentOutfits = outfits?.slice(0, 3) || []
  const todaySuggestion = outfits?.[0] // First outfit as today's suggestion
  const hasOutfits = outfits && outfits.length > 0
  const hasItems = items && items.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Today's Outfit Suggestion - Only show if there are outfits */}
        {hasOutfits && todaySuggestion && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-6 border border-blue-100 dark:border-blue-900">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Today's Outfit Suggestion
            </h2>
            <OutfitThumbnail
              itemIds={todaySuggestion.itemIds}
              items={items}
              size="large"
              className="mb-4"
              loading={itemsLoading}
            />
            <div className="flex gap-3">
              <Link
                to="/outfits/$outfitId"
                params={{ outfitId: todaySuggestion.id }}
                className="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-center"
              >
                View Details
              </Link>
              <Link
                to="/outfits"
                className="flex-1 py-3 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </Link>
            </div>
          </section>
        )}

        {/* Welcome Message - Only show when wardrobe is empty */}
        {!hasItems && !itemsLoading && (
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-8 mb-6 border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Welcome to Aura!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your wardrobe is empty. Start by adding your first clothing item to build your digital closet.
              </p>
              <Link
                to="/items/new"
                className="inline-flex items-center gap-2 py-3 px-6 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Add Your First Item
              </Link>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link
              to="/items/new"
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                Add New Item
              </span>
            </Link>
            <Link
              to="/outfits/new"
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Shirt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                Create New Outfit
              </span>
            </Link>
            <Link
              to="/wardrobe"
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                Wardrobe Overview
              </span>
            </Link>
          </div>
        </section>

        {/* Recent Outfits - Only show if there are outfits */}
        {hasOutfits && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Outfits</h2>
              <Link to="/outfits" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-500">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {recentOutfits.map((outfit) => (
                <Link
                  key={outfit.id}
                  to="/outfits/$outfitId"
                  params={{ outfitId: outfit.id }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <OutfitThumbnail
                    itemIds={outfit.itemIds}
                    items={items}
                    size="small"
                    className="mb-3"
                    loading={itemsLoading}
                  />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center truncate">
                    {outfit.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center truncate">
                    {outfit.season}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State for Outfits - Show when items exist but no outfits */}
        {hasItems && !hasOutfits && !outfitsLoading && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <Shirt className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                No Outfits Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                You have items in your wardrobe. Start creating outfits to mix and match your style!
              </p>
              <Link
                to="/outfits/new"
                className="inline-flex items-center gap-2 py-2 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm"
              >
                <Shirt className="w-4 h-4" />
                Create First Outfit
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
