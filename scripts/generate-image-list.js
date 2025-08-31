#!/usr/bin/env node

/**
 * Build script to automatically generate image list from public/img directory
 * Run this with: node scripts/generate-image-list.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Image file extensions to include
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp']

// Path to public/img directory
const imgDir = path.join(__dirname, '..', 'public', 'img')

// Path to generated file
const outputFile = path.join(__dirname, '..', 'src', 'generated-images.ts')

function generateImageList() {
  try {
    // Check if img directory exists
    if (!fs.existsSync(imgDir)) {
      console.warn('public/img directory does not exist')
      return
    }

    // Read all files in img directory
    const files = fs.readdirSync(imgDir)
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return IMAGE_EXTENSIONS.includes(ext) && !file.startsWith('.')
    })

    // Generate TypeScript file content
    const tsContent = `/**
 * Auto-generated file - DO NOT EDIT MANUALLY
 * Generated on: ${new Date().toISOString()}
 * Run 'node scripts/generate-image-list.js' to update
 */

export const AUTO_DISCOVERED_IMAGES = ${JSON.stringify(imageFiles, null, 2)}

export const getAutoDiscoveredImageUrls = (): string[] => {
  return AUTO_DISCOVERED_IMAGES.map(filename => \`/img/\${filename}\`)
}

export const imageCount = AUTO_DISCOVERED_IMAGES.length
`

    // Write the generated file
    fs.writeFileSync(outputFile, tsContent)
    
    console.log(`✅ Generated image list with ${imageFiles.length} images:`)
    imageFiles.forEach(file => console.log(`   - ${file}`))
    console.log(`📝 Saved to: ${outputFile}`)
    
  } catch (error) {
    console.error('❌ Error generating image list:', error)
    process.exit(1)
  }
}

// Run the generator
generateImageList()
