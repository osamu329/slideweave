/**
 * SlideWeave PPTXレンダラー
 * レイアウト計算結果をPPTXGenJSオブジェクトに変換
 */

import { LayoutResult, flattenLayout, YogaLayoutEngine } from "../layout/YogaLayoutEngine";
import {
  TextElement,
  HeadingElement,
  ContainerElement,
  FrameElement,
  ShapeElement,
  TextShadow,
} from "../types/elements";
import { SVGGenerator, BackgroundBlurOptions } from "../svg/SVGGenerator";
import { TempFileManager } from "../utils/TempFileManager";
import { DPIConverter } from "../utils/DPIConverter";
import { StyleConverter } from "../layout/StyleConverter";
import { Pixels, Inches, createPixels, createPoints } from "../types/units";
import { PPTXWrapper } from "./PPTXWrapper";

export interface PPTXRenderOptions {
  widthPx: Pixels;
  heightPx: Pixels;
  dpi: number;
}

export class PPTXRenderer {
  private pptxWrapper: PPTXWrapper;
  private svgGenerator: SVGGenerator;
  private currentBackgroundImage: string | null = null;
  private currentBackgroundColor: string | null = null;
  private slideWidthInch: Inches;
  private slideHeightInch: Inches;
  private dpiConverter: DPIConverter;
  private styleConverter: StyleConverter;
  private layoutEngine: YogaLayoutEngine;

  constructor(options: PPTXRenderOptions) {
    this.svgGenerator = new SVGGenerator();

    // DPI変換器を初期化
    this.dpiConverter = new DPIConverter(options.dpi);

    // StyleConverter初期化（format別DPI使用）
    this.styleConverter = new StyleConverter(options.dpi);

    // ピクセル値からインチ値を内部で計算
    this.slideWidthInch = this.dpiConverter.pxToInch(options.widthPx);
    this.slideHeightInch = this.dpiConverter.pxToInch(options.heightPx);

    // PPTXWrapperを初期化
    this.pptxWrapper = new PPTXWrapper(options.dpi, this.slideWidthInch, this.slideHeightInch);
    
    // YogaLayoutEngineを初期化
    this.layoutEngine = new YogaLayoutEngine();
  }

  /**
   * 要素をレイアウト処理用に前処理（pt→px変換）
   */
  private preprocessElement(element: any): any {
    const processedElement = { ...element };
    
    if (element.style?.fontSize?.endsWith('pt')) {
      const ptValue = parseFloat(element.style.fontSize);
      const pxValue = this.dpiConverter.ptToPx(createPoints(ptValue));
      
      processedElement.style = {
        ...element.style,
        fontSizeInPixel: pxValue  // 変換済みpx値を追加
        // 元のfontSizeも保持（PowerPoint出力用）
      };
    } else if (element.style?.fontSize?.endsWith('px')) {
      const pxValue = parseFloat(element.style.fontSize);
      
      processedElement.style = {
        ...element.style,
        fontSizeInPixel: createPixels(pxValue)  // px値をそのまま設定
      };
    }
    
    // 子要素も再帰的に処理
    if (element.children) {
      processedElement.children = element.children.map((child: any) => 
        this.preprocessElement(child)
      );
    }
    
    return processedElement;
  }

  /**
   * TextShadowをPPTXGenJSのshadowオプションに変換
   */
  private convertTextShadow(shadow: TextShadow): any {
    return {
      type: shadow.type,
      color: shadow.color,
      blur: shadow.blur,
      offset: shadow.offset,
      angle: shadow.angle,
      ...(shadow.opacity !== undefined && { opacity: shadow.opacity }),
    };
  }

  /**
   * 背景ブラーオプションを作成
   */
  private createBackgroundBlurOptions(
    layoutResult: LayoutResult,
    style: any,
  ): BackgroundBlurOptions | undefined {
    if (!style?.glassEffect) {
      return undefined;
    }

    // 背景画像またはスライド背景色のいずれかが必要
    if (!this.currentBackgroundImage && !this.currentBackgroundColor) {
      return undefined;
    }

    const slideWidthPx = this.dpiConverter.inchToPx(this.slideWidthInch); // インチをピクセルに変換
    const slideHeightPx = this.dpiConverter.inchToPx(this.slideHeightInch);

    return {
      backgroundImagePath: this.currentBackgroundImage || undefined,
      backgroundColor: this.currentBackgroundColor || undefined, // スライド背景色を使用
      frameX: layoutResult.left || 0,
      frameY: layoutResult.top || 0,
      frameWidth: layoutResult.width,
      frameHeight: layoutResult.height,
      slideWidth: slideWidthPx,
      slideHeight: slideHeightPx,
      borderRadius: style?.borderRadius ? `${style.borderRadius}px` : undefined,
      blurStrength: 5, // 適度なブラー強度（輪郭が分かるレベル）
      quality: 70, // ファイルサイズ抑制のため低めの品質
    };
  }

  /**
   * 要素からPPTXファイルを生成（レイアウト処理込み）
   * @param element 要素
   * @param containerWidth コンテナ幅
   * @param containerHeight コンテナ高さ
   * @returns PPTXGenJS インスタンス
   */
  async render(
    element: any,
    containerWidth: Pixels,
    containerHeight: Pixels,
  ): Promise<any> {
    // 新しいスライドを作成
    this.pptxWrapper.addSlide();

    // 要素を前処理（pt→px変換）
    const processedElement = this.preprocessElement(element);

    // レイアウト計算
    const layoutResult = await this.layoutEngine.renderLayout(
      processedElement,
      containerWidth,
      containerHeight,
    );

    // スライドレベルの背景画像を先に描画
    this.renderSlideBackground(layoutResult);

    // 相対座標を絶対座標に変換して平坦化
    const flatElements = flattenLayout(layoutResult);

    // 各要素を絶対座標でレンダリング
    for (const element of flatElements) {
      await this.renderFlatElement(element);
    }

    return this.pptxWrapper;
  }

  /**
   * スライドレベルの背景画像を描画
   * @param layoutResult レイアウト結果
   */
  private renderSlideBackground(layoutResult: LayoutResult): void {
    if (!this.pptxWrapper.hasCurrentSlide()) return;

    const element = layoutResult.element;
    const style = element.style;

    // 背景情報を保存
    if (style && "backgroundImage" in style && style.backgroundImage) {
      this.currentBackgroundImage = style.backgroundImage; // 背景画像パスを保存
      this.addBackgroundImage(
        style.backgroundImage,
        style.backgroundSize,
        layoutResult,
      );
    }

    if (style && "backgroundColor" in style && style.backgroundColor) {
      this.currentBackgroundColor = style.backgroundColor; // 背景色を保存
      // スライドの背景色を設定
      const currentSlide = this.pptxWrapper.getCurrentSlide();
      if (currentSlide) {
        currentSlide.background = { color: style.backgroundColor };
      }
    }
  }

  /**
   * 背景画像をスライドに追加
   * @param imagePath 画像パス
   * @param backgroundSize サイズ指定
   * @param layoutResult レイアウト結果
   */
  private addBackgroundImage(
    imagePath: string,
    backgroundSize: "cover" | "contain" | "fit" | "none" | undefined,
    layoutResult: LayoutResult,
  ): void {
    if (!this.pptxWrapper.hasCurrentSlide()) return;

    const position = this.pptxWrapper.createPositionFromLayout(layoutResult);

    // backgroundSizeに応じたsizingオプションを設定
    let sizingOption: any = undefined;

    if (backgroundSize !== "none") {
      const sizeType = this.mapBackgroundSizeToSizing(backgroundSize);
      sizingOption = {
        type: sizeType,
        w: position.w,
        h: position.h,
      };
    }

    const imageOptions: any = {
      path: imagePath,
      x: position.x,
      y: position.y,
      w: backgroundSize === "none" ? undefined : "100%",
      h: backgroundSize === "none" ? undefined : "100%",
    };

    // sizingオプションを条件付きで追加
    if (sizingOption) {
      imageOptions.sizing = sizingOption;
    }

    const currentSlide = this.pptxWrapper.getCurrentSlide();
    if (currentSlide) {
      currentSlide.addImage(imageOptions);
    }
  }

  /**
   * backgroundSizeをPPTXGenJSのsizingタイプにマッピング
   * @param backgroundSize backgroundSizeの値
   * @returns PPTXGenJSのsizingタイプ
   */
  private mapBackgroundSizeToSizing(
    backgroundSize: "cover" | "contain" | "fit" | "none" | undefined,
  ): string {
    switch (backgroundSize) {
      case "contain":
        return "contain";
      case "fit":
        return "crop";
      case "cover":
      default:
        return "cover";
    }
  }

  /**
   * 平坦化された要素を絶対座標でレンダリング
   * @param layoutResult レイアウト結果（絶対座標）
   */
  private async renderFlatElement(layoutResult: LayoutResult): Promise<void> {
    if (!this.pptxWrapper.hasCurrentSlide()) {
      throw new Error("スライドが初期化されていません");
    }

    // 境界チェック: 要素がスライド範囲を超えていないか確認
    this.checkBoundingBox(layoutResult);

    const element = layoutResult.element;

    switch (element.type) {
      case "container":
        this.renderContainer(layoutResult, element as ContainerElement);
        break;
      case "frame":
        await this.renderFrame(layoutResult, element as FrameElement);
        break;
      case "shape":
        await this.renderShape(layoutResult, element as ShapeElement);
        break;
      case "text":
        this.renderText(layoutResult, element as TextElement);
        break;
      case "heading":
        this.renderHeading(layoutResult, element as HeadingElement);
        break;
      default:
        // 他の要素タイプは現在未実装
        break;
    }
  }

  /**
   * containerをレンダリング（純粋なレイアウト用、PowerPointオブジェクトは作成しない）
   * @param layoutResult レイアウト結果
   * @param element container要素
   */
  private renderContainer(
    _layoutResult: LayoutResult,
    _element: ContainerElement,
  ): void {
    // containerは純粋なレイアウト用なので、PowerPointオブジェクトは作成しない
  }

  /**
   * frameをレンダリング（装飾付きコンテナ）
   * @param layoutResult レイアウト結果
   * @param element frame要素
   */
  private async renderFrame(
    layoutResult: LayoutResult,
    element: FrameElement,
  ): Promise<void> {
    if (!this.pptxWrapper.hasCurrentSlide()) return;

    const position = this.pptxWrapper.createPositionFromLayout(layoutResult);
    const style = element.style;

    // SVGを生成してframeを描画
    // SVGの座標系を実際のピクセルサイズに合わせる
    const svgOptions = {
      width: layoutResult.width, // 実際のレイアウトサイズ（ピクセル）
      height: layoutResult.height, // 実際のレイアウトサイズ（ピクセル）
      backgroundColor: style?.backgroundColor,
      background: style?.background, // グラデーション対応
      borderRadius: style?.borderRadius, // 既に"8px"形式
      borderWidth: style?.borderWidth, // "2px"形式のボーダー幅
      borderColor: style?.borderColor, // "#ff0000"形式のボーダー色
      borderStyle: style?.borderStyle, // "solid" | "dashed" | "dotted"
      glassEffect: style?.glassEffect, // ガラス風効果
      backgroundBlur: this.createBackgroundBlurOptions(layoutResult, style), // 背景ブラー効果
    };

    // 背景ブラー画像を先に配置
    if (svgOptions.backgroundBlur) {
      const blurredImagePath = await this.svgGenerator.processBackgroundBlur(
        svgOptions.backgroundBlur,
      );
      if (blurredImagePath) {
        this.pptxWrapper.addImage({
          path: blurredImagePath,
          x: position.x,
          y: position.y,
          w: position.w,
          h: position.h,
        });
      }
    }

    const svg = await this.svgGenerator.generateFrameSVG(svgOptions);

    // addSVGでSVGを描画（Base64変換はラッパー内で実行）
    this.pptxWrapper.addSVG(svg, {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
    });
  }

  /**
   * shapeをレンダリング（図形のみ）
   * @param layoutResult レイアウト結果
   * @param element shape要素
   */
  private async renderShape(
    layoutResult: LayoutResult,
    element: ShapeElement,
  ): Promise<void> {
    if (!this.pptxWrapper.hasCurrentSlide()) return;

    const position = this.pptxWrapper.createPositionFromLayout(layoutResult);
    const style = element.style;

    // グラデーション背景がある場合はSVG描画、そうでなければ従来のshape描画
    if (style?.background && typeof style.background !== "string") {
      // SVGを生成してshapeを描画（グラデーション用）
      const svgOptions = {
        width: layoutResult.width,
        height: layoutResult.height,
        backgroundColor: style?.backgroundColor,
        background: style?.background,
        borderRadius:
          element.shapeType === "circle"
            ? `${Math.min(layoutResult.width, layoutResult.height) / 2}px`
            : undefined,
      };

      const svg = await this.svgGenerator.generateFrameSVG(svgOptions);

      // SVGをBase64エンコード
      const svgBase64 = Buffer.from(svg).toString("base64");
      const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

      // addImageでSVGを描画
      this.pptxWrapper.addImage({
        data: dataUri,
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
      });
    } else {
      // 従来のshape描画（単色背景用）
      const shapeOptions = {
        ...position,
      };

      // 背景色設定
      if (
        style?.backgroundColor ||
        (style?.background && typeof style.background === "string")
      ) {
        const color =
          style.background && typeof style.background === "string"
            ? style.background
            : style.backgroundColor;
        (shapeOptions as any).fill = { color };
      }

      // ボーダー設定
      if (style?.borderColor && style?.borderWidth) {
        (shapeOptions as any).line = {
          color: style.borderColor,
          width: style.borderWidth,
          dashType: style?.borderStyle === "dashed" ? "dash" : "solid",
        };
      } else {
        (shapeOptions as any).line = { type: "none" };
      }

      // shapeTypeに応じてPowerPointシェイプを作成
      let pptxShapeType: string;
      switch (element.shapeType) {
        case "rectangle":
          pptxShapeType = "rect";
          break;
        case "circle":
          pptxShapeType = "ellipse";
          break;
        case "ellipse":
          pptxShapeType = "ellipse";
          break;
        default:
          pptxShapeType = "rect";
      }

      this.pptxWrapper.addShape(pptxShapeType, shapeOptions);
    }
  }

  /**
   * CSS単位付き値から数値を抽出
   * @param value 値（数値または単位付き文字列）
   * @returns 数値
   */
  private extractNumericValue(value: string | number | undefined): number {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const numMatch = value.match(/^(\d+(?:\.\d+)?)/);
      if (numMatch) {
        return parseFloat(numMatch[1]);
      }
    }
    return 0;
  }

  /**
   * フォントサイズ文字列をpx値に変換（DPI対応）
   * @param fontSize フォントサイズ文字列（"16px", "12pt"など）
   * @returns px単位の数値
   */
  private parseFontSize(fontSize: string | undefined): number {
    if (!fontSize) return 12; // デフォルト値

    const match = fontSize.match(/^(\d+(?:\.\d+)?)(px|pt|em|rem)?$/);
    if (!match) return 12;

    const value = parseFloat(match[1]);
    const unit = match[2] || 'px';

    switch (unit) {
      case 'pt':
        // StyleConverterを使用してDPI対応のpt→px変換
        const pxValue = this.styleConverter.convertDimensionUnit(fontSize, "fontSize");
        return this.extractNumericValue(pxValue);
      case 'em':
      case 'rem':
        // 1em/rem = 16px (デフォルト)
        return value * 16;
      case 'px':
      default:
        return value;
    }
  }

  /**
   * textをレンダリング
   * @param layoutResult レイアウト結果
   * @param element text要素
   */
  private renderText(layoutResult: LayoutResult, element: TextElement): void {
    if (!this.pptxWrapper.hasCurrentSlide()) return;

    const position = this.pptxWrapper.createPositionFromLayout(layoutResult);
    const fontSize = this.parseFontSize(element.style?.fontSize);
    const padding = this.extractNumericValue(element.style?.padding) || 0;

    const textOptions = {
      ...position,
      fontSize: createPixels(fontSize), // px単位で渡す（wrapperでpt変換される）
      fontFace: element.style?.fontFamily,
      color: element.style?.color,
      bold: this.isBold(element.style?.fontWeight),
      italic: this.isItalic(element.style?.fontStyle),
      margin: padding,
      valign: "top" as const,
      fill: element.style?.backgroundColor
        ? { color: element.style.backgroundColor }
        : undefined,
      shadow: element.style?.textShadow ? this.convertTextShadow(element.style.textShadow) : undefined,
    };

    this.pptxWrapper.addText(element.content, textOptions);
  }

  /**
   * headingをレンダリング
   * @param layoutResult レイアウト結果
   * @param element heading要素
   */
  private renderHeading(
    layoutResult: LayoutResult,
    element: HeadingElement,
  ): void {
    if (!this.pptxWrapper.hasCurrentSlide()) return;

    const position = this.pptxWrapper.createPositionFromLayout(layoutResult);

    // レベルに応じたデフォルトフォントサイズ（px単位）
    const fontSizeMap: Record<number, string> = {
      1: "24px",
      2: "20px",
      3: "18px",
      4: "16px",
      5: "14px",
      6: "12px",
    };
    const level = element.level || 1;
    const fontSize = this.parseFontSize(element.style?.fontSize || fontSizeMap[level]);
    const padding = this.extractNumericValue(element.style?.padding) || 0;

    const textOptions = {
      ...position,
      fontSize: createPixels(fontSize), // px単位で渡す（wrapperでpt変換される）
      fontFace: element.style?.fontFamily,
      color: element.style?.color,
      bold: this.isBold(element.style?.fontWeight, true), // headingはデフォルトでbold
      italic: this.isItalic(element.style?.fontStyle),
      margin: padding,
      valign: "top" as const,
      fill: element.style?.backgroundColor
        ? { color: element.style.backgroundColor }
        : undefined,
      shadow: element.style?.textShadow ? this.convertTextShadow(element.style.textShadow) : undefined,
    };

    this.pptxWrapper.addText(element.content, textOptions);
  }

  /**
   * ピクセル座標をインチに変換（PPTXGenJS用）
   * @param layoutResult レイアウト結果
   * @returns インチ座標
   */
  private pixelsToInches(layoutResult: LayoutResult): {
    x: number;
    y: number;
    w: number;
    h: number;
  } {
    // ピクセル → インチ変換（96DPI標準）

    return {
      x: this.dpiConverter.pxToInch(layoutResult.left),
      y: this.dpiConverter.pxToInch(layoutResult.top),
      w: this.dpiConverter.pxToInch(layoutResult.width),
      h: this.dpiConverter.pxToInch(layoutResult.height),
    };
  }

  /**
   * 要素の境界チェック: スライド範囲を超えていないか確認
   * @param layoutResult レイアウト結果
   */
  private checkBoundingBox(layoutResult: LayoutResult): void {
    const slideWidthPx = this.dpiConverter.inchToPx(this.slideWidthInch);
    const slideHeightPx = this.dpiConverter.inchToPx(this.slideHeightInch);

    const elementLeft = layoutResult.left || 0;
    const elementTop = layoutResult.top || 0;
    const elementRight = elementLeft + layoutResult.width;
    const elementBottom = elementTop + layoutResult.height;

    // スライド境界チェック
    if (elementRight > slideWidthPx || elementBottom > slideHeightPx) {
      const elementType = layoutResult.element?.type || "unknown";
      const elementContent = (layoutResult.element as any)?.content || "";

      console.warn(`⚠️  Element exceeds slide boundaries:
  Type: ${elementType}${elementContent ? ` ("${elementContent.substring(0, 20)}...")` : ""}
  Position: (${elementLeft.toFixed(0)}, ${elementTop.toFixed(0)})px
  Size: ${layoutResult.width.toFixed(0)} x ${layoutResult.height.toFixed(0)}px
  Right edge: ${elementRight.toFixed(0)}px (max: ${slideWidthPx.toFixed(0)}px)
  Bottom edge: ${elementBottom.toFixed(0)}px (max: ${slideHeightPx.toFixed(0)}px)
  Overflow: ${elementRight > slideWidthPx ? `${(elementRight - slideWidthPx).toFixed(0)}px right` : ""}${elementRight > slideWidthPx && elementBottom > slideHeightPx ? ", " : ""}${elementBottom > slideHeightPx ? `${(elementBottom - slideHeightPx).toFixed(0)}px bottom` : ""}`);
    }

    // 負の座標チェック
    if (elementLeft < 0 || elementTop < 0) {
      const elementType = layoutResult.element?.type || "unknown";
      console.warn(`⚠️  Element has negative position:
  Type: ${elementType}
  Position: (${elementLeft.toFixed(0)}, ${elementTop.toFixed(0)})px`);
    }
  }

  /**
   * PPTXファイルとして保存
   * @param filename ファイル名
   * @returns Promise
   */
  async save(filename: string): Promise<string> {
    try {
      const result = await this.pptxWrapper.writeFile(filename);

      // PPTX生成完了後に一時ファイルをクリーンアップ
      TempFileManager.getInstance().cleanupAll();

      return result;
    } catch (error) {
      // エラー時でもクリーンアップを実行
      TempFileManager.getInstance().cleanupAll();
      throw error;
    }
  }

  /**
   * PPTXデータをバッファとして取得
   * @returns Promise<Buffer>
   */
  // getBuffer メソッドは削除（PPTXWrapperを直接使用）

  /**
   * 新しいスライドを追加
   * @returns 新しいSlideインスタンス
   */
  // addSlide メソッドは削除（renderメソッドで自動的に追加）

  /**
   * PPTXGenJSインスタンスを取得
   * @returns PPTXGenJSインスタンス
   */
  getPptxWrapper(): PPTXWrapper {
    return this.pptxWrapper;
  }

  /**
   * fontWeight値がboldかどうかを判定
   * @param fontWeight フォントウェイト値（文字列、数値、boolean）
   * @param defaultValue デフォルト値
   * @returns bold かどうか
   */
  private isBold(
    fontWeight?: string | number | boolean,
    defaultValue: boolean = false,
  ): boolean {
    if (typeof fontWeight === "boolean") {
      return fontWeight;
    }
    if (typeof fontWeight === "string") {
      return (
        fontWeight === "bold" ||
        fontWeight === "bolder" ||
        parseInt(fontWeight) >= 700
      );
    }
    if (typeof fontWeight === "number") {
      return fontWeight >= 700;
    }
    return defaultValue;
  }

  /**
   * fontStyle値がitalicかどうかを判定
   * @param fontStyle フォントスタイル値（文字列、boolean）
   * @returns italic かどうか
   */
  private isItalic(fontStyle?: string | boolean): boolean {
    if (typeof fontStyle === "boolean") {
      return fontStyle;
    }
    if (typeof fontStyle === "string") {
      return fontStyle === "italic" || fontStyle === "oblique";
    }
    return false;
  }
}
