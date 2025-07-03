/**
 * SlideWeave 統合テスト (deck/slide構造対応版)
 * 新しいDeckElement形式に対応した end-to-end テスト
 */

import { YogaLayoutEngine } from '../src/layout/YogaLayoutEngine';
import { createPixels } from '../src/types/units';
import { PPTXRenderer } from '../src/renderer/PPTXRenderer';
import { SchemaValidator } from '../src/elements/SchemaValidator';
import { DeckElement, SlideElement } from '../src/types/elements';

describe('SlideWeave Integration Test (Deck/Slide Structure)', () => {
  let layoutEngine: YogaLayoutEngine;

  beforeEach(() => {
    layoutEngine = new YogaLayoutEngine();
  });

  describe('基本的なdeck/slide統合', () => {
    test('should validate, layout, and render deck with single slide', async () => {
      const deckData: DeckElement = {
        type: 'deck',
        title: 'Integration Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'text',
                content: 'Hello Integration',
                style: {
                  fontSize: '24px',
                  color: '#333333'
                }
              }
            ]
          }
        ]
      };

      // 1. Schema validation
      const validator = new SchemaValidator();
      const validationResult = validator.validate(deckData);
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);

      // 2. Layout calculation for each slide
      const slide = deckData.slides[0];
      const layoutResults = [];
      const layoutEngine = new YogaLayoutEngine();
      
      for (const child of slide.children || []) {
        const layoutResult = await layoutEngine.renderLayout(child, createPixels(720), createPixels(540));
        layoutResults.push(layoutResult);
      }

      expect(layoutResults).toHaveLength(1);
      expect(layoutResults[0].element.type).toBe('text');

      // 3. PPTX rendering
      const renderer = new PPTXRenderer({
      widthPx: 1280,
      heightPx: 720,
      dpi: 96
    });
      
      for (const layoutResult of layoutResults) {
        await renderer.render(layoutResult);
      }

      expect(renderer).toBeDefined();
    });

    test('should handle multiple slides with different content', async () => {
      const deckData: DeckElement = {
        type: 'deck',
        title: 'Multi-slide Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'heading',
                content: 'Slide 1 Title',
                level: 1
              }
            ]
          },
          {
            type: 'slide',
            children: [
              {
                type: 'text',
                content: 'Slide 2 Content'
              }
            ]
          }
        ]
      };

      // Schema validation
      const validator = new SchemaValidator();
      const validationResult = validator.validate(deckData);
      expect(validationResult.isValid).toBe(true);

      // Process each slide
      const renderer = new PPTXRenderer({
      widthPx: 1280,
      heightPx: 720,
      dpi: 96
    });
      const layoutEngine = new YogaLayoutEngine();
      
      for (const slide of deckData.slides) {
        for (const child of slide.children || []) {
          const layoutResult = await layoutEngine.renderLayout(child, createPixels(720), createPixels(540));
          await renderer.render(layoutResult);
        }
      }

      expect(deckData.slides).toHaveLength(2);
    });
  });

  describe('複雑なレイアウト統合', () => {
    test('should handle container with multiple children in deck/slide structure', async () => {
      const deckData: DeckElement = {
        type: 'deck',
        title: 'Container Layout Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                style: {
                  padding: '16px',
                  flexDirection: 'column'
                },
                children: [
                  {
                    type: 'heading',
                    content: 'Title',
                    level: 2
                  },
                  {
                    type: 'text',
                    content: 'Description text'
                  }
                ]
              }
            ]
          }
        ]
      };

      // Schema validation
      const validator = new SchemaValidator();
      const validationResult = validator.validate(deckData);
      expect(validationResult.isValid).toBe(true);

      // Layout and render
      const slide = deckData.slides[0];
      const containerElement = slide.children![0];
      const layoutEngine = new YogaLayoutEngine();
      
      const layoutResult = await layoutEngine.renderLayout(containerElement, createPixels(720), createPixels(540));
      
      expect(layoutResult.element.type).toBe('container');
      expect(layoutResult.children).toHaveLength(2);
      
      const renderer = new PPTXRenderer({
      widthPx: 1280,
      heightPx: 720,
      dpi: 96
    });
      await renderer.render(layoutResult);
    });
  });

  describe('CSS統合テスト', () => {
    test('should work with basic deck structure (CSS validation skipped)', async () => {
      // Note: CSS processing and validation are handled by SlideDataLoader
      // This test focuses on basic integration without CSS-specific schema validation
      const deckData: DeckElement = {
        type: 'deck',
        title: 'Basic Integration Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                style: {
                  padding: '16px'
                },
                children: [
                  {
                    type: 'text',
                    content: 'Test content',
                    style: {
                      fontSize: '24px',
                      color: '#333333'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

      // Schema validation should pass for basic structure
      const validator = new SchemaValidator();
      const validationResult = validator.validate(deckData);
      expect(validationResult.isValid).toBe(true);
    });
  });
});