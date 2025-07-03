# Tables - PptxGenJS API Documentation

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/api-tables/

## Usage

```javascript
// TABLE 1: Single-row table
let rows = [["Cell 1", "Cell 2", "Cell 3"]];
slide.addTable(rows, { w: 9 });

// TABLE 2: Multi-row table
let rows = [["A1", "B1", "C1"]];
slide.addTable(rows, { align: "left", fontFace: "Arial" });

// TABLE 3: Formatting at a cell level
let rows = [
    [
        { text: "Top Lft", options: { align: "left", fontFace: "Arial" } },
        { text: "Top Ctr", options: { align: "center", fontFace: "Verdana" } },
        { text: "Top Rgt", options: { align: "right", fontFace: "Courier" } },
    ],
];
slide.addTable(rows, { w: 9, rowH: 1, align: "left", fontFace: "Arial" });
```

### Usage Notes

- Properties passed to `addTable()` apply to every cell in the table
- Selectively override formatting at a cell-level by providing properties to the cell object

### Cell Formatting

- Table cells can be plain text strings or objects with text and options properties
- Cell borders can be removed using the 'none' type
- Bullets and word-level formatting are supported inside table cells
- Detailed formatting options available in Text Props documentation

### Row Height

- Use `h` property to divide rows evenly
- Use `rowH` property with array of values to specify specific row heights
- Omit properties to have rows consume only required space

## Properties

### Position/Size Props

| Option | Type | Default | Description | Possible Values |
|--------|------|---------|-------------|----------------|
| `x` | number/string | `1.0` | Horizontal location | 0-n or 'n%' |
| `y` | number/string | `1.0` | Vertical location | 0-n or 'n%' |
| `w` | number/string | `1.0` | Width | 0-n or 'n%' |
| `h` | number/string | `1.0` | Height | 0-n or 'n%' |