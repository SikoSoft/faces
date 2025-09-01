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
      // Load models for face detection and facial expression recognition
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ])
    } catch (localError) {
      console.log('Local models not found, loading from CDN...')
      // Fallback to CDN
      MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
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
 * Face detection result interface
 */
export interface FaceDetectionResult {
  hasFaces: boolean
  faces: FaceCoordinates[]
  imageElement: HTMLImageElement
}

export interface FaceCoordinates {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  expression?: string
  expressionConfidence?: number
}

/**
 * Detect faces in an image using face-api.js
 * @param imageUrl - URL of the image to analyze
 * @returns Promise<FaceDetectionResult> - Detection results with coordinates and expressions
 */
export const detectFaces = async (imageUrl: string): Promise<FaceDetectionResult> => {
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

    // Detect faces and expressions using TinyFaceDetector and FaceExpressionNet
    const detections = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      })
    ).withFaceExpressions()

    // Convert detections to coordinate format with expressions
    const faces: FaceCoordinates[] = detections.map(detection => {
      // Get the expression with highest confidence
      const expressions = detection.expressions
      const expressionEntries = Object.entries(expressions)
      const [expression, confidence] = expressionEntries.reduce((a, b) => 
        expressions[a[0] as keyof typeof expressions] > expressions[b[0] as keyof typeof expressions] ? a : b
      )

      return {
        x: detection.detection.box.x,
        y: detection.detection.box.y,
        width: detection.detection.box.width,
        height: detection.detection.box.height,
        confidence: detection.detection.score,
        expression: expression,
        expressionConfidence: confidence
      }
    })

    console.log(`Detected ${faces.length} face(s) in image: ${imageUrl}`)
    faces.forEach((face, index) => {
      console.log(`Face ${index + 1}: x=${Math.round(face.x)}, y=${Math.round(face.y)}, w=${Math.round(face.width)}, h=${Math.round(face.height)}, confidence=${face.confidence.toFixed(3)}, expression=${face.expression} (${(face.expressionConfidence! * 100).toFixed(1)}%)`)
    })
    
    return {
      hasFaces: faces.length > 0,
      faces,
      imageElement: img
    }
  } catch (error) {
    console.error('Face detection failed:', error)
    // Return empty result if detection fails
    return {
      hasFaces: false,
      faces: [],
      imageElement: new Image() // Empty image element
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use detectFaces instead
 */
export const detectFacesBoolean = async (imageUrl: string): Promise<boolean> => {
  const result = await detectFaces(imageUrl)
  return result.hasFaces
}

/**
 * Check if face-api.js is initialized
 */
export const isFaceAPIInitialized = (): boolean => {
  return isInitialized
}
