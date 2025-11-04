import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  Plus,
  X,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Check,
  RefreshCw,
  Layers,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { extractGarmentsFromImage, isGeminiConfigured, type AIGeneratedItem } from '@/services/ai'
import { useCreateItem } from '@/hooks/useData'

export const Route = createFileRoute('/items/ai-analyze')({ component: AIAnalyzePage })

interface ItemFormData {
  id?: string
  name: string
  category: string
  color: string
  size: string
  brand: string
  tags: string
  notes: string
  hasPhoto: boolean
  aiGenerated?: boolean
  imageData?: string
  originalImageData?: string // Keep reference to original photo for re-extraction
  originalImageIndex?: number // Track which original image this came from
  croppedImageData?: string // Store cropped image for comparison
  generatedImageData?: string // Store AI-generated image for comparison
  metadata?: AIGeneratedItem['metadata']
  saved?: boolean
  isProcessing?: boolean
  processingMessage?: string
  needsAIGeneration?: boolean // Flag to show "Generate AI Image" button
}

function AIAnalyzePage() {
  const navigate = useNavigate()
  const { activeProfile } = useProfile()
  const createItem = useCreateItem()

  const [analyzedItems, setAnalyzedItems] = useState<ItemFormData[]>([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasGeminiKey, setHasGeminiKey] = useState(false)
  const [showGeneratedImage, setShowGeneratedImage] = useState(true) // Toggle between cropped and generated

  const fileInputRef = useRef<HTMLInputElement>(null)
  const processingRef = useRef(false)

  // Check if Gemini is configured
  useEffect(() => {
    isGeminiConfigured().then(setHasGeminiKey)
  }, [])

  // Crop image helper
  const cropImage = async (imageDataUrl: string, boundingBox: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Failed to get canvas context')

          // Use pixel coordinates directly
          const cropX = Math.max(0, Math.floor(boundingBox.x))
          const cropY = Math.max(0, Math.floor(boundingBox.y))
          const cropWidth = Math.min(img.width - cropX, Math.ceil(boundingBox.width))
          const cropHeight = Math.min(img.height - cropY, Math.ceil(boundingBox.height))

          // Detailed logging
          console.log(`   📐 Original image: ${img.width}x${img.height}px`)
          console.log(`   📏 Crop region: (${cropX}, ${cropY}) ${cropWidth}x${cropHeight}px`)
          console.log(`   📊 Coverage: ${((cropWidth * cropHeight) / (img.width * img.height) * 100).toFixed(1)}% of original`)

          // Validate crop dimensions
          if (cropWidth <= 0 || cropHeight <= 0) {
            throw new Error(`Invalid crop dimensions: ${cropWidth}x${cropHeight}`)
          }

          canvas.width = cropWidth
          canvas.height = cropHeight
          ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
          resolve(canvas.toDataURL('image/jpeg', 0.95))
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageDataUrl
    })
  }

  // Process all images in background
  const processImagesInBackground = async (images: string[]) => {
    if (!await isGeminiConfigured()) {
      setAnalyzedItems(items =>
        items.map(item => ({
          ...item,
          isProcessing: false,
          processingMessage: 'API key required',
          name: 'Configuration needed',
        }))
      )
      return
    }

    const { extractMultipleGarmentsMetadata } = await import('@/services/ai/gemini')

    let totalItemsCreated = 0

    // Process each image and show items immediately after each one
    for (let i = 0; i < images.length; i++) {
      try {
        console.log(`📸 Processing image ${i + 1}/${images.length}`)

        // Update placeholder
        setAnalyzedItems(prevItems => {
          const newItems = [...prevItems]
          if (i < newItems.length) {
            newItems[i] = {
              ...newItems[i],
              processingMessage: `Analyzing image ${i + 1}/${images.length}...`,
            }
          }
          return newItems
        })

        // Convert data URL to File
        const response = await fetch(images[i])
        const blob = await response.blob()
        const file = new File([blob], `image-${i}.jpg`, { type: 'image/jpeg' })

        // Extract metadata ONLY
        const extractedMetadata = await extractMultipleGarmentsMetadata(file, (message, progress) => {
          setAnalyzedItems(prevItems => {
            const newItems = [...prevItems]
            if (i < newItems.length) {
              newItems[i] = {
                ...newItems[i],
                processingMessage: message,
              }
            }
            return newItems
          })
        })

        console.log(`✅ Detected ${extractedMetadata.length} garments in image ${i + 1}`)

        // Crop images and create items immediately for this image
        const newItemsForThisImage: ItemFormData[] = []

        for (const metadata of extractedMetadata) {
          let croppedImage = images[i]
          if (metadata.metadata?.boundingBox) {
            try {
              const bbox = metadata.metadata.boundingBox
              console.log(`✂️ Cropping "${metadata.name}" (${metadata.category})`)
              console.log(`   Bounding box (pixels): x=${bbox.x}px, y=${bbox.y}px, w=${bbox.width}px, h=${bbox.height}px`)

              // Validate bounding boxes
              const aspectRatio = bbox.width / bbox.height

              if (metadata.category === 'Shoes') {
                console.log(`👟 Shoe pair detected`)
                console.log(`   Aspect ratio: ${aspectRatio.toFixed(2)} (should be ~1.5-2.5 for side-by-side shoes)`)

                if (aspectRatio < 1.2) {
                  console.error(`❌ PROBLEM: Shoe bounding box too narrow! This will cut off shoes.`)
                  console.error(`   Expected: width > height for shoes side-by-side`)
                  console.error(`   Got: width/height = ${aspectRatio.toFixed(2)}`)
                } else if (aspectRatio > 3.0) {
                  console.warn(`⚠️ Shoe bounding box very wide (${aspectRatio.toFixed(2)}). May include extra space.`)
                } else {
                  console.log(`✅ Good shoe bounding box`)
                }
              } else {
                console.log(`   Aspect ratio: ${aspectRatio.toFixed(2)} (${aspectRatio > 1 ? 'wide' : 'tall'})`)
              }

              console.log(`   Box size: ${bbox.width}x${bbox.height}px`)

              croppedImage = await cropImage(images[i], metadata.metadata.boundingBox)
              console.log(`✅ Cropped successfully`)
            } catch (err) {
              console.warn('Failed to crop image, using original:', err)
            }
          } else {
            console.warn(`⚠️ No bounding box for: ${metadata.name}`)
          }

          newItemsForThisImage.push({
            name: metadata.name,
            category: metadata.category,
            color: metadata.color || '',
            size: '',
            brand: '',
            tags: metadata.tags || '',
            notes: metadata.notes || '',
            hasPhoto: true,
            aiGenerated: true,
            imageData: croppedImage, // Current display image (starts as cropped)
            originalImageData: images[i], // Keep original for re-extraction
            originalImageIndex: i, // Track which original image this came from
            croppedImageData: croppedImage, // Store cropped version
            generatedImageData: undefined, // Will be set after AI generation
            metadata: metadata.metadata,
            isProcessing: false,
            processingMessage: '',
            needsAIGeneration: true, // Show AI generation button
          })
        }

        // Replace the placeholder with detected items IMMEDIATELY
        setAnalyzedItems(prevItems => {
          const result = [...prevItems]
          result.splice(i, 1, ...newItemsForThisImage)
          return result
        })

        console.log(`📦 Added ${newItemsForThisImage.length} items from image ${i + 1}`)

        totalItemsCreated += newItemsForThisImage.length
      } catch (error) {
        console.error(`Failed to process image ${i}:`, error)
        // Mark placeholder as error
        setAnalyzedItems(prevItems => {
          const result = [...prevItems]
          if (i < result.length) {
            result[i] = {
              ...result[i],
              isProcessing: false,
              processingMessage: 'Analysis failed',
              name: 'Error',
            }
          }
          return result
        })
      }
    }

    console.log(`🎯 Total items created: ${totalItemsCreated}`)
  }

  // Generate clean product image for a specific item by position
  const generateImageForItemByPosition = async (
    position: number,
    croppedImageData: string,
    itemName: string
  ) => {
    try {
      const { generateCleanProductImageFromData } = await import('@/services/ai/gemini')

      console.log(`🎨 Starting image generation for item ${position + 1}: ${itemName}`)

      // Update status
      setAnalyzedItems(prevItems => {
        if (position >= prevItems.length) {
          console.warn(`⚠️ Item position ${position} out of bounds (length: ${prevItems.length})`)
          return prevItems
        }
        const newItems = [...prevItems]
        newItems[position] = {
          ...newItems[position],
          processingMessage: 'Generating product image...',
        }
        return newItems
      })

      const generatedImage = await generateCleanProductImageFromData(croppedImageData, (message, progress) => {
        setAnalyzedItems(prevItems => {
          if (position >= prevItems.length) return prevItems
          const newItems = [...prevItems]
          newItems[position] = {
            ...newItems[position],
            processingMessage: message,
          }
          return newItems
        })
      })

      console.log(`✅ Image generated for item ${position + 1}: ${itemName}`)

      // Store generated image separately and update display
      setAnalyzedItems(prevItems => {
        if (position >= prevItems.length) {
          console.warn(`⚠️ Item position ${position} out of bounds when updating generated image`)
          return prevItems
        }
        const newItems = [...prevItems]
        newItems[position] = {
          ...newItems[position],
          generatedImageData: generatedImage, // Store generated version
          imageData: generatedImage, // Show generated by default
          isProcessing: false,
          processingMessage: '',
          needsAIGeneration: false, // Hide button after generation
        }
        return newItems
      })
    } catch (error) {
      console.error(`Failed to generate image for item ${position + 1}:`, error)
      // Keep the cropped image, just mark as done processing
      setAnalyzedItems(prevItems => {
        if (position >= prevItems.length) return prevItems
        const newItems = [...prevItems]
        newItems[position] = {
          ...newItems[position],
          isProcessing: false,
          processingMessage: '',
        }
        return newItems
      })
    }
  }

  // Load images from sessionStorage on mount and immediately create placeholder items
  useEffect(() => {
    const storedImages = sessionStorage.getItem('aiAnalyzeImages')
    console.log('🔍 Checking for stored images:', storedImages ? 'Found' : 'Not found')
    console.log('🔍 Processing ref:', processingRef.current)
    console.log('🔍 Analyzed items count:', analyzedItems.length)

    if (storedImages && !processingRef.current) {
      processingRef.current = true
      const images: string[] = JSON.parse(storedImages)
      console.log('📸 Loaded images:', images.length)
      sessionStorage.removeItem('aiAnalyzeImages')

      // Create placeholder items immediately - this triggers re-render to show form
      const placeholderItems: ItemFormData[] = images.map((img, index) => ({
        name: `Analyzing...`,
        category: '',
        color: '',
        size: '',
        brand: '',
        tags: '',
        notes: '',
        hasPhoto: true,
        aiGenerated: true,
        imageData: img,
        isProcessing: true,
        processingMessage: 'Starting analysis...',
      }))

      console.log('✨ Created placeholder items:', placeholderItems.length)
      setAnalyzedItems(placeholderItems)

      // Start processing all images in background
      processImagesInBackground(images)
    } else if (!storedImages && analyzedItems.length === 0 && !processingRef.current) {
      console.log('⚠️ No images found and no items, redirecting to wardrobe')
      // No images found and no items created yet, redirect back to wardrobe
      navigate({ to: '/wardrobe' })
    } else {
      console.log('ℹ️ Skipping effect - already processing or items exist')
    }
  }, [navigate])

  const currentItem = analyzedItems[currentItemIndex]

  const updateCurrentItem = (updates: Partial<ItemFormData>) => {
    setAnalyzedItems(items =>
      items.map((item, i) => (i === currentItemIndex ? { ...item, ...updates } : item))
    )
  }

  const handleSave = async () => {
    if (!currentItem.name.trim() || !currentItem.category.trim()) {
      alert('Please fill in the required fields: Name and Category')
      return
    }

    if (!activeProfile) {
      alert('No active profile selected')
      return
    }

    try {
      const savedItem = await createItem.mutateAsync({
        name: currentItem.name.trim(),
        category: currentItem.category.trim(),
        hasPhoto: currentItem.hasPhoto,
        photo: currentItem.imageData || '',
        color: currentItem.color.trim() || '',
        size: currentItem.size.trim() || '',
        brand: currentItem.brand.trim() || '',
        tags: currentItem.tags.trim() || '',
        notes: currentItem.notes.trim() || '',
        profileId: activeProfile.id,
      })

      // Mark current item as saved
      setAnalyzedItems(items =>
        items.map((item, i) =>
          i === currentItemIndex
            ? { ...item, id: savedItem.id, saved: true }
            : item
        )
      )

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      // Check if all items are saved
      const allSaved = analyzedItems.every((item, i) =>
        i === currentItemIndex || item.saved
      )

      if (allSaved) {
        // All items saved, show success and allow user to navigate away
        setTimeout(() => {
          if (confirm('All items saved! Return to wardrobe?')) {
            navigate({ to: '/wardrobe' })
          }
        }, 1500)
      }
    } catch (err) {
      console.error('Failed to save item:', err)
      alert('Failed to save item')
    }
  }

  const handleDiscard = () => {
    // Remove current item from the list
    const newItems = analyzedItems.filter((_, i) => i !== currentItemIndex)

    if (newItems.length === 0) {
      // No more items, go back to wardrobe
      navigate({ to: '/wardrobe' })
      return
    }

    setAnalyzedItems(newItems)

    // Adjust current index if needed
    if (currentItemIndex >= newItems.length) {
      setCurrentItemIndex(newItems.length - 1)
    }
  }

  const handleNavigateToItem = (index: number) => {
    setCurrentItemIndex(index)
    // Reset to show generated image by default when switching items
    setShowGeneratedImage(true)
  }

  const handleGenerateAIImage = async () => {
    const currentItem = analyzedItems[currentItemIndex]
    if (!currentItem.imageData || !currentItem.needsAIGeneration) return

    console.log(`🎨 User triggered AI generation for item ${currentItemIndex + 1}: ${currentItem.name}`)

    // Update to show it's processing and hide the button
    setAnalyzedItems(prevItems => {
      const newItems = [...prevItems]
      newItems[currentItemIndex] = {
        ...newItems[currentItemIndex],
        isProcessing: true,
        needsAIGeneration: false,
        processingMessage: 'Generating product image...',
      }
      return newItems
    })

    // Start generation using the cropped image
    await generateImageForItemByPosition(
      currentItemIndex,
      currentItem.croppedImageData || currentItem.imageData,
      currentItem.name
    )
  }

  const handleReExtractMetadata = async () => {
    const currentItem = analyzedItems[currentItemIndex]
    if (!currentItem.originalImageData || currentItem.originalImageIndex === undefined) {
      console.error('No original image data available for re-extraction')
      return
    }

    const originalImageIndex = currentItem.originalImageIndex
    const originalImageData = currentItem.originalImageData

    console.log(`🔄 Re-extracting metadata for original image ${originalImageIndex + 1}`)

    // Find ALL items that came from this original image
    const itemsFromSameImage = analyzedItems.filter(
      item => item.originalImageIndex === originalImageIndex
    )
    const itemIndices = analyzedItems
      .map((item, idx) => (item.originalImageIndex === originalImageIndex ? idx : -1))
      .filter(idx => idx !== -1)

    console.log(`📦 Found ${itemsFromSameImage.length} items from this original image`)

    // Mark all related items as processing
    setAnalyzedItems(prevItems => {
      const newItems = [...prevItems]
      itemIndices.forEach(idx => {
        newItems[idx] = {
          ...newItems[idx],
          isProcessing: true,
          processingMessage: 'Re-analyzing original image...',
        }
      })
      return newItems
    })

    try {
      const { extractMultipleGarmentsMetadata } = await import('@/services/ai/gemini')

      // Convert data URL to File
      const response = await fetch(originalImageData)
      const blob = await response.blob()
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })

      // Extract metadata for ALL garments in the image
      const extractedMetadata = await extractMultipleGarmentsMetadata(file)

      console.log(`✅ Extracted ${extractedMetadata.length} garments from re-analysis`)

      // Create new items from extracted metadata
      const newItemsForThisImage: ItemFormData[] = []

      for (const metadata of extractedMetadata) {
        let croppedImage = originalImageData
        if (metadata.metadata?.boundingBox) {
          try {
            croppedImage = await cropImage(originalImageData, metadata.metadata.boundingBox)
          } catch (err) {
            console.warn('Failed to crop image, using original:', err)
          }
        }

        newItemsForThisImage.push({
          name: metadata.name,
          category: metadata.category,
          color: metadata.color || '',
          size: '',
          brand: '',
          tags: metadata.tags || '',
          notes: metadata.notes || '',
          hasPhoto: true,
          aiGenerated: true,
          imageData: croppedImage,
          originalImageData: originalImageData,
          originalImageIndex: originalImageIndex,
          croppedImageData: croppedImage,
          generatedImageData: undefined,
          metadata: metadata.metadata,
          isProcessing: false,
          processingMessage: '',
          needsAIGeneration: true,
        })
      }

      // Replace old items with new items
      setAnalyzedItems(prevItems => {
        // Remove all items from the same original image
        const filteredItems = prevItems.filter(
          item => item.originalImageIndex !== originalImageIndex
        )

        // Find where to insert new items (at the position of the first old item)
        const firstOldItemIndex = itemIndices[0]

        // Insert new items at that position
        const result = [
          ...filteredItems.slice(0, firstOldItemIndex),
          ...newItemsForThisImage,
          ...filteredItems.slice(firstOldItemIndex),
        ]

        return result
      })

      // Adjust currentItemIndex to the first new item
      setCurrentItemIndex(itemIndices[0])

      console.log('✅ Metadata re-extracted successfully')
    } catch (error) {
      console.error('Failed to re-extract metadata:', error)
      // Remove processing state on error
      setAnalyzedItems(prevItems => {
        const newItems = [...prevItems]
        itemIndices.forEach(idx => {
          if (idx < newItems.length) {
            newItems[idx] = {
              ...newItems[idx],
              isProcessing: false,
              processingMessage: '',
            }
          }
        })
        return newItems
      })
    }
  }

  const handleToggleImageView = () => {
    const currentItem = analyzedItems[currentItemIndex]
    if (!currentItem.croppedImageData || !currentItem.generatedImageData) return

    const newShowGenerated = !showGeneratedImage

    setAnalyzedItems(prevItems => {
      const newItems = [...prevItems]
      newItems[currentItemIndex] = {
        ...newItems[currentItemIndex],
        imageData: newShowGenerated ? currentItem.generatedImageData! : currentItem.croppedImageData!,
      }
      return newItems
    })

    setShowGeneratedImage(newShowGenerated)
  }

  // If no items yet, show loading or redirect
  if (analyzedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading images...</p>
        </div>
      </div>
    )
  }

  // Show item form view after analysis
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto">
        {/* Page Header with Progress */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                const unsavedCount = analyzedItems.filter(i => !i.saved).length
                if (unsavedCount > 0) {
                  if (confirm(`${unsavedCount} unsaved item(s). Are you sure you want to leave?`)) {
                    navigate({ to: '/wardrobe' })
                  }
                } else {
                  navigate({ to: '/wardrobe' })
                }
              }}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Review Items
            </button>
            <button
              onClick={() => navigate({ to: '/wardrobe' })}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Done
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${((analyzedItems.filter(i => i.saved).length) / analyzedItems.length) * 100}%` }}
            />
          </div>

          {/* Save/Discard Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDiscard}
              className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center gap-2 border border-red-200 dark:border-red-800"
              disabled={createItem.isPending}
            >
              <Trash2 className="w-4 h-4" />
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={createItem.isPending || currentItem.isProcessing}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createItem.isPending
                ? 'Saving...'
                : currentItem.isProcessing
                ? 'Processing...'
                : showSuccess
                ? '✓ Saved!'
                : 'Save Item'}
            </button>
          </div>

          {currentItem.aiGenerated && (
            <div className="mt-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
              <Sparkles className="w-3 h-3" />
              {currentItem.isProcessing
                ? 'AI is generating product image...'
                : currentItem.needsAIGeneration
                ? 'Click the button to generate a clean product image'
                : 'AI-generated • Review and edit before saving'}
            </div>
          )}
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Item Thumbnails Navigation */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Items ({analyzedItems.filter(i => i.saved).length}/{analyzedItems.length} saved)
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {analyzedItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigateToItem(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentItemIndex
                      ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <img
                    src={item.imageData}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Processing spinner overlay */}
                  {item.isProcessing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    </div>
                  )}

                  {/* Saved checkmark */}
                  {item.saved && (
                    <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* AI Generation Available Badge */}
                  {item.needsAIGeneration && !item.isProcessing && !item.saved && (
                    <div className="absolute top-1 right-1">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Current item indicator */}
                  {index === currentItemIndex && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Item Photo */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            {currentItem.imageData && (
              <div className="relative w-full aspect-square">
                <img
                  src={currentItem.imageData}
                  alt="Item preview"
                  className="w-full h-full object-cover"
                />
                {currentItem.isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                    <div className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-lg">
                      {currentItem.processingMessage || 'Processing...'}
                    </div>
                  </div>
                )}
                {/* AI Generate Button - shown when needsAIGeneration is true */}
                {currentItem.needsAIGeneration && !currentItem.isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <button
                      onClick={handleGenerateAIImage}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                    >
                      <Sparkles className="w-5 h-5" />
                      Generate AI Image
                    </button>
                  </div>
                )}

                {currentItem.aiGenerated && !currentItem.isProcessing && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500/90 text-white text-xs rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {currentItem.generatedImageData && !showGeneratedImage ? 'Cropped' : 'AI Generated'}
                  </div>
                )}

                {/* Re-extract Metadata Button - always on top */}
                {!currentItem.isProcessing && currentItem.originalImageData && (
                  <button
                    onClick={handleReExtractMetadata}
                    className="absolute top-2 right-2 p-2 bg-blue-500/90 text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg"
                    title="Re-analyze original photo and replace all items from it"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}

                {/* Toggle Between Cropped and Generated Button */}
                {currentItem.croppedImageData && currentItem.generatedImageData && !currentItem.isProcessing && (
                  <button
                    onClick={handleToggleImageView}
                    className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-2 bg-gray-900/90 text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg text-sm"
                    title="Toggle between cropped and generated"
                  >
                    <Layers className="w-4 h-4" />
                    {showGeneratedImage ? 'Show Cropped' : 'Show Generated'}
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Item Details Form */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Item Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={currentItem.name}
                  onChange={(e) => updateCurrentItem({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Blue Denim Jacket"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={currentItem.category}
                  onChange={(e) => updateCurrentItem({ category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  value={currentItem.color}
                  onChange={(e) => updateCurrentItem({ color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={currentItem.size}
                    onChange={(e) => updateCurrentItem({ size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="M, L, XL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={currentItem.brand}
                    onChange={(e) => updateCurrentItem({ brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nike, Zara"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={currentItem.tags}
                  onChange={(e) => updateCurrentItem({ tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="#casual #summer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={currentItem.notes}
                  onChange={(e) => updateCurrentItem({ notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
