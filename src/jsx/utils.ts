/**
 * JSX関連ユーティリティ関数
 * プロパティ変換、CSS処理等の機能を提供
 */

import type { BaseStyle } from '../types/elements';

/**
 * kebab-case → camelCase変換
 */
export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * camelCase → kebab-case変換
 */
export function camelToKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

/**
 * CSS文字列をオブジェクトに変換
 * 例: "font-size: 16px; color: red;" → { fontSize: '16px', color: 'red' }
 */
export function parseCSSString(cssString: string): Record<string, any> {
  const result: Record<string, any> = {};
  
  // CSS文字列を行ごとに分割
  const declarations = cssString
    .split(';')
    .map(decl => decl.trim())
    .filter(decl => decl.length > 0);
  
  for (const declaration of declarations) {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex === -1) continue;
    
    const property = declaration.slice(0, colonIndex).trim();
    const value = declaration.slice(colonIndex + 1).trim();
    
    // kebab-case → camelCase変換
    const camelProperty = kebabToCamelCase(property);
    
    // 数値の場合は変換（pxなど単位付きは文字列のまま）
    result[camelProperty] = parseValue(value);
  }
  
  return result;
}

/**
 * CSS値のパース（文字列から適切な型に変換）
 */
function parseValue(value: string): any {
  // 数値のみの場合は数値に変換
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  // 小数点を含む数値の場合
  if (/^\d+\.\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // その他は文字列のまま
  return value;
}

/**
 * JSXプロパティを変換
 * - kebab-case → camelCase変換
 * - CSS文字列/オブジェクト両形式のstyle対応
 * - className の処理
 */
export function transformProps(props: any): any {
  if (!props || typeof props !== 'object') {
    return {};
  }
  
  const result: any = {};
  
  for (const [key, value] of Object.entries(props)) {
    // style プロパティの特別処理
    if (key === 'style') {
      if (typeof value === 'string') {
        // CSS文字列の場合はオブジェクトに変換
        result.style = parseCSSString(value);
      } else if (typeof value === 'object' && value !== null) {
        // オブジェクトの場合はそのまま（ただしkebab-caseキーがあれば変換）
        result.style = transformStyleObject(value);
      }
      continue;
    }
    
    // className プロパティの処理
    if (key === 'className') {
      result.class = value;
      continue;
    }
    
    // その他のプロパティはkebab-case → camelCase変換
    const camelKey = kebabToCamelCase(key);
    result[camelKey] = value;
  }
  
  return result;
}

/**
 * スタイルオブジェクト内のキーをkebab-case → camelCaseに変換
 */
function transformStyleObject(styleObj: any): BaseStyle {
  const result: any = {};
  
  for (const [key, value] of Object.entries(styleObj)) {
    const camelKey = kebabToCamelCase(key);
    result[camelKey] = value;
  }
  
  return result as BaseStyle;
}