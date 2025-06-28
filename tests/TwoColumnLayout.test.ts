/**
 * 2段組みレイアウト（test2-two-column-layout.json）のテスト
 */

import { renderLayout } from '../src/layout/LayoutEngine';
import { SlideDataLoader } from '../src/data/SlideDataLoader';
import * as path from 'path';

describe('TwoColumnLayout', () => {
  test('2段組みレイアウトの完全検証（コンテナ + テキスト）', () => {
    // test2-two-column-layout.jsonを読み込み
    const testFilePath = path.join(__dirname, '../examples/test2-two-column-layout.json');
    const slideData = SlideDataLoader.loadFromFile(testFilePath);
    
    const slide = slideData.slides[0];
    const result = renderLayout(slide, 720, 405);
    
    // 2段組みコンテナ（2番目の子要素）
    const twoColumnContainer = result.children![1];
    expect(twoColumnContainer.element.type).toBe('container');
    expect(twoColumnContainer.width).toBe(688); // 100%幅: 720 - 32px(padding) = 688px
    
    // 左右カラム
    const leftColumn = twoColumnContainer.children![0];
    const rightColumn = twoColumnContainer.children![1];
    
    // 子要素のテキストを取得
    const leftText = leftColumn.children![1];  // テキスト要素
    const rightText = rightColumn.children![1]; // テキスト要素
    
    
    // 期待値の計算（100%幅対応）
    const parentWidth = 688; // 100%幅: 720 - 32px(padding) = 688px
    const rightMargin = 16; // marginLeft: 2 = 16px
    const availableWidth = parentWidth - rightMargin;
    const expectedColumnWidth = availableWidth / 2; // 336px
    
    // === コンテナレベルの検証 ===
    expect(leftColumn.left).toBe(0);
    expect(leftColumn.width).toBe(expectedColumnWidth); // 336px
    expect(rightColumn.left).toBe(expectedColumnWidth + rightMargin); // 352px
    expect(rightColumn.width).toBe(expectedColumnWidth); // 336px
    
    // === テキストレベルの検証（制約幅を超過してはいけない） ===
    // テキスト要素は親コンテナ幅を超過してはいけない（paddingなしの設計）
    expect(leftText.width).toBeLessThanOrEqual(leftColumn.width);
    expect(rightText.width).toBeLessThanOrEqual(rightColumn.width);
    
    // 合計幅の検証
    const totalUsedWidth = leftColumn.width + rightMargin + rightColumn.width;
    expect(totalUsedWidth).toBe(parentWidth);
  });
  
});