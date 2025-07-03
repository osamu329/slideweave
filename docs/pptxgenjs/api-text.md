# PPTXGenJS Text API - Complete Documentation

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/api-text/

## Overview

The Text API in PPTXGenJS allows you to add text content to PowerPoint presentations with extensive formatting options. This documentation covers all text-related interfaces, properties, and usage examples.

## Main Text Interface

### `TextPropsOptions`

The main interface for text properties, extending multiple base interfaces:

```typescript
export interface TextPropsOptions extends PositionProps, DataOrPathProps, TextBaseProps, ObjectNameProps
```

## Core Text Properties (`TextBaseProps`)

### Basic Text Formatting

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `align` | `HAlign` | `'left'` | Horizontal alignment |
| `bold` | `boolean` | `false` | Bold style |
| `italic` | `boolean` | `false` | Italic style |
| `color` | `Color` | - | Text color (HexColor or ThemeColor) |
| `fontFace` | `string` | - | Font face name |
| `fontSize` | `number` | - | Font size |
| `highlight` | `HexColor` | - | Text highlight color |
| `transparency` | `number` | `0` | Transparency (0-100%) |

### Text Direction and Alignment

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `textDirection` | `'horz' \| 'vert' \| 'vert270' \| 'wordArtVert'` | `'horz'` | Text direction |
| `valign` | `VAlign` | `'top'` | Vertical alignment |

### Line Breaks and Formatting

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `breakLine` | `boolean` | `false` | Add a line-break |
| `softBreakBefore` | `boolean` | `false` | Add soft line-break (shift+enter) before content |

### Language Support

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lang` | `string` | `'en-US'` | Language (ISO 639-1 standard) |

### Underline Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `underline` | `object` | - | Underline properties |
| `underline.style` | `string` | - | Underline style |
| `underline.color` | `Color` | - | Underline color |

#### Underline Style Options

- `'dash'` - Dashed underline
- `'dashHeavy'` - Heavy dashed underline
- `'dashLong'` - Long dashed underline
- `'dashLongHeavy'` - Heavy long dashed underline
- `'dbl'` - Double underline
- `'dotDash'` - Dot-dash underline
- `'dotDashHeave'` - Heavy dot-dash underline
- `'dotDotDash'` - Dot-dot-dash underline
- `'dotDotDashHeavy'` - Heavy dot-dot-dash underline
- `'dotted'` - Dotted underline
- `'dottedHeavy'` - Heavy dotted underline
- `'heavy'` - Heavy underline
- `'none'` - No underline
- `'sng'` - Single underline
- `'wavy'` - Wavy underline
- `'wavyDbl'` - Double wavy underline
- `'wavyHeavy'` - Heavy wavy underline

### Bullet Points

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bullet` | `boolean \| object` | `false` | Bullet options |

#### Bullet Object Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'bullet' \| 'number'` | `'bullet'` | Bullet type |
| `characterCode` | `string` | - | Unicode character code |
| `indent` | `number` | `27` | Indentation in points |
| `numberType` | `string` | - | Number type for numbered bullets |
| `numberStartAt` | `number` | `1` | Starting number |

#### Number Type Options

- `'alphaLcParenBoth'` - Lowercase letters with parentheses both sides
- `'alphaLcParenR'` - Lowercase letters with right parenthesis
- `'alphaLcPeriod'` - Lowercase letters with period
- `'alphaUcParenBoth'` - Uppercase letters with parentheses both sides
- `'alphaUcParenR'` - Uppercase letters with right parenthesis
- `'alphaUcPeriod'` - Uppercase letters with period
- `'arabicParenBoth'` - Arabic numbers with parentheses both sides
- `'arabicParenR'` - Arabic numbers with right parenthesis
- `'arabicPeriod'` - Arabic numbers with period
- `'arabicPlain'` - Plain Arabic numbers
- `'romanLcParenBoth'` - Lowercase Roman numerals with parentheses both sides
- `'romanLcParenR'` - Lowercase Roman numerals with right parenthesis
- `'romanLcPeriod'` - Lowercase Roman numerals with period
- `'romanUcParenBoth'` - Uppercase Roman numerals with parentheses both sides
- `'romanUcParenR'` - Uppercase Roman numerals with right parenthesis
- `'romanUcPeriod'` - Uppercase Roman numerals with period

### Tab Stops

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tabStops` | `Array<{position: number, alignment?: string}>` | - | Tab stop positions |

#### Tab Stop Alignment Options

- `'l'` - Left alignment
- `'r'` - Right alignment
- `'ctr'` - Center alignment
- `'dec'` - Decimal alignment

## Extended Text Properties (`TextPropsOptions`)

### Character and Layout Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `baseline` | `number` | - | Baseline adjustment |
| `charSpacing` | `number` | - | Character spacing |
| `indentLevel` | `number` | - | Indentation level |
| `isTextBox` | `boolean` | - | Whether element is a text box |

### Text Fitting Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fit` | `'none' \| 'shrink' \| 'resize'` | `'none'` | Text fit options |
| `wrap` | `boolean` | `true` | Text wrap |

#### Text Fit Options

- `'none'` - Do not autofit
- `'shrink'` - Shrink text on overflow
- `'resize'` - Resize shape to fit text

### Line Spacing

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lineSpacing` | `number` | - | Line spacing in points |
| `lineSpacingMultiple` | `number` | - | Line spacing multiple (0.0-9.99) |
| `paraSpaceAfter` | `number` | - | Paragraph space after |
| `paraSpaceBefore` | `number` | - | Paragraph space before |

### Margin and Positioning

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `margin` | `Margin` | - | Margin in points |
| `rotate` | `number` | `0` | Rotation in degrees (-360 to 360) |
| `rtlMode` | `boolean` | `false` | Right-to-left mode |

### Advanced Text Effects

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `glow` | `TextGlowProps` | - | Text glow effect |
| `shadow` | `ShadowProps` | - | Text shadow |
| `outline` | `{color: Color, size: number}` | - | Text outline |
| `strike` | `boolean \| 'dblStrike' \| 'sngStrike'` | - | Strikethrough |
| `subscript` | `boolean` | - | Subscript |
| `superscript` | `boolean` | - | Superscript |

### Shape Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fill` | `ShapeFillProps` | - | Shape fill |
| `flipH` | `boolean` | `false` | Flip horizontally |
| `flipV` | `boolean` | `false` | Flip vertically |
| `line` | `ShapeLineProps` | - | Shape line |
| `rectRadius` | `number` | `0` | Rounded rectangle radius (0.0-1.0) |
| `shape` | `SHAPE_NAME` | - | Shape name |

### Hyperlinks

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hyperlink` | `HyperlinkProps` | - | Hyperlink properties |

### Text Orientation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `vert` | `string` | - | Text orientation |

#### Text Orientation Options

- `'eaVert'` - East Asian vertical
- `'horz'` - Horizontal
- `'mongolianVert'` - Mongolian vertical
- `'vert'` - Vertical
- `'vert270'` - Vertical 270 degrees
- `'wordArtVert'` - WordArt vertical
- `'wordArtVertRtl'` - WordArt vertical right-to-left

## Supporting Interfaces

### `TextGlowProps`

Text glow effect properties:

| Property | Type | Description |
|----------|------|-------------|
| `color` | `HexColor` | Border color (hex format) |
| `opacity` | `number` | Opacity (0.0-1.0) |
| `size` | `number` | Size in points |

### `ShadowProps`

Text shadow properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'outer' \| 'inner' \| 'none'` | `'none'` | Shadow type |
| `opacity` | `number` | - | Opacity (0.0-1.0) |
| `blur` | `number` | `0` | Blur in points (0-100) |
| `angle` | `number` | `0` | Angle in degrees (0-359) |
| `offset` | `number` | `0` | Offset in points (0-200) |
| `color` | `HexColor` | - | Shadow color |
| `rotateWithShape` | `boolean` | `false` | Rotate shadow with shape |

### `HyperlinkProps`

Hyperlink properties:

| Property | Type | Description |
|----------|------|-------------|
| `slide` | `number` | Slide number to link to |
| `url` | `string` | URL to link to |
| `tooltip` | `string` | Hyperlink tooltip |

## Usage Examples

### Basic Text

```javascript
slide.addText('Hello World', {
    x: 1,
    y: 1,
    w: 5,
    h: 1,
    fontSize: 18,
    color: 'FF0000',
    bold: true
});
```

### Text with Bullet Points

```javascript
slide.addText([
    { text: 'First item', options: { bullet: true } },
    { text: 'Second item', options: { bullet: true } },
    { text: 'Third item', options: { bullet: true } }
], {
    x: 1,
    y: 2,
    w: 8,
    h: 3
});
```

### Text with Custom Bullet

```javascript
slide.addText('Custom bullet item', {
    x: 1,
    y: 1,
    w: 5,
    h: 1,
    bullet: {
        type: 'bullet',
        characterCode: '25BA',
        indent: 20
    }
});
```

### Text with Numbered List

```javascript
slide.addText([
    { text: 'First item', options: { bullet: { type: 'number', numberType: 'arabicPeriod' } } },
    { text: 'Second item', options: { bullet: { type: 'number', numberType: 'arabicPeriod' } } },
    { text: 'Third item', options: { bullet: { type: 'number', numberType: 'arabicPeriod' } } }
], {
    x: 1,
    y: 2,
    w: 8,
    h: 3
});
```

### Text with Hyperlink

```javascript
slide.addText('Click here', {
    x: 1,
    y: 1,
    w: 3,
    h: 1,
    hyperlink: {
        url: 'https://example.com',
        tooltip: 'Visit Example.com'
    },
    color: '0000FF',
    underline: { style: 'sng' }
});
```

### Text with Shadow

```javascript
slide.addText('Shadow Text', {
    x: 1,
    y: 1,
    w: 4,
    h: 1,
    fontSize: 24,
    shadow: {
        type: 'outer',
        color: '999999',
        blur: 5,
        offset: 3,
        angle: 45,
        opacity: 0.8
    }
});
```

### Text with Glow Effect

```javascript
slide.addText('Glowing Text', {
    x: 1,
    y: 1,
    w: 4,
    h: 1,
    fontSize: 24,
    glow: {
        color: 'FF3399',
        opacity: 0.7,
        size: 8
    }
});
```

### Text with Line Spacing

```javascript
slide.addText('Line 1\nLine 2\nLine 3', {
    x: 1,
    y: 1,
    w: 4,
    h: 2,
    lineSpacing: 28,
    // or use multiple
    lineSpacingMultiple: 1.5
});
```

### Text with Margin

```javascript
slide.addText('Text with margin', {
    x: 1,
    y: 1,
    w: 4,
    h: 2,
    margin: [10, 20, 10, 20], // Top, Right, Bottom, Left
    fill: { color: 'F0F0F0' }
});
```

### Subscript and Superscript

```javascript
slide.addText([
    { text: 'H', options: {} },
    { text: '2', options: { subscript: true } },
    { text: 'O + E=mc', options: {} },
    { text: '2', options: { superscript: true } }
], {
    x: 1,
    y: 1,
    w: 4,
    h: 1,
    fontSize: 18
});
```

### Strikethrough Text

```javascript
slide.addText('Strikethrough text', {
    x: 1,
    y: 1,
    w: 4,
    h: 1,
    strike: true,
    // or specify type
    strike: 'dblStrike' // or 'sngStrike'
});
```

### Text Fit Options

```javascript
slide.addText('This is a very long text that might need to be fitted', {
    x: 1,
    y: 1,
    w: 2,
    h: 1,
    fit: 'shrink' // or 'resize'
});
```

## Deprecated Properties

The following properties are deprecated and should be avoided:

- `autoFit` - Use `fit` instead
- `shrinkText` - Use `fit` instead  
- `inset` - Use `margin` instead
- `lineDash` - Use `line.dashType` instead
- `lineHead` - Use `line.beginArrowType` instead
- `lineSize` - Use `line.width` instead
- `lineTail` - Use `line.endArrowType` instead

## Notes

- All measurements are in points unless otherwise specified
- Color values can be hex colors (e.g., 'FF0000') or theme colors (e.g., `pptx.SchemeColor.accent1`)
- Text fit options ('shrink' and 'resize') only take effect after editing text or resizing shape in PowerPoint
- Margins in PowerPoint are displayed in inches but this library uses points
- Default margin in PowerPoint is "Normal" [0.05", 0.1", 0.05", 0.1"] which translates to approximately [3.5, 7.0, 3.5, 7.0] points