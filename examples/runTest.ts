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
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



async function runTest(testFileName: string) {
  try {
    // JSONファイルを読み込み
    const testFilePath = path.join(__dirname, testFileName);
    const slideData = SlideDataLoader.loadFromFile(testFilePath);
    
    // 16:9レイアウト設定（HD解像度）
    const slideWidth = 1280;
    const slideHeight = 720;
    
    const renderer = new PPTXRenderer({
      slideWidth: 13.333,
      slideHeight: 7.5
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
        await renderer.render(slideLayout);
      } else {
        //renderer.addSlide();
        await renderer.render(slideLayout);
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

/**
 * TSXファイルを実行してPPTXを生成
 */
async function runTsxTest(tsxFileName: string) {
  try {
    const tsxFilePath = path.join(__dirname, tsxFileName);
    
    // 出力JSONファイルパスを決定
    const baseName = path.basename(tsxFileName, '.tsx');
    const tempJsonFileName = `${baseName}-temp.json`;
    const tempJsonPath = path.join(__dirname, tempJsonFileName);
    
    // dynamic importでTSXファイルからslideDataを取得
    const tsxModule = await import(tsxFilePath);
    const slideData = tsxModule.default;
    
    // JSONファイルとして出力
    fs.writeFileSync(tempJsonPath, JSON.stringify(slideData, null, 2), 'utf8');
    
    // 生成されたJSONファイルが存在するか確認
    if (!fs.existsSync(tempJsonPath)) {
      throw new Error(`TSXファイルの実行でJSONファイルが生成されませんでした: ${tempJsonPath}`);
    }
    
    try {
      // JSON → PPTX変換を実行
      await runTest(tempJsonFileName);
      
      // 一時ファイルを削除
      fs.unlinkSync(tempJsonPath);
      
    } catch (error) {
      // エラーが発生した場合も一時ファイルを削除
      if (fs.existsSync(tempJsonPath)) {
        fs.unlinkSync(tempJsonPath);
      }
      throw error;
    }
    
  } catch (error) {
    console.error('❌ TSXテスト実行エラー:', error);
    throw error;
  }
}

export { runTest, runTsxTest };