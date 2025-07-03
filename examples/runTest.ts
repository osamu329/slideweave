/**
 * JSONベーステストランナー
 * JSON形式のスライドデータを読み込んでPPTXファイルを生成
 * build.tsのロジックを再利用して一貫性を保つ
 */

import { buildSlides } from '../src/cli/commands/build.js';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest(testFileName: string) {
  try {
    const inputPath = path.join(__dirname, testFileName);
    const outputFileName = testFileName.replace('.json', '.pptx');
    const outputPath = path.join(__dirname, 'output', outputFileName);
    
    // build.tsのロジックを再利用（format処理、バリデーション等すべて含む）
    await buildSlides(inputPath, { output: outputPath });
    
    console.log(`✅ PPTXファイルを保存しました: ${outputPath}`);
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    throw error;
  }
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

// 直接実行時（ES Module）
if (import.meta.url === `file://${process.argv[1]}`) {
  const testFile = process.argv[2] || 'test01-basic-layout-deck.json';
  runTest(testFile).catch(console.error);
}

export { runTest, runTsxTest };