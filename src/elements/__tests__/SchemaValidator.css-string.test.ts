/**
 * SchemaValidator CSS文字列形式styleサポートテスト
 * TDD Red Phase: 失敗するテストを先に作成
 */

import { SchemaValidator } from "../SchemaValidator.js";

describe("SchemaValidator CSS String Style Support", () => {
  let validator: SchemaValidator;

  beforeEach(() => {
    validator = new SchemaValidator();
  });

  describe("slide style with CSS string", () => {
    test("should accept string style on slide element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            style: "padding: 8px",
            children: []
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should accept string style on container element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "container",
                style: "flex-direction: row; width: 100%; margin-top: 8px",
                children: []
              }
            ]
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should accept string style on text element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "text",
                content: "Test text",
                style: "font-size: 14pt; color: #333333"
              }
            ]
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should accept string style on heading element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "heading",
                content: "Test heading",
                level: 1,
                style: "font-size: 28pt; margin-bottom: 4px; width: 100%"
              }
            ]
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should accept string style on frame element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "frame",
                style: "padding: 16px; background-color: #f0f0f0; border: 2px solid #ccc",
                children: []
              }
            ]
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("backward compatibility with object style", () => {
    test("should still accept object style on slide element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            style: {
              padding: "8px"
            },
            children: []
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should still accept object style on container element", () => {
      const data = {
        type: "deck",
        slides: [
          {
            type: "slide",
            children: [
              {
                type: "container",
                style: {
                  flexDirection: "row",
                  width: "100%",
                  marginTop: "8px"
                },
                children: []
              }
            ]
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("test11-css.json validation", () => {
    test("should validate test11-css.json structure with string styles", () => {
      const data = {
        type: "deck",
        title: "Test2: 2段組みレイアウトテスト",
        description: "左右2段組みレイアウトでのコンテンツ配置検証用テストケース",
        slides: [
          {
            type: "slide",
            style: "padding: 8px",
            children: [
              {
                type: "heading",
                content: "2段組みレイアウトデモ",
                level: 1,
                style: "font-size: 28pt; margin-bottom: 4px; width: 100%"
              },
              {
                type: "container",
                style: "flex-direction: row; width: 100%; margin-top: 8px",
                children: [
                  {
                    type: "container",
                    style: "flex: 4; background-color: #f0f8ff",
                    children: [
                      {
                        type: "heading",
                        content: "左カラム",
                        level: 3,
                        style: "margin-bottom: 4px; font-size: 20pt"
                      },
                      {
                        type: "text",
                        content: "これは左側のカラムです。",
                        style: "font-size: 14pt"
                      }
                    ]
                  },
                  {
                    type: "container",
                    style: "flex: 4; margin-left: 8px; background-color: #F0FFF0",
                    children: [
                      {
                        type: "heading",
                        content: "右カラム",
                        level: 3,
                        style: "margin-bottom: 4px; font-size:20pt"
                      },
                      {
                        type: "text",
                        content: "これは右側のカラムです。",
                        style: "font-size: 14pt"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});