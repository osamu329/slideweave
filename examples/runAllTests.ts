/**
 * examples以下の全JSONテストケースをPPTXファイルに変換
 */

import { runTest } from './runTest';
import * as path from 'path';
import * as fs from 'fs';

async function runAllTests() {
  console.log('🚀 examples以下のJSONテストケースを一括実行開始');
  
  // examples ディレクトリ内の.jsonファイルを検索
  const examplesDir = __dirname;
  const files = fs.readdirSync(examplesDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log('❌ JSONテストケースが見つかりません');
    return;
  }
  
  console.log(`📁 ${jsonFiles.length}個のテストケースを発見:`);
  jsonFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let successCount = 0;
  let failureCount = 0;
  
  // 各JSONファイルを順次実行
  for (const jsonFile of jsonFiles) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🔧 実行中: ${jsonFile}`);
      console.log(`${'='.repeat(60)}`);
      
      await runTest(jsonFile);
      successCount++;
      
      console.log(`✅ ${jsonFile} 処理完了`);
      
    } catch (error) {
      failureCount++;
      console.error(`❌ ${jsonFile} 処理失敗:`, error);
    }
  }
  
  // 結果サマリー
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 実行結果サマリー');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ 成功: ${successCount}個`);
  console.log(`❌ 失敗: ${failureCount}個`);
  console.log(`📁 合計: ${jsonFiles.length}個`);
  
  if (failureCount === 0) {
    console.log('\n🎉 すべてのテストケースが正常に処理されました！');
  } else {
    console.log(`\n⚠️  ${failureCount}個のテストケースで問題が発生しました`);
    process.exit(1);
  }
}

// 直接実行時
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };