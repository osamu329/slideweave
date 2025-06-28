/**
 * SlideWeave 統合テスト
 * 全コンポーネントの連携をテストする end-to-end テスト
 */

import { LayoutEngine } from '../src/layout/LayoutEngine';
import { PPTXRenderer } from '../src/renderer/PPTXRenderer';
import { ElementValidator } from '../src/elements/validator';
import { GridSystem } from '../src/grid/GridSystem';
import { Element, ContainerElement, TextElement } from '../src/types/elements';

describe('SlideWeave 統合テスト', () => {
  describe('基本的な縦積みレイアウト', () => {
    test('2つのテキストが縦に正しく配置されたPPTXが生成される', () => {
      const element: ContainerElement = {
        type: 'container',
        style: { padding: 2 },
        children: [
          { type: 'text', content: 'Hello' },
          { type: 'text', content: 'World' }
        ]
      };

      // 1. バリデーション
      const validationResult = ElementValidator.validate(element);
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);

      // 2. レイアウト計算
      const layoutResult = LayoutEngine.render(element, 720, 540);
      
      // レイアウト結果の基本検証
      expect(layoutResult.element.type).toBe('container');
      expect(layoutResult.children).toHaveLength(2);
      
      const firstText = layoutResult.children![0];
      const secondText = layoutResult.children![1];
      
      // 縦積み配置の確認
      expect(firstText.element.type).toBe('text');
      expect(secondText.element.type).toBe('text');
      expect(secondText.top).toBeGreaterThan(firstText.top);

      // 3. PPTX生成
      const renderer = new PPTXRenderer();
      const pptx = renderer.render(layoutResult);
      
      expect(pptx).toBeDefined();
      expect(typeof pptx.writeFile).toBe('function');
    });

    test('padding: 2 (16px) が正確に反映される', () => {
      const element: ContainerElement = {
        type: 'container',
        style: { padding: 2 },
        children: [
          { type: 'text', content: 'Test Text' }
        ]
      };

      const layoutResult = LayoutEngine.render(element, 720, 540);
      const childElement = layoutResult.children![0];
      
      // padding: 2 = 16px が反映されているか確認
      expect(childElement.left).toBe(16); // padding left
      expect(childElement.top).toBe(16);  // padding top
    });
  });

  describe('座標精度の検証', () => {
    test('座標が8pxグリッドに整列している', () => {
      const element: ContainerElement = {
        type: 'container',
        style: { 
          padding: 3,  // 24px
          margin: 1    // 8px
        },
        children: [
          { 
            type: 'text', 
            content: 'Grid Test',
            style: { margin: 2 } // 16px
          }
        ]
      };

      const layoutResult = LayoutEngine.render(element, 720, 540);
      const childElement = layoutResult.children![0];
      
      // すべての座標が8の倍数であることを確認
      expect(childElement.left % 8).toBe(0);
      expect(childElement.top % 8).toBe(0);
      expect(childElement.width % 8).toBe(0);
      expect(childElement.height % 8).toBe(0);
    });

    test('GridSystemの変換精度', () => {
      // 8px単位の変換精度をテスト
      expect(GridSystem.toPoints(1)).toBe(6);     // 8px = 6pt
      expect(GridSystem.toPoints(2)).toBe(12);    // 16px = 12pt
      expect(GridSystem.toInches(72)).toBe(1.00); // 72pt = 1inch
      
      // PPTXGenJS座標変換
      const position = GridSystem.getPositionOptions(2, 3, 25, 10);
      expect(position).toEqual({
        x: 0.17,  // 2 * 8px * 0.75pt/px / 72pt/inch = 0.17inch
        y: 0.25,  // 3 * 8px * 0.75pt/px / 72pt/inch = 0.25inch
        w: 2.08,  // 25 * 8px * 0.75pt/px / 72pt/inch = 2.08inch
        h: 0.83   // 10 * 8px * 0.75pt/px / 72pt/inch = 0.83inch
      });
    });
  });

  describe('パフォーマンステスト', () => {
    test('100要素のレンダリングが1秒以内に完了する', () => {
      // 100個のテキスト要素を生成
      const children: TextElement[] = Array.from({ length: 100 }, (_, i) => ({
        type: 'text',
        content: `Text ${i + 1}`
      }));

      const element: ContainerElement = {
        type: 'container',
        style: { padding: 1 },
        children
      };

      const startTime = Date.now();
      
      // レイアウト計算
      const layoutResult = LayoutEngine.render(element, 720, 540);
      
      // PPTX生成
      const renderer = new PPTXRenderer();
      const pptx = renderer.render(layoutResult);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // 1秒以内
      expect(layoutResult.children).toHaveLength(100);
      expect(pptx).toBeDefined();
    });
  });

  describe('実際のPPTXファイル生成テスト', () => {
    test('複雑なレイアウトのPPTX生成', () => {
      const element: ContainerElement = {
        type: 'container',
        style: { 
          padding: 2,
          direction: 'column',
          backgroundColor: '#F0F8FF'
        },
        children: [
          {
            type: 'heading',
            content: 'SlideWeave デモ',
            level: 1,
            style: { margin: 1 }
          },
          {
            type: 'container',
            style: { 
              padding: 1,
              direction: 'row'
            },
            children: [
              {
                type: 'text',
                content: '左側のテキスト',
                fontSize: 14,
                color: '0000FF'
              },
              {
                type: 'text',
                content: '右側のテキスト',
                fontSize: 14,
                color: 'FF0000'
              }
            ]
          },
          {
            type: 'text',
            content: 'フッターテキスト',
            fontSize: 12,
            italic: true,
            style: { margin: 1 }
          }
        ]
      };

      // バリデーション
      const validationResult = ElementValidator.validate(element);
      expect(validationResult.isValid).toBe(true);

      // レイアウト計算
      const layoutResult = LayoutEngine.render(element, 720, 540);
      expect(layoutResult.children).toHaveLength(3);

      // PPTX生成
      const renderer = new PPTXRenderer();
      const pptx = renderer.render(layoutResult);
      
      expect(pptx).toBeDefined();
    });
  });

  describe('エラーハンドリング', () => {
    test('無効な要素でのバリデーションエラー', () => {
      const invalidElement = {
        type: 'invalid-type',
        children: []
      };

      const validationResult = ElementValidator.validate(invalidElement);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors.length).toBeGreaterThan(0);
    });

    test('必須プロパティ不足のエラー', () => {
      const invalidElement = {
        type: 'text'
        // content プロパティなし
      };

      const validationResult = ElementValidator.validate(invalidElement);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors.some(e => 
        e.message.includes('contentプロパティが必須')
      )).toBe(true);
    });
  });

  describe('基本動作テスト（受け入れ条件）', () => {
    test('基本動作テストが正常に実行される', () => {
      // Linear issueに記載されている基本動作テスト
      const element: Element = {
        type: 'container',
        style: { padding: 2 },
        children: [
          { type: 'text', content: 'Hello' },
          { type: 'text', content: 'World' }
        ]
      };

      // 1. バリデーション
      const validationResult = ElementValidator.validate(element);
      expect(validationResult.isValid).toBe(true);

      // 2. レイアウト計算
      const layoutResult = LayoutEngine.render(element);
      expect(layoutResult).toBeDefined();
      expect(layoutResult.children).toHaveLength(2);

      // 3. レンダリング
      const renderer = new PPTXRenderer();
      const pptx = renderer.render(layoutResult);
      expect(pptx).toBeDefined();

      // valid PPTX file generated
      expect(typeof pptx.writeFile).toBe('function');
      expect(typeof pptx.write).toBe('function');
    });
  });
});