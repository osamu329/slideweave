/**
 * examples以下の全JSONテストケースをPPTXファイルに変換
 */

import { runTest, runTsxTest } from './runTest';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * エラーメッセージから簡潔な理由を抽出
 */
function getSimpleErrorReason(errorMessage: string): string {
  if (errorMessage.includes('JSON Schema validation failed')) {
    return 'スキーマバリデーション失敗';
  }
  if (errorMessage.includes('Schema file not found')) {
    return 'スキーマファイル未発見';
  }
  if (errorMessage.includes('SYSTEM BUG: fontSize missing')) {
    return 'フォントサイズ設定エラー';
  }
  if (errorMessage.includes('pt units not supported')) {
    return 'pt単位非対応';
  }
  if (errorMessage.includes('Background blur processing failed')) {
    return '背景ブラー処理失敗';
  }
  if (errorMessage.includes('Unable to parse color')) {
    return '色形式エラー';
  }
  if (errorMessage.includes('Cannot find module')) {
    return 'モジュール未発見';
  }
  if (errorMessage.includes('期待値: slide')) {
    return '古い形式 (slide必須)';
  }
  
  // 一般的なエラー
  return errorMessage.split('\n')[0].substring(0, 30) + '...';
}

async function runAllTests() {
  console.log('🚀 examples以下のJSON・TSXテストケースを一括実行開始');
  
  // examples ディレクトリ内の.jsonファイルと tsx ディレクトリ内の.tsxファイルを検索
  const examplesDir = __dirname;
  const files = fs.readdirSync(examplesDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  // tsx ディレクトリ内の.tsxファイルを検索
  const tsxDir = path.join(examplesDir, 'tsx');
  let tsxFiles: string[] = [];
  if (fs.existsSync(tsxDir)) {
    const tsxDirFiles = fs.readdirSync(tsxDir);
    tsxFiles = tsxDirFiles.filter(file => file.endsWith('.tsx'));
  }
  
  const totalFiles = jsonFiles.length + tsxFiles.length;
  
  if (totalFiles === 0) {
    console.log('❌ JSON・TSXテストケースが見つかりません');
    return;
  }
  
  console.log(`📁 ${jsonFiles.length}個のJSONファイル、${tsxFiles.length}個のTSXファイルを発見`);
  
  let successCount = 0;
  let failureCount = 0;
  const failedFiles: { file: string; reason: string }[] = [];
  
  // 各JSONファイルを順次実行
  for (const jsonFile of jsonFiles) {
    try {
      process.stdout.write(`🔧 ${jsonFile} (JSON)... `);
      
      await runTest(jsonFile);
      successCount++;
      
      console.log(`✅`);
      
    } catch (error) {
      failureCount++;
      const reason = getSimpleErrorReason(error.message);
      failedFiles.push({ file: jsonFile, reason });
      console.log(`❌ (スキップ)`);
      console.error(`  エラー: ${error.message}`);
    }
  }
  
  // 各TSXファイルを順次実行
  for (const tsxFile of tsxFiles) {
    try {
      process.stdout.write(`🔧 ${tsxFile} (TSX)... `);
      
      await runTsxTest(path.join('tsx', tsxFile));
      successCount++;
      
      console.log(`✅`);
      
    } catch (error) {
      failureCount++;
      const reason = getSimpleErrorReason(error.message);
      failedFiles.push({ file: tsxFile, reason });
      console.log(`❌ (スキップ)`);
      console.error(`  エラー: ${error.message}`);
    }
  }
  
  // 結果サマリー
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 実行結果サマリー');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ 成功: ${successCount}個`);
  console.log(`❌ 失敗: ${failureCount}個`);
  console.log(`📁 合計: ${totalFiles}個`);
  
  if (failureCount > 0) {
    console.log(`\n❌ 失敗したファイル一覧:`);
    failedFiles.forEach((failure, index) => {
      console.log(`  ${index + 1}. ${failure.file} - ${failure.reason}`);
    });
  }
  
  if (failureCount === 0) {
    console.log('\n🎉 すべてのテストケースが正常に処理されました！');
  } else {
    console.log(`\n⚠️  ${failureCount}個のテストケースで問題が発生しました`);
    process.exit(1);
  }
}

// 直接実行時（ES Module）
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests };