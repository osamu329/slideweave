/**
 * StyleConverter のテスト（シンプル版）
 *
 * 仕様:
 * - 無次元数値: 8px単位として×8でピクセル文字列に変換
 * - 文字列: そのままYogaに渡す（Yogaの責務）
 */

import { StyleConverter } from "../StyleConverter";

describe("StyleConverter", () => {
  describe("convertDimensionUnit()", () => {
    it("should convert dimensionless numbers to 8px unit strings", () => {
      expect(StyleConverter.convertDimensionUnit(30)).toBe("240px"); // 30 * 8
      expect(StyleConverter.convertDimensionUnit(20)).toBe("160px"); // 20 * 8
      expect(StyleConverter.convertDimensionUnit(0)).toBe("0px"); // 0 * 8
      expect(StyleConverter.convertDimensionUnit(1.5)).toBe("12px"); // 1.5 * 8
    });

    it("should pass through string values unchanged (Yoga responsibility)", () => {
      expect(StyleConverter.convertDimensionUnit("640px")).toBe("640px");
      expect(StyleConverter.convertDimensionUnit("50%")).toBe("50%");
      expect(StyleConverter.convertDimensionUnit("auto")).toBe("auto");
      expect(StyleConverter.convertDimensionUnit("100vh")).toBe("100vh");
      expect(StyleConverter.convertDimensionUnit("50vw")).toBe("50vw");
    });
  });

  describe("convertSpacingUnit()", () => {
    it("should convert dimensionless numbers to 8px unit strings", () => {
      expect(StyleConverter.convertSpacingUnit(4)).toBe("32px"); // 4 * 8
      expect(StyleConverter.convertSpacingUnit(2)).toBe("16px"); // 2 * 8
      expect(StyleConverter.convertSpacingUnit(1)).toBe("8px"); // 1 * 8
      expect(StyleConverter.convertSpacingUnit(0.5)).toBe("4px"); // 0.5 * 8
    });

    it("should pass through string values unchanged (Yoga responsibility)", () => {
      expect(StyleConverter.convertSpacingUnit("16px")).toBe("16px");
      expect(StyleConverter.convertSpacingUnit("10%")).toBe("10%");
      expect(StyleConverter.convertSpacingUnit("1rem")).toBe("1rem");
      expect(StyleConverter.convertSpacingUnit("auto")).toBe("auto");
    });
  });

  describe("Edge cases", () => {
    it("should handle zero and negative values", () => {
      expect(StyleConverter.convertDimensionUnit(0)).toBe("0px");
      expect(StyleConverter.convertDimensionUnit(-5)).toBe("-40px"); // -5 * 8
    });

    it("should handle decimal values", () => {
      expect(StyleConverter.convertDimensionUnit(2.5)).toBe("20px"); // 2.5 * 8
      expect(StyleConverter.convertSpacingUnit(1.25)).toBe("10px"); // 1.25 * 8
    });

    it("should handle empty strings", () => {
      expect(StyleConverter.convertDimensionUnit("")).toBe("");
      expect(StyleConverter.convertSpacingUnit("")).toBe("");
    });
  });
});
