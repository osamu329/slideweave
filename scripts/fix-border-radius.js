#!/usr/bin/env node

/**
 * borderRadiusを4分の1に戻すスクリプト
 * borderRadiusは視覚的効果なので4px倍数適用は不要
 */

import fs from 'fs';
import path from 'path';

function fixBorderRadius(obj) {
  if (Array.isArray(obj)) {
    return obj.map(fixBorderRadius);
  }
  
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // borderRadiusを4分の1に修正
      if (key === 'borderRadius' && typeof value === 'string' && value.endsWith('px')) {
        const numValue = parseFloat(value.replace('px', ''));
        if (!isNaN(numValue)) {
          const correctedValue = numValue / 4;
          result[key] = `${correctedValue}px`;
          console.log(`  Fixed ${key}: "${value}" → "${correctedValue}px" (÷4 correction)`);
        } else {
          result[key] = value;
        }
      } else {
        result[key] = fixBorderRadius(value);
      }
    }
    return result;
  }
  
  return obj;
}

function processFile(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const fixed = fixBorderRadius(data);
    
    fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2));
    console.log(`✅ Successfully updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// examples/*.jsonファイルを処理
const examplesDir = './examples';
const files = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(examplesDir, file));

console.log(`🚀 Fixing borderRadius (÷4) in ${files.length} files...`);

files.forEach(processFile);

console.log('\n✨ All borderRadius values corrected!');