/**
 * CSSStyleParser Border Shorthand Integration Test
 * border shorthand expand プラグインとの統合テスト
 */

import { CSSStyleParser } from "../CSSStyleParser.js";

describe("CSSStyleParser Border Shorthand Integration", () => {
  describe("border shorthand expansion", () => {
    test("should expand border: width style color to individual properties", () => {
      const cssString = "border: 4px solid #dc2626";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "4px",
        borderStyle: "solid", 
        borderColor: "#dc2626"
      });
    });

    test("should expand border: width style with default color", () => {
      const cssString = "border: 2px dashed";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "2px",
        borderStyle: "dashed",
        borderColor: "#000000"
      });
    });

    test("should expand border: width color with default style", () => {
      const cssString = "border: 3px #2563eb";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "#2563eb"
      });
    });

    test("should handle border: none", () => {
      const cssString = "border: none";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "0px", // CSSStyleParserで無次元数値→px変換
        borderStyle: "none",
        borderColor: "transparent"
      });
    });

    test("should handle rgba colors", () => {
      const cssString = "border: 2px solid rgba(220, 38, 38, 0.8)";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "rgba(220, 38, 38, 0.8)"
      });
    });
  });

  describe("mixed with other properties", () => {
    test("should handle border shorthand with other CSS properties", () => {
      const cssString = "background-color: #f0f0f0; border: 2px solid #333; padding: 10px";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        backgroundColor: "#f0f0f0",
        borderWidth: "2px",
        borderStyle: "solid", 
        borderColor: "#333333", // CSSStyleParserで3桁→6桁hex展開
        padding: "10px"
      });
    });

    test("should preserve existing longhand border properties", () => {
      const cssString = "border-width: 1px; border-style: dashed; border-color: red";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "1px",
        borderStyle: "dashed",
        borderColor: "red"
      });
    });

    test("should handle overrides: shorthand followed by longhand", () => {
      const cssString = "border: 2px solid #000; border-color: #dc2626";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "#dc2626" // 後勝ち
      });
    });
  });

  describe("integration with existing features", () => {
    test("should work with camelCase conversion", () => {
      const cssString = "border: 1px solid blue; background-color: yellow";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "blue",
        backgroundColor: "yellow"
      });
    });

    test("should work with short hex color expansion", () => {
      const cssString = "border: 2px solid #f0f; color: #333";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toEqual({
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "#ff00ff", // CSSStyleParserで3桁→6桁hex展開
        color: "#333333" // color プロパティも展開される
      });
    });
  });

  describe("error handling", () => {
    test("should handle empty border value", () => {
      const cssString = "border: ";
      const result = CSSStyleParser.parse(cssString);
      
      // 空の場合はborder プロパティとして残る可能性
      expect(result).toBeDefined();
    });

    test("should handle invalid border syntax gracefully", () => {
      const cssString = "border: invalid-value";
      const result = CSSStyleParser.parse(cssString);
      
      expect(result).toBeDefined();
    });
  });
});