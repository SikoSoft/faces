/**
 * Automatically load all images from public/img directory
 */

import { getAutoDiscoveredImageUrls, imageCount } from './generated-images'

/**
 * Get all image URLs from public/img directory
 * Uses auto-generated list from build script
 */
export const getImageUrls = (): string[] => {
  const imageUrls = getAutoDiscoveredImageUrls()
  console.log(`Auto-discovered ${imageCount} images from public/img:`, imageUrls)
  return imageUrls
}

/**
 * Filter images by file extensions
 */
export const getImageUrlsByType = (extensions: string[] = ['jpg', 'jpeg', 'png', 'webp', 'avif']): string[] => {
  const allImages = getImageUrls()
  return allImages.filter(url => {
    const ext = url.split('.').pop()?.toLowerCase()
    return ext && extensions.includes(ext)
  })
}

/**
 * Get random image from the collection
 */
export const getRandomImageUrl = (): string => {
  const images = getImageUrls()
  if (images.length === 0) {
    throw new Error('No images found in public/img directory')
  }
  return images[Math.floor(Math.random() * images.length)]
}

/**
 * Validate that an image URL is accessible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get only valid/accessible images (useful for error handling)
 */
export const getValidImageUrls = async (): Promise<string[]> => {
  const allUrls = getImageUrls()
  const validationPromises = allUrls.map(async url => {
    const isValid = await validateImageUrl(url)
    return isValid ? url : null
  })
  
  const results = await Promise.all(validationPromises)
  return results.filter((url): url is string => url !== null)
}