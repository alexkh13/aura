import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Camera, Check, X, Upload, Image as ImageIcon } from 'lucide-react'
import { useState, useRef } from 'react'
import { useCreateItem } from '@/hooks/useData'
import { useProfile } from '@/hooks/useProfile'

export const Route = createFileRoute('/items/new')({ component: AddNewItemPage })

function AddNewItemPage() {
  const navigate = useNavigate()
  const createItem = useCreateItem()
  const { activeProfile } = useProfile()
  const [showSuccess, setShowSuccess] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
    size: '',
    brand: '',
    tags: '',
    notes: '',
    hasPhoto: false
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size must be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPhotoPreview(result)
      setFormData({ ...formData, hasPhoto: true })
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setFormData({ ...formData, hasPhoto: false })
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.category.trim()) {
      alert('Please fill in the required fields: Name and Category')
      return
    }

    if (!activeProfile) {
      alert('No active profile selected. Please select or create a profile first.')
      return
    }

    try {
      await createItem.mutateAsync({
        name: formData.name.trim(),
        category: formData.category.trim(),
        hasPhoto: formData.hasPhoto,
        photo: photoPreview || '',
        color: formData.color.trim() || '',
        size: formData.size.trim() || '',
        brand: formData.brand.trim() || '',
        tags: formData.tags.trim() || '',
        notes: formData.notes.trim() || '',
        profileId: activeProfile.id
      })

      // Show success message
      setShowSuccess(true)

      // Navigate after a short delay
      setTimeout(() => {
        navigate({ to: '/wardrobe' })
      }, 1000)
    } catch (error) {
      console.error('Failed to create item:', error)
      alert(`Failed to save item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20" onKeyDown={handleKeyDown}>
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/wardrobe' })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Add New Item
            </button>
            <button
              onClick={handleSave}
              disabled={createItem.isPending || showSuccess}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createItem.isPending ? 'Saving...' : showSuccess ? 'Saved!' : 'Save'}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
            Press Cmd/Ctrl + Enter to save
          </p>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Step 1: Photo Upload */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 1: Photo Upload</h2>

            <div className="flex flex-col items-center gap-4">
              {photoPreview ? (
                <div className="relative w-full max-w-sm">
                  <img
                    src={photoPreview}
                    alt="Item preview"
                    className="w-full h-64 object-cover rounded-2xl border-2 border-blue-300 dark:border-blue-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-2 bg-red-500 dark:bg-red-600 text-white rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-sm">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-blue-300 dark:text-blue-700" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 w-full max-w-sm">
                {/* Hidden file inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {/* Camera button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 py-3 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Choose File
                </button>
              </div>

              {!photoPreview && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Max size: 5MB • Formats: JPG, PNG, WEBP
                </p>
              )}
            </div>
          </section>

          {/* Step 2: Item Details Form */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 2: Item Details Form</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Blue Denim Jacket"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors"
                >
                  <option value="">Select a category</option>
                  <option value="Top">Top</option>
                  <option value="Bottom">Bottom</option>
                  <option value="Dress">Dress</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Activewear">Activewear</option>
                  <option value="Swimwear">Swimwear</option>
                  <option value="Underwear">Underwear</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Blue, Red, Black"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ ...formData, size })}
                      className={`py-2 px-1 text-sm rounded-lg border transition-colors ${
                        formData.size === size
                          ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom size"
                  value={!['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].includes(formData.size) ? formData.size : ''}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 mt-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="e.g., Nike, Zara, Levi's"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="e.g., #casual #summer"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Add notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">Item saved successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
