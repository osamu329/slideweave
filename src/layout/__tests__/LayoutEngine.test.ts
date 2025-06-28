/**
 * LayoutEngineのテスト
 */

import { renderLayout, flattenLayout } from "../LayoutEngine";
import { SlideDataLoader } from "../../data/SlideDataLoader";
import { PPTXRenderer } from "../../renderer/PPTXRenderer";
import { ElementValidator } from "../../elements/validator";
import * as path from "path";

describe("LayoutEngine", () => {
  describe("JSONベーステストケース", () => {
    test("test1-basic-layout.json の完全統合テスト", async () => {
      // JSONファイルを読み込み
      const testFilePath = path.join(
        __dirname,
        "../../../examples/test1-basic-layout.json",
      );
      const slideData = SlideDataLoader.loadFromFile(testFilePath);

      // 16:9レイアウト設定
      const slideWidth = 720;
      const slideHeight = 405;

      const renderer = new PPTXRenderer({
        slideWidth: 10,
        slideHeight: 5.625,
      });

      // スライドを処理
      const slide = slideData.slides[0];

      // バリデーション
      const validation = ElementValidator.validate(slide);
      expect(validation.isValid).toBe(true);

      // レイアウト計算
      const slideLayout = renderLayout(slide, slideWidth, slideHeight);

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
      expect(textElement.height).toBe(72); // グリッド整列により8の倍数
    });

    test("テキスト幅がコンテナ幅を超えない", () => {
      const testFilePath = path.join(
        __dirname,
        "../../../examples/test1-basic-layout.json",
      );
      const slideData = SlideDataLoader.loadFromFile(testFilePath);

      const layoutResult = renderLayout(slideData.slides[0], 720, 405);

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
