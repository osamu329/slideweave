# SVGすりガラス風エフェクト実装ガイド

## 基本的な考え方

現代的なすりガラス効果は**マットな質感**と**控えめな反射**が特徴。従来の光沢感のあるガラス表現は避ける。

## 実装方法

### 1. ベースのガラス効果
```svg
<linearGradient id="glassEffect" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:rgba(255,255,255,0.25)"/>
    <stop offset="50%" style="stop-color:rgba(255,255,255,0.15)"/>
    <stop offset="100%" style="stop-color:rgba(255,255,255,0.1)"/>
</linearGradient>
```

### 2. エッジ強調（二重ボーダー）
```svg
<!-- 外側ボーダー -->
<rect fill="url(#glassEffect)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
<!-- 内側ボーダー -->
<rect fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
```

### 3. 背景ブラー（mask技術）
```svg
<mask id="glassMask">
    <rect width="100%" height="100%" fill="black"/>
    <rect x="50" y="50" width="200" height="150" rx="20" fill="white"/>
</mask>

<!-- 背景画像（通常） -->
<image href="background.jpg"/>
<!-- 背景画像（ブラー、ガラス部分のみ） -->
<image href="background.jpg" filter="url(#blur)" mask="url(#glassMask)"/>
```

## 重要なポイント

### ✅ やること
- **マットな透明度**: 0.1～0.25の範囲
- **段階的グラデーション**: 上から下に向かって透明度を下げる
- **二重ボーダー**: 外側と内側で立体感を演出
- **角丸**: 現代的な印象のため

### ❌ 避けること
- **明示的な反射**: 左上の白いハイライトなど
- **強い光沢**: 透明度0.5以上の明るい要素
- **過度なブラー**: 輪郭が分からなくなるレベル

## 効率的な複数フレーム実装

1つの背景画像で複数のガラスフレームを実現：

```svg
<!-- 背景画像（1回のみ定義） -->
<image id="bg" href="background.jpg"/>

<!-- フレーム1用ブラー -->
<use href="#bg" filter="url(#blur)" mask="url(#mask1)"/>
<!-- フレーム2用ブラー -->
<use href="#bg" filter="url(#blur)" mask="url(#mask2)"/>

<!-- ガラスパネル -->
<rect fill="url(#glassEffect)"/>
```

## 用途別の使い分け

### PowerPoint向け
- **背景分離**: スライド背景 + SVGガラスパネル
- **軽量化**: ガラス効果のみに特化

### Web向け
- **CSS backdrop-filter**: ブラウザ対応環境
- **SVG fallback**: 非対応環境用

### 汎用SVG
- **Base64埋め込み**: 完全自己完結
- **外部参照**: ファイルサイズ重視

## まとめ

現代的なすりガラス効果は**シンプルで上品**が基本。過度な装飾を避け、マットな質感と自然な透明感を重視する。
