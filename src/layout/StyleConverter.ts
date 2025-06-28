/**
 * スタイル単位変換ユーティリティ
 * 無次元数値を8px単位に変換するだけのシンプルな実装
 */


/**
 * 無次元数値を8px単位でピクセル文字列に変換
 */
export class StyleConverter {
  /**
   * 8px単位の無次元数値をピクセル文字列に変換
   * 文字列はそのままYogaに渡す（Yogaの責務）
   * 
   * @param value 数値（8px単位）または文字列（"100px", "50%", "auto"等）
   * @returns ピクセル文字列または元の文字列
   */
  static convertDimensionUnit(value: number | string): string {
    if (typeof value === 'number') {
      return `${value * 8}px`; // 8px単位をピクセル文字列に変換
    }
    return value; // 文字列はYogaにそのまま渡す
  }

  /**
   * spacing値（margin/padding）を変換
   * 無次元数値のみ8px変換、文字列はそのまま
   */
  static convertSpacingUnit(value: number | string): string {
    if (typeof value === 'number') {
      return `${value * 8}px`; // 8px単位をピクセル文字列に変換
    }
    return value; // "10px", "5%"等はYogaにそのまま渡す
  }
}