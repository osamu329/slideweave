import { SVGGenerator } from '../../src/svg/SVGGenerator';

// test07で生成されるSVGの内容を確認
async function debugSVGBlur() {
  const generator = new SVGGenerator();
  
  const options = {
    width: 394,
    height: 172,
    glassEffect: true,
    borderRadius: "16px",
    backgroundBlur: {
      backgroundImagePath: './tmp/510.jpg',
      frameX: 32,
      frameY: 32,
      frameWidth: 394,
      frameHeight: 172,
      slideWidth: 960,
      slideHeight: 540,
      blurStrength: 8,
      quality: 70
    }
  };

  try {
    const svg = await generator.generateFrameSVG(options);
    console.log('Generated SVG:');
    console.log(svg);
    
    // SVGをファイルに保存して確認
    const fs = await import('fs');
    fs.writeFileSync('examples/temp/debug-blur.svg', svg);
    console.log('SVG saved to examples/temp/debug-blur.svg');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSVGBlur();