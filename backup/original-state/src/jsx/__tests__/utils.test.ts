/**
 * JSXユーティリティ関数のテスト
 */

import { 
  kebabToCamelCase, 
  camelToKebabCase, 
  parseCSSString, 
  transformProps 
} from '../utils';

describe('JSX Utils', () => {
  describe('kebabToCamelCase', () => {
    it('kebab-caseをcamelCaseに変換する', () => {
      expect(kebabToCamelCase('font-size')).toBe('fontSize');
      expect(kebabToCamelCase('margin-top')).toBe('marginTop');  
      expect(kebabToCamelCase('background-color')).toBe('backgroundColor');
      expect(kebabToCamelCase('flex-direction')).toBe('flexDirection');
    });

    it('既にcamelCaseの場合はそのまま返す', () => {
      expect(kebabToCamelCase('fontSize')).toBe('fontSize');
      expect(kebabToCamelCase('marginTop')).toBe('marginTop');
    });

    it('ハイフンがない場合はそのまま返す', () => {
      expect(kebabToCamelCase('width')).toBe('width');
      expect(kebabToCamelCase('height')).toBe('height');
    });
  });

  describe('camelToKebabCase', () => {
    it('camelCaseをkebab-caseに変換する', () => {
      expect(camelToKebabCase('fontSize')).toBe('font-size');
      expect(camelToKebabCase('marginTop')).toBe('margin-top');
      expect(camelToKebabCase('backgroundColor')).toBe('background-color');
      expect(camelToKebabCase('flexDirection')).toBe('flex-direction');
    });

    it('既にkebab-caseの場合はそのまま返す', () => {
      expect(camelToKebabCase('font-size')).toBe('font-size');
      expect(camelToKebabCase('margin-top')).toBe('margin-top');
    });

    it('大文字がない場合はそのまま返す', () => {
      expect(camelToKebabCase('width')).toBe('width');
      expect(camelToKebabCase('height')).toBe('height');
    });
  });

  describe('parseCSSString', () => {
    it('基本的なCSS文字列をオブジェクトに変換する', () => {
      const css = 'font-size: 16px; color: red;';
      const result = parseCSSString(css);
      
      expect(result).toEqual({
        fontSize: '16px',
        color: 'red'
      });
    });

    it('数値のみの値は数値型に変換する', () => {
      const css = 'margin: 16; padding: 8;';
      const result = parseCSSString(css);
      
      expect(result).toEqual({
        margin: 16,
        padding: 8
      });
    });

    it('小数点を含む数値は浮動小数点型に変換する', () => {
      const css = 'opacity: 0.5; line-height: 1.5;';
      const result = parseCSSString(css);
      
      expect(result).toEqual({
        opacity: 0.5,
        lineHeight: 1.5
      });
    });

    it('複雑なCSS文字列を処理する', () => {
      const css = `
        font-size: 18px;
        font-weight: bold;
        margin-top: 10;
        background-color: #ffffff;
        border-radius: 4px;
      `;
      const result = parseCSSString(css);
      
      expect(result).toEqual({
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderRadius: '4px'
      });
    });

    it('空文字列や不正な形式を適切に処理する', () => {
      expect(parseCSSString('')).toEqual({});
      expect(parseCSSString('invalid')).toEqual({});
      expect(parseCSSString('color')).toEqual({});
    });
  });

  describe('transformProps', () => {
    it('基本的なプロパティ変換を行う', () => {
      const props = {
        fontSize: 16,
        marginTop: 8,
        backgroundColor: 'red'
      };
      
      const result = transformProps(props);
      
      expect(result).toEqual({
        fontSize: 16,
        marginTop: 8,
        backgroundColor: 'red'
      });
    });

    it('CSS文字列のstyleをオブジェクトに変換する', () => {
      const props = {
        style: 'font-size: 16px; color: blue;'
      };
      
      const result = transformProps(props);
      
      expect(result).toEqual({
        style: {
          fontSize: '16px',
          color: '#0000ff'  // 色名は16進数に変換される
        }
      });
    });

    it('styleオブジェクトのkebab-caseキーをcamelCaseに変換する', () => {
      const props = {
        style: {
          'font-size': '16px',
          'margin-top': 8,
          'background-color': 'red'
        }
      };
      
      const result = transformProps(props);
      
      expect(result).toEqual({
        style: {
          fontSize: '16px',
          marginTop: '8px',        // 数値は自動的にpx変換
          backgroundColor: '#ff0000' // 色名は16進数に変換
        }
      });
    });

    it('classNameをclassに変換する', () => {
      const props = {
        className: 'btn btn-primary',
        fontSize: 16
      };
      
      const result = transformProps(props);
      
      expect(result).toEqual({
        class: 'btn btn-primary',
        fontSize: 16
      });
    });

    it('kebab-caseプロパティをcamelCaseに変換する', () => {
      const props = {
        'font-size': 16,
        'margin-top': 8,
        'data-test': 'value'
      };
      
      const result = transformProps(props);
      
      expect(result).toEqual({
        fontSize: 16,
        marginTop: 8,
        dataTest: 'value'
      });
    });

    it('nullやundefinedを適切に処理する', () => {
      expect(transformProps(null)).toEqual({});
      expect(transformProps(undefined)).toEqual({});
      expect(transformProps({})).toEqual({});
    });

    it('複合的な変換を処理する', () => {
      const props = {
        className: 'container',
        style: 'font-size: 18px; margin-top: 16;',
        'data-testid': 'test-element',
        fontSize: 20  // styleで指定されていても個別指定が優先される
      };
      
      const result = transformProps(props);
      
      expect(result).toEqual({
        class: 'container',
        style: {
          fontSize: '18px',
          marginTop: '16px'  // CSS文字列解析後も正規化されてpx変換される
        },
        dataTestid: 'test-element',
        fontSize: 20
      });
    });

    describe('無次元数値のpx変換', () => {
      it('寸法系プロパティは数値を自動的にpxに変換', () => {
        const props = {
          style: {
            width: 100,
            height: 200,
            padding: 16,
            margin: 8,
            borderRadius: 4
          }
        };

        const result = transformProps(props);
        
        expect(result.style.width).toBe('100px');
        expect(result.style.height).toBe('200px');
        expect(result.style.padding).toBe('16px');
        expect(result.style.margin).toBe('8px');
        expect(result.style.borderRadius).toBe('4px');
      });

      it('無次元プロパティは数値のまま保持', () => {
        const props = {
          style: {
            opacity: 0.5,
            flex: 1,
            zIndex: 100,
            fontWeight: 600,
            lineHeight: 1.5
          }
        };

        const result = transformProps(props);
        
        expect(result.style.opacity).toBe(0.5);
        expect(result.style.flex).toBe(1);
        expect(result.style.zIndex).toBe(100);
        expect(result.style.fontWeight).toBe(600);
        expect(result.style.lineHeight).toBe(1.5);
      });

      it('既に単位付きの値はそのまま保持', () => {
        const props = {
          style: {
            width: '50%',
            height: '100vh',
            padding: '2rem',
            margin: '1em',
            fontSize: '14px'
          }
        };

        const result = transformProps(props);
        
        expect(result.style.width).toBe('50%');
        expect(result.style.height).toBe('100vh');
        expect(result.style.padding).toBe('2rem');
        expect(result.style.margin).toBe('1em');
        expect(result.style.fontSize).toBe('14px');
      });
    });

    describe('色名の16進数変換', () => {
      it('基本的な色名を16進数に変換', () => {
        const props = {
          style: {
            color: 'white',
            backgroundColor: 'black',
            borderColor: 'red'
          }
        };

        const result = transformProps(props);
        
        expect(result.style.color).toBe('#ffffff');
        expect(result.style.backgroundColor).toBe('#000000');
        expect(result.style.borderColor).toBe('#ff0000');
      });

      it('色関連でないプロパティは色名変換しない', () => {
        const props = {
          style: {
            fontFamily: 'white',  // フォント名として'white'を使用
            content: 'red'        // コンテンツとして'red'を使用
          }
        };

        const result = transformProps(props);
        
        expect(result.style.fontFamily).toBe('white');
        expect(result.style.content).toBe('red');
      });

      it('既に16進数の色はそのまま保持', () => {
        const props = {
          style: {
            color: '#007bff',
            backgroundColor: '#f8f9fa'
          }
        };

        const result = transformProps(props);
        
        expect(result.style.color).toBe('#007bff');
        expect(result.style.backgroundColor).toBe('#f8f9fa');
      });
    });

    describe('React準拠の変換処理', () => {
      it('数値px変換と色名変換を同時に適用', () => {
        const props = {
          style: {
            width: 100,
            height: 200,
            padding: 16,
            color: 'white',
            backgroundColor: 'blue',
            opacity: 0.8,
            flex: 1
          }
        };

        const result = transformProps(props);
        
        // px変換
        expect(result.style.width).toBe('100px');
        expect(result.style.height).toBe('200px');
        expect(result.style.padding).toBe('16px');
        
        // 色名変換
        expect(result.style.color).toBe('#ffffff');
        expect(result.style.backgroundColor).toBe('#0000ff');
        
        // 無次元保持
        expect(result.style.opacity).toBe(0.8);
        expect(result.style.flex).toBe(1);
      });

      it('null/undefined値の処理', () => {
        const props = {
          style: {
            width: null,
            height: undefined,
            padding: 0
          }
        };

        const result = transformProps(props);
        
        expect(result.style.width).toBe(null);
        expect(result.style.height).toBe(undefined);
        expect(result.style.padding).toBe('0px');
      });
    });
  });
});