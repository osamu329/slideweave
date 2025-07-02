/**
 * Build command implementation
 * JSON ファイルから PowerPoint スライドを生成
 */

import { Command } from "commander";
import ora from "ora";
import path from "path";
import fs from "fs";
import { logger } from "../utils/logger.js";
import {
  CLIError,
  handleError,
  validateInputFile,
  validateJSONSyntax,
} from "../utils/errors.js";
import { loadConfig, resolveOutputPath } from "../utils/config.js";

// SlideWeave core modules
import { renderLayout } from "../../layout/LayoutEngine.js";
import { PPTXRenderer } from "../../renderer/PPTXRenderer.js";
import { SchemaValidator } from "../../elements/SchemaValidator.js";
import { RuntimeValidator } from "../../elements/RuntimeValidator.js";
import { SlideDataLoader } from "../../data/SlideDataLoader.js";
import { DPIConverter } from "../../utils/DPIConverter.js";
import { SLIDE_FORMATS } from "../../utils/SlideFormats.js";

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
      logger.info(
        `Using external CSS files: ${options.css.map((f) => path.basename(f)).join(", ")}`,
      );
      options.css.forEach((cssFile) => logger.debug(`CSS: ${cssFile}`));
    }

    const spinner = ora("Loading slide data...").start();

    // JSONファイルを読み込み (外部CSSファイルがあれば一緒に処理)
    const deckData =
      options.css && options.css.length > 0
        ? SlideDataLoader.loadFromFileWithExternalCSS(inputPath, options.css)
        : SlideDataLoader.loadFromFile(inputPath);
    spinner.succeed("Slide data loaded");

    // format別のデフォルトサイズ決定
    const slideConfig = SLIDE_FORMATS[deckData.format || "wide"];

    logger.debug(
      `Slide dimensions: ${slideConfig.widthPx}x${slideConfig.heightPx}px, DPI: ${slideConfig.dpi}`,
    );

    const renderer = new PPTXRenderer(slideConfig);

    // JSONSchemaバリデーション
    const schemaValidator = new SchemaValidator();
    const schemaValidation = schemaValidator.validate(deckData);
    if (!schemaValidation.isValid) {
      throw new CLIError(
        "JSON Schema validation failed",
        2,
        schemaValidator.formatValidationResult(schemaValidation),
      );
    }

    // 実行時バリデーション（ファイル存在チェック等）
    const runtimeValidator = new RuntimeValidator();
    const runtimeValidation = runtimeValidator.validate(deckData);
    if (!runtimeValidation.isValid) {
      throw new CLIError(
        "Runtime validation failed",
        2,
        runtimeValidator.formatValidationResult(runtimeValidation),
      );
    }

    // 各スライドを処理
    const processSpinner = ora(
      `Processing ${deckData.slides.length} slide(s)...`,
    ).start();

    for (let i = 0; i < deckData.slides.length; i++) {
      const slide = deckData.slides[i];

      processSpinner.text = `Processing slide ${i + 1}/${deckData.slides.length}`;

      // スライドの子要素をコンテナとしてまとめてレイアウト計算
      if (slide.children && slide.children.length > 0) {
        // 子要素が複数ある場合は、暗黙的なコンテナでラップ
        if (slide.children.length === 1) {
          const slideLayout = await renderLayout(
            slide.children[0],
            slideConfig.widthPx,
            slideConfig.heightPx,
          );
          await renderer.render(slideLayout);
        } else {
          // 複数の子要素を持つ場合、コンテナでラップ
          const containerElement = {
            type: "container" as const,
            style: {
              width: `${slideConfig.widthPx}px`,
              height: `${slideConfig.heightPx}px`,
              flexDirection: "column" as const,
            },
            children: slide.children,
          };
          const slideLayout = await renderLayout(
            containerElement,
            slideConfig.widthPx,
            slideConfig.heightPx,
          );
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
    const saveSpinner = ora("Saving PowerPoint file...").start();
    await renderer.save(outputPath);
    saveSpinner.succeed("PowerPoint file saved");

    logger.success(`Successfully generated: ${outputPath}`);
  } catch (error) {
    handleError(error);
  }
}

export const buildCommand = new Command("build")
  .description("Build PowerPoint slides from JSON file")
  .argument("<input>", "Input JSON file path")
  .option("-o, --output <file>", "Output PowerPoint file path")
  .option("--css <files...>", "External CSS files to include")
  .option("-c, --config <file>", "Configuration file path")
  .option("--verbose", "Enable verbose logging")
  .action(async (input: string, options: BuildOptions) => {
    await buildSlides(input, options);
  });
