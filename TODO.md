# SlideWeave TODO

## 現在進行中

- [ ] 背景画像の上にグラス風SVGエフェクトのフレームを実現する。
  - [ ] examples/test06-3-glass-only.json が正しく動作させる
  - [ ] SVG指定したフレームの背景が真っ白になってしまい、透過が機能しない問題を調査修正する
  - [ ] pptxgenjs のAPIを直接コールして問題点を確認する。rgba(...) 指定が動作していないかもしれないという仮説を検証したい。

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
