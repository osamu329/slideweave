import { PPTXRenderer } from '../PPTXRenderer';
import { LayoutResult } from '../../layout/ILayoutEngine';
import { FrameElement } from '../../types/elements';

describe('PPTXRenderer Frame SVG - Simple Test', () => {
  it('should call SVGGenerator with correct parameters', () => {
    const renderer = new PPTXRenderer();
    
    const frame: FrameElement = {
      type: 'frame',
      style: {
        backgroundColor: 'ff0000',
        borderRadius: 2,
        width: 30,
        height: 20
      },
      children: []
    };

    const layoutResult: LayoutResult = {
      element: frame,
      left: 50,
      top: 30,
      width: 240,  // 30 * 8px
      height: 160, // 20 * 8px
      children: []
    };

    // Extract SVG generation logic to make it testable
    const svgOptions = renderer.extractSVGOptions(layoutResult, frame);
    
    expect(svgOptions).toEqual({
      width: 240,
      height: 160,
      backgroundColor: '#ff0000',  // Should add # prefix
      borderRadius: 16  // 2 * 8px
    });
  });

  it('should convert layout dimensions to PowerPoint inches', () => {
    const renderer = new PPTXRenderer();
    
    const layoutResult: LayoutResult = {
      element: {} as any,
      left: 72,
      top: 144,
      width: 216,
      height: 288,
      children: []
    };

    const position = renderer.convertToInches(layoutResult);
    
    expect(position).toEqual({
      x: 1.0,    // 72px / 72dpi = 1"
      y: 2.0,    // 144px / 72dpi = 2"
      w: 3.0,    // 216px / 72dpi = 3"
      h: 4.0     // 288px / 72dpi = 4"
    });
  });
});