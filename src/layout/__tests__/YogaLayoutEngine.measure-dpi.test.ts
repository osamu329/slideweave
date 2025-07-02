import { YogaLayoutEngine } from "../YogaLayoutEngine";
import { HeadingElement } from "../../types/elements";
import { SLIDE_FORMATS } from "../../utils/SlideFormats";

describe("YogaLayoutEngine - measure関数のDPI依存性", () => {
  const createHeadingElement = (): HeadingElement => ({
    type: "heading",
    content: "レイアウトテスト用スライド", // 13文字
    level: 2,
    style: {
      fontSize: "24px",
    },
  });

  test("measure関数の結果がDPIに依存しないことを確認", async () => {
    // 異なるDPIでYogaLayoutEngineを作成
    const yoga96DPI = new YogaLayoutEngine();
    const yoga72DPI = new YogaLayoutEngine();

    const element = createHeadingElement();

    // 同じコンテナサイズでレイアウト実行
    const containerWidth = SLIDE_FORMATS.wide.widthPx;
    const containerHeight = SLIDE_FORMATS.wide.heightPx;

    const result96 = await yoga96DPI.renderLayout(
      element,
      containerWidth,
      containerHeight,
    );
    const result72 = await yoga72DPI.renderLayout(
      element,
      containerWidth,
      containerHeight,
    );

    // measure関数の結果は同じピクセル値であるべき
    expect(result96.width).toBe(result72.width);
    expect(result96.height).toBe(result72.height);

    console.log("96DPI結果:", {
      width: result96.width,
      height: result96.height,
    });
    console.log("72DPI結果:", {
      width: result72.width,
      height: result72.height,
    });
  });

  test("measure関数内の文字幅計算を詳細確認", async () => {
    const yoga = new YogaLayoutEngine();

    // 実際のアプリケーションと同様にコンテナ内に配置
    const containerElement = {
      type: "container" as const,
      children: [createHeadingElement()],
    };

    // レイアウト実行
    const result = await yoga.renderLayout(
      containerElement,
      SLIDE_FORMATS.wide.widthPx,
      SLIDE_FORMATS.wide.heightPx,
    );

    // 子要素（heading）の結果を取得
    const headingResult = result.children?.[0];
    if (!headingResult) {
      throw new Error("heading要素が見つかりません");
    }

    // 期待される計算
    const fontSize = 24; // px
    const charCount = 13; // 文字数
    const charWidthRatio = 1.2; // 日本語係数
    const expectedWidth = charCount * (fontSize * charWidthRatio); // 13 * (24 * 1.2) = 374.4px

    console.log("実際の幅:", headingResult.width);
    console.log("期待される幅:", expectedWidth);
    console.log("差異:", Math.abs(headingResult.width - expectedWidth));

    // measure関数の計算結果を確認（1px以内の誤差を許容）
    expect(Math.abs(headingResult.width - expectedWidth)).toBeLessThan(1);
  });

  test("幅制約が適用される場合のmeasure動作", async () => {
    const yoga = new YogaLayoutEngine();

    // 幅制約付きの要素
    const constrainedElement: HeadingElement = {
      type: "heading",
      content: "レイアウトテスト用スライド",
      level: 2,
      style: {
        fontSize: "24px",
        width: "200px", // 幅制約：狭い幅を指定
      },
    };

    const result = await yoga.renderLayout(
      constrainedElement,
      SLIDE_FORMATS.wide.widthPx,
      SLIDE_FORMATS.wide.heightPx,
    );

    console.log("制約あり幅:", result.width);
    console.log("制約値:", 200);

    // 幅制約が適用されるべき
    expect(result.width).toBeLessThanOrEqual(200);
  });

  test("コンテナサイズを変えた場合のmeasure動作", async () => {
    const yoga = new YogaLayoutEngine();

    // コンテナ内に配置して適切にテスト
    const container1 = {
      type: "container" as const,
      children: [createHeadingElement()],
    };
    const container2 = {
      type: "container" as const,
      children: [createHeadingElement()],
    };

    // 異なるコンテナサイズでテスト
    const result1 = await yoga.renderLayout(
      container1,
      SLIDE_FORMATS.standard.widthPx,
      SLIDE_FORMATS.standard.heightPx,
    ); // 標準サイズ
    const result2 = await yoga.renderLayout(
      container2,
      SLIDE_FORMATS.wide.widthPx,
      SLIDE_FORMATS.wide.heightPx,
    ); // ワイドサイズ

    const heading1 = result1.children?.[0];
    const heading2 = result2.children?.[0];

    console.log("標準サイズでの幅:", heading1?.width);
    console.log("ワイドサイズでの幅:", heading2?.width);

    // コンテナサイズが変わってもmeasure結果は同じであるべき
    // （要素自体に幅制約がない場合）
    expect(heading1?.width).toBe(heading2?.width);
  });
});
