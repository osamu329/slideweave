/**
 * Deck JSXコンポーネント
 * JSXのchildrenをSlideDataLoader形式のslidesに変換
 */

import type { DeckProps } from '../types';
import type { DeckElement } from '../../types/elements';

export function Deck(props: DeckProps): DeckElement {
  const { children, title, description, format, defaults, style, ...otherProps } = props;

  // childrenをslidesに変換
  const slides = Array.isArray(children) ? children : (children ? [children] : []);

  return {
    type: "deck",
    title,
    description,
    format,
    defaults,
    style,
    slides: slides.filter(Boolean), // null/undefinedを除外
    ...otherProps
  } as DeckElement;
}