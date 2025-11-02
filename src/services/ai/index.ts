// Main AI Service - Google Gemini Integration

import type {
  AIGeneratedItem,
  AIProcessingProgress,
  AIProgressCallback,
} from './types'

/**
 * Extract multiple garments from image using Gemini AI
 */
export async function extractGarmentsFromImage(
  imageFile: File,
  progressCallback?: AIProgressCallback
): Promise<AIGeneratedItem[]> {
  try {
    const { extractMultipleGarments } = await import('./gemini')

    const items = await extractMultipleGarments(imageFile, (message, progress) => {
      progressCallback?.({
        stage: progress < 100 ? 'analyzing' : 'complete',
        progress,
        message,
      })
    })

    return items
  } catch (error) {
    console.error('Garment extraction failed:', error)
    throw error
  }
}

/**
 * Check if Gemini API is configured
 */
export async function isGeminiConfigured(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('google_ai_token')
  return !!token
}

/**
 * Generate outfit details from items using Gemini AI
 */
export async function generateOutfitDetails(
  itemNames: string[],
  itemColors: string[],
  itemCategories: string[]
): Promise<{
  name: string
  season: string
  occasion?: string
  weather?: string
  tags?: string
  notes?: string
} | null> {
  try {
    const { generateOutfitSuggestion } = await import('./gemini')
    const outfit = await generateOutfitSuggestion(itemNames, itemColors, itemCategories)
    return outfit
  } catch (error) {
    console.error('Outfit generation failed:', error)
    return null
  }
}

// Re-export types
export type {
  AIGeneratedItem,
  AIProcessingProgress,
  AIProgressCallback,
}
