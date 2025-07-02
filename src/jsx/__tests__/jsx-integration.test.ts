/**
 * JSX機能の統合テスト
 * JSX → SlideWeave Element → PPTX生成までの一連の流れをテスト
 */

import { createSlideElement } from "../index";
import type {
  Element,
  SlideElement,
  TextElement,
  HeadingElement,
} from "../../types/elements";

describe("JSX Integration", () => {
  it("JSXからSlideWeave形式に正しく変換される", () => {
    // JSXライクな記述をシミュレート
    const heading = createSlideElement(
      "heading",
      {
        level: 1,
        fontSize: 24,
        style: { marginBottom: 16 },
      },
      "JSX Test Slide",
    );

    const text = createSlideElement(
      "text",
      {
        fontSize: 16,
      },
      "左カラムのコンテンツ",
    );

    const container = createSlideElement(
      "container",
      {
        style: { flex: 1, backgroundColor: "#f0f8ff", padding: 12 },
      },
      text,
    );

    const slide = createSlideElement(
      "slide",
      {
        style: { padding: 16 },
      },
      heading,
      container,
    );

    // 期待される構造
    expect(slide).toEqual({
      type: "slide",
      style: { padding: 16 },
      children: [
        {
          type: "heading",
          level: 1,
          fontSize: 24,
          style: { marginBottom: 16 },
          content: "JSX Test Slide",
        },
        {
          type: "container",
          style: { flex: 1, backgroundColor: "#f0f8ff", padding: 12 },
          children: [
            {
              type: "text",
              fontSize: 16,
              content: "左カラムのコンテンツ",
            },
          ],
        },
      ],
    });
  });

  it("CSS文字列styleが正しく変換される", () => {
    const element = createSlideElement(
      "text",
      {
        style: "font-size: 18px; color: #333; margin-top: 8px;",
      },
      "CSS styled text",
    );

    expect(element).toEqual({
      type: "text",
      style: {
        fontSize: "18px",
        color: "#333",
        marginTop: "8px",
      },
      content: "CSS styled text",
    });
  });

  it("classNameがclassに変換される", () => {
    const element = createSlideElement("container", {
      className: "my-container flex-row",
    });

    expect(element).toEqual({
      type: "container",
      class: "my-container flex-row",
    });
  });

  it("kebab-caseプロパティがcamelCaseに変換される", () => {
    const element = createSlideElement(
      "text",
      {
        "font-size": 16,
        "margin-top": 8,
        "background-color": "red",
      },
      "Kebab case test",
    );

    expect(element).toEqual({
      type: "text",
      fontSize: 16,
      marginTop: 8,
      backgroundColor: "red",
      content: "Kebab case test",
    });
  });

  it("複雑なネスト構造が正しく処理される", () => {
    const leftText = createSlideElement("text", {}, "左カラム");
    const rightText = createSlideElement("text", {}, "右カラム");

    const leftCol = createSlideElement(
      "container",
      { style: { flex: 1 } },
      leftText,
    );
    const rightCol = createSlideElement(
      "container",
      { style: { flex: 1 } },
      rightText,
    );

    const row = createSlideElement(
      "container",
      {
        style: { flexDirection: "row" },
      },
      leftCol,
      rightCol,
    );

    const slide = createSlideElement("slide", {}, row);

    expect(slide).toEqual({
      type: "slide",
      children: [
        {
          type: "container",
          style: { flexDirection: "row" },
          children: [
            {
              type: "container",
              style: { flex: 1 },
              children: [{ type: "text", content: "左カラム" }],
            },
            {
              type: "container",
              style: { flex: 1 },
              children: [{ type: "text", content: "右カラム" }],
            },
          ],
        },
      ],
    });
  });

  it("contentプロパティが既に設定されている場合は優先される", () => {
    const element = createSlideElement(
      "text",
      {
        content: "Original content",
      },
      "Children content",
    );

    expect(element).toEqual({
      type: "text",
      content: "Original content",
      children: ["Children content"],
    });
  });

  it("複数の文字列childrenが結合される", () => {
    const element = createSlideElement("text", {}, "Hello", " ", "World");

    expect(element).toEqual({
      type: "text",
      content: "Hello World",
    });
  });

  it("文字列以外のchildrenはcontentに含まれない", () => {
    const childElement = createSlideElement("text", {}, "Child");
    const element = createSlideElement(
      "heading",
      {},
      "Main heading",
      childElement,
    );

    expect(element).toEqual({
      type: "heading",
      content: "Main heading",
      children: [
        {
          type: "text",
          content: "Child",
        },
      ],
    });
  });

  it("SlideWeaveの全ての要素型が作成できる", () => {
    const elements = [
      createSlideElement("slide", {}),
      createSlideElement("container", {}),
      createSlideElement("frame", {}),
      createSlideElement("text", {}, "Text"),
      createSlideElement("heading", {}, "Heading"),
      createSlideElement("shape", { shapeType: "rectangle" }),
      createSlideElement("list", {}),
      createSlideElement("listItem", {}, "Item"),
      createSlideElement("table", {}),
      createSlideElement("tableRow", {}),
      createSlideElement("tableCell", {}, "Cell"),
      createSlideElement("img", { src: "test.jpg" }),
      createSlideElement("svg", {}, "<svg></svg>"),
    ];

    elements.forEach((element, index) => {
      expect(element.type).toBeDefined();
      expect(typeof element.type).toBe("string");
    });
  });
});
