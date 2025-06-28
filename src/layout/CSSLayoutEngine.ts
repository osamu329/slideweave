/**
 * CSS-Layout（既存）エンジン実装
 */

import { Element } from "../types/elements";
import { ILayoutEngine, LayoutResult } from "./ILayoutEngine";
import { computeLayout } from "./css-layout-debug.js";

export interface CSSLayoutNode {
  style?: {
    width?: number;
    height?: number;
    margin?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    padding?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    justifyContent?:
      | "flex-start"
      | "center"
      | "flex-end"
      | "space-between"
      | "space-around";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
    flex?: number;
    measure?: (width: number) => { width: number; height: number };
  };
  layout?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  children?: CSSLayoutNode[];
}

export class CSSLayoutEngine implements ILayoutEngine {
  readonly name = "css-layout";

  renderLayout(
    element: Element,
    containerWidth: number = 720,
    containerHeight: number = 540,
  ): LayoutResult {
    // Object記法からcss-layout形式に変換
    const cssLayoutTree = this.convertToCSSLayout(element);

    // コンテナサイズを設定
    cssLayoutTree.style = {
      ...cssLayoutTree.style,
      width: containerWidth,
      height: containerHeight,
    };

    // css-layoutでレイアウト計算実行（結果はノードツリーに書き込まれる）
    computeLayout(cssLayoutTree);

    // 計算結果をLayoutResult形式に変換
    return this.convertToLayoutResult(cssLayoutTree, element);
  }

  /**
   * Object記法要素をcss-layout形式に変換
   */
  private convertToCSSLayout(element: Element): CSSLayoutNode {
    const node: CSSLayoutNode = {
      style: {},
    };

    // スタイル変換
    if (element.style) {
      // direction → flexDirection
      if (element.style.direction) {
        node.style!.flexDirection =
          element.style.direction === "row" ? "row" : "column";
      } else if (element.type === "container") {
        // containerのデフォルトは縦積み
        node.style!.flexDirection = "column";
      }

      // margin/padding/width/height: グリッド単位をピクセルに変換
      const marginProps = [
        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
      ] as const;
      const paddingProps = [
        "padding",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
      ] as const;

      marginProps.forEach((prop) => {
        if (element.style![prop] !== undefined) {
          node.style![prop] = element.style![prop]! * 8;
        }
      });

      paddingProps.forEach((prop) => {
        if (element.style![prop] !== undefined) {
          node.style![prop] = element.style![prop]! * 8;
        }
      });

      // width: 明示的に指定された場合はそのまま使用（CSS-Layoutはパーセンテージ未対応）
      if (element.style.width !== undefined) {
        if (typeof element.style.width === 'number') {
          node.style!.width = element.style.width * 8; // 8px単位をピクセルに変換
        } else if (element.style.width.endsWith('px')) {
          const pixels = parseFloat(element.style.width);
          node.style!.width = pixels; // ピクセル単位をそのまま使用
        }
        // TODO: CSS-Layoutはパーセンテージ未対応のため、文字列は無視
      }

      // height: 明示的に指定された場合はそのまま使用（CSS-Layoutはパーセンテージ未対応）
      if (element.style.height !== undefined) {
        if (typeof element.style.height === 'number') {
          node.style!.height = element.style.height * 8; // 8px単位をピクセルに変換
        } else if (element.style.height.endsWith('px')) {
          const pixels = parseFloat(element.style.height);
          node.style!.height = pixels; // ピクセル単位をそのまま使用
        }
        // TODO: CSS-Layoutはパーセンテージ未対応のため、文字列は無視
      }

      // flex: flexプロパティの変換
      if (element.style.flex !== undefined) {
        node.style!.flex = element.style.flex;
      }
    }

    // 要素タイプ別のデフォルト設定
    this.applyElementDefaults(element, node);

    // 子要素の変換
    if (element.children && element.children.length > 0) {
      node.children = element.children.map((child) => this.convertToCSSLayout(child));
    }

    return node;
  }

  /**
   * 要素タイプ別のデフォルトスタイルを適用
   */
  private applyElementDefaults(element: Element, node: CSSLayoutNode): void {
    switch (element.type) {
      case "text":
      case "heading":
        // テキスト要素: measure関数を追加してcss-layoutの幅制限に対応
        const fontSize = element.fontSize || 14;
        const content = element.content || "";

        // measure関数を定義（css-layoutが幅制限時に呼び出す）
        node.style!.measure = (constraintWidth: number) => {
          console.log(`🔍 CSS-LAYOUT MEASURE - Text: "${content.substring(0, 20)}..."`);
          console.log(`  constraintWidth: ${constraintWidth}`);
          
          // フォントメトリクス計算
          const charWidth = fontSize * 0.8; // 文字幅
          const lineHeight = fontSize * 1.0; // 行高

          // このテキストの自然な幅（制約なしの場合）
          const naturalWidth = content.length * charWidth;

          // 制約幅が無効な場合（undefined, NaN, 0以下）は自然なサイズを返す
          if (
            !constraintWidth ||
            constraintWidth <= 0 ||
            !isFinite(constraintWidth)
          ) {
            console.log(`  ❌ Invalid constraint -> using natural width`);
            // グリッド整列（textとheadingのみオフ）
            const isTextElement = element.type === 'text' || element.type === 'heading';
            const alignedWidth = isTextElement ? naturalWidth : Math.ceil(naturalWidth / 8) * 8;
            const alignedHeight = isTextElement ? lineHeight : Math.ceil(lineHeight / 8) * 8;
            console.log(`  result: ${alignedWidth} x ${alignedHeight}`);
            return {
              width: alignedWidth,
              height: alignedHeight,
            };
          }

          if (naturalWidth <= constraintWidth) {
            console.log(`  ✅ Fits within constraint -> using natural width`);
            // グリッド整列（textとheadingのみオフ）
            const isTextElement = element.type === 'text' || element.type === 'heading';
            const alignedWidth = isTextElement ? naturalWidth : Math.ceil(naturalWidth / 8) * 8;
            const alignedHeight = isTextElement ? lineHeight : Math.ceil(lineHeight / 8) * 8;
            console.log(`  result: ${alignedWidth} x ${alignedHeight}`);
            return {
              width: alignedWidth,
              height: alignedHeight,
            };
          } else {
            console.log(`  ⚠️ Exceeds constraint -> constraining to ${constraintWidth}`);
            const estimatedLines = Math.ceil(naturalWidth / constraintWidth);
            const wrappedHeight = lineHeight * estimatedLines;
            // グリッド整列（textとheadingのみオフ）
            const isTextElement = element.type === 'text' || element.type === 'heading';
            const alignedHeight = isTextElement ? wrappedHeight : Math.ceil(wrappedHeight / 8) * 8;
            console.log(`  result: ${constraintWidth} x ${alignedHeight} (${estimatedLines} lines)`);
            return {
              width: constraintWidth,
              height: alignedHeight,
            };
          }
        };
        break;

      case "container":
        // コンテナのデフォルト設定
        node.style!.justifyContent = "flex-start";
        node.style!.alignItems = "flex-start";
        break;

      case "slide":
        // スライドのデフォルト設定
        node.style!.flexDirection = "column";
        node.style!.justifyContent = "flex-start";
        break;
    }
  }

  /**
   * css-layout計算結果をLayoutResult形式に変換
   */
  private convertToLayoutResult(
    cssNode: CSSLayoutNode,
    originalElement: Element,
  ): LayoutResult {
    const result: LayoutResult = {
      left: cssNode.layout?.left || 0,
      top: cssNode.layout?.top || 0,
      width: cssNode.layout?.width || 0,
      height: cssNode.layout?.height || 0,
      element: originalElement,
    };

    if (cssNode.children && originalElement.children) {
      result.children = cssNode.children.map((childNode, index) =>
        this.convertToLayoutResult(childNode, originalElement.children![index]),
      );
    }

    return result;
  }
}