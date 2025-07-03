# Masters and Placeholders | PptxGenJS

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/masters/

## Slide Masters

PptxGenJS allows defining Slide Master Layouts via objects to provide branding functionality. Masters are created using the `defineSlideMaster()` method with an options object.

### Slide Master Props (`SlideMasterProps`)

| Option | Type | Reqd? | Description | Possible Values |
|--------|------|-------|-------------|----------------|
| `title` | string | Y | Layout title/name | Unique name for this Master |
| `background` | BackgroundProps | | Background props | (see Background Props) |
| `margin` | number/array | | Slide margins | (inches) 0.0-Slide.width or TRBL array |
| `objects` | array | | Objects for Slide | Object with type and options |
| `slideNumber` | SlideNumberProps | | Slide numbers | (see SlideNumber Props) |

### Background Props (`BackgroundProps`)

| Option | Type | Default | Description | Possible Values |
|--------|------|---------|-------------|----------------|
| `color` | string | `000000` | Color | Hex color code or scheme color constant |
| `transparency` | number | `0` | Transparency | Percentage: 0-100 |

### SlideNumber Props (`SlideNumberProps`)

| Option | Type | Default | Description | Possible Values |
|--------|------|---------|-------------|----------------|
| `x` | number | `1.0` | Horizontal location | 0-n OR 'n%' |
| `y` | number | `1.0` | Vertical location | 0-n OR 'n%' |
| `w` | number | | Width | 0-n OR 'n%' |
| `h` | number | | Height | 0-n OR 'n%' |
| `align` | string | `left` | Alignment | `left`, `center`, or `right` |
| `color` | string | `000000` | Color | Hex color code or scheme color constant |

## Slide Master Example

```javascript
let pptx = new PptxGenJS();

// Define master
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "FFFFFF" },
  objects: [
    {
      text: {
        text: "Company Name",
        options: { x: 0, y: 5.3, w: 10, h: 1.0, align: "center", color: "0088CC" }
      }
    }
  ],
  slideNumber: { x: 1.0, y: 7.0, color: "FFFFFF" }
});

// Create slide with master
let slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
```