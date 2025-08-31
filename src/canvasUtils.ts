/**
 * Canvas utilities for drawing face detection overlays
 */

import { FaceCoordinates } from './faceDetection'

export interface CanvasDrawOptions {
  strokeColor?: string
  strokeWidth?: number
  fillColor?: string
  showConfidence?: boolean
  fontSize?: number
  fontFamily?: string
}

/**
 * Create a canvas with face detection rectangles drawn over the original image
 */
export const createFaceOverlayCanvas = (
  imageElement: HTMLImageElement,
  faces: FaceCoordinates[],
  options: CanvasDrawOptions = {}
): HTMLCanvasElement => {
  const {
    strokeColor = '#00ff00',
    strokeWidth = 3,
    fillColor = 'rgba(0, 255, 0, 0.1)',
    showConfidence = true,
    fontSize = 14,
    fontFamily = 'Arial, sans-serif'
  } = options

  // Create canvas with same dimensions as image
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas')
  }

  // Set canvas size to match image
  canvas.width = imageElement.naturalWidth
  canvas.height = imageElement.naturalHeight

  // Draw the original image
  ctx.drawImage(imageElement, 0, 0)

  // Draw face rectangles
  faces.forEach((face, index) => {
    // Draw filled rectangle (optional background)
    if (fillColor) {
      ctx.fillStyle = fillColor
      ctx.fillRect(face.x, face.y, face.width, face.height)
    }

    // Draw rectangle border
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.strokeRect(face.x, face.y, face.width, face.height)

    // Draw confidence score and face number
    if (showConfidence) {
      const text = `Face ${index + 1}: ${(face.confidence * 100).toFixed(1)}%`
      const textY = face.y > 20 ? face.y - 5 : face.y + face.height + 20

      // Draw text background
      ctx.font = `${fontSize}px ${fontFamily}`
      const textMetrics = ctx.measureText(text)
      const textWidth = textMetrics.width
      const textHeight = fontSize

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(face.x, textY - textHeight, textWidth + 8, textHeight + 4)

      // Draw text
      ctx.fillStyle = '#ffffff'
      ctx.fillText(text, face.x + 4, textY - 2)
    }
  })

  return canvas
}

/**
 * Convert canvas to data URL for display in img element
 */
export const canvasToDataUrl = (canvas: HTMLCanvasElement, format: string = 'image/png'): string => {
  return canvas.toDataURL(format)
}

/**
 * Create a processed image URL with face detection overlays
 */
export const createFaceDetectionImageUrl = (
  imageElement: HTMLImageElement,
  faces: FaceCoordinates[],
  options?: CanvasDrawOptions
): string => {
  const canvas = createFaceOverlayCanvas(imageElement, faces, options)
  return canvasToDataUrl(canvas)
}

/**
 * Download the processed image with face detection overlays
 */
export const downloadFaceDetectionImage = (
  imageElement: HTMLImageElement,
  faces: FaceCoordinates[],
  filename: string = 'face-detection-result.png',
  options?: CanvasDrawOptions
): void => {
  const canvas = createFaceOverlayCanvas(imageElement, faces, options)
  const dataUrl = canvasToDataUrl(canvas)
  
  // Create download link
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Get optimal text position to avoid overlapping with face rectangle
 */
export const getOptimalTextPosition = (
  face: FaceCoordinates,
  canvasWidth: number,
  canvasHeight: number,
  textWidth: number,
  textHeight: number
): { x: number; y: number } => {
  // Try to place text above the face rectangle
  if (face.y > textHeight + 10) {
    return { x: face.x, y: face.y - 5 }
  }
  
  // If not enough space above, place below
  if (face.y + face.height + textHeight + 10 < canvasHeight) {
    return { x: face.x, y: face.y + face.height + textHeight + 5 }
  }
  
  // If not enough space above or below, place to the side
  if (face.x + face.width + textWidth + 10 < canvasWidth) {
    return { x: face.x + face.width + 5, y: face.y + textHeight }
  }
  
  // Last resort: place inside the rectangle
  return { x: face.x + 5, y: face.y + textHeight + 5 }
}
