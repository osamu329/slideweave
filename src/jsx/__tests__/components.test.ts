/**
 * JSXコンポーネント機能のテスト
 */

import { createSlideElement } from '../index';
import type { Element } from '../../types/elements';
import type { SlideComponent, TwoColumnLayoutProps, CardProps } from '../components';

describe('JSX Components', () => {
  describe('基本的な関数コンポーネント', () => {
    it('単純な関数コンポーネントが正しく実行される', () => {
      const SimpleComponent = () => {
        return createSlideElement('text', {}, 'Simple Component');
      };

      const result = createSlideElement(SimpleComponent, {});
      
      expect(result).toEqual({
        type: 'text',
        content: 'Simple Component'
      });
    });

    it('propsを受け取る関数コンポーネントが正しく動作する', () => {
      const TextComponent = ({ content, fontSize = 16 }: { content: string; fontSize?: number }) => {
        return createSlideElement('text', { fontSize }, content);
      };

      const result = createSlideElement(TextComponent, { 
        content: 'Hello World', 
        fontSize: 20 
      });
      
      expect(result).toEqual({
        type: 'text',
        fontSize: 20,
        content: 'Hello World'
      });
    });

    it('childrenを受け取る関数コンポーネントが正しく動作する', () => {
      const ContainerComponent = ({ children }: { children?: any }) => {
        return createSlideElement('container', { style: { padding: 16 } }, children);
      };

      const child = createSlideElement('text', {}, 'Child content');
      const result = createSlideElement(ContainerComponent, {}, child);
      
      expect(result).toEqual({
        type: 'container',
        style: { padding: 16 },
        children: [{
          type: 'text',
          content: 'Child content'
        }]
      });
    });
  });

  describe('複雑なコンポーネント', () => {
    it('TwoColumnLayoutコンポーネントが正しく動作する', () => {
      const TwoColumnLayout: SlideComponent<TwoColumnLayoutProps> = ({ left, right, gap = 16 }) => {
        return createSlideElement('container', {
          style: { flexDirection: 'row', gap }
        }, 
          createSlideElement('container', { style: { flex: 1 } }, left),
          createSlideElement('container', { style: { flex: 1 } }, right)
        );
      };

      const leftContent = createSlideElement('text', {}, '左コンテンツ');
      const rightContent = createSlideElement('text', {}, '右コンテンツ');
      
      const result = createSlideElement(TwoColumnLayout, {
        left: leftContent,
        right: rightContent,
        gap: 24
      });
      
      expect(result).toEqual({
        type: 'container',
        style: { flexDirection: 'row', gap: 24 },
        children: [
          {
            type: 'container',
            style: { flex: 1 },
            children: [{ type: 'text', content: '左コンテンツ' }]
          },
          {
            type: 'container',
            style: { flex: 1 },
            children: [{ type: 'text', content: '右コンテンツ' }]
          }
        ]
      });
    });

    it('Cardコンポーネントが正しく動作する', () => {
      const Card: SlideComponent<CardProps> = ({ title, children, backgroundColor = '#f0f0f0', padding = 16 }) => {
        const elements = [];
        
        if (title) {
          elements.push(createSlideElement('heading', { level: 3 }, title));
        }
        
        if (children) {
          if (Array.isArray(children)) {
            elements.push(...children);
          } else {
            elements.push(children);
          }
        }
        
        return createSlideElement('frame', {
          style: { backgroundColor, padding }
        }, ...elements);
      };

      const content = createSlideElement('text', {}, 'カード内容');
      const result = createSlideElement(Card, {
        title: 'カードタイトル',
        backgroundColor: '#e0e0e0',
        padding: 20
      }, content);
      
      expect(result).toEqual({
        type: 'frame',
        style: { backgroundColor: '#e0e0e0', padding: 20 },
        children: [
          { type: 'heading', level: 3, content: 'カードタイトル' },
          { type: 'text', content: 'カード内容' }
        ]
      });
    });
  });

  describe('ネストしたコンポーネント', () => {
    it('コンポーネント内でコンポーネントを使用できる', () => {
      const Button = ({ children, variant = 'primary' }: { children?: any; variant?: string }) => {
        const backgroundColor = variant === 'primary' ? '#007bff' : '#6c757d';
        return createSlideElement('frame', {
          style: { 
            backgroundColor, 
            padding: 8, 
            borderRadius: 4 
          }
        }, children);
      };

      const ButtonGroup = ({ children }: { children?: any }) => {
        return createSlideElement('container', {
          style: { flexDirection: 'row', gap: 8 }
        }, children);
      };

      const button1 = createSlideElement(Button, { variant: 'primary' }, 
        createSlideElement('text', { style: { color: 'white' } }, 'Primary'));
      const button2 = createSlideElement(Button, { variant: 'secondary' }, 
        createSlideElement('text', { style: { color: 'white' } }, 'Secondary'));
      
      const result = createSlideElement(ButtonGroup, {}, button1, button2);
      
      expect(result).toEqual({
        type: 'container',
        style: { flexDirection: 'row', gap: 8 },
        children: [
          {
            type: 'frame',
            style: { backgroundColor: '#007bff', padding: 8, borderRadius: 4 },
            children: [{ type: 'text', style: { color: 'white' }, content: 'Primary' }]
          },
          {
            type: 'frame',
            style: { backgroundColor: '#6c757d', padding: 8, borderRadius: 4 },
            children: [{ type: 'text', style: { color: 'white' }, content: 'Secondary' }]
          }
        ]
      });
    });
  });

  describe('エッジケース', () => {
    it('空の結果を返すコンポーネントを処理できる', () => {
      const EmptyComponent = () => null;
      
      const result = createSlideElement(EmptyComponent, {});
      
      expect(result).toEqual([]);
    });

    it('配列を返すコンポーネントを処理できる', () => {
      const MultipleElements = () => [
        createSlideElement('text', {}, 'Element 1'),
        createSlideElement('text', {}, 'Element 2')
      ];
      
      const result = createSlideElement(MultipleElements, {});
      
      expect(result).toEqual([
        { type: 'text', content: 'Element 1' },
        { type: 'text', content: 'Element 2' }
      ]);
    });

    it('falsy値をフィルタする', () => {
      const ConditionalComponent = ({ showFirst }: { showFirst: boolean }) => {
        return createSlideElement('container', {},
          showFirst && createSlideElement('text', {}, 'First'),
          createSlideElement('text', {}, 'Second')
        );
      };
      
      const result = createSlideElement(ConditionalComponent, { showFirst: false });
      
      expect(result).toEqual({
        type: 'container',
        children: [
          { type: 'text', content: 'Second' }
        ]
      });
    });
  });
});