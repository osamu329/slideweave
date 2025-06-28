# SlideWeave - PowerPoint Slide Creation Tool

## プロジェクト概要

TypeScriptベースのPowerPointスライド作成ツール。8pxグリッドシステムとFlexbox風レイアウトを使用した構造化されたスライド生成を実現。

## 技術スタック

- **言語**: TypeScript
- **ライブラリ**: PPTXGenJS, css-layout
- **テスト**: Jest
- **Lint**: ESLint

## ビルド・テストコマンド

```bash
# 開発
npm run dev

# ビルド
npm run build

# テスト
npm run test

# Lint
npm run lint

# 型チェック
npm run typecheck
```

## プロジェクト構造

```
src/
├── index.ts              # エントリーポイント
├── data/                 # データローダー
│   └── SlideDataLoader.ts
├── elements/             # 要素定義・バリデーション
│   └── validator.ts
├── grid/                 # 8pxグリッドシステム
│   └── GridSystem.ts
├── layout/               # レイアウトエンジン
│   ├── ILayoutEngine.ts  # インターフェース定義
│   ├── LayoutEngine.ts   # メインレイアウトエンジン
│   ├── CSSLayoutEngine.ts # css-layoutラッパー
│   ├── YogaLayoutEngine.ts # Yogaレイアウトエンジン
│   ├── css-layout-debug.js # デバッグ用
│   ├── css-layout-debug.d.ts
│   └── __tests__/
│       └── LayoutEngine.test.ts
├── renderer/             # PPTXGenJS統合
│   └── PPTXRenderer.ts
└── types/                # TypeScript型定義
    ├── elements.ts       # 要素型定義
    └── css-layout.d.ts   # css-layout型定義

tests/                    # テストファイル  
docs/                     # ドキュメント
output/                   # 生成されたPPTXファイル
```

## 開発方針

- 8px単位のグリッドシステム
- Object記法でのレイアウト定義
- PPTXGenJSを使用したPowerPoint生成
- TypeScript厳格モード
- テストカバレッジ80%以上

## 実装注意点

- css-layoutの動作は、検索せずに実装を確認すること。
- レイアウト計算を独自に実装しないこと。レンダリングエンジンの責務を理解することが大事です。

## Linear Issue管理

- プロジェクトID: 9c6fdc43-13d0-40fb-aec4-b08409d49b60
- タスク形式: OSN-141形式のID
- 受け入れ条件をすべて満たしてからissue完了