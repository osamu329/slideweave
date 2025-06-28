/**
 * スライドデータローダー
 * JSON形式のスライドデータを読み込んでElement型に変換
 */

import * as fs from "fs";
import * as path from "path";
import { Element } from "../types/elements";

export interface SlideData {
  title: string;
  description?: string;
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
}
