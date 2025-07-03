/**
 * PPTXGenJSの薄いラッパー
 * SlideWeave固有の単位変換と型安全性を提供
 */

import PptxGenJS from "pptxgenjs";
import { DPIConverter } from "../utils/DPIConverter";
import { Pixels, Inches } from "../types/units";
import { LayoutResult } from "../layout/YogaLayoutEngine";

// SlideWeave用のオプション型定義
export interface SlideWeaveTextOptions {
  x: Inches;
  y: Inches;
  w: Inches;
  h: Inches;
  fontSize: Pixels; // SlideWeave内部ではpx
  fontFace?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  margin?: number; // padding値をmarginとして使用
  valign?: "top" | "middle" | "bottom";
  fill?: { color: string };
  shadow?: any;
}

export interface SlideWeaveShapeOptions {
  x: Inches;
  y: Inches;
  w: Inches;
  h: Inches;
  fill?: { color: string };
  line?: { color: string; width: number };
}

export interface SlideWeaveImageOptions {
  x: Inches;
  y: Inches;
  w?: Inches;
  h?: Inches;
  path?: string;
  data?: string;
  sizing?: string;
}

/**
 * PPTXGenJSの薄いラッパークラス
 */
export class PPTXWrapper {
  private pptx: PptxGenJS;
  private currentSlide: PptxGenJS.Slide | null = null;
  private dpiConverter: DPIConverter;

  constructor(dpi: number, slideWidthInch: Inches, slideHeightInch: Inches) {
    this.pptx = new PptxGenJS();
    this.dpiConverter = new DPIConverter(dpi);

    // スライドサイズ設定
    this.pptx.defineLayout({
      name: "SLIDEWEAVE_LAYOUT",
      width: slideWidthInch as number,
      height: slideHeightInch as number,
    });
    this.pptx.layout = "SLIDEWEAVE_LAYOUT";
  }

  /**
   * 新しいスライドを追加
   */
  addSlide(): void {
    this.currentSlide = this.pptx.addSlide();
  }

  /**
   * テキストを追加（SlideWeave単位系で）
   */
  addText(content: string, options: SlideWeaveTextOptions): void {
    if (!this.currentSlide) {
      throw new Error("スライドが初期化されていません");
    }

    const pptxOptions = {
      ...options,
      x: options.x as number,
      y: options.y as number,
      w: options.w as number,
      h: options.h as number,
      // フォントサイズをpx→pt変換
      fontSize: this.dpiConverter.pxToPt(options.fontSize) as number,
    };

    this.currentSlide.addText(content, pptxOptions);
  }

  /**
   * 図形を追加（SlideWeave単位系で）
   */
  addShape(type: string, options: SlideWeaveShapeOptions): void {
    if (!this.currentSlide) {
      throw new Error("スライドが初期化されていません");
    }

    const pptxOptions = {
      x: options.x as number,
      y: options.y as number,
      w: options.w as number,
      h: options.h as number,
      fill: options.fill,
      line: options.line,
    };

    this.currentSlide.addShape(type as any, pptxOptions);
  }

  /**
   * 画像を追加（SlideWeave単位系で）
   */
  addImage(options: SlideWeaveImageOptions): void {
    if (!this.currentSlide) {
      throw new Error("スライドが初期化されていません");
    }

    const pptxOptions: any = {
      x: options.x as number,
      y: options.y as number,
    };

    if (options.w !== undefined) pptxOptions.w = options.w as number;
    if (options.h !== undefined) pptxOptions.h = options.h as number;
    if (options.path) pptxOptions.path = options.path;
    if (options.data) pptxOptions.data = options.data;
    if (options.sizing) pptxOptions.sizing = options.sizing;

    this.currentSlide.addImage(pptxOptions);
  }

  /**
   * SVGを追加（SlideWeave単位系で）
   * SVG文字列をBase64変換してPowerPointに追加
   */
  addSVG(svg: string, options: { x: Inches, y: Inches, w: Inches, h: Inches }): void {
    if (!this.currentSlide) {
      throw new Error("スライドが初期化されていません");
    }

    // SVG→Base64変換をラッパー内で実行
    const svgBase64 = Buffer.from(svg).toString("base64");
    const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

    const pptxOptions = {
      x: options.x as number,
      y: options.y as number,
      w: options.w as number,
      h: options.h as number,
      data: dataUri
    };

    this.currentSlide.addImage(pptxOptions);
  }

  /**
   * 現在のスライドが存在するかチェック
   */
  hasCurrentSlide(): boolean {
    return this.currentSlide !== null;
  }

  /**
   * 現在のスライドに直接アクセス（背景設定など特殊な操作用）
   */
  getCurrentSlide(): any {
    return this.currentSlide;
  }

  /**
   * PowerPointファイルを書き出し
   */
  async writeFile(filename: string): Promise<string> {
    return this.pptx.writeFile({ fileName: filename });
  }

  /**
   * LayoutResultからSlideWeave座標系に変換
   */
  createPositionFromLayout(layoutResult: LayoutResult): {
    x: Inches;
    y: Inches;
    w: Inches;
    h: Inches;
  } {
    return {
      x: this.dpiConverter.pxToInch(layoutResult.left || (0 as any)),
      y: this.dpiConverter.pxToInch(layoutResult.top || (0 as any)),
      w: this.dpiConverter.pxToInch(layoutResult.width),
      h: this.dpiConverter.pxToInch(layoutResult.height),
    };
  }
}