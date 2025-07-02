/**
 * JSX関連ユーティリティ関数
 * プロパティ変換、CSS処理等の機能を提供
 */

import type { BaseStyle } from "../types/elements";

/**
 * React仕様に準拠した、無次元数値を自動的にpx単位に変換するプロパティリスト
 * これらのプロパティは数値が指定された場合、自動的に'px'を付与する
 */
const PX_PROPERTIES: Set<string> = new Set([
  // 寸法系
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",

  // スペーシング系
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",

  // 位置系
  "top",
  "right",
  "bottom",
  "left",

  // ボーダー系
  "borderWidth",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",

  // フォント系
  "fontSize",
  "letterSpacing",
  "wordSpacing",

  // レイアウト系
  "gap",
  "rowGap",
  "columnGap",

  // その他
  "strokeWidth",
  "outlineWidth",
  "outlineOffset",
]);

/**
 * 無次元数値のまま保持すべきプロパティリスト（React準拠）
 * これらのプロパティは数値が指定されても単位を付与しない
 */
const UNITLESS_PROPERTIES: Set<string> = new Set([
  "opacity",
  "zIndex",
  "fontWeight",
  "lineHeight",
  "zoom",
  "order",
  "flex",
  "flexGrow",
  "flexShrink",
  "flexOrder",
  "gridArea",
  "gridRow",
  "gridRowStart",
  "gridRowEnd",
  "gridColumn",
  "gridColumnStart",
  "gridColumnEnd",
  "tabSize",
  "columnCount",
  "fillOpacity",
  "strokeOpacity",
]);

/**
 * CSS色名を16進数カラーコードに変換するマッピング
 * PowerPoint互換性のため、色名は16進数に変換する
 */
const COLOR_NAME_TO_HEX: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  gray: "#808080",
  grey: "#808080",
  silver: "#c0c0c0",
  maroon: "#800000",
  olive: "#808000",
  lime: "#00ff00",
  aqua: "#00ffff",
  teal: "#008080",
  navy: "#000080",
  fuchsia: "#ff00ff",
  purple: "#800080",
};

/**
 * kebab-case → camelCase変換
 */
export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * camelCase → kebab-case変換
 */
export function camelToKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * CSS文字列をオブジェクトに変換
 * 例: "font-size: 16px; color: red;" → { fontSize: '16px', color: 'red' }
 */
export function parseCSSString(cssString: string): Record<string, any> {
  const result: Record<string, any> = {};

  // CSS文字列を行ごとに分割
  const declarations = cssString
    .split(";")
    .map((decl) => decl.trim())
    .filter((decl) => decl.length > 0);

  for (const declaration of declarations) {
    const colonIndex = declaration.indexOf(":");
    if (colonIndex === -1) continue;

    const property = declaration.slice(0, colonIndex).trim();
    const value = declaration.slice(colonIndex + 1).trim();

    // kebab-case → camelCase変換
    const camelProperty = kebabToCamelCase(property);

    // 数値の場合は変換（pxなど単位付きは文字列のまま）
    result[camelProperty] = parseValue(value);
  }

  return result;
}

/**
 * CSS値のパース（文字列から適切な型に変換）
 */
function parseValue(value: string): any {
  // 数値のみの場合は数値に変換
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }

  // 小数点を含む数値の場合
  if (/^\d+\.\d+$/.test(value)) {
    return parseFloat(value);
  }

  // その他は文字列のまま
  return value;
}

/**
 * JSXプロパティを変換
 * - kebab-case → camelCase変換
 * - CSS文字列/オブジェクト両形式のstyle対応
 * - className の処理（CSSクラス対応）
 */
export function transformProps(props: any): any {
  if (!props || typeof props !== "object") {
    return {};
  }

  const result: any = {};

  for (const [key, value] of Object.entries(props)) {
    // style プロパティの特別処理
    if (key === "style") {
      if (typeof value === "string") {
        // CSS文字列の場合はオブジェクトに変換してから正規化
        const parsedStyle = parseCSSString(value);
        result.style = transformStyleObject(parsedStyle);
      } else if (typeof value === "object" && value !== null) {
        // オブジェクトの場合はそのまま（ただしkebab-caseキーがあれば変換）
        result.style = transformStyleObject(value);
      }
      continue;
    }

    // className プロパティの処理
    if (key === "className") {
      result.class = value;
      // スタイル解決はSlideDataLoader側のCSSStylesheetParserに任せる
      continue;
    }

    // その他のプロパティはkebab-case → camelCase変換
    const camelKey = kebabToCamelCase(key);
    result[camelKey] = value;
  }

  return result;
}

/**
 * スタイルオブジェクト内のキーをkebab-case → camelCaseに変換し、
 * React仕様に準拠した値の正規化を行う
 */
function transformStyleObject(styleObj: any): BaseStyle {
  const result: any = {};

  for (const [key, value] of Object.entries(styleObj)) {
    const camelKey = kebabToCamelCase(key);
    result[camelKey] = normalizeStyleValue(camelKey, value);
  }

  return result as BaseStyle;
}

/**
 * スタイル値をReact仕様に準拠して正規化
 * - 無次元数値の自動px変換
 * - 色名の16進数変換
 * - 既に単位付きの値はそのまま保持
 */
function normalizeStyleValue(property: string, value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  // 数値の場合の処理
  if (typeof value === "number") {
    // 無次元のまま保持すべきプロパティの場合
    if (UNITLESS_PROPERTIES.has(property)) {
      return value;
    }

    // px変換対象プロパティの場合
    if (PX_PROPERTIES.has(property)) {
      return `${value}px`;
    }

    // その他の数値プロパティもpx変換（React標準動作）
    return `${value}px`;
  }

  // 文字列の場合の処理
  if (typeof value === "string") {
    // 色関連プロパティの色名変換
    if (isColorProperty(property) && COLOR_NAME_TO_HEX[value.toLowerCase()]) {
      return COLOR_NAME_TO_HEX[value.toLowerCase()];
    }

    // 既に単位付きまたは特殊値の場合はそのまま
    return value;
  }

  // その他の型はそのまま
  return value;
}

/**
 * プロパティが色関連かどうかを判定
 */
function isColorProperty(property: string): boolean {
  const colorProperties = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "textDecorationColor",
    "caretColor",
  ];

  return colorProperties.includes(property);
}
