/**
 * 単純なJSXテストケース - レイアウト問題の特定用
 */

import { createSlideElement } from '../../src/jsx/index';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment: () => null };

const slide = (
  <slide style={{ padding: 24 }}>
    <container style={{ 
      backgroundColor: '#e3f2fd',
      padding: 16,
      marginBottom: 16
    }}>
      <heading level={1} style={{ 
        fontSize: 24,
        marginBottom: 8,
        color: 'black'
      }}>
        シンプルテスト
      </heading>
      <text style={{ 
        fontSize: 16,
        color: '#6c757d'
      }}>
        基本的なレイアウトテスト
      </text>
    </container>
    
    <container style={{ 
      flexDirection: 'row',
      gap: 16 
    }}>
      <frame style={{ 
        flex: 1,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 4
      }}>
        <text style={{ color: 'white', fontSize: 14 }}>
          左側のボックス
        </text>
      </frame>
      
      <frame style={{ 
        flex: 1,
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 4
      }}>
        <text style={{ color: 'white', fontSize: 14 }}>
          右側のボックス
        </text>
      </frame>
    </container>
  </slide>
);

const slideData = {
  title: "Simple Layout Test",
  description: "基本レイアウトテスト",
  slides: [slide]
};

// 直接実行時のみconsole.log出力（テスト実行時は呼び出し側で処理）
if (!process.env.SLIDEWEAVE_OUTPUT_PATH && import.meta.main) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;