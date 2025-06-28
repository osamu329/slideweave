import { SVGGenerator } from '../SVGGenerator';

describe('SVGGenerator', () => {
  let generator: SVGGenerator;

  beforeEach(() => {
    generator = new SVGGenerator();
  });

  describe('createSVG', () => {
    it('should create SVG with specified dimensions', () => {
      const svg = generator.createSVG(100, 50);
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="100"');
      expect(svg).toContain('height="50"');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should create valid SVG structure', () => {
      const svg = generator.createSVG(200, 100);
      
      expect(svg).toMatch(/<svg[^>]*>.*<\/svg>/s);
    });
  });

  describe('createRect', () => {
    it('should create rectangle with basic properties', () => {
      const rect = generator.createRect({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        fill: '#ff0000'
      });
      
      expect(rect).toContain('<rect');
      expect(rect).toContain('x="10"');
      expect(rect).toContain('y="20"');
      expect(rect).toContain('width="100"');
      expect(rect).toContain('height="50"');
      expect(rect).toContain('fill="#ff0000"');
    });

    it('should create rectangle with rounded corners', () => {
      const rect = generator.createRect({
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        fill: '#0000ff',
        rx: 10,
        ry: 10
      });
      
      expect(rect).toContain('rx="10"');
      expect(rect).toContain('ry="10"');
    });

    it('should create rectangle without fill when not specified', () => {
      const rect = generator.createRect({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      
      expect(rect).toContain('<rect');
      expect(rect).not.toContain('fill=');
    });
  });

  describe('generateFrameSVG', () => {
    it('should generate SVG for frame with background color', () => {
      const svg = generator.generateFrameSVG({
        width: 200,
        height: 100,
        backgroundColor: '#ff0000'
      });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="100"');
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('<rect');
    });

    it('should generate SVG with # prefix for hex colors without #', () => {
      const svg = generator.generateFrameSVG({
        width: 200,
        height: 100,
        backgroundColor: 'ff0000'
      });
      
      expect(svg).toContain('fill="#ff0000"');
    });

    it('should generate SVG for frame with rounded corners', () => {
      const svg = generator.generateFrameSVG({
        width: 300,
        height: 200,
        backgroundColor: '#00ff00',
        borderRadius: 16
      });
      
      expect(svg).toContain('rx="16"');
      expect(svg).toContain('ry="16"');
    });

    it('should generate transparent frame when no backgroundColor', () => {
      const svg = generator.generateFrameSVG({
        width: 100,
        height: 100
      });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<rect');
      expect(svg).toContain('fill="none"');
    });
  });
});