import { PPTXRenderer } from "../PPTXRenderer";
import { LayoutResult } from "../../layout/YogaLayoutEngine";
import { FrameElement } from "../../types/elements";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock SVGGenerator to reproduce the actual size issue
vi.mock("../../svg/SVGGenerator", () => ({
  SVGGenerator: vi.fn().mockImplementation(() => ({
    generateFrameSVG: vi.fn().mockImplementation((options) => {
      const { width, height, backgroundColor, borderRadius } = options;

      // Add # prefix for colors without it (like real implementation)
      let fill = backgroundColor || "none";
      if (
        backgroundColor &&
        !backgroundColor.startsWith("#") &&
        backgroundColor !== "none"
      ) {
        fill = `#${backgroundColor}`;
      }

      const rect = borderRadius
        ? `<rect x="0" y="0" width="${width}" height="${height}" fill="${fill}" rx="${borderRadius}" ry="${borderRadius}" />`
        : `<rect x="0" y="0" width="${width}" height="${height}" fill="${fill}" />`;
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${rect}</svg>`;
    }),
  })),
}));

// Mock pptxgenjs
let mockSlideInstance: any;

vi.mock("pptxgenjs", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      mockSlideInstance = {
        addImage: vi.fn(),
        addShape: vi.fn(),
        addText: vi.fn(),
      };

      return {
        addSlide: vi.fn().mockReturnValue(mockSlideInstance),
        defineLayout: vi.fn(),
        layout: "SLIDEWEAVE_LAYOUT",
      };
    })
  };
});

describe("PPTXRenderer - Frame SVG rendering", () => {
  let renderer: PPTXRenderer;

  beforeEach(() => {
    vi.clearAllMocks();
    renderer = new PPTXRenderer({
      widthPx: 1280,
      heightPx: 720,
      dpi: 96
    });
  });

  describe("renderFrame with SVG", () => {
    it("should render frame with SVG background instead of shape", () => {
      const frame: FrameElement = {
        type: "frame",
        style: {
          backgroundColor: "#ff0000",
          width: 25, // 200px in 8px units
          height: 12.5, // 100px in 8px units
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        element: frame,
        left: 0,
        top: 0,
        width: 200,
        height: 100,
        children: [],
      };

      renderer.render(layoutResult);

      // Should call addImage with SVG data instead of addShape
      expect(mockSlideInstance.addImage).toHaveBeenCalled();
      expect(mockSlideInstance.addShape).not.toHaveBeenCalled();

      const imageCall = mockSlideInstance.addImage.mock.calls[0];
      const imageData = imageCall[0].data;

      // Verify SVG content
      expect(imageData).toContain("data:image/svg+xml;base64,");

      // Decode base64 to check SVG content
      const base64Data = imageData.replace("data:image/svg+xml;base64,", "");
      const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");

      expect(svgContent).toContain("<svg");
      expect(svgContent).toContain('width="200"');
      expect(svgContent).toContain('height="100"');
      expect(svgContent).toContain('fill="#ff0000"');
    });

    it("should render frame with rounded corners", () => {
      const frame: FrameElement = {
        type: "frame",
        style: {
          backgroundColor: "#00ff00",
          borderRadius: "16px", // 元々16pxの意図
          width: 37.5, // 300px
          height: 25, // 200px
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        element: frame,
        left: 10,
        top: 20,
        width: 300,
        height: 200,
        children: [],
      };

      renderer.render(layoutResult);

      const imageCall = mockSlideInstance.addImage.mock.calls[0];
      const imageData = imageCall[0].data;

      // Decode base64 to check SVG content
      const base64Data = imageData.replace("data:image/svg+xml;base64,", "");
      const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");

      expect(svgContent).toContain('rx="16"');
      expect(svgContent).toContain('ry="16"');
      expect(svgContent).toContain('fill="#00ff00"');
    });

    it("should render frame without background as transparent SVG", () => {
      const frame: FrameElement = {
        type: "frame",
        style: {
          width: 12.5,
          height: 12.5,
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        element: frame,
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        children: [],
      };

      renderer.render(layoutResult);

      const imageCall = mockSlideInstance.addImage.mock.calls[0];
      const imageData = imageCall[0].data;

      const base64Data = imageData.replace("data:image/svg+xml;base64,", "");
      const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");

      expect(svgContent).toContain('fill="none"');
    });

    it("should position SVG correctly based on layout", () => {
      const frame: FrameElement = {
        type: "frame",
        style: {
          backgroundColor: "#0000ff",
          width: 25, // 25 * 8px = 200px
          height: 18.75, // 18.75 * 8px = 150px
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        element: frame,
        left: 50,
        top: 30,
        width: 200, // Actual layout width in pixels
        height: 150, // Actual layout height in pixels
        children: [],
      };

      renderer.render(layoutResult);

      const imageCall = mockSlideInstance.addImage.mock.calls[0];

      // Position should be in inches (pixels / 72dpi)
      expect(imageCall[0].x).toBeCloseTo(50 / 72, 3); // 50px / 72dpi ≈ 0.694"
      expect(imageCall[0].y).toBeCloseTo(30 / 72, 3); // 30px / 72dpi ≈ 0.417"

      // Size should match the actual layout size, not the SVG logical size
      expect(imageCall[0].w).toBeCloseTo(200 / 72, 3); // 200px / 72dpi ≈ 2.778"
      expect(imageCall[0].h).toBeCloseTo(150 / 72, 3); // 150px / 72dpi ≈ 2.083"

      // But verify-pptx shows: Size: 0.42" x 0.28"
      // This indicates the actual size is much smaller than expected
      // Expected: 2.778" x 2.083"
      // Actual: 0.42" x 0.28"
      // This test should FAIL until we fix the sizing issue
    });

    it("should create SVG with correct dimensions matching layout", () => {
      const frame: FrameElement = {
        type: "frame",
        style: {
          backgroundColor: "#ff0000",
          width: 30, // 30 * 8px = 240px
          height: 20, // 20 * 8px = 160px
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        element: frame,
        left: 0,
        top: 0,
        width: 240, // Should match style width * 8
        height: 160, // Should match style height * 8
        children: [],
      };

      renderer.render(layoutResult);

      const imageCall = mockSlideInstance.addImage.mock.calls[0];

      // Debug: Log actual values to understand the discrepancy
      console.log("addImage call parameters:", {
        x: imageCall[0].x,
        y: imageCall[0].y,
        w: imageCall[0].w,
        h: imageCall[0].h,
        expectedW: 240 / 72,
        expectedH: 160 / 72,
      });

      // The problem: verify-pptx shows image sizes of 0.42" x 0.28" (≈ 30px x 20px)
      // But we expect sizes of 240px/72 = 3.33" and 160px/72 = 2.22"
      // This suggests SVG logical size (30x20) is overriding layout size (240x160)

      expect(imageCall[0].w).toBeCloseTo(240 / 72, 2); // Should be ~3.33"
      expect(imageCall[0].h).toBeCloseTo(160 / 72, 2); // Should be ~2.22"

      // This test should FAIL with current implementation
      // because addImage is using SVG's intrinsic size instead of layout size
    });
  });
});
