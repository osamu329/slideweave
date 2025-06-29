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

### テキストシャドウ機能実装 ✅
- **Issue**: OSN-160 フレーム内テキストの可読性向上のためのシャドウ機能
- **Branch**: osamu0329nakamura/osn-160-text-shadow-feature  
- **TDD**: 実装完了、test07右側フレームでシャドウ適用確認済み
  - [x] TextElement/HeadingElementにshadowプロパティ追加
  - [x] PPTXRendererでshadowサポート実装
  - [x] test07右側フレームでシャドウ適用テスト

### PostCSSベースCSSライクスタイルシート 🚧
- **Issue**: OSN-162 PostCSSベースのCSSライクスタイルシート機能の実装
- **目標**: JSONベースのstyle指定をCSSライクな記述で直感的に記述可能にする
- **Phase 1**: 基本的なCSS解析機能
  - [ ] PostCSSを使用したCSS文法パーサーの実装
  - [ ] CSSプロパティからJSONスタイルオブジェクトへの変換
  - [ ] 基本的なセレクタ（クラス名）のサポート
  - [ ] スタイル適用システムの実装
- **Phase 2**: PowerPoint対応プロパティの整理
  - [ ] PowerPointで再現可能なCSSプロパティの調査・リスト化
  - [ ] PowerPointで再現不可能なCSSプロパティの特定
  - [ ] 対応プロパティのホワイトリスト作成
  - [ ] 非対応プロパティの警告システム実装

### CSS文字列パーサー実装 ✅
- **概要**: PostCSSを使用したCSS文字列パーサー機能
- **実装内容**:
  - [x] CSSStyleParserクラス作成
  - [x] font-sizeのpt単位→数値変換対応
  - [x] ケバブケース→キャメルケース変換
  - [x] SlideDataLoaderでのCSS文字列自動処理
  - [x] test11-css.jsonでの動作確認完了

### 背景ブラー・ガラス効果 ✅
- **Issue**: OSN-159 (スライドへの背景画像機能を実装)
- **Branch**: osamu0329nakamura/osn-159-スライドへの背景画像機能を実装
- **TDD**: 背景画像→ブラー処理→ガラス効果の実装完了
  - [x] Web版PowerPoint対応（WebP→PNG変換）
  - [x] 背景色ブラー対応（test08修正）
  - [x] 複数ガラスフレーム対応（test07/test08で2フレーム配置）

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