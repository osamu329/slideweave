/**
 * SlideWeave JSX Factory関数
 * React非依存のJSX要素からSlideWeave Element型への変換
 */

import type { Element } from '../types/elements';
import { transformProps } from './utils';

/**
 * JSX Factory関数
 * JSX要素をSlideWeave Element型に変換する
 * 関数コンポーネントもサポート
 */
export function createSlideElement(
  type: string | Function,
  props: any,
  ...children: any[]
): Element | Element[] {
  // 関数コンポーネントの場合
  if (typeof type === 'function') {
    return processComponent(type, props, children);
  }

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
 * 関数コンポーネントを処理する
 */
function processComponent(
  component: Function,
  props: any,
  children: any[]
): Element | Element[] {
  // propsがnullの場合は空オブジェクトに変換
  const safeProps = props || {};
  
  // childrenを適切に処理
  const processedChildren = children.length > 0 ? 
    children.flat().filter(child => 
      child !== null && 
      child !== undefined && 
      child !== false &&
      child !== ''
    ) : undefined;

  // コンポーネントpropsを作成
  const componentProps = {
    ...safeProps,
    children: processedChildren
  };

  // コンポーネント関数を実行
  const result = component(componentProps);
  
  // 結果を再帰的に処理（ネストしたコンポーネント対応）
  return processComponentResult(result);
}

/**
 * コンポーネントの実行結果を処理する（再帰対応）
 */
function processComponentResult(result: any): Element | Element[] {
  if (!result) {
    return [] as Element[];
  }

  if (Array.isArray(result)) {
    return result.flatMap(item => processComponentResult(item));
  }

  // 結果がcreateSlideElementの呼び出し結果の場合はそのまま返す
  if (isSlideWeaveElement(result)) {
    return result;
  }

  // その他の場合（文字列など）
  return result;
}

/**
 * SlideWeave Element型かどうかを判定
 */
function isSlideWeaveElement(obj: any): obj is Element {
  return obj && typeof obj === 'object' && typeof obj.type === 'string';
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