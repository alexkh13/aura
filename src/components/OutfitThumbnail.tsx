import { Shirt } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Item } from '@/types'

interface OutfitThumbnailProps {
  itemIds: string[]
  items?: Item[]
  size?: 'small' | 'medium' | 'large'
  className?: string
  loading?: boolean
}

export function OutfitThumbnail({
  itemIds,
  items = [],
  size = 'medium',
  className = '',
  loading = false
}: OutfitThumbnailProps) {
  // Get actual item objects from itemIds
  const outfitItems = itemIds
    .map(id => items.find(item => item.id === id))
    .filter((item): item is Item => item !== undefined)

  // Get items with photos for display
  const itemsWithPhotos = outfitItems.filter(item => item.hasPhoto && item.photo)

  // Limit displayed items to max 6 for better layout
  const displayItems = itemsWithPhotos.slice(0, 6)
  const hasItems = displayItems.length > 0

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'h-24',
      icon: 'w-8 h-8',
      grid: 'gap-0.5'
    },
    medium: {
      container: 'h-48',
      icon: 'w-12 h-12',
      grid: 'gap-1'
    },
    large: {
      container: 'h-64',
      icon: 'w-16 h-16',
      grid: 'gap-2'
    }
  }

  const config = sizeConfig[size]

  // Determine grid layout based on number of items
  const getGridLayout = () => {
    const count = displayItems.length
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-2'
    if (count === 3) return 'grid-cols-2'
    if (count === 4) return 'grid-cols-2'
    return 'grid-cols-3'
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={`${config.container} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className} overflow-hidden`}>
        <div className="w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700" />
      </div>
    )
  }

  // Empty state or no photos
  if (!hasItems) {
    return (
      <div className={`${config.container} bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800 ${className} flex items-center justify-center`}>
        <Shirt className={`${config.icon} text-blue-400 dark:text-blue-600`} />
      </div>
    )
  }

  // Composite thumbnail display
  return (
    <div className={`${config.container} bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 ${className} overflow-hidden`}>
      <div className={`grid ${getGridLayout()} ${config.grid} w-full h-full`}>
        {displayItems.map((item, index) => (
          <ItemPhoto key={item.id} item={item} index={index} totalItems={displayItems.length} />
        ))}
      </div>
    </div>
  )
}

interface ItemPhotoProps {
  item: Item
  index: number
  totalItems: number
}

function ItemPhoto({ item, index, totalItems }: ItemPhotoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset error state when item changes
  useEffect(() => {
    setImageError(false)
    setImageLoaded(false)
  }, [item.id])

  // Special handling for 3-item layout: first item spans 2 columns
  const shouldSpanTwoColumns = totalItems === 3 && index === 0

  if (!item.photo || imageError) {
    return (
      <div className={`relative bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${shouldSpanTwoColumns ? 'col-span-2' : ''}`}>
        <Shirt className="w-6 h-6 text-gray-400 dark:text-gray-600" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${shouldSpanTwoColumns ? 'col-span-2' : ''}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" />
      )}
      <img
        src={item.photo}
        alt={item.name}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  )
}
