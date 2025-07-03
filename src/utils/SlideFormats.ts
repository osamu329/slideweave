/**
 * スライド形式別の標準設定値
 */

import { createPixels, Pixels } from "../types/units";

export const SLIDE_FORMATS = {
  wide: { widthPx: createPixels(1280), heightPx: createPixels(720), dpi: 96 }, // 16:9, PowerPoint標準ワイド
  standard: { widthPx: createPixels(720), heightPx: createPixels(540), dpi: 72 }, // 4:3, PowerPoint標準
} as const;

export type SlideFormat = keyof typeof SLIDE_FORMATS;
export type SlideConfig = (typeof SLIDE_FORMATS)[SlideFormat];
