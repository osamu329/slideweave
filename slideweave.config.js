module.exports = {
  // 出力設定
  output: {
    directory: './output',
    filename: '[name].pptx'
  },
  
  // CSS設定
  css: {
    files: [],
    postcssPlugins: []
  },
  
  // スライド設定  
  slide: {
    width: 720,    // 16:9 aspect ratio
    height: 405,
    gridSize: 4
  }
};
