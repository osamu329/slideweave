/**
 * Configuration management for SlideWeave CLI
 */

import { cosmiconfigSync } from "cosmiconfig";
import path from "path";

export interface SlideWeaveConfig {
  output: {
    directory: string;
    filename: string;
  };
  css: {
    files: string[];
    postcssPlugins: string[];
  };
}

const defaultConfig: SlideWeaveConfig = {
  output: {
    directory: "./examples/output",
    filename: "[name].pptx",
  },
  css: {
    files: [],
    postcssPlugins: [],
  },
};

export function loadConfig(configPath?: string): SlideWeaveConfig {
  const explorer = cosmiconfigSync("slideweave");

  let result;
  if (configPath) {
    result = explorer.load(configPath);
  } else {
    result = explorer.search();
  }

  if (result) {
    return {
      ...defaultConfig,
      ...result.config,
    };
  }

  return defaultConfig;
}

export function resolveOutputPath(
  inputPath: string,
  outputOption?: string,
  config?: SlideWeaveConfig,
): string {
  if (outputOption) {
    return path.resolve(outputOption);
  }

  const cfg = config || defaultConfig;
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const filename = cfg.output.filename.replace("[name]", inputName);

  return path.resolve(cfg.output.directory, filename);
}

export { defaultConfig };
