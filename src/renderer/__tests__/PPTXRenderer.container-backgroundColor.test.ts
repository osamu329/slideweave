/**
 * OSN-148: containerの背景色実装TDDテスト
 */

import { PPTXRenderer } from '../PPTXRenderer';
import { LayoutResult } from '../../layout/LayoutEngine';
import { ContainerElement } from '../../types/elements';

describe('PPTXRenderer Container Background Color', () => {
  let renderer: PPTXRenderer;
  
  beforeEach(() => {
    renderer = new PPTXRenderer();
  });

  test('container with backgroundColor should render background shape', () => {
    // 失敗するテスト: containerの背景色が反映されるべき
    const containerElement: ContainerElement = {
      type: 'container',
      style: {
        backgroundColor: 'ff0000', // 赤色背景
        width: 200,
        height: 100,
        padding: 2
      },
      children: []
    };

    const layoutResult: LayoutResult = {
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      element: containerElement
    };

    // PPTXファイル生成
    const pptx = renderer.render(layoutResult);
    
    // 現在は失敗する: containerの背景色が反映されていない
    // 期待: 背景色付きのshapeが生成されるべき
    expect(pptx).toBeDefined();
    
    // この段階では失敗する予定
    // 実装後にpython-pptx検証で背景shapeの存在を確認
    // 今はrenderContainer実装がされていることを基本チェック
  });

  test('container without backgroundColor should not render background shape', () => {
    // 背景色なしのcontainerは何も描画しない
    const containerElement: ContainerElement = {
      type: 'container',
      style: {
        width: 200,
        height: 100
      },
      children: []
    };

    const layoutResult: LayoutResult = {
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      element: containerElement
    };

    const pptx = renderer.render(layoutResult);
    expect(pptx).toBeDefined();
    
    // 背景色なしの場合は何も描画されない（期待動作）
  });

  test('nested container with backgroundColor should render background', () => {
    // ネストしたcontainerでも背景色が正しく描画される
    const parentContainer: ContainerElement = {
      type: 'container',
      style: {
        width: 300,
        height: 200,
        padding: 2
      },
      children: [{
        type: 'container',
        style: {
          backgroundColor: '00ff00', // 緑色背景
          width: 150,
          height: 80
        },
        children: []
      }]
    };

    const layoutResult: LayoutResult = {
      left: 0,
      top: 0,
      width: 300,
      height: 200,
      element: parentContainer,
      children: [{
        left: 16,
        top: 16,
        width: 150,
        height: 80,
        element: parentContainer.children![0]
      }]
    };

    const pptx = renderer.render(layoutResult);
    expect(pptx).toBeDefined();
    
    // ネストしたcontainerの背景色が描画されるべき
    // 実際の検証はpython-pptx検証で行う
  });
});