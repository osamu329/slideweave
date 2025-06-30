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
    'font-semibold': { fontWeight: '600' },

    // Colors - Background (Extended)
    'bg-gray-50': { backgroundColor: '#f9fafb' },
    'bg-gray-500': { backgroundColor: '#6b7280' },
    'bg-gray-800': { backgroundColor: '#1f2937' },
    'bg-gray-900': { backgroundColor: '#111827' },
    'bg-blue-100': { backgroundColor: '#dbeafe' },
    'bg-green-100': { backgroundColor: '#dcfce7' },
    'bg-yellow-100': { backgroundColor: '#fef3c7' },
    'bg-red-100': { backgroundColor: '#fee2e2' },

    // Colors - Text (Extended)
    'text-gray-500': { color: '#6b7280' },
    'text-gray-600': { color: '#4b5563' },
    'text-gray-800': { color: '#1f2937' },
    'text-gray-900': { color: '#111827' },
    'text-blue-700': { color: '#1d4ed8' },
    'text-green-700': { color: '#15803d' },
    'text-yellow-700': { color: '#a16207' },
    'text-red-700': { color: '#b91c1c' },

    // Border
    'border': { borderWidth: '1px', borderColor: '#e5e7eb' },
    'border-l-4': { borderLeftWidth: '4px' },
    'border-t': { borderTopWidth: '1px', borderTopColor: '#e5e7eb' },
    'border-blue-200': { borderColor: '#bfdbfe' },
    'border-blue-500': { borderColor: '#3b82f6' },
    'border-green-500': { borderColor: '#22c55e' },
    'border-yellow-500': { borderColor: '#eab308' },
    'border-red-500': { borderColor: '#ef4444' },
    'border-gray-200': { borderColor: '#e5e7eb' },

    // Border Radius
    'rounded-md': { borderRadius: '6px' },
    'rounded-lg': { borderRadius: '8px' },
    'rounded-full': { borderRadius: '9999px' },

    // Spacing - Extended Padding
    'px-8': { paddingLeft: '32px', paddingRight: '32px' },
    'py-4': { paddingTop: '16px', paddingBottom: '16px' },
    'pt-16': { paddingTop: '64px' },

    // Display & Positioning
    'inline-block': { display: 'inline-block' },
    'text-center': { textAlign: 'center' },

    // Shadows
    'shadow-sm': { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    'shadow-lg': { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },

    // Spacing - Extended Gap
    'gap-16': { gap: '64px' },
    
    // Layout - Flexbox Extended  
    'flex-row': { flexDirection: 'row' },
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