/**
 * 追加Cardコンポーネントのサンプル
 * ImageCard, InfoCard, AlertCard等の実装例
 */

import { createSlideElement, Fragment } from '../../src/jsx/index';
import type { SlideComponent } from '../../src/jsx/components';

// React未定義エラー回避のためのグローバル設定
global.React = { createElement: createSlideElement, Fragment };

// 基本カードコンポーネント（再利用）
const Card: SlideComponent<{
  title?: string;
  children?: any;
  backgroundColor?: string;
  padding?: number;
  borderColor?: string;
  borderWidth?: number;
}> = ({ 
  title, 
  children, 
  backgroundColor = '#f8f9fa', 
  padding = 16,
  borderColor = '#dee2e6',
  borderWidth = 1
}) => {
  return (
    <frame style={{ 
      backgroundColor, 
      padding, 
      borderRadius: 8,
      borderWidth,
      borderColor
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

// 画像付きカードコンポーネント
const ImageCard: SlideComponent<{
  title?: string;
  imageUrl?: string;
  children?: any;
  imageHeight?: number;
  backgroundColor?: string;
}> = ({ 
  title, 
  imageUrl, 
  children, 
  imageHeight = 120,
  backgroundColor = '#ffffff'
}) => {
  return (
    <Card backgroundColor={backgroundColor} padding={0}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          style={{ 
            width: '100%', 
            height: imageHeight,
            borderRadius: '8px 8px 0 0'
          }} 
        />
      )}
      <container style={{ padding: 16 }}>
        {title && (
          <heading level={3} style={{ 
            marginBottom: 12,
            color: '#212529'
          }}>
            {title}
          </heading>
        )}
        {children}
      </container>
    </Card>
  );
};

// 情報カードコンポーネント（アイコン付き）
const InfoCard: SlideComponent<{
  title?: string;
  icon?: string;
  children?: any;
  variant?: 'info' | 'success' | 'warning' | 'primary';
  compact?: boolean;
}> = ({ 
  title, 
  icon = 'ℹ️', 
  children, 
  variant = 'info',
  compact = false
}) => {
  const getVariantColors = (variant: string) => {
    switch (variant) {
      case 'success':
        return { bg: '#d4edda', border: '#c3e6cb', iconBg: '#28a745' };
      case 'warning': 
        return { bg: '#fff3cd', border: '#ffeaa7', iconBg: '#ffc107' };
      case 'primary':
        return { bg: '#e3f2fd', border: '#bbdefb', iconBg: '#2196f3' };
      default: // info
        return { bg: '#e8f4fd', border: '#bee5eb', iconBg: '#17a2b8' };
    }
  };

  const colors = getVariantColors(variant);
  const padding = compact ? 12 : 16;

  return (
    <Card 
      backgroundColor={colors.bg} 
      borderColor={colors.border}
      borderWidth={2}
      padding={padding}
    >
      <container style={{ flexDirection: 'row', gap: 12 }}>
        {/* アイコン部分 */}
        <container style={{ alignItems: 'center' }}>
          <frame style={{
            width: compact ? 24 : 32,
            height: compact ? 24 : 32,
            backgroundColor: colors.iconBg,
            borderRadius: compact ? 12 : 16,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <text style={{ 
              color: '#ffffff', 
              fontWeight: 'bold',
              fontSize: compact ? 12 : 14
            }}>
              {icon}
            </text>
          </frame>
        </container>
        
        {/* コンテンツ部分 */}
        <container style={{ flex: 1 }}>
          {title && (
            <heading level={compact ? 5 : 4} style={{ 
              marginBottom: compact ? 4 : 8,
              color: '#212529'
            }}>
              {title}
            </heading>
          )}
          {children}
        </container>
      </container>
    </Card>
  );
};

// アラートカードコンポーネント
const AlertCard: SlideComponent<{
  title?: string;
  children?: any;
  type?: 'error' | 'warning' | 'success' | 'info';
  dismissible?: boolean;
  icon?: string;
}> = ({ 
  title, 
  children, 
  type = 'info',
  dismissible = false,
  icon
}) => {
  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'error':
        return { 
          bg: '#f8d7da', 
          border: '#f5c6cb', 
          text: '#721c24',
          icon: '❌'
        };
      case 'warning':
        return { 
          bg: '#fff3cd', 
          border: '#ffeaa7', 
          text: '#856404',
          icon: '⚠️'
        };
      case 'success':
        return { 
          bg: '#d4edda', 
          border: '#c3e6cb', 
          text: '#155724',
          icon: '✅'
        };
      default: // info
        return { 
          bg: '#d1ecf1', 
          border: '#bee5eb', 
          text: '#0c5460',
          icon: 'ℹ️'
        };
    }
  };

  const config = getAlertConfig(type);
  const alertIcon = icon || config.icon;

  return (
    <Card 
      backgroundColor={config.bg} 
      borderColor={config.border}
      borderWidth={2}
      padding={16}
    >
      <container style={{ flexDirection: 'row', gap: 12 }}>
        {/* アイコン */}
        <container style={{ alignItems: 'flex-start', marginTop: 2 }}>
          <text style={{ fontSize: 16 }}>
            {alertIcon}
          </text>
        </container>
        
        {/* メインコンテンツ */}
        <container style={{ flex: 1 }}>
          {title && (
            <heading level={4} style={{ 
              marginBottom: 8,
              color: config.text,
              fontWeight: 'bold'
            }}>
              {title}
            </heading>
          )}
          <text style={{ color: config.text }}>
            {children}
          </text>
        </container>
        
        {/* 閉じるボタン（dismissible時） */}
        {dismissible && (
          <container style={{ alignItems: 'flex-start' }}>
            <text style={{ 
              color: config.text, 
              fontSize: 18,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              ×
            </text>
          </container>
        )}
      </container>
    </Card>
  );
};

// 統計カードコンポーネント（おまけ）
const StatCard: SlideComponent<{
  title?: string;
  value?: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}> = ({ 
  title, 
  value, 
  subtitle, 
  trend = 'neutral',
  color = '#007bff'
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#28a745';
      case 'down': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <Card backgroundColor="#ffffff" borderColor={color} borderWidth={2}>
      <container style={{ alignItems: 'center', textAlign: 'center' }}>
        {title && (
          <text style={{ 
            color: '#6c757d', 
            fontSize: 14,
            marginBottom: 8
          }}>
            {title}
          </text>
        )}
        
        <heading level={1} style={{ 
          color: color,
          fontSize: 32,
          marginBottom: 4,
          fontWeight: 'bold'
        }}>
          {value}
        </heading>
        
        {subtitle && (
          <container style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <text style={{ fontSize: 16 }}>
              {getTrendIcon(trend)}
            </text>
            <text style={{ 
              color: getTrendColor(trend),
              fontSize: 12
            }}>
              {subtitle}
            </text>
          </container>
        )}
      </container>
    </Card>
  );
};

// 使用例スライド
const slide = (
  <slide style={{ padding: 24 }}>
    <heading level={1} style={{ 
      marginBottom: 24, 
      textAlign: 'center',
      color: '#212529'
    }}>
      カードコンポーネント集
    </heading>
    
    <container style={{ gap: 24 }}>
      {/* ImageCard例 */}
      <container>
        <heading level={2} style={{ marginBottom: 16 }}>
          ImageCard
        </heading>
        <container style={{ flexDirection: 'row', gap: 16 }}>
          <ImageCard 
            title="製品紹介"
            imageUrl="./examples/510.jpg"
            imageHeight={100}
          >
            <text>美しい画像付きのカードコンポーネント。製品紹介やポートフォリオに最適です。</text>
          </ImageCard>
          
          <ImageCard 
            title="風景写真"
            imageUrl="./examples/510.jpg"
            imageHeight={100}
            backgroundColor="#f0f8ff"
          >
            <text>背景色もカスタマイズ可能です。</text>
          </ImageCard>
        </container>
      </container>

      {/* InfoCard例 */}
      <container>
        <heading level={2} style={{ marginBottom: 16 }}>
          InfoCard
        </heading>
        <container style={{ flexDirection: 'row', gap: 16 }}>
          <InfoCard 
            title="お知らせ"
            variant="info"
            icon="📢"
          >
            <text>重要な情報をユーザーに伝えるためのカードです。</text>
          </InfoCard>
          
          <InfoCard 
            title="成功"
            variant="success"
            icon="🎉"
            compact={true}
          >
            <text>処理が正常に完了しました。</text>
          </InfoCard>
          
          <InfoCard 
            title="注意"
            variant="warning"
            icon="⚡"
          >
            <text>この操作には注意が必要です。</text>
          </InfoCard>
        </container>
      </container>

      {/* AlertCard例 */}
      <container>
        <heading level={2} style={{ marginBottom: 16 }}>
          AlertCard
        </heading>
        <container style={{ gap: 12 }}>
          <AlertCard 
            title="エラーが発生しました"
            type="error"
            dismissible={true}
          >
            ファイルの読み込みに失敗しました。ファイル形式を確認してください。
          </AlertCard>
          
          <AlertCard 
            title="警告"
            type="warning"
          >
            この操作を実行すると、データが削除される可能性があります。
          </AlertCard>
          
          <AlertCard 
            title="成功"
            type="success"
          >
            ファイルが正常にアップロードされました。
          </AlertCard>
        </container>
      </container>

      {/* StatCard例 */}
      <container>
        <heading level={2} style={{ marginBottom: 16 }}>
          StatCard（おまけ）
        </heading>
        <container style={{ flexDirection: 'row', gap: 16 }}>
          <StatCard 
            title="総売上"
            value="¥1,234,567"
            subtitle="+12.5% 前月比"
            trend="up"
            color="#28a745"
          />
          
          <StatCard 
            title="ユーザー数"
            value="45,678"
            subtitle="+5.2% 前週比"
            trend="up"
            color="#007bff"
          />
          
          <StatCard 
            title="コンバージョン率"
            value="3.45%"
            subtitle="-0.8% 前日比"
            trend="down"
            color="#dc3545"
          />
        </container>
      </container>
    </container>
  </slide>
);

// SlideWeave形式のJSONとして出力
const slideData = {
  title: "Card Components Collection",
  description: "ImageCard, InfoCard, AlertCard等の様々なカードコンポーネント集",
  slides: [slide]
};

// 直接実行時のみconsole.log出力（テスト実行時は呼び出し側で処理）
if (!process.env.SLIDEWEAVE_OUTPUT_PATH && import.meta.main) {
  console.log(JSON.stringify(slideData, null, 2));
}

export default slideData;