/**
 * スタイル単位変換ユーティリティ
 * 無次元数値を4px単位に変換するだけのシンプルな実装
 */


/**
 * 無次元数値を4px単位でピクセル文字列に変換
 */
export class StyleConverter {
  /**
   * 4px単位の無次元数値をピクセル文字列に変換
   * 文字列はそのままYogaに渡す（Yogaの責務）
   * 
   * @param value 数値（4px単位）または文字列（"100px", "50%", "auto"等）
   * @returns ピクセル文字列または元の文字列
   */
  static convertDimensionUnit(value: number | string): string {
    if (typeof value === 'number') {
      return `${value * 4}px`; // 4px単位をピクセル文字列に変換
    }
    return value; // 文字列はYogaにそのまま渡す
  }

  /**
   * spacing値（margin/padding）を変換
   * 無次元数値のみ4px変換、文字列はそのまま
   */
  static convertSpacingUnit(value: number | string): string {
    if (typeof value === 'number') {
      return `${value * 4}px`; // 4px単位をピクセル文字列に変換
    }
    return value; // "10px", "5%"等はYogaにそのまま渡す
  }
}