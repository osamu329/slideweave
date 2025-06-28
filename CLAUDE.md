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

# サンプル実行（全テスト）
npm run test:examples

# サンプル実行（個別）
npx tsx examples/runAllTests.ts
npx tsx examples/runTest.ts test3-colors.json

# PPTX検証（python-pptx使用）
uv run scripts/verify-pptx.py examples/output/test3-colors.pptx

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
scripts/                  # Python検証スクリプト
│   └── verify-pptx.py    # PPTX内容検証（uv run）
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

## margin/padding適用戦略

### 基本原則
- **margin**: レイアウトレベルで処理（要素間隔）
- **padding**: PowerPointレベルで処理（テキストフレーム内マージン）

### レイアウトエンジン（YogaLayoutEngine/CSSLayoutEngine）
- **margin**: 8px単位をピクセルに変換してレイアウト計算
- **padding**: 8px単位をピクセルに変換してレイアウト計算
- 両方ともLayoutResultの座標計算に反映

### PPTXRenderer
- **margin**: レイアウトエンジンで処理済みのため、PowerPointには渡さない
- **padding**: element.style.paddingを8px単位でPowerPointのmarginオプションに適用

### 実装例
```typescript
// 正しい実装（text/heading共通）
const textOptions = {
  ...position,
  margin: element.style?.padding !== undefined ? element.style.padding * 8 : 0, // paddingのみ適用
  // marginプロパティは使用しない（レイアウトエンジンで処理済み）
};
```

### 責務分離
- **LayoutEngine**: 要素配置・間隔計算（margin処理）
- **PPTXRenderer**: PowerPointオブジェクト描画（padding処理）

## Linear Issue管理

- プロジェクトID: 9c6fdc43-13d0-40fb-aec4-b08409d49b60
- チームID: 73d85668-eb02-4c0d-be2a-8ef1b922d78c (Osna)
- タスク形式: OSN-141形式のID
- 受け入れ条件をすべて満たしてからissue完了

### Issue Status ID
- Backlog: 952cb8a6-8ad5-41b9-9bd2-d219b3a83abc
- Todo: 22734169-f500-4b5f-8bdb-34d70f23240d  
- In Progress: 57625a13-6ed7-48b6-9815-1341fa5a4530
- In Review: f1873beb-1124-4ab5-8650-6f63ebc844e1
- Done: 34082a62-de00-4edf-98cc-b99f060c8aaa
- Canceled: 79170ff1-299e-4fb1-80a7-fa6d34eace48
- Duplicate: 62cefbd1-fcfb-4915-a9f5-45b3ef94b527

### 🚨 必須ルール（Git hookで自動チェック）
1. **着手時**: Linear issueのstatusを"In Progress"に必ず更新する
2. **コミット時**: コミットメッセージにissue ID (OSN-XXX)を必ず含める
3. **完了時**: 受け入れ条件確認後にstatusを"Done"に更新する

### Git Hook自動チェック機能
- **pre-commit**: issue ID未記載でコミット拒否
- **commit-msg**: status更新リマインダー表示
- **prepare-commit-msg**: ブランチ名からissue ID自動挿入

### 作業開始時チェックリスト
- [ ] Linear issueを作成
- [ ] issueのstatusを"In Progress"に更新
- [ ] 適切なbranchを作成 (`osamu0329nakamura/osn-XXX-description`)
- [ ] TodoWriteでタスク管理開始


## テスト駆動開発（t-wada TDDベース）

### TDD原則
1. **Red**: 失敗するテストを先に書く
2. **Green**: テストが通る最小限の実装
3. **Refactor**: 重複を排除し、設計を改善

### 開発フロー
1. **単体テスト作成**: 期待する動作を明確にするテストを先に書く
2. **テスト実行**: 必ず失敗することを確認（Red）
3. **最小実装**: テストが通る最小限のコードを書く（Green）
4. **リファクタリング**: コードの重複排除と設計改善（Refactor）
5. **examples/確認**: JSONテストケースで統合的な動作確認
6. **PPTX検証**: `uv run scripts/verify-pptx.py`で実際の出力確認
7. **サイクル繰り返し**: 次の機能について1-6を繰り返す

### テスト設計原則
- **1つのテストは1つの仕様のみテスト**
- **Given-When-Then構造でテストを記述**
- **境界値・異常系もテスト**
- **テストが仕様書の役割を果たす**

### 検証ツール
- **python-pptx検証**: PPTXの実際の内容を解析（`uv run scripts/verify-pptx.py`）
- **手動確認**: 最終的な視覚確認

### 単体テストの配置
- レイアウトエンジン: `src/layout/__tests__/`
- レンダラー: `src/renderer/__tests__/`
- バリデーター: `src/elements/__tests__/`

## 開発における注意事項

- 開発は、issueの特定・計画・実装にわけて行います
- すぐにコードを修正せず、まずテストケースで問題を明確化します
- Linear issueは実装前に作成し、受け入れ条件を明確にします