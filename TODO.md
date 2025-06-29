# SlideWeave TODO

## 現在進行中

### 既存ファイルのプロパティ移行
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