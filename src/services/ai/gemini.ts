// Google Gemini AI Service - Multimodal Clothing Analysis
// Uses Gemini for image understanding and metadata extraction

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIGeneratedItem } from './types'

// Load API key from localStorage
function getGeminiAPIKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('google_ai_token') || null
}

let genAI: GoogleGenerativeAI | null = null
let apiKey: string | null = getGeminiAPIKey()

export function setGoogleAIToken(token: string) {
  apiKey = token
  genAI = new GoogleGenerativeAI(token)
  if (typeof window !== 'undefined') {
    localStorage.setItem('google_ai_token', token)
  }
}

// Initialize Gemini
function initializeGemini(): GoogleGenerativeAI {
  if (!apiKey) {
    throw new Error('Google AI API key not set. Please add it in Settings → AI Settings.')
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }

  return genAI
}

// Master prompt for clothing analysis
const CLOTHING_ANALYSIS_PROMPT = `You are an expert fashion analyst and wardrobe organizer. Analyze this image of clothing and extract detailed metadata.

Your task:
1. Identify what type of clothing item this is
2. Determine the primary color(s)
3. Identify the style and occasion
4. Suggest relevant tags
5. Provide a brief, useful description

Respond ONLY with valid JSON in this exact format:
{
  "name": "Concise item name (e.g., 'Navy Blue Denim Jacket')",
  "category": "One of: Top, Bottom, Dress, Outerwear, Shoes, Accessories, Activewear, Swimwear, Underwear, Other",
  "color": "Primary color name (e.g., 'Blue', 'Black', 'Multicolor')",
  "secondaryColors": ["Array of additional colors if any"],
  "style": "Style descriptor (e.g., 'casual', 'formal', 'sporty', 'elegant')",
  "occasion": "Best occasion (e.g., 'everyday', 'work', 'party', 'gym')",
  "season": "Best season (e.g., 'all-season', 'summer', 'winter', 'spring', 'fall')",
  "tags": "Comma-separated hashtags (e.g., '#casual #denim #blue #jacket')",
  "notes": "Brief description highlighting key features",
  "material": "Fabric type if identifiable (e.g., 'denim', 'cotton', 'leather', 'unknown')",
  "pattern": "Pattern if any (e.g., 'solid', 'striped', 'floral', 'checkered')",
  "confidence": 0.95
}

Important guidelines:
- Be accurate and specific
- Use standard color names
- Choose the most appropriate category
- Generate useful, searchable tags
- Keep descriptions concise (1-2 sentences)
- If you're analyzing a photo of a person wearing clothes, focus ONLY on the main garment visible
- If multiple items are visible, focus on the most prominent one
- Set confidence between 0.0 and 1.0 based on image quality and clarity

Return ONLY the JSON object, no additional text.`

/**
 * Generate a clean product image for a garment using Gemini 2.5 Flash Image
 */
async function generateCleanProductImage(
  garmentDescription: string,
  originalImageData: string,
  progressCallback?: (message: string, progress: number) => void
): Promise<string> {
  try {
    console.log('🎨 Starting image generation for:', garmentDescription)

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
    })

    // Create prompt for clean product shot based on the original image
    const prompt = `Edit this clothing image to create a professional square (1:1 ratio) product photo.

Target item: ${garmentDescription}

Edits needed:
- Remove the background and replace with clean white/neutral background
- Remove any people from the image
- Keep ONLY the clothing item: ${garmentDescription}
- IMPORTANT: Center the garment perfectly in the middle of the square frame
- IMPORTANT: Make the image square (1:1 aspect ratio)
- Position the item so it fills about 70-80% of the frame
- Ensure professional studio lighting from all angles
- Create a clean product catalog style photo
- Maintain the original garment's appearance, colors, and details
- The garment should be the absolute center focus, perfectly balanced in the square frame`

    console.log('📤 Sending image generation request with 1:1 aspect ratio...')

    // Generate with 1:1 aspect ratio configuration
    const generationRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: originalImageData.split(',')[1],
                mimeType: 'image/jpeg',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        responseModalities: ['Image'],
        // @ts-ignore - imageConfig not in type definitions yet
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    }

    console.log('📐 Request config:', JSON.stringify(generationRequest.generationConfig, null, 2))

    const result = await model.generateContent(generationRequest)

    const response = await result.response
    console.log('📥 Response received:', response)

    // Extract generated image from response
    const parts = response.candidates?.[0]?.content?.parts || []
    console.log('🔍 Response parts:', parts.length, 'parts')

    for (const part of parts) {
      console.log('Part type:', part)
      if (part.inlineData) {
        console.log('✅ Generated image found!')
        // Convert to data URL
        const generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        console.log('📸 Generated image size:', generatedImage.length, 'bytes')

        // Verify dimensions by loading image
        const img = new Image()
        img.onload = () => {
          console.log('📐 Image dimensions:', img.width, 'x', img.height, `(${img.width === img.height ? '✅ Square!' : '❌ Not square'})`)
        }
        img.src = generatedImage

        return generatedImage
      }
    }

    console.warn('⚠️ No image in response, using original')
    // Fallback to original if generation failed
    return originalImageData
  } catch (error) {
    console.error('❌ Image generation failed, using original:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return originalImageData
  }
}

/**
 * Extract multiple garments from a single photo
 * Returns array of items, one for each detected garment with AI-generated product images
 */
export async function extractMultipleGarments(
  imageFile: File,
  progressCallback?: (message: string, progress: number) => void
): Promise<AIGeneratedItem[]> {
  try {
    progressCallback?.('Initializing Gemini AI...', 5)

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048, // More tokens for multiple items
      },
    })

    progressCallback?.('Converting image...', 15)
    const imageData = await fileToBase64(imageFile)

    progressCallback?.('Analyzing photo for garments...', 30)

    const multiGarmentPrompt = `You are a fashion expert analyzing this photo. Identify ALL separate clothing items visible in the image.

For EACH distinct garment, provide detailed metadata.

IMPORTANT:
- If this is a photo of a person wearing clothes, identify each visible garment separately (shirt, pants, jacket, etc.)
- If this is a flat-lay or product photo showing multiple items, analyze each one
- If only ONE item is visible, return an array with just that one item
- Do NOT combine multiple garments into one entry

Respond with a JSON array where each object represents ONE garment:

[
  {
    "name": "Concise item name",
    "category": "Top|Bottom|Dress|Outerwear|Shoes|Accessories|Activewear|Other",
    "color": "Primary color",
    "secondaryColors": ["Additional colors"],
    "style": "casual|formal|sporty|elegant|etc",
    "occasion": "everyday|work|party|gym|etc",
    "season": "summer|winter|spring|fall|all-season",
    "tags": "#tag1 #tag2 #tag3",
    "notes": "Brief description",
    "material": "fabric type or 'unknown'",
    "pattern": "solid|striped|floral|checkered|etc",
    "confidence": 0.95
  }
]

Return ONLY the JSON array, no additional text.`

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: imageFile.type,
        },
      },
      multiGarmentPrompt,
    ])

    progressCallback?.('Processing response...', 50)

    const response = await result.response
    const text = response.text()

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const garments = JSON.parse(jsonMatch[0])
    const originalImageUrl = await fileToDataURL(imageFile)

    // Generate clean product images for each garment
    progressCallback?.('Generating product images...', 60)

    const items: AIGeneratedItem[] = []

    for (let i = 0; i < garments.length; i++) {
      const garment = garments[i]
      const garmentDescription = `${garment.name}, ${garment.color} ${garment.material || ''} ${garment.pattern || ''} ${garment.category}`.trim()

      const progressPercent = 60 + Math.floor((i / garments.length) * 35)
      progressCallback?.(`Generating image ${i + 1}/${garments.length}...`, progressPercent)

      // Generate clean product image using Gemini 2.5 Flash Image
      const generatedImageData = await generateCleanProductImage(
        garmentDescription,
        originalImageUrl,
        progressCallback
      )

      items.push({
        name: garment.name || `Clothing Item ${i + 1}`,
        category: garment.category || 'Other',
        color: garment.color || 'Unknown',
        tags: garment.tags || '',
        notes: garment.notes || '',
        confidence: garment.confidence || 0.9,
        imageData: generatedImageData, // Use AI-generated product image
        metadata: {
          style: garment.style,
          occasion: garment.occasion,
          season: garment.season,
          material: garment.material,
          pattern: garment.pattern,
          secondaryColors: garment.secondaryColors,
        },
      })
    }

    progressCallback?.('Complete!', 100)
    return items
  } catch (error) {
    console.error('Multi-garment extraction failed:', error)

    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Please add your Google AI API key in Settings → AI Settings')
    }

    throw error
  }
}

/**
 * Analyze clothing image with Gemini's multimodal capabilities
 * (Single garment analysis - legacy support)
 */
export async function analyzeClothingWithGemini(
  imageFile: File,
  progressCallback?: (message: string, progress: number) => void
): Promise<AIGeneratedItem | null> {
  try {
    progressCallback?.('Initializing Gemini AI...', 10)

    const ai = initializeGemini()

    // Use Gemini 2.0 Flash for fast multimodal analysis
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash-latest',
      generationConfig: {
        temperature: 0.4, // Lower temperature for more consistent results
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    })

    progressCallback?.('Converting image...', 30)

    // Convert image to base64
    const imageData = await fileToBase64(imageFile)

    progressCallback?.('Analyzing clothing with Gemini...', 50)

    // Generate content with image and prompt
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
          mimeType: imageFile.type,
        },
      },
      CLOTHING_ANALYSIS_PROMPT,
    ])

    progressCallback?.('Processing response...', 80)

    const response = await result.response
    const text = response.text()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const analysis = JSON.parse(jsonMatch[0])

    progressCallback?.('Complete!', 100)

    // Convert to AIGeneratedItem format
    return {
      name: analysis.name || 'Clothing Item',
      category: analysis.category || 'Other',
      color: analysis.color || 'Unknown',
      tags: analysis.tags || '',
      notes: analysis.notes || '',
      confidence: analysis.confidence || 0.9,
      imageData: await fileToDataURL(imageFile),
      // Store additional metadata in notes
      metadata: {
        style: analysis.style,
        occasion: analysis.occasion,
        season: analysis.season,
        material: analysis.material,
        pattern: analysis.pattern,
        secondaryColors: analysis.secondaryColors,
      },
    }
  } catch (error) {
    console.error('Gemini analysis failed:', error)

    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Please add your Google AI API key in Settings → AI Settings')
    }

    return null
  }
}

/**
 * Batch analyze multiple clothing items
 */
export async function analyzeBatchWithGemini(
  imageFiles: File[],
  progressCallback?: (current: number, total: number, message: string) => void
): Promise<AIGeneratedItem[]> {
  const results: AIGeneratedItem[] = []

  for (let i = 0; i < imageFiles.length; i++) {
    progressCallback?.(i + 1, imageFiles.length, `Analyzing item ${i + 1} of ${imageFiles.length}...`)

    const item = await analyzeClothingWithGemini(imageFiles[i])
    if (item) {
      results.push(item)
    }
  }

  return results
}

/**
 * Advanced: Generate a clean clothing image using Gemini + Imagen
 * This removes backgrounds and creates a professional product shot
 */
export async function generateCleanClothingImage(
  imageFile: File,
  progressCallback?: (message: string, progress: number) => void
): Promise<Blob | null> {
  try {
    progressCallback?.('Analyzing original image...', 20)

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // First, analyze what the clothing looks like
    const imageData = await fileToBase64(imageFile)

    const analysisPrompt = `Describe this clothing item in detail for image generation. Focus on:
- Type of garment
- Colors
- Patterns/textures
- Style details
- Material appearance

Keep it concise (1-2 sentences) but descriptive.`

    const analysisResult = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: imageFile.type,
        },
      },
      analysisPrompt,
    ])

    const description = (await analysisResult.response).text()

    progressCallback?.('Generating clean product image...', 60)

    // Generate prompt for clean product shot
    const imageGenPrompt = `Professional product photography: ${description}.
Clean white background, centered, well-lit studio lighting, high quality, product catalog style, no person wearing it, flat lay or mannequin display.`

    // Note: Actual image generation would require Imagen API
    // For now, return null as this requires additional setup
    progressCallback?.('Image generation requires Imagen API (not yet implemented)', 100)

    return null
  } catch (error) {
    console.error('Image generation failed:', error)
    return null
  }
}

/**
 * Smart clothing extraction from person photos
 * Uses Gemini to identify clothing, then provides extraction
 */
export async function extractClothingFromPerson(
  imageFile: File,
  progressCallback?: (message: string, progress: number) => void
): Promise<AIGeneratedItem | null> {
  try {
    progressCallback?.('Analyzing photo...', 20)

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const imageData = await fileToBase64(imageFile)

    const extractionPrompt = `${CLOTHING_ANALYSIS_PROMPT}

IMPORTANT: This image shows a person wearing clothes. Focus on the main clothing item visible (usually upper body garment like shirt, jacket, or dress). Ignore the person's face and background.`

    progressCallback?.('Extracting clothing details...', 60)

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: imageFile.type,
        },
      },
      extractionPrompt,
    ])

    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    const analysis = JSON.parse(jsonMatch[0])

    progressCallback?.('Complete!', 100)

    return {
      name: analysis.name || 'Clothing Item',
      category: analysis.category || 'Other',
      color: analysis.color || 'Unknown',
      tags: analysis.tags || '',
      notes: `${analysis.notes || ''} (Extracted from photo)`,
      confidence: analysis.confidence || 0.85,
      imageData: await fileToDataURL(imageFile),
      metadata: {
        style: analysis.style,
        occasion: analysis.occasion,
        season: analysis.season,
        material: analysis.material,
        pattern: analysis.pattern,
        secondaryColors: analysis.secondaryColors,
      },
    }
  } catch (error) {
    console.error('Extraction failed:', error)
    return null
  }
}

/**
 * Check if Gemini API is configured and available
 */
export async function isGeminiAvailable(): Promise<boolean> {
  try {
    if (!apiKey) return false

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Quick test
    await model.generateContent('Test')
    return true
  } catch {
    return false
  }
}

/**
 * Generate outfit details from a collection of items
 */
export async function generateOutfitSuggestion(
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
    const ai = initializeGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
    })

    const itemsList = itemNames.map((name, i) =>
      `${i + 1}. ${name} (${itemCategories[i]}, ${itemColors[i]})`
    ).join('\n')

    const prompt = `You are a professional fashion stylist. I have the following wardrobe items:

${itemsList}

Create an outfit using these items and provide:
1. A creative, catchy name for this outfit
2. The best season for this outfit
3. The occasion this outfit is suitable for
4. Weather conditions this outfit works in
5. Relevant hashtags/tags
6. A brief styling note or description

Respond ONLY with valid JSON in this exact format:
{
  "name": "Outfit name (e.g., 'Casual Weekend Look', 'Business Chic', 'Summer Breeze')",
  "season": "Season (Spring/Summer, Fall, Winter, All Season)",
  "occasion": "Occasion (e.g., 'Casual', 'Work', 'Date Night', 'Party')",
  "weather": "Weather (e.g., 'Warm', 'Cool', 'Mild', 'Cold', 'Any')",
  "tags": "Hashtags (e.g., '#casual #comfortable #weekend')",
  "notes": "Styling tip or brief description (1-2 sentences)"
}

Be creative but practical. Consider the color combinations and item types when suggesting the outfit details.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Invalid response format from Gemini')
      return null
    }

    const outfit = JSON.parse(jsonMatch[0])
    return {
      name: outfit.name || 'My Outfit',
      season: outfit.season || 'All Season',
      occasion: outfit.occasion,
      weather: outfit.weather,
      tags: outfit.tags,
      notes: outfit.notes,
    }
  } catch (error) {
    console.error('Outfit suggestion generation failed:', error)
    return null
  }
}

// Helper functions
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function fileToDataURL(file: File): Promise<string> {
  return fileToBase64(file)
}
