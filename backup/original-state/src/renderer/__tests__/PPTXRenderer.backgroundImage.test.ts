import { PPTXRenderer } from '../PPTXRenderer';
import { SlideElement } from '../../types/elements';
import { LayoutResult } from '../../layout/ILayoutEngine';
import PptxGenJS from 'pptxgenjs';

// PPTXGenJSのモック
jest.mock('pptxgenjs');

describe('PPTXRenderer - Background Image', () => {
  let renderer: PPTXRenderer;
  let mockPptx: any;
  let mockSlide: any;

  beforeEach(() => {
    // モックのセットアップ
    mockSlide = {
      addImage: jest.fn(),
      addText: jest.fn(),
      addShape: jest.fn(),
    };
    
    mockPptx = {
      addSlide: jest.fn().mockReturnValue(mockSlide),
      writeFile: jest.fn().mockResolvedValue(undefined),
      defineLayout: jest.fn(),
      layout: 'SLIDEWEAVE_LAYOUT',
    };

    (PptxGenJS as any).mockImplementation(() => mockPptx);
    
    renderer = new PPTXRenderer();
  });

  test('should add background image to slide', () => {
    const slideElement: SlideElement = {
      type: 'slide',
      style: {
        backgroundImage: './tmp/slide1.png',
        padding: 16,
      },
      children: [],
    };

    const layoutResult: LayoutResult = {
      left: 0,
      top: 0,
      width: 960,
      height: 540,
      element: slideElement,
      children: [],
    };

    renderer.render([slideElement], [layoutResult]);

    // 背景画像が追加されることを確認
    expect(mockSlide.addImage).toHaveBeenCalledWith({
      path: './tmp/slide1.png',
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: { type: 'cover', w: 13.333333333333332, h: 7.5 }, // 960x540ピクセル = 13.33x7.5インチ (72DPI)
    });
  });

  test('should handle relative and absolute paths', () => {
    const testCases = [
      { path: './images/bg.png', expected: './images/bg.png' },
      { path: '../assets/bg.jpg', expected: '../assets/bg.jpg' },
      { path: '/absolute/path/bg.png', expected: '/absolute/path/bg.png' },
      { path: 'C:\\Windows\\bg.png', expected: 'C:\\Windows\\bg.png' },
    ];

    testCases.forEach(({ path, expected }) => {
      mockSlide.addImage.mockClear();
      
      const slideElement: SlideElement = {
        type: 'slide',
        style: {
          backgroundImage: path,
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        left: 0,
        top: 0,
        width: 960,
        height: 540,
        element: slideElement,
        children: [],
      };

      renderer.render([slideElement], [layoutResult]);

      expect(mockSlide.addImage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: expected,
        })
      );
    });
  });

  test('should support backgroundSize options', () => {
    const sizeOptions: Array<{ size?: 'cover' | 'contain' | 'fit' | 'none', expected: any }> = [
      {
        size: 'cover',
        expected: { type: 'cover', w: 13.333333333333332, h: 7.5 },
      },
      {
        size: 'contain',
        expected: { type: 'contain', w: 13.333333333333332, h: 7.5 },
      },
      {
        size: 'fit',
        expected: { type: 'crop', w: 13.333333333333332, h: 7.5 },
      },
      {
        size: 'none',
        expected: undefined, // オリジナルサイズ
      },
      {
        size: undefined,
        expected: { type: 'cover', w: 13.333333333333332, h: 7.5 }, // デフォルトはcover
      },
    ];

    sizeOptions.forEach(({ size, expected }) => {
      mockSlide.addImage.mockClear();
      
      const slideElement: SlideElement = {
        type: 'slide',
        style: {
          backgroundImage: './bg.png',
          backgroundSize: size,
        },
        children: [],
      };

      const layoutResult: LayoutResult = {
        left: 0,
        top: 0,
        width: 960,
        height: 540,
        element: slideElement,
        children: [],
      };

      renderer.render([slideElement], [layoutResult]);

      if (expected) {
        expect(mockSlide.addImage).toHaveBeenCalledWith(
          expect.objectContaining({
            sizing: expected,
          })
        );
      } else {
        expect(mockSlide.addImage).toHaveBeenCalledWith(
          expect.not.objectContaining({
            sizing: expect.anything(),
          })
        );
      }
    });
  });

  test('should not add image if backgroundImage is not specified', () => {
    const slideElement: SlideElement = {
      type: 'slide',
      style: {
        padding: 16,
      },
      children: [],
    };

    const layoutResult: LayoutResult = {
      left: 0,
      top: 0,
      width: 960,
      height: 540,
      element: slideElement,
      children: [],
    };

    renderer.render([slideElement], [layoutResult]);

    // 背景画像が追加されないことを確認
    expect(mockSlide.addImage).not.toHaveBeenCalled();
  });

  test('should add background image before other elements', () => {
    const slideElement: SlideElement = {
      type: 'slide',
      style: {
        backgroundImage: './bg.png',
      },
      children: [
        {
          type: 'text',
          content: 'Hello World',
        },
      ],
    };

    const layoutResult: LayoutResult = {
      left: 0,
      top: 0,
      width: 960,
      height: 540,
      element: slideElement,
      children: [
        {
          left: 10,
          top: 10,
          width: 100,
          height: 20,
          element: { type: 'text', content: 'Hello World' },
          children: [],
        },
      ],
    };

    renderer.render([slideElement], [layoutResult]);

    // 呼び出し順序を確認（背景画像が先）
    const calls = mockSlide.addImage.mock.invocationCallOrder[0];
    const textCalls = mockSlide.addText.mock.invocationCallOrder[0];
    
    expect(calls).toBeLessThan(textCalls);
  });
});