/**
 * SlideWeave JSX型定義
 * JSX要素の型安全性を提供
 */

import type {
  BaseStyle,
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
  ImgElement,
  SvgElement,
  FrameStyle,
  ShapeStyle,
  ShapeType,
  TextShadow
} from '../types/elements';

// 共通のJSXプロパティ
interface BaseJSXProps {
  children?: React.ReactNode;
  class?: string;
  className?: string;  // classNameもサポート（classに変換される）
  style?: BaseStyle | string;  // オブジェクトまたはCSS文字列
}

// 各要素のJSXプロパティ型定義
export interface SlideProps extends BaseJSXProps {
  title?: string;
  layout?: "title" | "content" | "blank";
  style?: BaseStyle | string;
}

export interface ContainerProps extends BaseJSXProps {
  style?: BaseStyle | string;
}

export interface FrameProps extends BaseJSXProps {
  style?: (BaseStyle & FrameStyle) | string;
}

export interface TextProps extends BaseJSXProps {
  content?: string;  // contentがない場合はchildren使用
  fontSize?: number | string;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: TextShadow;
  style?: BaseStyle | string;
}

export interface HeadingProps extends BaseJSXProps {
  content?: string;  // contentがない場合はchildren使用
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize?: number | string;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: TextShadow;
  style?: BaseStyle | string;
}

export interface ShapeProps extends BaseJSXProps {
  shapeType: ShapeType;
  style?: (BaseStyle & ShapeStyle) | string;
}

export interface ListProps extends BaseJSXProps {
  listType?: "bullet" | "number";
  style?: BaseStyle | string;
}

export interface ListItemProps extends BaseJSXProps {
  content?: string;  // contentがない場合はchildren使用
  indentLevel?: number;
  style?: BaseStyle | string;
}

export interface TableProps extends BaseJSXProps {
  columns?: number;
  rows?: number;
  style?: BaseStyle | string;
}

export interface TableRowProps extends BaseJSXProps {
  style?: BaseStyle | string;
}

export interface TableCellProps extends BaseJSXProps {
  content?: string;  // contentがない場合はchildren使用
  colSpan?: number;
  rowSpan?: number;
  style?: BaseStyle | string;
}

export interface ImgProps extends BaseJSXProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: BaseStyle | string;
}

export interface SvgProps extends BaseJSXProps {
  content?: string;  // contentがない場合はchildren使用
  width?: number;
  height?: number;
  style?: BaseStyle | string;
}

// JSX namespace declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
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
      img: ImgProps;
      svg: SvgProps;
      // その他のSlideWeave要素
      slideHeader: BaseJSXProps;
      slideBody: BaseJSXProps;
      slideFooter: BaseJSXProps;
    }
  }
}

// React.ReactNode の簡易定義（React非依存）
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
  }
}

// 関数コンポーネントサポート
declare global {
  namespace JSX {
    type Element = any;
    type ElementType = string | ((props: any) => any);
  }
}