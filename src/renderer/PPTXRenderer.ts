/**
 * SlideWeave PPTXレンダラー
 * レイアウト計算結果をPPTXGenJSオブジェクトに変換
 */

import PptxGenJS from "pptxgenjs";
import { LayoutResult, flattenLayout } from "../layout/ILayoutEngine";
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

export interface PPTXRenderOptions {
  slideWidth?: number; // インチ
  slideHeight?: number; // インチ
  theme?: "light" | "dark";
}

export class PPTXRenderer {
  private pptx: PptxGenJS;
  private currentSlide: PptxGenJS.Slide | null = null;
  private svgGenerator: SVGGenerator;
  private currentBackgroundImage: string | null = null;
  private currentBackgroundColor: string | null = null;
  private options: PPTXRenderOptions;

  constructor(options: PPTXRenderOptions = {}) {
    this.pptx = new PptxGenJS();
    this.svgGenerator = new SVGGenerator();
    this.options = {
      slideWidth: 10,
      slideHeight: 5.625,
      theme: "light",
      ...options,
    };

    // スライドサイズ設定（デフォルト: 10x5.625インチ = 16:9）
    this.pptx.defineLayout({
      name: "SLIDEWEAVE_LAYOUT",
      width: this.options.slideWidth!,
      height: this.options.slideHeight!,
    });
    this.pptx.layout = "SLIDEWEAVE_LAYOUT";
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
  private createBackgroundBlurOptions(layoutResult: LayoutResult, style: any): BackgroundBlurOptions | undefined {
    if (!style?.glassEffect) {
      return undefined;
    }

    // 背景画像またはスライド背景色のいずれかが必要
    if (!this.currentBackgroundImage && !this.currentBackgroundColor) {
      return undefined;
    }

    const slideWidthPx = this.options.slideWidth! * 96; // インチをピクセルに変換 (96 DPI)
    const slideHeightPx = this.options.slideHeight! * 96;

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
      quality: 70 // ファイルサイズ抑制のため低めの品質
    };
  }

  /**
   * レイアウト結果からPPTXファイルを生成
   * @param elementsOrLayoutResult 要素配列またはレイアウト結果
   * @param layoutResults レイアウト計算結果配列 (要素配列の場合のみ)
   * @returns PPTXGenJS インスタンス
   */
  async render(elementsOrLayoutResult: any[] | LayoutResult, layoutResults?: LayoutResult[]): Promise<PptxGenJS> {
    // 新しいスライドを作成
    this.currentSlide = this.pptx.addSlide();

    // テスト用のオーバーロード処理
    if (Array.isArray(elementsOrLayoutResult) && layoutResults) {
      const layoutResult = layoutResults[0];
      // スライドレベルの背景画像を先に描画
      this.renderSlideBackground(layoutResult);

      // 相対座標を絶対座標に変換して平坦化
      const flatElements = flattenLayout(layoutResult);

      // 各要素を絶対座標でレンダリング
      for (const element of flatElements) {
        await this.renderFlatElement(element);
      }
    } else {
      const layoutResult = elementsOrLayoutResult as LayoutResult;
      // スライドレベルの背景画像を先に描画
      this.renderSlideBackground(layoutResult);

      // 相対座標を絶対座標に変換して平坦化
      const flatElements = flattenLayout(layoutResult);

      // 各要素を絶対座標でレンダリング
      for (const element of flatElements) {
        await this.renderFlatElement(element);
      }
    }

    return this.pptx;
  }

  /**
   * スライドレベルの背景画像を描画
   * @param layoutResult レイアウト結果
   */
  private renderSlideBackground(layoutResult: LayoutResult): void {
    if (!this.currentSlide) return;

    const element = layoutResult.element;
    const style = element.style;

    // 背景情報を保存
    if (style?.backgroundImage) {
      this.currentBackgroundImage = style.backgroundImage; // 背景画像パスを保存
      this.addBackgroundImage(style.backgroundImage, style.backgroundSize, layoutResult);
    }
    
    if (style?.backgroundColor) {
      this.currentBackgroundColor = style.backgroundColor; // 背景色を保存
      // スライドの背景色を設定
      this.currentSlide.background = { color: style.backgroundColor };
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
    layoutResult: LayoutResult
  ): void {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    
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

    this.currentSlide.addImage(imageOptions);
  }

  /**
   * backgroundSizeをPPTXGenJSのsizingタイプにマッピング
   * @param backgroundSize backgroundSizeの値
   * @returns PPTXGenJSのsizingタイプ
   */
  private mapBackgroundSizeToSizing(backgroundSize: "cover" | "contain" | "fit" | "none" | undefined): string {
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
    if (!this.currentSlide) {
      throw new Error("スライドが初期化されていません");
    }

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
  private async renderFrame(layoutResult: LayoutResult, element: FrameElement): Promise<void> {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    const style = element.style;

    // SVGを生成してframeを描画
    // SVGの座標系を実際のピクセルサイズに合わせる
    const svgOptions = {
      width: layoutResult.width,   // 実際のレイアウトサイズ（ピクセル）
      height: layoutResult.height, // 実際のレイアウトサイズ（ピクセル）
      backgroundColor: style?.backgroundColor,
      background: style?.background, // グラデーション対応
      borderRadius: style?.borderRadius ? `${style.borderRadius}px` : undefined, // 数値をpx文字列に変換
      glassEffect: style?.glassEffect, // ガラス風効果
      backgroundBlur: this.createBackgroundBlurOptions(layoutResult, style) // 背景ブラー効果
    };

    // 背景ブラー画像を先に配置
    if (svgOptions.backgroundBlur) {
      const blurredImagePath = await this.svgGenerator.processBackgroundBlur(svgOptions.backgroundBlur);
      if (blurredImagePath) {
        this.currentSlide.addImage({
          path: blurredImagePath, // 既に絶対パス
          x: position.x,
          y: position.y,
          w: position.w,
          h: position.h,
        });
      }
    }

    const svg = await this.svgGenerator.generateFrameSVG(svgOptions);
    
    // SVGをBase64エンコード
    const svgBase64 = Buffer.from(svg).toString('base64');
    const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

    // addImageでSVGを描画（ガラス効果オーバーレイ）
    this.currentSlide.addImage({
      data: dataUri,
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h
    });
  }

  /**
   * shapeをレンダリング（図形のみ）
   * @param layoutResult レイアウト結果
   * @param element shape要素
   */
  private async renderShape(layoutResult: LayoutResult, element: ShapeElement): Promise<void> {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    const style = element.style;

    // グラデーション背景がある場合はSVG描画、そうでなければ従来のshape描画
    if (style?.background && typeof style.background !== 'string') {
      // SVGを生成してshapeを描画（グラデーション用）
      const svgOptions = {
        width: layoutResult.width,
        height: layoutResult.height,
        backgroundColor: style?.backgroundColor,
        background: style?.background,
        borderRadius: element.shapeType === 'circle' ? `${Math.min(layoutResult.width, layoutResult.height) / 2}px` : undefined
      };

      const svg = await this.svgGenerator.generateFrameSVG(svgOptions);
      
      // SVGをBase64エンコード
      const svgBase64 = Buffer.from(svg).toString('base64');
      const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

      // addImageでSVGを描画
      this.currentSlide.addImage({
        data: dataUri,
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h
      });
    } else {
      // 従来のshape描画（単色背景用）
      const shapeOptions: Record<string, unknown> = {
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
      };

      // 背景色設定
      if (style?.backgroundColor || (style?.background && typeof style.background === 'string')) {
        const color = style.background && typeof style.background === 'string' ? style.background : style.backgroundColor;
        shapeOptions.fill = { color };
      }

      // ボーダー設定
      if (style?.borderColor && style?.borderWidth) {
        shapeOptions.line = {
          color: style.borderColor,
          width: style.borderWidth,
          dashType: style?.borderStyle === "dashed" ? "dash" : "solid",
        };
      } else {
        shapeOptions.line = { type: "none" };
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

      this.currentSlide.addShape(pptxShapeType as any, shapeOptions);
    }
  }

  /**
   * CSS単位付き値から数値を抽出
   * @param value 値（数値または単位付き文字列）
   * @returns 数値
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
   * textをレンダリング
   * @param layoutResult レイアウト結果
   * @param element text要素
   */
  private renderText(layoutResult: LayoutResult, element: TextElement): void {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    const fontSize = this.extractNumericValue(element.style?.fontSize) || this.extractNumericValue(element.fontSize) || 12;
    const padding = this.extractNumericValue(element.style?.padding) || 0;
    
    const textOptions: any = {
      ...position,
      fontSize,
      fontFace: element.style?.fontFamily || element.fontFamily || "Arial",
      color: element.style?.color || element.color || "000000",
      bold: this.isBold(element.style?.fontWeight),
      italic: this.isItalic(element.style?.fontStyle),
      // marginは要素間隔なのでaddTextに渡さない（レイアウトエンジンで処理済み）
      // paddingのみをテキストフレーム内マージンとして適用
      margin: padding, // paddingをPowerPointのmarginに適用（4pxグリッドシステム廃止のため乗算なし）
      valign: "top" as const, // 縦位置を上揃えに設定
      fill: element.style?.backgroundColor ? { color: element.style.backgroundColor } : undefined, // 背景色設定（型定義に合わせてオブジェクト形式）
    };

    // shadowプロパティが指定されている場合は追加
    if (element.shadow) {
      textOptions.shadow = this.convertTextShadow(element.shadow);
    }

    this.currentSlide.addText(element.content, textOptions);
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
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);

    // レベルに応じたフォントサイズ
    const fontSizeMap: Record<number, number> = {
      1: 24,
      2: 20,
      3: 18,
      4: 16,
      5: 14,
      6: 12,
    };
    const level = element.level || 1;
    const fontSize = this.extractNumericValue(element.style?.fontSize) || this.extractNumericValue(element.fontSize) || fontSizeMap[level] || 16;
    const padding = this.extractNumericValue(element.style?.padding) || 0;

    const textOptions: any = {
      ...position,
      fontSize,
      fontFace: element.style?.fontFamily || element.fontFamily || "Arial",
      color: element.style?.color || element.color || "000000",
      bold: this.isBold(element.style?.fontWeight, true), // headingはデフォルトでbold
      italic: this.isItalic(element.style?.fontStyle),
      margin: padding, // paddingのみをPowerPointのmarginに適用（4pxグリッドシステム廃止のため乗算なし）
      valign: "top" as const, // 縦位置を上揃えに設定
      fill: element.style?.backgroundColor ? { color: element.style.backgroundColor } : undefined, // 背景色設定（型定義に合わせてオブジェクト形式）
    };

    // shadowプロパティが指定されている場合は追加
    if (element.shadow) {
      textOptions.shadow = this.convertTextShadow(element.shadow);
    }

    this.currentSlide.addText(element.content, textOptions);
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
    // ピクセル → インチ変換（72DPI想定）
    const PX_TO_INCH = 1 / 72;

    return {
      x: layoutResult.left * PX_TO_INCH,
      y: layoutResult.top * PX_TO_INCH,
      w: layoutResult.width * PX_TO_INCH,
      h: layoutResult.height * PX_TO_INCH,
    };
  }

  /**
   * PPTXファイルとして保存
   * @param filename ファイル名
   * @returns Promise
   */
  async save(filename: string): Promise<string> {
    try {
      const result = await this.pptx.writeFile({ fileName: filename });
      
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
  async getBuffer(): Promise<Buffer> {
    return this.pptx.write({ outputType: "nodebuffer" }) as Promise<Buffer>;
  }

  /**
   * 新しいスライドを追加
   * @returns 新しいSlideインスタンス
   */
  addSlide(): PptxGenJS.Slide {
    this.currentSlide = this.pptx.addSlide();
    return this.currentSlide;
  }

  /**
   * PPTXGenJSインスタンスを取得
   * @returns PPTXGenJSインスタンス
   */
  getPptx(): PptxGenJS {
    return this.pptx;
  }

  /**
   * fontWeight値がboldかどうかを判定
   * @param fontWeight フォントウェイト値（文字列、数値、boolean）
   * @param defaultValue デフォルト値
   * @returns bold かどうか
   */
  private isBold(fontWeight?: string | number | boolean, defaultValue: boolean = false): boolean {
    if (typeof fontWeight === 'boolean') {
      return fontWeight;
    }
    if (typeof fontWeight === 'string') {
      return fontWeight === 'bold' || fontWeight === 'bolder' || parseInt(fontWeight) >= 700;
    }
    if (typeof fontWeight === 'number') {
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
    if (typeof fontStyle === 'boolean') {
      return fontStyle;
    }
    if (typeof fontStyle === 'string') {
      return fontStyle === 'italic' || fontStyle === 'oblique';
    }
    return false;
  }

}
