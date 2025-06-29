/**
 * スライドデータローダー
 * JSON形式のスライドデータを読み込んでElement型に変換
 */

import * as fs from "fs";
import * as path from "path";
import { Element } from "../types/elements";
import { CSSStyleParser } from "../css-processor/CSSStyleParser";
import { CSSStylesheetParser, StylesheetRules } from "../css-processor/CSSStylesheetParser";

export interface SlideData {
  title: string;
  description?: string;
  css?: string;  // CSSスタイルシート（CSSライクスタイルシート機能用）
  slides: Element[];
}

export class SlideDataLoader {
  /**
   * JSONファイルからスライドデータを読み込み
   * @param filePath JSONファイルのパス
   * @returns スライドデータ
   */
  static loadFromFile(filePath: string): SlideData {
    try {
      const absolutePath = path.resolve(filePath);
      const jsonContent = fs.readFileSync(absolutePath, "utf-8");
      const data = JSON.parse(jsonContent);

      // 基本的なバリデーション
      if (!data.title || !Array.isArray(data.slides)) {
        throw new Error(
          "Invalid slide data format: title and slides array are required",
        );
      }

      // CSS文字列をパース
      const stylesheetRules = this.processStylesheet(data.css);
      this.processStyleStrings(data.slides, stylesheetRules);
      
      return data as SlideData;
    } catch (error) {
      throw new Error(
        `Failed to load slide data from ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * JSONオブジェクトからスライドデータを読み込み
   * @param jsonData JSONオブジェクト
   * @returns スライドデータ
   */
  static loadFromObject(jsonData: any): SlideData {
    // 基本的なバリデーション
    if (!jsonData.title || !Array.isArray(jsonData.slides)) {
      throw new Error(
        "Invalid slide data format: title and slides array are required",
      );
    }

    // CSS文字列をパース
    const stylesheetRules = this.processStylesheet(jsonData.css);
    this.processStyleStrings(jsonData.slides, stylesheetRules);
    
    return jsonData as SlideData;
  }

  /**
   * スライドデータをJSONファイルに保存
   * @param data スライドデータ
   * @param filePath 保存先パス
   */
  static saveToFile(data: SlideData, filePath: string): void {
    try {
      const absolutePath = path.resolve(filePath);
      const jsonContent = JSON.stringify(data, null, 2);
      fs.writeFileSync(absolutePath, jsonContent, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to save slide data to ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * CSSスタイルシートを処理
   * @param css CSSスタイルシート文字列
   * @returns 解析されたスタイルルール
   */
  private static processStylesheet(css?: string): StylesheetRules {
    if (!css) {
      return {};
    }

    const result = CSSStylesheetParser.parse(css);
    
    // 警告をコンソールに出力
    if (result.warnings.length > 0) {
      console.warn('CSS Stylesheet Warnings:');
      result.warnings.forEach(warning => console.warn(warning));
    }

    return result.styles;
  }

  /**
   * 要素ツリーを再帰的に走査してCSS文字列をパースし、クラススタイルを適用
   * @param elements 要素配列
   * @param stylesheetRules CSSスタイルシートルール
   */
  private static processStyleStrings(elements: any[], stylesheetRules: StylesheetRules): void {
    for (const element of elements) {
      // CSSクラス名が指定されている場合、対応するスタイルを適用
      if (element.className && stylesheetRules[element.className]) {
        const classStyle = stylesheetRules[element.className];
        
        // 既存のstyleオブジェクトがない場合は作成
        if (!element.style) {
          element.style = {};
        } else if (typeof element.style === 'string') {
          // style が文字列の場合は先にパース
          element.style = CSSStyleParser.parse(element.style);
        }
        
        // クラススタイルを適用（既存のstyleは優先）
        element.style = { ...classStyle, ...element.style };
      }
      
      // style プロパティが文字列の場合、パースしてオブジェクトに変換
      if (typeof element.style === 'string') {
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
    const migrateProps = ['fontSize', 'fontFamily', 'color', 'bold', 'italic'];
    
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
  }
}
