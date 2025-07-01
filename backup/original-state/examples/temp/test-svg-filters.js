import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

// SVGフィルターの検証テスト
async function testSVGFilters() {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  console.log('Testing SVG filters with PPTXGenJS...');

  // テスト1: フィルターなしのSVG（ベースライン）
  const svgNoFilter = `
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="80" rx="10" ry="10"
            fill="#ffffff" fill-opacity="0.3" 
            stroke="#ffffff" stroke-opacity="0.5" stroke-width="1"/>
      <text x="100" y="55" fill="#000000" text-anchor="middle" font-size="16">No Filter</text>
    </svg>
  `;

  // テスト2: feGaussianBlurフィルター
  const svgWithBlur = `
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>
      <rect x="10" y="10" width="180" height="80" rx="10" ry="10"
            fill="#ffffff" fill-opacity="0.3" 
            stroke="#ffffff" stroke-opacity="0.5" stroke-width="1"
            filter="url(#blur)"/>
      <text x="100" y="55" fill="#000000" text-anchor="middle" font-size="16">Blur Filter</text>
    </svg>
  `;

  // テスト3: feGaussianBlur + feMerge（現在のガラス効果）
  const svgWithGlow = `
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="10" y="10" width="180" height="80" rx="10" ry="10"
            fill="#ffffff" fill-opacity="0.3" 
            stroke="#ffffff" stroke-opacity="0.5" stroke-width="1"
            filter="url(#glow)"/>
      <text x="100" y="55" fill="#000000" text-anchor="middle" font-size="16">Glow Filter</text>
    </svg>
  `;

  // テスト4: 複雑なフィルター（ドロップシャドウ）
  const svgWithDropShadow = `
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect x="10" y="10" width="180" height="80" rx="10" ry="10"
            fill="#ffffff" fill-opacity="0.3" 
            stroke="#ffffff" stroke-opacity="0.5" stroke-width="1"
            filter="url(#dropshadow)"/>
      <text x="100" y="55" fill="#000000" text-anchor="middle" font-size="16">Drop Shadow</text>
    </svg>
  `;

  // 背景画像追加
  try {
    slide.addImage({
      path: './tmp/510.jpg',
      x: 0, y: 0, w: 10, h: 5.6
    });
    console.log('✓ Background image added');
  } catch (error) {
    console.log('✗ Background image failed:', error.message);
    // フォールバック: 青い背景
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.6,
      fill: '4472C4'
    });
  }

  // SVGテスト追加
  const svgTests = [
    { svg: svgNoFilter, x: 1, y: 1, label: 'No Filter' },
    { svg: svgWithBlur, x: 4, y: 1, label: 'Blur' },
    { svg: svgWithGlow, x: 1, y: 3, label: 'Glow' },
    { svg: svgWithDropShadow, x: 4, y: 3, label: 'Drop Shadow' }
  ];

  for (const test of svgTests) {
    try {
      slide.addImage({
        data: `data:image/svg+xml;base64,${Buffer.from(test.svg).toString('base64')}`,
        x: test.x, y: test.y, w: 2, h: 1
      });
      console.log(`✓ ${test.label} SVG added`);
    } catch (error) {
      console.log(`✗ ${test.label} SVG failed:`, error.message);
    }
  }

  // ファイル保存
  const outputPath = path.join(process.cwd(), 'examples/temp/svg-filters-test.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Test file saved: ${outputPath}`);
  
  return outputPath;
}

testSVGFilters().catch(console.error);