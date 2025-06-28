/**
 * 8pxグリッドシステム
 * SlideWeaveで使用する8px単位の座標系とPPTXGenJS用の変換機能
 */
export class GridSystem {
  private static readonly GRID_UNIT = 8; // 8px
  private static readonly PX_TO_PT = 0.75; // 1px = 0.75pt
  private static readonly PT_TO_INCH = 1 / 72; // 1pt = 1/72 inch

  /**
   * グリッド単位をポイントに変換
   * @param gridUnits 8px単位の値
   * @returns ポイント値
   */
  static toPoints(gridUnits: number): number {
    const pixels = gridUnits * this.GRID_UNIT;
    return pixels * this.PX_TO_PT;
  }

  /**
   * ポイントをインチに変換
   * @param points ポイント値
   * @returns インチ値（小数点以下2桁）
   */
  static toInches(points: number): number {
    const inches = points * this.PT_TO_INCH;
    return Math.round(inches * 100) / 100;
  }

  /**
   * グリッド単位を直接インチに変換
   * @param gridUnits 8px単位の値
   * @returns インチ値
   */
  static gridToInches(gridUnits: number): number {
    const points = this.toPoints(gridUnits);
    return this.toInches(points);
  }

  /**
   * PPTXGenJS用のデフォルトテキストオプションを生成
   * @returns PPTXGenJSテキストオプション
   */
  static getDefaultTextOptions(): object {
    return {
      margin: 0,
      isTextBox: true,
      lineSpacing: 0
    };
  }

  /**
   * PPTXGenJS用の位置・サイズオプションを生成
   * @param left 左座標（グリッド単位）
   * @param top 上座標（グリッド単位）
   * @param width 幅（グリッド単位）
   * @param height 高さ（グリッド単位）
   * @returns PPTXGenJS位置・サイズオプション
   */
  static getPositionOptions(left: number, top: number, width: number, height: number): object {
    return {
      x: this.gridToInches(left),
      y: this.gridToInches(top),
      w: this.gridToInches(width),
      h: this.gridToInches(height)
    };
  }
}