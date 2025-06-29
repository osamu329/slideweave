#!/usr/bin/env node

/**
 * 無次元数値を明示的px単位に変換するスクリプト
 * examples/*.jsonファイルの無次元数値プロパティをpx単位に変換
 */

import fs from 'fs';
import path from 'path';

// 対象となる数値プロパティ
const DIMENSION_PROPERTIES = [
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'width', 'height', 'borderWidth', 'borderRadius', 'gap',
  'top', 'left', 'right', 'bottom'
];

function convertObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertObject);
  }
  
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // 次元プロパティで数値の場合はpx単位に変換
      if (DIMENSION_PROPERTIES.includes(key) && typeof value === 'number') {
        result[key] = `${value}px`;
        console.log(`  Converted ${key}: ${value} → "${value}px"`);
      } else {
        result[key] = convertObject(value);
      }
    }
    return result;
  }
  
  return obj;
}

function convertFile(filePath) {
  console.log(`Converting: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const converted = convertObject(data);
    
    const newContent = JSON.stringify(converted, null, 2);
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✓ Converted: ${filePath}\n`);
  } catch (error) {
    console.error(`✗ Error converting ${filePath}:`, error.message);
  }
}

async function main() {
  // examples/*.jsonファイルを検索して変換
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const examplesDir = path.join(__dirname, '..', 'examples');
  
  const allFiles = fs.readdirSync(examplesDir);
  const jsonFiles = allFiles.filter(f => f.endsWith('.json'));
  const fullPaths = jsonFiles.map(f => path.join(examplesDir, f));

  console.log('Converting unitless values to px units in examples/*.json\n');
  console.log(`Found ${jsonFiles.length} JSON files:`, jsonFiles);

  fullPaths.forEach(convertFile);

  console.log('Conversion complete!');
}

main().catch(console.error);