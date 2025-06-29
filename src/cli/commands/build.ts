/**
 * Build command implementation
 * JSON ファイルから PowerPoint スライドを生成
 */

import { Command } from 'commander';
import ora from 'ora';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger.js';
import { CLIError, handleError, validateInputFile, validateJSONSyntax } from '../utils/errors.js';
import { loadConfig, resolveOutputPath } from '../utils/config.js';

// SlideWeave core modules
import { renderLayout } from '../../layout/LayoutEngine.js';
import { PPTXRenderer } from '../../renderer/PPTXRenderer.js';
import { ElementValidator } from '../../elements/validator.js';
import { SlideDataLoader } from '../../data/SlideDataLoader.js';

interface BuildOptions {
  output?: string;
  css?: string[];
  config?: string;
  verbose?: boolean;
}

async function buildSlides(inputPath: string, options: BuildOptions) {
  try {
    // バリデーション
    validateInputFile(inputPath);
    validateJSONSyntax(inputPath);

    // 設定ロード
    const config = loadConfig(options.config);
    const outputPath = resolveOutputPath(inputPath, options.output, config);

    // verboseログ設定
    if (options.verbose) {
      logger.setVerbose(true);
    }

    logger.info(`Building slides from ${path.basename(inputPath)}`);
    logger.debug(`Input: ${inputPath}`);
    logger.debug(`Output: ${outputPath}`);

    const spinner = ora('Loading slide data...').start();

    // JSONファイルを読み込み
    const slideData = SlideDataLoader.loadFromFile(inputPath);
    spinner.succeed('Slide data loaded');

    // レイアウト設定（16:9デフォルト）
    const slideWidth = config.slide.width;
    const slideHeight = config.slide.height;

    logger.debug(`Slide dimensions: ${slideWidth}x${slideHeight}`);

    const renderer = new PPTXRenderer({
      slideWidth: slideWidth / 72, // ピクセル → インチ変換
      slideHeight: slideHeight / 72
    });

    // 各スライドを処理
    const processSpinner = ora(`Processing ${slideData.slides.length} slide(s)...`).start();

    for (let i = 0; i < slideData.slides.length; i++) {
      const slide = slideData.slides[i];
      
      processSpinner.text = `Processing slide ${i + 1}/${slideData.slides.length}`;
      
      // バリデーション
      const validation = ElementValidator.validate(slide);
      if (!validation.isValid) {
        processSpinner.fail(`Validation failed for slide ${i + 1}`);
        throw new CLIError(
          `Slide ${i + 1} validation failed`,
          2,
          validation.errors.join('\n')
        );
      }
      
      // レイアウト計算
      const slideLayout = await renderLayout(slide, slideWidth, slideHeight);
      
      // レンダリング
      await renderer.render(slideLayout);
    }

    processSpinner.succeed(`Processed ${slideData.slides.length} slide(s)`);

    // 出力ディレクトリを作成
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // ファイル保存
    const saveSpinner = ora('Saving PowerPoint file...').start();
    await renderer.save(outputPath);
    saveSpinner.succeed('PowerPoint file saved');

    logger.success(`Successfully generated: ${outputPath}`);
    
  } catch (error) {
    handleError(error);
  }
}

export const buildCommand = new Command('build')
  .description('Build PowerPoint slides from JSON file')
  .argument('<input>', 'Input JSON file path')
  .option('-o, --output <file>', 'Output PowerPoint file path')
  .option('--css <files...>', 'External CSS files to include')
  .option('-c, --config <file>', 'Configuration file path')
  .option('--verbose', 'Enable verbose logging')
  .action(async (input: string, options: BuildOptions) => {
    await buildSlides(input, options);
  });