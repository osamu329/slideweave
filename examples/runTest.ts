/**
 * JSONベーステストランナー
 * JSON形式のスライドデータを読み込んでPPTXファイルを生成
 */

import { renderLayout } from '../src/layout/LayoutEngine';
import { PPTXRenderer } from '../src/renderer/PPTXRenderer';
import { ElementValidator } from '../src/elements/validator';
import { SlideDataLoader } from '../src/data/SlideDataLoader';
import { LayoutResult } from '../src/layout/LayoutEngine';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * テキスト要素の座標を検証
 * @param layoutResult レイアウト計算結果
 * @param parentX 親要素のX座標（累積）
 * @param parentY 親要素のY座標（累積）
 * @param depth 階層の深さ
 */
function verifyTextCoordinates(layoutResult: LayoutResult, parentX = 0, parentY = 0, depth = 0): void {
  const indent = '  '.repeat(depth);
  const absoluteX = parentX + layoutResult.left;
  const absoluteY = parentY + layoutResult.top;
  
  if (layoutResult.element.type === 'text' || layoutResult.element.type === 'heading') {
    console.log(`${indent}[${layoutResult.element.type}] "${layoutResult.element.content?.substring(0, 20)}..."`);
    console.log(`${indent}  相対座標: (${layoutResult.left}, ${layoutResult.top})`);
    console.log(`${indent}  絶対座標: (${absoluteX}, ${absoluteY})`);
    console.log(`${indent}  サイズ: ${layoutResult.width} x ${layoutResult.height}`);
    console.log(`${indent}  PowerPoint座標: (${(absoluteX / 72).toFixed(2)}", ${(absoluteY / 72).toFixed(2)}")`);
  }
  
  // 子要素を再帰的に検証
  if (layoutResult.children) {
    layoutResult.children.forEach(child => {
      verifyTextCoordinates(child, absoluteX, absoluteY, depth + 1);
    });
  }
}

async function runTest(testFileName: string) {
  try {
    console.log(`📊 テスト実行開始: ${testFileName}`);
    
    // JSONファイルを読み込み
    const testFilePath = path.join(__dirname, testFileName);
    const slideData = SlideDataLoader.loadFromFile(testFilePath);
    
    console.log(`✅ データ読み込み完了: ${slideData.title}`);
    if (slideData.description) {
      console.log(`📝 説明: ${slideData.description}`);
    }
    
    // 16:9レイアウト設定
    const slideWidth = 720;
    const slideHeight = 405;
    
    const renderer = new PPTXRenderer({
      slideWidth: 10,
      slideHeight: 5.625
    });

    // 各スライドを処理
    for (let i = 0; i < slideData.slides.length; i++) {
      const slide = slideData.slides[i];
      
      // バリデーション
      const validation = ElementValidator.validate(slide);
      if (!validation.isValid) {
        console.error(`❌ スライド${i + 1}のバリデーションエラー:`, validation.errors);
        throw new Error(`スライド${i + 1}のバリデーションに失敗しました`);
      } else {
        console.log(`✅ スライド${i + 1}のバリデーション成功`);
      }
      
      // レイアウト計算
      const slideLayout = await renderLayout(slide, slideWidth, slideHeight);
      
      // デバッグ出力
      console.log(`=== スライド${i + 1}のレイアウト結果 ===`);
      console.log(JSON.stringify(slideLayout, null, 2));
      
      // テキスト要素の座標検証
      console.log(`\n=== テキスト要素の座標検証 ===`);
      verifyTextCoordinates(slideLayout);
      
      
      // 最初のスライド、またはスライドを追加
      if (i === 0) {
        renderer.render(slideLayout);
      } else {
        //renderer.addSlide();
        renderer.render(slideLayout);
      }
    }

    // 出力ディレクトリを作成
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // ファイル保存
    const outputFileName = testFileName.replace('.json', '.pptx');
    const outputPath = path.join(outputDir, outputFileName);
    await renderer.save(outputPath);
    console.log(`✅ テスト完了: ${outputPath}`);
    
    return renderer.getPptx();
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    throw error;
  }
}

// 直接実行時（ES Module）
if (import.meta.url === `file://${process.argv[1]}`) {
  const testFile = process.argv[2] || 'test1-basic-layout.json';
  runTest(testFile).catch(console.error);
}

export { runTest };