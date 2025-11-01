import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Shirt, ChevronLeft, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useItems, useOutfitWithItems, useUpdateOutfit } from '@/hooks/useData'
import { useProfile } from '@/hooks/useProfile'

export const Route = createFileRoute('/outfits/$outfitId_/edit')({ component: EditOutfitPage })

function EditOutfitPage() {
  const navigate = useNavigate()
  const { outfitId_ } = Route.useParams()
  const outfitId = outfitId_
  const { activeProfile } = useProfile()
  const { data: items } = useItems(activeProfile?.id)
  const { data: outfit, isLoading } = useOutfitWithItems(outfitId)
  const updateOutfit = useUpdateOutfit()

  const [formData, setFormData] = useState({
    name: '',
    season: '',
    occasion: '',
    weather: '',
    tags: '',
    notes: ''
  })
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

  // Pre-populate form when outfit data is loaded
  useEffect(() => {
    if (outfit) {
      setFormData({
        name: outfit.name || '',
        season: outfit.season || '',
        occasion: outfit.occasion || '',
        weather: outfit.weather || '',
        tags: outfit.tags || '',
        notes: outfit.notes || ''
      })
      setSelectedItemIds(outfit.itemIds || [])
    }
  }, [outfit])

  const toggleItem = (itemId: string) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectedItems = items?.filter(item => selectedItemIds.includes(item.id)) || []

  const handleSave = async () => {
    if (!formData.name || !formData.season) {
      alert('Please fill in the required fields: Name and Season')
      return
    }

    if (selectedItemIds.length === 0) {
      alert('Please select at least one item for the outfit')
      return
    }

    try {
      await updateOutfit.mutateAsync({
        id: outfitId,
        data: {
          name: formData.name,
          season: formData.season,
          itemIds: selectedItemIds,
          occasion: formData.occasion || undefined,
          weather: formData.weather || undefined,
          tags: formData.tags || undefined,
          notes: formData.notes || undefined
        }
      })
      navigate({ to: '/outfits/$outfitId', params: { outfitId } })
    } catch (error) {
      console.error('Failed to update outfit:', error)
      alert('Failed to save outfit. Please try again.')
    }
  }

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

  if (!outfit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Outfit not found</p>
          <button
            type="button"
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
              type="button"
              onClick={() => navigate({ to: '/outfits/$outfitId', params: { outfitId } })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Edit Outfit
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={updateOutfit.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateOutfit.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Outfit Details */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Outfit Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Outfit Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Casual Weekend Look"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Season <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Spring/Summer, Fall, Winter, All Season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Occasion
                </label>
                <input
                  type="text"
                  placeholder="e.g., Casual, Formal, Date Night"
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weather
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sunny, Rainy, Cold"
                  value={formData.weather}
                  onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="e.g., #casual #comfortable"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Add notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* Select Items */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Select Items ({selectedItemIds.length} selected)
            </h2>

            {items && items.length > 0 ? (
              <div className="grid grid-cols-4 gap-3 mb-6">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      selectedItemIds.includes(item.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.hasPhoto && item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Shirt className="w-6 h-6 text-blue-400 dark:text-blue-600" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No items found in your wardrobe
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ to: '/items/new' })}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Add your first item
                </button>
              </div>
            )}

            {/* Selected Items Display */}
            {selectedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Selected Items
                </h3>
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.hasPhoto && item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Shirt className="w-6 h-6 text-blue-400 dark:text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.category}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
