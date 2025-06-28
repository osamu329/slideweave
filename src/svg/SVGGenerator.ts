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
  borderRadius?: number;
}

export class SVGGenerator {
  createSVG(width: number, height: number): string {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
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
    const { width, height, backgroundColor, borderRadius } = options;
    
    // Handle different color formats
    let fill = backgroundColor || 'none';
    if (backgroundColor && backgroundColor !== 'none') {
      if (backgroundColor.startsWith('rgba(') || backgroundColor.startsWith('rgb(')) {
        // RGBA/RGB format - use as-is
        fill = backgroundColor;
      } else if (!backgroundColor.startsWith('#')) {
        // Hex color without # prefix - add #
        fill = `#${backgroundColor}`;
      }
      // Colors that already start with # are used as-is
    }
    
    const rectOptions: RectOptions = {
      x: 0,
      y: 0,
      width,
      height,
      fill
    };

    if (borderRadius !== undefined) {
      rectOptions.rx = borderRadius;
      rectOptions.ry = borderRadius;
    }

    const rect = this.createRect(rectOptions);
    
    // Use viewBox instead of width/height to allow PPTXGenJS to respect addImage size
    return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${rect}</svg>`;
  }
}