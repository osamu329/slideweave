import { describe, it, expect } from "vitest";
import { SlideDataLoader } from "../SlideDataLoader";
import fs from "fs";
import path from "path";
import { DeckElement } from "../../types/elements";

describe("SlideDataLoader - デフォルト値適用", () => {
  const testDataDir = path.join(__dirname, "test-data");

  // テストディレクトリを作成
  beforeAll(() => {
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
  });

  // テストファイルをクリーンアップ
  afterAll(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true });
    }
  });

  it("デッキレベルのデフォルトfontSizeが未指定の場合、14ptが設定される", () => {
    const testFile = path.join(testDataDir, "no-defaults.json");
    const testData = {
      type: "deck",
      slides: [
        {
          type: "slide",
          children: [
            { type: "text", content: "テスト" }
          ]
        }
      ]
    };
    fs.writeFileSync(testFile, JSON.stringify(testData));

    const result = SlideDataLoader.loadFromFile(testFile);

    expect(result.defaults).toBeDefined();
    expect(result.defaults?.fontSize).toBe("14pt");
  });

  it("text要素にstyle.fontSizeが未指定の場合、デッキのデフォルト値が適用される", () => {
    const testFile = path.join(testDataDir, "apply-defaults.json");
    const testData = {
      type: "deck",
      defaults: {
        fontSize: "16pt",
        fontFamily: "Arial",
        color: "#333333"
      },
      slides: [
        {
          type: "slide",
          children: [
            { type: "text", content: "デフォルト適用" },
            { 
              type: "text", 
              content: "カスタムサイズ",
              style: { fontSize: "20pt" }
            }
          ]
        }
      ]
    };
    fs.writeFileSync(testFile, JSON.stringify(testData));

    const result = SlideDataLoader.loadFromFile(testFile);
    const slide = result.slides[0];
    const text1 = slide.children?.[0];
    const text2 = slide.children?.[1];

    // デフォルト値が適用されることを確認
    expect(text1?.style?.fontSize).toBe("16pt");
    expect(text1?.style?.fontFamily).toBe("Arial");
    expect(text1?.style?.color).toBe("#333333");

    // 既存の値は上書きされないことを確認
    expect(text2?.style?.fontSize).toBe("20pt");
    expect(text2?.style?.fontFamily).toBe("Arial"); // デフォルトが適用
    expect(text2?.style?.color).toBe("#333333"); // デフォルトが適用
  });

  it("heading要素にもデフォルト値が適用される", () => {
    const testFile = path.join(testDataDir, "heading-defaults.json");
    const testData = {
      type: "deck",
      defaults: {
        fontSize: "14pt",
        fontFamily: "Helvetica"
      },
      slides: [
        {
          type: "slide",
          children: [
            { 
              type: "heading", 
              content: "見出し",
              level: 2
            }
          ]
        }
      ]
    };
    fs.writeFileSync(testFile, JSON.stringify(testData));

    const result = SlideDataLoader.loadFromFile(testFile);
    const heading = result.slides[0].children?.[0];

    expect(heading?.style?.fontSize).toBe("14pt");
    expect(heading?.style?.fontFamily).toBe("Helvetica");
  });

  it("container要素やframe要素にはfontSizeが適用されない", () => {
    const testFile = path.join(testDataDir, "non-text-elements.json");
    const testData = {
      type: "deck",
      defaults: {
        fontSize: "14pt"
      },
      slides: [
        {
          type: "slide",
          children: [
            { 
              type: "container",
              children: []
            },
            {
              type: "frame",
              style: { backgroundColor: "#ffffff" }
            }
          ]
        }
      ]
    };
    fs.writeFileSync(testFile, JSON.stringify(testData));

    const result = SlideDataLoader.loadFromFile(testFile);
    const container = result.slides[0].children?.[0];
    const frame = result.slides[0].children?.[1];

    // text/heading以外の要素にはfontSizeが適用されない
    expect(container?.style?.fontSize).toBeUndefined();
    expect(frame?.style?.fontSize).toBeUndefined();
  });

  it("ネストされた要素にもデフォルト値が適用される", () => {
    const testFile = path.join(testDataDir, "nested-defaults.json");
    const testData = {
      type: "deck",
      defaults: {
        fontSize: "12pt",
        color: "#000000"
      },
      slides: [
        {
          type: "slide",
          children: [
            {
              type: "container",
              children: [
                {
                  type: "frame",
                  children: [
                    { type: "text", content: "ネストされたテキスト" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    fs.writeFileSync(testFile, JSON.stringify(testData));

    const result = SlideDataLoader.loadFromFile(testFile);
    const nestedText = result.slides[0].children?.[0]?.children?.[0]?.children?.[0];

    expect(nestedText?.style?.fontSize).toBe("12pt");
    expect(nestedText?.style?.color).toBe("#000000");
  });
});