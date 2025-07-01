/**
 * 実際のガラス効果背景+テキストシャドウ検証
 */

import PptxGenJS from "pptxgenjs";

async function testShadowRealGlass() {
  const pptx = new PptxGenJS();
  
  pptx.defineLayout({
    name: "CUSTOM_LAYOUT",
    width: 10,
    height: 5.625,
  });
  pptx.layout = "CUSTOM_LAYOUT";

  const slide = pptx.addSlide();

  // 背景画像
  slide.addImage({
    path: "./tmp/510.jpg",
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    sizing: { type: "cover" }
  });

  // ガラス効果SVGを背景全体に適用（枠なし）
  const glassSvg = `
    <svg width="960" height="540" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="960" height="540" fill="url(#glassGrad)" />
    </svg>
  `;
  
  const glassBase64 = Buffer.from(glassSvg).toString('base64');
  const glassDataUri = `data:image/svg+xml;base64,${glassBase64}`;

  // ガラス効果を背景全体に適用
  slide.addImage({
    data: glassDataUri,
    x: 0,
    y: 0,
    w: "100%",
    h: "100%"
  });

  // シャドウパターン1: blur 4, offset 2 (クリア、目立つ)
  slide.addText("シャドウ1: 複数フレームでのブラー効果テスト", {
    x: 1,
    y: 1,
    w: 8,
    h: 0.8,
    fontSize: 16,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "outer",
      color: "000000",
      blur: 4,
      offset: 2,
      angle: 315
    }
  });

  // シャドウパターン2: blur 6, offset 2 (推奨、自然)
  slide.addText("シャドウ2: 複数フレームでのブラー効果テスト", {
    x: 1,
    y: 2,
    w: 8,
    h: 0.8,
    fontSize: 16,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "outer",
      color: "000000",
      blur: 6,
      offset: 2,
      angle: 315
    }
  });

  // シャドウパターン3: blur 5, offset 1 (控えめ)
  slide.addText("シャドウ3: 複数フレームでのブラー効果テスト", {
    x: 1,
    y: 3,
    w: 8,
    h: 0.8,
    fontSize: 16,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "outer",
      color: "000000",
      blur: 5,
      offset: 1,
      angle: 315
    }
  });

  // シャドウパターン4: より強いハロー効果
  slide.addText("シャドウ4: 複数フレームでのブラー効果テスト", {
    x: 1,
    y: 4,
    w: 8,
    h: 0.8,
    fontSize: 16,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "outer",
      color: "000000",
      blur: 8,
      offset: 0,
      angle: 0
    }
  });

  // 比較用：シャドウなし
  slide.addText("比較用: 複数フレームでのブラー効果テスト（シャドウなし）", {
    x: 1,
    y: 5,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: "FFFFFF",
    bold: true
  });

  const filename = "examples/output/shadow-real-glass-test.pptx";
  await pptx.writeFile({ fileName: filename });
  
  console.log(`✅ 実ガラス効果+シャドウテスト完了: ${filename}`);
}

testShadowRealGlass().catch(console.error);