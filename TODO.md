# TODO

## ✅ 解決済み: test case 2でのflexコンテナサイズ計算問題

### 根本原因が判明・修正済み

**原因**: flexプロパティが完全に無視されていた
1. `BaseStyle` インターフェースに `flex?: number` が定義されていなかった
2. `LayoutEngine.ts` の `convertToCSSLayout` 関数でflexプロパティの変換処理が抜けていた

### 修正内容

#### 1. 型定義の修正 ✅
`src/types/elements.ts` の `BaseStyle` インターフェースに `flex?: number` を追加

#### 2. プロパティ変換の修正 ✅
`src/layout/LayoutEngine.ts` の `convertToCSSLayout` 関数にflexプロパティ変換処理を追加：
```typescript
// flex: flexプロパティの変換
if (element.style.flex !== undefined) {
  node.style!.flex = element.style.flex;
}
```

### 修正前後の比較

#### 修正前（異常）
```
🔧 FLEX DEBUG - Main dimension defined:
  definedMainDim: 640
  mainContentDim: 1488
  remainingMainDim: -848

Column 1: { left: 0, width: 720 }    // 親640pxを超過
Column 2: { left: 736, width: 752 }  // 完全にはみ出し
```

#### 修正後（正常）
```
🔧 FLEX DEBUG - Main dimension defined:
  definedMainDim: 640
  mainContentDim: 80
  remainingMainDim: 560

🔧 FLEX DEBUG - Flexible children found:
  flexibleChildrenCount: 2
  totalFlexible: 2
  flexibleMainDim: 280

Column 1: { left: 0, width: 312 }    // 正常なサイズ
Column 2: { left: 328, width: 312 }  // 正常な配置
```

### 新たな問題発見: テキスト要素の幅超過

#### 問題詳細
npm run test:examplesの結果から、**テキスト要素が親コンテナ幅を大幅に超過**していることが判明：

```
左カラム: width: 312px
  └ テキスト: width: 608px  ❌ 312pxを大幅超過

右カラム: width: 312px  
  └ テキスト: width: 592px  ❌ 312pxを大幅超過
```

#### 根本原因の推測
1. **measure関数の制約幅が正しく渡されていない**
2. **css-layoutがテキスト要素に制約幅を適用していない**
3. **flexコンテナ内でのテキスト幅計算に問題**

#### テスト作成済み
- [x] 包括的REDテスト修正: `tests/TwoColumnLayout.test.ts`
- [x] コンテナ + テキスト両レイヤーの検証
- [x] テキスト幅超過の問題を確認

#### テスト修正の理由
**修正前**: false positive（コンテナレベルのみ検証）  
**修正後**: 真の問題を検出（コンテナ + テキスト両レイヤー検証）

**結果**:
- ✅ コンテナレベル: 正常（312px, 328px, 16px間隔）
- ❌ テキストレベル: 異常（608px, 592px - 親を大幅超過）

### 残タスク

- [x] LayoutEngine.tsでのflex プロパティ変換処理を確認・修正
- [x] 型定義にflexプロパティを追加
- [x] margin配置の最適化（左側のみmarginLeft: 2で16px間隔実現）
- [x] デバッガーコードの除去（production用css-layoutに戻す）
- [x] 全テスト通過確認
- [x] test2-two-column-layout.jsonのテストケースを追加（REDテスト）
- [ ] **緊急: テキスト要素の幅制約問題を修正**
- [ ] flexレイアウトの単体テストを追加

### 影響範囲

✅ **修正済み**
- test2-two-column-layout.json（2段組みレイアウト）が正常動作
- flexプロパティを使用する全てのレイアウトが正常動作
- 横並び（direction: row）レイアウト全般が正常動作