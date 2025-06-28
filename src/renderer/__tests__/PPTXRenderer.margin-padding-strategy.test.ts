/**
 * margin/padding適用戦略のテスト
 * 
 * 戦略:
 * - margin: レイアウトレベルで処理（要素間隔）
 * - padding: PowerPointレベルで処理（テキストフレーム内マージン）
 */

import { PPTXRenderer } from "../PPTXRenderer";
import { TextElement, HeadingElement } from "../../types/elements";

describe("PPTXRenderer margin/padding strategy", () => {
  let renderer: PPTXRenderer;

  beforeEach(() => {
    renderer = new PPTXRenderer();
  });

  describe("text element rendering", () => {
    it("should apply only padding to PowerPoint margin option", () => {
      // Given: text要素にmarginとpaddingが設定されている
      const textElement: TextElement = {
        type: "text",
        content: "Test text",
        style: {
          margin: 2,
          padding: 3
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

      // Then: paddingのみがPowerPointのmarginオプションに適用される
      expect(mockAddText).toHaveBeenCalledWith("Test text", expect.objectContaining({
        margin: 24, // padding: 3 * 8 = 24
        // marginプロパティは要素のmarginを使用しない
      }));
    });

    it("should apply 0 margin when no padding is specified", () => {
      // Given: paddingが指定されていないtext要素
      const textElement: TextElement = {
        type: "text",
        content: "Test text",
        style: {
          margin: 2 // marginのみ指定
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

      // Then: PowerPointのmarginは0になる
      expect(mockAddText).toHaveBeenCalledWith("Test text", expect.objectContaining({
        margin: 0, // paddingが未指定なので0
      }));
    });
  });

  describe("heading element rendering", () => {
    it("should apply only padding to PowerPoint margin option (not element margin)", () => {
      // Given: heading要素にmarginとpaddingが設定されている
      const headingElement: HeadingElement = {
        type: "heading",
        level: 2,
        content: "Test heading",
        style: {
          margin: 2,
          padding: 4
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

      // Then: paddingのみがPowerPointのmarginオプションに適用される
      expect(mockAddText).toHaveBeenCalledWith("Test heading", expect.objectContaining({
        margin: 32, // padding: 4 * 8 = 32
        // marginプロパティは要素のmarginを使用しない
      }));
      
      // paddingプロパティは存在しないことを確認
      expect(mockAddText).toHaveBeenCalledWith("Test heading", expect.not.objectContaining({
        padding: expect.anything()
      }));
    });

    it("should apply 0 margin when no padding is specified for heading", () => {
      // Given: paddingが指定されていないheading要素
      const headingElement: HeadingElement = {
        type: "heading",
        level: 1,
        content: "Test heading",
        style: {
          margin: 3 // marginのみ指定
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

      // Then: PowerPointのmarginは0になる
      expect(mockAddText).toHaveBeenCalledWith("Test heading", expect.objectContaining({
        margin: 0, // paddingが未指定なので0
      }));
    });
  });

  describe("strategy verification", () => {
    it("should never pass element margin to PowerPoint", () => {
      // Given: 大きなmargin値を持つ要素
      const textElement: TextElement = {
        type: "text",
        content: "Test text",
        style: {
          margin: 10, // 大きなmargin値
          padding: 1   // 小さなpadding値
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

      // Then: margin値（10 * 8 = 80）ではなく、padding値（1 * 8 = 8）が適用される
      expect(mockAddText).toHaveBeenCalledWith("Test text", expect.objectContaining({
        margin: 8, // padding: 1 * 8 = 8（margin: 10は無視される）
      }));
    });
  });
});