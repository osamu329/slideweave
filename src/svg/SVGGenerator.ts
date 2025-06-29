import { Background, LinearGradient, RadialGradient } from '../types/elements.js';

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
  borderRadius?: string;  // "12px"形式の文字列のみ
  glassEffect?: boolean;  // ガラス風効果を有効化
}

export class SVGGenerator {
  private gradientId = 0;

  /**
   * borderRadiusをピクセル値に変換し、要素サイズでクランプ
   */
  private parseBorderRadius(borderRadius: string | undefined, width: number, height: number): number {
    if (borderRadius === undefined) return 0;
    
    // "12px" -> 12
    const radiusValue = parseFloat(borderRadius.replace('px', ''));
    
    // 要素の半分以下にクランプ
    const maxRadius = Math.min(width, height) / 2;
    return Math.min(radiusValue, maxRadius);
  }

  createSVG(width: number, height: number): string {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
  }

  private createLinearGradient(gradient: LinearGradient): { id: string; def: string } {
    const id = `grad${++this.gradientId}`;
    
    // Parse direction
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    if (gradient.direction === 'to right') {
      x2 = 100;
    } else if (gradient.direction === 'to left') {
      x1 = 100;
    } else if (gradient.direction === 'to bottom') {
      y2 = 100;
    } else if (gradient.direction === 'to top') {
      y1 = 100;
    } else if (gradient.direction.includes('deg')) {
      // Parse angle (e.g., "45deg")
      const angle = parseFloat(gradient.direction.replace('deg', ''));
      const rad = (angle * Math.PI) / 180;
      x2 = Math.cos(rad) * 100;
      y2 = Math.sin(rad) * 100;
    }

    const stops = gradient.stops
      .map(stop => `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}" />`)
      .join('');

    const def = `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" gradientUnits="objectBoundingBox">${stops}</linearGradient>`;
    
    return { id, def };
  }

  private createRadialGradient(gradient: RadialGradient): { id: string; def: string } {
    const id = `grad${++this.gradientId}`;
    
    const stops = gradient.stops
      .map(stop => `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}" />`)
      .join('');

    const def = `<radialGradient id="${id}" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">${stops}</radialGradient>`;
    
    return { id, def };
  }

  createRect(options: RectOptions): string {
    const attrs = [
      `x="${options.x}"`,
      `y="${options.y}"`,
      `width="${options.width}"`,
      `height="${options.height}"`
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

    return `<rect ${attrs.join(' ')} />`;
  }

  generateFrameSVG(options: FrameSVGOptions): string {
    const { width, height, backgroundColor, background, borderRadius, glassEffect } = options;
    
    let fill = 'none';
    let gradientDefs = '';
    
    // Priority: background > backgroundColor
    if (background) {
      if (typeof background === 'string') {
        // String background color
        fill = background.startsWith('#') ? background : `#${background}`;
      } else if (background.type === 'linearGradient') {
        const { id, def } = this.createLinearGradient(background);
        fill = `url(#${id})`;
        gradientDefs = def;
      } else if (background.type === 'radialGradient') {
        const { id, def } = this.createRadialGradient(background);
        fill = `url(#${id})`;
        gradientDefs = def;
      }
    } else if (backgroundColor) {
      // Fallback to backgroundColor
      if (backgroundColor.startsWith('rgba(') || backgroundColor.startsWith('rgb(')) {
        // PPTXGenJSはrgba()をサポートしないため、16進数色に変換が必要
        // しかし、ここでは単純に透明度情報を失わないよう処理を変更
        console.warn('rgba/rgb colors in SVG may not render correctly in PowerPoint');
        fill = backgroundColor;
      } else if (!backgroundColor.startsWith('#')) {
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
      fill
    };

    if (borderRadius !== undefined) {
      const radius = this.parseBorderRadius(borderRadius, width, height);
      rectOptions.rx = radius;
      rectOptions.ry = radius;
    }

    let rect = this.createRect(rectOptions);
    let filters = '';
    let glassElements = '';
    
    // ガラス風効果を適用
    if (glassEffect) {
      const glassResult = this.createGlassEffect(width, height, borderRadius);
      rect = glassResult.baseRect;
      filters = glassResult.filters;
      glassElements = glassResult.elements;
      gradientDefs += glassResult.gradients;
    } else if (fill === 'none' && glassEffect === false) {
      // 通常のフレームで背景色が指定されていない場合は透明にする
      rectOptions.fill = 'transparent';
      rect = this.createRect(rectOptions);
    }
    
    // Include gradient definitions and filters if needed
    const defs = (gradientDefs || filters) ? `<defs>${gradientDefs}${filters}</defs>` : '';
    
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${defs}${rect}${glassElements}</svg>`;
  }

  /**
   * ガラス風効果を生成 - examples/glass.svgベース
   */
  private createGlassEffect(width: number, height: number, borderRadius?: string): {
    baseRect: string;
    filters: string;
    elements: string;
    gradients: string;
  } {
    const filterId = `glow${++this.gradientId}`;
    const glassGradId = `glassGrad${this.gradientId}`;
    const reflectionId = `reflection${this.gradientId}`;
    const borderGradId = `borderGrad${this.gradientId}`;
    
    const radius = this.parseBorderRadius(borderRadius, width, height);
    
    // グロー効果フィルター（examples/glass.svgベース）
    const filters = `
      <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;

    // ガラス効果用グラデーション（examples/glass.svgベース、stop-opacity使用）
    const gradients = `
      <linearGradient id="${glassGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>
      <linearGradient id="${reflectionId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="30%" stop-color="#ffffff" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="${borderGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2" />
      </linearGradient>
    `;

    // メインガラスパネル（examples/glass.svgベース）
    const baseRect = `<rect x="0" y="0" width="${width}" height="${height}" 
      fill="url(#${glassGradId})" 
      stroke="url(#${borderGradId})" 
      stroke-width="1.5"
      ${radius > 0 ? `rx="${radius}" ry="${radius}"` : ''}
      filter="url(#${filterId})" />`;

    // 反射ハイライト（左上部分、サイズ調整）
    const reflectionWidth = width * 0.4;
    const reflectionHeight = height * 0.4;
    const reflectionX = width * 0.02; // 全体の2%位置
    const reflectionY = height * 0.02; // 全体の2%位置
    const reflectionRadius = Math.max(radius * 0.75, 0); // 元の75%のサイズ

    const elements = `
      <rect x="${reflectionX}" y="${reflectionY}" 
        width="${reflectionWidth}" height="${reflectionHeight}" 
        ${reflectionRadius > 0 ? `rx="${reflectionRadius}" ry="${reflectionRadius}"` : ''}
        fill="url(#${reflectionId})"
        opacity="0.8" />
    `;

    return {
      baseRect,
      filters,
      elements,
      gradients
    };
  }
}