/**
 * PPTXGenJS テキストシャドウ検証テスト
 */

import PptxGenJS from "pptxgenjs";

async function testTextShadow() {
  const pptx = new PptxGenJS();
  
  // スライドサイズ設定
  pptx.defineLayout({
    name: "CUSTOM_LAYOUT",
    width: 10,
    height: 5.625,
  });
  pptx.layout = "CUSTOM_LAYOUT";

  const slide = pptx.addSlide();

  // 背景画像を追加
  slide.addImage({
    path: "./tmp/510.jpg",
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    sizing: { type: "cover" }
  });

  // テスト1: 基本的なシャドウ
  slide.addText("シャドウテスト1", {
    x: 1,
    y: 1,
    w: 8,
    h: 1,
    fontSize: 24,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "outer",
      color: "000000",
      blur: 3,
      offset: 2,
      angle: 45
    }
  });

  // テスト2: 内側シャドウ
  slide.addText("シャドウテスト2（内側）", {
    x: 1,
    y: 2,
    w: 8,
    h: 1,
    fontSize: 24,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "inner",
      color: "000000",
      blur: 2,
      offset: 1,
      angle: 315
    }
  });

  // テスト3: ぼかしの強いシャドウ
  slide.addText("シャドウテスト3（ぼかし強）", {
    x: 1,
    y: 3,
    w: 8,
    h: 1,
    fontSize: 24,
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

  // テスト4: 透明度付きシャドウ（0-1範囲）
  slide.addText("シャドウテスト4（透明度）", {
    x: 1,
    y: 4,
    w: 8,
    h: 1,
    fontSize: 24,
    color: "FFFFFF",
    bold: true,
    shadow: {
      type: "outer",
      color: "000000",
      blur: 4,
      offset: 1,
      angle: 225,
      opacity: 0.5  // 透明度50%（0-1範囲）
    }
  });

  // ファイル保存
  const filename = "examples/output/text-shadow-test.pptx";
  await pptx.writeFile({ fileName: filename });
  
  console.log(`✅ テキストシャドウテスト完了: ${filename}`);
}

// 実行
testTextShadow().catch(console.error);