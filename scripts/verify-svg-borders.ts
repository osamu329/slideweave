#!/usr/bin/env tsx
/**
 * SVG Border検証スクリプト - 視認以外のborder確認方法
 * 生成されたSVGからborder属性を抽出・検証
 */

import { SVGGenerator } from "../src/svg/SVGGenerator";

interface BorderTestCase {
  name: string;
  options: any;
  expected: {
    strokeWidth?: number;
    stroke?: string;
    strokeDasharray?: string;
  };
}

const testCases: BorderTestCase[] = [
  {
    name: "2px solid black border",
    options: {
      width: 100,
      height: 50,
      backgroundColor: "#ffffff",
      borderWidth: "2px",
      borderColor: "#000000",
      borderStyle: "solid"
    },
    expected: {
      strokeWidth: 2,
      stroke: "#000000"
    }
  },
  {
    name: "4px solid red border",
    options: {
      width: 100,
      height: 50,
      backgroundColor: "#ffffff",
      borderWidth: "4px",
      borderColor: "#ff0000",
      borderStyle: "solid"
    },
    expected: {
      strokeWidth: 4,
      stroke: "#ff0000"
    }
  },
  {
    name: "3px dashed blue border",
    options: {
      width: 100,
      height: 50,
      backgroundColor: "#ffffff",
      borderWidth: "3px",
      borderColor: "#0000ff",
      borderStyle: "dashed"
    },
    expected: {
      strokeWidth: 3,
      stroke: "#0000ff",
      strokeDasharray: "9 3"  // strokeWidth * 3, strokeWidth
    }
  },
  {
    name: "2px dotted green border",
    options: {
      width: 100,
      height: 50,
      backgroundColor: "#ffffff",
      borderWidth: "2px",
      borderColor: "#00ff00",
      borderStyle: "dotted"
    },
    expected: {
      strokeWidth: 2,
      stroke: "#00ff00",
      strokeDasharray: "2 2"  // strokeWidth, strokeWidth
    }
  },
  {
    name: "border with borderRadius",
    options: {
      width: 100,
      height: 50,
      backgroundColor: "#ffffff",
      borderWidth: "2px",
      borderColor: "#ff0000",
      borderStyle: "solid",
      borderRadius: "8px"
    },
    expected: {
      strokeWidth: 2,
      stroke: "#ff0000"
    }
  }
];

function extractSVGAttributes(svg: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  // <rect>要素を探す
  const rectMatch = svg.match(/<rect[^>]*>/);
  if (!rectMatch) {
    throw new Error("No <rect> element found in SVG");
  }
  
  const rectElement = rectMatch[0];
  
  // 各属性を抽出
  const attrMatches = rectElement.matchAll(/(\w+(?:-\w+)*)="([^"]*)"/g);
  for (const match of attrMatches) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
}

async function runBorderVerification(): Promise<void> {
  console.log("=== SVG Border Verification ===\n");
  
  const generator = new SVGGenerator();
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const svg = await generator.generateFrameSVG(testCase.options);
      const attributes = extractSVGAttributes(svg);
      
      let testPassed = true;
      const errors: string[] = [];
      
      // strokeWidth検証
      if (testCase.expected.strokeWidth !== undefined) {
        const actualStrokeWidth = parseFloat(attributes["stroke-width"] || "0");
        if (actualStrokeWidth !== testCase.expected.strokeWidth) {
          errors.push(`Expected strokeWidth: ${testCase.expected.strokeWidth}, got: ${actualStrokeWidth}`);
          testPassed = false;
        }
      }
      
      // stroke検証
      if (testCase.expected.stroke !== undefined) {
        const actualStroke = attributes["stroke"];
        if (actualStroke !== testCase.expected.stroke) {
          errors.push(`Expected stroke: ${testCase.expected.stroke}, got: ${actualStroke}`);
          testPassed = false;
        }
      }
      
      // strokeDasharray検証
      if (testCase.expected.strokeDasharray !== undefined) {
        const actualStrokeDasharray = attributes["stroke-dasharray"];
        if (actualStrokeDasharray !== testCase.expected.strokeDasharray) {
          errors.push(`Expected strokeDasharray: ${testCase.expected.strokeDasharray}, got: ${actualStrokeDasharray}`);
          testPassed = false;
        }
      }
      
      if (testPassed) {
        console.log("  ✅ PASSED");
        passedTests++;
      } else {
        console.log("  ❌ FAILED");
        errors.forEach(error => console.log(`    - ${error}`));
      }
      
      // 生成されたSVG属性を表示（デバッグ用）
      if (!testPassed) {
        console.log("  Generated SVG attributes:");
        Object.entries(attributes).forEach(([key, value]) => {
          if (key.startsWith("stroke") || key === "fill") {
            console.log(`    ${key}: "${value}"`);
          }
        });
      }
      
    } catch (error) {
      console.log("  ❌ ERROR:", error.message);
    }
    
    console.log("");
  }
  
  console.log(`=== Results: ${passedTests}/${totalTests} tests passed ===`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All border tests passed!");
    process.exit(0);
  } else {
    console.log("💥 Some border tests failed.");
    process.exit(1);
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  runBorderVerification().catch(console.error);
}

export { runBorderVerification, extractSVGAttributes };