import { SVGGenerator } from "../SVGGenerator.js";
import { LinearGradient, RadialGradient } from "../../types/elements.js";

describe("SVGGenerator - Gradient Features", () => {
  let svgGenerator: SVGGenerator;

  beforeEach(() => {
    svgGenerator = new SVGGenerator();
  });

  describe("Linear Gradient", () => {
    it("should generate linear gradient SVG with to right direction", async () => {
      const linearGradient: LinearGradient = {
        type: "linearGradient",
        direction: "to right",
        stops: [
          { color: "#FF0000", offset: 0 },
          { color: "#0000FF", offset: 1 },
        ],
      };

      const svg = await svgGenerator.generateFrameSVG({
        width: 400,
        height: 200,
        background: linearGradient,
      });

      expect(svg).toContain('<defs>');
      expect(svg).toContain('linearGradient');
      expect(svg).toContain('x1="0%"');
      expect(svg).toContain('x2="100%"');
      expect(svg).toContain('y1="0%"');
      expect(svg).toContain('y2="0%"');
      expect(svg).toContain('<stop offset="0%" stop-color="#FF0000"');
      expect(svg).toContain('<stop offset="100%" stop-color="#0000FF"');
      expect(svg).toContain('url(#grad');
    });

    it("should generate linear gradient SVG with to bottom direction", async () => {
      const linearGradient: LinearGradient = {
        type: "linearGradient",
        direction: "to bottom",
        stops: [
          { color: "#00FF00", offset: 0 },
          { color: "#FFFF00", offset: 1 },
        ],
      };

      const svg = await svgGenerator.generateFrameSVG({
        width: 400,
        height: 200,
        background: linearGradient,
      });

      expect(svg).toContain('x1="0%"');
      expect(svg).toContain('x2="0%"');
      expect(svg).toContain('y1="0%"');
      expect(svg).toContain('y2="100%"');
      expect(svg).toContain('<stop offset="0%" stop-color="#00FF00"');
      expect(svg).toContain('<stop offset="100%" stop-color="#FFFF00"');
    });

    it("should generate linear gradient SVG with 45deg direction", async () => {
      const linearGradient: LinearGradient = {
        type: "linearGradient",
        direction: "45deg",
        stops: [
          { color: "#FF00FF", offset: 0 },
          { color: "#00FFFF", offset: 0.5 },
          { color: "#FFFF00", offset: 1 },
        ],
      };

      const svg = await svgGenerator.generateFrameSVG({
        width: 400,
        height: 200,
        background: linearGradient,
      });

      expect(svg).toContain('linearGradient');
      expect(svg).toContain('<stop offset="0%" stop-color="#FF00FF"');
      expect(svg).toContain('<stop offset="50%" stop-color="#00FFFF"');
      expect(svg).toContain('<stop offset="100%" stop-color="#FFFF00"');
    });
  });

  describe("Radial Gradient", () => {
    it("should generate radial gradient SVG", async () => {
      const radialGradient: RadialGradient = {
        type: "radialGradient",
        stops: [
          { color: "#FFFFFF", offset: 0 },
          { color: "#000000", offset: 1 },
        ],
      };

      const svg = await svgGenerator.generateFrameSVG({
        width: 400,
        height: 200,
        background: radialGradient,
      });

      expect(svg).toContain('<defs>');
      expect(svg).toContain('radialGradient');
      expect(svg).toContain('cx="50%"');
      expect(svg).toContain('cy="50%"');
      expect(svg).toContain('r="50%"');
      expect(svg).toContain('<stop offset="0%" stop-color="#FFFFFF"');
      expect(svg).toContain('<stop offset="100%" stop-color="#000000"');
      expect(svg).toContain('url(#grad');
    });

    it("should generate radial gradient with multiple stops", async () => {
      const radialGradient: RadialGradient = {
        type: "radialGradient",
        stops: [
          { color: "#FF0000", offset: 0 },
          { color: "#00FF00", offset: 0.3 },
          { color: "#0000FF", offset: 0.7 },
          { color: "#000000", offset: 1 },
        ],
      };

      const svg = await svgGenerator.generateFrameSVG({
        width: 300,
        height: 300,
        background: radialGradient,
      });

      expect(svg).toContain('<stop offset="0%" stop-color="#FF0000"');
      expect(svg).toContain('<stop offset="30%" stop-color="#00FF00"');
      expect(svg).toContain('<stop offset="70%" stop-color="#0000FF"');
      expect(svg).toContain('<stop offset="100%" stop-color="#000000"');
    });
  });

  describe("Background fallback", () => {
    it("should fallback to backgroundColor when background is not provided", async () => {
      const svg = await svgGenerator.generateFrameSVG({
        width: 400,
        height: 200,
        backgroundColor: "#FF5500",
      });

      expect(svg).not.toContain('<defs>');
      expect(svg).not.toContain('gradient');
      expect(svg).toContain('fill="#FF5500"');
    });

    it("should handle no background at all", async () => {
      const svg = await svgGenerator.generateFrameSVG({
        width: 400,
        height: 200,
      });

      expect(svg).not.toContain('<defs>');
      expect(svg).not.toContain('gradient');
      expect(svg).toContain('fill="none"');
    });
  });

  describe("SVG Structure", () => {
    it("should generate valid SVG structure with viewBox", async () => {
      const linearGradient: LinearGradient = {
        type: "linearGradient",
        direction: "to right",
        stops: [
          { color: "#FF0000", offset: 0 },
          { color: "#0000FF", offset: 1 },
        ],
      };

      const svg = await svgGenerator.generateFrameSVG({
        width: 640,
        height: 480,
        background: linearGradient,
      });

      expect(svg).toMatch(/^<svg[^>]*>/);
      expect(svg).toContain('viewBox="0 0 640 480"');
      expect(svg).toContain('width="640"');
      expect(svg).toContain('height="480"');
      expect(svg).toContain('</svg>');
    });
  });
});