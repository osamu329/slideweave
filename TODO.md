# SlideWeave TODO

## 現在進行中

### OSN-158: YogaLayoutEngineにgapプロパティのサポートを実装
- [ ] YogaLayoutEngineで`gap`プロパティを処理できること
- [ ] 8px単位での指定が可能であること (例: `gap: 2` → 16px)
- [ ] flexDirection: "row"と"column"の両方で動作すること
- [ ] 既存のテストケースが引き続き動作すること

## 未着手・バックログ

### 将来的な拡張
- [ ] 精緻なrounded border対応
  - frameに対してsvgを生成する。
  - rouded-border を正しく実装するにはshapeでは不十分。
  - 透過背景とグラデーション背景を実現するのもsvgのほうがよさそう（要検証）
- [ ] より複雑な3段組以上のレイアウト対応
- [ ] テーブル要素の実装
- [ ] 画像要素の実装
- [ ] SVG要素の実装

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
