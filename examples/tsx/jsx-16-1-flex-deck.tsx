/**
 * Flexbox プロパティの包括的テストケース集（deck要素版）
 * test16シリーズのflexプロパティテストケースをdeck JSX要素で実装
 */

import { createSlideElement, Fragment, Deck } from '../../src/jsx/index';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment };

// 共通スタイル定義
const frameContainerStyle = {
  padding: "10px",
  margin: "50px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#666666"
};

const titleStyle = { 
  fontSize: "18pt", 
  fontWeight: "bold", 
  margin: "10px" 
};

// ColorBoxコンポーネント（ローカルコンポーネント）
const ColorBox = ({ color, style = {} }: { color: string; style?: any }) => (
  <frame style={{
    margin: "5px",
    height: "50px",
    width: "50px",
    backgroundColor: color,
    ...style
  }} />
);

// Deckコンポーネントを使用してスライドデッキを定義
const slideData = (
  <Deck
    title="Flexbox Properties Test Deck"
    format="wide"
    description="test16シリーズのflexプロパティテストケースをまとめたテストデッキ"
    defaults={{
      fontSize: "14pt",
      fontFamily: "Arial",
      color: "#333333"
    }}
  >
    {/* 1. test16-1-flex-aligncontent-deck.json */}
    <slide title="AlignContent: flex-start">
      <heading level={1} style={titleStyle}>AlignContent: flex-start</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "250px",
          alignContent: "flex-start",
          flexWrap: "wrap"
        }}
      >
        <ColorBox color="#FF6B6B" />
        <ColorBox color="#4ECDC4" />
        <ColorBox color="#45B7D1" />
        <ColorBox color="#96CEB4" />
      </frame>
    </slide>

    {/* 2. test16-2-flex-alignself-deck.json */}
    <slide title="AlignSelf: center">
      <heading level={1} style={titleStyle}>AlignSelf: center</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "250px",
          alignItems: "flex-start"
        }}
      >
        <ColorBox color="#FF6B6B" style={{ alignSelf: "center" }} />
        <ColorBox color="#4ECDC4" />
      </frame>
    </slide>

    {/* 3. test16-3-flex-flexbasis-deck.json */}
    <slide title="FlexBasis: 50px">
      <heading level={1} style={titleStyle}>FlexBasis: 50px</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px"
        }}
      >
        <ColorBox color="#FF6B6B" style={{ flexBasis: "50px" }} />
      </frame>
    </slide>

    {/* 4. test16-4-flex-flexgrow-deck.json */}
    <slide title="FlexGrow: 0.25 vs 0.75">
      <heading level={1} style={titleStyle}>FlexGrow: 0.25 vs 0.75</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px"
        }}
      >
        <ColorBox color="#FF6B6B" style={{ flexGrow: 0.25 }} />
        <ColorBox color="#4ECDC4" style={{ flexGrow: 0.75 }} />
      </frame>
    </slide>

    {/* 5. test16-5-flex-flexshrink-deck.json */}
    <slide title="FlexShrink: 5 vs 10">
      <heading level={1} style={titleStyle}>FlexShrink: 5 vs 10</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px"
        }}
      >
        <ColorBox color="#FF6B6B" style={{ flexShrink: 5, height: "150px" }} />
        <ColorBox color="#4ECDC4" style={{ flexShrink: 10, height: "150px" }} />
      </frame>
    </slide>

    {/* 6. test16-6-flex-flexdirection-deck.json */}
    <slide title="FlexDirection: column">
      <heading level={1} style={titleStyle}>FlexDirection: column</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px",
          flexDirection: "column"
        }}
      >
        <ColorBox color="#FF6B6B" />
        <ColorBox color="#4ECDC4" />
      </frame>
    </slide>

    {/* 7. test16-7-flex-gap-deck.json */}
    <slide title="Gap: 10px with flexWrap">
      <heading level={1} style={titleStyle}>Gap: 10px with flexWrap</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "250px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <ColorBox color="#FF6B6B" />
        <ColorBox color="#4ECDC4" />
        <ColorBox color="#45B7D1" />
        <ColorBox color="#96CEB4" />
        <ColorBox color="#FFEAA7" />
      </frame>
    </slide>

    {/* 8. test16-8-flex-inset-deck.json */}
    <slide title="Inset: top/left positioning">
      <heading level={1} style={titleStyle}>Inset: top/left positioning</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px"
        }}
      >
        <ColorBox color="#FF6B6B" style={{ top: "50px", left: "50px" }} />
      </frame>
    </slide>

    {/* 9. test16-9-flex-justifycontent-deck.json */}
    <slide title="JustifyContent: flex-start">
      <heading level={1} style={titleStyle}>JustifyContent: flex-start</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px",
          justifyContent: "flex-start"
        }}
      >
        <ColorBox color="#FF6B6B" />
        <ColorBox color="#4ECDC4" />
      </frame>
    </slide>

    {/* 10. test16-10-flex-position-deck.json */}
    <slide title="Position: relative">
      <heading level={1} style={titleStyle}>Position: relative</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "200px"
        }}
      >
        <ColorBox color="#FF6B6B" style={{ top: "20px", position: "relative" }} />
      </frame>
    </slide>

    {/* 11. test16-11-flex-minmax-deck.json */}
    <slide title="Min-Max Width and Height">
      <heading level={1} style={titleStyle}>Min-Max Width and Height</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "200px",
          height: "250px"
        }}
      >
        <frame style={{ margin: "5px", height: "25px", backgroundColor: "#FF6B6B" }} />
        <frame style={{ margin: "5px", height: "100px", maxHeight: "25px", backgroundColor: "#4ECDC4" }} />
        <frame style={{ margin: "5px", height: "25px", minHeight: "50px", backgroundColor: "#45B7D1" }} />
        <frame style={{ margin: "5px", height: "25px", maxWidth: "25px", backgroundColor: "#96CEB4" }} />
        <frame style={{ margin: "5px", height: "25px", width: "25px", minWidth: "50px", backgroundColor: "#FFEAA7" }} />
      </frame>
    </slide>

    {/* 12. 新しいプロパティのテスト: rowGap/columnGap */}
    <slide title="RowGap and ColumnGap">
      <heading level={1} style={titleStyle}>RowGap: 20px, ColumnGap: 10px</heading>
      <frame
        style={{
          ...frameContainerStyle,
          width: "300px",
          height: "200px",
          flexWrap: "wrap",
          rowGap: "20px",
          columnGap: "10px"
        }}
      >
        <frame style={{ height: "50px", width: "80px", backgroundColor: "#FF6B6B" }} />
        <frame style={{ height: "50px", width: "80px", backgroundColor: "#4ECDC4" }} />
        <frame style={{ height: "50px", width: "80px", backgroundColor: "#45B7D1" }} />
        <frame style={{ height: "50px", width: "80px", backgroundColor: "#96CEB4" }} />
      </frame>
    </slide>
  </Deck>
);

// 直接実行時のみconsole.log出力
if (!process.env.SLIDEWEAVE_OUTPUT_PATH) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;