/**
 * Tailwind CSS ライクなユーティリティクラス機能
 * 組み込みTailwindクラスをCSSプロパティにマッピング
 */

import { ParsedStyle } from './CSSStyleParser';

interface UtilityMapping {
  [className: string]: ParsedStyle;
}

export class TailwindUtilities {
  private static readonly utilities: UtilityMapping = {
    // Spacing - Padding
    'p-0': { padding: '0px' },
    'p-4': { padding: '16px' },
    'p-8': { padding: '32px' },
    'p-16': { padding: '64px' },

    // Spacing - Margin
    'm-0': { margin: '0px' },
    'm-4': { margin: '16px' },
    'm-8': { margin: '32px' },
    'm-16': { margin: '64px' },

    // Spacing - Directional Margin
    'mt-4': { marginTop: '16px' },
    'mt-8': { marginTop: '32px' },
    'mt-16': { marginTop: '64px' },
    'mb-4': { marginBottom: '16px' },
    'mb-8': { marginBottom: '32px' },
    'mb-16': { marginBottom: '64px' },
    'ml-4': { marginLeft: '16px' },
    'ml-8': { marginLeft: '32px' },
    'ml-16': { marginLeft: '64px' },
    'mr-4': { marginRight: '16px' },
    'mr-8': { marginRight: '32px' },
    'mr-16': { marginRight: '64px' },

    // Spacing - Gap
    'gap-4': { gap: '16px' },
    'gap-8': { gap: '32px' },

    // Colors - Background
    'bg-white': { backgroundColor: '#ffffff' },
    'bg-red-500': { backgroundColor: '#dc2626' },
    'bg-blue-500': { backgroundColor: '#2563eb' },
    'bg-green-500': { backgroundColor: '#16a34a' },
    'bg-purple-500': { backgroundColor: '#7c3aed' },
    'bg-yellow-500': { backgroundColor: '#f59e0b' },
    'bg-gray-100': { backgroundColor: '#f3f4f6' },
    'bg-blue-50': { backgroundColor: '#eff6ff' },
    'bg-green-50': { backgroundColor: '#f0fdf4' },

    // Colors - Text
    'text-white': { color: '#ffffff' },
    'text-black': { color: '#000000' },
    'text-red-600': { color: '#dc2626' },
    'text-blue-800': { color: '#1e40af' },
    'text-gray-700': { color: '#374151' },

    // Layout - Flexbox
    'flex': { flexDirection: 'row' },
    'flex-col': { flexDirection: 'column' },

    // Layout - Width
    'w-full': { width: '100%' },
    'w-auto': { width: 'auto' },

    // Layout - Height
    'h-auto': { height: 'auto' },

    // Layout - Flex grow
    'flex-1': { flex: 1 },
    'flex-4': { flex: 4 },

    // Typography - Font size
    'text-xs': { fontSize: '12px' },
    'text-sm': { fontSize: '14px' },
    'text-base': { fontSize: '16px' },
    'text-lg': { fontSize: '18px' },
    'text-xl': { fontSize: '20px' },
    'text-2xl': { fontSize: '24px' },
    'text-4xl': { fontSize: '28px' },

    // Typography - Font weight
    'font-normal': { fontWeight: 'normal' },
    'font-bold': { fontWeight: 'bold' },

    // Typography - Font style
    'italic': { fontStyle: 'italic' },
  };

  /**
   * 単一のTailwindクラスをCSSプロパティに変換
   * @param className Tailwindクラス名
   * @returns CSSプロパティオブジェクト
   */
  static parseClass(className: string): ParsedStyle {
    if (!className || className.trim() === '') {
      return {};
    }

    const trimmed = className.trim();
    return this.utilities[trimmed] || {};
  }

  /**
   * 複数のTailwindクラスをCSSプロパティに変換
   * @param classNames Tailwindクラス名の配列
   * @returns マージされたCSSプロパティオブジェクト
   */
  static parseClasses(classNames: string[]): ParsedStyle {
    const result: ParsedStyle = {};

    for (const className of classNames) {
      const styles = this.parseClass(className);
      Object.assign(result, styles);
    }

    return result;
  }

  /**
   * クラス名がTailwindユーティリティクラスかどうかを判定
   * @param className クラス名
   * @returns Tailwindクラスの場合true
   */
  static isTailwindClass(className: string): boolean {
    if (!className || className.trim() === '') {
      return false;
    }

    const trimmed = className.trim();
    return trimmed in this.utilities;
  }

  /**
   * 対応しているTailwindクラスの一覧を取得
   * @returns サポート済みクラス名の配列
   */
  static getSupportedClasses(): string[] {
    return Object.keys(this.utilities);
  }

  /**
   * Tailwindクラスとカスタムクラスを分離
   * @param classNames クラス名の配列
   * @returns 分離されたクラス名
   */
  static separateClasses(classNames: string[]): {
    tailwindClasses: string[];
    customClasses: string[];
  } {
    const tailwindClasses: string[] = [];
    const customClasses: string[] = [];

    for (const className of classNames) {
      if (this.isTailwindClass(className)) {
        tailwindClasses.push(className);
      } else {
        customClasses.push(className);
      }
    }

    return { tailwindClasses, customClasses };
  }
}