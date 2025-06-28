/**
 * Yoga Layout エンジン実装
 * Facebook製のレイアウトエンジンで、CSS Flexboxに準拠
 */

import { Element } from "../types/elements";
import { ILayoutEngine, LayoutResult } from "./ILayoutEngine";
import { StyleConverter } from "./StyleConverter";

// yoga-layout-prebuiltのインポート
const yoga = require("yoga-layout-prebuilt");

export class YogaLayoutEngine implements ILayoutEngine {
  readonly name = "yoga-layout";

  renderLayout(
    element: Element,
    containerWidth: number = 720,
    containerHeight: number = 540,
  ): LayoutResult {
    // Yogaノードツリーを作成
    const yogaNode = this.createYogaNode(element);

    // コンテナサイズを設定
    yogaNode.setWidth(containerWidth);
    yogaNode.setHeight(containerHeight);

    // レイアウト計算実行
    yogaNode.calculateLayout(containerWidth, containerHeight, yoga.DIRECTION_LTR);

    // 計算結果をLayoutResult形式に変換
    const result = this.convertToLayoutResult(yogaNode, element);

    // メモリリークを防ぐためYogaノードを解放
    this.freeYogaNode(yogaNode);

    return result;
  }

  /**
   * Element からYogaノードを作成
   */
  private createYogaNode(element: Element): any {
    const node = yoga.Node.create();

    // スタイル設定
    this.applyStyleToYogaNode(node, element);

    // 子要素の追加
    if (element.children && element.children.length > 0) {
      element.children.forEach((child, index) => {
        const childNode = this.createYogaNode(child);
        node.insertChild(childNode, index);
      });
    }

    return node;
  }

  /**
   * スタイルをYogaノードに適用
   */
  private applyStyleToYogaNode(node: any, element: Element): void {
    const style = element.style;

    if (!style) {
      this.applyElementDefaults(node, element);
      return;
    }

    this.applyStyleToNode(node, style, element);
  }

  /**
   * スタイルをYogaノードに適用（無次元数値のみ変換、他はYogaに委譲）
   */
  private applyStyleToNode(node: any, style: any, element: Element): void {
    // FlexDirection
    if (style.direction === "row") {
      node.setFlexDirection(yoga.FLEX_DIRECTION_ROW);
    } else {
      node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN);
    }

    // Spacing: 8px単位をピクセルに変換
    if (style.margin !== undefined) {
      node.setMargin(yoga.EDGE_ALL, style.margin * 8);
    }
    if (style.marginTop !== undefined) {
      node.setMargin(yoga.EDGE_TOP, style.marginTop * 8);
    }
    if (style.marginRight !== undefined) {
      node.setMargin(yoga.EDGE_RIGHT, style.marginRight * 8);
    }
    if (style.marginBottom !== undefined) {
      node.setMargin(yoga.EDGE_BOTTOM, style.marginBottom * 8);
    }
    if (style.marginLeft !== undefined) {
      node.setMargin(yoga.EDGE_LEFT, style.marginLeft * 8);
    }

    if (style.padding !== undefined) {
      node.setPadding(yoga.EDGE_ALL, style.padding * 8);
    }
    if (style.paddingTop !== undefined) {
      node.setPadding(yoga.EDGE_TOP, style.paddingTop * 8);
    }
    if (style.paddingRight !== undefined) {
      node.setPadding(yoga.EDGE_RIGHT, style.paddingRight * 8);
    }
    if (style.paddingBottom !== undefined) {
      node.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom * 8);
    }
    if (style.paddingLeft !== undefined) {
      node.setPadding(yoga.EDGE_LEFT, style.paddingLeft * 8);
    }

    // Dimensions: 無次元数値のみ変換、文字列（%、px、auto、vw等）はYogaに委譲
    if (style.width !== undefined) {
      const widthValue = StyleConverter.convertDimensionUnit(style.width);
      // YogaライブラリのsetWidthに文字列を渡す（Yogaが適切に処理）
      node.setWidth(widthValue);
    }
    if (style.height !== undefined) {
      const heightValue = StyleConverter.convertDimensionUnit(style.height);
      node.setHeight(heightValue);
    }

    // Flex
    if (style.flex !== undefined) {
      node.setFlex(style.flex);
    }

    // 要素タイプ別の設定
    this.applyElementDefaults(node, element);
  }

  /**
   * 要素タイプ別のデフォルト設定をYogaノードに適用
   */
  private applyElementDefaults(node: any, element: Element): void {
    switch (element.type) {
      case "text":
      case "heading":
        // テキスト要素: measure関数を設定
        this.setupTextMeasurement(node, element);
        break;

      case "container":
        // コンテナのデフォルト設定
        node.setJustifyContent(yoga.JUSTIFY_FLEX_START);
        node.setAlignItems(yoga.ALIGN_FLEX_START);
        break;

      case "slide":
        // スライドのデフォルト設定
        node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN);
        node.setJustifyContent(yoga.JUSTIFY_FLEX_START);
        break;
    }
  }

  /**
   * テキスト要素のメジャー関数を設定
   */
  private setupTextMeasurement(node: any, element: Element): void {
    // テキスト・見出し要素の型チェック
    const fontSize = ('fontSize' in element) ? element.fontSize || 14 : 14;
    const content = ('content' in element) ? element.content || "" : "";

    node.setMeasureFunc((width: number, widthMode: number, _height: number, _heightMode: number) => {

      // フォントメトリクス計算（言語別文字幅係数適用）
      const charWidth = this.getCharWidth(content, fontSize);
      const lineHeight = fontSize * 1.0;
      const naturalWidth = content.length * charWidth;

      let resultWidth = naturalWidth;
      let resultHeight = lineHeight;

      // 幅制約の処理
      if (widthMode !== yoga.MEASURE_MODE_UNDEFINED && width > 0) {
        if (naturalWidth <= width) {
          // 制約幅内に収まる
          resultWidth = naturalWidth;
          resultHeight = lineHeight;
        } else {
          // 制約幅を超える：折り返し計算
          resultWidth = width;
          const estimatedLines = Math.ceil(naturalWidth / width);
          resultHeight = lineHeight * estimatedLines;
        }
      }

      // グリッド整列（textとheadingのみオフ）
      const isTextElement = element.type === 'text' || element.type === 'heading';
      const alignedWidth = isTextElement ? resultWidth : Math.ceil(resultWidth / 8) * 8;
      const alignedHeight = isTextElement ? resultHeight : Math.ceil(resultHeight / 8) * 8;

      return {
        width: alignedWidth,
        height: alignedHeight,
      };
    });
  }

  /**
   * YogaノードからLayoutResultに変換
   */
  private convertToLayoutResult(yogaNode: any, originalElement: Element): LayoutResult {
    const result: LayoutResult = {
      left: yogaNode.getComputedLeft(),
      top: yogaNode.getComputedTop(),
      width: yogaNode.getComputedWidth(),
      height: yogaNode.getComputedHeight(),
      element: originalElement,
    };

    // 子要素の変換
    if (originalElement.children && originalElement.children.length > 0) {
      result.children = originalElement.children.map((child, index) => {
        const childYogaNode = yogaNode.getChild(index);
        return this.convertToLayoutResult(childYogaNode, child);
      });
    }

    return result;
  }

  /**
   * 言語別の文字幅係数を取得
   */
  private getCharWidth(content: string, fontSize: number): number {
    // 日本語文字（ひらがな、カタカナ、漢字）の検出
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(content);
    const ratio = hasJapanese ? 1.2 : 0.8; // 日本語: 1.2（全角+余裕）, 英語: 0.8（半角）
    return fontSize * ratio;
  }

  /**
   * Yogaノードを再帰的に解放（メモリリーク防止）
   */
  private freeYogaNode(node: any): void {
    if (!node) return;
    
    try {
      const childCount = node.getChildCount();
      for (let i = 0; i < childCount; i++) {
        const child = node.getChild(i);
        this.freeYogaNode(child);
      }
      node.free();
    } catch (error) {
      // Yogaノードが既に解放されている場合は無視
      console.warn('Warning: Yoga node already freed or invalid:', error);
    }
  }
}