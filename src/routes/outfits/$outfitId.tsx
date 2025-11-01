import { createFileRoute, Link, useNavigate, Outlet } from '@tanstack/react-router'
import { ChevronLeft, Edit, User, Settings, Shirt } from 'lucide-react'
import { useOutfitWithItems } from '@/hooks/useData'

export const Route = createFileRoute('/outfits/$outfitId')({
  component: OutfitDetailPage,
})

function OutfitDetailPage() {
  const navigate = useNavigate()
  const { outfitId } = Route.useParams()
  const { data: outfit, isLoading, error } = useOutfitWithItems(outfitId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading outfit...</p>
        </div>
      </div>
    )
  }

  if (error || !outfit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Outfit not found</p>
          <button
            onClick={() => navigate({ to: '/outfits' })}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Outfits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/outfits' })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Outfit Details
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate({ to: '/outfits/$outfitId/edit', params: { outfitId } })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => {/* TODO: Implement user profile */}}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => {/* TODO: Implement settings */}}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Large Outfit Photo */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            {outfit.items && outfit.items.length > 0 ? (
              <div className={`grid gap-2 ${
                outfit.items.length === 1 ? 'grid-cols-1' :
                outfit.items.length === 2 ? 'grid-cols-2' :
                outfit.items.length === 3 ? 'grid-cols-2' :
                'grid-cols-3'
              }`}>
                {outfit.items.slice(0, 9).map((item, index) => {
                  const isFirstOfThree = outfit.items.length === 3 && index === 0
                  return (
                    <div
                      key={item.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-blue-200 dark:border-blue-700 ${
                        isFirstOfThree ? 'col-span-2' : ''
                      } ${
                        outfit.items.length === 1 ? 'h-80' :
                        isFirstOfThree ? 'h-56' :
                        outfit.items.length === 2 ? 'h-64' :
                        'h-40'
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        {item.hasPhoto && item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Shirt className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 py-12">
                <Shirt className="w-20 h-20 text-blue-400 dark:text-blue-600" />
                <p className="text-blue-600 dark:text-blue-400 font-medium">No items in this outfit yet</p>
              </div>
            )}
          </section>

          {/* Outfit Details */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {outfit.name}
            </h2>

            <div className="space-y-3">
              {outfit.occasion && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Occasion:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{outfit.occasion}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Season:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{outfit.season}</span>
              </div>
              {outfit.weather && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Weather:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{outfit.weather}</span>
                </div>
              )}
              {outfit.tags && (
                <div className="py-2">
                  <span className="text-gray-600 dark:text-gray-400">Tags: {outfit.tags}</span>
                </div>
              )}
            </div>

            {outfit.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-gray-600 dark:text-gray-400 mb-2">Notes:</h3>
                <div className="min-h-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 text-sm">
                  {outfit.notes}
                </div>
              </div>
            )}
          </section>

          {/* Items in this Outfit */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Items in this Outfit ({outfit.items?.length || 0})
            </h2>
            {outfit.items && outfit.items.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {outfit.items.map((item) => (
                  <Link
                    key={item.id}
                    to="/items/$itemId"
                    params={{ itemId: item.id }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg h-32 mb-3 flex items-center justify-center overflow-hidden">
                      {item.hasPhoto && item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Shirt className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center truncate">
                      {item.category}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No items in this outfit yet</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
