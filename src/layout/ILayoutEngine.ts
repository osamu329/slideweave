/**
 * レイアウトエンジンのインターフェース
 * 異なるレイアウトエンジン（css-layout, yoga-layout等）を差し替え可能にする
 */

import { Element } from "../types/elements";

export interface LayoutResult {
  left: number;
  top: number;
  width: number;
  height: number;
  element: Element;
  children?: LayoutResult[];
}

/**
 * レイアウトエンジンインターフェース
 */
export interface ILayoutEngine {
  /**
   * レイアウト計算を実行
   * @param element 要素
   * @param containerWidth コンテナ幅
   * @param containerHeight コンテナ高さ
   * @returns レイアウト結果
   */
  renderLayout(
    _element: Element,
    _containerWidth?: number,
    _containerHeight?: number,
  ): LayoutResult | Promise<LayoutResult>;

  /**
   * エンジン名
   */
  readonly name: string;
}

/**
 * レイアウト結果を平坦化（絶対座標に変換）
 */
export function flattenLayout(
  layoutResult: LayoutResult,
  parentLeft: number = 0,
  parentTop: number = 0,
): LayoutResult[] {
  const absoluteLeft = parentLeft + layoutResult.left;
  const absoluteTop = parentTop + layoutResult.top;

  const flattened: LayoutResult[] = [
    {
      ...layoutResult,
      left: absoluteLeft,
      top: absoluteTop,
      children: undefined, // 平坦化では子要素は含めない
    },
  ];

  if (layoutResult.children) {
    for (const child of layoutResult.children) {
      flattened.push(...flattenLayout(child, absoluteLeft, absoluteTop));
    }
  }

  return flattened;
}
