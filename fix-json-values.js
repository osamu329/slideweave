#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 4px系に変換が必要な数値プロパティ（fontSize除外）
const numericProperties = [
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'gap', 'width', 'height', 'flex'
  // fontSize は除外（ピクセル値なのでグリッドシステムと無関係）
];

function doubleNumericValues(obj) {
  if (Array.isArray(obj)) {
    return obj.map(doubleNumericValues);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (numericProperties.includes(key) && typeof value === 'number') {
        result[key] = value * 2; // 8px系 → 4px系で同じピクセル値を得るために2倍
        console.log(`  ${key}: ${value} → ${result[key]}`);
      } else {
        result[key] = doubleNumericValues(value);
      }
    }
    return result;
  } else {
    return obj;
  }
}

// examples/*.json ファイルを処理
const examplesDir = path.join(__dirname, 'examples');

function getAllJsonFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllJsonFiles(fullPath));
    } else if (item.endsWith('.json') && !item.includes('verification') && !item.startsWith('test-')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const jsonFiles = getAllJsonFiles(examplesDir);

console.log('🔧 JSONファイルの無次元数値を2倍に修正中...\n');

for (const filePath of jsonFiles) {
  const fileName = path.relative(examplesDir, filePath);
  console.log(`📝 ${fileName}:`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const modifiedData = doubleNumericValues(data);
    
    fs.writeFileSync(filePath, JSON.stringify(modifiedData, null, 2) + '\n');
    console.log(`✅ 修正完了\n`);
  } catch (error) {
    console.error(`❌ エラー: ${error.message}\n`);
  }
}

console.log('🎉 すべてのJSONファイルの修正が完了しました！');