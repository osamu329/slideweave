import fs from 'fs';
import path from 'path';

const examplesDir = './examples';

// Properties that should have units
const unitProperties = [
  'fontSize', 'width', 'height', 'padding', 'margin', 'marginTop', 'marginRight', 
  'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 
  'paddingLeft', 'borderRadius', 'gap', 'top', 'left', 'right', 'bottom'
];

function fixUnitlessValues(obj) {
  if (Array.isArray(obj)) {
    return obj.map(fixUnitlessValues);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (unitProperties.includes(key) && typeof value === 'number') {
        console.log(`  Converting ${key}: ${value} → "${value}px"`);
        result[key] = `${value}px`;
      } else {
        result[key] = fixUnitlessValues(value);
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
    
    const fixed = fixUnitlessValues(data);
    
    fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2));
    console.log(`✅ Successfully updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Get all JSON files in examples directory
const files = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(examplesDir, file));

console.log(`🚀 Fixing remaining unitless values in ${files.length} files...`);

files.forEach(processFile);

console.log('\n✨ All files processed!');