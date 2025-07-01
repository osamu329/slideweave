#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugLayout() {
  try {
    const tsxPath = path.join(__dirname, '../tsx/jsx-components.tsx');
    const tsxModule = await import(tsxPath);
    const slideData = tsxModule.default;
    
    if (slideData && slideData.slides && slideData.slides[0]) {
      const slide = slideData.slides[0];
      console.log('=== Slide Children Count ===');
      console.log('Total children:', slide.children.length);
      
      slide.children.forEach((child, i) => {
        console.log(`\nChild ${i}:`, child.type);
        if (child.style) {
          console.log('  Style:', JSON.stringify(child.style, null, 2));
        }
        if (child.children) {
          console.log('  Children count:', child.children.length);
          if (child.children.length > 0 && child.children[0].style && child.children[0].style.flexDirection === 'row') {
            console.log('  *** FOUND FLEX ROW CONTAINER ***');
            console.log('  Left child style:', JSON.stringify(child.children[0].children[0].style, null, 2));
            console.log('  Right child style:', JSON.stringify(child.children[0].children[1].style, null, 2));
          }
        }
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugLayout();