/**
 * PPTXGenJS直接テスト
 * 1280×720pxボーダー付き透明矩形を描画
 */

import PptxGenJS from "pptxgenjs";

// PPTXインスタンス作成
const pptx = new PptxGenJS();

// スライドサイズ設定（13.333x7.5インチ = 16:9 Widescreen）
pptx.defineLayout({
  name: "SLIDEWEAVE_LAYOUT",
  width: 13.333,
  height: 7.5,
});
pptx.layout = "SLIDEWEAVE_LAYOUT";

// スライド追加
const slide = pptx.addSlide();

// 1280×720px矩形を直接描画（PowerPointは96DPI）
// 1280px ÷ 96 = 13.333インチ
// 720px ÷ 96 = 7.5インチ
slide.addShape(pptx.ShapeType.rect, {
  x: 0,           // 左端
  y: 0,           // 上端
  w: 13.333,      // 1280px ÷ 96 = 13.333インチ
  h: 7.5,         // 720px ÷ 96 = 7.5インチ
  fill: { transparency: 100, color: "cc0000"},  // 透明背景
  line: { 
    color: "FF0000",  // 赤ボーダー
    width: 2          // 2pt線幅
  }
});

// PPTXファイル保存
pptx.writeFile({ fileName: "examples/output/test-pptxgenjs-direct.pptx" });

console.log("PPTXGenJS直接テスト完了: examples/output/test-pptxgenjs-direct.pptx");
