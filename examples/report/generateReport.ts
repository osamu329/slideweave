/**
 * 広告運用レポート生成サンプル
 * slide.htmlと同等のスライドをSlideWeaveで作成
 */

import { LayoutEngine } from '../../src/layout/LayoutEngine';
import { PPTXRenderer } from '../../src/renderer/PPTXRenderer';
import { ElementValidator } from '../../src/elements/validator';
import { ContainerElement } from '../../src/types/elements';

// スライド1: タイトルスライド（シンプル版）
const slide1: ContainerElement = {
  type: 'container',
  style: { 
    padding: 8,
    direction: 'column'
  },
  children: [
    {
      type: 'heading',
      content: '広告運用レポート',
      level: 1,
      fontSize: 48,
      style: { margin: 4 },
      color: '000000',
      bold: true
    },
    {
      type: 'heading',
      content: 'ファッションECサイト「StyleHub」',
      level: 2,
      fontSize: 28,
      style: { margin: 2 },
      color: '000000'
    },
    {
      type: 'text',
      content: '2025年5月実績',
      fontSize: 18,
      style: { margin: 2 },
      color: '000000'
    }
  ]
};

// スライド2: 月次サマリー（KPIカード形式）- 元に戻す
const slide2: ContainerElement = {
  type: 'container',
  style: { 
    padding: 3,
    direction: 'column'
  },
  children: [
    {
      type: 'heading',
      content: '📊 月次サマリー',
      level: 2,
      fontSize: 32,
      style: { margin: 2 },
      color: 'FFFFFF',
      bold: true
    },
    // KPIカードエリア
    {
      type: 'container',
      style: {
        direction: 'row',
        margin: 2
      },
      children: [
        // 左列のKPIカード
        {
          type: 'container',
          style: { direction: 'column', padding: 1 },
          children: [
            // 売上カード
            {
              type: 'container',
              style: { 
                padding: 2, 
                margin: 1,
                backgroundColor: 'rgba(255,255,255,0.2)' 
              },
              children: [
                { type: 'text', content: '売上', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: '¥12,500,000', fontSize: 24, color: 'FFFFFF', bold: true },
                { type: 'text', content: '+15.2%', fontSize: 12, color: '86EFAC' }
              ]
            },
            // ROASカード
            {
              type: 'container',
              style: { 
                padding: 2, 
                margin: 1,
                backgroundColor: 'rgba(255,255,255,0.2)' 
              },
              children: [
                { type: 'text', content: 'ROAS', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: '4.46', fontSize: 24, color: 'FFFFFF', bold: true },
                { type: 'text', content: '+0.32pt', fontSize: 12, color: '86EFAC' }
              ]
            }
          ]
        },
        // 右列のKPIカード
        {
          type: 'container',
          style: { direction: 'column', padding: 1 },
          children: [
            // 広告費カード
            {
              type: 'container',
              style: { 
                padding: 2, 
                margin: 1,
                backgroundColor: 'rgba(255,255,255,0.2)' 
              },
              children: [
                { type: 'text', content: '広告費', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: '¥2,800,000', fontSize: 24, color: 'FFFFFF', bold: true },
                { type: 'text', content: '+8.3%', fontSize: 12, color: 'FCA5A5' }
              ]
            },
            // CPAカード
            {
              type: 'container',
              style: { 
                padding: 2, 
                margin: 1,
                backgroundColor: 'rgba(255,255,255,0.2)' 
              },
              children: [
                { type: 'text', content: 'CPA', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: '¥3,200', fontSize: 24, color: 'FFFFFF', bold: true },
                { type: 'text', content: '-12.5%', fontSize: 12, color: '86EFAC' }
              ]
            }
          ]
        }
      ]
    },
    // ハイライトセクション
    {
      type: 'container',
      style: { 
        padding: 2, 
        margin: 2,
        backgroundColor: 'rgba(255,255,255,0.2)' 
      },
      children: [
        { type: 'heading', content: 'ハイライト', level: 3, fontSize: 18, color: 'FFFFFF', bold: true },
        { type: 'text', content: '✅ 母の日キャンペーンが大成功', fontSize: 14, color: 'FFFFFF' },
        { type: 'text', content: '✅ リターゲティング施策でROAS改善', fontSize: 14, color: 'FFFFFF' },
        { type: 'text', content: '✅ 新規顧客獲得数が過去最高を記録', fontSize: 14, color: 'FFFFFF' }
      ]
    }
  ]
};

// スライド3: パフォーマンス推移
const slide3: ContainerElement = {
  type: 'container',
  style: { 
    padding: 3,
    direction: 'column'
  },
  children: [
    {
      type: 'heading',
      content: '📈 パフォーマンス推移',
      level: 2,
      fontSize: 32,
      style: { margin: 2 },
      color: 'FFFFFF',
      bold: true
    },
    // パフォーマンスグリッド（左右2列）
    {
      type: 'container',
      style: {
        direction: 'row',
        margin: 2
      },
      children: [
        // 左側：売上・ROAS推移
        {
          type: 'container',
          style: { 
            direction: 'column', 
            padding: 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: 1
          },
          children: [
            { type: 'heading', content: '売上・ROAS推移', level: 3, fontSize: 18, color: 'FFFFFF', bold: true },
            // 3月データ
            {
              type: 'container',
              style: { direction: 'row', padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '3月', fontSize: 16, bold: true, color: 'FFFFFF' },
                {
                  type: 'container',
                  style: { direction: 'column', padding: 1 },
                  children: [
                    { type: 'text', content: '980万円', fontSize: 14, color: 'FFFFFF', bold: true },
                    { type: 'text', content: 'ROAS: 3.85', fontSize: 12, color: 'FFFFFF' }
                  ]
                }
              ]
            },
            // 4月データ
            {
              type: 'container',
              style: { direction: 'row', padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '4月', fontSize: 16, bold: true, color: 'FFFFFF' },
                {
                  type: 'container',
                  style: { direction: 'column', padding: 1 },
                  children: [
                    { type: 'text', content: '1,085万円', fontSize: 14, color: 'FFFFFF', bold: true },
                    { type: 'text', content: 'ROAS: 4.14', fontSize: 12, color: 'FFFFFF' }
                  ]
                }
              ]
            },
            // 5月データ
            {
              type: 'container',
              style: { direction: 'row', padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '5月', fontSize: 16, bold: true, color: 'FFFFFF' },
                {
                  type: 'container',
                  style: { direction: 'column', padding: 1 },
                  children: [
                    { type: 'text', content: '1,250万円', fontSize: 14, color: 'FFFFFF', bold: true },
                    { type: 'text', content: 'ROAS: 4.46', fontSize: 12, color: 'FFFFFF' }
                  ]
                }
              ]
            }
          ]
        },
        // 右側：主要改善要因
        {
          type: 'container',
          style: { 
            direction: 'column', 
            padding: 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: 1
          },
          children: [
            { type: 'heading', content: '主要改善要因', level: 3, fontSize: 18, color: 'FFFFFF', bold: true },
            { type: 'text', content: '• 商品ラインナップ最適化: 春夏商品の早期投入', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '• ターゲティング精度向上: 類似オーディエンス活用', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '• クリエイティブテスト: 動画広告のCTR +25%', fontSize: 13, color: 'FFFFFF' }
          ]
        }
      ]
    }
  ]
};

// スライド4: チャネル別分析
const slide4: ContainerElement = {
  type: 'container',
  style: { 
    padding: 3,
    direction: 'column'
  },
  children: [
    {
      type: 'heading',
      content: '🎯 チャネル別分析',
      level: 2,
      fontSize: 32,
      style: { margin: 2 },
      color: 'FFFFFF',
      bold: true
    },
    // チャネルテーブル
    {
      type: 'container',
      style: {
        direction: 'column',
        padding: 2,
        margin: 2,
        backgroundColor: 'rgba(255,255,255,0.2)'
      },
      children: [
        // テーブルヘッダー
        {
          type: 'container',
          style: { 
            direction: 'row', 
            padding: 1,
            backgroundColor: 'rgba(255,255,255,0.1)'
          },
          children: [
            { type: 'text', content: 'チャネル', fontSize: 14, bold: true, color: 'FFFFFF' },
            { type: 'text', content: '広告費(万円)', fontSize: 14, bold: true, color: 'FFFFFF' },
            { type: 'text', content: '売上(万円)', fontSize: 14, bold: true, color: 'FFFFFF' },
            { type: 'text', content: 'ROAS', fontSize: 14, bold: true, color: 'FFFFFF' },
            { type: 'text', content: '前月比', fontSize: 14, bold: true, color: 'FFFFFF' }
          ]
        },
        // Google検索行
        {
          type: 'container',
          style: { direction: 'row', padding: 1 },
          children: [
            { type: 'text', content: 'Google検索', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '120', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '600', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '5.00', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '+0.45', fontSize: 13, color: '86EFAC' }
          ]
        },
        // Meta広告行
        {
          type: 'container',
          style: { direction: 'row', padding: 1 },
          children: [
            { type: 'text', content: 'Meta広告', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '80', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '320', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '4.00', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '+0.28', fontSize: 13, color: '86EFAC' }
          ]
        },
        // Yahoo!検索行
        {
          type: 'container',
          style: { direction: 'row', padding: 1 },
          children: [
            { type: 'text', content: 'Yahoo!検索', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '50', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '210', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '4.20', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '+0.15', fontSize: 13, color: '86EFAC' }
          ]
        },
        // YouTube行
        {
          type: 'container',
          style: { direction: 'row', padding: 1 },
          children: [
            { type: 'text', content: 'YouTube', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '30', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '120', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '4.00', fontSize: 13, color: 'FFFFFF' },
            { type: 'text', content: '+0.80', fontSize: 13, color: '86EFAC' }
          ]
        }
      ]
    },
    // インサイト
    {
      type: 'container',
      style: { 
        padding: 2, 
        margin: 2,
        backgroundColor: 'rgba(255,255,255,0.2)' 
      },
      children: [
        { type: 'heading', content: '📌 チャネル別insights', level: 3, fontSize: 18, color: 'FFFFFF', bold: true },
        { type: 'text', content: 'Google検索: ブランドキーワードが好調', fontSize: 13, color: 'FFFFFF' },
        { type: 'text', content: 'Meta広告: リール動画のエンゲージメント向上', fontSize: 13, color: 'FFFFFF' },
        { type: 'text', content: 'YouTube: 認知拡大効果で間接効果も増加', fontSize: 13, color: 'FFFFFF' }
      ]
    }
  ]
};

// スライド5: 実施施策と今後の戦略
const slide5: ContainerElement = {
  type: 'container',
  style: { 
    padding: 3,
    direction: 'column'
  },
  children: [
    {
      type: 'heading',
      content: '🚀 実施施策と今後の戦略',
      level: 2,
      fontSize: 32,
      style: { margin: 2 },
      color: 'FFFFFF',
      bold: true
    },
    // 戦略グリッド（左右2列）
    {
      type: 'container',
      style: {
        direction: 'row',
        margin: 2
      },
      children: [
        // 左側：5月実施施策
        {
          type: 'container',
          style: { 
            direction: 'column', 
            padding: 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: 1
          },
          children: [
            { type: 'heading', content: '5月実施施策', level: 3, fontSize: 18, color: 'FFFFFF', bold: true },
            // 実施施策1
            {
              type: 'container',
              style: { padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '母の日特集ページ制作', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: 'CVR +18%', fontSize: 12, color: '86EFAC' }
              ]
            },
            // 実施施策2
            {
              type: 'container',
              style: { padding: 1, margin: 1 },
              children: [
                { type: 'text', content: 'リターゲティング配信強化', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: 'ROAS +0.6pt', fontSize: 12, color: '86EFAC' }
              ]
            },
            // 実施施策3
            {
              type: 'container',
              style: { padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '商品レビュー活用クリエイティブ', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: 'CTR +22%', fontSize: 12, color: '86EFAC' }
              ]
            }
          ]
        },
        // 右側：6月の重点施策
        {
          type: 'container',
          style: { 
            direction: 'column', 
            padding: 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: 1
          },
          children: [
            { type: 'heading', content: '6月の重点施策', level: 3, fontSize: 18, color: 'FFFFFF', bold: true },
            // 施策1：父の日
            {
              type: 'container',
              style: { padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '父の日キャンペーン準備', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: 'メンズアイテム訴求強化・ギフト需要に合わせた配信設計', fontSize: 11, color: 'FFFFFF' }
              ]
            },
            // 施策2：夏物
            {
              type: 'container',
              style: { padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '夏物商品プロモーション', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: '季節商品の早期露出・気温連動型配信テスト', fontSize: 11, color: 'FFFFFF' }
              ]
            },
            // 施策3：新規顧客
            {
              type: 'container',
              style: { padding: 1, margin: 1 },
              children: [
                { type: 'text', content: '新規顧客獲得強化', fontSize: 14, color: 'FFFFFF', bold: true },
                { type: 'text', content: '拡張配信の精度向上・動画クリエイティブ拡充', fontSize: 11, color: 'FFFFFF' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// スライド生成関数
async function generateReport() {
  console.log('📊 広告運用レポート生成開始...');

  const slides = [slide1, slide2, slide3, slide4, slide5];
  const renderer = new PPTXRenderer({
    slideWidth: 10,
    slideHeight: 7.5
  });

  // 最初のスライドを追加
  const firstSlideLayout = LayoutEngine.render(slides[0], 720, 540);
  console.log('=== スライド1のレイアウト結果 ===');
  console.log(JSON.stringify(firstSlideLayout, null, 2));
  renderer.render(firstSlideLayout);

  // 残りのスライドを追加
  for (let i = 1; i < slides.length; i++) {
    renderer.addSlide();
    const slideLayout = LayoutEngine.render(slides[i], 720, 540);
    if (i === 1) { // スライド2のレイアウトも確認
      console.log('=== スライド2のレイアウト結果 ===');
      console.log(JSON.stringify(slideLayout, null, 2));
    }
    renderer.render(slideLayout);
  }

  // ファイル保存
  await renderer.save('./advertising-report.pptx');
  console.log('✅ レポート生成完了: advertising-report.pptx');

  return renderer.getPptx();
}

// バリデーション付き実行
async function main() {
  try {
    const slides = [slide1, slide2, slide3, slide4, slide5];
    
    // 各スライドのバリデーション
    slides.forEach((slide, index) => {
      const validation = ElementValidator.validate(slide);
      if (!validation.isValid) {
        console.error(`❌ スライド${index + 1}のバリデーションエラー:`, validation.errors);
        throw new Error(`スライド${index + 1}のバリデーションに失敗しました`);
      } else {
        console.log(`✅ スライド${index + 1}のバリデーション成功`);
      }
    });

    // レポート生成
    await generateReport();
    
  } catch (error) {
    console.error('❌ レポート生成エラー:', error);
    throw error;
  }
}

export { generateReport, main, slide1, slide2, slide3, slide4, slide5 };

// 直接実行時
if (require.main === module) {
  main().catch(console.error);
}