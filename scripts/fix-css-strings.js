import fs from 'fs';
import path from 'path';

const examplesDir = './examples';

// Properties that should have units in CSS strings
const cssUnitProperties = [
  'padding', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-radius', 'gap', 'top', 'left', 'right', 'bottom', 'width', 'height'
];

function fixCSSString(cssString) {
  let fixed = cssString;
  let hasChanges = false;
  
  // Fix unitless values in CSS properties
  cssUnitProperties.forEach(prop => {
    const pattern = new RegExp(`(${prop}):\\s*(\\d+)(?![\\d\\.])(?!px|%|em|rem|vh|vw|pt)`, 'g');
    fixed = fixed.replace(pattern, (match, property, value) => {
      console.log(`    CSS: ${property}: ${value} → ${property}: ${value}px`);
      hasChanges = true;
      return `${property}: ${value}px`;
    });
  });
  
  return { fixed, hasChanges };
}

function fixCSSInObject(obj) {
  let hasChanges = false;
  
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = fixCSSInObject(obj[i]);
      obj[i] = result.obj;
      hasChanges = hasChanges || result.hasChanges;
    }
  } else if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'style' && typeof value === 'string') {
        const result = fixCSSString(value);
        obj[key] = result.fixed;
        hasChanges = hasChanges || result.hasChanges;
      } else {
        const result = fixCSSInObject(value);
        obj[key] = result.obj;
        hasChanges = hasChanges || result.hasChanges;
      }
    }
  }
  
  return { obj, hasChanges };
}

function processFile(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const result = fixCSSInObject(data);
    
    if (result.hasChanges) {
      fs.writeFileSync(filePath, JSON.stringify(result.obj, null, 2));
      console.log(`✅ Successfully updated: ${filePath}`);
    } else {
      console.log(`✅ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Get all JSON files in examples directory
const files = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(examplesDir, file));

console.log(`🚀 Fixing CSS strings in ${files.length} files...`);

files.forEach(processFile);

console.log('\n✨ All files processed!');