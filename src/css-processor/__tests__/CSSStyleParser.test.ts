/**
 * CSSStyleParser テスト
 */

import { CSSStyleParser } from "../CSSStyleParser";
import { vi } from "vitest";

describe("CSSStyleParser", () => {
  describe("parse", () => {
    it("基本的なCSSプロパティをパースできる", () => {
      const css = "font-size: 14pt; margin: 8px; width: 100%";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        fontSize: "14pt",
        margin: "8px",
        width: "100%",
      });
    });

    it("ケバブケースをキャメルケースに変換する", () => {
      const css =
        "margin-top: 10px; margin-bottom: 20px; background-color: #f0f8ff";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        marginTop: "10px",
        marginBottom: "20px",
        backgroundColor: "#f0f8ff",
      });
    });

    it("単位付きの値を文字列として保持する", () => {
      const css = "font-size: 28pt; width: 100%; height: 50px";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        fontSize: "28pt",
        width: "100%",
        height: "50px",
      });
    });

    it("単位なしの数値はpx単位としてフォールバックする（警告付き）", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const css = "padding: 8; margin: 4; flex: 1";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        padding: "8px",
        margin: "4px", 
        flex: 1, // flexは無次元が正しい
      });

      // 警告が出ていることを確認
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Unitless dimension "8" for property "padding"',
        ),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unitless dimension "4" for property "margin"'),
      );
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Unitless value "1" for property "flex"'),
      );

      consoleSpy.mockRestore();
    });

    it("末尾のセミコロンがない場合も正しくパースする", () => {
      const css = "padding: 8px";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        padding: "8px",
      });
    });

    it("複数のスペースやタブがある場合も正しくパースする", () => {
      const css = "  font-size:   14pt ;   margin:    8px  ";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        fontSize: "14pt",
        margin: "8px",
      });
    });

    it("空文字列の場合は空オブジェクトを返す", () => {
      expect(CSSStyleParser.parse("")).toEqual({});
      expect(CSSStyleParser.parse("  ")).toEqual({});
    });

    it("directionプロパティを正しくパースする", () => {
      const css = "direction: row; flex-direction: column";
      const result = CSSStyleParser.parse(css);

      expect(result).toEqual({
        direction: "row",
        flexDirection: "column",
      });
    });

    // NOTE: test11-css.jsonテストは現在の型システム（fontSize: string）と不整合のため削除
    // CSSStyleParserは数値として返すが、現在のfontSizeは文字列型
  });

  describe("stringify", () => {
    it("スタイルオブジェクトをCSS文字列に変換できる", () => {
      const style = {
        fontSize: "14pt",
        marginTop: 8,
        backgroundColor: "#f0f8ff",
      };

      const result = CSSStyleParser.stringify(style);
      expect(result).toBe(
        "font-size: 14pt; margin-top: 8; background-color: #f0f8ff",
      );
    });
  });

  describe("color handling", () => {
    test("should expand short hex colors to full hex", () => {
      const style = CSSStyleParser.parse(
        "color: #333; background-color: #F0F; border-color: #abc",
      );
      expect(style).toEqual({
        color: "#333333",
        backgroundColor: "#FF00FF", // #F0F → #FF00FF (マゼンタ)
        borderColor: "#aabbcc",
      });
    });

    test("should leave full hex colors unchanged", () => {
      const style = CSSStyleParser.parse(
        "color: #333333; background-color: #F0F0F0",
      );
      expect(style).toEqual({
        color: "#333333",
        backgroundColor: "#F0F0F0",
      });
    });

    test("should not modify non-color properties with hash values", () => {
      const style = CSSStyleParser.parse(
        'content: "#333"; font-family: "Arial"',
      );
      expect(style).toEqual({
        content: '"#333"',
        fontFamily: '"Arial"',
      });
    });
  });
});
