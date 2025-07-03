# Shapes - PptxGenJS API Documentation

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/api-shapes/

## Usage

```javascript
// Shapes without text
slide.addShape(pres.ShapeType.rect, { fill: { color: "FF0000" } });
slide.addShape(pres.ShapeType.ellipse, {
  fill: { type: "solid", color: "0088CC" },
});
slide.addShape(pres.ShapeType.line, { line: { color: "FF0000", width: 1 } });

// Shapes with text
slide.addText("ShapeType.rect", {
  shape: pres.ShapeType.rect,
  fill: { color: "FF0000" },
});
slide.addText("ShapeType.ellipse", {
  shape: pres.ShapeType.ellipse,
  fill: { color: "FF0000" },
});
slide.addText("ShapeType.line", {
  shape: pres.ShapeType.line,
  line: { color: "FF0000", width: 1, dashType: "lgDash" },
});
```

## Properties

### Position/Size Props (PositionProps)

| Name | Type | Default | Description | Possible Values |
|------|------|---------|-------------|----------------|
| `x` | number | `1.0` | hor location (inches) | 0-n |
| `x` | string | - | hor location (percent) | 'n%'. (Ex: `{x:'50%'}` middle of the Slide) |
| `y` | number | `1.0` | ver location (inches) | 0-n |
| `y` | string | - | ver location (percent) | 'n%'. (Ex: `{y:'50%'}` middle of the Slide) |
| `w` | number | `1.0` | width (inches) | 0-n |
| `w` | string | - | width (percent) | 'n%'. (Ex: `{w:'50%'}` 50% the Slide width) |
| `h` | number | `1.0` | height (inches) | 0-n |
| `h` | string | - | height (percent) | 'n%'. (Ex: `{h:'50%'}` 50% the Slide height) |

### Shape-Specific Properties

#### Fill Properties
- `fill`: Object defining shape fill
  - `type`: Fill type ("solid", "gradient", etc.)
  - `color`: Fill color (hex or scheme color)

#### Line Properties
- `line`: Object defining shape outline
  - `color`: Line color
  - `width`: Line width
  - `dashType`: Line dash style

## Shape Types

Available shape types include:
- `rect`: Rectangle
- `ellipse`: Ellipse/Circle
- `line`: Line
- `triangle`: Triangle
- `pentagon`: Pentagon
- `hexagon`: Hexagon
- And many more...

## Examples

### Basic Rectangle

```javascript
slide.addShape(pres.ShapeType.rect, {
  x: 1.5,
  y: 1.5,
  w: 3,
  h: 1.5,
  fill: { color: "FF0000" }
});
```

### Circle with Border

```javascript
slide.addShape(pres.ShapeType.ellipse, {
  x: 5,
  y: 1.5,
  w: 2,
  h: 2,
  fill: { color: "0088CC" },
  line: { color: "000000", width: 2 }
});
```