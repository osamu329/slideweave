/**
 * px変換処理のテスト用TSXファイル
 */

import { createSlideElement } from '../../src/jsx/index';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment: () => null };

const slide = (
  <slide style={{ padding: 24 }}>
    <container style={{ 
      backgroundColor: '#f0f8ff',
      padding: 16,
      marginBottom: 12,
      gap: 8
    }}>
      <text style={{ 
        fontSize: 16,
        color: 'black'
      }}>
        px変換テスト - 無次元数値が正しくpxに変換されるかテスト
      </text>
    </container>
  </slide>
);

const slideData = {
  title: "PX Conversion Test",
  description: "無次元数値→px変換のテスト",
  slides: [slide]
};

// 直接実行時のみconsole.log出力（テスト実行時は呼び出し側で処理）
if (!process.env.SLIDEWEAVE_OUTPUT_PATH) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;