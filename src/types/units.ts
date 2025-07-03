/**
 * 単位の型安全性を提供するbranded-type定義
 */

// Branded types for units
export type Pixels = number & { __brand: 'px' };
export type Points = number & { __brand: 'pt' };
export type Inches = number & { __brand: 'inch' };

// 明示的な作成関数
export function createPixels(value: number): Pixels {
  return value as Pixels;
}

export function createPoints(value: number): Points {
  return value as Points;
}

export function createInches(value: number): Inches {
  return value as Inches;
}