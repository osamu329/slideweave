/**
 * Yoga Layout エンジン実装
 * Facebook製のレイアウトエンジンで、CSS Flexboxに準拠
 */

import { Element, BaseStyle } from "../types/elements";
import { Pixels, createPixels } from "../types/units";

// yoga-layout v3のインポート（非同期）
import yogaLayout from "yoga-layout";


export interface LayoutResult {
  left: Pixels;
  top: Pixels;
  width: Pixels;
  height: Pixels;
  element: Element;
  children?: LayoutResult[];
}

/**
 * レイアウト結果を平坦化（絶対座標に変換）
 */
export function flattenLayout(
  layoutResult: LayoutResult,
  parentLeft: Pixels = createPixels(0),
  parentTop: Pixels = createPixels(0),
): LayoutResult[] {
  const absoluteLeft = createPixels(parentLeft + layoutResult.left);
  const absoluteTop = createPixels(parentTop + layoutResult.top);

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

export class YogaLayoutEngine {
  readonly name = "yoga-layout";
  private yoga: any = null;

  constructor() {
    // レイアウト計算専用 - DPI情報は不要
  }

  async renderLayout(
    element: Element,
    containerWidth: Pixels,
    containerHeight: Pixels,
  ): Promise<LayoutResult> {
    // Yogaインスタンスの初期化
    if (!this.yoga) {
      this.yoga = await yogaLayout;
    }

    // Yogaノードツリーを作成
    const yogaNode = this.createYogaNode(element);

    // ルートノードに明示的なサイズがない場合のみコンテナサイズを設定
    if (!('width' in (element.style || {}))) {
      yogaNode.setWidth(containerWidth as number);
    }
    if (!('height' in (element.style || {}))) {
      yogaNode.setHeight(containerHeight as number);
    }

    // レイアウト計算実行
    yogaNode.calculateLayout(
      containerWidth as number,
      containerHeight as number,
      this.yoga.DIRECTION_LTR,
    );

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
    } else if (style.flexDirection === "row-reverse") {
      node.setFlexDirection(this.yoga.FLEX_DIRECTION_ROW_REVERSE);
    } else if (style.flexDirection === "column-reverse") {
      node.setFlexDirection(this.yoga.FLEX_DIRECTION_COLUMN_REVERSE);
    } else {
      node.setFlexDirection(this.yoga.FLEX_DIRECTION_COLUMN);
    }

    // FlexWrap
    if (style.flexWrap === "wrap") {
      node.setFlexWrap(this.yoga.WRAP_WRAP);
    } else if (style.flexWrap === "wrap-reverse") {
      node.setFlexWrap(this.yoga.WRAP_WRAP_REVERSE);
    } else {
      node.setFlexWrap(this.yoga.WRAP_NO_WRAP);
    }

    // JustifyContent (main axis alignment)
    if (style.justifyContent) {
      const justifyMap: Record<string, any> = {
        'flex-start': this.yoga.JUSTIFY_FLEX_START,
        'flex-end': this.yoga.JUSTIFY_FLEX_END,
        'center': this.yoga.JUSTIFY_CENTER,
        'space-between': this.yoga.JUSTIFY_SPACE_BETWEEN,
        'space-around': this.yoga.JUSTIFY_SPACE_AROUND,
        'space-evenly': this.yoga.JUSTIFY_SPACE_EVENLY,
      };
      if (justifyMap[style.justifyContent]) {
        node.setJustifyContent(justifyMap[style.justifyContent]);
      }
    }

    // AlignItems (cross axis alignment)
    if (style.alignItems) {
      const alignItemsMap: Record<string, any> = {
        'flex-start': this.yoga.ALIGN_FLEX_START,
        'flex-end': this.yoga.ALIGN_FLEX_END,
        'center': this.yoga.ALIGN_CENTER,
        'stretch': this.yoga.ALIGN_STRETCH,
        'baseline': this.yoga.ALIGN_BASELINE,
      };
      if (alignItemsMap[style.alignItems]) {
        node.setAlignItems(alignItemsMap[style.alignItems]);
      }
    }

    // AlignSelf (individual item alignment)
    if (style.alignSelf) {
      const alignSelfMap: Record<string, any> = {
        'auto': this.yoga.ALIGN_AUTO,
        'flex-start': this.yoga.ALIGN_FLEX_START,
        'flex-end': this.yoga.ALIGN_FLEX_END,
        'center': this.yoga.ALIGN_CENTER,
        'stretch': this.yoga.ALIGN_STRETCH,
        'baseline': this.yoga.ALIGN_BASELINE,
      };
      if (alignSelfMap[style.alignSelf]) {
        node.setAlignSelf(alignSelfMap[style.alignSelf]);
      }
    }

    // AlignContent (multi-line alignment)
    if (style.alignContent) {
      const alignContentMap: Record<string, any> = {
        'flex-start': this.yoga.ALIGN_FLEX_START,
        'flex-end': this.yoga.ALIGN_FLEX_END,
        'center': this.yoga.ALIGN_CENTER,
        'stretch': this.yoga.ALIGN_STRETCH,
        'space-between': this.yoga.ALIGN_SPACE_BETWEEN,
        'space-around': this.yoga.ALIGN_SPACE_AROUND,
        'space-evenly': this.yoga.ALIGN_SPACE_EVENLY,
      };
      if (alignContentMap[style.alignContent]) {
        node.setAlignContent(alignContentMap[style.alignContent]);
      }
    }

    // Display (Yogaサポート: flex, none)
    if (style.display === "none") {
      node.setDisplay(this.yoga.DISPLAY_NONE);
    } else {
      // デフォルトはflex
      node.setDisplay(this.yoga.DISPLAY_FLEX);
    }

    // Position (Yogaサポート: relative, absolute, static)
    if (style.position === "absolute") {
      node.setPositionType(this.yoga.POSITION_TYPE_ABSOLUTE);
    } else if (style.position === "static") {
      node.setPositionType(this.yoga.POSITION_TYPE_STATIC);
    } else {
      // デフォルトはrelative
      node.setPositionType(this.yoga.POSITION_TYPE_RELATIVE);
    }

    // Position coordinates (top, right, bottom, left)
    if (style.top !== undefined) {
      node.setPosition(this.yoga.EDGE_TOP, this.validateCSSUnitForYoga(style.top, "top"));
    }
    if (style.right !== undefined) {
      node.setPosition(this.yoga.EDGE_RIGHT, this.validateCSSUnitForYoga(style.right, "right"));
    }
    if (style.bottom !== undefined) {
      node.setPosition(this.yoga.EDGE_BOTTOM, this.validateCSSUnitForYoga(style.bottom, "bottom"));
    }
    if (style.left !== undefined) {
      node.setPosition(this.yoga.EDGE_LEFT, this.validateCSSUnitForYoga(style.left, "left"));
    }

    // Gap プロパティ: 単位付き文字列をYogaに直接渡す
    if (style.gap !== undefined) {
      node.setGap(this.yoga.GUTTER_ALL, this.validateCSSUnitForYoga(style.gap, "gap"));
    }
    if (style.rowGap !== undefined) {
      node.setGap(this.yoga.GUTTER_ROW, this.validateCSSUnitForYoga(style.rowGap, "rowGap"));
    }
    if (style.columnGap !== undefined) {
      node.setGap(this.yoga.GUTTER_COLUMN, this.validateCSSUnitForYoga(style.columnGap, "columnGap"));
    }

    // Spacing: 単位付き文字列をYogaに直接渡す
    if (style.margin !== undefined) {
      node.setMargin(this.yoga.EDGE_ALL, this.validateCSSUnitForYoga(style.margin, "margin"));
    }
    if (style.marginTop !== undefined) {
      node.setMargin(this.yoga.EDGE_TOP, this.validateCSSUnitForYoga(style.marginTop, "marginTop"));
    }
    if (style.marginRight !== undefined) {
      node.setMargin(this.yoga.EDGE_RIGHT, this.validateCSSUnitForYoga(style.marginRight, "marginRight"));
    }
    if (style.marginBottom !== undefined) {
      node.setMargin(this.yoga.EDGE_BOTTOM, this.validateCSSUnitForYoga(style.marginBottom, "marginBottom"));
    }
    if (style.marginLeft !== undefined) {
      node.setMargin(this.yoga.EDGE_LEFT, this.validateCSSUnitForYoga(style.marginLeft, "marginLeft"));
    }

    if (style.padding !== undefined) {
      node.setPadding(this.yoga.EDGE_ALL, this.validateCSSUnitForYoga(style.padding, "padding"));
    }
    if (style.paddingTop !== undefined) {
      node.setPadding(this.yoga.EDGE_TOP, this.validateCSSUnitForYoga(style.paddingTop, "paddingTop"));
    }
    if (style.paddingRight !== undefined) {
      node.setPadding(this.yoga.EDGE_RIGHT, this.validateCSSUnitForYoga(style.paddingRight, "paddingRight"));
    }
    if (style.paddingBottom !== undefined) {
      node.setPadding(this.yoga.EDGE_BOTTOM, this.validateCSSUnitForYoga(style.paddingBottom, "paddingBottom"));
    }
    if (style.paddingLeft !== undefined) {
      node.setPadding(this.yoga.EDGE_LEFT, this.validateCSSUnitForYoga(style.paddingLeft, "paddingLeft"));
    }

    // Dimensions: 単位付き文字列をYogaに直接渡す
    if (style.width !== undefined) {
      // YogaライブラリのsetWidthに文字列を渡す（Yogaが適切に処理）
      node.setWidth(this.validateCSSUnitForYoga(style.width, "width"));
    }
    if (style.height !== undefined) {
      node.setHeight(this.validateCSSUnitForYoga(style.height, "height"));
    }

    // Min/Max Constraints: 単位付き文字列をYogaに直接渡す
    if (style.minWidth !== undefined) {
      node.setMinWidth(this.validateCSSUnitForYoga(style.minWidth, "minWidth"));
    }
    if (style.maxWidth !== undefined) {
      node.setMaxWidth(this.validateCSSUnitForYoga(style.maxWidth, "maxWidth"));
    }
    if (style.minHeight !== undefined) {
      node.setMinHeight(this.validateCSSUnitForYoga(style.minHeight, "minHeight"));
    }
    if (style.maxHeight !== undefined) {
      node.setMaxHeight(this.validateCSSUnitForYoga(style.maxHeight, "maxHeight"));
    }

    // Flex Properties
    if (style.flex !== undefined) {
      node.setFlex(style.flex);
    }
    if (style.flexGrow !== undefined) {
      node.setFlexGrow(style.flexGrow);
    }
    if (style.flexShrink !== undefined) {
      node.setFlexShrink(style.flexShrink);
    }
    if (style.flexBasis !== undefined) {
      node.setFlexBasis(this.validateCSSUnitForYoga(style.flexBasis, "flexBasis"));
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
        // コンテナのデフォルト設定をframeと同じ（設定なし）にする
        // frameと同じデフォルト動作を使用
        break;
        
      case "frame":
        // フレームはデフォルト動作（設定なし）
        break;

      case "slide":
        // スライドのデフォルト設定
        node.setFlexDirection(this.yoga.FLEX_DIRECTION_COLUMN);
        node.setJustifyContent(this.yoga.JUSTIFY_FLEX_START);
        break;
    }
  }


  /**
   * フォントサイズをPixels単位に変換（実行時エラー版）
   */
  private parseFontSizeToPixels(style: any): Pixels {
    // fontSizeInPixelがあればそれを優先
    if ((style as any).fontSizeInPixel) {
      return (style as any).fontSizeInPixel;
    }

    // fontSizeの存在チェック（実行時）
    const fontSize = style.fontSize;
    if (!fontSize) {
      throw new Error("SYSTEM BUG: fontSize is missing");
    }
    
    const match = fontSize.match(/^(\d+(?:\.\d+)?)(px|pt|em|rem)?$/);
    if (!match) {
      throw new Error(`Invalid fontSize format: ${fontSize}`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2] || 'px';

    switch (unit) {
      case 'pt':
        throw new Error(
          `pt units not supported in layout engine: ${fontSize}. ` +
          `Use fontSizeInPixel field for pt conversion.`
        );
      case 'em':
      case 'rem':
        // 1em/rem = 16px (デフォルト)
        return createPixels(value * 16);
      case 'px':
      default:
        return createPixels(value);
    }
  }

  /**
   * YogaライブラリのためにCSS単位を検証
   * pt単位はYogaでサポートされていないため警告を表示
   */
  private validateCSSUnitForYoga(value: string | number, propertyName: string): string | number {
    if (typeof value === "number") {
      console.warn(
        `⚠️  Unitless values are not supported for ${propertyName}. Use "px", "%", "vw", "vh" units instead. Received: ${value}`,
      );
      return `${value}px`; // フォールバック
    }
    
    if (typeof value === "string") {
      const trimmed = value.trim();
      // pt単位の場合は警告のみ（レンダラーで処理される）
      if (trimmed.endsWith("pt")) {
        console.warn(
          `⚠️  pt units in ${propertyName} should be handled by renderer, not layout engine. Value: ${value}`,
        );
        // pt単位はレイアウトでは無視（レンダラーで処理）
        return "0px";
      }
    }
    
    return value; // Yogaに直接渡す
  }

  /**
   * 未サポートのスタイルプロパティをチェックして警告
   */
  private checkUnsupportedProperties(style: any, element: Element): void {
    if (!style) return;

    // Yogaでサポートされているプロパティのリスト
    const supportedProperties = new Set([
      // レイアウト
      "flexDirection",
      "justifyContent",
      "alignItems",
      "alignContent",
      "alignSelf",
      "flex",
      "flexGrow",
      "flexShrink",
      "flexBasis",
      "flexWrap",

      // サイズ
      "width",
      "height",
      "minWidth",
      "minHeight",
      "maxWidth",
      "maxHeight",

      // 間隔
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "gap",
      "rowGap",
      "columnGap",

      // 位置
      "position",
      "top",
      "right",
      "bottom",
      "left",

      // 表示
      "display",
      "overflow",

      // SlideWeave固有（Yogaでは処理しないが有効）
      "backgroundColor",
      "border",
      "borderRadius",
      "borderWidth",
      "borderColor",
      "borderStyle",
      "borderLeft",
      "borderLeftWidth",
      "borderLeftColor",
      "borderLeftStyle",
      "borderTop",
      "borderTopWidth",
      "borderTopColor",
      "borderTopStyle",
      "borderRight",
      "borderRightWidth",
      "borderRightColor",
      "borderRightStyle",
      "borderBottom",
      "borderBottomWidth",
      "borderBottomColor",
      "borderBottomStyle",
      "color",
      "fontSize",
      "fontSizeInPixel", // 内部変換用フィールド
      "fontWeight",
      "fontStyle",
      "fontFamily",
      "textAlign",
      "background",
      "backgroundImage",
      "backgroundSize",
      "backgroundPosition",
      "lineHeight",
      "boxShadow",
      "cursor",
      "glassEffect",
      "opacity",
      "zIndex",
    ]);

    // レガシープロパティのマッピング
    const legacyPropertyMap: Record<string, string> = {
      direction: "flexDirection",
    };

    // スタイルプロパティをチェック
    for (const prop in style) {
      if (!supportedProperties.has(prop)) {
        // レガシープロパティの場合
        if (legacyPropertyMap[prop]) {
          const newProp = legacyPropertyMap[prop];
          const elementInfo =
            element.type + (element.id ? ` (id: ${element.id})` : "");
          console.warn(
            `⚠️  Deprecated style property "${prop}" in ${elementInfo}. Use "${newProp}" instead.`,
          );
        } else {
          // 完全に未知のプロパティ
          const elementInfo =
            element.type + (element.id ? ` (id: ${element.id})` : "");
          console.warn(
            `⚠️  Unknown style property "${prop}" in ${elementInfo}. This property will be ignored.`,
          );
        }
      }
    }
  }

  /**
   * テキスト要素のメジャー関数を設定
   */
  private setupTextMeasurement(node: any, element: Element): void {
    if (!element.style || !('fontSize' in element.style) || !(element.style as any).fontSize) {
      throw new Error(
        `SYSTEM BUG: fontSize missing for ${element.type} element. ` +
        `SlideDataLoader should have applied default fontSize.`
      );
    }
    
    const fontSizePixels = this.parseFontSizeToPixels(element.style);

    const content = "content" in element ? (element as any).content || "" : "";

    node.setMeasureFunc(
      (
        width: number,
        widthMode: number,
        _height: number,
        _heightMode: number,
      ) => {
        // フォントメトリクス計算（言語別文字幅係数適用）
        const charWidth = this.getCharWidth(content, fontSizePixels);
        const lineHeight = fontSizePixels * 1.0;
        const naturalWidth = (content as string).length * charWidth;

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
        const isTextElement =
          element.type === "text" || element.type === "heading";
        const alignedWidth = isTextElement
          ? resultWidth
          : Math.ceil(resultWidth / 8) * 4;
        const alignedHeight = isTextElement
          ? resultHeight
          : Math.ceil(resultHeight / 8) * 4;

        return {
          width: createPixels(alignedWidth),
          height: createPixels(alignedHeight),
        };
      },
    );
  }

  /**
   * YogaノードからLayoutResultに変換
   */
  private convertToLayoutResult(
    yogaNode: any,
    originalElement: Element,
  ): LayoutResult {
    const result: LayoutResult = {
      left: createPixels(yogaNode.getComputedLeft()),
      top: createPixels(yogaNode.getComputedTop()),
      width: createPixels(yogaNode.getComputedWidth()),
      height: createPixels(yogaNode.getComputedHeight()),
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
   * 言語別の文字幅係数を取得（Branded Type対応）
   */
  private getCharWidth(content: string, fontSizePixels: Pixels): number {
    // 日本語文字（ひらがな、カタカナ、漢字）の検出
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(
      content,
    );
    const ratio = hasJapanese ? 1.4 : 0.8; // 日本語: 1.4（全角+余裕）, 英語: 0.8（半角）
    return fontSizePixels * ratio;
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
      console.warn("Warning: Yoga node already freed or invalid:", error);
    }
  }
}
