import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Edit, MoreVertical, Shirt, Trash2, Camera, Upload, X, Sparkles } from 'lucide-react'
import { useOutfitWithItems, useDeleteOutfit, useUpdateOutfit } from '@/hooks/useData'
import { useState, useRef, useEffect } from 'react'
import { generateVirtualTryOnVisualization } from '@/services/ai'

export const Route = createFileRoute('/outfits/$outfitId')({
  component: OutfitDetailPage,
})

function OutfitDetailPage() {
  const navigate = useNavigate()
  const { outfitId } = Route.useParams()
  const { data: outfit, isLoading, error } = useOutfitWithItems(outfitId)
  const deleteOutfit = useDeleteOutfit()
  const updateOutfit = useUpdateOutfit()

  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Virtual Try-On state
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Carousel state for outfit display
  const [virtualTryOnImages, setVirtualTryOnImages] = useState<string[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0) // 0 = items grid, 1+ = virtual try-on images
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Load persisted virtual try-on images when outfit loads
  useEffect(() => {
    if (outfit?.virtualTryOnImages) {
      setVirtualTryOnImages(outfit.virtualTryOnImages)
    }
  }, [outfit?.virtualTryOnImages])

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this outfit? This action cannot be undone.')) {
      return
    }

    try {
      await deleteOutfit.mutateAsync(outfitId)
      navigate({ to: '/outfits' })
    } catch (err) {
      console.error('Failed to delete outfit:', err)
      alert('Failed to delete outfit')
    }
  }

  // Virtual Try-On handlers - simplified to immediately start generation
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size must be less than 10MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check if outfit has items with photos
    if (!outfit?.items || outfit.items.length === 0) {
      alert('This outfit has no items to try on')
      return
    }

    const outfitItemsWithPhotos = outfit.items
      .filter(item => item.hasPhoto && item.photo)

    if (outfitItemsWithPhotos.length === 0) {
      alert('This outfit has no photos to try on')
      return
    }

    // Warn about limitations with many items
    if (outfitItemsWithPhotos.length > 4) {
      const proceed = confirm(
        'This outfit has many items. Virtual try-on works best with 1-4 clothing items. Results may be less accurate with more items. Continue anyway?'
      )
      if (!proceed) {
        // Reset file input
        if (event.target) {
          event.target.value = ''
        }
        return
      }
    }

    // Convert file to base64 and immediately start generation
    const reader = new FileReader()
    reader.onloadend = async () => {
      const userPhotoDataUrl = reader.result as string

      setIsGenerating(true)
      setGenerationProgress('Starting virtual try-on...')

      try {
        const result = await generateVirtualTryOnVisualization(
          userPhotoDataUrl,
          outfitItemsWithPhotos,
          (message, progress) => {
            setGenerationProgress(`${message} (${progress}%)`)
          }
        )

        // Add to local state
        const updatedImages = [...virtualTryOnImages, result]
        setVirtualTryOnImages(updatedImages)
        setCurrentPhotoIndex(updatedImages.length) // Switch to the new image

        // Save to database
        await updateOutfit.mutateAsync({
          id: outfitId,
          data: {
            virtualTryOnImages: updatedImages
          }
        })

        // Close modal
        setShowVirtualTryOn(false)
        setGenerationProgress('')
      } catch (err) {
        console.error('Virtual try-on failed:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate virtual try-on.'
        alert(`${errorMessage}\n\nTips for better results:\n• Use a clear, well-lit photo\n• Ensure you're facing the camera\n• Try with fewer outfit items\n• Make sure outfit items have clear product photos`)
        setGenerationProgress('')
      } finally {
        setIsGenerating(false)
        // Reset file input
        if (event.target) {
          event.target.value = ''
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCloseVirtualTryOn = () => {
    setShowVirtualTryOn(false)
    setGenerationProgress('')
  }

  // Swipe gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    const totalPhotos = virtualTryOnImages.length + 1 // +1 for items grid

    if (isLeftSwipe && currentPhotoIndex < totalPhotos - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    }

    if (isRightSwipe && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    }
  }

  const handleRemoveTryOnImage = async (index: number) => {
    if (confirm('Remove this virtual try-on image?')) {
      const updatedImages = virtualTryOnImages.filter((_, i) => i !== index)
      setVirtualTryOnImages(updatedImages)

      // Adjust current index if needed
      if (currentPhotoIndex > updatedImages.length) {
        setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))
      }

      // Save to database
      try {
        await updateOutfit.mutateAsync({
          id: outfitId,
          data: {
            virtualTryOnImages: updatedImages
          }
        })
      } catch (err) {
        console.error('Failed to update outfit:', err)
        alert('Failed to remove image. Please try again.')
        // Revert on error
        setVirtualTryOnImages(virtualTryOnImages)
      }
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
                onClick={() => setShowVirtualTryOn(true)}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="Virtual Try-On"
              >
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => navigate({ to: '/outfits/$outfitId/edit', params: { outfitId } })}
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
                      Delete Outfit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Swipeable Outfit Display Carousel */}
          <section
            ref={carouselRef}
            className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Display mode indicator */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              {currentPhotoIndex === 0 ? (
                <>
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Outfit Items</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Virtual Try-On</span>
                </>
              )}
            </div>

            {/* Remove button for virtual try-on images */}
            {currentPhotoIndex > 0 && (
              <button
                onClick={() => handleRemoveTryOnImage(currentPhotoIndex - 1)}
                className="absolute top-4 right-4 z-10 p-2 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm rounded-full text-white transition-colors"
                title="Remove this image"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Content */}
            <div className="relative min-h-[400px]">
              {/* Items Grid (Index 0) */}
              {currentPhotoIndex === 0 && (
                <div className="animate-fadeIn">
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
                </div>
              )}

              {/* Virtual Try-On Images (Index 1+) */}
              {currentPhotoIndex > 0 && virtualTryOnImages[currentPhotoIndex - 1] && (
                <div className="animate-fadeIn h-full flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-blue-300 dark:border-blue-700 w-full">
                    <img
                      src={virtualTryOnImages[currentPhotoIndex - 1]}
                      alt={`Virtual try-on ${currentPhotoIndex}`}
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Dots */}
            {virtualTryOnImages.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {[...Array(virtualTryOnImages.length + 1)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`transition-all ${
                      currentPhotoIndex === index
                        ? 'w-8 h-2 bg-blue-600 dark:bg-blue-400'
                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    } rounded-full`}
                    aria-label={index === 0 ? 'View outfit items' : `View try-on ${index}`}
                  />
                ))}
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

      {/* Virtual Try-On Modal */}
      {showVirtualTryOn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Virtual Try-On
                </h2>
              </div>
              <button
                onClick={handleCloseVirtualTryOn}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Generating State */}
              {isGenerating && (
                <div className="space-y-6 py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Creating Your Virtual Try-On
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {generationProgress || 'Processing...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Interface */}
              {!isGenerating && (
                <div className="space-y-6">
                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Tips for best results:
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1.5 list-disc list-inside">
                      <li>Use a full-body or upper-body photo with good lighting</li>
                      <li>Face the camera directly with clear view</li>
                      <li>Simple background works best</li>
                      <li>Stand in a natural pose</li>
                    </ul>
                  </div>

                  {/* Upload Buttons */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-center">
                      Select Your Photo
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={isGenerating}
                        className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Camera className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Take Photo
                        </span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating}
                        className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Upload Photo
                        </span>
                      </button>
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 italic">
                      Generation will start automatically after you select your photo
                    </p>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      disabled={isGenerating}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isGenerating}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
