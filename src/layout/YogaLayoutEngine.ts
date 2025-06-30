/**
 * Yoga Layout エンジン実装
 * Facebook製のレイアウトエンジンで、CSS Flexboxに準拠
 */

import { Element } from "../types/elements";
import { ILayoutEngine, LayoutResult } from "./ILayoutEngine";
import { StyleConverter } from "./StyleConverter";

// yoga-layout v3のインポート（非同期）
import yogaLayout from "yoga-layout";

export class YogaLayoutEngine implements ILayoutEngine {
  readonly name = "yoga-layout";
  private yoga: any = null;

  async renderLayout(
    element: Element,
    containerWidth: number = 720,
    containerHeight: number = 540,
  ): Promise<LayoutResult> {
    // Yogaインスタンスの初期化
    if (!this.yoga) {
      this.yoga = await yogaLayout;
    }

    // Yogaノードツリーを作成
    const yogaNode = this.createYogaNode(element);

    // コンテナサイズを設定
    yogaNode.setWidth(containerWidth);
    yogaNode.setHeight(containerHeight);

    // レイアウト計算実行
    yogaNode.calculateLayout(containerWidth, containerHeight, this.yoga.DIRECTION_LTR);

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
    const node = this.yoga.Node.create();

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
    // 未サポートプロパティの警告
    this.checkUnsupportedProperties(style, element);
    
    // FlexDirection
    if (style.flexDirection === "row") {
      node.setFlexDirection(this.yoga.FLEX_DIRECTION_ROW);
    } else {
      node.setFlexDirection(this.yoga.FLEX_DIRECTION_COLUMN);
    }

    // Gap プロパティ: 単位付き文字列をYogaに直接渡す
    if (style.gap !== undefined) {
      const gapValue = StyleConverter.convertSpacingUnit(style.gap, 'gap');
      node.setGap(this.yoga.GUTTER_ALL, gapValue);
    }

    // Spacing: 単位付き文字列をYogaに直接渡す
    if (style.margin !== undefined) {
      const marginValue = StyleConverter.convertSpacingUnit(style.margin, 'margin');
      node.setMargin(this.yoga.EDGE_ALL, marginValue);
    }
    if (style.marginTop !== undefined) {
      const marginTopValue = StyleConverter.convertSpacingUnit(style.marginTop, 'marginTop');
      node.setMargin(this.yoga.EDGE_TOP, marginTopValue);
    }
    if (style.marginRight !== undefined) {
      const marginRightValue = StyleConverter.convertSpacingUnit(style.marginRight, 'marginRight');
      node.setMargin(this.yoga.EDGE_RIGHT, marginRightValue);
    }
    if (style.marginBottom !== undefined) {
      const marginBottomValue = StyleConverter.convertSpacingUnit(style.marginBottom, 'marginBottom');
      node.setMargin(this.yoga.EDGE_BOTTOM, marginBottomValue);
    }
    if (style.marginLeft !== undefined) {
      const marginLeftValue = StyleConverter.convertSpacingUnit(style.marginLeft, 'marginLeft');
      node.setMargin(this.yoga.EDGE_LEFT, marginLeftValue);
    }

    if (style.padding !== undefined) {
      const paddingValue = StyleConverter.convertSpacingUnit(style.padding, 'padding');
      node.setPadding(this.yoga.EDGE_ALL, paddingValue);
    }
    if (style.paddingTop !== undefined) {
      const paddingTopValue = StyleConverter.convertSpacingUnit(style.paddingTop, 'paddingTop');
      node.setPadding(this.yoga.EDGE_TOP, paddingTopValue);
    }
    if (style.paddingRight !== undefined) {
      const paddingRightValue = StyleConverter.convertSpacingUnit(style.paddingRight, 'paddingRight');
      node.setPadding(this.yoga.EDGE_RIGHT, paddingRightValue);
    }
    if (style.paddingBottom !== undefined) {
      const paddingBottomValue = StyleConverter.convertSpacingUnit(style.paddingBottom, 'paddingBottom');
      node.setPadding(this.yoga.EDGE_BOTTOM, paddingBottomValue);
    }
    if (style.paddingLeft !== undefined) {
      const paddingLeftValue = StyleConverter.convertSpacingUnit(style.paddingLeft, 'paddingLeft');
      node.setPadding(this.yoga.EDGE_LEFT, paddingLeftValue);
    }

    // Dimensions: 単位付き文字列をYogaに直接渡す
    if (style.width !== undefined) {
      const widthValue = StyleConverter.convertDimensionUnit(style.width, 'width');
      // YogaライブラリのsetWidthに文字列を渡す（Yogaが適切に処理）
      node.setWidth(widthValue);
    }
    if (style.height !== undefined) {
      const heightValue = StyleConverter.convertDimensionUnit(style.height, 'height');
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
        node.setJustifyContent(this.yoga.JUSTIFY_FLEX_START);
        node.setAlignItems(this.yoga.ALIGN_FLEX_START);
        break;

      case "slide":
        // スライドのデフォルト設定
        node.setFlexDirection(this.yoga.FLEX_DIRECTION_COLUMN);
        node.setJustifyContent(this.yoga.JUSTIFY_FLEX_START);
        break;
    }
  }

  /**
   * CSS単位付き値から数値を抽出
   */
  private extractNumericValue(value: string | number | undefined): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const numMatch = value.match(/^(\d+(?:\.\d+)?)/);
      if (numMatch) {
        return parseFloat(numMatch[1]);
      }
    }
    return 0;
  }

  /**
   * 未サポートのスタイルプロパティをチェックして警告
   */
  private checkUnsupportedProperties(style: any, element: Element): void {
    if (!style) return;
    
    // Yogaでサポートされているプロパティのリスト
    const supportedProperties = new Set([
      // レイアウト
      'flexDirection', 'justifyContent', 'alignItems', 'alignContent', 'alignSelf',
      'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'flexWrap',
      
      // サイズ
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      
      // 間隔
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'gap', 'rowGap', 'columnGap',
      
      // 位置
      'position', 'top', 'right', 'bottom', 'left',
      
      // 表示
      'display', 'overflow',
      
      // SlideWeave固有（Yogaでは処理しないが有効）
      'backgroundColor', 'border', 'borderRadius', 'borderWidth', 'borderColor', 'borderStyle',
      'borderLeft', 'borderLeftWidth', 'borderLeftColor', 'borderLeftStyle',
      'borderTop', 'borderTopWidth', 'borderTopColor', 'borderTopStyle',
      'borderRight', 'borderRightWidth', 'borderRightColor', 'borderRightStyle',
      'borderBottom', 'borderBottomWidth', 'borderBottomColor', 'borderBottomStyle',
      'color', 'fontSize', 'fontWeight', 'fontStyle', 'fontFamily', 'textAlign',
      'background', 'backgroundImage', 'backgroundSize', 'backgroundPosition',
      'lineHeight', 'boxShadow', 'cursor',
      'glassEffect', 'opacity', 'zIndex'
    ]);
    
    // レガシープロパティのマッピング
    const legacyPropertyMap: Record<string, string> = {
      'direction': 'flexDirection'
    };
    
    // スタイルプロパティをチェック
    for (const prop in style) {
      if (!supportedProperties.has(prop)) {
        // レガシープロパティの場合
        if (legacyPropertyMap[prop]) {
          const newProp = legacyPropertyMap[prop];
          const elementInfo = element.type + (element.id ? ` (id: ${element.id})` : '');
          console.warn(`⚠️  Deprecated style property "${prop}" in ${elementInfo}. Use "${newProp}" instead.`);
        } else {
          // 完全に未知のプロパティ
          const elementInfo = element.type + (element.id ? ` (id: ${element.id})` : '');
          console.warn(`⚠️  Unknown style property "${prop}" in ${elementInfo}. This property will be ignored.`);
        }
      }
    }
  }

  /**
   * テキスト要素のメジャー関数を設定
   */
  private setupTextMeasurement(node: any, element: Element): void {
    // テキスト・見出し要素の型チェック
    let fontSize = 14; // デフォルト値
    
    if ('fontSize' in element) {
      // element.fontSizeプロパティから取得
      fontSize = this.extractNumericValue(element.fontSize) || 14;
    }
    
    if (element.style?.fontSize) {
      // element.style.fontSizeから取得（こちらを優先）
      fontSize = this.extractNumericValue(element.style.fontSize) || fontSize;
    }
    
    // headingの場合のデフォルトフォントサイズ
    if (element.type === 'heading' && 'level' in element) {
      const fontSizeMap: Record<number, number> = {
        1: 24, 2: 20, 3: 18, 4: 16, 5: 14, 6: 12,
      };
      const level = element.level || 1;
      // fontSizeが明示的に設定されていない場合のみデフォルト値を使用
      if (!element.style?.fontSize && !('fontSize' in element)) {
        fontSize = fontSizeMap[level] || 16;
      }
    }
    
    const content = ('content' in element) ? element.content || "" : "";

    node.setMeasureFunc((width: number, widthMode: number, _height: number, _heightMode: number) => {

      // フォントメトリクス計算（言語別文字幅係数適用）
      const charWidth = this.getCharWidth(content, fontSize);
      const lineHeight = fontSize * 1.0;
      const naturalWidth = content.length * charWidth;

      let resultWidth = naturalWidth;
      let resultHeight = lineHeight;

      // 幅制約の処理
      if (widthMode !== this.yoga.MEASURE_MODE_UNDEFINED && width > 0) {
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
      const alignedWidth = isTextElement ? resultWidth : Math.ceil(resultWidth / 8) * 4;
      const alignedHeight = isTextElement ? resultHeight : Math.ceil(resultHeight / 8) * 4;

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