/**
 * JSX基本テスト用スライド
 * createSlideElement関数を使用したJSXライクな記述テスト
 */

import { createSlideElement, Fragment } from '../../src/jsx/index';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment };

// JSX構文のテスト
const slide = (
  <slide style={{ padding: "16px" }}>
    <heading level={1} fontSize="24px" style={{ marginBottom: "16px" }}>
      JSX Test Slide
    </heading>
    
    <container style={{ flexDirection: 'row', gap: "16px" }}>
      <container style={{ flex: 1, backgroundColor: '#f0f8ff', padding: "12px" }}>
        <text fontSize="16px">左カラムのコンテンツ</text>
      </container>
      
      <container style={{ flex: 1, backgroundColor: '#fff0f0', padding: "12px" }}>
        <text fontSize="16px">右カラムのコンテンツ</text>
      </container>
    </container>
    
    <text 
      style={{ 
        marginTop: "16px", 
        fontSize: "14px", 
        color: '#666666'
      }}
    >
      JSXライクな記述でSlideWeaveスライドを作成できます。
    </text>
  </slide>
);

// SlideWeave形式のJSONとして出力
const slideData = {
  title: "JSX Basic Test",
  description: "JSX Factory関数を使用した基本的なスライド作成テスト",
  slides: [slide]
};

// 直接実行時のみconsole.log出力（テスト実行時は呼び出し側で処理）
if (!process.env.SLIDEWEAVE_OUTPUT_PATH && import.meta.main) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;