/**
 * PPTXRenderer - margin/padding仕様テスト
 * TDD: Red phase - 失敗するテストを先に書く
 */

import { PPTXRenderer } from "../PPTXRenderer";
import { LayoutResult } from "../../layout/YogaLayoutEngine";
import { TextElement, HeadingElement } from "../../types/elements";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("PPTXRenderer - margin/padding概念の正しい実装", () => {
  let renderer: PPTXRenderer;

  beforeEach(() => {
    renderer = new PPTXRenderer({
      widthPx: 1280,
      heightPx: 720,
      dpi: 96
    });
  });

  describe("marginの仕様", () => {
    it("marginは要素間隔として扱われ、PowerPointのaddTextのmarginオプションには渡されない", () => {
      // Given: marginを持つtext要素
      const textElement: TextElement = {
        type: "text",
        content: "テストテキスト",
        style: {
          margin: 2, // 要素間隔として設定
        },
      };

      const layoutResult: LayoutResult = {
        left: 100,
        top: 100,
        width: 200,
        height: 50,
        element: textElement,
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = vi.fn();
      const mockSlide = {
        addText: mockAddText,
      };
      (renderer as any).currentSlide = mockSlide;

      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: addTextに渡されるmarginは0であること（marginは要素間隔なので）
      expect(mockAddText).toHaveBeenCalledWith(
        "テストテキスト",
        expect.objectContaining({
          margin: 0, // marginは要素間隔なのでPowerPointには渡されない
        }),
      );
    });

    it("heading要素のmarginも要素間隔として扱われる", () => {
      // Given: marginを持つheading要素
      const headingElement: HeadingElement = {
        type: "heading",
        level: 1,
        content: "テスト見出し",
        style: {
          margin: 3, // 要素間隔として設定
        },
      };

      const layoutResult: LayoutResult = {
        left: 50,
        top: 50,
        width: 300,
        height: 60,
        element: headingElement,
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = vi.fn();
      const mockSlide = {
        addText: mockAddText,
      };
      (renderer as any).currentSlide = mockSlide;

      // renderHeadingを直接呼び出し
      (renderer as any).renderHeading(layoutResult, headingElement);

      // Then: addTextに渡されるmarginは0であること（marginは要素間隔なので）
      expect(mockAddText).toHaveBeenCalledWith(
        "テスト見出し",
        expect.objectContaining({
          margin: 0, // marginは要素間隔なのでPowerPointには渡されない
        }),
      );
    });
  });

  describe("paddingの仕様", () => {
    it("paddingはテキストフレーム内マージンとしてPowerPointのaddTextに渡される", () => {
      // Given: paddingを持つtext要素
      const textElement: TextElement = {
        type: "text",
        content: "パディングテスト",
        style: {
          padding: 1, // テキスト内側マージンとして設定
        },
      };

      const layoutResult: LayoutResult = {
        left: 100,
        top: 100,
        width: 200,
        height: 50,
        element: textElement,
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = vi.fn();
      const mockSlide = {
        addText: mockAddText,
      };
      (renderer as any).currentSlide = mockSlide;

      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: addTextに渡されるmarginにpaddingが反映される
      expect(mockAddText).toHaveBeenCalledWith(
        "パディングテスト",
        expect.objectContaining({
          margin: 8, // padding: 1 → 1 * 8 = 8ピクセル
        }),
      );
    });

    it("heading要素のpaddingもテキストフレーム内マージンとして反映される", () => {
      // Given: paddingを持つheading要素
      const headingElement: HeadingElement = {
        type: "heading",
        level: 2,
        content: "パディング見出し",
        style: {
          padding: 2, // テキスト内側マージンとして設定
        },
      };

      const layoutResult: LayoutResult = {
        left: 50,
        top: 50,
        width: 300,
        height: 60,
        element: headingElement,
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = vi.fn();
      const mockSlide = {
        addText: mockAddText,
      };
      (renderer as any).currentSlide = mockSlide;

      // renderHeadingを直接呼び出し
      (renderer as any).renderHeading(layoutResult, headingElement);

      // Then: addTextに渡されるmarginにpaddingが反映される
      expect(mockAddText).toHaveBeenCalledWith(
        "パディング見出し",
        expect.objectContaining({
          margin: 16, // padding: 2 → 2 * 8 = 16ピクセル
        }),
      );
    });

    it("paddingが未設定の場合は0が適用される", () => {
      // Given: paddingが未設定のtext要素
      const textElement: TextElement = {
        type: "text",
        content: "デフォルトパディング",
        // style未設定
      };

      const layoutResult: LayoutResult = {
        left: 100,
        top: 100,
        width: 200,
        height: 50,
        element: textElement,
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = vi.fn();
      const mockSlide = {
        addText: mockAddText,
      };
      (renderer as any).currentSlide = mockSlide;

      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: addTextに渡されるmarginは0
      expect(mockAddText).toHaveBeenCalledWith(
        "デフォルトパディング",
        expect.objectContaining({
          margin: 0, // paddingが未設定なので0
        }),
      );
    });
  });

  describe("margin/padding併用の仕様", () => {
    it("marginとpaddingを両方設定した場合、paddingのみがPowerPointに反映される", () => {
      // Given: marginとpaddingを両方持つtext要素
      const textElement: TextElement = {
        type: "text",
        content: "併用テスト",
        style: {
          margin: 3, // 要素間隔（PowerPointには反映されない）
          padding: 1, // テキスト内側マージン（PowerPointに反映される）
        },
      };

      const layoutResult: LayoutResult = {
        left: 100,
        top: 100,
        width: 200,
        height: 50,
        element: textElement,
      };

      // When: PowerPointのaddTextメソッドをモック
      const mockAddText = vi.fn();
      const mockSlide = {
        addText: mockAddText,
      };
      (renderer as any).currentSlide = mockSlide;

      // renderTextを直接呼び出し
      (renderer as any).renderText(layoutResult, textElement);

      // Then: addTextに渡されるmarginにはpaddingのみが反映される
      expect(mockAddText).toHaveBeenCalledWith(
        "併用テスト",
        expect.objectContaining({
          margin: 8, // padding: 1 → 1 * 8 = 8ピクセル（marginは無視）
        }),
      );
    });
  });
});
