#!/usr/bin/env tsx
/**
 * PPTXGenJSのaddTextで背景色を直接テストするサンプル
 */

import PptxGenJS from "pptxgenjs";

function testDirectAddText() {
  console.log("🧪 PPTXGenJS addText 背景色テスト開始");

  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  // テスト1: オブジェクト形式のfill
  slide.addText("オブジェクト形式 fill", {
    x: 1,
    y: 1,
    w: 4,
    h: 0.5,
    fill: { color: "FF0000" }, // 赤背景
    color: "FFFFFF", // 白文字
    fontSize: 14,
    fontFace: "Arial"
  });

  // テスト2: 文字列形式のfill
  slide.addText("文字列形式 fill", {
    x: 1,
    y: 2,
    w: 4,
    h: 0.5,
    fill: "00FF00", // 緑背景（文字列）
    color: "000000", // 黒文字
    fontSize: 14,
    fontFace: "Arial"
  });

  // テスト3: fill未指定
  slide.addText("背景色なし", {
    x: 1,
    y: 3,
    w: 4,
    h: 0.5,
    color: "000000",
    fontSize: 14,
    fontFace: "Arial"
  });

  // テスト4: 異なる色形式
  slide.addText("6桁16進数 #なし", {
    x: 1,
    y: 4,
    w: 4,
    h: 0.5,
    fill: { color: "0000FF" }, // 青背景
    color: "FFFFFF",
    fontSize: 14,
    fontFace: "Arial"
  });

  // テスト5: #付き形式
  slide.addText("#付き16進数", {
    x: 1,
    y: 5,
    w: 4,
    h: 0.5,
    fill: { color: "#FFFF00" }, // 黄背景
    color: "000000",
    fontSize: 14,
    fontFace: "Arial"
  });

  const outputPath = "examples/output/direct-addText-test.pptx";
  pptx.writeFile({ fileName: outputPath })
    .then(() => {
      console.log(`✅ 直接テスト完了: ${outputPath}`);
      console.log("🔍 python-pptx検証を実行してください:");
      console.log(`uv run scripts/verify-pptx.py ${outputPath}`);
    })
    .catch((err) => {
      console.error("❌ エラー:", err);
    });
}

testDirectAddText();