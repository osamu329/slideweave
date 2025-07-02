/**
 * Logger utility for CLI with colored output
 */

import chalk from "chalk";

export class Logger {
  private verbose: boolean;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  info(message: string) {
    console.log(chalk.blue("ℹ"), message);
  }

  success(message: string) {
    console.log(chalk.green("✅"), message);
  }

  warning(message: string) {
    console.log(chalk.yellow("⚠"), message);
  }

  error(message: string) {
    console.error(chalk.red("❌"), message);
  }

  debug(message: string) {
    if (this.verbose) {
      console.log(chalk.gray("🔍"), chalk.gray(message));
    }
  }

  step(message: string) {
    console.log(chalk.cyan("▶"), message);
  }

  setVerbose(verbose: boolean) {
    this.verbose = verbose;
  }
}

// デフォルトloggerインスタンス
export const logger = new Logger();
