import { useState, useEffect } from 'react'
import './App.css'
import { initializeFaceAPI, detectFaces, isFaceAPIInitialized } from './faceDetection'

// Array of image URLs as specified
const IMAGE_URLS = [
  'https://hips.hearstapps.com/goodhousekeeping-uk/main/embedded/32567/amber-heeard-2.jpg',
  'https://c.ndtvimg.com/2021-01/hgh0aplo_yael-shelbia_625x300_22_January_21.jpg',
  'https://freerangestock.com/sample/137944/posed-woman-with-beautiful-face.jpg'
]

function App() {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [analysisResult, setAnalysisResult] = useState<boolean | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  const [initError, setInitError] = useState<string | null>(null)

  // Async analyze function that uses face-api.js to detect faces
  const analyzeImage = async (imageUrl: string): Promise<boolean> => {
    try {
      if (!isFaceAPIInitialized()) {
        throw new Error('Face-api.js not initialized')
      }
      
      // Use face-api.js to detect faces in the image
      const hasFaces = await detectFaces(imageUrl)
      return hasFaces
    } catch (error) {
      console.error('Face analysis failed:', error)
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
      
      {/* Image display area */}
      <div className="image-container">
        {currentImageUrl && (
          <img 
            src={currentImageUrl} 
            alt="Analyzed face" 
            className="main-image"
            onError={() => console.error('Failed to load image:', currentImageUrl)}
          />
        )}
      </div>

      {/* YES/NO indicator */}
      <div className="indicator-container">
        {isAnalyzing ? (
          <div className="indicator analyzing">Detecting faces...</div>
        ) : (
          <div className={`indicator ${analysisResult === true ? 'yes' : analysisResult === false ? 'no' : 'neutral'}`}>
            {analysisResult === true ? 'FACE DETECTED' : analysisResult === false ? 'NO FACE FOUND' : 'Ready'}
          </div>
        )}
      </div>

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
