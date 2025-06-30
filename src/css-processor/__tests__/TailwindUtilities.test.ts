/**
 * TailwindUtilities テスト
 * 組み込みTailwindライクユーティリティクラス機能のTDDテスト
 */

import { TailwindUtilities } from '../TailwindUtilities';

describe('TailwindUtilities', () => {
  describe('Spacing utilities', () => {
    test('should convert padding utilities to CSS properties', () => {
      expect(TailwindUtilities.parseClass('p-0')).toEqual({ padding: '0px' });
      expect(TailwindUtilities.parseClass('p-4')).toEqual({ padding: '16px' });
      expect(TailwindUtilities.parseClass('p-8')).toEqual({ padding: '32px' });
      expect(TailwindUtilities.parseClass('p-16')).toEqual({ padding: '64px' });
    });

    test('should convert margin utilities to CSS properties', () => {
      expect(TailwindUtilities.parseClass('m-0')).toEqual({ margin: '0px' });
      expect(TailwindUtilities.parseClass('m-4')).toEqual({ margin: '16px' });
      expect(TailwindUtilities.parseClass('m-8')).toEqual({ margin: '32px' });
      expect(TailwindUtilities.parseClass('m-16')).toEqual({ margin: '64px' });
    });

    test('should convert directional margin utilities', () => {
      expect(TailwindUtilities.parseClass('mt-4')).toEqual({ marginTop: '16px' });
      expect(TailwindUtilities.parseClass('mb-8')).toEqual({ marginBottom: '32px' });
      expect(TailwindUtilities.parseClass('ml-4')).toEqual({ marginLeft: '16px' });
      expect(TailwindUtilities.parseClass('mr-8')).toEqual({ marginRight: '32px' });
    });

    test('should convert gap utilities', () => {
      expect(TailwindUtilities.parseClass('gap-8')).toEqual({ gap: '32px' });
      expect(TailwindUtilities.parseClass('gap-4')).toEqual({ gap: '16px' });
    });
  });

  describe('Color utilities', () => {
    test('should convert background color utilities', () => {
      expect(TailwindUtilities.parseClass('bg-white')).toEqual({ backgroundColor: '#ffffff' });
      expect(TailwindUtilities.parseClass('bg-red-500')).toEqual({ backgroundColor: '#dc2626' });
      expect(TailwindUtilities.parseClass('bg-blue-500')).toEqual({ backgroundColor: '#2563eb' });
      expect(TailwindUtilities.parseClass('bg-green-500')).toEqual({ backgroundColor: '#16a34a' });
      expect(TailwindUtilities.parseClass('bg-purple-500')).toEqual({ backgroundColor: '#7c3aed' });
      expect(TailwindUtilities.parseClass('bg-yellow-500')).toEqual({ backgroundColor: '#f59e0b' });
    });

    test('should convert background color utilities with different shades', () => {
      expect(TailwindUtilities.parseClass('bg-gray-100')).toEqual({ backgroundColor: '#f3f4f6' });
      expect(TailwindUtilities.parseClass('bg-blue-50')).toEqual({ backgroundColor: '#eff6ff' });
      expect(TailwindUtilities.parseClass('bg-green-50')).toEqual({ backgroundColor: '#f0fdf4' });
    });

    test('should convert text color utilities', () => {
      expect(TailwindUtilities.parseClass('text-white')).toEqual({ color: '#ffffff' });
      expect(TailwindUtilities.parseClass('text-black')).toEqual({ color: '#000000' });
      expect(TailwindUtilities.parseClass('text-red-600')).toEqual({ color: '#dc2626' });
      expect(TailwindUtilities.parseClass('text-blue-800')).toEqual({ color: '#1e40af' });
      expect(TailwindUtilities.parseClass('text-gray-700')).toEqual({ color: '#374151' });
    });
  });

  describe('Layout utilities', () => {
    test('should convert flexbox utilities', () => {
      expect(TailwindUtilities.parseClass('flex')).toEqual({ flexDirection: 'row' });
      expect(TailwindUtilities.parseClass('flex-col')).toEqual({ flexDirection: 'column' });
    });

    test('should convert width utilities', () => {
      expect(TailwindUtilities.parseClass('w-full')).toEqual({ width: '100%' });
      expect(TailwindUtilities.parseClass('w-auto')).toEqual({ width: 'auto' });
    });

    test('should convert height utilities', () => {
      expect(TailwindUtilities.parseClass('h-auto')).toEqual({ height: 'auto' });
    });

    test('should convert flex grow utilities', () => {
      expect(TailwindUtilities.parseClass('flex-1')).toEqual({ flex: 1 });
      expect(TailwindUtilities.parseClass('flex-4')).toEqual({ flex: 4 });
    });
  });

  describe('Typography utilities', () => {
    test('should convert font size utilities', () => {
      expect(TailwindUtilities.parseClass('text-xs')).toEqual({ fontSize: '12px' });
      expect(TailwindUtilities.parseClass('text-sm')).toEqual({ fontSize: '14px' });
      expect(TailwindUtilities.parseClass('text-base')).toEqual({ fontSize: '16px' });
      expect(TailwindUtilities.parseClass('text-lg')).toEqual({ fontSize: '18px' });
      expect(TailwindUtilities.parseClass('text-xl')).toEqual({ fontSize: '20px' });
      expect(TailwindUtilities.parseClass('text-2xl')).toEqual({ fontSize: '24px' });
      expect(TailwindUtilities.parseClass('text-4xl')).toEqual({ fontSize: '28px' });
    });

    test('should convert font weight utilities', () => {
      expect(TailwindUtilities.parseClass('font-normal')).toEqual({ fontWeight: 'normal' });
      expect(TailwindUtilities.parseClass('font-bold')).toEqual({ fontWeight: 'bold' });
    });

    test('should convert font style utilities', () => {
      expect(TailwindUtilities.parseClass('italic')).toEqual({ fontStyle: 'italic' });
    });
  });

  describe('Multiple class parsing', () => {
    test('should parse multiple Tailwind classes', () => {
      const result = TailwindUtilities.parseClasses(['p-4', 'bg-blue-500', 'text-white']);
      expect(result).toEqual({
        padding: '16px',
        backgroundColor: '#2563eb',
        color: '#ffffff'
      });
    });

    test('should handle class conflicts (later classes win)', () => {
      const result = TailwindUtilities.parseClasses(['bg-red-500', 'bg-blue-500']);
      expect(result).toEqual({
        backgroundColor: '#2563eb' // 後のクラスが優先
      });
    });

    test('should ignore unknown classes', () => {
      const result = TailwindUtilities.parseClasses(['p-4', 'unknown-class', 'text-white']);
      expect(result).toEqual({
        padding: '16px',
        color: '#ffffff'
      });
    });

    test('should handle empty class list', () => {
      const result = TailwindUtilities.parseClasses([]);
      expect(result).toEqual({});
    });
  });

  describe('isTailwindClass', () => {
    test('should identify Tailwind classes correctly', () => {
      expect(TailwindUtilities.isTailwindClass('p-4')).toBe(true);
      expect(TailwindUtilities.isTailwindClass('bg-blue-500')).toBe(true);
      expect(TailwindUtilities.isTailwindClass('flex')).toBe(true);
      expect(TailwindUtilities.isTailwindClass('text-lg')).toBe(true);
      
      expect(TailwindUtilities.isTailwindClass('custom-class')).toBe(false);
      expect(TailwindUtilities.isTailwindClass('my-component')).toBe(false);
      expect(TailwindUtilities.isTailwindClass('unknown-utility')).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should return empty object for unknown class', () => {
      expect(TailwindUtilities.parseClass('unknown-class')).toEqual({});
    });

    test('should handle null/undefined input gracefully', () => {
      expect(TailwindUtilities.parseClass('')).toEqual({});
    });
  });
});