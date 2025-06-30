/**
 * JSX関数コンポーネントのサンプル
 * 再利用可能なコンポーネントでスライドを構築
 */

import { createSlideElement } from '../src/jsx/index';
import type { SlideComponent, TwoColumnLayoutProps, CardProps } from '../src/jsx/components';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment: () => null };

// 基本的なコンポーネント
const Button: SlideComponent<{
  children?: any;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}> = ({ children, variant = 'primary', size = 'medium' }) => {
  const backgroundColor = variant === 'primary' ? '#007bff' : '#6c757d';
  const padding = size === 'small' ? 6 : size === 'large' ? 12 : 8;
  
  return (
    <frame style={{ 
      backgroundColor, 
      padding, 
      borderRadius: 4,
      alignSelf: 'flex-start'
    }}>
      <text style={{ color: 'white', fontWeight: 'bold' }}>
        {children}
      </text>
    </frame>
  );
};

// カードコンポーネント
const Card: SlideComponent<CardProps> = ({ 
  title, 
  children, 
  backgroundColor = '#f8f9fa', 
  padding = 16 
}) => {
  return (
    <frame style={{ 
      backgroundColor, 
      padding, 
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#dee2e6'
    }}>
      {title && (
        <heading level={3} style={{ 
          marginBottom: 12,
          color: '#495057'
        }}>
          {title}
        </heading>
      )}
      {children}
    </frame>
  );
};

// 2カラムレイアウトコンポーネント
const TwoColumnLayout: SlideComponent<TwoColumnLayoutProps> = ({ 
  left, 
  right, 
  gap = 16 
}) => {
  return (
    <container style={{ flexDirection: 'row', gap }}>
      <container style={{ flex: 1 }}>
        {left}
      </container>
      <container style={{ flex: 1 }}>
        {right}
      </container>
    </container>
  );
};

// ヒーローセクション
const HeroSection: SlideComponent<{
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}> = ({ title, subtitle, backgroundImage }) => {
  return (
    <container style={{ 
      padding: 32,
      backgroundColor: backgroundImage ? 'transparent' : '#343a40',
      backgroundImage,
      backgroundSize: 'cover',
      minHeight: 200,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <heading level={1} style={{ 
        color: 'white', 
        fontSize: 36,
        marginBottom: subtitle ? 16 : 0,
        textAlign: 'center'
      }}>
        {title}
      </heading>
      {subtitle && (
        <text style={{ 
          color: '#f8f9fa', 
          fontSize: 18,
          textAlign: 'center'
        }}>
          {subtitle}
        </text>
      )}
    </container>
  );
};

// 特徴リストコンポーネント
const FeatureList: SlideComponent<{
  features: Array<{ title: string; description: string; icon?: string }>;
}> = ({ features }) => {
  return (
    <container style={{ gap: 16 }}>
      {features.map((feature, index) => (
        <container key={index} style={{ flexDirection: 'row', gap: 12 }}>
          <container style={{ width: 40, alignItems: 'center' }}>
            <frame style={{ 
              width: 32, 
              height: 32, 
              backgroundColor: '#007bff',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <text style={{ color: 'white', fontWeight: 'bold' }}>
                {feature.icon || '✓'}
              </text>
            </frame>
          </container>
          <container style={{ flex: 1 }}>
            <heading level={4} style={{ 
              marginBottom: 4,
              color: '#212529'
            }}>
              {feature.title}
            </heading>
            <text style={{ 
              color: '#6c757d',
              fontSize: 14
            }}>
              {feature.description}
            </text>
          </container>
        </container>
      ))}
    </container>
  );
};

// メインスライド構成
const slide = (
  <slide style={{ padding: 24 }}>
    {/* ヒーローセクション */}
    <HeroSection 
      title="JSXコンポーネントサンプル"
      subtitle="再利用可能なコンポーネントでスライドを構築"
    />
    
    <container style={{ marginTop: 32, gap: 24 }}>
      {/* 2カラムレイアウト */}
      <TwoColumnLayout
        left={
          <Card title="機能紹介" backgroundColor="#e3f2fd">
            <FeatureList 
              features={[
                {
                  title: "関数コンポーネント",
                  description: "React風の関数コンポーネントをサポート",
                  icon: "🔧"
                },
                {
                  title: "Props & Children",
                  description: "プロパティと子要素の受け渡しが可能",
                  icon: "📦"
                },
                {
                  title: "再利用性",
                  description: "一度作成したコンポーネントを何度でも使用",
                  icon: "♻️"
                }
              ]}
            />
          </Card>
        }
        right={
          <Card title="使用例" backgroundColor="#f3e5f5">
            <text style={{ marginBottom: 16 }}>
              コンポーネントを組み合わせて複雑なレイアウトを簡単に作成できます。
            </text>
            <container style={{ gap: 8 }}>
              <Button variant="primary" size="medium">
                プライマリボタン
              </Button>
              <Button variant="secondary" size="small">
                セカンダリボタン
              </Button>
            </container>
          </Card>
        }
        gap={24}
      />
      
      {/* フッター */}
      <container style={{ 
        marginTop: 32,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        alignItems: 'center'
      }}>
        <text style={{ 
          color: '#6c757d',
          fontSize: 12,
          textAlign: 'center'
        }}>
          JSXコンポーネント機能により、保守性と再利用性を向上
        </text>
      </container>
    </container>
  </slide>
);

// 生成されたオブジェクトの確認
console.log('Generated JSX Component Object:', JSON.stringify(slide, null, 2));

// SlideWeave形式のJSONとして出力
const slideData = {
  title: "JSX Components Sample",
  description: "JSX関数コンポーネントを使用した高度なスライド作成サンプル",
  slides: [slide]
};

export default slideData;