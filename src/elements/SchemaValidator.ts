/**
 * SlideWeave JSON Schema バリデーター
 * ajvライブラリを使用してdeck/slide構造の検証を実行
 */

import Ajv from "ajv";
import * as fs from "fs";
import * as path from "path";
import { DeckElement } from "../types/elements";

export interface SchemaValidationError {
  path: string;
  message: string;
  value?: any;
  schemaPath?: string;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: SchemaValidationError[];
  data?: DeckElement;
}

export class SchemaValidator {
  private ajv: Ajv;
  private schema: any;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true, // すべてのエラーを収集
      verbose: true,   // 詳細なエラー情報
      strict: false    // 厳密モードを無効（PowerPoint制約に対応）
    });
    
    this.loadSchema();
  }

  /**
   * JSON Schemaを読み込み
   */
  private loadSchema(): void {
    const schemaPath = path.join(__dirname, "../schemas/slideweave.schema.json");
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    try {
      const schemaContent = fs.readFileSync(schemaPath, "utf-8");
      this.schema = JSON.parse(schemaContent);
    } catch (error) {
      throw new Error(`Failed to load schema: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Deck構造データをバリデーション
   * @param data バリデーション対象のデータ
   * @returns バリデーション結果
   */
  validate(data: any): SchemaValidationResult {
    // ajvでバリデーション実行
    const isValid = this.ajv.validate(this.schema, data);
    
    if (isValid) {
      return {
        isValid: true,
        errors: [],
        data: data as DeckElement
      };
    }

    // エラー情報を変換
    const errors: SchemaValidationError[] = (this.ajv.errors || []).map(error => ({
      path: error.instancePath || error.schemaPath || "root",
      message: this.formatErrorMessage(error),
      value: error.data,
      schemaPath: error.schemaPath
    }));

    return {
      isValid: false,
      errors,
      data: undefined
    };
  }

  /**
   * エラーメッセージを日本語でフォーマット
   * @param error ajvエラーオブジェクト
   * @returns フォーマットされたエラーメッセージ
   */
  private formatErrorMessage(error: any): string {
    const path = error.instancePath || "";
    const keyword = error.keyword;
    
    switch (keyword) {
      case "required":
        const missingProperty = error.params?.missingProperty;
        return `必須プロパティ '${missingProperty}' が不足しています ${path}`;
        
      case "type":
        const expectedType = error.params?.type;
        return `プロパティ ${path} の型が不正です。期待値: ${expectedType}`;
        
      case "const":
        const expectedValue = error.params?.allowedValue;
        return `プロパティ ${path} の値が不正です。期待値: ${expectedValue}`;
        
      case "enum":
        const allowedValues = error.params?.allowedValues?.join(", ");
        return `プロパティ ${path} の値が不正です。許可値: [${allowedValues}]`;
        
      case "pattern":
        const pattern = error.params?.pattern;
        return `プロパティ ${path} の形式が不正です。パターン: ${pattern}`;
        
      case "minItems":
        const minItems = error.params?.limit;
        return `配列 ${path} の要素数が不足しています。最少: ${minItems}個`;
        
      case "additionalProperties":
        const additionalProperty = error.params?.additionalProperty;
        return `プロパティ ${path} に許可されていないプロパティ '${additionalProperty}' があります`;
        
      case "oneOf":
        return `プロパティ ${path} がいずれの型定義にも一致しません`;
        
      default:
        return `${path}: ${error.message || "バリデーションエラー"}`;
    }
  }

  /**
   * PowerPoint制約の追加チェック
   * JSON Schemaでは表現できない複雑な制約をチェック
   * @param data バリデーション済みのデータ
   * @returns 追加エラー
   */
  validatePowerPointConstraints(data: DeckElement): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];
    
    // スライド数制限チェック（PowerPointの実用的制限）
    if (data.slides.length > 1000) {
      errors.push({
        path: "/slides",
        message: "スライド数が上限を超えています。推奨: 1000枚以下"
      });
    }

    // 各スライドの制約チェック
    data.slides.forEach((slide, slideIndex) => {
      this.validateSlideConstraints(slide, slideIndex, errors);
    });

    return errors;
  }

  /**
   * 個別スライドの制約チェック
   * @param slide スライドデータ
   * @param slideIndex スライドインデックス
   * @param errors エラー配列（参照渡し）
   */
  private validateSlideConstraints(slide: any, slideIndex: number, errors: SchemaValidationError[]): void {
    const slidePath = `/slides/${slideIndex}`;
    
    // header/footerがslide直下にのみ存在することをチェック
    if (slide.children) {
      slide.children.forEach((child: any, childIndex: number) => {
        if (child.type === "header" || child.type === "footer") {
          errors.push({
            path: `${slidePath}/children/${childIndex}`,
            message: `${child.type}要素はslide直下のheader/footerプロパティとしてのみ配置可能です`
          });
        }
      });
    }

    // 子要素の再帰的チェック
    if (slide.children) {
      this.validateElementConstraints(slide.children, `${slidePath}/children`, errors);
    }
  }

  /**
   * 要素制約の再帰的チェック
   * @param elements 要素配列
   * @param basePath ベースパス
   * @param errors エラー配列（参照渡し）
   */
  private validateElementConstraints(elements: any[], basePath: string, errors: SchemaValidationError[]): void {
    elements.forEach((element, index) => {
      const elementPath = `${basePath}/${index}`;
      
      // shape要素の子要素チェック
      if (element.type === "shape" && element.children && element.children.length > 0) {
        errors.push({
          path: elementPath,
          message: "shape要素は子要素を持つことができません"
        });
      }

      // CSS単位形式チェック（パターンマッチで基本チェックは済んでいるが、実用性をチェック）
      if (element.style) {
        this.validateStyleConstraints(element.style, `${elementPath}/style`, errors);
      }

      // 再帰的チェック
      if (element.children) {
        this.validateElementConstraints(element.children, `${elementPath}/children`, errors);
      }
    });
  }

  /**
   * スタイル制約チェック
   * @param style スタイルオブジェクト
   * @param stylePath スタイルパス
   * @param errors エラー配列（参照渡し）
   */
  private validateStyleConstraints(style: any, stylePath: string, errors: SchemaValidationError[]): void {
    // フォントサイズの実用範囲チェック
    if (style.fontSize) {
      const fontSize = this.extractNumericValue(style.fontSize);
      if (fontSize < 6 || fontSize > 144) {
        errors.push({
          path: `${stylePath}/fontSize`,
          message: "フォントサイズは6pt〜144ptの範囲で指定してください",
          value: style.fontSize
        });
      }
    }

    // 色値の妥当性チェック（#RRGGBB形式）
    const colorProps = ["color", "backgroundColor", "borderColor"];
    colorProps.forEach(prop => {
      if (style[prop] && typeof style[prop] === "string") {
        if (!style[prop].match(/^#[0-9A-Fa-f]{6}$/)) {
          errors.push({
            path: `${stylePath}/${prop}`,
            message: "色は#RRGGBB形式で指定してください",
            value: style[prop]
          });
        }
      }
    });
  }

  /**
   * CSS単位付き値から数値を抽出
   * @param value 値（数値または単位付き文字列）
   * @returns 数値
   */
  private extractNumericValue(value: string | number): number {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const numMatch = value.match(/^(\d+(?:\.\d+)?)/);
      if (numMatch) {
        return parseFloat(numMatch[1]);
      }
    }
    return 0;
  }

  /**
   * バリデーション結果を人間が読みやすい形式で出力
   * @param result バリデーション結果
   * @returns フォーマットされた文字列
   */
  formatValidationResult(result: SchemaValidationResult): string {
    if (result.isValid) {
      return "✅ バリデーション成功: deck/slide構造が正しく定義されています";
    }

    const errorLines = [
      "❌ バリデーションエラー:",
      ...result.errors.map((error, index) => 
        `  ${index + 1}. ${error.path}: ${error.message}`
      )
    ];

    return errorLines.join("\n");
  }
}