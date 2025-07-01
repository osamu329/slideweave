import PptxGenJS from 'pptxgenjs';

// PowerPointネイティブエフェクトの検証テスト
async function testPowerPointEffects() {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  console.log('Testing PowerPoint native effects...');

  // 背景画像追加
  slide.addImage({
    path: './tmp/510.jpg',
    x: 0, y: 0, w: 10, h: 5.6
  });

  // テスト1: 基本のシェイプ（比較用）
  slide.addShape('rect', {
    x: 1, y: 1, w: 2, h: 1,
    fill: { color: 'FFFFFF', transparency: 70 },
    line: { color: 'FFFFFF', width: 1, transparency: 50 }
  });
  slide.addText('Basic', { x: 1.7, y: 1.4, fontSize: 14, color: '000000', bold: true });

  // テスト2: Glow効果
  slide.addShape('rect', {
    x: 4, y: 1, w: 2, h: 1,
    fill: { color: 'FFFFFF', transparency: 70 },
    line: { color: 'FFFFFF', width: 1, transparency: 50 },
    glow: { size: 8, color: 'FFFFFF', opacity: 50 }
  });
  slide.addText('Glow', { x: 4.7, y: 1.4, fontSize: 14, color: '000000', bold: true });

  // テスト3: Shadow効果
  slide.addShape('rect', {
    x: 7, y: 1, w: 2, h: 1,
    fill: { color: 'FFFFFF', transparency: 70 },
    line: { color: 'FFFFFF', width: 1, transparency: 50 },
    shadow: { type: 'outer', blur: 8, offset: 4, angle: 45, color: '000000', opacity: 30 }
  });
  slide.addText('Shadow', { x: 7.5, y: 1.4, fontSize: 14, color: '000000', bold: true });

  // テスト4: Reflection効果
  slide.addShape('rect', {
    x: 1, y: 3, w: 2, h: 1,
    fill: { color: 'FFFFFF', transparency: 70 },
    line: { color: 'FFFFFF', width: 1, transparency: 50 },
    reflection: { type: 'full', size: 50, blur: 4, offset: 2, transparency: 40 }
  });
  slide.addText('Reflection', { x: 1.5, y: 3.4, fontSize: 14, color: '000000', bold: true });

  // テスト5: 複合効果（Glow + Shadow）
  slide.addShape('rect', {
    x: 4, y: 3, w: 2, h: 1,
    fill: { color: 'FFFFFF', transparency: 70 },
    line: { color: 'FFFFFF', width: 1, transparency: 50 },
    glow: { size: 6, color: 'FFFFFF', opacity: 40 },
    shadow: { type: 'outer', blur: 6, offset: 3, angle: 45, color: '000000', opacity: 20 }
  });
  slide.addText('Glow+Shadow', { x: 4.3, y: 3.4, fontSize: 14, color: '000000', bold: true });

  // テスト6: より強いGlow効果
  slide.addShape('rect', {
    x: 7, y: 3, w: 2, h: 1,
    fill: { color: 'FFFFFF', transparency: 70 },
    line: { color: 'FFFFFF', width: 1, transparency: 50 },
    glow: { size: 15, color: 'FFFFFF', opacity: 70 }
  });
  slide.addText('Strong Glow', { x: 7.3, y: 3.4, fontSize: 14, color: '000000', bold: true });

  console.log('✓ All PowerPoint effects added');

  // ファイル保存
  const outputPath = 'examples/temp/powerpoint-effects-test.pptx';
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Test file saved: ${outputPath}`);
  
  return outputPath;
}

testPowerPointEffects().catch(console.error);