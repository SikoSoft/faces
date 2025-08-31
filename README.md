# Faces Analyzer

A React TypeScript single-page application built with Vite that uses AI-powered face detection to analyze images and provide real-time feedback.

## Features

- **AI Face Detection**: Uses face-api.js for real-time face detection in images
- **Image Display**: Shows images from a predefined array of face image URLs
- **Smart Analysis**: Displays "FACE DETECTED" (green) or "NO FACE FOUND" (red) based on actual face detection
- **Next Image Button**: Cycles through the image array
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Shows initialization and analysis progress
- **Error Handling**: Graceful fallback for model loading failures

## Tech Stack

- **Vite**: Build tool and development server
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **face-api.js**: AI-powered face detection library
- **CSS**: Custom styling with animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/aaron/projects/faces
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## How It Works

1. **Initialization**: The app loads face-api.js models on startup (may take a few seconds)
2. **Face Detection**: Each image is analyzed using TinyFaceDetector for real-time face detection
3. **Visual Feedback**: 
   - **FACE DETECTED** (Green): At least one face was found in the image
   - **NO FACE FOUND** (Red): No faces were detected in the image
   - **Detecting faces...** (Blue): AI analysis in progress
   - **Initializing...** (Blue): Loading AI models
4. **Navigation**: Click "Next Image" to cycle through the image array
5. **Error Handling**: If model loading fails, a retry option is provided

## Image URLs

The application cycles through these three images:
- Amber Heard portrait
- Yael Shelbia portrait  
- Beautiful woman portrait from FreeRangeStock

## Architecture

- **State Management**: Uses React hooks (`useState`, `useEffect`)
- **AI Integration**: face-api.js with TinyFaceDetector for efficient face detection
- **Image Cycling**: Implements circular array navigation
- **Async Processing**: Real AI-powered image analysis with Promise-based functions
- **Model Loading**: Automatic CDN fallback for face detection models
- **Error Handling**: Comprehensive error handling for model loading and image analysis
- **TypeScript**: Full type safety throughout the application

## Technical Details

### Face Detection
- Uses **TinyFaceDetector** from face-api.js for optimal performance
- Models are loaded from CDN automatically
- Detection threshold set to 0.5 for balanced accuracy
- CORS-enabled image loading for external URLs

### Performance
- Lightweight TinyFaceDetector model (~2MB)
- Efficient caching of loaded models
- Responsive UI with proper loading states
- Error recovery mechanisms
