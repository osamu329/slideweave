/**
 * スライドデータローダー
 * JSON形式のスライドデータを読み込んでElement型に変換
 */

import fs from "fs";
import path from "path";
import { Element, DeckElement, DeckDefaults } from "../types/elements";
import { CSSStyleParser } from "../css-processor/CSSStyleParser";
import {
  CSSStylesheetParser,
  StylesheetRules,
} from "../css-processor/CSSStylesheetParser";

export interface SlideData {
  title: string;
  description?: string;
  css?: string; // CSSスタイルシート（CSSライクスタイルシート機能用）
  slides: Element[];
}

export class SlideDataLoader {
  /**
   * JSONファイルからスライドデータを読み込み
   * @param filePath JSONファイルのパス
   * @returns DeckElement
   */
  static loadFromFile(filePath: string): DeckElement {
    try {
      const absolutePath = path.resolve(filePath);
      const jsonContent = fs.readFileSync(absolutePath, "utf-8");
      const data = JSON.parse(jsonContent);

      // deck/slide構造のバリデーション
      if (data.type !== "deck" || !Array.isArray(data.slides)) {
        throw new Error(
          "Invalid deck data format: type must be 'deck' and slides array is required",
        );
      }

      // CSS文字列をパース
      const stylesheetRules = this.processStylesheet(data.css);

      // デフォルト値を設定（メモリ内でのみ使用、JSONオブジェクトには追加しない）
      const defaults: DeckDefaults = {
        fontSize: "14pt"
      };

      // 各スライドの子要素を処理
      data.slides.forEach((slide: any) => {
        if (slide.children) {
          this.processStyleStrings(slide.children, stylesheetRules);
          // デフォルト値を適用
          this.applyDefaults(slide.children, defaults);
        }
      });

      return data as DeckElement;
    } catch (error) {
      throw new Error(
        `Failed to load slide data from ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * 外部CSSファイルと共にJSONファイルからスライドデータを読み込み
   * @param filePath JSONファイルのパス
   * @param cssFiles 外部CSSファイルのパス配列
   * @returns DeckElement
   */
  static loadFromFileWithExternalCSS(
    filePath: string,
    cssFiles: string[],
  ): DeckElement {
    try {
      const absolutePath = path.resolve(filePath);
      const jsonContent = fs.readFileSync(absolutePath, "utf-8");
      const data = JSON.parse(jsonContent);

      // deck/slide構造のバリデーション
      if (data.type !== "deck" || !Array.isArray(data.slides)) {
        throw new Error(
          "Invalid deck data format: type must be 'deck' and slides array is required",
        );
      }

      // 外部CSSファイルを読み込んで結合
      let combinedCSS = data.css || "";

      for (const cssFile of cssFiles) {
        if (fs.existsSync(cssFile)) {
          const cssContent = fs.readFileSync(cssFile, "utf-8");
          combinedCSS += "\n" + cssContent;
        } else {
          console.warn(`Warning: CSS file not found: ${cssFile}`);
        }
      }

      // 結合されたCSS文字列をパース
      const stylesheetRules = this.processStylesheet(combinedCSS);

      // デフォルト値を設定（メモリ内でのみ使用、JSONオブジェクトには追加しない）
      const defaults: DeckDefaults = {
        fontSize: "14pt"
      };

      // 各スライドの子要素を処理
      data.slides.forEach((slide: any) => {
        if (slide.children) {
          this.processStyleStrings(slide.children, stylesheetRules);
          // デフォルト値を適用
          this.applyDefaults(slide.children, defaults);
        }
      });

      return data as DeckElement;
    } catch (error) {
      throw new Error(
        `Failed to load slide data with external CSS from ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * JSONオブジェクトからデックデータを読み込み
   * @param jsonData JSONオブジェクト
   * @returns DeckElement
   */
  static loadFromObject(jsonData: any): DeckElement {
    // deck/slide構造のバリデーション
    if (jsonData.type !== "deck" || !Array.isArray(jsonData.slides)) {
      throw new Error(
        "Invalid deck data format: type must be 'deck' and slides array is required",
      );
    }

    // CSS文字列をパース
    const stylesheetRules = this.processStylesheet(jsonData.css);

    // デフォルト値を設定（メモリ内でのみ使用、JSONオブジェクトには追加しない）
    const defaults: DeckDefaults = {
      fontSize: "14pt"
    };

    // 各スライドの子要素を処理
    jsonData.slides.forEach((slide: any) => {
      if (slide.children) {
        this.processStyleStrings(slide.children, stylesheetRules);
        // デフォルト値を適用
        this.applyDefaults(slide.children, defaults);
      }
    });

    return jsonData as DeckElement;
  }

  /**
   * デックデータをJSONファイルに保存
   * @param data デックデータ
   * @param filePath 保存先パス
   */
  static saveToFile(data: DeckElement, filePath: string): void {
    try {
      const absolutePath = path.resolve(filePath);
      const jsonContent = JSON.stringify(data, null, 2);
      fs.writeFileSync(absolutePath, jsonContent, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to save deck data to ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * CSSスタイルシートを処理
   * @param css CSSスタイルシート文字列
   * @returns 解析されたスタイルルール
   */
  private static processStylesheet(css?: string): StylesheetRules {
    // CSSが空でもデフォルトクラスを含むため、常にparseを実行
    const result = CSSStylesheetParser.parse(css || "");

    // 警告をコンソールに出力
    if (result.warnings.length > 0) {
      console.warn("CSS Stylesheet Warnings:");
      result.warnings.forEach((warning) => console.warn(warning));
    }

    return result.styles;
  }

  /**
   * 要素ツリーを再帰的に走査してCSS文字列をパースし、クラススタイルを適用
   * @param elements 要素配列
   * @param stylesheetRules CSSスタイルシートルール
   */
  private static processStyleStrings(
    elements: any[],
    stylesheetRules: StylesheetRules,
  ): void {
    for (const element of elements) {
      // 既存のインラインスタイルを保存（優先度を保つため）
      let inlineStyle = {};
      if (element.style) {
        if (typeof element.style === "string") {
          inlineStyle = CSSStyleParser.parse(element.style);
        } else {
          inlineStyle = { ...element.style };
        }
      }

      // CSSクラス名が指定されている場合、対応するスタイルを適用
      if (element.class) {
        // スペース区切りで複数クラスをサポート
        const classNames = element.class
          .split(/\s+/)
          .filter((name: string) => name.length > 0);

        // 初期スタイルオブジェクトを作成
        element.style = {};

        // 複数クラスのスタイルを順番に適用（後のクラスが優先）
        for (const className of classNames) {
          if (stylesheetRules[className]) {
            const classStyle = stylesheetRules[className];
            element.style = { ...element.style, ...classStyle };
          }
        }

        // インラインスタイルを最後に適用（最高優先度）
        element.style = { ...element.style, ...inlineStyle };
      }

      // style プロパティが文字列の場合、パースしてオブジェクトに変換
      if (typeof element.style === "string") {
        element.style = CSSStyleParser.parse(element.style);
      }

      // 従来の直接プロパティをstyleに移動
      this.migrateDirectPropertiesToStyle(element);

      // 子要素があれば再帰的に処理
      if (Array.isArray(element.children)) {
        this.processStyleStrings(element.children, stylesheetRules);
      }
    }
  }

  /**
   * 要素の直接プロパティをstyleオブジェクトに移動
   * @param element 要素
   */
  private static migrateDirectPropertiesToStyle(element: any): void {
    // テキスト関連のプロパティをstyleに移動
    const migrateProps = ["fontSize", "fontFamily", "color"];

    for (const prop of migrateProps) {
      if (Object.prototype.hasOwnProperty.call(element, prop)) {
        // styleオブジェクトがなければ作成
        if (!element.style) {
          element.style = {};
        }

        // プロパティを移動
        element.style[prop] = element[prop];
        delete element[prop];
      }
    }

    // bold → fontWeight 変換
    if (Object.prototype.hasOwnProperty.call(element, "bold")) {
      if (!element.style) {
        element.style = {};
      }
      element.style.fontWeight = element.bold ? "bold" : "normal";
      delete element.bold;
    }

    // italic → fontStyle 変換
    if (Object.prototype.hasOwnProperty.call(element, "italic")) {
      if (!element.style) {
        element.style = {};
      }
      element.style.fontStyle = element.italic ? "italic" : "normal";
      delete element.italic;
    }
  }

  /**
   * デフォルト値を要素に適用
   * @param elements 要素の配列
   * @param defaults デッキレベルのデフォルト値
   */
  private static applyDefaults(elements: Element[], defaults: DeckDefaults): void {
    for (const element of elements) {
      // text/heading要素にのみデフォルト値を適用
      if (element.type === "text" || element.type === "heading") {
        if (!element.style) {
          element.style = {};
        }

        // fontSize
        if (!element.style.fontSize && defaults.fontSize) {
          element.style.fontSize = defaults.fontSize;
        }

        // fontFamily
        if (!element.style.fontFamily && defaults.fontFamily) {
          element.style.fontFamily = defaults.fontFamily;
        }

        // color
        if (!element.style.color && defaults.color) {
          element.style.color = defaults.color;
        }
      }

      // 子要素にも再帰的に適用
      if (element.children) {
        this.applyDefaults(element.children, defaults);
      }
    }
  }
}
