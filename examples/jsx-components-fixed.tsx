/**
 * JSX関数コンポーネントのサンプル（修正版）
 * レイアウト崩れを修正し、PowerPoint対応を強化
 */

import { createSlideElement, Fragment } from '../src/jsx/index';
import type { SlideComponent, TwoColumnLayoutProps, CardProps } from '../src/jsx/components';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment };

// 修正版：シンプルなボタンコンポーネント
const Button: SlideComponent<{
  children?: any;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
}> = ({ children, variant = 'primary', size = 'medium' }) => {
  const backgroundColor = variant === 'primary' ? '#007bff' : 
                         variant === 'secondary' ? '#6c757d' :
                         variant === 'success' ? '#28a745' : '#dc3545';
  const padding = size === 'small' ? '8px' : size === 'large' ? '16px' : '12px';
  
  return (
    <frame style={{ 
      backgroundColor, 
      padding, 
      borderRadius: '6px',
      alignSelf: 'flex-start'
    }}>
      <text style={{ color: '#ffffff', fontWeight: 'bold' }}>
        {children}
      </text>
    </frame>
  );
};

// 修正版：シンプルなカードコンポーネント
const Card: SlideComponent<CardProps> = ({ 
  title, 
  children, 
  backgroundColor = '#ffffff', 
  padding = '16px' 
}) => {
  return (
    <frame style={{ 
      backgroundColor, 
      padding, 
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: '#dee2e6'
    }}>
      {title && (
        <heading level={3} style={{ 
          marginBottom: '12px',
          color: '#495057'
        }}>
          {title}
        </heading>
      )}
      {children}
    </frame>
  );
};

// 修正版：2カラムレイアウト
const TwoColumnLayout: SlideComponent<TwoColumnLayoutProps> = ({ 
  left, 
  right, 
  gap = '16px' 
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

// 修正版：シンプルな特徴アイテム
const FeatureItem: SlideComponent<{
  title: string;
  description: string;
  icon?: string;
}> = ({ title, description, icon = '✓' }) => {
  return (
    <container style={{ 
      flexDirection: 'row', 
      gap: '12px',
      marginBottom: '12px'
    }}>
      <frame style={{ 
        width: '24px', 
        height: '24px', 
        backgroundColor: '#007bff',
        borderRadius: '12px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <text style={{ color: '#ffffff', fontSize: '12px' }}>
          {icon}
        </text>
      </frame>
      <container style={{ flex: 1 }}>
        <heading level={4} style={{ 
          marginBottom: '4px',
          color: '#212529',
          fontSize: '16px'
        }}>
          {title}
        </heading>
        <text style={{ 
          color: '#6c757d',
          fontSize: '14px'
        }}>
          {description}
        </text>
      </container>
    </container>
  );
};

// 修正版：ヒーローセクション
const HeroSection: SlideComponent<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  return (
    <container style={{ 
      padding: '24px',
      backgroundColor: '#343a40',
      borderRadius: '8px',
      alignItems: 'center',
      marginBottom: '24px'
    }}>
      <heading level={1} style={{ 
        color: '#ffffff', 
        fontSize: '32px',
        marginBottom: subtitle ? '12px' : '0px',
        textAlign: 'center'
      }}>
        {title}
      </heading>
      {subtitle && (
        <text style={{ 
          color: '#f8f9fa', 
          fontSize: '16px',
          textAlign: 'center'
        }}>
          {subtitle}
        </text>
      )}
    </container>
  );
};

// メインスライド構成（修正版）
const slide = (
  <slide style={{ padding: '24px' }}>
    {/* ヒーローセクション */}
    <HeroSection 
      title="JSXコンポーネント"
      subtitle="シンプルで美しいスライドレイアウト"
    />
    
    {/* 2カラムセクション */}
    <TwoColumnLayout
      left={
        <Card title="主な機能" backgroundColor="#e3f2fd" padding="16px">
          <FeatureItem 
            title="関数コンポーネント"
            description="React風の関数コンポーネントが使用可能"
            icon="🔧"
          />
          <FeatureItem 
            title="Props対応"
            description="プロパティの受け渡しが簡単"
            icon="📦"
          />
          <FeatureItem 
            title="再利用性"
            description="一度作成したコンポーネントを再利用"
            icon="♻️"
          />
        </Card>
      }
      right={
        <Card title="サンプル" backgroundColor="#f3e5f5" padding="16px">
          <text style={{ marginBottom: '16px', fontSize: '14px' }}>
            コンポーネントを組み合わせて、効率的にスライドを作成できます。
          </text>
          <container style={{ gap: '8px' }}>
            <Button variant="primary" size="medium">
              Primary
            </Button>
            <Button variant="secondary" size="small">
              Secondary
            </Button>
            <Button variant="success" size="medium">
              Success
            </Button>
          </container>
        </Card>
      }
      gap="24px"
    />
    
    {/* 利点セクション */}
    <container style={{ 
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      alignItems: 'center'
    }}>
      <heading level={2} style={{ 
        marginBottom: '12px',
        color: '#495057',
        fontSize: '20px',
        textAlign: 'center'
      }}>
        JSXの利点
      </heading>
      <container style={{ 
        flexDirection: 'row',
        gap: '16px',
        justifyContent: 'center'
      }}>
        <container style={{ 
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '6px',
          alignItems: 'center',
          minWidth: '120px'
        }}>
          <text style={{ fontSize: '24px', marginBottom: '4px' }}>⚡</text>
          <text style={{ fontSize: '12px', fontWeight: 'bold' }}>高速開発</text>
        </container>
        <container style={{ 
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '6px',
          alignItems: 'center',
          minWidth: '120px'
        }}>
          <text style={{ fontSize: '24px', marginBottom: '4px' }}>🧩</text>
          <text style={{ fontSize: '12px', fontWeight: 'bold' }}>コンポーネント化</text>
        </container>
        <container style={{ 
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '6px',
          alignItems: 'center',
          minWidth: '120px'
        }}>
          <text style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</text>
          <text style={{ fontSize: '12px', fontWeight: 'bold' }}>型安全性</text>
        </container>
      </container>
    </container>
  </slide>
);

// 生成されたオブジェクトの確認
console.log('Generated Fixed JSX Object:', JSON.stringify(slide, null, 2));

// SlideWeave形式のJSONとして出力
const slideData = {
  title: "JSX Components Fixed",
  description: "レイアウト崩れを修正したJSXコンポーネントサンプル",
  slides: [slide]
};

export default slideData;