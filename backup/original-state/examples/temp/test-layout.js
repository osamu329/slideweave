#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLayout() {
  try {
    const tsxPath = path.join(__dirname, '../tsx/jsx-components.tsx');
    const tsxModule = await import(tsxPath);
    const slideData = tsxModule.default;
    
    if (slideData && slideData.slides && slideData.slides[0]) {
      const slide = slideData.slides[0];
      console.log('=== Layout Analysis ===');
      console.log('Root slide style:', JSON.stringify(slide.style, null, 2));
      
      if (slide.children && slide.children[1] && slide.children[1].children && slide.children[1].children[0]) {
        const twoColumnContainer = slide.children[1].children[0];
        console.log('\n=== Two Column Container ===');
        console.log('Style:', JSON.stringify(twoColumnContainer.style, null, 2));
        
        if (twoColumnContainer.children) {
          console.log('Number of columns:', twoColumnContainer.children.length);
          twoColumnContainer.children.forEach((col, i) => {
            console.log(`\nColumn ${i + 1} style:`, JSON.stringify(col.style, null, 2));
          });
        }
      }
      
      // Check if features are properly structured
      const features = slide.children[1]?.children[0]?.children[0]?.children[0]?.children[1]?.children;
      if (features) {
        console.log('\n=== Features Structure ===');
        console.log('Number of features:', features.length);
        features.forEach((feature, i) => {
          if (feature.children && feature.children[1] && feature.children[1].children) {
            const title = feature.children[1].children[0];
            console.log(`Feature ${i + 1} title:`, title.content);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLayout();