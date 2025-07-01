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
import { SchemaValidator } from '../../elements/SchemaValidator.js';
import { RuntimeValidator } from '../../elements/RuntimeValidator.js';
import { SlideDataLoader } from '../../data/SlideDataLoader.js';

interface BuildOptions {
  output?: string;
  css?: string[];
  config?: string;
  verbose?: boolean;
}

export async function buildSlides(inputPath: string, options: BuildOptions) {
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
    
    if (options.css && options.css.length > 0) {
      logger.info(`Using external CSS files: ${options.css.map(f => path.basename(f)).join(', ')}`);
      options.css.forEach(cssFile => logger.debug(`CSS: ${cssFile}`));
    }

    const spinner = ora('Loading slide data...').start();

    // JSONファイルを読み込み (外部CSSファイルがあれば一緒に処理)
    const deckData = options.css && options.css.length > 0
      ? SlideDataLoader.loadFromFileWithExternalCSS(inputPath, options.css)
      : SlideDataLoader.loadFromFile(inputPath);
    spinner.succeed('Slide data loaded');

    // レイアウト設定（16:9デフォルト）
    const slideWidth = config.slide.width;
    const slideHeight = config.slide.height;

    logger.debug(`Slide dimensions: ${slideWidth}x${slideHeight}`);

    const renderer = new PPTXRenderer({
      slideWidth: slideWidth / 72, // ピクセル → インチ変換
      slideHeight: slideHeight / 72
    });

    // JSONSchemaバリデーション
    const schemaValidator = new SchemaValidator();
    const schemaValidation = schemaValidator.validate(deckData);
    if (!schemaValidation.isValid) {
      throw new CLIError(
        'JSON Schema validation failed',
        2,
        schemaValidator.formatValidationResult(schemaValidation)
      );
    }

    // 実行時バリデーション（ファイル存在チェック等）
    const runtimeValidator = new RuntimeValidator();
    const runtimeValidation = runtimeValidator.validate(deckData);
    if (!runtimeValidation.isValid) {
      throw new CLIError(
        'Runtime validation failed',
        2,
        runtimeValidator.formatValidationResult(runtimeValidation)
      );
    }

    // 各スライドを処理
    const processSpinner = ora(`Processing ${deckData.slides.length} slide(s)...`).start();

    for (let i = 0; i < deckData.slides.length; i++) {
      const slide = deckData.slides[i];
      
      processSpinner.text = `Processing slide ${i + 1}/${deckData.slides.length}`;
      
      // 各子要素をレイアウト計算してレンダリング
      if (slide.children) {
        for (const child of slide.children) {
          const slideLayout = await renderLayout(child, slideWidth, slideHeight);
          await renderer.render(slideLayout);
        }
      }
    }

    processSpinner.succeed(`Processed ${deckData.slides.length} slide(s)`);

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