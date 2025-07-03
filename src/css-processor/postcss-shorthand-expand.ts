/**
 * PostCSS Shorthand Expand Plugin
 * CSS ショートハンドプロパティを個別プロパティに分解する統合プラグイン
 */

import { Plugin } from "postcss";

interface BorderParts {
  width: string;
  style: string;
  color: string;
}

interface FlexFlowParts {
  direction: string;
  wrap: string;
}

interface FlexParts {
  grow: string;
  shrink: string;
  basis: string;
}

interface GapParts {
  row: string;
  column: string;
}

interface InsetParts {
  top: string;
  right: string;
  bottom: string;
  left: string;
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
 * flex-flow値をflex-direction, flex-wrapに分解
 * @param flexFlowValue flex-flow shorthand value (例: "row wrap", "column-reverse nowrap")
 * @returns 分解されたflex-flow要素
 */
function parseFlexFlowValue(flexFlowValue: string): FlexFlowParts {
  const trimmed = flexFlowValue.trim();
  const tokens = trimmed.split(/\s+/);
  
  let direction = "";
  let wrap = "";
  
  const validDirections = ["row", "column", "row-reverse", "column-reverse"];
  const validWraps = ["nowrap", "wrap", "wrap-reverse"];
  
  for (const token of tokens) {
    if (validDirections.includes(token)) {
      direction = token;
    } else if (validWraps.includes(token)) {
      wrap = token;
    }
  }
  
  // デフォルト値を設定
  return {
    direction: direction || "row",
    wrap: wrap || "nowrap"
  };
}

/**
 * flex値をflex-grow, flex-shrink, flex-basisに分解
 * @param flexValue flex shorthand value (例: "1", "1 1 auto", "none", "auto")
 * @returns 分解されたflex要素
 */
function parseFlexValue(flexValue: string): FlexParts {
  const trimmed = flexValue.trim();
  
  // 特別なキーワード
  if (trimmed === "none") {
    return {
      grow: "0",
      shrink: "0", 
      basis: "auto"
    };
  }
  
  if (trimmed === "auto") {
    return {
      grow: "1",
      shrink: "1",
      basis: "auto"
    };
  }
  
  if (trimmed === "initial") {
    return {
      grow: "0",
      shrink: "1",
      basis: "auto"
    };
  }
  
  const tokens = trimmed.split(/\s+/);
  let grow = "";
  let shrink = "";
  let basis = "";
  
  // トークンを解析
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (isFlexBasisValue(token)) {
      basis = token;
    } else if (isNumber(token)) {
      if (!grow) {
        grow = token;
      } else if (!shrink) {
        shrink = token;
      }
    }
  }
  
  // デフォルト値を設定
  // flex: 1 の場合は flex: 1 1 0% と同等
  if (tokens.length === 1 && isNumber(tokens[0])) {
    return {
      grow: tokens[0],
      shrink: "1",
      basis: "0%"
    };
  }
  
  return {
    grow: grow || "0",
    shrink: shrink || "1", 
    basis: basis || "auto"
  };
}

/**
 * トークンがflex-basisの値かどうかを判定
 */
function isFlexBasisValue(token: string): boolean {
  // auto, content, max-content, min-content
  if (["auto", "content", "max-content", "min-content"].includes(token)) {
    return true;
  }
  
  // サイズ単位 (px, %, em, etc.)
  return /^[\d.]+(?:px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)$/.test(token);
}

/**
 * トークンが数値かどうかを判定
 */
function isNumber(token: string): boolean {
  return /^[\d.]+$/.test(token);
}

/**
 * gap値をrow-gap, column-gapに分解
 * @param gapValue gap shorthand value (例: "10px", "10px 20px", "16% 20%")
 * @returns 分解されたgap要素
 */
function parseGapValue(gapValue: string): GapParts {
  const trimmed = gapValue.trim();
  const tokens = trimmed.split(/\s+/);
  
  if (tokens.length === 1) {
    // gap: 10px の場合 - 行・列両方に同じ値
    return {
      row: tokens[0],
      column: tokens[0]
    };
  } else if (tokens.length === 2) {
    // gap: 10px 20px の場合 - rowGap columnGap の順
    return {
      row: tokens[0],
      column: tokens[1]
    };
  }
  
  // フォールバック
  return {
    row: tokens[0] || "0",
    column: tokens[1] || tokens[0] || "0"
  };
}

/**
 * inset値をtop, right, bottom, leftに分解
 * @param insetValue inset shorthand value (例: "10px", "10px 20px", "10px 20px 30px", "10px 20px 30px 40px")
 * @returns 分解されたinset要素
 */
function parseInsetValue(insetValue: string): InsetParts {
  const trimmed = insetValue.trim();
  const tokens = trimmed.split(/\s+/);
  
  switch (tokens.length) {
    case 1:
      // inset: 10px → 全方向に同じ値
      return {
        top: tokens[0],
        right: tokens[0],
        bottom: tokens[0],
        left: tokens[0]
      };
    case 2:
      // inset: 10px 20px → top/bottom: 10px, left/right: 20px
      return {
        top: tokens[0],
        right: tokens[1],
        bottom: tokens[0],
        left: tokens[1]
      };
    case 3:
      // inset: 10px 20px 30px → top: 10px, left/right: 20px, bottom: 30px
      return {
        top: tokens[0],
        right: tokens[1],
        bottom: tokens[2],
        left: tokens[1]
      };
    case 4:
      // inset: 10px 20px 30px 40px → top, right, bottom, left の順
      return {
        top: tokens[0],
        right: tokens[1],
        bottom: tokens[2],
        left: tokens[3]
      };
    default:
      // フォールバック
      return {
        top: tokens[0] || "0",
        right: tokens[1] || tokens[0] || "0",
        bottom: tokens[2] || tokens[0] || "0",
        left: tokens[3] || tokens[1] || tokens[0] || "0"
      };
  }
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
 * PostCSS Shorthand Expand Plugin
 * 複数のショートハンドプロパティを処理
 */
export const shorthandExpand = (): Plugin => {
  return {
    postcssPlugin: "shorthand-expand",
    Declaration(decl) {
      // border プロパティの処理
      if (decl.prop === "border") {
        const borderParts = parseBorderValue(decl.value);
        
        // 元の宣言の前に新しい宣言を追加
        decl.cloneBefore({ prop: "border-width", value: borderParts.width });
        decl.cloneBefore({ prop: "border-style", value: borderParts.style });
        decl.cloneBefore({ prop: "border-color", value: borderParts.color });
        
        // 元のborder宣言を削除
        decl.remove();
      }
      
      // flex-flow プロパティの処理
      if (decl.prop === "flex-flow") {
        const flexFlowParts = parseFlexFlowValue(decl.value);
        
        // 元の宣言の前に新しい宣言を追加
        decl.cloneBefore({ prop: "flex-direction", value: flexFlowParts.direction });
        decl.cloneBefore({ prop: "flex-wrap", value: flexFlowParts.wrap });
        
        // 元のflex-flow宣言を削除
        decl.remove();
      }
      
      // flex プロパティの処理
      if (decl.prop === "flex") {
        const flexParts = parseFlexValue(decl.value);
        
        // 元の宣言の前に新しい宣言を追加
        decl.cloneBefore({ prop: "flex-grow", value: flexParts.grow });
        decl.cloneBefore({ prop: "flex-shrink", value: flexParts.shrink });
        decl.cloneBefore({ prop: "flex-basis", value: flexParts.basis });
        
        // 元のflex宣言を削除
        decl.remove();
      }
      
      // gap プロパティの処理（複数値のみ）
      if (decl.prop === "gap" && decl.value.trim().split(/\s+/).length > 1) {
        const gapParts = parseGapValue(decl.value);
        
        // 元の宣言の前に新しい宣言を追加
        decl.cloneBefore({ prop: "row-gap", value: gapParts.row });
        decl.cloneBefore({ prop: "column-gap", value: gapParts.column });
        
        // 元のgap宣言を削除
        decl.remove();
      }
      
      // inset プロパティの処理
      if (decl.prop === "inset") {
        const insetParts = parseInsetValue(decl.value);
        
        // 元の宣言の前に新しい宣言を追加
        decl.cloneBefore({ prop: "top", value: insetParts.top });
        decl.cloneBefore({ prop: "right", value: insetParts.right });
        decl.cloneBefore({ prop: "bottom", value: insetParts.bottom });
        decl.cloneBefore({ prop: "left", value: insetParts.left });
        
        // 元のinset宣言を削除
        decl.remove();
      }
    }
  };
};

// PostCSS プラグイン名を設定
shorthandExpand.postcss = true;