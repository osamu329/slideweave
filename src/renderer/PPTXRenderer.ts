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
  FrameElement,
  ShapeElement,
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
      case "frame":
        this.renderFrame(layoutResult, element as FrameElement);
        break;
      case "shape":
        this.renderShape(layoutResult, element as ShapeElement);
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
  private renderFrame(layoutResult: LayoutResult, element: FrameElement): void {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    const style = element.style;

    // 背景色またはボーダーがある場合のみ描画
    if (style?.backgroundColor || style?.borderColor) {
      const shapeOptions: Record<string, unknown> = {
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
      };

      // 背景色設定
      if (style.backgroundColor) {
        shapeOptions.fill = { color: style.backgroundColor };
      } else {
        shapeOptions.fill = { type: "none" };
      }

      // ボーダー設定
      if (style.borderColor && style.borderWidth) {
        shapeOptions.line = {
          color: style.borderColor,
          width: style.borderWidth,
          dashType: style.borderStyle === "dashed" ? "dash" : "solid",
        };
      } else {
        shapeOptions.line = { type: "none" };
      }

      // 角丸設定（PowerPointではrectangleの場合のみ）
      const shapeType = (style as FrameElement['style'])?.borderRadius ? "roundRect" : "rect";
      this.currentSlide.addShape(shapeType as any, shapeOptions);
    }
  }

  /**
   * shapeをレンダリング（図形のみ）
   * @param layoutResult レイアウト結果
   * @param element shape要素
   */
  private renderShape(layoutResult: LayoutResult, element: ShapeElement): void {
    if (!this.currentSlide) return;

    const position = this.pixelsToInches(layoutResult);
    const style = element.style;

    const shapeOptions: Record<string, unknown> = {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
    };

    // 背景色設定
    if (style?.backgroundColor) {
      shapeOptions.fill = { color: style.backgroundColor };
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
      // marginは要素間隔なのでaddTextに渡さない（レイアウトエンジンで処理済み）
      // paddingのみをテキストフレーム内マージンとして適用
      margin: element.style?.padding !== undefined ? element.style.padding * 8 : 0, // paddingをPowerPointのmarginに適用
      valign: "top" as const, // 縦位置を上揃えに設定
      fill: element.style?.backgroundColor ? { color: element.style.backgroundColor } : undefined, // 背景色設定（型定義に合わせてオブジェクト形式）
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
      margin: element.style?.padding !== undefined ? element.style.padding * 8 : 0, // paddingのみをPowerPointのmarginに適用
      valign: "top" as const, // 縦位置を上揃えに設定
      fill: element.style?.backgroundColor ? { color: element.style.backgroundColor } : undefined, // 背景色設定（型定義に合わせてオブジェクト形式）
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

}
