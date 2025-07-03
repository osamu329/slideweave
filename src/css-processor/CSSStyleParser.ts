/**
 * PostCSSを使用したCSS文字列パーサー
 * CSS文字列をSlideWeaveのスタイルオブジェクトに変換
 */

import postcss from "postcss";
import valueParser from "postcss-value-parser";

export interface ParsedStyle {
  [key: string]: string | number;
}

export class CSSStyleParser {
  /**
   * CSS文字列をパースしてスタイルオブジェクトに変換
   * @param cssString CSS文字列 (例: "font-size: 14pt; margin: 8")
   * @returns パース済みスタイルオブジェクト
   */
  static parse(cssString: string): ParsedStyle {
    const result: ParsedStyle = {};

    if (!cssString || cssString.trim() === "") {
      return result;
    }

    // CSS文字列を疑似的なCSSルールでラップ
    const wrappedCSS = `.dummy { ${cssString} }`;

    try {
      // PostCSSでパース
      const root = postcss.parse(wrappedCSS);
      const rule = root.first;

      if (rule && rule.type === "rule") {
        rule.each((decl) => {
          if (decl.type === "decl") {
            const prop = decl.prop;
            const value = decl.value;

            // プロパティ名をキャメルケースに変換
            const camelCaseProp = this.toCamelCase(prop);

            // 値をパースして適切な型に変換
            const parsedValue = this.parseValue(value, prop);

            result[camelCaseProp] = parsedValue;
          }
        });
      }
    } catch (error) {
      console.warn("CSS parsing error:", error);
      // エラー時は簡易パース
      return this.simpleParse(cssString);
    }

    return result;
  }

  /**
   * ケバブケースをキャメルケースに変換
   * @param prop CSSプロパティ名 (例: "margin-top")
   * @returns キャメルケース名 (例: "marginTop")
   */
  private static toCamelCase(prop: string): string {
    // flex, width などの単語プロパティはそのまま
    if (!prop.includes("-")) {
      return prop;
    }

    // margin-top → marginTop
    return prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * CSS値をパースして適切な型に変換
   * @param value CSS値の文字列
   * @param prop プロパティ名（特定のプロパティで特殊処理）
   * @returns パース済みの値（文字列のみ、無次元数値は非対応）
   */
  private static parseValue(value: string, prop?: string): string | number {
    // postcss-value-parserで値を解析
    const parsed = valueParser(value);

    // 単一の数値の場合（無次元数値は警告）
    if (parsed.nodes.length === 1 && parsed.nodes[0].type === "word") {
      const node = parsed.nodes[0];
      const numValue = parseFloat(node.value);

      // 単位なしの数値の場合
      if (!isNaN(numValue) && numValue.toString() === node.value) {
        // 特定のプロパティは無次元数値を許可（flex, z-index, font-weight等）
        if (this.allowsUnitlessValues(prop)) {
          return numValue;
        }

        // その他は警告を出してpx単位として扱う
        const propertyType = this.isDimensionProperty(prop)
          ? "dimension"
          : "value";
        console.warn(
          `⚠️  Unitless ${propertyType} "${value}" for property "${prop}". Use explicit units like "px", "%", "vw", "vh".`,
        );
        // フォールバック: px単位として扱う
        return `${numValue}px`;
      }
    }

    // pt単位も他の単位と同様に文字列として保持

    // 色関連プロパティで3桁16進カラーの場合、6桁に変換
    if (this.isColorProperty(prop) && this.isShortHexColor(value)) {
      return this.expandShortHexColor(value);
    }

    // それ以外は文字列として返す
    return value.trim();
  }

  /**
   * 簡易パース（PostCSSパースが失敗した場合のフォールバック）
   * @param cssString CSS文字列
   * @returns パース済みスタイルオブジェクト
   */
  private static simpleParse(cssString: string): ParsedStyle {
    const result: ParsedStyle = {};

    // セミコロンで分割
    const declarations = cssString.split(";").filter((d) => d.trim());

    for (const decl of declarations) {
      const colonIndex = decl.indexOf(":");
      if (colonIndex === -1) continue;

      const prop = decl.substring(0, colonIndex).trim();
      const value = decl.substring(colonIndex + 1).trim();

      if (prop && value) {
        const camelCaseProp = this.toCamelCase(prop);
        const parsedValue = this.parseValue(value, prop);
        result[camelCaseProp] = parsedValue;
      }
    }

    return result;
  }

  /**
   * 色関連のCSSプロパティかどうかを判定
   * @param prop プロパティ名
   * @returns 色関連プロパティの場合true
   */
  private static isColorProperty(prop?: string): boolean {
    if (!prop) return false;
    const colorProps = ["color", "background-color", "border-color"];
    return colorProps.includes(prop);
  }

  /**
   * 次元（寸法）関連のCSSプロパティかどうかを判定
   * @param prop プロパティ名
   * @returns 次元関連プロパティの場合true
   */
  private static isDimensionProperty(prop?: string): boolean {
    if (!prop) return false;
    const dimensionProps = [
      "width",
      "height",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "border-width",
      "border-radius",
      "gap",
      "top",
      "left",
      "right",
      "bottom",
    ];
    return dimensionProps.includes(prop);
  }

  /**
   * 無次元数値を許可するCSSプロパティかどうかを判定
   * @param prop プロパティ名
   * @returns 無次元数値を許可するプロパティの場合true
   */
  private static allowsUnitlessValues(prop?: string): boolean {
    if (!prop) return false;
    const unitlessProps = [
      "flex",
      "flex-grow",
      "flex-shrink",
      "z-index",
      "opacity",
      "order",
      "line-height",
      "font-weight",
    ];
    return unitlessProps.includes(prop);
  }

  /**
   * 3桁16進カラーかどうかを判定
   * @param value 値
   * @returns 3桁16進カラーの場合true
   */
  private static isShortHexColor(value: string): boolean {
    return /^#[0-9A-Fa-f]{3}$/.test(value.trim());
  }

  /**
   * 3桁16進カラーを6桁に展開
   * @param shortHex 3桁16進カラー（例: "#333"）
   * @returns 6桁16進カラー（例: "#333333"）
   */
  private static expandShortHexColor(shortHex: string): string {
    const hex = shortHex.trim().substring(1); // # を除去
    const expanded = hex
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded}`;
  }

  /**
   * スタイルオブジェクトをCSS文字列に変換（逆変換）
   * @param style スタイルオブジェクト
   * @returns CSS文字列
   */
  static stringify(style: ParsedStyle): string {
    const declarations: string[] = [];

    for (const [key, value] of Object.entries(style)) {
      // キャメルケースをケバブケースに変換
      const prop = key.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`,
      );
      declarations.push(`${prop}: ${value}`);
    }

    return declarations.join("; ");
  }
}
