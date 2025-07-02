/**
 * Error handling utilities for CLI
 */

import chalk from "chalk";
import fs from "fs";
import path from "path";
import { logger } from "./logger.js";

export class CLIError extends Error {
  public readonly exitCode: number;
  public readonly details?: string;

  constructor(message: string, exitCode: number = 1, details?: string) {
    super(message);
    this.name = "CLIError";
    this.exitCode = exitCode;
    this.details = details;
  }
}

export function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    logger.error(error.message);
    if (error.details) {
      console.error(chalk.gray(error.details));
    }
    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    logger.error(`Unexpected error: ${error.message}`);
    logger.debug(error.stack || "");
    process.exit(1);
  } else {
    logger.error(`Unknown error: ${String(error)}`);
    process.exit(1);
  }
}

export function validateInputFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new CLIError(
      `Input file not found: ${filePath}`,
      2,
      "Please check the file path and try again.",
    );
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".json") {
    throw new CLIError(
      `Unsupported file format: ${ext}`,
      2,
      "SlideWeave currently supports only JSON input files.",
    );
  }
}

export function validateJSONSyntax(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new CLIError(
        `Invalid JSON syntax in ${filePath}`,
        2,
        `JSON parse error: ${error.message}`,
      );
    }
    throw error;
  }
}
