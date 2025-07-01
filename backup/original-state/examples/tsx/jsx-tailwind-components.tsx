/**
 * Tailwind ユーティリティクラスを使用したJSXコンポーネントサンプル
 * classNameでTailwind風のスタイル指定が可能
 */

import { createSlideElement, Fragment } from '../../src/jsx/index';
import type { SlideComponent } from '../../src/jsx/components';

// React未定義エラー回避
global.React = { createElement: createSlideElement, Fragment };

// Tailwind classNameを使用したボタンコンポーネント
const TailwindButton: SlideComponent<{
  children?: any;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  
  // サイズ別のクラス
  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-8 text-base', 
    lg: 'p-16 text-lg'
  };
  
  // バリアント別のクラス
  const variantClasses = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white'
  };
  
  const buttonClasses = `
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    rounded-md 
    font-bold
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <frame className={buttonClasses}>
      {children}
    </frame>
  );
};

// Tailwind classNameを使用したカードコンポーネント
const TailwindCard: SlideComponent<{
  children?: any;
  title?: string;
  className?: string;
}> = ({ children, title, className = '' }) => {
  
  const cardClasses = `bg-white p-16 rounded-lg border ${className}`;
  
  return (
    <frame className={cardClasses}>
      {title && (
        <heading level={3} className="mb-8 text-gray-800 font-bold">
          {title}
        </heading>
      )}
      {children}
    </frame>
  );
};

// Grid レイアウトコンポーネント
const TailwindGrid: SlideComponent<{
  children?: any;
  cols?: number;
  gap?: string;
  className?: string;
}> = ({ children, cols = 2, gap = 'gap-16', className = '' }) => {
  
  const gridClasses = `flex flex-row ${gap} ${className}`;
  
  return (
    <container className={gridClasses}>
      {children}
    </container>
  );
};

// レスポンシブなセクションコンポーネント
const Section: SlideComponent<{
  children?: any;
  title?: string;
  className?: string;
}> = ({ children, title, className = '' }) => {
  
  const sectionClasses = `mb-32 ${className}`;
  
  return (
    <container className={sectionClasses}>
      {title && (
        <heading level={2} className="mb-16 text-2xl font-bold text-gray-900">
          {title}
        </heading>
      )}
      {children}
    </container>
  );
};

// アラートコンポーネント（Tailwind版）
const TailwindAlert: SlideComponent<{
  children?: any;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ children, type = 'info', className = '' }) => {
  
  const typeClasses = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700', 
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700'
  };
  
  const alertClasses = `p-16 rounded-md border-l-4 ${typeClasses[type]} ${className}`;
  
  return (
    <frame className={alertClasses}>
      {children}
    </frame>
  );
};

// バッジコンポーネント
const Badge: SlideComponent<{
  children?: any;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  
  const variantClasses = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white', 
    warning: 'bg-yellow-500 text-black',
    danger: 'bg-red-500 text-white'
  };
  
  const badgeClasses = `inline-block px-8 py-4 text-xs font-bold rounded-full ${variantClasses[variant]} ${className}`;
  
  return (
    <frame className={badgeClasses}>
      <text>{children}</text>
    </frame>
  );
};

// メインスライド
const slide = (
  <slide className="p-24 bg-gray-50">
    
    {/* ヘッダー */}
    <container className="text-center mb-32">
      <heading level={1} className="text-4xl font-bold text-gray-900 mb-8">
        Tailwind Components
      </heading>
      <text className="text-lg text-gray-600">
        classNameでTailwind風のスタイル指定が可能になりました
      </text>
    </container>

    {/* ボタンセクション */}
    <Section title="ボタンコンポーネント">
      <TailwindGrid cols={4} gap="gap-8">
        <TailwindButton variant="primary" size="md">
          Primary
        </TailwindButton>
        <TailwindButton variant="secondary" size="md">
          Secondary  
        </TailwindButton>
        <TailwindButton variant="success" size="md">
          Success
        </TailwindButton>
        <TailwindButton variant="danger" size="md">
          Danger
        </TailwindButton>
      </TailwindGrid>
      
      <container className="mt-16">
        <text className="text-sm text-gray-600 mb-8">
          サイズバリエーション:
        </text>
        <TailwindGrid cols={3} gap="gap-8">
          <TailwindButton variant="primary" size="sm">
            Small
          </TailwindButton>
          <TailwindButton variant="primary" size="md">
            Medium
          </TailwindButton>
          <TailwindButton variant="primary" size="lg">
            Large
          </TailwindButton>
        </TailwindGrid>
      </container>
    </Section>

    {/* カードセクション */}
    <Section title="カードコンポーネント">
      <TailwindGrid cols={2} gap="gap-16">
        <TailwindCard title="基本カード" className="shadow-sm">
          <text className="text-gray-600">
            Tailwindクラスを使用したシンプルなカードです。
          </text>
          <container className="mt-8">
            <Badge variant="primary">New</Badge>
          </container>
        </TailwindCard>
        
        <TailwindCard title="カスタムカード" className="shadow-lg border-blue-200">
          <text className="text-gray-600">
            カスタムクラスで追加のスタイリングが可能です。
          </text>
          <container className="mt-8 flex flex-row gap-4">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Beta</Badge>
          </container>
        </TailwindCard>
      </TailwindGrid>
    </Section>

    {/* アラートセクション */}
    <Section title="アラートコンポーネント">
      <container className="space-y-8">
        <TailwindAlert type="info">
          <text className="font-semibold">情報:</text>
          <text> 新機能がリリースされました。詳細をご確認ください。</text>
        </TailwindAlert>
        
        <TailwindAlert type="success">
          <text className="font-semibold">成功:</text>
          <text> 処理が正常に完了しました。</text>
        </TailwindAlert>
        
        <TailwindAlert type="warning">
          <text className="font-semibold">警告:</text>
          <text> この操作には注意が必要です。</text>
        </TailwindAlert>
        
        <TailwindAlert type="error">
          <text className="font-semibold">エラー:</text>
          <text> 予期しないエラーが発生しました。</text>
        </TailwindAlert>
      </container>
    </Section>

    {/* 利用可能なクラス */}
    <Section title="利用可能なTailwindクラス">
      <TailwindGrid cols={2} gap="gap-16">
        <TailwindCard title="スペーシング">
          <container className="text-sm space-y-4">
            <text>• p-0, p-4, p-8, p-16 (padding)</text>
            <text>• m-0, m-4, m-8, m-16 (margin)</text>
            <text>• mt-4, mb-8, ml-4, mr-4 (directional)</text>
            <text>• gap-4, gap-8, gap-16 (gap)</text>
          </container>
        </TailwindCard>
        
        <TailwindCard title="カラー・レイアウト">
          <container className="text-sm space-y-4">
            <text>• bg-blue-500, text-white (色)</text>
            <text>• flex, flex-row, flex-col (Flexbox)</text>
            <text>• rounded-md, rounded-lg (角丸)</text>
            <text>• font-bold, text-lg (テキスト)</text>
          </container>
        </TailwindCard>
      </TailwindGrid>
    </Section>

    {/* フッター */}
    <container className="text-center mt-32 pt-16 border-t border-gray-200">
      <text className="text-sm text-gray-500">
        🎨 Tailwind ユーティリティクラスでより効率的なスタイリング
      </text>
    </container>
  </slide>
);

// SlideWeave形式のJSONとして出力
const slideData = {
  title: "Tailwind JSX Components",
  description: "classNameでTailwindユーティリティクラスを使用するJSXコンポーネント集",
  slides: [slide]
};

// 直接実行時のみconsole.log出力（テスト実行時は呼び出し側で処理）
if (!process.env.SLIDEWEAVE_OUTPUT_PATH && import.meta.main) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;