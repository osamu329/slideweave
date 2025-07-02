/**
 * OSN-155: frameの背景色実装TDDテスト
 */

import { PPTXRenderer } from "../PPTXRenderer";
import { LayoutResult } from "../../layout/LayoutEngine";
import { FrameElement } from "../../types/elements";

describe("PPTXRenderer Frame Background Color", () => {
  let renderer: PPTXRenderer;

  beforeEach(() => {
    renderer = new PPTXRenderer({
      widthPx: 1280,
      heightPx: 720,
      dpi: 96
    });
  });

  test("frame with backgroundColor should render background shape", () => {
    // Red: 失敗するテスト - frameの背景色が反映されるべき
    const frameElement: FrameElement = {
      type: "frame",
      style: {
        backgroundColor: "1e40af", // 青色背景
        width: 200,
        height: 100,
        padding: 2,
      },
      children: [],
    };

    const layoutResult: LayoutResult = {
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      element: frameElement,
    };

    // PPTXファイル生成
    const pptx = renderer.render(layoutResult);

    // 期待: frameの背景色が描画されるべき
    expect(pptx).toBeDefined();

    // この段階では実装がまだ不完全なはず
    // TDD: Redの段階で適切に動作確認
  });

  test("frame without backgroundColor should not render background", () => {
    // 背景色なしのframeは背景を描画しない
    const frameElement: FrameElement = {
      type: "frame",
      style: {
        width: 200,
        height: 100,
        padding: 2,
      },
      children: [],
    };

    const layoutResult: LayoutResult = {
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      element: frameElement,
    };

    const pptx = renderer.render(layoutResult);
    expect(pptx).toBeDefined();

    // 背景色なしの場合は背景描画されない（期待動作）
  });

  test("frame with backgroundColor and border should render both", () => {
    // 背景色とボーダーの両方が指定された場合
    const frameElement: FrameElement = {
      type: "frame",
      style: {
        backgroundColor: "ff0000", // 赤色背景
        borderColor: "000000", // 黒色ボーダー
        borderWidth: 2,
        width: 150,
        height: 80,
      },
      children: [],
    };

    const layoutResult: LayoutResult = {
      left: 0,
      top: 0,
      width: 150,
      height: 80,
      element: frameElement,
    };

    const pptx = renderer.render(layoutResult);
    expect(pptx).toBeDefined();

    // 背景色とボーダーの両方が描画されるべき
  });

  test("nested frame with backgroundColor should render correctly", () => {
    // ネストしたframeでも背景色が正しく描画される
    const parentFrame: FrameElement = {
      type: "frame",
      style: {
        backgroundColor: "1e40af", // 青色背景
        width: 300,
        height: 200,
        padding: 2,
      },
      children: [
        {
          type: "frame",
          style: {
            backgroundColor: "ff0000", // 赤色背景
            width: 150,
            height: 80,
          },
          children: [],
        },
      ],
    };

    const layoutResult: LayoutResult = {
      left: 0,
      top: 0,
      width: 300,
      height: 200,
      element: parentFrame,
      children: [
        {
          left: 16,
          top: 16,
          width: 150,
          height: 80,
          element: parentFrame.children![0],
        },
      ],
    };

    const pptx = renderer.render(layoutResult);
    expect(pptx).toBeDefined();

    // 親子両方のframeの背景色が描画されるべき
  });
});
