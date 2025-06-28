/**
 * SlideWeaveレイアウトエンジン
 * Object記法からcss-layout形式への変換とレイアウト計算
 */

// css-layoutを使用したレイアウトエンジン
import { Element } from '../types/elements';
const computeLayout = require('css-layout');

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
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    alignSelf?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch';
    flex?: number;
  };
  children?: CSSLayoutNode[];
  layout?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}


export class LayoutEngine {
  /**
   * Object記法要素ツリーをレイアウト計算してLayoutResultを返す
   * @param element ルート要素
   * @param containerWidth コンテナ幅（ピクセル、デフォルト: 720px）
   * @param containerHeight コンテナ高さ（ピクセル、デフォルト: 540px）
   * @returns レイアウト計算結果
   */
  static render(element: Element, containerWidth = 720, containerHeight = 540): LayoutResult {
    // Object記法からcss-layout形式に変換
    const cssLayoutTree = this.convertToCSSLayout(element);
    
    // コンテナサイズを設定
    cssLayoutTree.style = {
      ...cssLayoutTree.style,
      width: containerWidth,
      height: containerHeight
    };

    // css-layoutでレイアウト計算実行（結果はノードツリーに書き込まれる）
    computeLayout(cssLayoutTree);

    // 計算結果をLayoutResult形式に変換
    return this.convertToLayoutResult(cssLayoutTree, element);
  }

  /**
   * Object記法要素をcss-layout形式に変換
   * @param element Object記法要素
   * @returns css-layout形式ノード
   */
  private static convertToCSSLayout(element: Element): CSSLayoutNode {
    const node: CSSLayoutNode = {
      style: {}
    };

    // スタイル変換
    if (element.style) {
      // direction → flexDirection
      if (element.style.direction) {
        node.style!.flexDirection = element.style.direction === 'row' ? 'row' : 'column';
      } else if (element.type === 'container') {
        // containerのデフォルトは縦積み
        node.style!.flexDirection = 'column';
      }

      // margin: グリッド単位をピクセルに変換
      if (element.style.margin !== undefined) {
        node.style!.margin = element.style.margin * 8;
      }

      // padding: グリッド単位をピクセルに変換
      if (element.style.padding !== undefined) {
        node.style!.padding = element.style.padding * 8;
      }
    }

    // 要素タイプ別のデフォルト設定
    this.applyElementDefaults(element, node);

    // 子要素の変換
    if (element.children && element.children.length > 0) {
      node.children = element.children.map(child => this.convertToCSSLayout(child));
    }

    return node;
  }

  /**
   * 要素タイプ別のデフォルトスタイルを適用
   * @param element Object記法要素
   * @param node css-layoutノード
   */
  private static applyElementDefaults(element: Element, node: CSSLayoutNode): void {
    switch (element.type) {
      case 'text':
      case 'heading':
        // テキスト要素: 固定サイズ
        node.style!.width = 200; // デフォルト幅
        node.style!.height = 24; // デフォルト高さ
        break;
      case 'container':
        // コンテナ: 子要素に合わせて拡縮
        node.style!.justifyContent = 'flex-start';
        node.style!.alignItems = 'flex-start';
        break;
      case 'slide':
      case 'slideHeader':
      case 'slideBody':
      case 'slideFooter':
        // スライド要素: フレックスコンテナ
        node.style!.flexDirection = 'column';
        node.style!.justifyContent = 'flex-start';
        node.style!.alignItems = 'stretch';
        break;
    }
  }

  /**
   * css-layout計算結果をLayoutResult形式に変換
   * @param computed css-layout計算結果（layoutプロパティ付き）
   * @param originalElement 元のObject記法要素
   * @returns LayoutResult
   */
  private static convertToLayoutResult(computed: CSSLayoutNode, originalElement: Element): LayoutResult {
    const layout = computed.layout || { left: 0, top: 0, width: 0, height: 0 };
    
    const result: LayoutResult = {
      left: layout.left,
      top: layout.top,
      width: layout.width,
      height: layout.height,
      element: originalElement
    };

    // 子要素の変換
    if (computed.children && originalElement.children) {
      result.children = computed.children.map((childComputed, index) => 
        this.convertToLayoutResult(childComputed, originalElement.children![index])
      );
    }

    return result;
  }

  /**
   * LayoutResultツリーを平坦化して全要素の座標リストを取得
   * @param layoutResult レイアウト結果
   * @param offsetX 親からのX座標オフセット
   * @param offsetY 親からのY座標オフセット
   * @returns 平坦化された座標リスト
   */
  static flattenLayout(layoutResult: LayoutResult, offsetX = 0, offsetY = 0): LayoutResult[] {
    const results: LayoutResult[] = [];
    
    // 現在の要素（絶対座標に変換）
    const currentResult: LayoutResult = {
      ...layoutResult,
      left: layoutResult.left + offsetX,
      top: layoutResult.top + offsetY
    };
    results.push(currentResult);

    // 子要素を再帰的に処理
    if (layoutResult.children) {
      for (const child of layoutResult.children) {
        const childResults = this.flattenLayout(
          child, 
          currentResult.left, 
          currentResult.top
        );
        results.push(...childResults);
      }
    }

    return results;
  }
}