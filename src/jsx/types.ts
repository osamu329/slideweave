/**
 * SlideWeave JSX型定義
 * JSX要素の型安全性を提供
 */

import type {
  BaseStyle,
  DeckDefaults,
  SlideElement,
  ContainerElement,
  FrameElement,
  TextElement,
  HeadingElement,
  ShapeElement,
  ListElement,
  ListItemElement,
  TableElement,
  TableRowElement,
  TableCellElement,
  ImageElement,
  SvgElement,
  FrameStyle,
  ShapeStyle,
  ShapeType,
  TextShadow,
} from "../types/elements";


// 共通のJSXプロパティ（childrenは各要素で個別定義）
interface BaseJSXProps {
  class?: string;
  className?: string; // classNameもサポート（classに変換される）
  style?: BaseStyle | string; // オブジェクトまたはCSS文字列
}

// 各要素のJSXプロパティ型定義
export interface DeckProps extends BaseJSXProps {
  title?: string;
  description?: string;
  format?: "wide" | "standard";
  defaults?: DeckDefaults;
  children?: React.ReactNode;
}

export interface SlideProps extends BaseJSXProps {
  title?: string;
  layout?: "title" | "content" | "blank";
  children?: React.ReactNode;
}

export interface ContainerProps extends BaseJSXProps {
  children?: React.ReactNode;
}

export interface FrameProps extends BaseJSXProps {
  style?: (BaseStyle & FrameStyle) | string;
  children?: React.ReactNode;
}

export interface TextProps extends BaseJSXProps {
  content?: string; // contentがない場合はchildren使用
  fontSize?: number | string;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: TextShadow;
  children?: string; // テキスト要素は文字列のchildrenを受け取る
}

export interface HeadingProps extends BaseJSXProps {
  content?: string; // contentがない場合はchildren使用
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize?: number | string;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: TextShadow;
  children?: string; // ヘディング要素は文字列のchildrenを受け取る
}

export interface ShapeProps extends BaseJSXProps {
  shapeType: ShapeType;
  style?: (BaseStyle & ShapeStyle) | string;
  children?: never; // シェイプ要素は子要素を持たない
}

export interface ListProps extends BaseJSXProps {
  listType?: "bullet" | "number";
  children?: React.ReactNode;
}

export interface ListItemProps extends BaseJSXProps {
  content?: string; // contentがない場合はchildren使用
  indentLevel?: number;
  children?: never; // リストアイテム要素は子要素を持たない
}

export interface TableProps extends BaseJSXProps {
  columns?: number;
  rows?: number;
  children?: React.ReactNode;
}

export interface TableRowProps extends BaseJSXProps {
  children?: React.ReactNode;
}

export interface TableCellProps extends BaseJSXProps {
  content?: string; // contentがない場合はchildren使用
  colSpan?: number;
  rowSpan?: number;
  children?: never; // テーブルセル要素は子要素を持たない
}

export interface ImageProps extends BaseJSXProps {
  src: string;
  alt?: string;
  width?: string | 0; // 0のみ数値として許可、他は単位付き文字列
  height?: number;
  children?: never; // 画像要素は子要素を持たない
}

export interface SvgProps extends BaseJSXProps {
  content?: string; // contentがない場合はchildren使用
  width?: string | 0; // 0のみ数値として許可、他は単位付き文字列
  height?: number;
  children?: never; // SVG要素は子要素を持たない
}

// JSX namespace declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      deck: DeckProps;
      slide: SlideProps;
      container: ContainerProps;
      frame: FrameProps;
      text: TextProps;
      heading: HeadingProps;
      shape: ShapeProps;
      list: ListProps;
      listItem: ListItemProps;
      table: TableProps;
      tableRow: TableRowProps;
      tableCell: TableCellProps;
      image: ImageProps;
      svg: SvgProps;
      // その他のSlideWeave要素
      slideHeader: BaseJSXProps;
      slideBody: BaseJSXProps;
      slideFooter: BaseJSXProps;
    }
  }
}

// React.ReactNode と ReactElement の簡易定義（React非依存）
declare global {
  namespace React {
    type ReactNode =
      | string
      | number
      | boolean
      | null
      | undefined
      | ReactNode[]
      | { [key: string]: any };
    
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: string | number | null;
    }
  }
}

// JSXElementConstructor型定義
type JSXElementConstructor<P> = ((props: P) => React.ReactElement<any, any> | null) | (new (props: P) => Component<P, any>);
interface Component<P = {}, S = {}> {}

// 関数コンポーネントサポート
declare global {
  namespace JSX {
    type Element = any;
    type ElementType = string | ((props: any) => any);
  }
}
