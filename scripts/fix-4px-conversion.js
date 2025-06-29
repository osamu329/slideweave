#!/usr/bin/env node

/**
 * 4pxグリッドシステム対応の変換スクリプト
 * 次元プロパティのみを正しく4倍のpx単位に変換
 * flex、opacity、z-indexなどの無次元プロパティは変換しない
 */

import fs from 'fs';
import path from 'path';

// 4px倍数を適用する次元プロパティ（寸法・間隔系のみ）
const DIMENSION_PROPERTIES = [
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'width', 'height', 'borderWidth', 'borderRadius', 'gap',
  'top', 'left', 'right', 'bottom'
];

// 無次元数値を許可するプロパティ（変換しない）
const UNITLESS_PROPERTIES = [
  'flex', 'flexGrow', 'flexShrink', 'zIndex', 'opacity', 'order', 'lineHeight'
];

function convertObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertObject);
  }
  
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // 無次元プロパティは変換しない
      if (UNITLESS_PROPERTIES.includes(key)) {
        result[key] = value;
        continue;
      }
      
      // 次元プロパティでpx文字列の場合は4倍に修正
      if (DIMENSION_PROPERTIES.includes(key) && typeof value === 'string' && value.endsWith('px')) {
        const numValue = parseFloat(value.replace('px', ''));
        if (!isNaN(numValue)) {
          const correctedValue = numValue * 4;
          result[key] = `${correctedValue}px`;
          console.log(`  Fixed ${key}: "${value}" → "${correctedValue}px" (4x correction)`);
        } else {
          result[key] = value;
        }
      } else {
        result[key] = convertObject(value);
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
    
    const converted = convertObject(data);
    
    fs.writeFileSync(filePath, JSON.stringify(converted, null, 2));
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

console.log(`🚀 Applying 4px grid correction to ${files.length} files...`);
console.log(`📏 Converting: ${DIMENSION_PROPERTIES.join(', ')}`);
console.log(`🚫 Skipping: ${UNITLESS_PROPERTIES.join(', ')}`);

files.forEach(processFile);

console.log('\n✨ All files corrected!');