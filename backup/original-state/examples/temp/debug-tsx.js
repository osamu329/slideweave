#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTsx() {
  try {
    const tsxPath = path.join(__dirname, '../tsx/jsx-basic.tsx');
    console.log('Importing TSX file:', tsxPath);
    
    const tsxModule = await import(tsxPath);
    console.log('TSX module keys:', Object.keys(tsxModule));
    console.log('Default export type:', typeof tsxModule.default);
    
    if (tsxModule.default) {
      console.log('Default export content:');
      console.log(JSON.stringify(tsxModule.default, null, 2));
    } else {
      console.log('Default export is:', tsxModule.default);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testTsx();