# SlideWeave

TypeScriptベースのPowerPointスライド作成ツール。Yoga LayoutエンジンによるFlexbox風レイアウトで構造化されたスライド生成を実現します。

## 特徴

- 🎯 **明示的CSS単位**: px, %, vw, vh, ptによる精密な座標計算
- 📐 **Yoga Layout Engine**: Facebook製のFlexboxライクなレイアウト
- 🎨 **型安全性**: TypeScriptによる堅牢な型定義
- 📄 **PPTXGenJS統合**: PowerPointファイルの直接生成
- ✅ **スキーマバリデーション**: JSON Schema準拠の要素検証
- 🎭 **CSS-like記法**: PostCSS処理でのスタイル指定
- 🖥️ **CLI機能**: コマンドライン操作でのファイル生成

## インストール

```bash
npm install
```

### 必要な依存関係

- `pptxgenjs`: PowerPoint生成
- `yoga-layout`: レイアウト計算  
- `postcss`: CSS処理
- `commander`: CLI機能

## 基本的な使用方法

### CLI（推奨）

```bash
# JSON → PPTX生成
npx tsx src/cli/index.ts build examples/test01-basic-layout.json

# カスタム出力パス
npx tsx src/cli/index.ts build examples/test01-basic-layout.json -o output.pptx

# 詳細ログ
npx tsx src/cli/index.ts build examples/test01-basic-layout.json --verbose
```

### プログラム的使用方法

```typescript
import { buildSlides } from './src/cli/commands/build.js';

// JSONファイルからPPTX生成
await buildSlides('input.json', { 
  output: 'output.pptx',
  verbose: true 
});
```

### JSON形式の例

```json
{
  "type": "deck",
  "slides": [{
    "layout": "standard",
    "elements": [{
      "type": "container",
      "style": { 
        "flexDirection": "column",
        "padding": "8px"
      },
      "children": [
        { "type": "heading", "content": "タイトル", "level": 1 },
        { "type": "text", "content": "本文テキスト" }
      ]
    }]
  }]
}
```

## アーキテクチャ

### コアコンポーネント

- **YogaLayoutEngine**: Facebook Yoga（Flexbox実装）を使用したレイアウト計算
- **SchemaValidator**: JSON Schema準拠の要素バリデーション
- **PPTXRenderer**: PPTXGenJSを使用したPowerPoint生成
- **SVGGenerator**: 複雑な装飾（背景色、ボーダー等）のSVG生成
- **SlideDataLoader**: JSON入力の前処理とデフォルト値適用
- **PostCSS処理**: CSS-like記法のサポート
- **DPIConverter**: 単位変換（px⇔inch⇔pt）の統一管理

### 対応要素タイプ

- `deck`: スライドデッキ（複数スライドのコンテナ）
- `slide`: 個別スライド
- `container`: レイアウト専用コンテナ（描画なし）
- `frame`: 装飾付きコンテナ（背景色・ボーダー等）
- `text`: 基本テキスト表示
- `heading`: レベル付き見出し (1-6)
- `shape`: 図形（rectangle, circle, ellipse等）
- `image`: 画像表示

## 単位システム

SlideWeaveは明示的CSS単位（px, %, vw, vh, pt）をサポートします。

```json
{
  "style": {
    "width": "640px",
    "height": "480px", 
    "margin": "16px",
    "padding": "8px",
    "fontSize": "14pt"
  }
}
```


## レイアウト例

### 縦積みレイアウト（Column）

```json
{
  "type": "container",
  "style": { 
    "flexDirection": "column",
    "padding": "8px"
  },
  "children": [
    { "type": "heading", "content": "タイトル", "level": 1 },
    { "type": "text", "content": "本文テキスト" }
  ]
}
```

### 横並びレイアウト（Row）

```json
{
  "type": "container", 
  "style": { 
    "flexDirection": "row",
    "padding": "4px"
  },
  "children": [
    { "type": "text", "content": "左側" },
    { "type": "text", "content": "右側" }
  ]
}
```

### 装飾付きフレーム

```json
{
  "type": "frame",
  "style": {
    "backgroundColor": "#f0f0f0",
    "borderRadius": "8px",
    "padding": "16px"
  },
  "children": [
    { "type": "text", "content": "背景色付きフレーム" }
  ]
}
```

## 開発・テスト

```bash
# 開発
npm run dev

# ビルド
npm run build

# テスト実行
npm run test

# サンプル実行（全テスト）
npm run test:examples

# サンプル実行（個別）
npx tsx examples/runTest.ts test01-basic-layout.json

# 型チェック
npm run typecheck

# Lint
npm run lint

# PPTX検証（python-pptx使用）
uv run scripts/verify-pptx.py examples/output/test01-basic-layout.pptx
```

## 現在のテスト状況

- **型チェック**: ✅ エラーなし
- **テスト実行**: ⚠️ 219/310 通過（28%失敗）
- **主要課題**: 
  - fontSizeのpt単位サポート問題
  - 無次元数値の警告
  - PPTXRendererの一部API不整合
- **品質**: TypeScript厳格モード、ESLint準拠

## プロジェクト構造

```
src/
├── cli/                  # CLI機能
│   ├── commands/         # buildコマンド等
│   └── utils/           # ログ・設定・エラーハンドリング
├── css-processor/       # PostCSS処理
├── data/               # JSONデータローダー
├── elements/           # スキーマ・ランタイムバリデーション
├── jsx/                # JSX記法サポート（実験的）
├── layout/             # Yogaレイアウトエンジン
├── renderer/           # PPTXGenJS統合
├── svg/                # SVG生成（背景・装飾）
├── types/              # TypeScript型定義
└── utils/              # DPI変換・ファイル管理

examples/               # テストケース・サンプル
├── output/             # 生成されたPPTXファイル
├── runTest.ts          # 個別テスト実行
└── runAllTests.ts      # 全テスト実行

tests/                  # 統合テスト
scripts/                # Python検証スクリプト
docs/                   # PPTXGenJS APIドキュメント
```

### 主要ファイル

- `src/cli/index.ts`: CLIエントリーポイント
- `src/layout/YogaLayoutEngine.ts`: レイアウト計算
- `src/renderer/PPTXRenderer.ts`: PowerPoint生成
- `src/svg/SVGGenerator.ts`: SVG装飾生成
- `examples/test01-basic-layout.json`: 基本例

## ライセンス

MIT