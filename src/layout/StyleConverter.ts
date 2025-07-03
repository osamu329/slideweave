/**
 * スタイル単位変換ユーティリティ
 * 単位付き文字列をYogaライブラリに直接渡す設計
 */

import { DPIConverter } from "../utils/DPIConverter";
import { createPoints } from "../types/units";

/**
 * 単位システム統一: px/vw/vh/%のみサポート
 * 無次元数値は非対応（警告を表示）
 */
export class StyleConverter {
  private dpiConverter: DPIConverter;

  constructor(dpi: number) {
    this.dpiConverter = new DPIConverter(dpi);
  }

  /**
   * 値を検証してYogaに渡す適切な形式に変換
   *
   * @param value 文字列（"100px", "50%", "auto", "100vw", "14pt"等）
   * @param propertyName プロパティ名（警告表示用）
   * @returns Yogaに渡す文字列
   */
  convertDimensionUnit(
    value: number | string,
    propertyName: string = "property",
  ): string {
    if (typeof value === "number") {
      console.warn(
        `⚠️  Unitless values are not supported for ${propertyName}. Use "px", "%", "vw", "vh" units instead. Received: ${value}`,
      );
      // フォールバック: px単位として扱う
      return `${value}px`;
    }

    // 文字列の場合は、pt単位をpx単位に変換
    if (typeof value === "string") {
      const trimmed = value.trim();
      
      // pt単位の場合、px単位に変換（Yogaはptをサポートしないため）
      if (trimmed.endsWith("pt")) {
        const ptValue = parseFloat(trimmed.replace("pt", ""));
        if (!isNaN(ptValue)) {
          const pxValue = this.dpiConverter.ptToPx(createPoints(ptValue));
          return `${pxValue}px`;
        }
      }

      // サポートされている単位かチェック
      const supportedUnits =
        /^(auto|inherit|initial|unset|\d*\.?\d+(px|%|vw|vh|em|rem|pt))$/i;
      if (!supportedUnits.test(trimmed)) {
        console.warn(
          `⚠️  Unsupported unit for ${propertyName}: "${value}". Supported units: px, %, vw, vh, em, rem, pt, auto`,
        );
      }
    }

    return value; // Yogaに直接渡す
  }

  /**
   * spacing値（margin/padding）を変換
   * 単位付き文字列のみサポート、無次元数値は警告
   */
  convertSpacingUnit(
    value: number | string,
    propertyName: string = "spacing",
  ): string {
    return this.convertDimensionUnit(value, propertyName);
  }
}
