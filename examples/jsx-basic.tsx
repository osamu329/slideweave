/**
 * JSX基本テスト用スライド
 * createSlideElement関数を使用したJSXライクな記述テスト
 */

import { createSlideElement, Fragment } from '../src/jsx/index';

// JSX構文のテスト
const slide = (
  <slide style={{ padding: 16 }}>
    <heading level={1} fontSize={24} style={{ marginBottom: 16 }}>
      JSX Test Slide
    </heading>
    
    <container style={{ flexDirection: 'row', gap: 16 }}>
      <container style={{ flex: 1, backgroundColor: '#f0f8ff', padding: 12 }}>
        <text fontSize={16}>左カラムのコンテンツ</text>
      </container>
      
      <container style={{ flex: 1, backgroundColor: '#fff0f0', padding: 12 }}>
        <text fontSize={16}>右カラムのコンテンツ</text>
      </container>
    </container>
    
    <text 
      style={{ 
        marginTop: 16, 
        fontSize: 14, 
        color: '#666'
      }}
    >
      JSXライクな記述でSlideWeaveスライドを作成できます。
    </text>
  </slide>
);

// 生成されたオブジェクトの確認
console.log('Generated JSX Object:', JSON.stringify(slide, null, 2));

// SlideWeave形式のJSONとして出力
const slideData = {
  title: "JSX Basic Test",
  description: "JSX Factory関数を使用した基本的なスライド作成テスト",
  slides: [slide]
};

export default slideData;