import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Edit, MoreVertical, Shirt } from 'lucide-react'
import { useItem, useOutfits, useItems } from '@/hooks/useData'
import { OutfitThumbnail } from '@/components/OutfitThumbnail'

export const Route = createFileRoute('/items/$itemId')({ component: ItemDetailPage })

function ItemDetailPage() {
  const navigate = useNavigate()
  const { itemId } = Route.useParams()
  const { data: item, isLoading, error } = useItem(itemId)
  const { data: allOutfits } = useOutfits()
  const { data: items, isLoading: itemsLoading } = useItems()

  // Find outfits that contain this item
  const outfitsUsingItem = allOutfits?.filter(outfit =>
    outfit.itemIds.includes(itemId)
  ) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading item...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Item not found</p>
          <button
            onClick={() => navigate({ to: '/wardrobe' })}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Wardrobe
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
              onClick={() => navigate({ to: '/wardrobe' })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Item Details
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* TODO: Implement edit */}}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => {/* TODO: Implement more options */}}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Item Photo */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            {item.photo ? (
              <div className="relative w-full">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-semibold text-lg">{item.name}</p>
                  <p className="text-white/90 text-sm">{item.category}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-12 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Shirt className="w-20 h-20 text-blue-400 dark:text-blue-600" />
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">{item.name}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-500">{item.category}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Item Details */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{item.name}</h2>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{item.category}</span>
              </div>
              {item.color && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Color:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{item.color}</span>
                </div>
              )}
              {item.size && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Size:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{item.size}</span>
                </div>
              )}
              {item.brand && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{item.brand}</span>
                </div>
              )}
              {item.tags && (
                <div className="py-2">
                  <span className="text-gray-600 dark:text-gray-400">Tags: {item.tags}</span>
                </div>
              )}
            </div>

            {item.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-gray-600 dark:text-gray-400 mb-2">Notes:</h3>
                <div className="min-h-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 text-sm">
                  {item.notes}
                </div>
              </div>
            )}
          </section>

          {/* Used in Outfits */}
          {outfitsUsingItem.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Used in Outfits ({outfitsUsingItem.length})
                </h2>
                <Link
                  to="/outfits"
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-500"
                >
                  View All Outfits
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {outfitsUsingItem.map((outfit) => (
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
        </div>
      </div>
    </div>
  )
}
