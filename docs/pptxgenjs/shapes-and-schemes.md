# Shapes and Schemes

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/shapes-and-schemes/

## PowerPoint Shape Types

The library includes over 180 built-in PowerPoint shapes, sourced from the [officegen project](https://github.com/Ziv-Barber/officegen).

To view available shapes:
- Use inline TypeScript definitions
- Check `ShapeType` in [index.d.ts](https://github.com/gitbrent/PptxGenJS/blob/master/types/index.d.ts)

## PowerPoint Scheme Colors

Scheme colors are variables that change value when a different scheme palette is selected. They help maintain design consistency and prevent text/background contrast issues.

To view available colors:
- Use inline TypeScript definitions
- Check `SchemeColor` in [index.d.ts](https://github.com/gitbrent/PptxGenJS/blob/master/types/index.d.ts)

### Using Scheme Colors

Example of using a scheme color:

```javascript
slide.addText("Scheme Color 'text1'", { color: pptx.SchemeColor.text1 });
```

### Scheme Color Enum

```typescript
export enum SchemeColor {
    "text1" = "tx1",
    "text2" = "tx2",
    "background1" = "bg1",
    "background2" = "bg2",
    "accent1" = "accent1",
    "accent2" = "accent2",
    "accent3" = "accent3",
    "accent4" = "accent4",
    "accent5" = "accent5",
    "accent6" = "accent6",
}
```

A demo of Scheme Colors is available in the [Shapes Demo](https://gitbrent.github.io/PptxGenJS/demo/#shapes).

Last updated on **May 7, 2022** by **Brent Ely**