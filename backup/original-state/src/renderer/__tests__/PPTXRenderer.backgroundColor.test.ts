/**
 * backgroundColor適用のTDDテスト
 * 
 * Red: 失敗するテストを先に書く
 */

import { PPTXRenderer } from "../PPTXRenderer";
import { TextElement, HeadingElement } from "../../types/elements";

describe("PPTXRenderer backgroundColor support", () => {
  let renderer: PPTXRenderer;

  beforeEach(() => {
    renderer = new PPTXRenderer();
  });

  describe("text element background color", () => {
    it("should apply backgroundColor as fill option", () => {
      // Given: backgroundColor付きtext要素
      const textElement: TextElement = {
        type: "text",
        content: "背景色付きテキスト",
        style: {
          backgroundColor: "ff0000"
        }
      };

      const layoutResult = {
        left: 10,
        top: 20,
        width: 100,
        height: 30,
        element: textElement
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = jest.fn();
      const mockSlide = {
        addText: mockAddText
      };
      (renderer as any).currentSlide = mockSlide;
      
      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: fillオプションが正しく設定される
      expect(mockAddText).toHaveBeenCalledWith("背景色付きテキスト", expect.objectContaining({
        fill: { color: "ff0000" }
      }));
    });

    it("should not set fill when backgroundColor is not specified", () => {
      // Given: backgroundColor未指定のtext要素
      const textElement: TextElement = {
        type: "text",
        content: "通常テキスト"
      };

      const layoutResult = {
        left: 10,
        top: 20,
        width: 100,
        height: 30,
        element: textElement
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = jest.fn();
      const mockSlide = {
        addText: mockAddText
      };
      (renderer as any).currentSlide = mockSlide;
      
      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: fillオプションは設定されない
      expect(mockAddText).toHaveBeenCalledWith("通常テキスト", expect.not.objectContaining({
        fill: expect.anything()
      }));
    });
  });

  describe("heading element background color", () => {
    it("should apply backgroundColor as fill option for heading", () => {
      // Given: backgroundColor付きheading要素
      const headingElement: HeadingElement = {
        type: "heading",
        level: 2,
        content: "背景色付き見出し",
        style: {
          backgroundColor: "0000ff"
        }
      };

      const layoutResult = {
        left: 10,
        top: 20,
        width: 100,
        height: 30,
        element: headingElement
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = jest.fn();
      const mockSlide = {
        addText: mockAddText
      };
      (renderer as any).currentSlide = mockSlide;
      
      // renderHeadingを直接呼び出し
      (renderer as any).renderHeading(layoutResult, headingElement);

      // Then: fillオプションが正しく設定される
      expect(mockAddText).toHaveBeenCalledWith("背景色付き見出し", expect.objectContaining({
        fill: { color: "0000ff" }
      }));
    });

    it("should not set fill when backgroundColor is not specified for heading", () => {
      // Given: backgroundColor未指定のheading要素
      const headingElement: HeadingElement = {
        type: "heading",
        level: 1,
        content: "通常見出し"
      };

      const layoutResult = {
        left: 10,
        top: 20,
        width: 100,
        height: 30,
        element: headingElement
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = jest.fn();
      const mockSlide = {
        addText: mockAddText
      };
      (renderer as any).currentSlide = mockSlide;
      
      // renderHeadingを直接呼び出し
      (renderer as any).renderHeading(layoutResult, headingElement);

      // Then: fillオプションは設定されない
      expect(mockAddText).toHaveBeenCalledWith("通常見出し", expect.not.objectContaining({
        fill: expect.anything()
      }));
    });
  });

  describe("padding and backgroundColor combination", () => {
    it("should apply both padding and backgroundColor correctly", () => {
      // Given: paddingとbackgroundColor両方を持つ要素
      const textElement: TextElement = {
        type: "text",
        content: "padding+背景色テキスト",
        style: {
          padding: 2,
          backgroundColor: "00ff00"
        }
      };

      const layoutResult = {
        left: 10,
        top: 20,
        width: 100,
        height: 30,
        element: textElement
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = jest.fn();
      const mockSlide = {
        addText: mockAddText
      };
      (renderer as any).currentSlide = mockSlide;
      
      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: paddingとbackgroundColor両方が適用される
      expect(mockAddText).toHaveBeenCalledWith("padding+背景色テキスト", expect.objectContaining({
        margin: 16, // padding: 2 * 8 = 16
        fill: { color: "00ff00" }
      }));
    });
  });
});