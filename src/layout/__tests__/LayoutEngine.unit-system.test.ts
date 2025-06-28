/**
 * 単位システムのテスト（TDD）
 * 
 * 仕様:
 * - 無次元数値: 8pxグリッド単位として扱う
 * - "px"付き文字列: ピクセル単位として扱う
 * - "%"付き文字列: パーセンテージとして扱う（Yogaのみ）
 */

import { ContainerElement } from '../../types/elements';
import { YogaLayoutEngine } from '../YogaLayoutEngine';
import { CSSLayoutEngine } from '../CSSLayoutEngine';

describe('LayoutEngine - Unit System', () => {

  describe('YogaLayoutEngine', () => {
    const yogaEngine = new YogaLayoutEngine();

    describe('8px grid units (dimensionless numbers)', () => {
      it('should convert dimensionless width/height to 8px units', () => {
        const element: ContainerElement = {
          type: 'container',
          style: {
            direction: 'row'
          },
          children: [
            {
              type: 'frame',
              style: {
                width: 30,     // 8px units -> 240px
                height: 20,    // 8px units -> 160px
                margin: 4,     // 8px units -> 32px
                padding: 2     // 8px units -> 16px
              },
              children: []
            }
          ]
        };

        const result = yogaEngine.renderLayout(element, 720, 540);

        expect(result.children).toHaveLength(1);
        const child = result.children![0];
        
        // width: 30 * 8 = 240px
        expect(child.width).toBe(240);
        // height: 20 * 8 = 160px
        expect(child.height).toBe(160);
        
        // margin: 4 * 8 = 32px (applied to positioning)
        expect(child.left).toBe(32); // margin-left
        expect(child.top).toBe(32);  // margin-top
      });

      it('should handle mixed units in nested layout', () => {
        const element: ContainerElement = {
          type: 'container',
          style: {
            direction: 'column',
            width: 50,        // 8px units -> 400px
            height: 40,       // 8px units -> 320px
            padding: 2        // 8px units -> 16px
          },
          children: [
            {
              type: 'frame',
              style: {
                width: 25,      // 8px units -> 200px
                height: 15      // 8px units -> 120px
              },
              children: []
            }
          ]
        };

        const result = yogaEngine.renderLayout(element, 720, 540);

        // Parent container: 50*8 = 400px, 40*8 = 320px
        expect(result.width).toBe(400);
        expect(result.height).toBe(320);

        // Child frame: 25*8 = 200px, 15*8 = 120px
        expect(result.children).toHaveLength(1);
        expect(result.children![0].width).toBe(200);
        expect(result.children![0].height).toBe(120);
        
        // Child positioned with parent padding: 2*8 = 16px
        expect(result.children![0].left).toBe(16);
        expect(result.children![0].top).toBe(16);
      });
    });

    describe('Explicit pixel units', () => {
      it('should use exact pixel values for "px" suffixed strings', () => {
        const element: ContainerElement = {
          type: 'container',
          style: {
            direction: 'row'
          },
          children: [
            {
              type: 'frame',
              style: {
                width: "640px",   // Exact 640px
                height: "480px",  // Exact 480px
                margin: 2,        // 8px units -> 16px (mixed units)
                padding: 1        // 8px units -> 8px (simplified for now)
              },
              children: []
            }
          ]
        };

        const result = yogaEngine.renderLayout(element, 720, 540);

        expect(result.children).toHaveLength(1);
        const child = result.children![0];
        
        // Exact pixel values
        expect(child.width).toBe(640);
        expect(child.height).toBe(480);
        
        // margin: 2 * 8 = 16px (8px units)
        expect(child.left).toBe(16);
        expect(child.top).toBe(16);
      });

      it('should handle percentage values correctly', () => {
        const element: ContainerElement = {
          type: 'container',
          style: {
            direction: 'row',
            width: "720px"    // Container width
          },
          children: [
            {
              type: 'frame',
              style: {
                width: "50%",     // 50% of 720px = 360px
                height: 25        // 8px units -> 200px
              },
              children: []
            }
          ]
        };

        const result = yogaEngine.renderLayout(element, 720, 540);

        expect(result.children).toHaveLength(1);
        const child = result.children![0];
        
        // Width should be 50% of container
        expect(child.width).toBe(360);
        // Height should be 25 * 8 = 200px
        expect(child.height).toBe(200);
      });
    });

    describe('Mixed unit scenarios', () => {
      it('should correctly handle mixed 8px units and pixel units', () => {
        const element: ContainerElement = {
          type: 'container',
          style: {
            direction: 'column',
            width: "960px",   // Exact pixel
            padding: 4        // 8px units -> 32px
          },
          children: [
            {
              type: 'frame',
              style: {
                width: 50,        // 8px units -> 400px
                height: "200px",  // Exact pixel
                margin: 2         // 8px units -> 16px
              },
              children: []
            },
            {
              type: 'frame',
              style: {
                width: "300px",   // Exact pixel
                height: 30,       // 8px units -> 240px
                margin: 2         // 8px units -> 16px
              },
              children: []
            }
          ]
        };

        const result = yogaEngine.renderLayout(element, 720, 540);

        expect(result.width).toBe(960);  // Exact pixel

        expect(result.children).toHaveLength(2);
        
        // First child: mixed units
        const child1 = result.children![0];
        expect(child1.width).toBe(400);   // 50 * 8px
        expect(child1.height).toBe(200);  // Exact 200px
        expect(child1.left).toBe(32);     // Container padding: 4 * 8
        expect(child1.top).toBe(48);      // Container padding + margin: 32 + 16

        // Second child: mixed units
        const child2 = result.children![1];
        expect(child2.width).toBe(300);   // Exact 300px
        expect(child2.height).toBe(240);  // 30 * 8px
      });
    });
  });

  describe('CSSLayoutEngine', () => {
    const cssEngine = new CSSLayoutEngine();

    it('should handle same unit conversions as Yoga', () => {
      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'row'
        },
        children: [
          {
            type: 'frame',
            style: {
              width: 30,        // 8px units -> 240px
              height: "160px"   // Exact pixel
            },
            children: []
          }
        ]
      };

      const result = cssEngine.renderLayout(element, 720, 540);

      expect(result.children).toHaveLength(1);
      const child = result.children![0];
      
      expect(child.width).toBe(240);   // 30 * 8px
      expect(child.height).toBe(160);  // Exact 160px
    });

    // Note: CSS-Layout doesn't support percentages, so we skip those tests
  });

  describe('Cross-engine consistency', () => {
    it('should produce identical results for identical input', () => {
      const yogaEngine = new YogaLayoutEngine();
      const cssEngine = new CSSLayoutEngine();

      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'row',
          padding: 3        // 8px units -> 24px
        },
        children: [
          {
            type: 'frame',
            style: {
              width: 40,        // 8px units -> 320px
              height: "250px",  // Exact pixel
              margin: 2         // 8px units -> 16px
            },
            children: []
          }
        ]
      };

      const yogaResult = yogaEngine.renderLayout(element, 720, 540);
      const cssResult = cssEngine.renderLayout(element, 720, 540);

      // Both engines should produce same child dimensions
      expect(yogaResult.children).toHaveLength(1);
      expect(cssResult.children).toHaveLength(1);
      
      expect(yogaResult.children![0].width).toBe(cssResult.children![0].width);
      expect(yogaResult.children![0].height).toBe(cssResult.children![0].height);
      expect(yogaResult.children![0].width).toBe(320);  // 40 * 8
      expect(yogaResult.children![0].height).toBe(250); // Exact 250px
    });
  });
});