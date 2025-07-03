/**
 * SlideWeave要素型定義
 * Object記法でのスライド要素定義
 */

export type ElementType =
  | "deck"
  | "slide"
  | "header"
  | "footer"
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
  | "image"
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
  color: string; // #RRGGBB format
  blur: string; // px unit required
  offset: string; // px unit required
  angle: number; // 0-360 degrees
  opacity?: number; // 0-1
}

export interface BaseStyle {
  // Spacing
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  gap?: number | string;

  // Positioning
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  position?: "relative" | "absolute" | "static";

  // Dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;

  // Flexbox Layout
  flex?: number;
  flexDirection?: "row" | "column";
  flexWrap?: "nowrap" | "wrap";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "stretch";

  // Background
  backgroundColor?: string; // #RRGGBB format
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "fit" | "none";

  // Text
  color?: string; // #RRGGBB format
  fontSize?: string; // Must include unit: "16px", "12pt", etc.
  fontFamily?: string;
  fontWeight?: "normal" | "bold" | number;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right" | "justify";
}

export interface BaseElement {
  type: ElementType;
  id?: string; // 要素のID（レイアウトエンジン用）
  class?: string; // CSSクラス名（単一または複数のクラスをスペース区切りで指定）
  style?: BaseStyle;
  children?: Element[];
}

export interface DeckDefaults {
  fontSize?: string; // Default font size for all text elements
  fontFamily?: string;
  color?: string;
}

export interface DeckElement extends BaseElement {
  type: "deck";
  title?: string;
  description?: string;
  format?: "wide" | "standard";
  style?: DeckStyle;
  defaults?: DeckDefaults;
  slides: SlideElement[];
}

export interface DeckStyle {
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
}

export interface HeaderElement extends BaseElement {
  type: "header";
  content?: string;
}

export interface FooterElement extends BaseElement {
  type: "footer";
  content?: string;
}

export interface SlideElement extends BaseElement {
  type: "slide";
  title?: string;
  layout?: "title" | "content" | "blank";
  header?: HeaderElement;
  footer?: FooterElement;
  background?: SlideBackground;
  style?: SlideStyle;
}

export interface SlideStyle {
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
}

export interface SlideBackground {
  color?: string;
  image?: string;
  size?: "cover" | "contain" | "fit" | "none";
}

export interface ContainerElement extends BaseElement {
  type: "container";
}

export interface FrameStyle extends BaseStyle {
  borderColor?: string; // #RRGGBB format
  borderWidth?: string; // px unit required
  borderRadius?: string; // px unit required
  borderStyle?: "solid" | "dashed" | "dotted";
  glassEffect?: boolean;
  // グラデーション対応
  background?: Background;
}

export interface FrameElement extends BaseElement {
  type: "frame";
  style?: FrameStyle;
}

export interface TextStyle extends BaseStyle {
  fontWeight?: "normal" | "bold" | number;
  fontStyle?: "normal" | "italic";
  textShadow?: TextShadow;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  style?: TextStyle;
}

export interface HeadingElement extends BaseElement {
  type: "heading";
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TextStyle;
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

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt?: string;
  style?: BaseStyle;
}

export interface SvgElement extends BaseElement {
  type: "svg";
  content: string;
  style?: BaseStyle;
}

export type ShapeType = "rectangle" | "circle" | "ellipse";

export interface ShapeStyle extends BaseStyle {
  borderColor?: string; // #RRGGBB format
  borderWidth?: string; // px unit required
  borderStyle?: "solid" | "dashed" | "dotted";
  // グラデーション対応
  background?: Background;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shapeType: ShapeType;
  style?: ShapeStyle;
}

export type Element =
  | DeckElement
  | SlideElement
  | HeaderElement
  | FooterElement
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
  | ImageElement
  | SvgElement;
