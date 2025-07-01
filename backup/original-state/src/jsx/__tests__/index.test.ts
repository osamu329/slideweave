/**
 * JSX Factory関数のテスト
 */

import { createSlideElement, Fragment } from '../index';
import type { Element } from '../../types/elements';

describe('JSX Factory', () => {
  describe('createSlideElement', () => {
    it('基本的なJSX要素を作成する', () => {
      const element = createSlideElement('text', { content: 'Hello World' });
      
      expect(element).toEqual({
        type: 'text',
        content: 'Hello World'
      });
    });

    it('propsがnullの場合を処理する', () => {
      const element = createSlideElement('container', null);
      
      expect(element).toEqual({
        type: 'container'
      });
    });

    it('childrenを適切に処理する', () => {
      const child1 = createSlideElement('text', { content: 'Child 1' });
      const child2 = createSlideElement('text', { content: 'Child 2' });
      
      const element = createSlideElement('container', {}, child1, child2);
      
      expect(element).toEqual({
        type: 'container',
        children: [
          { type: 'text', content: 'Child 1' },
          { type: 'text', content: 'Child 2' }
        ]
      });
    });

    it('空のchildrenを適切に処理する', () => {
      const element = createSlideElement('container', {});
      
      expect(element).toEqual({
        type: 'container'
      });
      expect(element.children).toBeUndefined();
    });

    it('null/undefined/false/空文字のchildrenをフィルタする', () => {
      const validChild = createSlideElement('text', { content: 'Valid' });
      
      const element = createSlideElement(
        'container', 
        {}, 
        validChild,
        null,
        undefined,
        false,
        '',
        0  // 0は有効な値として残す
      );
      
      expect(element).toEqual({
        type: 'container',
        children: [
          { type: 'text', content: 'Valid' },
          0
        ]
      });
    });

    it('ネストした配列のchildrenを平坦化する', () => {
      const child1 = createSlideElement('text', { content: 'Child 1' });
      const child2 = createSlideElement('text', { content: 'Child 2' });
      const child3 = createSlideElement('text', { content: 'Child 3' });
      
      const element = createSlideElement(
        'container', 
        {}, 
        child1,
        [child2, child3]
      );
      
      expect(element).toEqual({
        type: 'container',
        children: [
          { type: 'text', content: 'Child 1' },
          { type: 'text', content: 'Child 2' },
          { type: 'text', content: 'Child 3' }
        ]
      });
    });

    it('プロパティ変換を適用する', () => {
      const element = createSlideElement('text', {
        className: 'text-class',
        style: 'font-size: 16px; color: red;',
        'data-testid': 'test-text'
      });
      
      expect(element).toEqual({
        type: 'text',
        class: 'text-class',
        style: {
          fontSize: '16px',
          color: 'red'
        },
        dataTestid: 'test-text'
      });
    });

    it('slideタイプの要素を作成する', () => {
      const heading = createSlideElement('heading', { 
        content: 'タイトル', 
        level: 1 
      });
      const text = createSlideElement('text', { 
        content: 'コンテンツ' 
      });
      
      const slide = createSlideElement('slide', {
        title: 'テストスライド',
        style: { padding: 16 }
      }, heading, text);
      
      expect(slide).toEqual({
        type: 'slide',
        title: 'テストスライド',
        style: { padding: 16 },
        children: [
          { type: 'heading', content: 'タイトル', level: 1 },
          { type: 'text', content: 'コンテンツ' }
        ]
      });
    });

    it('複雑なレイアウト構造を作成する', () => {
      const leftText = createSlideElement('text', { content: '左カラム' });
      const rightText = createSlideElement('text', { content: '右カラム' });
      
      const leftColumn = createSlideElement('container', { 
        style: { flex: 1 } 
      }, leftText);
      const rightColumn = createSlideElement('container', { 
        style: { flex: 1 } 
      }, rightText);
      
      const row = createSlideElement('container', {
        style: { flexDirection: 'row' }
      }, leftColumn, rightColumn);
      
      const slide = createSlideElement('slide', {}, row);
      
      expect(slide).toEqual({
        type: 'slide',
        children: [{
          type: 'container',
          style: { flexDirection: 'row' },
          children: [
            {
              type: 'container',
              style: { flex: 1 },
              children: [{ type: 'text', content: '左カラム' }]
            },
            {
              type: 'container',
              style: { flex: 1 },
              children: [{ type: 'text', content: '右カラム' }]
            }
          ]
        }]
      });
    });
  });

  describe('Fragment', () => {
    it('子要素の配列を返す', () => {
      const child1 = createSlideElement('text', { content: 'Child 1' });
      const child2 = createSlideElement('text', { content: 'Child 2' });
      
      const fragment = Fragment({ children: [child1, child2] });
      
      expect(fragment).toEqual([
        { type: 'text', content: 'Child 1' },
        { type: 'text', content: 'Child 2' }
      ]);
    });

    it('単一の子要素を配列で返す', () => {
      const child = createSlideElement('text', { content: 'Single Child' });
      
      const fragment = Fragment({ children: child });
      
      expect(fragment).toEqual([
        { type: 'text', content: 'Single Child' }
      ]);
    });

    it('childrenがundefinedの場合を処理する', () => {
      const fragment = Fragment({});
      
      expect(fragment).toEqual([]);
    });
  });
});