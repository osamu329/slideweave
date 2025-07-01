#!/usr/bin/env node

// SVGGeneratorのRGBAサポートを直接テストするスクリプト

import { SVGGenerator } from '../src/svg/SVGGenerator';

console.log('=== SVGGenerator RGBA Test ===\n');

const generator = new SVGGenerator();

// Test cases
const testCases = [
  {
    name: 'Hex color without #',
    options: { width: 200, height: 100, backgroundColor: 'ff0000' }
  },
  {
    name: 'Hex color with #',
    options: { width: 200, height: 100, backgroundColor: '#00ff00' }
  },
  {
    name: 'RGBA color',
    options: { width: 200, height: 100, backgroundColor: 'rgba(255,0,0,0.5)' }
  },
  {
    name: 'RGBA color with spaces',
    options: { width: 200, height: 100, backgroundColor: 'rgba(255, 0, 0, 0.3)' }
  },
  {
    name: 'RGB color',
    options: { width: 200, height: 100, backgroundColor: 'rgb(0,255,0)' }
  },
  {
    name: 'No background color',
    options: { width: 200, height: 100 }
  }
];

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}:`);
  console.log(`   Input: backgroundColor = "${testCase.options.backgroundColor || 'undefined'}"`);
  
  try {
    const svg = generator.generateFrameSVG(testCase.options);
    
    // Extract fill attribute
    const fillMatch = svg.match(/fill="([^"]*)"/);
    const fillValue = fillMatch ? fillMatch[1] : 'NOT FOUND';
    
    console.log(`   Output: fill="${fillValue}"`);
    console.log(`   SVG: ${svg}`);
    
    // Simple validation
    const backgroundColor = testCase.options.backgroundColor;
    if (backgroundColor) {
      if (backgroundColor.startsWith('rgba(') || backgroundColor.startsWith('rgb(')) {
        if (fillValue === backgroundColor) {
          console.log('   ✅ PASS: RGBA/RGB preserved correctly');
        } else {
          console.log('   ❌ FAIL: RGBA/RGB not preserved');
        }
      } else if (backgroundColor.startsWith('#')) {
        if (fillValue === backgroundColor) {
          console.log('   ✅ PASS: Hex color preserved');
        } else {
          console.log('   ❌ FAIL: Hex color not preserved');
        }
      } else {
        if (fillValue === `#${backgroundColor}`) {
          console.log('   ✅ PASS: # prefix added correctly');
        } else {
          console.log('   ❌ FAIL: # prefix not added correctly');
        }
      }
    } else {
      if (fillValue === 'none') {
        console.log('   ✅ PASS: No background = none');
      } else {
        console.log('   ❌ FAIL: Should be none');
      }
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  console.log('');
});

console.log('=== Test Complete ===');