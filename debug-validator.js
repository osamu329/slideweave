// バリデーター動作の詳細確認用デバッグスクリプト
const { SchemaValidator } = require('./dist/src/elements/SchemaValidator.js');

async function debugValidator() {
  console.log('=== SchemaValidator Debug ===');
  
  try {
    const validator = new SchemaValidator();
    
    // テスト1: heading levelの制限
    console.log('\n1. heading要素のlevel制限テスト');
    const invalidDeckHeading = {
      type: "deck",
      slides: [
        {
          type: "slide",
          children: [
            {
              type: "heading",
              content: "見出し",
              level: 7  // 1-6の範囲外
            }
          ]
        }
      ]
    };
    
    const result1 = validator.validate(invalidDeckHeading);
    console.log('結果:', result1.isValid);
    console.log('エラー詳細:', JSON.stringify(result1.errors, null, 2));
    
    // テスト2: 色値形式チェック
    console.log('\n2. 色値形式チェックテスト');
    const invalidDeckColor = {
      type: "deck",
      slides: [
        {
          type: "slide",
          children: [
            {
              type: "text",
              content: "テキスト",
              style: {
                color: "red"  // #RRGGBB形式でない
              }
            }
          ]
        }
      ]
    };
    
    const result2 = validator.validate(invalidDeckColor);
    console.log('結果:', result2.isValid);
    console.log('エラー詳細:', JSON.stringify(result2.errors, null, 2));
    
    // テスト3: px単位形式チェック
    console.log('\n3. px単位形式チェックテスト');
    const invalidDeckPx = {
      type: "deck",
      slides: [
        {
          type: "slide",
          children: [
            {
              type: "frame",
              style: {
                borderWidth: "10"  // px単位がない
              }
            }
          ]
        }
      ]
    };
    
    const result3 = validator.validate(invalidDeckPx);
    console.log('結果:', result3.isValid);
    console.log('エラー詳細:', JSON.stringify(result3.errors, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugValidator();