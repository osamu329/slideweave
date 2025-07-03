/**
 * PostCSS Border Shorthand Expand Plugin テスト
 * TDD Red Phase: 失敗するテストを先に作成
 */

import postcss from "postcss";
import { borderShorthandExpand } from "../postcss-border-shorthand-expand.js";

describe("PostCSS Border Shorthand Expand Plugin", () => {
  /**
   * プラグインでCSS変換を実行するヘルパー
   */
  const transform = (css: string) => {
    return postcss([borderShorthandExpand()]).process(css).css;
  };

  describe("border shorthand expansion", () => {
    test("should expand border: width style color", () => {
      const input = `.test { border: 4px solid #dc2626; }`;
      const expected = `.test { border-width: 4px; border-style: solid; border-color: #dc2626; }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });

    test("should expand border: width style", () => {
      const input = `.test { border: 2px dashed; }`;
      const expected = `.test { border-width: 2px; border-style: dashed; border-color: #000000; }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });

    test("should expand border: width color", () => {
      const input = `.test { border: 3px #2563eb; }`;
      const expected = `.test { border-width: 3px; border-style: solid; border-color: #2563eb; }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });

    test("should handle border: width only", () => {
      const input = `.test { border: 5px; }`;
      const expected = `.test { border-width: 5px; border-style: solid; border-color: #000000; }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });

    test("should handle border: none", () => {
      const input = `.test { border: none; }`;
      const expected = `.test { border-width: 0; border-style: none; border-color: transparent; }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });
  });

  describe("edge cases", () => {
    test("should handle rgba colors", () => {
      const input = `.test { border: 2px solid rgba(220, 38, 38, 0.8); }`;
      const expected = `.test { border-width: 2px; border-style: solid; border-color: rgba(220, 38, 38, 0.8); }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });

    test("should handle named colors", () => {
      const input = `.test { border: 1px dotted red; }`;
      const expected = `.test { border-width: 1px; border-style: dotted; border-color: red; }`;
      
      const result = transform(input);
      expect(result).toBe(expected);
    });

    test("should preserve other properties", () => {
      const input = `.test { 
        background-color: #f0f0f0;
        border: 2px solid #333;
        padding: 10px;
      }`;
      const expected = `.test { 
        background-color: #f0f0f0;
        border-width: 2px; border-style: solid; border-color: #333;
        padding: 10px;
      }`;
      
      const result = transform(input);
      expect(result.replace(/\s+/g, ' ').trim()).toBe(expected.replace(/\s+/g, ' ').trim());
    });

    test("should not affect non-border properties", () => {
      const input = `.test { 
        background: url(image.jpg);
        color: #333;
        margin: 10px;
      }`;
      
      const result = transform(input);
      expect(result).toBe(input);
    });

    test("should not affect longhand border properties", () => {
      const input = `.test { 
        border-width: 2px;
        border-style: solid;
        border-color: #333;
      }`;
      
      const result = transform(input);
      expect(result).toBe(input);
    });
  });

  describe("multiple border declarations", () => {
    test("should handle multiple elements with border", () => {
      const input = `
        .card { border: 1px solid #ddd; }
        .button { border: 2px solid #007bff; }
      `;
      const expected = `
        .card { border-width: 1px; border-style: solid; border-color: #ddd; }
        .button { border-width: 2px; border-style: solid; border-color: #007bff; }
      `;
      
      const result = transform(input);
      expect(result.replace(/\s+/g, ' ').trim()).toBe(expected.replace(/\s+/g, ' ').trim());
    });
  });
});