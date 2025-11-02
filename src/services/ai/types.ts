// AI Service Type Definitions - Google Gemini Integration

export interface AIGeneratedItem {
  name: string
  category: string
  color?: string
  tags?: string
  notes?: string
  confidence: number
  imageData: string // Base64 data URL
  metadata?: {
    style?: string
    occasion?: string
    season?: string
    material?: string
    pattern?: string
    secondaryColors?: string[]
  }
}

export interface AIProcessingProgress {
  stage: 'analyzing' | 'complete'
  progress: number // 0-100
  message: string
}

export type AIProgressCallback = (progress: AIProcessingProgress) => void
