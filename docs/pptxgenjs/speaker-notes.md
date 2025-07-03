# Speaker Notes

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/speaker-notes/

Speaker Notes can be included on any Slide.

## Syntax

```javascript
slide.addNotes('TEXT');
```

## Example: JavaScript

```javascript
let pres = new PptxGenJS();
let slide = pptx.addSlide();
slide.addText('Hello World!', { x:1.5, y:1.5, fontSize:18, color:'363636' });
slide.addNotes('This is my favorite slide!');
pptx.writeFile('Sample Speaker Notes');
```

## Example: TypeScript

```typescript
import pptxgen from "pptxgenjs";
let pres = new pptxgen();
let slide = pptx.addSlide();
slide.addText('Hello World!', { x:1.5, y:1.5, fontSize:18, color:'363636' });
slide.addNotes('This is my favorite slide!');
pptx.writeFile('Sample Speaker Notes');
```

*Last updated on May 7, 2022 by Brent Ely*