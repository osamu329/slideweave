/**
 * PostCSS Border Shorthand Expand Plugin
 * border ショートハンドを border-width, border-style, border-color に分解
 */

import { Plugin } from "postcss";

interface BorderParts {
  width: string;
  style: string;
  color: string;
}

/**
 * border値をwidth, style, colorに分解
 * @param borderValue border shorthand value (例: "4px solid #dc2626")
 * @returns 分解されたborder要素
 */
function parseBorderValue(borderValue: string): BorderParts {
  const trimmed = borderValue.trim();
  
  // border: none の特別ケース
  if (trimmed === "none") {
    return {
      width: "0",
      style: "none", 
      color: "transparent"
    };
  }

  let width = "";
  let style = "";
  let color = "";

  // rgba/rgb の場合は特別処理
  const rgbaMatch = trimmed.match(/(rgba?\([^)]+\))/);
  if (rgbaMatch) {
    color = rgbaMatch[1];
    // rgba部分を除去してから他の要素を解析
    const withoutRgba = trimmed.replace(rgbaMatch[1], "").trim();
    const tokens = withoutRgba.split(/\s+/).filter(t => t);
    
    for (const token of tokens) {
      if (isWidth(token)) {
        width = token;
      } else if (isStyle(token)) {
        style = token;
      }
    }
  } else {
    // 通常のスペース区切り解析
    const tokens = trimmed.split(/\s+/);
    
    for (const token of tokens) {
      if (isWidth(token)) {
        width = token;
      } else if (isStyle(token)) {
        style = token;
      } else if (isColor(token)) {
        color = token;
      }
    }
  }

  // デフォルト値を設定
  return {
    width: width || "1px",
    style: style || "solid",
    color: color || "#000000"
  };
}

/**
 * トークンがwidthかどうかを判定
 */
function isWidth(token: string): boolean {
  return /^[\d.]+(?:px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)$/.test(token);
}

/**
 * トークンがstyleかどうかを判定  
 */
function isStyle(token: string): boolean {
  const styles = ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"];
  return styles.includes(token);
}

/**
 * トークンがcolorかどうかを判定
 */
function isColor(token: string): boolean {
  // 16進カラー (#xxx, #xxxxxx)
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(token)) {
    return true;
  }
  
  // rgb/rgba
  if (/^rgba?\(/.test(token)) {
    return true;
  }
  
  // 名前付きカラー（基本的なもの）
  const namedColors = [
    "black", "white", "red", "green", "blue", "yellow", "cyan", "magenta",
    "gray", "grey", "orange", "purple", "brown", "pink", "lime", "navy",
    "teal", "silver", "maroon", "olive", "aqua", "fuchsia"
  ];
  
  return namedColors.includes(token.toLowerCase());
}

/**
 * PostCSS Border Shorthand Expand Plugin
 */
export const borderShorthandExpand = (): Plugin => {
  return {
    postcssPlugin: "border-shorthand-expand",
    Declaration(decl) {
      // border プロパティのみを処理
      if (decl.prop === "border") {
        const borderParts = parseBorderValue(decl.value);
        
        // 元の宣言の前に新しい宣言を追加
        decl.cloneBefore({ prop: "border-width", value: borderParts.width });
        decl.cloneBefore({ prop: "border-style", value: borderParts.style });
        decl.cloneBefore({ prop: "border-color", value: borderParts.color });
        
        // 元のborder宣言を削除
        decl.remove();
      }
    }
  };
};

// PostCSS プラグイン名を設定
borderShorthandExpand.postcss = true;