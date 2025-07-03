/**
 * LayoutEngineのテスト
 */

import { YogaLayoutEngine, flattenLayout } from "../YogaLayoutEngine";
import { createPixels } from "../../types/units";
import { SlideDataLoader } from "../../data/SlideDataLoader";
import { PPTXRenderer } from "../../renderer/PPTXRenderer";
import { SchemaValidator } from "../../elements/SchemaValidator";
import { RuntimeValidator } from "../../elements/RuntimeValidator";
import * as path from "path";

describe("LayoutEngine", () => {
  let layoutEngine: YogaLayoutEngine;

  beforeEach(() => {
    layoutEngine = new YogaLayoutEngine();
  });
  describe("JSONベーステストケース", () => {
    test("test01-basic-layout-deck.json の完全統合テスト", async () => {
      // JSONファイルを読み込み
      const testFilePath = path.join(
        __dirname,
        "../../../examples/test01-basic-layout-deck.json",
      );
      const slideData = SlideDataLoader.loadFromFile(testFilePath);

      // 16:9レイアウト設定
      const slideWidth = 720;
      const slideHeight = 405;

      const renderer = new PPTXRenderer({
        widthPx: slideWidth,
        heightPx: slideHeight,
        dpi: 72
      });

      // スライドを処理
      const slide = slideData.slides[0];

      // デックレベルのバリデーション
      const schemaValidator = new SchemaValidator();
      const schemaValidation = schemaValidator.validate(slideData);
      expect(schemaValidation.isValid).toBe(true);
      
      const runtimeValidator = new RuntimeValidator();
      const runtimeValidation = runtimeValidator.validate(slideData);
      expect(runtimeValidation.isValid).toBe(true);

      // レイアウト計算
      const slideLayout = await layoutEngine.renderLayout(slide, createPixels(slideWidth), createPixels(slideHeight));

      // レンダリング（ファイル保存はJestではスキップ）
      renderer.render(slideLayout);

      // 座標の詳細検証
      expect(slideLayout.left).toBe(0);
      expect(slideLayout.top).toBe(0);
      expect(slideLayout.width).toBe(720);
      expect(slideLayout.height).toBe(405);
      expect(slideLayout.element.type).toBe("slide");

      // 見出し要素の検証
      const heading = slideLayout.children![0];
      expect(heading.element.type).toBe("heading");
      expect(heading.left).toBe(32);
      expect(heading.top).toBe(48);
      expect(heading.width).toBe(640);
      expect(heading.height).toBe(40); // グリッド整列により8の倍数

      // テキストコンテナの検証
      const textContainer = slideLayout.children![1];
      expect(textContainer.element.type).toBe("container");
      expect(textContainer.left).toBe(32);
      expect(textContainer.top).toBe(112); // グリッド整列により座標も調整
      expect(textContainer.width).toBe(640);

      // テキスト要素の検証
      const textElement = textContainer.children![0];
      expect(textElement.element.type).toBe("text");
      expect(textElement.left).toBe(0);
      expect(textElement.top).toBe(0);
      expect(textElement.width).toBe(640); // 制約幅と一致
      expect(textElement.height).toBe(96); // 日本語文字幅係数1.2適用による適切な行高
    });

    test("テキスト幅がコンテナ幅を超えない", async () => {
      const testFilePath = path.join(
        __dirname,
        "../../../examples/test01-basic-layout-deck.json",
      );
      const slideData = SlideDataLoader.loadFromFile(testFilePath);

      const layoutResult = await layoutEngine.renderLayout(slideData.slides[0], createPixels(720), createPixels(405));

      // 全要素を平坦化して検証
      const flatElements = flattenLayout(layoutResult);

      flatElements.forEach((element) => {
        if (
          element.element.type === "text" ||
          element.element.type === "heading"
        ) {
          // テキスト要素の幅がコンテナ幅（640px）を超えないことを確認
          expect(element.width).toBeLessThanOrEqual(640);
        }
      });
    });
  });
});
