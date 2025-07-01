/**
 * Init command implementation  
 * 設定ファイルの初期化
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { CLIError, handleError } from '../utils/errors.js';

const configTemplate = `module.exports = {
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
`;

async function initConfig(force: boolean = false) {
  try {
    const configPath = path.resolve('slideweave.config.js');
    
    // 既存ファイルのチェック
    if (fs.existsSync(configPath) && !force) {
      throw new CLIError(
        'Configuration file already exists',
        1,
        'Use --force to overwrite the existing file'
      );
    }

    // 設定ファイルを作成
    fs.writeFileSync(configPath, configTemplate, 'utf8');
    
    logger.success(`Configuration file created: ${configPath}`);
    logger.info('You can now customize the settings in slideweave.config.js');
    
  } catch (error) {
    handleError(error);
  }
}

export const initCommand = new Command('init')
  .description('Initialize SlideWeave configuration file')
  .option('--force', 'Overwrite existing configuration file')
  .action(async (options: { force?: boolean }) => {
    await initConfig(options.force);
  });