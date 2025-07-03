# SlideWeave TODO

## 緊急対応中

### 古い形式JSONファイルの新形式変換作業
- **背景**: `npm run test:examples`でスキーマエラーが大量発生。古い形式ファイルが新スキーマに対応していない
- **現状**: 34個のJSONファイル中、約9個のみが正常ビルド可能、残り25個が古い形式でエラー
- **戦略**: 古いファイルを元に新形式ファイル（-deck.json）を新規作成（段階修正ではなく）

#### 完了済み新形式ファイル ✅
- test03-colors-deck.json ✅
- test03-shapes-deck.json ✅
- test04-1-frame-attributes-deck.json（borderRadius問題で保留）

#### 次の作業対象ファイル（優先順）
```bash
# 以下のコマンドで古い形式ファイルをリストアップ済み
grep -L '"type": "deck"' examples/*.json | head -10
```

1. **test04-2-text-styles.json** → **test04-2-text-styles-deck.json**
2. **test04-3-margin-padding.json** → **test04-3-margin-padding-deck.json**  
3. **test04-text-attributes.json** → **test04-text-attributes-deck.json**
4. **test05-2-gradient.json** → **test05-2-gradient-deck.json**
5. **test05-rgba.json** → **test05-rgba-deck.json**
6. **test06-1-bg-image-text.json** → **test06-1-bg-image-text-deck.json**
7. **test06-2-bg-glass.json** → **test06-2-bg-glass-deck.json**
8. **test06-3-glass-only.json** → **test06-3-glass-only-deck.json**
9. **test06-bg-image.json** → **test06-bg-image-deck.json**
10. **test07-background-blur.json** → **test07-background-blur-deck.json**

#### 新形式ファイル作成手順
```bash
# 1. 古いファイルの内容確認
npx tsx src/cli/index.ts build examples/testXX-old.json  # エラー確認

# 2. 新形式ファイル作成（この形式で）
{
  "type": "deck",
  "title": "...",
  "description": "...", 
  "format": "wide", // または "standard"
  "slides": [
    {
      "type": "slide",
      "style": { "padding": "16px" },
      "children": [
        // 古いファイルの内容を新形式に変換
        // - 色は#付きに変更 (f0f0f0 → #f0f0f0)
        // - fontSize等はstyle内に移動
        // - 構造はslide > children に修正
      ]
    }
  ]
}
```

# 3. ビルドテスト
npx tsx src/cli/index.ts build examples/testXX-deck.json -o examples/output/testXX-deck.pptx

# 4. 全体テスト
npm run test:examples  # エラー件数の減少確認
```

#### 目標
- **全ファイル変換完了**: 25個の古い形式ファイル → 新形式-deck.jsonファイル作成
- **npm run test:examples成功率**: 現在26% (9/34) → 目標100% (34/34)
- **出力確認**: examples/output/に全ファイルが正常出力される

#### 注意事項
- **borderRadius**: 現在スキーマでサポートされていない理由要調査 - 勝手に削除せず原因究明必要
- **色形式**: 必ず#付きに変更 (`f0f0f0` → `#f0f0f0`)
- **fontSize**: pt単位を推奨 (`"fontSize": "16pt"`)
- **出力テスト**: `-o examples/output/filename.pptx`で適切な場所に出力されることを確認

#### 要調査項目
- **borderRadius未対応問題**: 
  - スキーマファイル (src/schemas/slideweave.schema.json) でborderRadiusが定義されているか確認
  - frame要素でborderRadiusが許可されていない理由を調査
  - PPTXRendererでborderRadius実装状況確認  
  - PowerPoint/PPTXGenJSでの角丸サポート状況調査

## 完了済み

### pt単位変換アーキテクチャ実装 ✅ (2025-07-03)
- **概要**: YogaLayoutEngineのDPI依存を除去し、PPTXRendererでpt→px変換を実装
- **実装内容**:
  - YogaLayoutEngine: pt単位を拒否、fontSizeInPixelフィールドを優先使用
  - PPTXRenderer: preprocessElement()でpt→px変換、fontSizeInPixelフィールド追加
  - Branded Type活用: Pixels, Points, Inchesでの型安全な変換
  - 警告除去: fontSizeInPixelをYogaLayoutEngineで許可プロパティに追加
- **検証済み**: CLI実行でpt/px両対応、PPTX出力でpt単位正常表示確認

### deck/slide構造とJSON Schema実装（OSN-167）✅ 
- **概要**: SlideWeaveの構造をdeck/slide階層に変更し、JSON Schemaによるバリデーション機能を実装
- **URL**: https://linear.app/osna/issue/OSN-167/deckslide構造とjson-schema実装
- **完了内容**:
  - [x] TypeScript型定義の更新完了
  - [x] ajvバリデータークラス実装完了（SchemaValidator.ts）
  - [x] 基本ファイルの新構造移行完了（test01, test02シリーズ）
  - [x] バリデーション機能のテスト作成完了
  - [x] TailwindUtilities.tsから外部CSSファイルへの移行完了
  - [x] プリセット対応ディレクトリ構造実装完了（styles/standard/, styles/wide/）

## 緊急課題

### スライド背景とframe要素の設計・実装問題
- **問題**: frameのbackgroundColorがスライド背景になり、さらに図形として二重描画される
- **設計ミス**: 
  - frameの責務が曖昧（装飾付きコンテナ vs スライド背景）
  - スライド背景 vs 要素背景の区別が不明確
  - トップレベル要素でのcontainer/frame使い分けルール未定義
- **実装ミス**:
  - renderSlideBackground()がframe背景をスライド全体に適用
  - 72DPI/96DPI混在による座標変換エラー（修正済み）
- **階層構造の問題**:
  - トップレベルはslide要素でなければならない（現在はframe/containerが直接配置）
  - header/footerはslide直下のみ配置可能（frame/container内は不可）
  - PowerPointの構造制約に準拠した要素配置ルール未定義
- **背景の種類と配置ルール**:
  - スライド背景: slideレベル（全体背景色/画像）
  - 要素背景: frame/shape等の個別要素（styleプロパティ）
  - レイヤー背景: container/frame内（セクション背景）
- **検証が必要**:
  - [ ] PowerPointで画像やSVGをスライド背景として指定可能か検証
  - [ ] PPTXGenJSでのスライド背景API調査
  - [ ] 背景階層設計の再考（スライド背景 vs 要素背景 vs レイヤー背景）
  - [ ] PowerPoint構造制約の調査（header/footer配置ルール等）
  - [ ] CSSライブラリ（Yoga Layout）でのem/rem単位サポート状況調査
  - [ ] フォントサイズ継承チェーンの実装複雑度評価
- **今後のアクション**:
  - [ ] slide要素をトップレベル必須とするJSON構造見直し
  - [ ] header/footer配置制約のバリデーション実装
  - [ ] スライド背景の適切な実装方法決定
  - [ ] frame要素の責務明確化
  - [ ] 背景描画ロジックの設計見直し

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
- **OSN-168** DPI設定一貫性確保とformat別対応実装 ✅ (2025-07-02) - wide=96DPI、standard=72DPI、DPIConverter実装、measure関数修正
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