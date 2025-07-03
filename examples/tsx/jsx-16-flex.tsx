/**
 * Flexbox プロパティの包括的テストケース集
 * test16シリーズのflexプロパティテストケースをまとめたTSXファイル
 * 元のJSONファイルの値を正確に再現
 */

import { createSlideElement, Fragment } from '../../src/jsx/index';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment };

// JSX構文でスライドを定義 - 元のJSONファイルの値を正確に再現
const slides = [
  // 1. test16-1-flex-aligncontent-deck.json
  (
    <slide title="AlignContent: flex-start">
      <text content="AlignContent: flex-start" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "250px",
          padding: "10px",
          margin: "50px",
          alignContent: "flex-start",
          flexWrap: "wrap",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#4ECDC4"
        }} />
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#45B7D1"
        }} />
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#96CEB4"
        }} />
      </frame>
    </slide>
  ),

  // 2. test16-2-flex-alignself-deck.json
  (
    <slide title="AlignSelf: center">
      <text content="AlignSelf: center" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "250px",
          padding: "10px",
          margin: "50px",
          alignItems: "flex-start",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          alignSelf: "center",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#4ECDC4"
        }} />
      </frame>
    </slide>
  ),

  // 3. test16-3-flex-flexbasis-deck.json
  (
    <slide title="FlexBasis: 50px">
      <text content="FlexBasis: 50px" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          padding: "10px",
          margin: "50px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          flexBasis: "50px",
          backgroundColor: "#FF6B6B"
        }} />
      </frame>
    </slide>
  ),

  // 4. test16-4-flex-flexgrow-deck.json
  (
    <slide title="FlexGrow: 0.25 vs 0.75">
      <text content="FlexGrow: 0.25 vs 0.75" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          padding: "10px",
          margin: "50px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          flexGrow: 0.25,
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          flexGrow: 0.75,
          backgroundColor: "#4ECDC4"
        }} />
      </frame>
    </slide>
  ),

  // 5. test16-5-flex-flexshrink-deck.json
  (
    <slide title="FlexShrink: 5 vs 10">
      <text content="FlexShrink: 5 vs 10" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          padding: "10px",
          margin: "50px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          flexShrink: 5,
          height: "150px",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          flexShrink: 10,
          height: "150px",
          backgroundColor: "#4ECDC4"
        }} />
      </frame>
    </slide>
  ),

  // 6. test16-6-flex-flexdirection-deck.json
  (
    <slide title="FlexDirection: column">
      <text content="FlexDirection: column" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          padding: "10px",
          margin: "50px",
          flexDirection: "column",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#4ECDC4"
        }} />
      </frame>
    </slide>
  ),

  // 7. test16-7-flex-gap-deck.json
  (
    <slide title="Gap: 10px with flexWrap">
      <text content="Gap: 10px with flexWrap" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "250px",
          padding: "10px",
          margin: "50px",
          flexWrap: "wrap",
          gap: "10px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#4ECDC4"
        }} />
        <frame style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#45B7D1"
        }} />
        <frame style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#96CEB4"
        }} />
        <frame style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#FFEAA7"
        }} />
      </frame>
    </slide>
  ),

  // 8. test16-8-flex-inset-deck.json
  (
    <slide title="Inset: top/left positioning">
      <text content="Inset: top/left positioning" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          margin: "50px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          height: "50px",
          width: "50px",
          top: "50px",
          left: "50px",
          backgroundColor: "#FF6B6B"
        }} />
      </frame>
    </slide>
  ),

  // 9. test16-9-flex-justifycontent-deck.json
  (
    <slide title="JustifyContent: flex-start">
      <text content="JustifyContent: flex-start" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          padding: "10px",
          margin: "50px",
          justifyContent: "flex-start",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          height: "50px",
          width: "50px",
          backgroundColor: "#4ECDC4"
        }} />
      </frame>
    </slide>
  ),

  // 10. test16-10-flex-position-deck.json
  (
    <slide title="Position: relative">
      <text content="Position: relative" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "200px",
          padding: "10px",
          margin: "50px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          height: "50px",
          top: "20px",
          position: "relative",
          backgroundColor: "#FF6B6B"
        }} />
      </frame>
    </slide>
  ),

  // 11. test16-11-flex-minmax-deck.json
  (
    <slide title="Min-Max Width and Height">
      <text content="Min-Max Width and Height" style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px" }} />
      <frame
        style={{
          width: "200px",
          height: "250px",
          padding: "10px",
          margin: "50px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#666666"
        }}
      >
        <frame style={{
          margin: "5px",
          height: "25px",
          backgroundColor: "#FF6B6B"
        }} />
        <frame style={{
          margin: "5px",
          height: "100px",
          maxHeight: "25px",
          backgroundColor: "#4ECDC4"
        }} />
        <frame style={{
          margin: "5px",
          height: "25px",
          minHeight: "50px",
          backgroundColor: "#45B7D1"
        }} />
        <frame style={{
          margin: "5px",
          height: "25px",
          maxWidth: "25px",
          backgroundColor: "#96CEB4"
        }} />
        <frame style={{
          margin: "5px",
          height: "25px",
          width: "25px",
          minWidth: "50px",
          backgroundColor: "#FFEAA7"
        }} />
      </frame>
    </slide>
  )
];

// SlideWeave形式のJSONとして出力
const slideData = {
  type: "deck",
  title: "Flexbox Properties Test Deck",
  format: "wide",
  description: "test16シリーズのflexプロパティテストケースをまとめたテストデッキ",
  slides: slides
};

// 直接実行時のみconsole.log出力
if (!process.env.SLIDEWEAVE_OUTPUT_PATH) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;