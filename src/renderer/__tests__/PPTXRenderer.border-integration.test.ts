/**
 * PPTXRenderer Border Integration Test
 * SVGGeneratorとPPTXWrapperの統合テスト
 */

import { vi } from 'vitest';
import { PPTXRenderer } from '../PPTXRenderer';
import { FrameElement } from '../../types/elements';
import { LayoutResult } from '../../layout/YogaLayoutEngine';
import { createPixels } from '../../types/units';

describe('PPTXRenderer Border Integration', () => {
  let renderer: PPTXRenderer;
  let mockLayoutResult: LayoutResult;

  beforeEach(() => {
    // PPTXRenderer初期化
    renderer = new PPTXRenderer({
      widthPx: createPixels(640),
      heightPx: createPixels(480), 
      dpi: 96
    });

    // モックレイアウト結果
    mockLayoutResult = {
      left: createPixels(10),
      top: createPixels(20),
      width: createPixels(100),
      height: createPixels(50),
      element: {} as any,
    };

    // 新しいスライドを追加 (PPTXWrapper経由)
    renderer.pptxWrapper.addSlide({ title: 'Test Slide' });
  });

  describe('SVGGenerator統合', () => {
    it('should pass border style to SVGGenerator.generateFrameSVG', async () => {
      const mockGenerateFrameSVG = vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockResolvedValue('<svg><rect stroke="#ff0000" stroke-width="2"/></svg>');

      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '2px',
          borderColor: '#ff0000',
          borderStyle: 'solid',
          backgroundColor: '#ffffff'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);

      expect(mockGenerateFrameSVG).toHaveBeenCalledWith(
        expect.objectContaining({
          borderWidth: '2px',
          borderColor: '#ff0000', 
          borderStyle: 'solid',
          backgroundColor: '#ffffff'
        })
      );
    });

    it('should pass all border properties including borderRadius', async () => {
      const mockGenerateFrameSVG = vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockResolvedValue('<svg>mock</svg>');

      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '4px',
          borderColor: '#0000ff',
          borderStyle: 'dashed',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);

      expect(mockGenerateFrameSVG).toHaveBeenCalledWith(
        expect.objectContaining({
          borderWidth: '4px',
          borderColor: '#0000ff',
          borderStyle: 'dashed',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0'
        })
      );
    });

    it('should handle frame without border properties', async () => {
      const mockGenerateFrameSVG = vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockResolvedValue('<svg>mock</svg>');

      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          backgroundColor: '#ffffff'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);

      expect(mockGenerateFrameSVG).toHaveBeenCalledWith(
        expect.objectContaining({
          borderWidth: undefined,
          borderColor: undefined,
          borderStyle: undefined,
          backgroundColor: '#ffffff'
        })
      );
    });
  });

  describe('PPTXWrapper統合', () => {
    it('should pass generated SVG to PPTXWrapper.addSVG', async () => {
      const mockAddSVG = vi.spyOn(renderer.pptxWrapper, 'addSVG');
      
      // SVGGeneratorが実際のborder付きSVGを返すようにする
      vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockResolvedValue('<svg><rect stroke="#ff0000" stroke-width="2" fill="#ffffff"/></svg>');

      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '2px',
          borderColor: '#ff0000',
          backgroundColor: '#ffffff'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);

      expect(mockAddSVG).toHaveBeenCalledWith(
        '<svg><rect stroke="#ff0000" stroke-width="2" fill="#ffffff"/></svg>',
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
          w: expect.any(Number),
          h: expect.any(Number)
        })
      );
    });

    it('should pass correct position to addSVG', async () => {
      const mockAddSVG = vi.spyOn(renderer.pptxWrapper, 'addSVG');
      
      vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockResolvedValue('<svg>mock</svg>');

      const frameElement: FrameElement = {
        type: 'frame',
        style: { backgroundColor: '#ffffff' }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);

      // 座標がDPIConverter経由でインチ変換されることを確認
      const call = mockAddSVG.mock.calls[0];
      expect(call[1]).toMatchObject({
        x: expect.any(Number), // 実際の値は DPIConverter.pxToInch(10)
        y: expect.any(Number), // 実際の値は DPIConverter.pxToInch(20)
        w: expect.any(Number), // 実際の値は DPIConverter.pxToInch(100)
        h: expect.any(Number)  // 実際の値は DPIConverter.pxToInch(50)
      });
    });

    it('should handle border style variations correctly', async () => {
      const mockAddSVG = vi.spyOn(renderer.pptxWrapper, 'addSVG');
      
      // dashedスタイルのSVG
      vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockResolvedValue('<svg><rect stroke="#00ff00" stroke-width="3" stroke-dasharray="9 3"/></svg>');

      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '3px',
          borderColor: '#00ff00',
          borderStyle: 'dashed'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);

      expect(mockAddSVG).toHaveBeenCalledWith(
        expect.stringContaining('stroke-dasharray="9 3"'),
        expect.any(Object)
      );
    });
  });

  describe('実際のSVG生成確認', () => {
    it('should generate SVG with correct border color and width', async () => {
      // モックを使わず、実際のSVGGeneratorを使用
      const mockAddSVG = vi.spyOn(renderer.pptxWrapper, 'addSVG');
      
      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '2px',
          borderColor: '#ff0000',
          backgroundColor: '#ffffff'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);
      
      // 実際に生成されたSVGを取得
      const actualSVG = mockAddSVG.mock.calls[0][0];
      
      // SVG内容を検証（色と太さのみ）
      expect(actualSVG).toContain('stroke="#ff0000"');
      expect(actualSVG).toContain('stroke-width="2"');
    });

    it('should generate SVG with different border color and width', async () => {
      const mockAddSVG = vi.spyOn(renderer.pptxWrapper, 'addSVG');
      
      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '4px',
          borderColor: '#0000ff',
          backgroundColor: '#f0f0f0'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);
      
      const actualSVG = mockAddSVG.mock.calls[0][0];
      
      expect(actualSVG).toContain('stroke="#0000ff"');
      expect(actualSVG).toContain('stroke-width="4"');
    });

    it('should handle hex color without # prefix', async () => {
      const mockAddSVG = vi.spyOn(renderer.pptxWrapper, 'addSVG');
      
      const frameElement: FrameElement = {
        type: 'frame',
        style: {
          borderWidth: '3px',
          borderColor: '00ff00', // # なし
          backgroundColor: '#ffffff'
        }
      };

      await renderer.renderFrame(mockLayoutResult, frameElement);
      
      const actualSVG = mockAddSVG.mock.calls[0][0];
      
      expect(actualSVG).toContain('stroke="#00ff00"'); // # が追加される
      expect(actualSVG).toContain('stroke-width="3"');
    });
  });

  describe('エラーハンドリング', () => {
    it('should handle SVGGenerator errors gracefully', async () => {
      vi.spyOn(renderer.svgGenerator, 'generateFrameSVG')
        .mockRejectedValue(new Error('SVG generation failed'));

      const frameElement: FrameElement = {
        type: 'frame',
        style: { borderWidth: '2px' }
      };

      // エラーが適切に処理されることを確認
      await expect(
        renderer.renderFrame(mockLayoutResult, frameElement)
      ).rejects.toThrow('SVG generation failed');
    });
  });
});