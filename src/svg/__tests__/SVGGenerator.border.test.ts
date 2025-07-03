/**
 * SVGGenerator Border Support Test
 * TDD: borderWidth/borderColor/borderStyle 対応テスト
 */

import { SVGGenerator } from "../SVGGenerator";

describe("SVGGenerator Border Support", () => {
  let generator: SVGGenerator;

  beforeEach(() => {
    generator = new SVGGenerator();
  });

  describe("borderWidth support", () => {
    it("should apply borderWidth to SVG stroke-width", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "2px",
        borderColor: "#000000",
        borderStyle: "solid"
      });

      expect(svg).toContain('stroke-width="2"');
      expect(svg).toContain('stroke="#000000"');
    });

    it("should parse different borderWidth units correctly", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "4px",
        borderColor: "#ff0000"
      });

      expect(svg).toContain('stroke-width="4"');
    });
  });

  describe("borderColor support", () => {
    it("should apply borderColor to SVG stroke", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "2px", 
        borderColor: "#ff0000",
        borderStyle: "solid"
      });

      expect(svg).toContain('stroke="#ff0000"');
    });

    it("should handle hex colors without # prefix", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "2px",
        borderColor: "00ff00"
      });

      expect(svg).toContain('stroke="#00ff00"');
    });
  });

  describe("borderStyle support", () => {
    it("should apply solid border style (default)", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "2px",
        borderColor: "#000000",
        borderStyle: "solid"
      });

      // solid はSVGデフォルトなので stroke-dasharray なし
      expect(svg).not.toContain('stroke-dasharray');
    });

    it("should apply dashed border style", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "4px",
        borderColor: "#000000",
        borderStyle: "dashed"
      });

      expect(svg).toContain('stroke-dasharray');
    });

    it("should apply dotted border style", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "2px",
        borderColor: "#000000", 
        borderStyle: "dotted"
      });

      expect(svg).toContain('stroke-dasharray');
    });
  });

  describe("border combinations", () => {
    it("should handle border with borderRadius", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderWidth: "3px",
        borderColor: "#0000ff",
        borderStyle: "solid",
        borderRadius: "8px"
      });

      expect(svg).toContain('stroke-width="3"');
      expect(svg).toContain('stroke="#0000ff"');
      expect(svg).toContain('rx="8"');
    });

    it("should work without backgroundColor (transparent)", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        borderWidth: "2px",
        borderColor: "#ff0000",
        borderStyle: "solid"
      });

      expect(svg).toContain('stroke="#ff0000"');
      expect(svg).toContain('stroke-width="2"');
    });
  });

  describe("border defaults", () => {
    it("should not add stroke attributes when no border specified", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff"
      });

      expect(svg).not.toContain('stroke=');
      expect(svg).not.toContain('stroke-width=');
    });

    it("should require borderWidth for border rendering", async () => {
      const svg = await generator.generateFrameSVG({
        width: 100,
        height: 50,
        backgroundColor: "#ffffff",
        borderColor: "#ff0000" // borderWidth なし
      });

      // borderWidth がないとborderは描画されない
      expect(svg).not.toContain('stroke=');
    });
  });
});