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
 * Crop an image based on pixel bounding box coordinates
 */
async function cropImageByBoundingBox(
  imageDataUrl: string,
  boundingBox: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log('✂️ Cropping image with bounding box (pixels):', boundingBox)

      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            throw new Error('Failed to get canvas context')
          }

          // Use pixel coordinates directly, just clamp to image bounds
          const cropX = Math.max(0, Math.floor(boundingBox.x))
          const cropY = Math.max(0, Math.floor(boundingBox.y))
          const cropWidth = Math.min(
            img.width - cropX,
            Math.ceil(boundingBox.width)
          )
          const cropHeight = Math.min(
            img.height - cropY,
            Math.ceil(boundingBox.height)
          )

          console.log(`📐 Image size: ${img.width}x${img.height}px`)
          console.log(`📏 Crop region: (${cropX}, ${cropY}) ${cropWidth}x${cropHeight}px`)
          console.log(`📊 Coverage: ${((cropWidth * cropHeight) / (img.width * img.height) * 100).toFixed(1)}% of original`)

          // Validate crop dimensions
          if (cropWidth <= 0 || cropHeight <= 0) {
            throw new Error('Invalid crop dimensions')
          }

          // Set canvas to cropped dimensions
          canvas.width = cropWidth
          canvas.height = cropHeight

          // Draw the cropped portion
          ctx.drawImage(
            img,
            cropX, cropY, cropWidth, cropHeight,  // Source rectangle
            0, 0, cropWidth, cropHeight            // Destination rectangle
          )

          // Convert to data URL
          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95)
          console.log('✅ Image cropped successfully:', croppedDataUrl.length, 'bytes')
          resolve(croppedDataUrl)
        } catch (error) {
          console.error('❌ Error during cropping operation:', error)
          reject(error)
        }
      }

      img.onerror = () => {
        const error = new Error('Failed to load image for cropping')
        console.error('❌', error.message)
        reject(error)
      }

      img.src = imageDataUrl
    } catch (error) {
      console.error('❌ Error setting up image crop:', error)
      reject(error)
    }
  })
}

/**
 * Generate a clean product image for a garment using Gemini 2.5 Flash Image
 * Input is ONLY the cropped image - no metadata to avoid bias
 */
async function generateCleanProductImage(
  croppedImageData: string,
  progressCallback?: (message: string, progress: number) => void
): Promise<string> {
  try {
    console.log('🎨 Starting unbiased image generation from cropped visual input only')

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
    })

    // Generic prompt - no metadata, purely visual extraction
    const prompt = `Extract the clothing/footwear item from this image and present it as a clean e-commerce product photo.

Remove any background, people, or context. Display the item centered on pure white background. High-resolution, professional lighting, suitable for online fashion catalog.

General Requirements:
- Remove background and any people/models completely
- Pure white background (#FFFFFF)
- Center in square (1:1) format
- Professional catalog-quality result
- Keep all details, textures, and patterns exactly as they appear

IMPORTANT - Product Type Specific Angles:
- For SHOES/FOOTWEAR (sneakers, boots, sandals, heels, etc.):
  * If it's a PAIR of shoes: Arrange them side-by-side at a 3/4 angle view (not flat top-down)
  * Position: Slightly angled toward camera showing both the side profile and front/toe area
  * Best showcase angle: 30-45 degree angle that reveals shape, sole, and design details
  * Keep BOTH shoes visible if it's a pair
  * This angle is standard for e-commerce shoe photography and best showcases the product

- For CLOTHING (shirts, pants, jackets, dresses, etc.):
  * Preserve natural garment shape with realistic fabric folds and drape
  * Front-facing flat lay or hanging presentation
  * Natural fabric texture and structure visible`

    console.log('📤 Sending image generation request with 1:1 aspect ratio...')

    // Generate with 1:1 aspect ratio configuration
    const generationRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: croppedImageData.split(',')[1],
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
        temperature: 0, // Zero creativity - pure extraction and preservation
        topK: 1,
        topP: 1,
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

        // Validate the generated image quality
        await new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const aspectRatio = img.width / img.height
            const isSquare = Math.abs(aspectRatio - 1) < 0.1

            console.log('📐 Image dimensions:', img.width, 'x', img.height, `(${isSquare ? '✅ Square!' : '⚠️ Not square'})`)

            if (!isSquare) {
              console.warn('⚠️ Generated image is not square - aspect ratio:', aspectRatio.toFixed(2))
            }

            if (img.width < 512 || img.height < 512) {
              console.warn('⚠️ Generated image resolution too low:', img.width, 'x', img.height)
            } else {
              console.log('✅ Image quality validated')
            }

            resolve()
          }
          img.onerror = () => {
            console.error('❌ Failed to load generated image for validation')
            reject(new Error('Image validation failed'))
          }
          img.src = generatedImage
        })

        return generatedImage
      }
    }

    console.warn('⚠️ No image in response, using cropped input')
    // Fallback to cropped input if generation failed
    return croppedImageData
  } catch (error) {
    console.error('❌ Image generation failed, using cropped input:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return croppedImageData
  }
}

/**
 * Extract metadata for multiple garments WITHOUT generating images
 * Returns metadata with bounding boxes for each detected garment
 */
export async function extractMultipleGarmentsMetadata(
  imageFile: File,
  progressCallback?: (message: string, progress: number) => void
): Promise<Array<any>> {
  try {
    progressCallback?.('Initializing Gemini AI...', 5)

    const ai = initializeGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0,
        topK: 1,
        topP: 1,
        maxOutputTokens: 8192,
      },
    })

    progressCallback?.('Converting image...', 15)
    const imageData = await fileToBase64(imageFile)

    progressCallback?.('Analyzing photo for garments...', 30)

    const multiGarmentPrompt = `You are an expert fashion AI and computer vision assistant.

Your task is to analyze the provided image and identify ALL distinct garments. For each garment, provide metadata and a precise bounding box in PIXELS.

Format your response as a JSON array. Each object represents ONE garment and must follow this schema:

[
  {
    "name": "string (garment type: 'T-Shirt', 'Jeans', 'Sneakers', etc.)",
    "category": "string (Top|Bottom|Dress|Outerwear|Shoes|Accessories|Activewear|Other)",
    "color": "string (primary color)",
    "secondaryColors": ["array of additional colors or empty"],
    "material": "string (cotton|denim|wool|leather|polyester|unknown)",
    "pattern": "string (solid|striped|floral|checkered|polka-dot|geometric)",
    "style": "string (casual|formal|sporty|elegant|business|vintage)",
    "occasion": "string (everyday|work|party|gym|formal-event)",
    "season": "string (summer|winter|spring|fall|all-season)",
    "tags": "string (space-separated hashtags: '#casual #blue #summer')",
    "notes": "string (brief description of unique features)",
    "confidence": number (0.0-1.0, your confidence in this detection),
    "boundingBox": {
      "x": integer (left edge in pixels),
      "y": integer (top edge in pixels),
      "width": integer (box width in pixels),
      "height": integer (box height in pixels)
    }
  }
]

Instructions:
• Identify each visible garment separately
• PAIRS (shoes, gloves, socks): ONE item with ONE box encompassing BOTH pieces
• Bounding boxes: Add 10-15% padding around each garment
• All pixel values must be positive integers
• name: Simple type only (no colors/brands in the name)
• confidence: Be honest about detection quality

Examples:
• T-shirt: {"x": 152, "y": 158, "width": 496, "height": 224}
• Shoe pair: {"x": 3, "y": 319, "width": 794, "height": 112}
• Dress: {"x": 151, "y": 53, "width": 298, "height": 694}

Return ONLY the JSON array.`

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: imageFile.type,
        },
      },
      multiGarmentPrompt,
    ])

    progressCallback?.('Processing response...', 80)

    const response = await result.response
    console.log('📦 Full response object:', response)
    console.log('🔍 Response candidates:', response.candidates)

    const text = response.text()
    console.log('🔍 Raw Gemini response:', text)
    console.log('📏 Response length:', text.length)

    // Check for blocked content
    if (!text || text.length === 0) {
      console.error('❌ Empty response from Gemini')
      console.error('Response object:', JSON.stringify(response, null, 2))

      // Check if content was blocked
      const candidate = response.candidates?.[0]
      if (candidate?.finishReason) {
        console.error('Finish reason:', candidate.finishReason)
      }
      if (candidate?.safetyRatings) {
        console.error('Safety ratings:', candidate.safetyRatings)
      }

      throw new Error('Gemini returned empty response. Check console for details.')
    }

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('❌ Failed to extract JSON array from response')
      console.error('Response text:', text.substring(0, 500))
      throw new Error(`Invalid response format from Gemini. Response: ${text.substring(0, 200)}`)
    }

    console.log('✅ Extracted JSON:', jsonMatch[0].substring(0, 200))
    const garments = JSON.parse(jsonMatch[0])
    console.log(`✅ Parsed ${garments.length} garments`)

    progressCallback?.('Metadata extraction complete!', 100)

    // Return garments with metadata including bounding boxes
    return garments.map((garment: any) => ({
      name: garment.name || 'Clothing Item',
      category: garment.category || 'Other',
      color: garment.color || 'Unknown',
      tags: garment.tags || '',
      notes: garment.notes || '',
      confidence: garment.confidence || 0.9,
      metadata: {
        style: garment.style,
        occasion: garment.occasion,
        season: garment.season,
        material: garment.material,
        pattern: garment.pattern,
        secondaryColors: garment.secondaryColors,
        boundingBox: garment.boundingBox,
      },
    }))
  } catch (error) {
    console.error('Metadata extraction failed:', error)
    throw error
  }
}

/**
 * Generate clean product image from a data URL (cropped image)
 */
export async function generateCleanProductImageFromData(
  imageDataUrl: string,
  progressCallback?: (message: string, progress: number) => void
): Promise<string> {
  try {
    progressCallback?.('Generating clean product image...', 10)
    return await generateCleanProductImage(imageDataUrl, progressCallback)
  } catch (error) {
    console.error('Image generation failed:', error)
    // Return original on failure
    return imageDataUrl
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
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0,
        topK: 1,
        topP: 1,
        maxOutputTokens: 8192, // More tokens for multiple items
      },
    })

    progressCallback?.('Converting image...', 15)
    const imageData = await fileToBase64(imageFile)

    progressCallback?.('Analyzing photo for garments...', 30)

    const multiGarmentPrompt = `You are an expert fashion AI and computer vision assistant.

Your task is to analyze the provided image and identify ALL distinct garments. For each garment, provide metadata and a precise bounding box in PIXELS.

Format your response as a JSON array. Each object represents ONE garment and must follow this schema:

[
  {
    "name": "string (garment type: 'T-Shirt', 'Jeans', 'Sneakers', etc.)",
    "category": "string (Top|Bottom|Dress|Outerwear|Shoes|Accessories|Activewear|Other)",
    "color": "string (primary color)",
    "secondaryColors": ["array of additional colors or empty"],
    "material": "string (cotton|denim|wool|leather|polyester|unknown)",
    "pattern": "string (solid|striped|floral|checkered|polka-dot|geometric)",
    "style": "string (casual|formal|sporty|elegant|business|vintage)",
    "occasion": "string (everyday|work|party|gym|formal-event)",
    "season": "string (summer|winter|spring|fall|all-season)",
    "tags": "string (space-separated hashtags: '#casual #blue #summer')",
    "notes": "string (brief description of unique features)",
    "confidence": number (0.0-1.0, your confidence in this detection),
    "boundingBox": {
      "x": integer (left edge in pixels),
      "y": integer (top edge in pixels),
      "width": integer (box width in pixels),
      "height": integer (box height in pixels)
    }
  }
]

Instructions:
• Identify each visible garment separately
• PAIRS (shoes, gloves, socks): ONE item with ONE box encompassing BOTH pieces
• Bounding boxes: Add 10-15% padding around each garment
• All pixel values must be positive integers
• name: Simple type only (no colors/brands in the name)
• confidence: Be honest about detection quality

Examples:
• T-shirt: {"x": 152, "y": 158, "width": 496, "height": 224}
• Shoe pair: {"x": 3, "y": 319, "width": 794, "height": 112}
• Dress: {"x": 151, "y": 53, "width": 298, "height": 694}

Return ONLY the JSON array.`

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

    console.log('🔍 Raw Gemini response:', text)
    console.log('📏 Response length:', text.length)

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('❌ Failed to extract JSON array from response')
      console.error('Response text:', text.substring(0, 500))
      throw new Error(`Invalid response format from Gemini. Response: ${text.substring(0, 200)}`)
    }

    console.log('✅ Extracted JSON:', jsonMatch[0].substring(0, 200))
    const garments = JSON.parse(jsonMatch[0])
    console.log(`✅ Parsed ${garments.length} garments`)
    const originalImageUrl = await fileToDataURL(imageFile)

    // Generate clean product images for each garment
    progressCallback?.('Generating product images...', 60)

    const items: AIGeneratedItem[] = []

    for (let i = 0; i < garments.length; i++) {
      const garment = garments[i]

      const progressPercent = 60 + Math.floor((i / garments.length) * 35)
      progressCallback?.(`Generating image ${i + 1}/${garments.length}...`, progressPercent)

      // Crop the image to focus on this specific garment if bounding box is available
      let croppedImageData = originalImageUrl

      if (garment.boundingBox) {
        try {
          console.log(`🎯 Cropping garment ${i + 1}: ${garment.name}`)
          console.log(`📦 Bounding box:`, garment.boundingBox)
          croppedImageData = await cropImageByBoundingBox(originalImageUrl, garment.boundingBox)
          console.log(`✅ Using cropped image for unbiased extraction`)
        } catch (cropError) {
          console.warn(`⚠️ Failed to crop image for garment ${i + 1}, using original:`, cropError)
          // Fall back to original image
          croppedImageData = originalImageUrl
        }
      } else {
        console.log(`ℹ️ No bounding box for garment ${i + 1}, using full image`)
      }

      // Generate clean product image using Gemini 2.5 Flash Image with retry logic
      // Input is ONLY the cropped image - no metadata to avoid bias
      let generatedImageData = croppedImageData
      let attempts = 0
      const maxAttempts = 2

      while (attempts < maxAttempts) {
        try {
          generatedImageData = await generateCleanProductImage(
            croppedImageData,
            progressCallback
          )
          break // Success!
        } catch (error) {
          attempts++
          console.warn(`🔄 Image generation attempt ${attempts} failed for garment ${i + 1}:`, error)
          if (attempts >= maxAttempts) {
            console.error('❌ All generation attempts failed, using cropped image')
            progressCallback?.(`⚠️ Using cropped image for item ${i + 1}`, progressPercent)
          } else {
            console.log(`🔄 Retrying... (attempt ${attempts + 1}/${maxAttempts})`)
            // Brief delay before retry
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

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
        temperature: 0, // Zero temperature for deterministic metadata extraction
        topK: 1,
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
