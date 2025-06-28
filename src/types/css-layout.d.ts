declare module 'css-layout' {
  interface CSSLayoutStyle {
    width?: number;
    height?: number;
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
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    flex?: number;
  }

  interface CSSLayoutNode {
    style?: CSSLayoutStyle;
    children?: CSSLayoutNode[];
  }

  interface ComputedLayout {
    left: number;
    top: number;
    width: number;
    height: number;
    children?: ComputedLayout[];
  }

  function cssLayout(node: CSSLayoutNode): ComputedLayout;
  export = cssLayout;
}