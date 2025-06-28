/**
 * レイアウトエンジンのwidth/height 8px単位変換テスト
 * 
 * 修正済み: style.width: 30がレイアウト計算で240px (30 * 8) として正しく計算される
 */

import { ContainerElement } from '../../types/elements';
import { YogaLayoutEngine } from '../YogaLayoutEngine';
import { CSSLayoutEngine } from '../CSSLayoutEngine';

describe('LayoutEngine - Width/Height 8px unit conversion', () => {
  
  describe('YogaLayoutEngine', () => {
    const yogaEngine = new YogaLayoutEngine();

    it('should convert width/height from 8px units to pixels in flex context', () => {
      // flexコンテキストで固定サイズが正しく動作することをテスト
      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'row'
        },
        children: [
          {
            type: 'frame',
            style: {
              width: 30,    // 8px units -> should become 240px
              height: 20,   // 8px units -> should become 160px
              backgroundColor: '#ff0000'
            },
            children: []
          }
        ]
      };

      const result = yogaEngine.renderLayout(element, 720, 540);

      // 子frame要素のサイズを確認
      expect(result.children).toHaveLength(1);
      expect(result.children![0].width).toBe(240);  // 30 * 8
      expect(result.children![0].height).toBe(160); // 20 * 8
    });

    it('should convert nested frame dimensions correctly', () => {
      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'column',
          padding: 2     // 8px units -> 16px (already working)
        },
        children: [
          {
            type: 'frame',
            style: {
              width: 25,   // 8px units -> 200px
              height: 15   // 8px units -> 120px
            },
            children: []
          }
        ]
      };

      const result = yogaEngine.renderLayout(element, 720, 540);

      // Child frame: 25*8 = 200px, 15*8 = 120px
      expect(result.children).toHaveLength(1);
      expect(result.children![0].width).toBe(200);
      expect(result.children![0].height).toBe(120);
    });
  });

  describe('CSSLayoutEngine', () => {
    const cssEngine = new CSSLayoutEngine();

    it('should convert width/height from 8px units to pixels in flex context', () => {
      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'row'
        },
        children: [
          {
            type: 'frame',
            style: {
              width: 30,    // 8px units -> should become 240px
              height: 20,   // 8px units -> should become 160px
              backgroundColor: '#ff0000'
            },
            children: []
          }
        ]
      };

      const result = cssEngine.renderLayout(element, 720, 540);

      // 子frame要素のサイズを確認
      expect(result.children).toHaveLength(1);
      expect(result.children![0].width).toBe(240);  // 30 * 8
      expect(result.children![0].height).toBe(160); // 20 * 8
    });

    it('should handle percentage width with 8px height conversion', () => {
      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'row'
        },
        children: [
          {
            type: 'frame',
            style: {
              width: '50%',   // Should remain percentage-based
              height: 25      // 8px units -> 200px
            },
            children: []
          }
        ]
      };

      const result = cssEngine.renderLayout(element, 720, 540);

      expect(result.children).toHaveLength(1);
      // Width should be 50% of container (360px)
      expect(result.children![0].width).toBe(360);
      // Height should be 25 * 8 = 200px
      expect(result.children![0].height).toBe(200);
    });
  });

  describe('Consistency between engines', () => {
    it('should produce identical results for same input', () => {
      const yogaEngine = new YogaLayoutEngine();
      const cssEngine = new CSSLayoutEngine();

      const element: ContainerElement = {
        type: 'container',
        style: {
          direction: 'row',
          margin: 2,     // 8px units -> 16px (already works)
          padding: 1     // 8px units -> 8px (already works)
        },
        children: [
          {
            type: 'frame',
            style: {
              width: 40,     // 8px units -> 320px
              height: 25     // 8px units -> 200px
            },
            children: []
          }
        ]
      };

      const yogaResult = yogaEngine.renderLayout(element, 720, 540);
      const cssResult = cssEngine.renderLayout(element, 720, 540);

      // Both engines should produce same dimensions for child
      expect(yogaResult.children).toHaveLength(1);
      expect(cssResult.children).toHaveLength(1);
      expect(yogaResult.children![0].width).toBe(cssResult.children![0].width);
      expect(yogaResult.children![0].height).toBe(cssResult.children![0].height);
      expect(yogaResult.children![0].width).toBe(320); // 40 * 8
      expect(yogaResult.children![0].height).toBe(200); // 25 * 8
    });
  });
});