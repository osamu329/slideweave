/**
 * CSSStylesheetParser Tailwind統合テスト
 * 組み込みTailwindクラスとカスタムCSSクラスの統合動作テスト
 */

import { CSSStylesheetParser } from '../CSSStylesheetParser';

describe('CSSStylesheetParser Tailwind Integration', () => {
  describe('Built-in Tailwind class parsing', () => {
    test('should parse Tailwind classes without CSS stylesheet', () => {
      const result = CSSStylesheetParser.parse('');
      
      // Tailwindクラスが組み込みで利用可能
      expect(result.styles['p-4']).toEqual({ padding: '16px' });
      expect(result.styles['bg-blue-500']).toEqual({ backgroundColor: '#2563eb' });
      expect(result.styles['text-white']).toEqual({ color: '#ffffff' });
      expect(result.styles['flex']).toEqual({ flexDirection: 'row' });
    });

    test('should include all supported Tailwind classes in styles', () => {
      const result = CSSStylesheetParser.parse('');
      
      // スペーシング系クラスが含まれている
      expect(result.styles).toHaveProperty('p-0');
      expect(result.styles).toHaveProperty('m-8');
      expect(result.styles).toHaveProperty('mt-4');
      expect(result.styles).toHaveProperty('gap-8');
      
      // 色系クラスが含まれている
      expect(result.styles).toHaveProperty('bg-white');
      expect(result.styles).toHaveProperty('text-black');
      
      // レイアウト系クラスが含まれている
      expect(result.styles).toHaveProperty('flex');
      expect(result.styles).toHaveProperty('w-full');
      
      // タイポグラフィ系クラスが含まれている
      expect(result.styles).toHaveProperty('text-lg');
      expect(result.styles).toHaveProperty('font-bold');
    });
  });

  describe('CSS + Tailwind mixed classes', () => {
    test('should merge custom CSS classes with built-in Tailwind classes', () => {
      const css = `
        .custom-button {
          border-radius: 8px;
          cursor: pointer;
        }
        
        .special-text {
          text-decoration: underline;
          letter-spacing: 1px;
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      // カスタムCSSクラス
      expect(result.styles['custom-button']).toEqual({
        borderRadius: '8px',
        cursor: 'pointer'
      });
      
      // 組み込みTailwindクラス
      expect(result.styles['p-4']).toEqual({ padding: '16px' });
      expect(result.styles['bg-blue-500']).toEqual({ backgroundColor: '#2563eb' });
      
      // 両方が利用可能
      expect(result.styles).toHaveProperty('custom-button');
      expect(result.styles).toHaveProperty('p-4');
    });

    test('should allow CSS classes to override Tailwind classes', () => {
      const css = `
        .p-4 {
          padding: 24px;  /* Tailwindのp-4 (16px)を上書き */
        }
        
        .bg-blue-500 {
          background-color: #1d4ed8;  /* カスタム青色 */
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      // CSSクラスがTailwindクラスを上書き
      expect(result.styles['p-4']).toEqual({ padding: '24px' });
      expect(result.styles['bg-blue-500']).toEqual({ backgroundColor: '#1d4ed8' });
    });

    test('should preserve Tailwind classes when no CSS override exists', () => {
      const css = `
        .custom-style {
          border: 1px solid black;
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      // Tailwindクラスは影響を受けない
      expect(result.styles['p-4']).toEqual({ padding: '16px' });
      expect(result.styles['bg-blue-500']).toEqual({ backgroundColor: '#2563eb' });
      
      // カスタムクラスも利用可能
      expect(result.styles['custom-style']).toEqual({
        border: '1px solid black'
      });
    });
  });

  describe('Class priority and parsing order', () => {
    test('should prioritize CSS classes over Tailwind classes', () => {
      const css = `
        .text-lg {
          font-size: 32px;  /* Tailwindのtext-lg (18px)を上書き */
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      expect(result.styles['text-lg']).toEqual({ fontSize: '32px' });
    });

    test('should handle non-conflicting mixed usage', () => {
      const css = `
        .hero-section {
          background-image: url('/hero.jpg');
          background-size: cover;
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      // カスタムクラス
      expect(result.styles['hero-section']).toEqual({
        backgroundImage: 'url(\'/hero.jpg\')',
        backgroundSize: 'cover'
      });
      
      // Tailwindクラスも並存
      expect(result.styles['bg-blue-500']).toEqual({ backgroundColor: '#2563eb' });
      expect(result.styles['p-8']).toEqual({ padding: '32px' });
    });
  });

  describe('Warnings and error handling', () => {
    test('should not generate warnings for built-in Tailwind classes', () => {
      const result = CSSStylesheetParser.parse('');
      
      // Tailwindクラスに関する警告は出力されない
      expect(result.warnings).toEqual([]);
    });

    test('should generate warnings for unsupported CSS properties in custom classes', () => {
      const css = `
        .custom-style {
          width: 100px;
          justify-content: center;  /* PowerPoint非対応 */
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      // 非対応プロパティの警告が出力される
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(warning => 
        warning.includes('justify-content is not supported')
      )).toBe(true);
    });
  });

  describe('Edge cases', () => {
    test('should handle empty CSS with Tailwind classes available', () => {
      const result = CSSStylesheetParser.parse('');
      
      expect(result.styles).toHaveProperty('p-4');
      expect(result.warnings).toEqual([]);
    });

    test('should handle CSS syntax errors gracefully', () => {
      const css = `
        .invalid-css {
          color: ;  /* 不正な値 */
        }
      `;
      
      const result = CSSStylesheetParser.parse(css);
      
      // Tailwindクラスは影響を受けない
      expect(result.styles).toHaveProperty('p-4');
    });
  });
});