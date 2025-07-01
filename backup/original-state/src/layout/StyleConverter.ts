/**
 * スタイル単位変換ユーティリティ
 * 単位付き文字列をYogaライブラリに直接渡す設計
 */

/**
 * 単位システム統一: px/vw/vh/%のみサポート
 * 無次元数値は非対応（警告を表示）
 */
export class StyleConverter {
  /**
   * 値を検証してYogaに渡す適切な形式に変換
   * 
   * @param value 文字列（"100px", "50%", "auto", "100vw"等）
   * @param propertyName プロパティ名（警告表示用）
   * @returns Yogaに渡す文字列
   */
  static convertDimensionUnit(value: number | string, propertyName: string = 'property'): string {
    if (typeof value === 'number') {
      console.warn(`⚠️  Unitless values are not supported for ${propertyName}. Use "px", "%", "vw", "vh" units instead. Received: ${value}`);
      // フォールバック: px単位として扱う
      return `${value}px`;
    }
    
    // 文字列の場合は、サポートされている単位かチェック
    if (typeof value === 'string') {
      const supportedUnits = /^(auto|inherit|initial|unset|\d*\.?\d+(px|%|vw|vh|em|rem))$/i;
      if (!supportedUnits.test(value.trim())) {
        console.warn(`⚠️  Unsupported unit for ${propertyName}: "${value}". Supported units: px, %, vw, vh, em, rem, auto`);
      }
    }
    
    return value; // Yogaに直接渡す
  }

  /**
   * spacing値（margin/padding）を変換
   * 単位付き文字列のみサポート、無次元数値は警告
   */
  static convertSpacingUnit(value: number | string, propertyName: string = 'spacing'): string {
    return this.convertDimensionUnit(value, propertyName);
  }
}