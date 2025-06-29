/**
 * SlideWeave要素型定義
 * Object記法でのスライド要素定義
 */

export type ElementType =
  | "slide"
  | "slideHeader"
  | "slideBody"
  | "slideFooter"
  | "container"
  | "frame"
  | "shape"
  | "text"
  | "heading"
  | "list"
  | "listItem"
  | "table"
  | "tableRow"
  | "tableCell"
  | "img"
  | "svg";

export interface GradientStop {
  color: string;
  offset: number;
}

export interface LinearGradient {
  type: "linearGradient";
  direction: string;
  stops: GradientStop[];
}

export interface RadialGradient {
  type: "radialGradient";
  stops: GradientStop[];
}

export type Background = string | LinearGradient | RadialGradient;

export interface TextShadow {
  type: "outer" | "inner";
  color: string;
  blur: number;
  offset: number;
  angle: number;
  opacity?: number;
}

export interface BaseStyle {
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  direction?: "row" | "column";
  gap?: number;
  backgroundColor?: string;
  background?: Background;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "fit" | "none";
  glassEffect?: boolean;
  borderColor?: string;
  borderWidth?: number;
  width?: number | string;
  height?: number | string;
  flex?: number;
  // テキスト関連プロパティ（CSS統合用）
  fontSize?: number | string;
  fontFamily?: string;
  color?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  // レイアウト関連（CSS統合用）
  alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "stretch";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  flexDirection?: "row" | "column";
  flexWrap?: "nowrap" | "wrap";
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

export interface BaseElement {
  type: ElementType;
  class?: string;  // CSSクラス名（単一または複数のクラスをスペース区切りで指定）
  style?: BaseStyle;
  children?: Element[];
}

export interface SlideElement extends BaseElement {
  type: "slide";
  title?: string;
  layout?: "title" | "content" | "blank";
}

export interface SlideHeaderElement extends BaseElement {
  type: "slideHeader";
}

export interface SlideBodyElement extends BaseElement {
  type: "slideBody";
}

export interface SlideFooterElement extends BaseElement {
  type: "slideFooter";
}

export interface ContainerElement extends BaseElement {
  type: "container";
}

export interface FrameStyle {
  backgroundColor?: string;
  background?: Background;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
}

export interface FrameElement extends BaseElement {
  type: "frame";
  style?: BaseStyle & FrameStyle;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: TextShadow;
}

export interface HeadingElement extends BaseElement {
  type: "heading";
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: TextShadow;
}

export interface ListElement extends BaseElement {
  type: "list";
  listType?: "bullet" | "number";
}

export interface ListItemElement extends BaseElement {
  type: "listItem";
  content: string;
  indentLevel?: number;
}

export interface TableElement extends BaseElement {
  type: "table";
  columns?: number;
  rows?: number;
}

export interface TableRowElement extends BaseElement {
  type: "tableRow";
}

export interface TableCellElement extends BaseElement {
  type: "tableCell";
  content?: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface ImgElement extends BaseElement {
  type: "img";
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface SvgElement extends BaseElement {
  type: "svg";
  content: string;
  width?: number;
  height?: number;
}

export type ShapeType = "rectangle" | "circle" | "ellipse";

export interface ShapeStyle {
  backgroundColor?: string;
  background?: Background;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shapeType: ShapeType;
  style?: BaseStyle & ShapeStyle;
}

export type Element =
  | SlideElement
  | SlideHeaderElement
  | SlideBodyElement
  | SlideFooterElement
  | ContainerElement
  | FrameElement
  | ShapeElement
  | TextElement
  | HeadingElement
  | ListElement
  | ListItemElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | ImgElement
  | SvgElement;
