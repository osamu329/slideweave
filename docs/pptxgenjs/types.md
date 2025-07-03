# Type Interfaces

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/types/

The PptxGenJS interfaces referenced in surrounding documentation. See the [complete list](https://github.com/gitbrent/PptxGenJS/blob/master/types/index.d.ts) on GitHub.

## Position Props (`PositionProps`)

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

## Data/Path Props (`DataOrPathProps`)

| Name | Type | Description | Possible Values |
|------|------|-------------|-----------------|
| `data` | string | image data (base64) | base64-encoded image string. (either `data` or `path` is required) |
| `path` | string | image path | Same as used in an (img src="") tag. (either `data` or `path` is required) |

## Hyperlink Props (`HyperlinkProps`)

| Name | Type | Description | Possible Values |
|------|------|-------------|-----------------|
| `slide` | number | link to a given slide | Ex: `2` |
| `tooltip` | string | tooltip text shown on hover | Ex: `"Visit our site"` |
| `url` | string | URL to open | Ex: `"https://github.com/"` |