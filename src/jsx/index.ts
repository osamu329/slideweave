/**
 * SlideWeave JSX Factory関数
 * React非依存のJSX要素からSlideWeave Element型への変換
 */

import type { Element } from '../types/elements';
import { transformProps } from './utils';

/**
 * JSX Factory関数
 * JSX要素をSlideWeave Element型に変換する
 */
export function createSlideElement(
  type: string,
  props: any,
  ...children: any[]
): Element {
  // propsがnullの場合は空オブジェクトに変換
  const safeProps = props || {};
  
  // プロパティ変換（kebab-case → camelCase、CSS文字列/オブジェクト対応）
  const transformedProps = transformProps(safeProps);
  
  // childrenの処理
  const processedChildren = children.length > 0 ? 
    children.flat().filter(child => 
      child !== null && 
      child !== undefined && 
      child !== false &&
      child !== ''
    ) : undefined;

  // SlideWeave Element型に変換
  const element: Element = {
    type: type as any, // 型の安全性はJSX型定義で保証
    ...transformedProps,
    children: processedChildren
  } as Element;

  // text/heading要素の特別処理: childrenの文字列をcontentに変換
  if ((type === 'text' || type === 'heading') && processedChildren) {
    const textContent = processedChildren
      .filter(child => typeof child === 'string')
      .join('');
    
    if (textContent && !(element as any).content) {
      (element as any).content = textContent;
      // テキストコンテンツはchildrenから除外
      const nonTextChildren = processedChildren.filter(child => typeof child !== 'string');
      (element as any).children = nonTextChildren.length > 0 ? nonTextChildren : undefined;
    }
  }

  return element;
}

/**
 * JSX Fragment関数
 * 複数の要素をまとめるためのFragment（配列として返す）
 */
export function Fragment(props: { children?: any }): any[] {
  if (props.children === undefined) {
    return [];
  }
  return Array.isArray(props.children) ? props.children : [props.children];
}

// JSX Namespace宣言をTypeScriptコンパイラに提供
declare global {
  namespace JSX {
    // JSX Factory関数の型定義
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}