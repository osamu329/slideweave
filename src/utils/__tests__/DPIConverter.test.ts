import { DPIConverter } from "../DPIConverter";
import { SLIDE_FORMATS } from "../SlideFormats";

describe("DPIConverter", () => {
  describe("constructor", () => {
    test("正の数値でインスタンスを作成できる", () => {
      const converter = new DPIConverter(96);
      expect(converter.getDPI()).toBe(96);
    });

    test("0以下の値でエラーをスローする", () => {
      expect(() => new DPIConverter(0)).toThrow(
        "DPI must be a positive number",
      );
      expect(() => new DPIConverter(-1)).toThrow(
        "DPI must be a positive number",
      );
    });
  });

  describe("DPI値別の基本動作", () => {
    test("wide形式DPIでインスタンスを作成", () => {
      const converter = new DPIConverter(SLIDE_FORMATS.wide.dpi);
      expect(converter.getDPI()).toBe(SLIDE_FORMATS.wide.dpi);
    });

    test("standard形式DPIでインスタンスを作成", () => {
      const converter = new DPIConverter(SLIDE_FORMATS.standard.dpi);
      expect(converter.getDPI()).toBe(SLIDE_FORMATS.standard.dpi);
    });
  });

  describe("pxToInch", () => {
    test("96 DPIでピクセルをインチに変換する", () => {
      const converter = new DPIConverter(96);
      expect(converter.pxToInch(96)).toBe(1.0);
      expect(converter.pxToInch(192)).toBe(2.0);
      expect(converter.pxToInch(48)).toBe(0.5);
    });

    test("72 DPIでピクセルをインチに変換する", () => {
      const converter = new DPIConverter(72);
      expect(converter.pxToInch(72)).toBe(1.0);
      expect(converter.pxToInch(144)).toBe(2.0);
      expect(converter.pxToInch(36)).toBe(0.5);
    });

    test("小数点を含む値で正確に変換する", () => {
      const converter = new DPIConverter(96);
      expect(converter.pxToInch(200)).toBeCloseTo(2.0833, 4);
    });
  });

  describe("inchToPx", () => {
    test("96 DPIでインチをピクセルに変換する", () => {
      const converter = new DPIConverter(96);
      expect(converter.inchToPx(1.0)).toBe(96);
      expect(converter.inchToPx(2.0)).toBe(192);
      expect(converter.inchToPx(0.5)).toBe(48);
    });

    test("72 DPIでインチをピクセルに変換する", () => {
      const converter = new DPIConverter(72);
      expect(converter.inchToPx(1.0)).toBe(72);
      expect(converter.inchToPx(2.0)).toBe(144);
      expect(converter.inchToPx(0.5)).toBe(36);
    });
  });

  describe("変換係数プロパティ", () => {
    test("pxToInchRatioが正しい値を返す", () => {
      const converter96 = new DPIConverter(96);
      const converter72 = new DPIConverter(72);

      expect(converter96.pxToInchRatio).toBeCloseTo(1 / 96, 6);
      expect(converter72.pxToInchRatio).toBeCloseTo(1 / 72, 6);
    });

    test("inchToPxRatioが正しい値を返す", () => {
      const converter96 = new DPIConverter(96);
      const converter72 = new DPIConverter(72);

      expect(converter96.inchToPxRatio).toBe(96);
      expect(converter72.inchToPxRatio).toBe(72);
    });
  });

  describe("実際の使用例", () => {
    test("PPTXRenderer相当の座標変換", () => {
      const converter = new DPIConverter(SLIDE_FORMATS.wide.dpi);

      // レイアウト結果：200px × 100px
      const layoutResult = { left: 50, top: 25, width: 200, height: 100 };

      const pptxPosition = {
        x: converter.pxToInch(layoutResult.left), // 50px → 0.520833...inch
        y: converter.pxToInch(layoutResult.top), // 25px → 0.260416...inch
        w: converter.pxToInch(layoutResult.width), // 200px → 2.083333...inch
        h: converter.pxToInch(layoutResult.height), // 100px → 1.041666...inch
      };

      expect(pptxPosition.x).toBeCloseTo(0.5208, 4);
      expect(pptxPosition.y).toBeCloseTo(0.2604, 4);
      expect(pptxPosition.w).toBeCloseTo(2.0833, 4);
      expect(pptxPosition.h).toBeCloseTo(1.0417, 4);
    });

    test("build.ts相当の設定変換", () => {
      const converter = new DPIConverter(SLIDE_FORMATS.standard.dpi);

      // 設定ファイルのピクセル値
      const configWidth = SLIDE_FORMATS.standard.widthPx;
      const configHeight = SLIDE_FORMATS.standard.heightPx;

      // PowerPoint用インチ値
      const slideWidth = converter.pxToInch(configWidth); // 720px ÷ 72 = 10.0inch
      const slideHeight = converter.pxToInch(configHeight); // 540px ÷ 72 = 7.5inch

      expect(slideWidth).toBe(10.0);
      expect(slideHeight).toBe(7.5);
    });
  });

  describe("往復変換", () => {
    test("px→inch→pxで元の値に戻る", () => {
      const converter = new DPIConverter(96);
      const originalPx = 200;

      const inch = converter.pxToInch(originalPx);
      const backToPx = converter.inchToPx(inch);

      expect(backToPx).toBeCloseTo(originalPx, 10);
    });

    test("inch→px→inchで元の値に戻る", () => {
      const converter = new DPIConverter(72);
      const originalInch = 2.5;

      const px = converter.inchToPx(originalInch);
      const backToInch = converter.pxToInch(px);

      expect(backToInch).toBeCloseTo(originalInch, 10);
    });
  });
});
