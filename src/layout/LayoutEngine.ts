/**
 * SlideWeaveレイアウトエンジン
 * レイアウトエンジンのファクトリー・エントリーポイント
 */

import { Element } from "../types/elements";
import { ILayoutEngine, LayoutResult } from "./ILayoutEngine";
import { CSSLayoutEngine } from "./CSSLayoutEngine";
import { YogaLayoutEngine } from "./YogaLayoutEngine";

// 利用可能なレイアウトエンジン
export enum LayoutEngineType {
  CSS_LAYOUT = "css-layout",
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
    case LayoutEngineType.CSS_LAYOUT:
      currentEngine = new CSSLayoutEngine();
      break;
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
export function renderLayout(
  element: Element,
  containerWidth = 720,
  containerHeight = 540,
): LayoutResult {
  return currentEngine.renderLayout(element, containerWidth, containerHeight);
}

// 型と関数を再エクスポート
export { LayoutResult, flattenLayout } from "./ILayoutEngine";
export { ILayoutEngine } from "./ILayoutEngine";