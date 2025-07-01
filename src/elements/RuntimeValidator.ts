/**
 * SlideWeave実行時バリデーション
 * ファイル存在チェックなど、実行時にしか判定できない制約を検証
 */

import * as fs from "fs";
import * as path from "path";
import { DeckElement } from "../types/elements";

export interface RuntimeValidationError {
  path: string;
  message: string;
  value?: any;
}

export interface RuntimeValidationResult {
  isValid: boolean;
  errors: RuntimeValidationError[];
}

export class RuntimeValidator {
  /**
   * deckデータの実行時制約をバリデーション
   * @param data バリデーション対象のdeckデータ
   * @returns バリデーション結果
   */
  validate(data: DeckElement): RuntimeValidationResult {
    const errors: RuntimeValidationError[] = [];
    
    // 各スライドをチェック
    data.slides.forEach((slide, slideIndex) => {
      this.validateSlideResources(slide, slideIndex, errors);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * スライド内のリソース（ファイル）をチェック
   * @param slide スライドデータ
   * @param slideIndex スライドインデックス
   * @param errors エラー配列（参照渡し）
   */
  private validateSlideResources(slide: any, slideIndex: number, errors: RuntimeValidationError[]): void {
    const slidePath = `/slides/${slideIndex}`;
    
    // スライド背景画像のチェック
    if (slide.background?.image) {
      this.validateFileExists(slide.background.image, `${slidePath}/background/image`, errors);
    }

    // 子要素のリソースチェック
    if (slide.children) {
      this.validateElementResources(slide.children, `${slidePath}/children`, errors);
    }
  }

  /**
   * 要素配列内のリソースを再帰的にチェック
   * @param elements 要素配列
   * @param basePath ベースパス
   * @param errors エラー配列（参照渡し）
   */
  private validateElementResources(elements: any[], basePath: string, errors: RuntimeValidationError[]): void {
    elements.forEach((element, index) => {
      const elementPath = `${basePath}/${index}`;
      
      // image要素のsrcチェック
      if (element.type === "image" && element.src) {
        this.validateFileExists(element.src, `${elementPath}/src`, errors);
      }

      // 背景画像のチェック
      if (element.style?.backgroundImage) {
        this.validateFileExists(element.style.backgroundImage, `${elementPath}/style/backgroundImage`, errors);
      }

      // 再帰的チェック
      if (element.children) {
        this.validateElementResources(element.children, `${elementPath}/children`, errors);
      }
    });
  }

  /**
   * ファイル存在チェック
   * @param filePath ファイルパス
   * @param jsonPath JSONパス
   * @param errors エラー配列（参照渡し）
   */
  private validateFileExists(filePath: string, jsonPath: string, errors: RuntimeValidationError[]): void {
    // 相対パスの場合は絶対パスに変換
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      errors.push({
        path: jsonPath,
        message: `ファイルが見つかりません: ${filePath}`,
        value: filePath
      });
    }
  }

  /**
   * バリデーション結果を人間が読みやすい形式で出力
   * @param result バリデーション結果
   * @returns フォーマットされた文字列
   */
  formatValidationResult(result: RuntimeValidationResult): string {
    if (result.isValid) {
      return "✅ 実行時バリデーション成功: 全てのリソースファイルが存在します";
    }

    const errorLines = [
      "❌ 実行時バリデーションエラー:",
      ...result.errors.map((error, index) => 
        `  ${index + 1}. ${error.path}: ${error.message}`
      )
    ];

    return errorLines.join("\n");
  }
}