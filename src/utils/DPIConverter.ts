/**
 * DPI変換ユーティリティクラス
 * ピクセル⇔インチ変換を提供
 */

export class DPIConverter {
  private readonly dpi: number;

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
  pxToInch(px: number): number {
    return px / this.dpi;
  }

  /**
   * インチをピクセルに変換
   * @param inch インチ値
   * @returns ピクセル値
   */
  inchToPx(inch: number): number {
    return inch * this.dpi;
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
}
