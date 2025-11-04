import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Edit, MoreVertical, Shirt, Trash2, Check, X } from 'lucide-react'
import { useItem, useOutfits, useItems, useUpdateItem, useDeleteItem } from '@/hooks/useData'
import { OutfitThumbnail } from '@/components/OutfitThumbnail'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/items/$itemId')({ component: ItemDetailPage })

function ItemDetailPage() {
  const navigate = useNavigate()
  const { itemId } = Route.useParams()
  const { data: item, isLoading, error } = useItem(itemId)
  const { data: allOutfits } = useOutfits()
  const { data: items, isLoading: itemsLoading } = useItems()
  const updateItem = useUpdateItem()
  const deleteItem = useDeleteItem()

  const [isEditing, setIsEditing] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    category: '',
    color: '',
    size: '',
    brand: '',
    tags: '',
    notes: ''
  })

  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Update edit data when item loads
  useEffect(() => {
    if (item) {
      setEditData({
        name: item.name || '',
        category: item.category || '',
        color: item.color || '',
        size: item.size || '',
        brand: item.brand || '',
        tags: item.tags || '',
        notes: item.notes || ''
      })
    }
  }, [item])

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMoreMenu])

  const handleSaveEdit = async () => {
    try {
      await updateItem.mutateAsync({
        id: itemId,
        data: editData
      })
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update item:', err)
      alert('Failed to update item')
    }
  }

  const handleCancelEdit = () => {
    if (item) {
      setEditData({
        name: item.name || '',
        category: item.category || '',
        color: item.color || '',
        size: item.size || '',
        brand: item.brand || '',
        tags: item.tags || '',
        notes: item.notes || ''
      })
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    try {
      await deleteItem.mutateAsync(itemId)
      navigate({ to: '/wardrobe' })
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert('Failed to delete item')
    }
  }

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
              {isEditing ? 'Editing Item' : 'Item Details'}
            </button>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={updateItem.isPending}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                    title="Cancel"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={updateItem.isPending}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors disabled:opacity-50"
                    title="Save"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="relative" ref={moreMenuRef}>
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    {showMoreMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                        <button
                          onClick={() => {
                            setShowMoreMenu(false)
                            handleDelete()
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Item
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
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
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blue Denim Jacket"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Dress">Dress</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Activewear">Activewear</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={editData.color}
                    onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={editData.size}
                    onChange={(e) => setEditData({ ...editData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., M, L, XL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editData.brand}
                    onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Nike, Zara"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={editData.tags}
                    onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., #casual #summer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this item..."
                  />
                </div>
              </div>
            ) : (
              <>
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
              </>
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
