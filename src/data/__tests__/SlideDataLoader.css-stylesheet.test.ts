/**
 * SlideDataLoader CSSスタイルシート機能テスト
 * TDD: CSSライクスタイルシート機能の統合テスト
 */

import { SlideDataLoader } from '../SlideDataLoader';

describe('SlideDataLoader CSS Stylesheet Integration', () => {
  describe('CSS stylesheet processing', () => {
    test('should apply class styles to elements with className', () => {
      const slideData = {
        title: 'Test Slide',
        css: `
          .container {
            padding: 16px;
            background-color: #F0F8FF;
            flex-direction: row;
          }
          
          .header {
            font-size: 24pt;
            font-weight: bold;
            color: #333;
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                className: 'container',
                children: [
                  {
                    type: 'heading',
                    className: 'header',
                    content: 'Test Header'
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      // コンテナにクラススタイルが適用されている
      const container = result.slides[0].children![0] as any;
      expect(container.style).toEqual({
        padding: '16px',
        backgroundColor: '#F0F8FF',
        flexDirection: 'row'
      });

      // ヘディングにクラススタイルが適用されている
      const header = container.children[0] as any;
      expect(header.style).toEqual({
        fontSize: 24,      // pt単位が数値に変換
        fontWeight: 'bold',
        color: '#333'
      });
    });

    test('should merge class styles with inline styles (inline styles take precedence)', () => {
      const slideData = {
        title: 'Test Slide',
        css: `
          .base {
            padding: 16px;
            background-color: blue;
            color: white;
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                className: 'base',
                style: {
                  backgroundColor: 'red',  // これがクラススタイルを上書き
                  margin: 8               // これは追加される
                }
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '16px',
        backgroundColor: 'red',     // インラインスタイルが優先
        color: 'white',             // クラススタイルが適用
        margin: 8                   // インラインスタイルが追加
      });
    });

    test('should handle CSS string inline styles with class styles', () => {
      const slideData = {
        title: 'Test Slide',
        css: `
          .text {
            font-size: 16pt;
            color: black;
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'text',
                className: 'text',
                style: 'color: red; font-weight: bold',  // CSS文字列
                content: 'Test Text'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const text = result.slides[0].children![0] as any;
      expect(text.style).toEqual({
        fontSize: 16,
        color: 'red',       // CSS文字列が優先
        fontWeight: 'bold'  // CSS文字列が追加
      });
    });

    test('should work without CSS stylesheet', () => {
      const slideData = {
        title: 'Test Slide',
        // css プロパティなし
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'text',
                className: 'nonexistent-class',  // 存在しないクラス
                style: { color: 'blue' },
                content: 'Test Text'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const text = result.slides[0].children![0] as any;
      expect(text.style).toEqual({
        color: 'blue'  // インラインスタイルのみ
      });
    });

    test('should handle nested elements with different classes', () => {
      const slideData = {
        title: 'Test Slide',
        css: `
          .outer {
            padding: 20px;
            background-color: #EEE;
          }
          
          .inner {
            margin: 10px;
            background-color: #FFF;
          }
          
          .text-style {
            font-size: 14pt;
            color: #333;
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                className: 'outer',
                children: [
                  {
                    type: 'frame',
                    className: 'inner',
                    children: [
                      {
                        type: 'text',
                        className: 'text-style',
                        content: 'Nested Text'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const outer = result.slides[0].children![0] as any;
      expect(outer.style).toEqual({
        padding: '20px',
        backgroundColor: '#EEE'
      });

      const inner = outer.children[0] as any;
      expect(inner.style).toEqual({
        margin: '10px',
        backgroundColor: '#FFF'
      });

      const text = inner.children[0] as any;
      expect(text.style).toEqual({
        fontSize: 14,
        color: '#333'
      });
    });
  });

  describe('CSS warnings integration', () => {
    test('should warn about unsupported CSS properties', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const slideData = {
        title: 'Test Slide',
        css: `
          .unsupported {
            width: 100px;
            justify-content: center;  /* 非対応 */
            display: grid;           /* 非対応 */
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                className: 'unsupported'
              }
            ]
          }
        ]
      };

      SlideDataLoader.loadFromObject(slideData);

      // 警告が出力されたことを確認
      expect(consoleSpy).toHaveBeenCalledWith('CSS Stylesheet Warnings:');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('justify-content is not supported')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('display: grid is not supported')
      );

      // サポートされているプロパティのみが適用される
      const container = slideData.slides[0].children![0] as any;
      expect(container.style).toEqual({
        width: '100px'  // サポートされているプロパティのみ
      });

      consoleSpy.mockRestore();
    });
  });

  describe('backward compatibility', () => {
    test('should work with existing data without CSS stylesheet', () => {
      const slideData = {
        title: 'Legacy Slide',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'text',
                fontSize: 16,    // 従来の直接プロパティ
                color: 'blue',
                content: 'Legacy Text'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const text = result.slides[0].children![0] as any;
      expect(text.style).toEqual({
        fontSize: 16,
        color: 'blue'
      });
      // 直接プロパティは削除される
      expect(text.fontSize).toBeUndefined();
      expect(text.color).toBeUndefined();
    });

    test('should combine CSS classes with direct property migration', () => {
      const slideData = {
        title: 'Mixed Slide',
        css: `
          .mixed {
            padding: 16px;
            background-color: #F0F0F0;
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'text',
                className: 'mixed',
                fontSize: 18,      // 直接プロパティ（migrateされる）
                content: 'Mixed Text'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const text = result.slides[0].children![0] as any;
      expect(text.style).toEqual({
        padding: '16px',
        backgroundColor: '#F0F0F0',
        fontSize: 18              // migrateされたプロパティ
      });
    });
  });
});