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



async function runTest(testFileName: string) {
  try {
    // JSONファイルを読み込み
    const testFilePath = path.join(__dirname, testFileName);
    const slideData = SlideDataLoader.loadFromFile(testFilePath);
    
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
      }
      
      // レイアウト計算
      const slideLayout = await renderLayout(slide, slideWidth, slideHeight);
      
      // サイレント処理
      
      
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
    // サイレント完了
    
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