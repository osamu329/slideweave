import { GridSystem } from '../src/grid/GridSystem';

describe('GridSystem', () => {
  describe('toPoints', () => {
    test('2グリッド単位が12ptに変換される', () => {
      expect(GridSystem.toPoints(2)).toBe(12);
    });

    test('1グリッド単位が6ptに変換される', () => {
      expect(GridSystem.toPoints(1)).toBe(6);
    });

    test('0グリッド単位が0ptに変換される', () => {
      expect(GridSystem.toPoints(0)).toBe(0);
    });

    test('4グリッド単位が24ptに変換される', () => {
      expect(GridSystem.toPoints(4)).toBe(24);
    });
  });

  describe('toInches', () => {
    test('12ptが0.17inchに変換される', () => {
      expect(GridSystem.toInches(12)).toBe(0.17);
    });

    test('72ptが1.00inchに変換される', () => {
      expect(GridSystem.toInches(72)).toBe(1.00);
    });

    test('36ptが0.50inchに変換される', () => {
      expect(GridSystem.toInches(36)).toBe(0.50);
    });

    test('0ptが0.00inchに変換される', () => {
      expect(GridSystem.toInches(0)).toBe(0.00);
    });
  });

  describe('gridToInches', () => {
    test('2グリッド単位が0.17inchに変換される', () => {
      expect(GridSystem.gridToInches(2)).toBe(0.17);
    });

    test('12グリッド単位が1.00inchに変換される', () => {
      expect(GridSystem.gridToInches(12)).toBe(1.00);
    });
  });

  describe('getDefaultTextOptions', () => {
    test('PPTXGenJSデフォルトオプションが正しく設定される', () => {
      const options = GridSystem.getDefaultTextOptions();
      expect(options).toEqual({
        margin: 0,
        isTextBox: true,
        lineSpacing: 0
      });
    });
  });

  describe('getPositionOptions', () => {
    test('位置・サイズオプションが正しく生成される', () => {
      const options = GridSystem.getPositionOptions(1, 2, 10, 5);
      expect(options).toEqual({
        x: 0.08,  // 1グリッド = 8px = 6pt = 0.08in
        y: 0.17,  // 2グリッド = 16px = 12pt = 0.17in
        w: 0.83,  // 10グリッド = 80px = 60pt = 0.83in
        h: 0.42   // 5グリッド = 40px = 30pt = 0.42in
      });
    });
  });
});