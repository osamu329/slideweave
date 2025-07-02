/**
 * SchemaValidator テスト
 * deck/slide構造のJSON Schema検証テスト
 */

import { SchemaValidator } from "../SchemaValidator";
import { DeckElement } from "../../types/elements";

describe("SchemaValidator", () => {
  let validator: SchemaValidator;

  beforeEach(() => {
    validator = new SchemaValidator();
  });

  describe("基本的なdeck構造", () => {
    test("最小限の有効なdeck構造を受け入れる", () => {
      const validDeck: DeckElement = {
        type: "deck",
        slides: [
          {
            type: "slide",
          },
        ],
      };

      const result = validator.validate(validDeck);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toEqual(validDeck);
    });

    test("typeプロパティが必須", () => {
      const invalidDeck = {
        slides: [{ type: "slide" }],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.message.includes("必須プロパティ 'type'")),
      ).toBe(true);
    });

    test("slidesプロパティが必須", () => {
      const invalidDeck = {
        type: "deck",
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) =>
          e.message.includes("必須プロパティ 'slides'"),
        ),
      ).toBe(true);
    });

    test("typeは'deck'でなければならない", () => {
      const invalidDeck = {
        type: "slide", // 間違った型
        slides: [{ type: "slide" }],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.message.includes("期待値: deck")),
      ).toBe(true);
    });

    test("slidesは最低1つの要素が必要", () => {
      const invalidDeck = {
        type: "deck",
        slides: [], // 空の配列
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("最少: 1個"))).toBe(
        true,
      );
    });
  });

  describe("スライド構造", () => {
    test("有効なslide構造を受け入れる", () => {
      const validDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            title: "テストスライド",
            layout: "content",
            header: {
              type: "header",
              content: "ヘッダー",
            },
            footer: {
              type: "footer",
              content: "フッター",
            },
            background: {
              color: "#FFFFFF",
              image: "background.png",
              size: "cover",
            },
            children: [
              {
                type: "text",
                content: "テキスト",
              },
            ],
          },
        ],
      };

      const result = validator.validate(validDeck);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("slide.layoutの値制限", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            layout: "invalid-layout", // 無効な値
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) =>
          e.message.includes("許可値: [title, content, blank]"),
        ),
      ).toBe(true);
    });
  });

  describe("要素バリデーション", () => {
    test("text要素の必須プロパティ", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "text",
                // content が不足
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) =>
          e.message.includes("必須プロパティ 'content'"),
        ),
      ).toBe(true);
    });

    test("heading要素のlevel制限", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "heading",
                content: "見出し",
                level: 7, // 1-6の範囲外
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.message.includes("must be <= 6")),
      ).toBe(true);
    });

    test("shape要素のshapeType必須", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "shape",
                // shapeType が不足
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) =>
          e.message.includes("必須プロパティ 'shapeType'"),
        ),
      ).toBe(true);
    });

    test("image要素のsrc必須", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "image",
                // src が不足
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.message.includes("必須プロパティ 'src'")),
      ).toBe(true);
    });
  });

  describe("スタイルバリデーション", () => {
    test("色値の形式チェック", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "text",
                content: "テキスト",
                style: {
                  color: "red", // #RRGGBB形式でない
                },
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("パターン"))).toBe(
        true,
      );
    });

    test("px単位の形式チェック", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "frame",
                style: {
                  borderWidth: "10", // px単位がない
                },
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("パターン"))).toBe(
        true,
      );
    });

    test("有効なスタイル値を受け入れる", () => {
      const validDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "text",
                content: "テスト",
                style: {
                  color: "#FF0000",
                  fontSize: "16px",
                  margin: "8px",
                  padding: "4px",
                },
              },
            ],
          },
        ],
      };

      const result = validator.validate(validDeck);

      if (!result.isValid) {
        console.log(
          "Valid style test errors:",
          result.errors.map((e) => e.message),
        );
      }
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("無次元数値は禁止", () => {
      const invalidDeck = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "text",
                content: "テキスト",
                style: {
                  padding: 4, // 無次元数値は不可
                  margin: 8, // 無次元数値は不可
                },
              },
            ],
          },
        ],
      };

      const result = validator.validate(invalidDeck);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("type"))).toBe(true);
    });
  });

  describe("PowerPoint制約チェック", () => {
    test("有効なデータでは追加エラーなし", () => {
      const validDeck: DeckElement = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "text",
                content: "テキスト",
              },
            ],
          },
        ],
      };

      const errors = validator.validatePowerPointConstraints(validDeck);

      expect(errors).toHaveLength(0);
    });

    test("スライド数制限チェック", () => {
      const largeDeck: DeckElement = {
        type: "deck",
        slides: new Array(1001)
          .fill(null)
          .map(() => ({ type: "slide" as const })),
      };

      const errors = validator.validatePowerPointConstraints(largeDeck);

      expect(
        errors.some((e) =>
          e.message.includes("スライド数が上限を超えています"),
        ),
      ).toBe(true);
    });
  });

  describe("エラーメッセージフォーマット", () => {
    test("成功時のメッセージ", () => {
      const validResult = {
        isValid: true,
        errors: [],
        data: { type: "deck", slides: [] } as any,
      };

      const message = validator.formatValidationResult(validResult);

      expect(message).toContain("✅ バリデーション成功");
    });

    test("エラー時のメッセージ", () => {
      const errorResult = {
        isValid: false,
        errors: [
          { path: "/slides", message: "必須プロパティが不足" },
          { path: "/type", message: "型が不正" },
        ],
      };

      const message = validator.formatValidationResult(errorResult);

      expect(message).toContain("❌ バリデーションエラー:");
      expect(message).toContain("1. /slides: 必須プロパティが不足");
      expect(message).toContain("2. /type: 型が不正");
    });
  });
});
