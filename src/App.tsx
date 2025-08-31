import { useState, useEffect } from 'react'
import './App.css'
import { initializeFaceAPI, detectFaces, isFaceAPIInitialized, FaceDetectionResult, FaceCoordinates } from './faceDetection'
import { getImageUrls } from './imageLoader'
import { createFaceDetectionImageUrl } from './canvasUtils'

// Get image URLs dynamically from public/img directory
const IMAGE_URLS = getImageUrls()

function App() {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [analysisResult, setAnalysisResult] = useState<boolean | null>(null)
  const [faceCoordinates, setFaceCoordinates] = useState<FaceCoordinates[]>([])
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  const [initError, setInitError] = useState<string | null>(null)

  // Async analyze function that uses face-api.js to detect faces and create overlay
  const analyzeImage = async (imageUrl: string): Promise<boolean> => {
    try {
      if (!isFaceAPIInitialized()) {
        throw new Error('Face-api.js not initialized')
      }
      
      // Use face-api.js to detect faces in the image
      const result: FaceDetectionResult = await detectFaces(imageUrl)
      
      // Update state with face coordinates
      setFaceCoordinates(result.faces)
      
      // Create processed image with face rectangles
      if (result.hasFaces && result.faces.length > 0) {
        const overlayImageUrl = createFaceDetectionImageUrl(
          result.imageElement,
          result.faces,
          {
            strokeColor: '#00ff00',
            strokeWidth: 4,
            fillColor: 'rgba(0, 255, 0, 0.1)',
            showConfidence: true,
            fontSize: 16
          }
        )
        setProcessedImageUrl(overlayImageUrl)
      } else {
        // No faces found, use original image
        setProcessedImageUrl('')
      }
      
      return result.hasFaces
    } catch (error) {
      console.error('Face analysis failed:', error)
      setFaceCoordinates([])
      setProcessedImageUrl('')
      return false
    }
  }

  // Function to get the next image URL from the array
  const getImageUrl = (): string => {
    const url = IMAGE_URLS[currentImageIndex]
    setCurrentImageIndex((prev) => (prev + 1) % IMAGE_URLS.length)
    return url
  }

  // Handle image URL change and trigger analysis
  const handleImageChange = async (newImageUrl: string) => {
    setCurrentImageUrl(newImageUrl)
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    try {
      const result = await analyzeImage(newImageUrl)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      setAnalysisResult(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle next image button click
  const handleNextImage = () => {
    if (!isInitializing && !initError) {
      const nextUrl = getImageUrl()
      handleImageChange(nextUrl)
    }
  }

  // Initialize face-api.js and load first image
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true)
        setInitError(null)
        
        // Check if we have any images
        if (IMAGE_URLS.length === 0) {
          throw new Error('No images found in public/img directory. Please add some image files.')
        }
        
        // Initialize face-api.js
        await initializeFaceAPI()
        
        // Load first image
        const initialUrl = getImageUrl()
        await handleImageChange(initialUrl)
        
        setIsInitializing(false)
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setInitError(error instanceof Error ? error.message : 'Initialization failed')
        setIsInitializing(false)
      }
    }

    initializeApp()
  }, [])

  // Show initialization screen
  if (isInitializing) {
    return (
      <div className="app">
        <h1>Face Analyzer</h1>
        <div className="indicator-container">
          <div className="indicator analyzing">Initializing face detection models...</div>
        </div>
        <p>Loading AI models for face detection. This may take a moment.</p>
      </div>
    )
  }

  // Show error screen
  if (initError) {
    return (
      <div className="app">
        <h1>Face Analyzer</h1>
        <div className="indicator-container">
          <div className="indicator error">Initialization Failed</div>
        </div>
        <p>Failed to load face detection models: {initError}</p>
        <button 
          className="next-button" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Face Analyzer</h1>
      <p>AI-powered face detection using face-api.js</p>
      <p className="image-count">Found {IMAGE_URLS.length} images in public/img/</p>
      
      {/* Image display area */}
      <div className="image-container">
        {currentImageUrl && (
          <img 
            src={processedImageUrl || currentImageUrl} 
            alt="Face analysis result" 
            className="main-image"
            onError={() => console.error('Failed to load image:', processedImageUrl || currentImageUrl)}
          />
        )}
      </div>

      {/* YES/NO indicator */}
      <div className="indicator-container">
        {isAnalyzing ? (
          <div className="indicator analyzing">Detecting faces...</div>
        ) : (
          <div className={`indicator ${analysisResult === true ? 'yes' : analysisResult === false ? 'no' : 'neutral'}`}>
            {analysisResult === true ? `${faceCoordinates.length} FACE${faceCoordinates.length !== 1 ? 'S' : ''} DETECTED` : analysisResult === false ? 'NO FACE FOUND' : 'Ready'}
          </div>
        )}
      </div>

      {/* Face details */}
      {faceCoordinates.length > 0 && (
        <div className="face-details">
          <h3>Detected Faces:</h3>
          <div className="face-list">
            {faceCoordinates.map((face, index) => (
              <div key={index} className="face-item">
                <span className="face-number">Face {index + 1}:</span>
                <span className="face-coords">
                  Position: ({Math.round(face.x)}, {Math.round(face.y)})
                </span>
                <span className="face-size">
                  Size: {Math.round(face.width)} × {Math.round(face.height)}
                </span>
                <span className="face-confidence">
                  Confidence: {(face.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next image button */}
      <button 
        className="next-button" 
        onClick={handleNextImage}
        disabled={isAnalyzing}
      >
        Next Image
      </button>
    </div>
  )
}

export default App
