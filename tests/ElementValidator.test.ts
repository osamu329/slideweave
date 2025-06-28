import { ElementValidator } from '../src/elements/validator';

describe('ElementValidator', () => {
  describe('基本バリデーション', () => {
    test('全要素タイプが定義済みであること', () => {
      const validTypes = [
        'slide', 'slideHeader', 'slideBody', 'slideFooter',
        'container', 'text', 'heading', 'list', 'listItem',
        'table', 'tableRow', 'tableCell', 'img', 'svg'
      ];

      validTypes.forEach(type => {
        const result = ElementValidator.validate({ type });
        expect(result.errors.some(e => e.message.startsWith('Unknown element type'))).toBe(false);
      });
    });

    test('不正なtype値でエラーメッセージが表示される', () => {
      const result = ElementValidator.validate({ type: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'Unknown element type: invalid',
        elementType: 'invalid'
      });
    });

    test('type未指定でエラーが発生する', () => {
      const result = ElementValidator.validate({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'type プロパティは必須です'
      });
    });
  });

  describe('text要素バリデーション', () => {
    test('textのcontent未指定時にエラーが発生する', () => {
      const result = ElementValidator.validate({ type: 'text' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'text要素にはcontentプロパティが必須です',
        elementType: 'text',
        property: 'content'
      });
    });

    test('正常なtext要素はvalidになる', () => {
      const result = ElementValidator.validate({
        type: 'text',
        content: 'Hello World'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('heading要素バリデーション', () => {
    test('heading要素でlevel未指定時にデフォルト値1が設定される', () => {
      const result = ElementValidator.validate({
        type: 'heading',
        content: 'Test Heading'
      });
      expect(result.isValid).toBe(true);
      expect(result.element?.type).toBe('heading');
      expect((result.element as any).level).toBe(1);
    });

    test('heading要素でcontent未指定時にエラーが発生する', () => {
      const result = ElementValidator.validate({ type: 'heading' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'heading要素にはcontentプロパティが必須です',
        elementType: 'heading',
        property: 'content'
      });
    });

    test('不正なlevel値でワーニングが出る', () => {
      const result = ElementValidator.validate({
        type: 'heading',
        content: 'Test',
        level: 7
      });
      expect(result.warnings).toContainEqual({
        type: 'warning',
        message: 'heading要素のlevelは1-6の整数である必要があります',
        elementType: 'heading',
        property: 'level'
      });
    });
  });

  describe('styleバリデーション', () => {
    test('style.margin: 2.5でワーニングが出る', () => {
      const result = ElementValidator.validate({
        type: 'container',
        style: { margin: 2.5 }
      });
      expect(result.warnings).toContainEqual({
        type: 'warning',
        message: 'margin値は8px単位（整数）である必要があります',
        property: 'style.margin'
      });
    });

    test('style.padding: 1.5でワーニングが出る', () => {
      const result = ElementValidator.validate({
        type: 'container',
        style: { padding: 1.5 }
      });
      expect(result.warnings).toContainEqual({
        type: 'warning',
        message: 'padding値は8px単位（整数）である必要があります',
        property: 'style.padding'
      });
    });

    test('正常なstyle値はワーニングなし', () => {
      const result = ElementValidator.validate({
        type: 'container',
        style: { margin: 2, padding: 1 }
      });
      expect(result.warnings.filter(w => w.property?.startsWith('style.'))).toHaveLength(0);
    });
  });

  describe('img要素バリデーション', () => {
    test('img要素でsrc未指定時にエラーが発生する', () => {
      const result = ElementValidator.validate({ type: 'img' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'img要素にはsrcプロパティが必須です',
        elementType: 'img',
        property: 'src'
      });
    });
  });

  describe('listItem要素バリデーション', () => {
    test('listItem要素でcontent未指定時にエラーが発生する', () => {
      const result = ElementValidator.validate({ type: 'listItem' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'listItem要素にはcontentプロパティが必須です',
        elementType: 'listItem',
        property: 'content'
      });
    });
  });

  describe('children バリデーション', () => {
    test('childrenが配列でない場合エラーが発生する', () => {
      const result = ElementValidator.validate({
        type: 'container',
        children: 'invalid'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'error',
        message: 'childrenプロパティは配列である必要があります',
        property: 'children'
      });
    });

    test('子要素のエラーが親要素のエラーとして報告される', () => {
      const result = ElementValidator.validate({
        type: 'container',
        children: [
          { type: 'text' } // content未指定
        ]
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => 
        e.message === 'children[0]: text要素にはcontentプロパティが必須です'
      )).toBe(true);
    });
  });
});