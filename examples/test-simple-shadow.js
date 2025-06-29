/**
 * PPTXGenJS シンプルテキストシャドウ検証
 */

import PptxGenJS from "pptxgenjs";

async function testSimpleShadow() {
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

  // 濃いシャドウテスト1
  slide.addText("複数フレームでのブラー効果テスト（濃いシャドウ1）", {
    x: 1,
    y: 1.5,
    w: 8,
    h: 1,
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

  // 濃いシャドウテスト2（ブラー強め）
  slide.addText("複数フレームでのブラー効果テスト（濃いシャドウ2）", {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1,
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

  // 濃いシャドウテスト3（全方向）
  slide.addText("複数フレームでのブラー効果テスト（濃いシャドウ3）", {
    x: 1,
    y: 3.5,
    w: 8,
    h: 1,
    fontSize: 14,
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
  slide.addText("複数フレームでのブラー効果テスト（シャドウなし）", {
    x: 1,
    y: 4,
    w: 8,
    h: 1,
    fontSize: 14,
    color: "FFFFFF",
    bold: true
  });

  const filename = "examples/output/simple-shadow-test.pptx";
  await pptx.writeFile({ fileName: filename });
  
  console.log(`✅ シンプルシャドウテスト完了: ${filename}`);
}

testSimpleShadow().catch(console.error);