# PptxGenJS Images API

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/api-images/

## Basic Usage

```javascript
// Add image from remote URL
slide.addImage({ path: "https://example.com/image.jpg" });

// Add image from local URL
slide.addImage({ path: "images/chart.png" });

// Add image from base64 data
slide.addImage({ data: "image/png;base64,iVtDafDrBF[...]=" });
```

## Supported Image Formats
- Standard image types: PNG, JPG, GIF
- Animated GIFs (limited support)
- SVG images (newest PowerPoint versions)

## Key Properties

### Position and Size
- `x`: Horizontal location (inches or percentage)
- `y`: Vertical location (inches or percentage)
- `w`: Width (inches or percentage)
- `h`: Height (inches or percentage)

### Image-Specific Properties
- `altText`: Description of the image
- `flipH`: Horizontal flip
- `flipV`: Vertical flip
- `rotate`: Rotation (0-359 degrees)
- `transparency`: Opacity (0-100)

## Sizing Options

### Sizing Types
- `contain`: Shrinks image to fit area while preserving ratio
- `cover`: Fills area, potentially cropping image
- `crop`: Cuts specific area of image

```javascript
slide.addImage({
  path: "image.jpg",
  sizing: {
    type: 'cover',
    w: 2,
    h: 2
  }
});
```

## Performance Tip
Pre-encode images to base64 to improve performance and reduce dependencies.

## Example with Multiple Properties

```javascript
slide.addImage({
  path: "logo.png",
  x: 1,
  y: 1,
  w: 2,
  h: 2,
  rotate: 45,
  rounding: true,
  shadow: { type: 'outer' }
});
```