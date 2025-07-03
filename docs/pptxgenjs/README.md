# PPTXGenJS API Documentation

このディレクトリには、PPTXGenJSライブラリのAPIドキュメントをMarkdown形式で格納しています。元のHTMLドキュメントをローカルで参照できるように変換したものです。

## ファイル一覧

| ファイル | 説明 | 元URL |
|---------|------|-------|
| [api-images.md](./api-images.md) | 画像API | https://gitbrent.github.io/PptxGenJS/docs/api-images/ |
| [api-text.md](./api-text.md) | テキストAPI | https://gitbrent.github.io/PptxGenJS/docs/api-text/ |
| [api-shapes.md](./api-shapes.md) | 図形API | https://gitbrent.github.io/PptxGenJS/docs/api-shapes/ |
| [api-media.md](./api-media.md) | メディアAPI | https://gitbrent.github.io/PptxGenJS/docs/api-media/ |
| [api-tables.md](./api-tables.md) | テーブルAPI | https://gitbrent.github.io/PptxGenJS/docs/api-tables/ |
| [masters.md](./masters.md) | マスター・プレースホルダー | https://gitbrent.github.io/PptxGenJS/docs/masters/ |
| [sections.md](./sections.md) | セクション | https://gitbrent.github.io/PptxGenJS/docs/sections/ |
| [shapes-and-schemes.md](./shapes-and-schemes.md) | 図形とスキーム | https://gitbrent.github.io/PptxGenJS/docs/shapes-and-schemes/ |
| [speaker-notes.md](./speaker-notes.md) | スピーカーノート | https://gitbrent.github.io/PptxGenJS/docs/speaker-notes/ |
| [types.md](./types.md) | 型定義 | https://gitbrent.github.io/PptxGenJS/docs/types/ |

## よく使用されるAPI

### SlideWeaveで頻繁に参照されるAPI

1. **[api-images.md](./api-images.md)** - SVG/Data URI画像の埋め込み
2. **[api-text.md](./api-text.md)** - テキスト描画とフォーマット
3. **[api-shapes.md](./api-shapes.md)** - 図形描画
4. **[types.md](./types.md)** - 型定義とインターフェース

### 重要なプロパティ

- **位置・サイズ**: `x`, `y`, `w`, `h` (インチまたはパーセント)
- **画像**: `path` vs `data` パラメータの使い分け
- **背景**: スライド背景でのData URI対応
- **SVG処理**: Data URI形式での画像埋め込み

## 更新について

これらのドキュメントは定期的に元のWebサイトと同期させる必要があります。元のドキュメントが更新された場合は、対応するMarkdownファイルも更新してください。

## PPTXGenJS公式リンク

- [GitHub Repository](https://github.com/gitbrent/PptxGenJS)
- [Official Documentation](https://gitbrent.github.io/PptxGenJS/docs/)
- [TypeScript Definitions](https://github.com/gitbrent/PptxGenJS/blob/master/types/index.d.ts)