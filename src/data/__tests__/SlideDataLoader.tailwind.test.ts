/**
 * SlideDataLoader Tailwind統合テスト
 * 組み込みTailwindクラスとSlideDataLoaderの統合動作テスト
 */

import { SlideDataLoader } from '../SlideDataLoader';

describe('SlideDataLoader Tailwind Integration', () => {
  describe('Built-in Tailwind class application', () => {
    test('should apply Tailwind classes without CSS stylesheet', () => {
      const slideData = {
        title: 'Tailwind Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                class: 'p-4 bg-blue-500',
                children: [
                  {
                    type: 'text',
                    class: 'text-white text-lg font-bold',
                    content: 'Tailwind Text'
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const container = result.slides[0].children![0] as any;
      expect(container.style).toEqual({
        padding: '16px',
        backgroundColor: '#2563eb'
      });

      const text = container.children[0] as any;
      expect(text.style).toEqual({
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 'bold'
      });
    });

    test('should apply multiple Tailwind spacing utilities', () => {
      const slideData = {
        title: 'Spacing Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: 'p-8 m-4 mt-16',
                content: 'Spaced Frame'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '32px',
        margin: '16px',
        marginTop: '64px'
      });
    });

    test('should apply Tailwind color utilities', () => {
      const slideData = {
        title: 'Color Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: 'bg-red-500',
                children: [
                  {
                    type: 'text',
                    class: 'text-white',
                    content: 'Red frame with white text'
                  }
                ]
              },
              {
                type: 'frame',
                class: 'bg-green-50',
                children: [
                  {
                    type: 'text',
                    class: 'text-gray-700',
                    content: 'Light green frame'
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const redFrame = result.slides[0].children![0] as any;
      expect(redFrame.style).toEqual({
        backgroundColor: '#dc2626'
      });

      const redText = redFrame.children[0] as any;
      expect(redText.style).toEqual({
        color: '#ffffff'
      });

      const greenFrame = result.slides[0].children![1] as any;
      expect(greenFrame.style).toEqual({
        backgroundColor: '#f0fdf4'
      });

      const grayText = greenFrame.children[0] as any;
      expect(grayText.style).toEqual({
        color: '#374151'
      });
    });

    test('should apply layout utilities', () => {
      const slideData = {
        title: 'Layout Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'container',
                class: 'flex gap-8',
                children: [
                  {
                    type: 'frame',
                    class: 'flex-4 w-full',
                    content: 'Left Column'
                  },
                  {
                    type: 'frame',
                    class: 'flex-1',
                    content: 'Right Column'
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const container = result.slides[0].children![0] as any;
      expect(container.style).toEqual({
        flexDirection: 'row',
        gap: '32px'
      });

      const leftFrame = container.children[0] as any;
      expect(leftFrame.style).toEqual({
        flex: 4,
        width: '100%'
      });

      const rightFrame = container.children[1] as any;
      expect(rightFrame.style).toEqual({
        flex: 1
      });
    });
  });

  describe('Tailwind + Custom CSS mixing', () => {
    test('should mix Tailwind classes with custom CSS classes', () => {
      const slideData = {
        title: 'Mixed Test',
        css: `
          .custom-border {
            border: 2px solid #333;
            border-radius: 8px;
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: 'p-4 bg-white custom-border',
                content: 'Mixed styling'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '16px',
        backgroundColor: '#ffffff',
        border: '2px solid #333',
        borderRadius: '8px'
      });
    });

    test('should allow inline styles to override Tailwind classes', () => {
      const slideData = {
        title: 'Override Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: 'p-4 bg-blue-500',
                style: {
                  backgroundColor: '#ff0000',  // overrides bg-blue-500
                  margin: '8px'                // adds to Tailwind styles
                },
                content: 'Overridden styles'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '16px',
        backgroundColor: '#ff0000',  // inline style wins
        margin: '8px'                // additional inline style
      });
    });

    test('should allow CSS classes to override Tailwind classes', () => {
      const slideData = {
        title: 'CSS Override Test',
        css: `
          .p-4 {
            padding: 24px;  /* overrides Tailwind p-4 */
          }
        `,
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: 'p-4 bg-blue-500',
                content: 'CSS overridden Tailwind'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '24px',              // CSS override
        backgroundColor: '#2563eb'    // Tailwind preserved
      });
    });
  });

  describe('Typography utilities', () => {
    test('should apply text size and weight utilities', () => {
      const slideData = {
        title: 'Typography Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'heading',
                class: 'text-2xl font-bold',
                content: 'Main Heading',
                level: 1
              },
              {
                type: 'heading',
                class: 'text-lg font-normal',
                content: 'Sub Heading',
                level: 2
              },
              {
                type: 'text',
                class: 'text-sm italic',
                content: 'Small italic text'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const mainHeading = result.slides[0].children![0] as any;
      expect(mainHeading.style).toEqual({
        fontSize: '24px',
        fontWeight: 'bold'
      });

      const subHeading = result.slides[0].children![1] as any;
      expect(subHeading.style).toEqual({
        fontSize: '18px',
        fontWeight: 'normal'
      });

      const smallText = result.slides[0].children![2] as any;
      expect(smallText.style).toEqual({
        fontSize: '14px',
        fontStyle: 'italic'
      });
    });
  });

  describe('Unknown classes handling', () => {
    test('should ignore unknown Tailwind-like classes', () => {
      const slideData = {
        title: 'Unknown Classes Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: 'p-4 unknown-utility-class bg-blue-500 non-existent-class',
                content: 'Mixed known and unknown'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '16px',
        backgroundColor: '#2563eb'
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle empty class string', () => {
      const slideData = {
        title: 'Empty Class Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                class: '',
                style: { margin: '10px' },
                content: 'No classes'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        margin: '10px'
      });
    });

    test('should handle elements without class property', () => {
      const slideData = {
        title: 'No Class Test',
        slides: [
          {
            type: 'slide',
            children: [
              {
                type: 'frame',
                style: { padding: '12px' },
                content: 'No class property'
              }
            ]
          }
        ]
      };

      const result = SlideDataLoader.loadFromObject(slideData);

      const frame = result.slides[0].children![0] as any;
      expect(frame.style).toEqual({
        padding: '12px'
      });
    });
  });
});