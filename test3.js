const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const { LayoutEngine } = require('./dist/layout/LayoutEngine');
const { PPTXRenderer } = require('./dist/renderer/PPTXRenderer');

// テスト3: 背景色と前景色の確認
const colorTestElements = {
  type: 'container',
  style: {
    width: 960,
    height: 720,
    backgroundColor: 'f0f0f0', // 薄いグレー背景
    padding: 4,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 2
  },
  children: [
    {
      type: 'heading',
      level: 1,
      content: '色設定のテスト',
      color: '000080', // ネイビー
      style: {
        margin: 2
      }
    },
    {
      type: 'container',
      style: {
        backgroundColor: 'ff0000', // 赤背景
        padding: 2,
        width: 400,
        height: 100
      },
      children: [
        {
          type: 'text',
          content: '赤背景に白文字のテキスト',
          color: 'ffffff', // 白文字
          fontSize: 14
        }
      ]
    },
    {
      type: 'container',
      style: {
        backgroundColor: '0000ff', // 青背景
        padding: 2,
        width: 400,
        height: 100,
        marginTop: 2
      },
      children: [
        {
          type: 'text',
          content: '青背景に黄色文字のテキスト',
          color: 'ffff00', // 黄色文字
          fontSize: 14
        }
      ]
    },
    {
      type: 'container',
      style: {
        backgroundColor: '008000', // 緑背景
        padding: 2,
        width: 400,
        height: 100,
        marginTop: 2
      },
      children: [
        {
          type: 'heading',
          level: 2,
          content: '緑背景に白文字の見出し',
          color: 'ffffff', // 白文字
          bold: true
        }
      ]
    }
  ]
};

// レイアウト計算
console.log('レイアウト計算中...');
const layoutEngine = new LayoutEngine();
const layoutResult = layoutEngine.calculateLayout(colorTestElements);

// デバッグ: レイアウト結果を出力
console.log('\nレイアウト結果:');
console.log(JSON.stringify(layoutResult, null, 2));

// PPTXレンダリング
console.log('\nPPTXレンダリング中...');
const renderer = new PPTXRenderer({
  slideWidth: 10,
  slideHeight: 7.5
});

// レンダリング実行
renderer.render(layoutResult);

// ファイル保存
const outputPath = path.join(__dirname, 'output', 'test3_colors.pptx');
console.log(`\nファイル保存中: ${outputPath}`);

renderer.save(outputPath).then(() => {
  console.log('✅ test3_colors.pptx が正常に生成されました');
  console.log('\n期待される結果:');
  console.log('- 薄いグレー背景のスライド');
  console.log('- ネイビー色の見出し「色設定のテスト」');
  console.log('- 赤背景に白文字のテキストボックス');
  console.log('- 青背景に黄色文字のテキストボックス');
  console.log('- 緑背景に白文字の見出し');
  console.log('\n現在の問題:');
  console.log('- containerの背景色がレンダリングされない（コメントアウトされている）');
  console.log('- テキスト要素自体の背景色設定方法が未実装');
}).catch(err => {
  console.error('エラー:', err);
});