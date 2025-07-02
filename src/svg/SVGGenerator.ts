import {
  Background,
  LinearGradient,
  RadialGradient,
} from "../types/elements.js";
import sharp from "sharp";
import * as path from "path";
import { TempFileManager } from "../utils/TempFileManager.js";

export interface RectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  rx?: number;
  ry?: number;
}

export interface FrameSVGOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  background?: Background;
  borderRadius?: string; // "12px"形式の文字列のみ
  glassEffect?: boolean; // ガラス風効果を有効化
  backgroundBlur?: BackgroundBlurOptions; // 背景画像ブラー効果
}

export interface BackgroundBlurOptions {
  backgroundImagePath?: string; // 背景画像のファイルパス（オプション）
  backgroundColor?: string; // 背景色（画像がない場合）
  frameX: number; // フレームのX座標（ピクセル）
  frameY: number; // フレームのY座標（ピクセル）
  frameWidth: number; // フレームの幅（ピクセル）
  frameHeight: number; // フレームの高さ（ピクセル）
  slideWidth: number; // スライドの幅（ピクセル）
  slideHeight: number; // スライドの高さ（ピクセル）
  borderRadius?: string; // "16px"形式のborderRadius
  blurStrength?: number; // ブラー強度（デフォルト: 5）
  quality?: number; // 画質（デフォルト: 80）
}

export class SVGGenerator {
  private gradientId = 0;

  /**
   * 背景画像をクロップしてブラー処理を適用し、ファイルとして保存
   * @returns 保存されたファイルのパス（相対パス）
   */
  async processBackgroundBlur(options: BackgroundBlurOptions): Promise<string> {
    const {
      backgroundImagePath,
      backgroundColor,
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      slideWidth,
      slideHeight,
      blurStrength = 5,
      quality = 80,
    } = options;

    try {
      // 座標の検証
      const validLeft = Math.max(0, Math.floor(frameX));
      const validTop = Math.max(0, Math.floor(frameY));
      const validWidth = Math.min(
        Math.floor(frameWidth),
        slideWidth - validLeft,
      );
      const validHeight = Math.min(
        Math.floor(frameHeight),
        slideHeight - validTop,
      );

      let backgroundBuffer: Buffer;

      if (backgroundImagePath) {
        // 背景画像を読み込み、スライドサイズにリサイズ
        backgroundBuffer = await sharp(backgroundImagePath)
          .resize(slideWidth, slideHeight, { fit: "cover" })
          .toBuffer();
      } else if (backgroundColor) {
        // 背景色で塗りつぶした画像を生成
        const color = backgroundColor.startsWith("#")
          ? backgroundColor
          : `#${backgroundColor}`;
        backgroundBuffer = await sharp({
          create: {
            width: slideWidth,
            height: slideHeight,
            channels: 3,
            background: color,
          },
        })
          .png()
          .toBuffer();
      } else {
        console.warn("No background image or color provided for blur effect");
        return "";
      }

      // 先にブラーを適用してからクロップ（角の問題を解決）
      const blurredBackground = await sharp(backgroundBuffer)
        .blur(blurStrength)
        .toBuffer();

      // ブラー後にクロップ
      let croppedBlurred = await sharp(blurredBackground)
        .extract({
          left: validLeft,
          top: validTop,
          width: validWidth,
          height: validHeight,
        })
        .toBuffer();

      // borderRadiusが指定されている場合、角を丸くマスク
      if (options.borderRadius) {
        const radius = this.parseBorderRadius(
          options.borderRadius,
          validWidth,
          validHeight,
        );
        if (radius > 0) {
          // SVGマスクを作成
          const maskSvg = `
            <svg width="${validWidth}" height="${validHeight}">
              <rect width="${validWidth}" height="${validHeight}" rx="${radius}" ry="${radius}" fill="white"/>
            </svg>
          `;

          // マスクを適用してrounded borderを実現
          croppedBlurred = await sharp(croppedBlurred)
            .composite([
              {
                input: Buffer.from(maskSvg),
                blend: "dest-in",
              },
            ])
            .png()
            .toBuffer();
        }
      }

      // ユニークなファイル名を生成（タイムスタンプとハッシュベース）
      const timestamp = Date.now();
      const hash = Math.random().toString(36).substring(2, 8);
      const filename = `blur-${timestamp}-${hash}.png`;
      const tempDir = TempFileManager.getInstance().getTempDir();
      const filePath = path.join(tempDir, filename);

      // PNG形式でファイルに保存（Web互換性のため）
      await sharp(croppedBlurred)
        .png({ quality: Math.round(quality * 0.9) }) // PNGの場合は品質を少し調整
        .toFile(filePath);

      // 一時ファイルとして登録（後でクリーンアップ）
      TempFileManager.getInstance().registerTempFile(filePath);

      // 絶対パスを返す（PPTXRendererで直接使用）
      return filePath;
    } catch (error) {
      console.warn("Background blur processing failed:", error);
      return "";
    }
  }

  /**
   * borderRadiusをピクセル値に変換し、要素サイズでクランプ
   */
  private parseBorderRadius(
    borderRadius: string | undefined,
    width: number,
    height: number,
  ): number {
    if (borderRadius === undefined) return 0;

    // "12px" -> 12
    const radiusValue = parseFloat(borderRadius.replace("px", ""));

    // 要素の半分以下にクランプ
    const maxRadius = Math.min(width, height) / 2;
    return Math.min(radiusValue, maxRadius);
  }

  createSVG(width: number, height: number): string {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
  }

  private createLinearGradient(gradient: LinearGradient): {
    id: string;
    def: string;
  } {
    const id = `grad${++this.gradientId}`;

    // Parse direction
    let x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0;
    if (gradient.direction === "to right") {
      x2 = 100;
    } else if (gradient.direction === "to left") {
      x1 = 100;
    } else if (gradient.direction === "to bottom") {
      y2 = 100;
    } else if (gradient.direction === "to top") {
      y1 = 100;
    } else if (gradient.direction.includes("deg")) {
      // Parse angle (e.g., "45deg")
      const angle = parseFloat(gradient.direction.replace("deg", ""));
      const rad = (angle * Math.PI) / 180;
      x2 = Math.cos(rad) * 100;
      y2 = Math.sin(rad) * 100;
    }

    const stops = gradient.stops
      .map(
        (stop) =>
          `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}" />`,
      )
      .join("");

    const def = `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" gradientUnits="objectBoundingBox">${stops}</linearGradient>`;

    return { id, def };
  }

  private createRadialGradient(gradient: RadialGradient): {
    id: string;
    def: string;
  } {
    const id = `grad${++this.gradientId}`;

    const stops = gradient.stops
      .map(
        (stop) =>
          `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}" />`,
      )
      .join("");

    const def = `<radialGradient id="${id}" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">${stops}</radialGradient>`;

    return { id, def };
  }

  createRect(options: RectOptions): string {
    const attrs = [
      `x="${options.x}"`,
      `y="${options.y}"`,
      `width="${options.width}"`,
      `height="${options.height}"`,
    ];

    if (options.fill !== undefined) {
      attrs.push(`fill="${options.fill}"`);
    }

    if (options.rx !== undefined) {
      attrs.push(`rx="${options.rx}"`);
    }

    if (options.ry !== undefined) {
      attrs.push(`ry="${options.ry}"`);
    }

    return `<rect ${attrs.join(" ")} />`;
  }

  async generateFrameSVG(options: FrameSVGOptions): Promise<string> {
    const {
      width,
      height,
      backgroundColor,
      background,
      borderRadius,
      glassEffect,
    } = options;

    let fill = "none";
    let gradientDefs = "";

    // Priority: background > backgroundColor
    if (background) {
      if (typeof background === "string") {
        // String background color
        fill = background.startsWith("#") ? background : `#${background}`;
      } else if (background.type === "linearGradient") {
        const { id, def } = this.createLinearGradient(background);
        fill = `url(#${id})`;
        gradientDefs = def;
      } else if (background.type === "radialGradient") {
        const { id, def } = this.createRadialGradient(background);
        fill = `url(#${id})`;
        gradientDefs = def;
      }
    } else if (backgroundColor) {
      // Fallback to backgroundColor
      if (
        backgroundColor.startsWith("rgba(") ||
        backgroundColor.startsWith("rgb(")
      ) {
        // PPTXGenJSはrgba()をサポートしないため、16進数色に変換が必要
        // しかし、ここでは単純に透明度情報を失わないよう処理を変更
        console.warn(
          "rgba/rgb colors in SVG may not render correctly in PowerPoint",
        );
        fill = backgroundColor;
      } else if (!backgroundColor.startsWith("#")) {
        fill = `#${backgroundColor}`;
      } else {
        fill = backgroundColor;
      }
    }

    const rectOptions: RectOptions = {
      x: 0,
      y: 0,
      width,
      height,
      fill,
    };

    if (borderRadius !== undefined) {
      const radius = this.parseBorderRadius(borderRadius, width, height);
      rectOptions.rx = radius;
      rectOptions.ry = radius;
    }

    let rect = this.createRect(rectOptions);
    let filters = "";
    let glassElements = "";
    const backgroundBlurElement = "";

    // 背景画像ブラー処理はPPTXRendererで別レイヤーとして処理するため、SVGには含めない

    // ガラス風効果を適用
    if (glassEffect) {
      const glassResult = this.createGlassEffect(width, height, borderRadius);
      rect = glassResult.baseRect;
      filters = glassResult.filters;
      glassElements = glassResult.elements;
      gradientDefs += glassResult.gradients;
    } else if (fill === "none" && glassEffect === false) {
      // 通常のフレームで背景色が指定されていない場合は透明にする
      rectOptions.fill = "transparent";
      rect = this.createRect(rectOptions);
    }

    // Include gradient definitions and filters if needed
    const defs =
      gradientDefs || filters ? `<defs>${gradientDefs}${filters}</defs>` : "";

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${defs}${backgroundBlurElement}${rect}${glassElements}</svg>`;
  }

  /**
   * ガラス風効果を生成 - docs/glass-effect.md準拠の現代的なマット仕上げ
   */
  private createGlassEffect(
    width: number,
    height: number,
    borderRadius?: string,
  ): {
    baseRect: string;
    filters: string;
    elements: string;
    gradients: string;
  } {
    const glassGradId = `glassGrad${++this.gradientId}`;
    const outerBorderGradId = `outerBorder${this.gradientId}`;
    const innerBorderGradId = `innerBorder${this.gradientId}`;

    const radius = this.parseBorderRadius(borderRadius, width, height);

    // フィルターは使用しない（マットな質感重視）
    const filters = "";

    // マットなガラス効果用グラデーション（透明度0.1-0.25範囲）
    const gradients = `
      <linearGradient id="${glassGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />
      </linearGradient>
      <linearGradient id="${outerBorderGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2" />
      </linearGradient>
      <linearGradient id="${innerBorderGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />
      </linearGradient>
    `;

    // メインガラスパネル（二重ボーダー）
    const baseRect = `<rect x="0" y="0" width="${width}" height="${height}" 
      fill="url(#${glassGradId})" 
      stroke="url(#${outerBorderGradId})" 
      stroke-width="2"
      ${radius > 0 ? `rx="${radius}" ry="${radius}"` : ""} />`;

    // 内側ボーダー（立体感演出）
    const innerStrokeWidth = 1;
    const innerOffset = 1; // 外側ボーダーとの間隔
    const elements = `
      <rect x="${innerOffset}" y="${innerOffset}" 
        width="${width - innerOffset * 2}" height="${height - innerOffset * 2}" 
        fill="none" 
        stroke="url(#${innerBorderGradId})" 
        stroke-width="${innerStrokeWidth}"
        ${radius > 0 ? `rx="${Math.max(radius - innerOffset, 0)}" ry="${Math.max(radius - innerOffset, 0)}"` : ""} />
    `;

    return {
      baseRect,
      filters,
      elements,
      gradients,
    };
  }
}
