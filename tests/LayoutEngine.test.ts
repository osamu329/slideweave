import { renderLayout, flattenLayout } from '../src/layout/LayoutEngine';
import { Element } from '../src/types/elements';

describe('LayoutEngine', () => {
  describe('基本レイアウト計算', () => {
    test('単一container要素の基本レイアウト', () => {
      const element: Element = {
        type: 'container',
        style: { padding: 2 }
      };

      const result = renderLayout(element, 720, 540);
      
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
      // css-layoutではコンテナサイズが適用される
      expect(result.width).toBe(720);
      expect(result.height).toBe(540);
      expect(result.element.type).toBe('container');
    });

    test('containerの縦積み（column direction）が正しく計算される', () => {
      const element: Element = {
        type: 'container',
        style: { padding: 2, direction: 'column' },
        children: [
          { type: 'text', content: 'Hello' },
          { type: 'text', content: 'World' }
        ]
      };

      const result = renderLayout(element);
      
      expect(result.children).toHaveLength(2);
      
      // 縦積みの場合、2番目の要素のtopは1番目の要素の下に配置される
      const firstChild = result.children![0];
      const secondChild = result.children![1];
      
      expect(firstChild.top).toBe(16); // padding: 2 = 16px
      expect(secondChild.top).toBeGreaterThan(firstChild.top);
      expect(secondChild.top).toBe(firstChild.top + firstChild.height);
    });
  });

  describe('スタイル変換', () => {
    test('margin, paddingが正しくピクセル値に変換される', () => {
      const element: Element = {
        type: 'container',
        style: { margin: 3, padding: 2 },
        children: [
          { type: 'text', content: 'Test' }
        ]
      };

      const result = renderLayout(element);
      
      // margin: 3 = 24px, padding: 2 = 16px
      // 子要素は padding分だけ内側に配置される
      expect(result.children![0].left).toBe(16); // padding left
      expect(result.children![0].top).toBe(16);  // padding top
    });

    test('direction: row で横並びレイアウト', () => {
      const element: Element = {
        type: 'container',
        style: { direction: 'row' },
        children: [
          { type: 'text', content: 'Left', fontSize: 14 },
          { type: 'text', content: 'Right', fontSize: 14 }
        ]
      };

      const result = renderLayout(element);
      
      expect(result.children).toHaveLength(2);
      
      const firstChild = result.children![0];
      const secondChild = result.children![1];
      
      // 横並びの場合、2番目の要素のleftは1番目の要素の右に配置される
      expect(firstChild.left).toBe(0);
      expect(secondChild.left).toBeGreaterThan(firstChild.left);
      expect(secondChild.left).toBe(firstChild.left + firstChild.width);
      
      // Y座標は同じ
      expect(firstChild.top).toBe(secondChild.top);
    });
  });

  describe('計算結果の構造', () => {
    test('計算結果に left, top, width, height が含まれる', () => {
      const element: Element = {
        type: 'text',
        content: 'Test'
      };

      const result = renderLayout(element);
      
      expect(result).toHaveProperty('left');
      expect(result).toHaveProperty('top');
      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(typeof result.left).toBe('number');
      expect(typeof result.top).toBe('number');
      expect(typeof result.width).toBe('number');
      expect(typeof result.height).toBe('number');
    });

    test('element プロパティに元の要素が保持される', () => {
      const element: Element = {
        type: 'text',
        content: 'Test Content'
      };

      const result = renderLayout(element);
      
      expect(result.element).toEqual(element);
      expect(result.element.type).toBe('text');
      expect((result.element as any).content).toBe('Test Content');
    });
  });

  describe('ネストしたcontainer', () => {
    test('ネストしたcontainerで正しい座標が計算される', () => {
      const element: Element = {
        type: 'container',
        style: { padding: 1 },
        children: [
          {
            type: 'container',
            style: { padding: 2, margin: 1 },
            children: [
              { type: 'text', content: 'Nested Text' }
            ]
          }
        ]
      };

      const result = renderLayout(element);
      
      expect(result.children).toHaveLength(1);
      
      const outerContainer = result.children![0];
      expect(outerContainer.children).toHaveLength(1);
      
      const innerText = outerContainer.children![0];
      
      // 外側container padding: 1 = 8px
      // 内側container margin: 1 = 8px, padding: 2 = 16px
      // 座標は padding + margin で計算される
      expect(outerContainer.left).toBe(16);  // 外側padding + 内側margin
      expect(outerContainer.top).toBe(16);   // 外側padding + 内側margin
      expect(innerText.left).toBe(16);       // 内側padding
      expect(innerText.top).toBe(16);        // 内側padding
    });
  });

  describe('flattenLayout', () => {
    test('ネストした要素を平坦化して絶対座標を取得', () => {
      const element: Element = {
        type: 'container',
        style: { padding: 1 },
        children: [
          {
            type: 'container',
            style: { padding: 1 },
            children: [
              { type: 'text', content: 'Deep Text' }
            ]
          }
        ]
      };

      const layoutResult = renderLayout(element);
      const flattened = flattenLayout(layoutResult);
      
      expect(flattened).toHaveLength(3); // root + child container + text
      
      // 最深の要素（text）の絶対座標
      const deepText = flattened[2];
      expect(deepText.element.type).toBe('text');
      expect(deepText.left).toBe(16); // 8px + 8px
      expect(deepText.top).toBe(16);  // 8px + 8px
    });
  });
});