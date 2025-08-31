# Faces Analyzer

A React TypeScript single-page application built with Vite that uses AI-powered face detection to analyze images and provide real-time feedback.

## Features

- **AI Face Detection**: Uses face-api.js for real-time face detection in images
- **Visual Face Overlay**: Automatically draws green rectangles around detected faces
- **Face Coordinates**: Returns precise x, y, width, height coordinates for each face
- **Confidence Scoring**: Shows detection confidence percentage for each face
- **Image Processing**: Creates canvas-based overlays with face bounding boxes
- **Dynamic Image Loading**: Automatically discovers all images in `public/img/`
- **Smart Analysis**: Displays count of detected faces with detailed information
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
3. **Visual Processing**: 
   - Canvas API draws green rectangles around detected faces
   - Original image is overlaid with bounding boxes and confidence scores
   - Processed image replaces the original in the display
4. **Data Display**: 
   - **Face Count**: Shows number of detected faces
   - **Coordinates**: Displays x, y position for each face
   - **Dimensions**: Shows width × height of each face rectangle
   - **Confidence**: AI confidence percentage for each detection
5. **Visual Feedback**: 
   - **X FACES DETECTED** (Green): Shows count of detected faces
   - **NO FACE FOUND** (Red): No faces were detected in the image
   - **Detecting faces...** (Blue): AI analysis in progress
   - **Initializing...** (Blue): Loading AI models
6. **Navigation**: Click "Next Image" to cycle through the image array
7. **Error Handling**: If model loading fails, a retry option is provided

## Dynamic Image Loading

The application automatically discovers and cycles through **all images** in the `public/img/` directory:

### Current Images:
- `according-to-science-jodie-comer-has-the-most-beautiful-v0-tjvnenep5fda1.webp`
- `amber-heeard-2.avif`
- `hoodie1.jpg`
- `posed-woman-with-beautiful-face.jpg`
- `rickspringfield-e1718921304910.webp`

### Adding New Images:
1. Drop any image files into `public/img/`
2. Run `npm run generate-images` to update the image list
3. Restart the dev server

### Supported Formats:
- JPG/JPEG, PNG, GIF, WebP, SVG, AVIF, BMP

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
- Works with local images (no CORS issues)

### Dynamic Image System
- **Build-time Generation**: `scripts/generate-image-list.js` scans `public/img/`
- **Auto-discovery**: Images are automatically added to the rotation
- **Type Safety**: Generated TypeScript definitions
- **Build Integration**: Image list updates automatically during build

### Performance
- Lightweight TinyFaceDetector model (~2MB)
- Efficient caching of loaded models
- Local image serving (faster than external URLs)
- Responsive UI with proper loading states
- Error recovery mechanisms

### Development Workflow
```bash
# Add new images
cp new-image.jpg public/img/

# Update image list
npm run generate-images

# Or build (includes image generation)
npm run build
```
