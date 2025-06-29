/**
 * ガラス効果+テキストシャドウ検証
 */

import PptxGenJS from "pptxgenjs";

async function testShadowWithGlass() {
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

  // ガラス風効果を模倣（半透明の白背景）
  slide.addShape("rect", {
    x: 1,
    y: 1,
    w: 8,
    h: 4,
    fill: { 
      color: "FFFFFF",
      transparency: 75  // 75%透明（25%不透明）
    },
    line: { 
      color: "FFFFFF", 
      width: 1,
      transparency: 50
    }
  });

  // シャドウパターン1: blur 4, offset 2
  slide.addText("複数フレームでのブラー効果テスト（シャドウ1）", {
    x: 1.5,
    y: 1.5,
    w: 7,
    h: 0.5,
    fontSize: 14,
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

  // シャドウパターン2: blur 6, offset 2 (推奨)
  slide.addText("複数フレームでのブラー効果テスト（シャドウ2）", {
    x: 1.5,
    y: 2.5,
    w: 7,
    h: 0.5,
    fontSize: 14,
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

  // シャドウパターン3: より控えめなバージョン
  slide.addText("複数フレームでのブラー効果テスト（シャドウ3）", {
    x: 1.5,
    y: 3.5,
    w: 7,
    h: 0.5,
    fontSize: 14,
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

  // 比較用：シャドウなし
  slide.addText("複数フレームでのブラー効果テスト（シャドウなし）", {
    x: 1.5,
    y: 4.5,
    w: 7,
    h: 0.5,
    fontSize: 14,
    color: "FFFFFF",
    bold: true
  });

  const filename = "examples/output/shadow-with-glass-test.pptx";
  await pptx.writeFile({ fileName: filename });
  
  console.log(`✅ ガラス効果+シャドウテスト完了: ${filename}`);
}

testShadowWithGlass().catch(console.error);