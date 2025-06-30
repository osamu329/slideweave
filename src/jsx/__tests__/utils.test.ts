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
          color: 'blue'
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
          marginTop: 8,
          backgroundColor: 'red'
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
          marginTop: 16
        },
        dataTestid: 'test-element',
        fontSize: 20
      });
    });
  });
});