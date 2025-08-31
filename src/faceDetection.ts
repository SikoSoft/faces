import * as faceapi from 'face-api.js'

let isInitialized = false

/**
 * Initialize face-api.js with the necessary models
 */
export const initializeFaceAPI = async (): Promise<void> => {
  if (isInitialized) return

  try {
    // Try to load models from local public folder first, fallback to CDN
    let MODEL_URL = '/models'
    
    try {
      // Load only the models we need for face detection
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      ])
    } catch (localError) {
      console.log('Local models not found, loading from CDN...')
      // Fallback to CDN
      MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      ])
    }
    
    isInitialized = true
    console.log('Face-api.js models loaded successfully')
  } catch (error) {
    console.error('Failed to load face-api.js models:', error)
    throw error
  }
}

/**
 * Detect faces in an image using face-api.js
 * @param imageUrl - URL of the image to analyze
 * @returns Promise<boolean> - true if at least one face is detected, false otherwise
 */
export const detectFaces = async (imageUrl: string): Promise<boolean> => {
  if (!isInitialized) {
    throw new Error('Face-api.js not initialized. Call initializeFaceAPI() first.')
  }

  try {
    // Create an image element
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    // Load the image
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = (error) => reject(new Error(`Failed to load image: ${error}`))
      img.src = imageUrl
    })

    // Detect faces using TinyFaceDetector (faster and lighter)
    const detections = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      })
    )

    console.log(`Detected ${detections.length} face(s) in image: ${imageUrl}`)
    
    // Return true if at least one face is detected
    return detections.length > 0
  } catch (error) {
    console.error('Face detection failed:', error)
    // Return false if detection fails
    return false
  }
}

/**
 * Check if face-api.js is initialized
 */
export const isFaceAPIInitialized = (): boolean => {
  return isInitialized
}
