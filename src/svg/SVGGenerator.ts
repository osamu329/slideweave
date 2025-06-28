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
    const { width, height, backgroundColor, background, borderRadius } = options;
    
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

    const rect = this.createRect(rectOptions);
    
    // Include gradient definitions if needed
    const defs = gradientDefs ? `<defs>${gradientDefs}</defs>` : '';
    
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${defs}${rect}</svg>`;
  }
}