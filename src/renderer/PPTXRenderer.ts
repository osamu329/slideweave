/**
 * SlideWeave PPTXレンダラー
 * レイアウト計算結果をPPTXGenJSオブジェクトに変換
 */

import PptxGenJS from "pptxgenjs";
import { LayoutResult, flattenLayout } from "../layout/LayoutEngine";
import {
  TextElement,
  HeadingElement,
  ContainerElement,
} from "../types/elements";

export interface PPTXRenderOptions {
  slideWidth?: number; // インチ
  slideHeight?: number; // インチ
  theme?: "light" | "dark";
}

export class PPTXRenderer {
  private pptx: PptxGenJS;
  private currentSlide: PptxGenJS.Slide | null = null;

  constructor(options: PPTXRenderOptions = {}) {
    this.pptx = new PptxGenJS();

    // スライドサイズ設定（デフォルト: 10x7.5インチ）
    this.pptx.defineLayout({
      name: "SLIDEWEAVE_LAYOUT",
      width: options.slideWidth || 10,
      height: options.slideHeight || 7.5,
    });
    this.pptx.layout = "SLIDEWEAVE_LAYOUT";
  }

  /**
   * レイアウト結果からPPTXファイルを生成
   * @param layoutResult レイアウト計算結果
   * @returns PPTXGenJS インスタンス
   */
  render(layoutResult: LayoutResult): PptxGenJS {
    // 新しいスライドを作成
    this.currentSlide = this.pptx.addSlide();

    // 相対座標を絶対座標に変換して平坦化
    const flatElements = flattenLayout(layoutResult);

    // 各要素を絶対座標でレンダリング
    flatElements.forEach((element) => {
      this.renderFlatElement(element);
    });

    return this.pptx;
  }

  /**
   * 平坦化された要素を絶対座標でレンダリング
   * @param layoutResult レイアウト結果（絶対座標）
   */
  private renderFlatElement(layoutResult: LayoutResult): void {
    if (!this.currentSlide) {
      throw new Error("スライドが初期化されていません");
    }

    const element = layoutResult.element;

    switch (element.type) {
      case "container":
        this.renderContainer(layoutResult, element as ContainerElement);
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
   * containerをレンダリング（背景色のみ）
   * @param layoutResult レイアウト結果
   * @param element container要素
   */
  private renderContainer(
    _layoutResult: LayoutResult,
    _element: ContainerElement,
  ): void {
    if (!this.currentSlide) return;

    // 一時的にコンテナの描画を無効化（テキスト位置をデバッグするため）
    // 背景色が設定されている場合のみ描画
    // if (element.style?.backgroundColor) {
    //   const position = this.pixelsToInches(layoutResult);
    //
    //   this.currentSlide.addShape('rect', {
    //     x: position.x,
    //     y: position.y,
    //     w: position.w,
    //     h: position.h,
    //     fill: { color: element.style.backgroundColor },
    //     line: { type: 'none' } // 境界線を完全に無効化
    //   });
    // }
  }

  /**
   * textをレンダリング
   * @param layoutResult レイアウト結果
   * @param element text要素
   */
  private renderText(layoutResult: LayoutResult, element: TextElement): void {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    const textOptions = {
      ...position,
      fontSize: element.fontSize || 12,
      fontFace: element.fontFamily || "Arial",
      color: element.color || "000000",
      bold: element.bold || false,
      italic: element.italic || false,
      margin: element.style?.margin !== undefined ? element.style.margin * 8 : 0,   // 指定されていない場合は0
      padding: element.style?.padding !== undefined ? element.style.padding * 8 : 0, // 指定されていない場合は0
      valign: "top" as const, // 縦位置を上揃えに明示的に設定
    };

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
    const fontSize = element.fontSize || fontSizeMap[level] || 16;

    const textOptions = {
      ...position,
      fontSize,
      fontFace: element.fontFamily || "Arial",
      color: element.color || "000000",
      bold: element.bold !== undefined ? element.bold : true, // headingはデフォルトでbold
      italic: element.italic || false,
      margin: element.style?.margin !== undefined ? element.style.margin * 8 : 0,   // 指定されていない場合は0
      padding: element.style?.padding !== undefined ? element.style.padding * 8 : 0, // 指定されていない場合は0
      valign: "top" as const, // 縦位置を上揃えに明示的に設定
    };

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
    return this.pptx.writeFile({ fileName: filename });
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
   * レイアウト名を設定
   * @param name レイアウト名
   */
  setLayout(name: string): void {
    (this.pptx as any).layout = name;
  }
}
