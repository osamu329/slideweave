# Media

> **Source**: https://gitbrent.github.io/PptxGenJS/docs/api-media/

Media enables the addition of audio, video, and online video to Slides.

## Usage

```javascript
// Path: full or relative
slide.addMedia({ type: "video", path: "https://example.com/media/sample.mov" });
slide.addMedia({ type: "video", path: "../media/sample.mov" });

// Base64: pre-encoded string
slide.addMedia({ type: "audio", data: "audio/mp3;base64,iVtDafDrBF[...]=" });

// YouTube: Online video (supported in Microsoft 365)
slide.addMedia({ type: "online", link: "https://www.youtube.com/embed/Dph6ynRVyUc" });
```

### Usage Notes

Either provide a URL location or base64 data along with type to create media:
- `type` - type: media type
- `path` - URL: relative or full
- `data` - base64: string representing an encoded image

### Supported Formats and Notes

- Video (mpg, mov, mp4, m4v, et al.); Audio (mp3, wav, et al.)
- YouTube videos can be viewed using Microsoft 365/Office 365
- Other online video sites may be supported
- Platform compatibility varies (e.g., MacOS vs Windows support)

## Properties

### Position/Size Props

| Option | Type | Default | Description | Possible Values |
|--------|------|---------|-------------|----------------|
| `x` | number | `1.0` | hor location (inches) | 0-n |
| `x` | string | - | hor location (percent) | 'n%' (e.g., `{x:'50%'}`) |
| `y` | number | `1.0` | ver location (inches) | 0-n |
| `y` | string | - | ver location (percent) | 'n%' (e.g., `{y:'50%'}`) |
| `w` | number | `1.0` | width (inches) | 0-n |
| `w` | string | - | width (percent) | 'n%' |
| `h` | number | `1.0` | height (inches) | 0-n |
| `h` | string | - | height (percent) | 'n%' |