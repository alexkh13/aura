import { GoogleGenerativeAI } from '@google/generative-ai';

function getGeminiAPIKey() {
  return null;
}
let genAI = null;
let apiKey = getGeminiAPIKey();
function setGoogleAIToken(token) {
  apiKey = token;
  genAI = new GoogleGenerativeAI(token);
}
function initializeGemini() {
  if (!apiKey) {
    throw new Error("Google AI API key not set. Please add it in Settings \u2192 AI Settings.");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}
function buildGarmentDescription(garment) {
  const parts = [];
  const nameWords = garment.name?.toLowerCase() || "";
  const category = garment.category?.toLowerCase() || "";
  if (garment.pattern && garment.pattern.toLowerCase() !== "solid") {
    parts.push(garment.pattern);
  }
  if (garment.color && !nameWords.includes(garment.color.toLowerCase())) {
    parts.push(garment.color);
  }
  if (garment.material && garment.material.toLowerCase() !== "unknown" && !nameWords.includes(garment.material.toLowerCase())) {
    parts.push(garment.material);
  }
  if (garment.style && !nameWords.includes(garment.style.toLowerCase())) {
    parts.push(garment.style);
  }
  parts.push(garment.name || category || "clothing item");
  return parts.join(" ").trim();
}
async function cropImageByBoundingBox(imageDataUrl, boundingBox) {
  return new Promise((resolve, reject) => {
    try {
      console.log("\u2702\uFE0F Cropping image with bounding box:", boundingBox);
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Failed to get canvas context");
          }
          const cropX = Math.max(0, Math.floor(boundingBox.x * img.width));
          const cropY = Math.max(0, Math.floor(boundingBox.y * img.height));
          const cropWidth = Math.min(
            img.width - cropX,
            Math.ceil(boundingBox.width * img.width)
          );
          const cropHeight = Math.min(
            img.height - cropY,
            Math.ceil(boundingBox.height * img.height)
          );
          console.log(`\u{1F4D0} Crop dimensions: ${cropX},${cropY} ${cropWidth}x${cropHeight} from ${img.width}x${img.height}`);
          if (cropWidth <= 0 || cropHeight <= 0) {
            throw new Error("Invalid crop dimensions");
          }
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            // Source rectangle
            0,
            0,
            cropWidth,
            cropHeight
            // Destination rectangle
          );
          const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.95);
          console.log("\u2705 Image cropped successfully:", croppedDataUrl.length, "bytes");
          resolve(croppedDataUrl);
        } catch (error) {
          console.error("\u274C Error during cropping operation:", error);
          reject(error);
        }
      };
      img.onerror = () => {
        const error = new Error("Failed to load image for cropping");
        console.error("\u274C", error.message);
        reject(error);
      };
      img.src = imageDataUrl;
    } catch (error) {
      console.error("\u274C Error setting up image crop:", error);
      reject(error);
    }
  });
}
async function generateCleanProductImage(garmentDescription, originalImageData, garment, progressCallback) {
  try {
    console.log("\u{1F3A8} Starting image generation for:", garmentDescription);
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash-image"
    });
    const prompt = `Extract the clothing (${garmentDescription}) from this image and present it as a clean e-commerce product photo.

Remove the model's body completely. Keep the outfit in natural 3D shape, with realistic fabric folds, seams, and textures. Display the garment centered on pure white background. High-resolution, professional lighting, suitable for online fashion catalog.

Target item: ${garmentDescription}

Requirements:
- Remove background and model completely
- Preserve natural garment shape and drape
- Keep all fabric details, textures, and patterns exactly as they appear
- Center in square (1:1) format
- Pure white background
- Professional catalog-quality result`;
    console.log("\u{1F4E4} Sending image generation request with 1:1 aspect ratio...");
    const generationRequest = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: originalImageData.split(",")[1],
                mimeType: "image/jpeg"
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0,
        // Zero creativity - pure extraction and preservation
        topK: 1,
        topP: 1,
        responseModalities: ["Image"],
        // @ts-ignore - imageConfig not in type definitions yet
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    };
    console.log("\u{1F4D0} Request config:", JSON.stringify(generationRequest.generationConfig, null, 2));
    const result = await model.generateContent(generationRequest);
    const response = await result.response;
    console.log("\u{1F4E5} Response received:", response);
    const parts = response.candidates?.[0]?.content?.parts || [];
    console.log("\u{1F50D} Response parts:", parts.length, "parts");
    for (const part of parts) {
      console.log("Part type:", part);
      if (part.inlineData) {
        console.log("\u2705 Generated image found!");
        const generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        console.log("\u{1F4F8} Generated image size:", generatedImage.length, "bytes");
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            const isSquare = Math.abs(aspectRatio - 1) < 0.1;
            console.log("\u{1F4D0} Image dimensions:", img.width, "x", img.height, `(${isSquare ? "\u2705 Square!" : "\u26A0\uFE0F Not square"})`);
            if (!isSquare) {
              console.warn("\u26A0\uFE0F Generated image is not square - aspect ratio:", aspectRatio.toFixed(2));
            }
            if (img.width < 512 || img.height < 512) {
              console.warn("\u26A0\uFE0F Generated image resolution too low:", img.width, "x", img.height);
            } else {
              console.log("\u2705 Image quality validated");
            }
            resolve();
          };
          img.onerror = () => {
            console.error("\u274C Failed to load generated image for validation");
            reject(new Error("Image validation failed"));
          };
          img.src = generatedImage;
        });
        return generatedImage;
      }
    }
    console.warn("\u26A0\uFE0F No image in response, using original");
    return originalImageData;
  } catch (error) {
    console.error("\u274C Image generation failed, using original:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return originalImageData;
  }
}
async function extractMultipleGarments(imageFile, progressCallback) {
  try {
    progressCallback?.("Initializing Gemini AI...", 5);
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048
        // More tokens for multiple items
      }
    });
    progressCallback?.("Converting image...", 15);
    const imageData = await fileToBase64(imageFile);
    progressCallback?.("Analyzing photo for garments...", 30);
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
    "name": "Item type only without redundant descriptors (e.g., 'Denim Jacket', 'Cotton T-Shirt', 'Wool Sweater')",
    "category": "Top|Bottom|Dress|Outerwear|Shoes|Accessories|Activewear|Other",
    "color": "Primary color name",
    "secondaryColors": ["Additional colors if present"],
    "style": "casual|formal|sporty|elegant|business|bohemian|vintage|etc",
    "occasion": "everyday|work|party|gym|formal event|date|etc",
    "season": "summer|winter|spring|fall|all-season",
    "tags": "#tag1 #tag2 #tag3",
    "notes": "Brief description focusing on unique features, fit, or distinctive details",
    "material": "Specific fabric type (e.g., 'denim', 'cotton', 'wool', 'polyester', 'leather') or 'unknown'",
    "pattern": "solid|striped|floral|checkered|polka dot|geometric|abstract|etc",
    "confidence": 0.95,
    "boundingBox": {
      "x": 0.1,
      "y": 0.2,
      "width": 0.6,
      "height": 0.7
    }
  }
]

Guidelines:
- Keep "name" simple and focused on the garment type (avoid including color/material/style in the name)
- Be specific with material identification when visible
- Choose precise style and occasion descriptors
- Include relevant fashion tags that would help with search and organization
- IMPORTANT: Provide accurate bounding box coordinates for each garment
  - x, y: normalized coordinates (0.0-1.0) of the top-left corner
  - width, height: normalized dimensions (0.0-1.0) of the bounding box
  - Include some padding around the garment (about 10-15% extra space)
  - Ensure the bounding box captures the entire garment

Return ONLY the JSON array, no additional text.`;
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(",")[1],
          mimeType: imageFile.type
        }
      },
      multiGarmentPrompt
    ]);
    progressCallback?.("Processing response...", 50);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }
    const garments = JSON.parse(jsonMatch[0]);
    const originalImageUrl = await fileToDataURL(imageFile);
    progressCallback?.("Generating product images...", 60);
    const items = [];
    for (let i = 0; i < garments.length; i++) {
      const garment = garments[i];
      const garmentDescription = buildGarmentDescription(garment);
      const progressPercent = 60 + Math.floor(i / garments.length * 35);
      progressCallback?.(`Generating image ${i + 1}/${garments.length}...`, progressPercent);
      const ENABLE_CROPPING = true;
      let imageToProcess = originalImageUrl;
      if (ENABLE_CROPPING && garment.boundingBox) {
        try {
          console.log(`\u{1F3AF} Cropping garment ${i + 1}: ${garment.name}`);
          console.log(`\u{1F4E6} Bounding box:`, garment.boundingBox);
          imageToProcess = await cropImageByBoundingBox(originalImageUrl, garment.boundingBox);
          console.log(`\u2705 Using cropped image for focused extraction`);
        } catch (cropError) {
          console.warn(`\u26A0\uFE0F Failed to crop image for "${garment.name}", using original:`, cropError);
          imageToProcess = originalImageUrl;
        }
      } else {
        console.log(`\u2139\uFE0F ${!ENABLE_CROPPING ? "Cropping disabled" : "No bounding box"} for "${garment.name}", using full image`);
      }
      let generatedImageData = originalImageUrl;
      let attempts = 0;
      const maxAttempts = 2;
      while (attempts < maxAttempts) {
        try {
          generatedImageData = await generateCleanProductImage(
            garmentDescription,
            imageToProcess,
            garment,
            progressCallback
          );
          break;
        } catch (error) {
          attempts++;
          console.warn(`\u{1F504} Image generation attempt ${attempts} failed for "${garment.name}":`, error);
          if (attempts >= maxAttempts) {
            console.error("\u274C All generation attempts failed, using original image");
            progressCallback?.(`\u26A0\uFE0F Using original image for ${garment.name}`, progressPercent);
          } else {
            console.log(`\u{1F504} Retrying... (attempt ${attempts + 1}/${maxAttempts})`);
            await new Promise((resolve) => setTimeout(resolve, 1e3));
          }
        }
      }
      items.push({
        name: garment.name || `Clothing Item ${i + 1}`,
        category: garment.category || "Other",
        color: garment.color || "Unknown",
        tags: garment.tags || "",
        notes: garment.notes || "",
        confidence: garment.confidence || 0.9,
        imageData: generatedImageData,
        // Use AI-generated product image
        metadata: {
          style: garment.style,
          occasion: garment.occasion,
          season: garment.season,
          material: garment.material,
          pattern: garment.pattern,
          secondaryColors: garment.secondaryColors
        }
      });
    }
    progressCallback?.("Complete!", 100);
    return items;
  } catch (error) {
    console.error("Multi-garment extraction failed:", error);
    if (error instanceof Error && error.message.includes("API key")) {
      throw new Error("Please add your Google AI API key in Settings \u2192 AI Settings");
    }
    throw error;
  }
}
async function generateOutfitSuggestion(itemNames, itemColors, itemCategories) {
  try {
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512
      }
    });
    const itemsList = itemNames.map(
      (name, i) => `${i + 1}. ${name} (${itemCategories[i]}, ${itemColors[i]})`
    ).join("\n");
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

Be creative but practical. Consider the color combinations and item types when suggesting the outfit details.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Invalid response format from Gemini");
      return null;
    }
    const outfit = JSON.parse(jsonMatch[0]);
    return {
      name: outfit.name || "My Outfit",
      season: outfit.season || "All Season",
      occasion: outfit.occasion,
      weather: outfit.weather,
      tags: outfit.tags,
      notes: outfit.notes
    };
  } catch (error) {
    console.error("Outfit suggestion generation failed:", error);
    return null;
  }
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function fileToDataURL(file) {
  return fileToBase64(file);
}

export { extractMultipleGarments, generateOutfitSuggestion, setGoogleAIToken };
//# sourceMappingURL=gemini-C5p_oKPn.mjs.map
