/**
 * CSSStylesheetParser テスト
 * TDD: PostCSSベースCSSライクスタイルシート機能のテスト
 */

import { CSSStylesheetParser } from '../CSSStylesheetParser';

describe('CSSStylesheetParser', () => {
  describe('basic CSS parsing', () => {
    test('should parse simple class selector with basic properties', () => {
      const css = `
        .container {
          width: 640px;
          height: 480px;
          padding: 16px;
          background-color: #F0F8FF;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      // 特定のクラスのみをテスト（Tailwindクラスは除く）
      expect(result.styles.container).toEqual({
        width: '640px',
        height: '480px',
        padding: '16px',
        backgroundColor: '#F0F8FF'
      });
      expect(result.warnings).toHaveLength(0);
    });

    test('should parse multiple class selectors', () => {
      const css = `
        .header {
          font-size: 24pt;
          font-weight: bold;
          color: #333;
        }
        
        .content {
          font-size: 14pt;
          margin: 16px;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      // 特定のクラスのみをテスト
      expect(result.styles.header).toEqual({
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333'  // 3-digit hex is expanded to 6-digit
      });
      expect(result.styles.content).toEqual({
        fontSize: 14,
        margin: '16px'
      });
      expect(result.warnings).toHaveLength(0);
    });

    test('should handle empty CSS input', () => {
      const result = CSSStylesheetParser.parse('');
      
      // 空のCSSでもTailwindクラスが含まれる
      expect(Object.keys(result.styles).length).toBeGreaterThan(0);
      expect(result.styles).toHaveProperty('p-4');
      expect(result.warnings).toHaveLength(0);
    });

    test('should handle CSS with only whitespace', () => {
      const result = CSSStylesheetParser.parse('   \n  \t  ');
      
      // 空白のみでもTailwindクラスが含まれる
      expect(Object.keys(result.styles).length).toBeGreaterThan(0);
      expect(result.styles).toHaveProperty('p-4');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('PowerPoint property support validation', () => {
    test('should accept supported properties without warnings', () => {
      const css = `
        .supported {
          width: 100px;
          height: 200px;
          background-color: blue;
          font-size: 16pt;
          padding: 8px;
          border-radius: 4px;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      expect(result.styles.supported).toBeDefined();
      expect(result.warnings).toHaveLength(0);
    });

    test('should generate warnings for unsupported properties', () => {
      const css = `
        .unsupported {
          width: 100px;
          justify-content: center;
          display: grid;
          position: absolute;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      // 対応済みプロパティのみが含まれる
      expect(result.styles.unsupported).toEqual({
        width: '100px'
      });

      // 警告が生成される
      expect(result.warnings.some(w => w.includes('justify-content is not supported'))).toBe(true);
      expect(result.warnings.some(w => w.includes('display: grid is not supported'))).toBe(true);
      expect(result.warnings.some(w => w.includes('position is not fully supported'))).toBe(true);
    });

    test('should suggest alternatives for unsupported properties', () => {
      const css = `
        .alternatives {
          justify-content: center;
          align-items: center;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      expect(result.warnings.some(w => w.includes('Use flex-direction for layout control'))).toBe(true);
      expect(result.warnings.some(w => w.includes('Use padding for alignment control'))).toBe(true);
    });

    test('should warn about properties with limited support', () => {
      const css = `
        .limited {
          box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      expect(result.styles.limited).toEqual({
        boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      });
      expect(result.warnings.some(w => w.includes('box-shadow support is limited in PowerPoint'))).toBe(true);
    });

    test('should warn about unknown properties', () => {
      const css = `
        .unknown {
          custom-property: value;
          -webkit-transform: rotate(45deg);
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      expect(result.warnings.some(w => w.includes('custom-property'))).toBe(true);
      expect(result.warnings.some(w => w.includes('support is unknown'))).toBe(true);
    });
  });

  describe('selector support validation', () => {
    test('should only support class selectors', () => {
      const css = `
        .valid-class { width: 100px; }
        #id-selector { height: 100px; }
        element { margin: 10px; }
        .parent .child { padding: 5px; }
        .before::before { content: ""; }
      `;

      const result = CSSStylesheetParser.parse(css);

      // クラスセレクタのみが解析される
      expect(result.styles['valid-class']).toEqual({ width: '100px' });

      // 非対応セレクタの警告
      expect(result.warnings.some(w => w.includes('#id-selector'))).toBe(true);
      expect(result.warnings.some(w => w.includes('element'))).toBe(true);
      expect(result.warnings.some(w => w.includes('.parent .child'))).toBe(true);
    });

    test('should support class names with hyphens and underscores', () => {
      const css = `
        .my-class { width: 100px; }
        .my_class { height: 200px; }
        .MyClass123 { margin: 10px; }
      `;

      const result = CSSStylesheetParser.parse(css);

      expect(result.styles['my-class']).toEqual({ width: '100px' });
      expect(result.styles['my_class']).toEqual({ height: '200px' });
      expect(result.styles['MyClass123']).toEqual({ margin: '10px' });
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('CSS parsing error handling', () => {
    test('should handle malformed CSS gracefully', () => {
      const css = `
        .broken {
          width: 100px
          height: 200px; // missing semicolon above
          invalid-syntax: 
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      // エラーでも部分的にパースされる
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('CSS parsing error'))).toBe(true);
    });
  });

  describe('utility methods', () => {
    test('getSupportedProperties should return supported property list', () => {
      const supported = CSSStylesheetParser.getSupportedProperties();
      
      expect(supported).toContain('width');
      expect(supported).toContain('height');
      expect(supported).toContain('background-color');
      expect(supported).toContain('font-size');
      expect(supported).not.toContain('justify-content');
      expect(supported).not.toContain('display');
    });

    test('getUnsupportedProperties should return unsupported property list', () => {
      const unsupported = CSSStylesheetParser.getUnsupportedProperties();
      
      expect(unsupported).toContain('justify-content');
      expect(unsupported).toContain('display');
      expect(unsupported).toContain('position');
      expect(unsupported).not.toContain('width');
      expect(unsupported).not.toContain('background-color');
    });

    test('getPropertySupport should return property support info', () => {
      const widthSupport = CSSStylesheetParser.getPropertySupport('width');
      expect(widthSupport).toEqual({ supported: true });

      const justifySupport = CSSStylesheetParser.getPropertySupport('justify-content');
      expect(justifySupport).toEqual({
        supported: false,
        alternative: 'flex-direction',
        warning: 'justify-content is not supported. Use flex-direction for layout control'
      });

      const unknownSupport = CSSStylesheetParser.getPropertySupport('unknown-property');
      expect(unknownSupport).toBeNull();
    });
  });

  describe('integration with existing CSSStyleParser', () => {
    test('should use CSSStyleParser for property value parsing', () => {
      const css = `
        .integration-test {
          font-size: 18pt;
          margin: 8;
          padding: 16px;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      expect(result.styles['integration-test']).toEqual({
        fontSize: 18,     // pt単位が数値に変換される
        margin: '8px',    // 単位なし数値は警告付きでpx変換される
        padding: '16px'   // px単位は文字列として保持
      });
    });
  });

  describe('@import directive support', () => {
    test('should fail when @import directive is used (RED phase)', () => {
      const css = `
        @import 'external.css';
        
        .container {
          width: 640px;
          padding: 16px;
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      // RED: この時点では@importは処理されない
      expect(result.styles.container).toEqual({
        width: '640px',
        padding: '16px'
      });
      
      // @import警告が出力されることを期待
      expect(result.warnings.some(warning => 
        warning.includes('@import') || warning.includes('import')
      )).toBe(true);
    });

    test('should process @import with postcss-import plugin (GREEN phase)', () => {
      // このテストは実装完了後にGREENになる
      const css = `
        @import 'test-styles.css';
        
        .local-class {
          margin: 8px;
        }
      `;

      // 仮想的な外部CSSファイル内容
      const externalCSS = `
        .imported-class {
          color: #FF0000;
          font-size: 16px;
        }
      `;

      // 実装: mockファイルシステムを使用してテスト
      const result = CSSStylesheetParser.parseWithImports(css, {
        'test-styles.css': externalCSS
      });

      expect(result.styles['imported-class']).toEqual({
        color: '#FF0000',
        fontSize: '16px'
      });
      expect(result.styles['local-class']).toEqual({
        margin: '8px'
      });
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('CSS variables (custom properties) support', () => {
    test('should fail when CSS variables are used (RED phase)', () => {
      const css = `
        :root {
          --primary-color: #007ACC;
          --spacing: 16px;
        }
        
        .container {
          color: var(--primary-color);
          padding: var(--spacing);
        }
      `;

      const result = CSSStylesheetParser.parse(css);

      // RED: CSS variables are not processed yet, but values are stored as-is
      expect(result.styles.container).toEqual({
        color: 'var(--primary-color)',
        padding: 'var(--spacing)'
      });
      
      // Should have warnings about CSS variables not being supported
      expect(result.warnings.some(warning => 
        warning.includes('var(') || warning.includes('CSS variable') || warning.includes('custom property')
      )).toBe(true);
    });
    
    test.skip('should process CSS variables (GREEN phase - will implement)', () => {
      const css = `
        :root {
          --primary-color: #007ACC;
          --spacing: 16px;
        }
        
        .container {
          color: var(--primary-color);
          padding: var(--spacing);
        }
      `;

      // After implementation, this should work
      // const result = CSSStylesheetParser.parseWithVariables(css);
      // expect(result.styles).toEqual({
      //   container: {
      //     color: '#007ACC',
      //     padding: '16px'
      //   }
      // });
    });
  });
});