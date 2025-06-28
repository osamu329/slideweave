# SlideWeave

TypeScriptベースのPowerPointスライド作成ライブラリ。8pxグリッドシステムとFlexbox風レイアウトによる構造化されたスライド生成を実現します。

## 特徴

- 🎯 **8pxグリッドシステム**: 精密な座標計算とデザイン整合性
- 📐 **Flexbox風レイアウト**: 直感的な縦積み・横並びレイアウト
- 🎨 **型安全性**: TypeScriptによる堅牢な型定義
- 📄 **PPTXGenJS統合**: PowerPointファイルの直接生成
- ✅ **バリデーション**: 要素の検証とエラーハンドリング

## インストール

```bash
npm install css-layout pptxgenjs
```

## 基本的な使用方法

```typescript
import { LayoutEngine } from './src/layout/LayoutEngine';
import { PPTXRenderer } from './src/renderer/PPTXRenderer';
import { ElementValidator } from './src/elements/validator';

// 1. 要素を定義
const element = {
  type: 'container',
  style: { padding: 2 },
  children: [
    { type: 'text', content: 'Hello' },
    { type: 'text', content: 'World' }
  ]
};

// 2. バリデーション
const validation = ElementValidator.validate(element);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}

// 3. レイアウト計算
const layout = LayoutEngine.render(element, 720, 540);

// 4. PPTX生成
const renderer = new PPTXRenderer();
const pptx = renderer.render(layout);

// 5. ファイル保存
await renderer.save('output.pptx');
```

## アーキテクチャ

### コアコンポーネント

- **GridSystem**: 8px単位の座標系管理
- **ElementValidator**: 要素タイプの検証
- **LayoutEngine**: css-layoutを使用したレイアウト計算
- **PPTXRenderer**: PPTXGenJSを使用したファイル生成

### 対応要素タイプ

- `container`: レイアウト基本単位
- `text`: 基本テキスト表示
- `heading`: レベル付き見出し (1-6)
- `slide`, `slideHeader`, `slideBody`, `slideFooter`: スライド構造

## 8pxグリッドシステム

```typescript
import { GridSystem } from './src/grid/GridSystem';

// グリッド単位 → ポイント変換
GridSystem.toPoints(2); // 12pt (16px)

// ポイント → インチ変換
GridSystem.toInches(72); // 1.00in

// PPTXGenJS用座標生成
GridSystem.getPositionOptions(1, 2, 10, 5);
// { x: 0.08, y: 0.17, w: 0.83, h: 0.42 }
```

## レイアウト例

### 縦積みレイアウト

```typescript
const verticalLayout = {
  type: 'container',
  style: { 
    direction: 'column',
    padding: 2 
  },
  children: [
    { type: 'heading', content: 'タイトル', level: 1 },
    { type: 'text', content: '本文テキスト' }
  ]
};
```

### 横並びレイアウト

```typescript
const horizontalLayout = {
  type: 'container',
  style: { 
    direction: 'row',
    padding: 1 
  },
  children: [
    { type: 'text', content: '左側' },
    { type: 'text', content: '右側' }
  ]
};
```

## 開発・テスト

```bash
# 開発
npm run dev

# ビルド
npm run build

# テスト実行
npm run test

# 型チェック
npm run typecheck

# Lint
npm run lint
```

## テスト結果

- **単体テスト**: 55件中54件通過（1件スキップ）
- **統合テスト**: end-to-endテスト完備
- **パフォーマンス**: 100要素レンダリング < 1秒
- **品質**: TypeScript厳格モード、ESLint準拠

## プロジェクト構造

```
src/
├── grid/           # 8pxグリッドシステム
├── types/          # TypeScript型定義
├── elements/       # 要素定義・バリデーション
├── layout/         # css-layoutラッパー
└── renderer/       # PPTXGenJS統合

tests/              # テストファイル
├── integration.test.ts  # 統合テスト
├── GridSystem.test.ts
├── ElementValidator.test.ts
├── LayoutEngine.test.ts
└── PPTXRenderer.test.ts
```

## ライセンス

MIT