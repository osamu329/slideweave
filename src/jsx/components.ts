/**
 * SlideWeave JSXコンポーネント型定義
 */

import type { Element } from "../types/elements";

// React.ReactNodeの定義（React非依存）
export type ReactNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | Element
  | ReactNode[];

// SlideWeaveコンポーネントの基本Props
export interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

// SlideWeaveコンポーネント型
export type SlideComponent<P = {}> = (
  props: P & ComponentProps,
) => Element | Element[] | ReactNode;

// よく使用されるコンポーネントProps型
export interface TwoColumnLayoutProps {
  left: ReactNode;
  right: ReactNode;
  gap?: number;
}

export interface CardProps {
  title?: string;
  children?: ReactNode;
  backgroundColor?: string;
  padding?: number;
}

export interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void; // 注意: PowerPointでは実際のクリックイベントは動作しない
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}
