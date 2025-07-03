import { PPTXRenderer } from "../PPTXRenderer";
import { YogaLayoutEngine } from "../../layout/YogaLayoutEngine";
import { SLIDE_FORMATS } from "../../utils/SlideFormats";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Frame Background Color Rendering", () => {
  let renderer: PPTXRenderer;
  let layoutEngine: YogaLayoutEngine;

  beforeEach(() => {
    layoutEngine = new YogaLayoutEngine();
    renderer = new PPTXRenderer({
      widthPx: SLIDE_FORMATS.wide.widthPx,
      heightPx: SLIDE_FORMATS.wide.heightPx,
      dpi: SLIDE_FORMATS.wide.dpi
    });
  });

  // Red phase: This test should fail initially since test9 uses containers
  it("should render frame element with background color correctly", () => {
    const frameData = {
      type: "frame" as const,
      style: {
        width: 100,
        height: 50,
        backgroundColor: "1e40af",
      },
      children: [
        {
          type: "text" as const,
          content: "Test Text",
          style: { fontSize: "14pt" },
          color: "FFFFFF",
        },
      ],
    };

    // Calculate layout using the correct API
    const layoutResult = layoutEngine.renderLayout(frameData, 960, 720);

    // Mock PPTX slide to capture calls
    const mockSlide = {
      addShape: vi.fn(),
      addText: vi.fn(),
      addImage: vi.fn(),
    };

    // Mock the PPTXRenderer render method to track slide creation
    const mockPptx = {
      addSlide: vi.fn().mockReturnValue(mockSlide),
    };

    // Override the private pptx property for testing
    (renderer as any).pptx = mockPptx;
    (renderer as any).currentSlide = mockSlide;

    // Render the layout
    renderer.render(layoutResult);

    // Since frame background isn't implemented yet, this should fail
    expect(mockSlide.addShape).toHaveBeenCalledWith(
      "rect",
      expect.objectContaining({
        fill: { color: "1e40af" },
      }),
    );
  });

  it("should not render background for container elements", () => {
    const containerData = {
      type: "container" as const,
      style: {
        width: 100,
        height: 50,
        backgroundColor: "1e40af", // This should be ignored
      },
      children: [
        {
          type: "text" as const,
          content: "Test Text",
          style: { fontSize: "14pt" },
          color: "FFFFFF",
        },
      ],
    };

    const layoutResult = layoutEngine.renderLayout(containerData, 960, 720);

    const mockSlide = {
      addShape: vi.fn(),
      addText: vi.fn(),
      addImage: vi.fn(),
    };

    const mockPptx = {
      addSlide: vi.fn().mockReturnValue(mockSlide),
    };

    (renderer as any).pptx = mockPptx;
    (renderer as any).currentSlide = mockSlide;

    renderer.render(layoutResult);

    // Container should NOT call addShape for background
    expect(mockSlide.addShape).not.toHaveBeenCalled();
  });
});
