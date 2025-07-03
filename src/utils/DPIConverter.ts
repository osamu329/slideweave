/**
 * DPI変換ユーティリティクラス
 * ピクセル⇔インチ変換を提供
 */

import { Pixels, Points, Inches, createPixels, createPoints, createInches } from "../types/units";

export class DPIConverter {
  private readonly dpi: number;
  
  /** 印刷業界標準: 1ポイント = 1/72インチ */
  public static readonly POINTS_PER_INCH = 72;

  /**
   * DPI値を指定してコンストラクタを作成
   * @param dpi DPI値
   */
  constructor(dpi: number) {
    if (dpi <= 0) {
      throw new Error("DPI must be a positive number");
    }
    this.dpi = dpi;
  }

  /**
   * 設定されているDPI値を取得
   * @returns DPI値
   */
  getDPI(): number {
    return this.dpi;
  }

  /**
   * ピクセルをインチに変換
   * @param px ピクセル値
   * @returns インチ値
   */
  pxToInch(px: Pixels): Inches {
    return createInches(px / this.dpi);
  }

  /**
   * インチをピクセルに変換
   * @param inch インチ値
   * @returns ピクセル値
   */
  inchToPx(inch: Inches): Pixels {
    return createPixels(inch * this.dpi);
  }

  /**
   * ピクセル→インチ変換係数を取得
   * @returns 変換係数（1/DPI）
   */
  get pxToInchRatio(): number {
    return 1 / this.dpi;
  }

  /**
   * インチ→ピクセル変換係数を取得
   * @returns 変換係数（DPI）
   */
  get inchToPxRatio(): number {
    return this.dpi;
  }

  /**
   * ポイントをピクセルに変換
   * @param pt ポイント値
   * @returns ピクセル値
   */
  ptToPx(pt: Points): Pixels {
    return createPixels(pt * (this.dpi / DPIConverter.POINTS_PER_INCH));
  }

  /**
   * ピクセルをポイントに変換
   * @param px ピクセル値
   * @returns ポイント値
   */
  pxToPt(px: Pixels): Points {
    return createPoints(px * (DPIConverter.POINTS_PER_INCH / this.dpi));
  }
}
