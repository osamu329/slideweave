# SlideWeave TODO

## 現在進行中

### JSX CLI統合機能実装（OSN-161拡張）
- **概要**: JSXファイルをJSONに変換するcompileコマンドの実装
- **アプローチ**: JSON変換方式（フロントエンドCLI構造）
- **進捗**:
  - [ ] compile コマンドの基本実装 - JSXファイルをJSONに変換
  - [ ] tsx動的実行機能の実装 - execSyncでnpx tsx実行
  - [ ] compile コマンドのオプション実装 (-o ファイル出力)
  - [ ] build コマンドの--stdinオプション実装 (パイプライン対応)
  - [ ] エラーハンドリングとバリデーションの実装
  - [ ] JSX compile機能のテスト作成
  - [ ] ドキュメント更新 - CLIコマンドの使用例追加

### 使用例
```bash
# 基本機能
slideweave compile jsx-basic.tsx > output.json
slideweave build output.json

# 高度な機能  
slideweave compile jsx-basic.tsx -o compiled.json
slideweave compile jsx-basic.tsx | slideweave build --stdin
```

### 既存ファイルのプロパティ移行（低優先度）
- **概要**: examples/*.jsonファイルの直接プロパティをstyleオブジェクトに移行
- **対象プロパティ**: fontSize, fontFamily, color, bold, italic
- **除外**: test11-css.json（CSS文字列使用のため現状維持）
- **進捗**:
  - [ ] test01-basic-layout.json: fontSize等をstyleに移動
  - [ ] test02-two-column-layout.json: fontSize等をstyleに移動  
  - [ ] test04-2-text-styles.json: fontSize/color/bold/italic等をstyleに移動
  - [ ] 他のexamples/*.jsonファイルも同様に移行作業実施
  - [ ] 移行完了後のテスト実行と動作確認

## 完了済み

### 最近完了したタスク
- **OSN-161** React JSXライクなコンポーネント記述機能 ✅ (2025-06-30) - JSX Factory関数とTypeScript型定義実装
- **OSN-164** CLI機能実装 ✅ (2025-06-29) - JSONからPPTX生成のコマンドラインツール
- **OSN-160** テキストシャドウ機能 ✅ - フレーム内テキストの可読性向上
- **OSN-162** PostCSSベースCSSライクスタイルシート 🔄 - Phase 1,2完了、Phase 3部分完了
- **OSN-159** 背景ブラー・ガラス効果 ✅ - 背景画像とガラス効果実装
- CSS文字列パーサー ✅ - PostCSS使用、test11-css.json対応

### OSN-162 残作業（Phase 3）
  - [ ] @import機能の実装 (postcss-importプラグイン統合)
  - [ ] 外部CSSファイル参照機能の完全実装
  - [ ] CSS変数（カスタムプロパティ）のサポート

## アーキテクチャ・設計原則

### 要素タイプ責務分離 ✅
- **container**: 純粋なレイアウト専用、PowerPoint描画なし
- **frame**: 装飾付きコンテナ、背景色・ボーダー描画あり  
- **shape**: 図形専用、backgroundColor対応
- **text/heading**: テキスト描画、backgroundColor対応

### margin/padding戦略 ✅
- **margin**: レイアウトレベルで処理（要素間隔）
- **padding**: PowerPointレベルで処理（テキストフレーム内マージン）

### レイアウトエンジン ✅
- **YogaLayoutEngine**: 高精度なFlexboxレイアウト（Yoga Layout v1.10.0）
- **CSSLayoutEngine**: レガシー、非推奨

### プロパティ統合戦略 ✅
- **新方式**: すべてのスタイル関連プロパティをstyleオブジェクトに統合
- **CSS統合**: CSS文字列 → PostCSS → styleオブジェクト変換
- **後方互換**: 既存の直接プロパティは自動的にstyleに移行