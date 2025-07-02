/**
 * SlideWeaveレイアウトエンジン
 * レイアウトエンジンのファクトリー・エントリーポイント
 */

import type { Element } from "../types/elements.js";
import type { ILayoutEngine, LayoutResult } from "./ILayoutEngine.js";
import { flattenLayout } from "./ILayoutEngine.js";
import { YogaLayoutEngine } from "./YogaLayoutEngine.js";

// 利用可能なレイアウトエンジン
export enum LayoutEngineType {
  // eslint-disable-next-line no-unused-vars
  YOGA = "yoga-layout",
}

/**
 * 現在のレイアウトエンジン（デフォルト：Yoga）
 */
let currentEngine: ILayoutEngine = new YogaLayoutEngine();

/**
 * レイアウトエンジンを設定
 */
export function setLayoutEngine(engineType: LayoutEngineType): void {
  switch (engineType) {
    case LayoutEngineType.YOGA:
      currentEngine = new YogaLayoutEngine();
      break;
    default:
      throw new Error(`Unknown layout engine: ${engineType}`);
  }
  console.log(`🔧 Layout Engine switched to: ${currentEngine.name}`);
}

/**
 * 現在のレイアウトエンジンを取得
 */
export function getCurrentLayoutEngine(): ILayoutEngine {
  return currentEngine;
}

/**
 * 後方互換性のためのレイアウト関数（推奨：getCurrentLayoutEngine().renderLayout()を使用）
 */
export async function renderLayout(
  element: Element,
  containerWidth = 720,
  containerHeight = 540,
): Promise<LayoutResult> {
  const result = currentEngine.renderLayout(
    element,
    containerWidth,
    containerHeight,
  );
  return result instanceof Promise ? await result : result;
}

// 型と関数を再エクスポート
export { LayoutResult, flattenLayout };
export type { ILayoutEngine };
