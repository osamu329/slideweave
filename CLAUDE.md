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
├── grid/                 # 8pxグリッドシステム
├── layout/               # css-layoutラッパー
├── renderer/             # PPTXGenJS統合
├── elements/             # 要素定義・バリデーション
└── types/                # TypeScript型定義

tests/                    # テストファイル
docs/                     # ドキュメント
```

## 開発方針

- 8px単位のグリッドシステム
- Object記法でのレイアウト定義
- PPTXGenJSを使用したPowerPoint生成
- TypeScript厳格モード
- テストカバレッジ80%以上

## 実装注意点

- css-layoutの動作は、検索せずに実装を確認すること。

## Linear Issue管理

- プロジェクトID: 9c6fdc43-13d0-40fb-aec4-b08409d49b60
- タスク形式: OSN-141形式のID
- 受け入れ条件をすべて満たしてからissue完了