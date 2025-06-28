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
    expect(twoColumnContainer.width).toBe(640); // 親コンテナ幅
    
    // 左右カラム
    const leftColumn = twoColumnContainer.children![0];
    const rightColumn = twoColumnContainer.children![1];
    
    // 子要素のテキストを取得
    const leftText = leftColumn.children![1];  // テキスト要素
    const rightText = rightColumn.children![1]; // テキスト要素
    
    console.log('コンテナレベル検証:');
    console.log('左カラム:', { left: leftColumn.left, width: leftColumn.width });
    console.log('右カラム:', { left: rightColumn.left, width: rightColumn.width });
    console.log('間隔:', rightColumn.left - (leftColumn.left + leftColumn.width));
    
    console.log('\\nテキストレベル検証:');
    console.log('左テキスト:', { width: leftText.width });
    console.log('右テキスト:', { width: rightText.width });
    
    // 期待値の計算
    const parentWidth = 640;
    const rightMargin = 16; // marginLeft: 2 = 16px
    const availableWidth = parentWidth - rightMargin;
    const expectedColumnWidth = availableWidth / 2; // 312px
    
    // === コンテナレベルの検証 ===
    expect(leftColumn.left).toBe(0);
    expect(leftColumn.width).toBe(expectedColumnWidth); // 312px
    expect(rightColumn.left).toBe(expectedColumnWidth + rightMargin); // 328px
    expect(rightColumn.width).toBe(expectedColumnWidth); // 312px
    
    // === テキストレベルの検証（制約幅を超過してはいけない） ===
    // テキスト要素は親コンテナ幅を超過してはいけない
    expect(leftText.width).toBeLessThanOrEqual(leftColumn.width);
    expect(rightText.width).toBeLessThanOrEqual(rightColumn.width);
    
    // さらに、paddingを考慮すると実際の利用可能幅はもっと狭い
    const padding = 16; // padding: 2 = 16px (左右合計32px)
    const leftAvailableWidth = leftColumn.width - padding * 2;
    const rightAvailableWidth = rightColumn.width - padding * 2;
    
    expect(leftText.width).toBeLessThanOrEqual(leftAvailableWidth);
    expect(rightText.width).toBeLessThanOrEqual(rightAvailableWidth);
    
    // 合計幅の検証
    const totalUsedWidth = leftColumn.width + rightMargin + rightColumn.width;
    expect(totalUsedWidth).toBe(parentWidth);
  });
  
});