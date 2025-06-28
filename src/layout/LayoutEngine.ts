/**
 * SlideWeaveレイアウトエンジン
 * Object記法からcss-layout形式への変換とレイアウト計算
 */

// css-layoutを使用したレイアウトエンジン
import { Element } from "../types/elements";
const computeLayout = require("css-layout");

export interface LayoutResult {
  left: number;
  top: number;
  width: number;
  height: number;
  element: Element;
  children?: LayoutResult[];
}

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
    measure?: (_width: number) => { width: number; height: number };
  };
  children?: CSSLayoutNode[];
  layout?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

/**
 * LayoutResultツリーを平坦化して全要素の座標リストを取得
 * @param layoutResult レイアウト結果
 * @param offsetX 親からのX座標オフセット
 * @param offsetY 親からのY座標オフセット
 * @returns 平坦化された座標リスト
 */
export function flattenLayout(
  layoutResult: LayoutResult,
  offsetX = 0,
  offsetY = 0,
): LayoutResult[] {
  const results: LayoutResult[] = [];

  // 現在の要素（絶対座標に変換）
  const currentResult: LayoutResult = {
    ...layoutResult,
    left: layoutResult.left + offsetX,
    top: layoutResult.top + offsetY,
  };
  results.push(currentResult);

  // 子要素を再帰的に処理
  if (layoutResult.children) {
    for (const child of layoutResult.children) {
      const childResults = flattenLayout(
        child,
        currentResult.left,
        currentResult.top,
      );
      results.push(...childResults);
    }
  }

  return results;
}

/**
 * Object記法要素ツリーをレイアウト計算してLayoutResultを返す
 * @param element ルート要素
 * @param containerWidth コンテナ幅（ピクセル、デフォルト: 720px）
 * @param containerHeight コンテナ高さ（ピクセル、デフォルト: 540px）
 * @returns レイアウト計算結果
 */
export function renderLayout(
  element: Element,
  containerWidth = 720,
  containerHeight = 540,
): LayoutResult {
  // Object記法からcss-layout形式に変換
  const cssLayoutTree = convertToCSSLayout(element);

  // コンテナサイズを設定
  cssLayoutTree.style = {
    ...cssLayoutTree.style,
    width: containerWidth,
    height: containerHeight,
  };

  // css-layoutでレイアウト計算実行（結果はノードツリーに書き込まれる）
  computeLayout(cssLayoutTree);

  // 計算結果をLayoutResult形式に変換
  return convertToLayoutResult(cssLayoutTree, element);
}

/**
 * Object記法要素をcss-layout形式に変換
 * @param element Object記法要素
 * @returns css-layout形式ノード
 */
function convertToCSSLayout(element: Element): CSSLayoutNode {
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

    // margin/padding/width/height: グリッド単位をピクセルに変換（css-layoutが優先順位を処理）
    if (element.style) {
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

      // width: 明示的に指定された場合はそのまま使用
      if (element.style.width !== undefined) {
        node.style!.width = element.style.width;
      }

      // height: 明示的に指定された場合はそのまま使用
      if (element.style.height !== undefined) {
        node.style!.height = element.style.height;
      }

      // flex: flexプロパティの変換
      if (element.style.flex !== undefined) {
        node.style!.flex = element.style.flex;
      }
    }
  }

  // 要素タイプ別のデフォルト設定
  applyElementDefaults(element, node);

  // 子要素の変換
  if (element.children && element.children.length > 0) {
    node.children = element.children.map((child) => convertToCSSLayout(child));
  }

  return node;
}

/**
 * 要素タイプ別のデフォルトスタイルを適用
 * @param element Object記法要素
 * @param node css-layoutノード
 */
function applyElementDefaults(element: Element, node: CSSLayoutNode): void {
  switch (element.type) {
    case "text":
    case "heading":
      // テキスト要素: measure関数を追加してcss-layoutの幅制限に対応
      const fontSize = element.fontSize || 14;
      const content = element.content || "";

      // measure関数を定義（css-layoutが幅制限時に呼び出す）
      // テキストの自然なサイズを測定するのみ、レイアウト判断はしない
      node.style!.measure = (constraintWidth: number) => {
        // フォントメトリクス計算
        const charWidth = fontSize * 0.8; // 文字幅
        const lineHeight = fontSize * 1.4; // 行高

        // このテキストの自然な幅（制約なしの場合）
        const naturalWidth = content.length * charWidth;

        // 制約幅が無効な場合（undefined, NaN, 0以下）は自然なサイズを返す
        if (
          !constraintWidth ||
          constraintWidth <= 0 ||
          !isFinite(constraintWidth)
        ) {
          // グリッド整列のため8の倍数に調整
          const alignedWidth = Math.ceil(naturalWidth / 8) * 8;
          const alignedHeight = Math.ceil(lineHeight / 8) * 8;
          return {
            width: alignedWidth,
            height: alignedHeight,
          };
        }

        if (naturalWidth <= constraintWidth) {
          // 制約幅内に収まる：自然なサイズを返す（グリッド整列）
          const alignedWidth = Math.ceil(naturalWidth / 8) * 8;
          const alignedHeight = Math.ceil(lineHeight / 8) * 8;
          return {
            width: alignedWidth,
            height: alignedHeight,
          };
        } else {
          // 制約幅を超える：制約幅いっぱいまで使って、必要な高さを計算
          const estimatedLines = Math.ceil(naturalWidth / constraintWidth);
          const alignedHeight =
            Math.ceil((lineHeight * estimatedLines) / 8) * 8;
          return {
            width: constraintWidth,
            height: alignedHeight,
          };
        }
      };

      // テキスト要素は親の制約に応じてmeasure関数でサイズを決定
      // 幅と高さは設定せず、css-layoutにmeasure関数を使わせる
      break;
    case "container":
      // コンテナ: 子要素に合わせて拡縮
      node.style!.justifyContent = "flex-start";
      node.style!.alignItems = "flex-start";
      break;
    case "slide":
    case "slideHeader":
    case "slideBody":
    case "slideFooter":
      // スライド要素: フレックスコンテナ
      node.style!.flexDirection = "column";
      node.style!.justifyContent = "flex-start";
      node.style!.alignItems = "stretch";
      break;
  }
}

/**
 * css-layout計算結果をLayoutResult形式に変換
 * @param computed css-layout計算結果（layoutプロパティ付き）
 * @param originalElement 元のObject記法要素
 * @returns LayoutResult
 */
function convertToLayoutResult(
  computed: CSSLayoutNode,
  originalElement: Element,
): LayoutResult {
  const layout = computed.layout || { left: 0, top: 0, width: 0, height: 0 };

  const result: LayoutResult = {
    left: layout.left,
    top: layout.top,
    width: layout.width,
    height: layout.height,
    element: originalElement,
  };

  // 子要素の変換
  if (computed.children && originalElement.children) {
    result.children = computed.children.map((childComputed, index) =>
      convertToLayoutResult(childComputed, originalElement.children![index]),
    );
  }

  return result;
}
