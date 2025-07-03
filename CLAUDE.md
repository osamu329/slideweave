# SlideWeave - PowerPoint Slide Creation Tool

# 🚨 作業開始前の必須手順（例外なし実行）

## Step 1: 現状確認（REQUIRED）
- [ ] `npm run typecheck` を実行してエラー数を確認
- [ ] `npm run test` を実行してテスト状況を確認  
- [ ] Linear issueの受け入れ条件を読み、未完了項目をリストアップ
- [ ] 「実装済み」「完了済み」の思い込みを排除

## Step 2: 完了条件の明文化（REQUIRED）
- [ ] 「何をもって完了とするか」を検証可能な形で明記
- [ ] 例：「型定義完了」→「npm run typecheck でエラー0件」
- [ ] 受け入れ条件を現状に合わせて更新

## Step 3: 影響範囲調査（REQUIRED）  
- [ ] `grep -r "修正対象" src/` で依存ファイルをリストアップ
- [ ] エラーが出ているファイルの関連コンポーネントを特定
- [ ] 修正順序を計画

⚠️ この手順を飛ばした場合、即座に作業を停止してStep 1から再開する

# 📈 作業フェーズ構造（順次実行必須）

## Phase 0: 前提条件確認
- [ ] 前回作業の内容・状況は一切信用しない宣言
- [ ] 現在のブランチ・コミット状況確認
- [ ] 作業環境の初期化（npm install等）
- [x] どのフェーズを実施ているかプロンプトに表示すること

## Phase 1: issueの確認と達成基準の明確化
- [ ] Linear issueの受け入れ条件を詳細に読み込み
- [ ] 達成基準を検証可能な形で明文化
- [ ] 現状と理想状態のギャップを具体的に特定

## Phase 2: 修正方針の決定
- [ ] 複数の解決策を検討（最低2つ以上）
- [ ] 各案のメリット・デメリット・リスク評価
- [ ] 選択した方針の根拠を明記

## Phase 3: 品質担保の事前計画
- [ ] テスト戦略の策定（単体・統合・E2E）
- [ ] 品質基準の設定（カバレッジ・パフォーマンス等）
- [ ] レビュー観点の事前定義

## Phase 4: TDDによる修正
- [ ] Red: 失敗するテストを先に作成
- [ ] Green: テストが通る最小限の実装
- [ ] Refactor: 設計改善と重複排除

## Phase 5: 修正完了の確認とセルフレビュー
- [ ] 品質担保計画の履行確認
- [ ] テストカバレッジの達成確認
- [ ] REDテストの存在確認（TDD順守）
- [ ] コード品質の自己評価

## Phase 6: 受け入れ条件の再確認（自己批判的に）
- [ ] 全受け入れ条件の達成状況を厳格にチェック
- [ ] 自己批判的な視点での見直し
- [ ] Linear issueステータスを"In Review"に更新

## Phase 7: 影響範囲の検証
- [ ] 修正が他のコンポーネントに与える影響確認
- [ ] 依存関係のある全ファイルでの動作確認
- [ ] 統合テストの実行

## Phase 8: ドキュメント・コミット準備
- [ ] 修正内容の変更履歴記録
- [ ] CLAUDE.md更新（必要に応じて）
- [ ] コミットメッセージ作成（issue ID含む）
- [ ] Linear issue更新
- [ ] ユーザーに完了報告

## Phase 9: 最終確認・リリース判定
- [ ] ユーザーによる最終承認確認
- [ ] Linear issueステータスを"Done"に更新
- [ ] 次回作業の提案（必要に応じて）

⚠️ 各フェーズは順次実行必須。前のフェーズが未完了の場合は次に進めない

## プロジェクト概要

TypeScriptベースのPowerPointスライド作成ツール。4pxグリッドシステムとFlexbox風レイアウトを使用した構造化されたスライド生成を実現。

## 技術スタック

- **言語**: TypeScript
- **ライブラリ**: PPTXGenJS, css-layout, PostCSS
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

## CLI機能 ✅

**Status**: 基本実装完了 (OSN-164)

SlideWeaveのコマンドラインインターフェース機能。tsxを使用して実行。

### 使用方法
```bash
# JSON → PPTX生成
npx tsx src/cli/index.ts build <input.json> [options]

# 例：基本的な使用方法
npx tsx src/cli/index.ts build examples/test01-basic-layout.json

# 例：カスタム出力ファイル名
npx tsx src/cli/index.ts build examples/test03-colors.json -o output.pptx

# 例：examples/output/に出力
npx tsx src/cli/index.ts build examples/test03-colors.json -o examples/output/test03-colors.pptx

# 例：詳細ログ
npx tsx src/cli/index.ts build examples/test01-basic-layout.json --verbose

# 注意：examplesディレクトリのJSONファイルからPPTX生成する場合
# examples/output/以下に出力することを推奨
npx tsx src/cli/index.ts build examples/<file>.json -o examples/output/<file>.pptx

# 設定ファイル初期化  
npx tsx src/cli/index.ts init

# ヘルプ・バージョン表示
npx tsx src/cli/index.ts --help
npx tsx src/cli/index.ts build --help
```

### 利用可能なオプション
- `-o, --output <file>`: 出力PowerPointファイルパス
- `--css <files...>`: 外部CSSファイル（未実装）
- `-c, --config <file>`: 設定ファイルパス  
- `--verbose`: 詳細ログ

### 設定ファイル
`slideweave.config.js`で出力設定、スライド設定をカスタマイズ可能。

## プロジェクト構造

```
src/
├── index.ts              # エントリーポイント
├── cli/                  # CLI機能 ✅
│   ├── index.ts          # CLIメインエントリー
│   ├── commands/
│   │   ├── build.ts      # buildコマンド実装
│   │   ├── init.ts       # initコマンド実装
│   │   └── index.ts
│   ├── utils/
│   │   ├── logger.ts     # カラーログ出力
│   │   ├── config.ts     # 設定ファイル管理
│   │   └── errors.ts     # エラーハンドリング
│   └── __tests__/
├── data/                 # データローダー
│   └── SlideDataLoader.ts
├── elements/             # 要素定義・バリデーション
│   └── validator.ts
├── grid/                 # 4pxグリッドシステム
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
├── svg/                  # SVG生成
│   └── SVGGenerator.ts
├── css-processor/        # CSS処理
│   ├── CSSStyleParser.ts
│   └── CSSStylesheetParser.ts
├── utils/               # ユーティリティ
│   └── TempFileManager.ts
└── types/                # TypeScript型定義
    ├── elements.ts       # 要素型定義
    └── css-layout.d.ts   # css-layout型定義

bin/
└── slideweave.js         # CLI実行ファイル

tests/                    # テストファイル
scripts/                  # Python検証スクリプト
│   └── verify-pptx.py    # PPTX内容検証（uv run）
docs/                     # ドキュメント
output/                   # 生成されたPPTXファイル
```

## 開発方針

- 明示的CSS単位システム（px, %, vw, vh）
- Object記法でのレイアウト定義
- PPTXGenJSを使用したPowerPoint生成
- TypeScript厳格モード
- テストカバレッジ80%以上

## 単位システム

SlideWeaveは明示的CSS単位のみをサポートします：

### サポート単位
```json
{
  "style": {
    "width": "640px",     // ピクセル単位
    "height": "480px",    // ピクセル単位
    "margin": "16px",     // ピクセル単位
    "padding": "8px",     // ピクセル単位
    "width": "50%",       // パーセンテージ
    "height": "100vh",    // ビューポート高さ
    "width": "75vw"       // ビューポート幅
  }
}
```

### 無次元数値の扱い
- **非対応**: 無次元数値（例: `width: 30`）は警告が表示されます
- **例外**: `flex`, `opacity`, `z-index`等の特定プロパティは無次元数値を許可
- **フォールバック**: 無次元数値は自動的に`px`単位として解釈されます

## 設計ポイント

### 単位システムの責務分離
- **StyleConverter**: 単位付き文字列をそのまま渡し、無次元数値には警告を表示
- **YogaLayoutEngine**: 単位付き文字列をYogaライブラリに直接渡す
- **Yogaライブラリ**: px, %, vw, vh等のCSS単位を直接処理

### frame背景描画のSVG化
- **従来**: PPTXGenJSのaddShapeで背景色描画
- **新方式**: SVGGeneratorでSVG生成 → addImageで描画
- **利点**: borderRadius等の複雑な装飾に対応、透過背景・グラデーションも将来対応可能

### TDD実践
- **Red**: 失敗するテストケースを先に作成
- **Green**: テストが通る最小限の実装
- **Refactor**: 設計を改善、重複排除

### PostCSSベースCSSライクスタイルシート機能 🚧
- **OSN-162進行中**: CSSライクな記述でのスタイル指定機能
- **目標**: JSONベース → CSSライク記述への移行
- **対応範囲**: PowerPoint再現可能なCSSプロパティのみ
- **実装方針**: PostCSS → JSONスタイルオブジェクト変換
- **警告システム**: 非対応CSSプロパティの検出・代替案提示

#### 対応予定CSSプロパティ
- **レイアウト**: `width`, `height`, `padding`, `margin`, `flex-direction`
- **背景**: `background-color`, `background-image`
- **テキスト**: `font-size`, `font-family`, `color`, `text-align`
- **境界**: `border`, `border-radius`

#### 非対応CSSプロパティ（PowerPoint制約）
- **フレックスボックス詳細**: `justify-content`, `align-items`, `flex-wrap`
- **グリッド**: `display: grid`, `grid-template-*`
- **疑似要素**: `::before`, `::after`
- **メディアクエリ**: `@media`

## 実装注意点

- css-layoutの動作は、検索せずに実装を確認すること。
- レイアウト計算を独自に実装しないこと。レンダリングエンジンの責務を理解することが大事です。

## margin/padding適用戦略

### 基本原則
- **margin**: レイアウトレベルで処理（要素間隔）
- **padding**: PowerPointレベルで処理（テキストフレーム内マージン）

### レイアウトエンジン（YogaLayoutEngine/CSSLayoutEngine）
- **margin**: 4px単位をピクセルに変換してレイアウト計算
- **padding**: 4px単位をピクセルに変換してレイアウト計算
- 両方ともLayoutResultの座標計算に反映

### PPTXRenderer
- **margin**: レイアウトエンジンで処理済みのため、PowerPointには渡さない
- **padding**: element.style.paddingを4px単位でPowerPointのmarginオプションに適用

### 実装例
```typescript
// 正しい実装（text/heading共通）
const textOptions = {
  ...position,
  margin: element.style?.padding !== undefined ? element.style.padding * 4 : 0, // paddingのみ適用
  // marginプロパティは使用しない（レイアウトエンジンで処理済み）
};
```

### 責務分離
- **LayoutEngine**: 要素配置・間隔計算（margin処理）
- **PPTXRenderer**: PowerPointオブジェクト描画（padding処理）

## 要素タイプ設計

### container vs frame の責務分離

#### container要素
- **目的**: 純粋なレイアウト専用コンテナ
- **PowerPoint描画**: なし（レイアウト計算のみ）
- **背景色**: 指定されても描画しない
- **用途**: flexboxライクなレイアウト構造

#### frame要素  
- **目的**: 装飾付きコンテナ（背景色・ボーダー等）
- **PowerPoint描画**: あり（shapeオブジェクト生成）
- **背景色**: backgroundColor指定時に描画
- **用途**: 視覚的な枠・背景が必要な場合

#### shape要素
- **目的**: 図形専用（rectangle, circle, ellipse等）
- **PowerPoint描画**: あり（shapeオブジェクト生成）
- **背景色**: backgroundColor指定時に描画
- **用途**: 純粋な図形描画

### 設計原則
- **container**: レイアウトのみ、描画なし
- **frame**: レイアウト + 装飾描画
- **shape**: 図形描画のみ

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

## Branded Type システム ✅

**Status**: 実装完了 (OSN-169)

SlideWeaveでは型安全性を確保するため、Branded Type システムを採用しています。

### 単位別Branded Type定義

```typescript
// src/types/units.ts
export type Pixels = number & { __brand: 'px' };
export type Points = number & { __brand: 'pt' };  
export type Inches = number & { __brand: 'inch' };

// ファクトリー関数
export const createPixels = (value: number): Pixels => value as Pixels;
export const createPoints = (value: number): Points => value as Points;
export const createInches = (value: number): Inches => value as Inches;
```

### 領域別の中心単位

#### 1. レイアウトエンジン（YogaLayoutEngine）
- **中心単位**: `Pixels` (px)
- **責務**: レイアウト計算、要素配置
- **変換**: CSS単位文字列をYogaライブラリに直接渡す
- **例**: `"640px"`, `"50%"`, `"100vw"`

#### 2. PowerPoint出力（PPTXWrapper/PPTXRenderer）
- **中心単位**: `Inches` (inch) 
- **責務**: PowerPoint座標系での描画
- **変換**: DPIConverterでpx→inch変換
- **例**: `position: { x: 1.5, y: 2.0, w: 4.0, h: 3.0 }` (inch)

#### 3. フォントサイズ処理
- **レイアウト**: `Pixels` (px) - Yogaでの文字測定
- **PowerPoint**: `Points` (pt) - PPTXGenJSでの実際の描画
- **変換**: DPIConverter.pxToPt()で変換
- **例**: `"16px"` → 12pt (PowerPoint)

#### 4. DPIConverter（変換ハブ）
- **責務**: 全単位間の相互変換
- **主要変換**:
  - `pxToInch()`: Pixels → Inches
  - `pxToPt()`: Pixels → Points  
  - `inchToPx()`: Inches → Pixels
- **DPI基準**: 96 DPI（標準）

### 型安全な変換パターン

```typescript
// ✅ 推奨: Branded Typeを使用
const widthPx = createPixels(640);
const widthInch = dpiConverter.pxToInch(widthPx);

// ✅ PPTXGenJS統合時のパターン
const fontSizePx = createPixels(16);
const fontSizePt = dpiConverter.pxToPt(fontSizePx) as number; // PPTXGenJS用

// ❌ 避ける: 生の数値の直接使用
const width = 640; // 単位が不明
```

### LayoutResult型定義

```typescript
export interface LayoutResult {
  left: Pixels;    // レイアウト座標（px）
  top: Pixels;     // レイアウト座標（px） 
  width: Pixels;   // 要素サイズ（px）
  height: Pixels;  // 要素サイズ（px）
  element: Element;
  children?: LayoutResult[];
}
```

### PPTXWrapper薄いラッパーパターン

```typescript
export class PPTXWrapper {
  // 単位変換を内部で処理
  addText(content: string, options: SlideWeaveTextOptions): void {
    const pptxOptions = {
      ...options,
      fontSize: this.dpiConverter.pxToPt(options.fontSize) as number,
    };
    this.currentSlide.addText(content, pptxOptions);
  }
}
```

### fontSize型システム統一

**Before (OSN-169前)**:
```typescript
// 後方互換性で複雑化
fontSize?: number | string;
```

**After (OSN-169後)**:
```typescript  
// 単位付き文字列に統一
fontSize?: string; // "16px", "14pt", etc.
```

### JSON記法の標準化

```json
{
  "type": "text",
  "content": "サンプルテキスト", 
  "style": {
    "fontSize": "16pt",      // PowerPoint用 (pt)
    "width": "300px",        // レイアウト用 (px) 
    "margin": "8px",         // 間隔 (px)
    "padding": "4px"         // パディング (px)
  }
}
```

### デフォルト値管理

- **デッキレベル**: SlideDataLoaderで`14pt`
- **YogaLayoutEngine**: デフォルト値なし（上流から必須）
- **PPTXRenderer**: fallback値は避ける

## デバッグコード管理 🚨

### 問題：DEBUGメッセージの本番コード残存

**なぜ残るのか:**
1. **開発時の一時的デバッグコード** - 特定の問題解決のために追加されたが削除を忘れる
2. **条件分岐による発見の困難** - 特定のテキスト（例: "左カラム"）でのみ実行されるため見落とす
3. **レビュー・検査体制の不備** - console.logの本番残存をチェックする仕組みがない

**対策:**

### 1. ESLintルールによる自動検出
```json
// .eslintrc.json
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }]
  }
}
```

### 2. Git Hook による事前チェック
```bash
# .git/hooks/pre-commit
#!/bin/sh
if grep -r "console\.log" src/ --include="*.ts" --exclude-dir="__tests__" --exclude-dir="test"; then
  echo "❌ console.log found in source code!"
  exit 1
fi
```

### 3. コードレビューチェックリスト
- [ ] `grep -r "console.log" src/` でDEBUGコードなし
- [ ] `grep -r "DEBUG" src/` で開発用コメントなし
- [ ] 条件分岐内のデバッグコード確認

### 4. ビルド時の自動削除（将来対応）
```javascript
// webpack.config.js
plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
]
```

### 5. デバッグコード記述規則
- **本番コード**: `console.log`は絶対禁止
- **テストコード**: `console.log`は許可
- **開発時のみ**: `if (process.env.NODE_ENV === 'development') console.log(...)`

### 修正済み削除例
```typescript
// ❌ 削除済み：本番コードに残っていたDEBUGメッセージ
// if (content === "左カラム") {
//   console.log(`[DEBUG] 左カラム測定:`, { ... });
// }
```

## メモリー

- DPIや変換にあちこちに定義しない。DPIConverterがその役目も果たす。

</invoke>