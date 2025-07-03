# Slide Sections

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/sections/

## Syntax

```javascript
pptx.addSection({ title: "Tables" });
pptx.addSection({ title: "Tables", order: 3 });
```

## Section Options

| Option | Type | Description | Possible Values |
|--------|------|-------------|-----------------|
| `title` | string | section title | 0-n OR 'n%' |
| `order` | integer | section order | 1-n |

## Section Example

```javascript
import pptxgen from "pptxgenjs";

let pptx = new pptxgen();

// STEP 1: Create a section
pptx.addSection({ title: "Tables" });

// STEP 2: Provide section title to a slide that you want in corresponding section
let slide = pptx.addSlide({ sectionTitle: "Tables" });

slide.addText("This slide is in the Tables section!", { 
  x: 1.5, 
  y: 1.5, 
  fontSize: 18, 
  color: "363636" 
});

pptx.writeFile({ fileName: "Section Sample.pptx" });
```

Last updated on **Sep 12, 2021** by **Brent Ely**