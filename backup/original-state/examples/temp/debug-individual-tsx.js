#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsxFiles = [
  'jsx-basic.tsx',
  'jsx-components.tsx',
  'jsx-components-fixed.tsx', 
  'jsx-card-components.tsx',
  'jsx-simple-test.tsx',
  'jsx-tailwind-components.tsx'
];

async function testIndividualTsx() {
  for (const fileName of tsxFiles) {
    try {
      const tsxPath = path.join(__dirname, '../tsx/', fileName);
      console.log(`\n=== Testing ${fileName} ===`);
      
      const tsxModule = await import(tsxPath);
      console.log('✅ Import successful');
      console.log('Default export type:', typeof tsxModule.default);
      
      if (tsxModule.default) {
        console.log('✅ Default export exists');
        console.log('Slides length:', tsxModule.default.slides?.length || 'No slides');
      } else {
        console.log('❌ Default export is undefined/null');
      }
    } catch (error) {
      console.log('❌ Import failed:', error.message);
    }
  }
}

testIndividualTsx();