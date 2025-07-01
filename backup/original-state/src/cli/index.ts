#!/usr/bin/env node

/**
 * SlideWeave CLI - Main entry point
 * JSONファイルからPowerPointスライドを生成するコマンドラインツール
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { buildCommand } from './commands/build.js';
import { initCommand } from './commands/init.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// package.jsonからバージョンを取得
function getVersion(): string {
  try {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    return '0.1.0'; // fallback version
  }
}

const program = new Command();

program
  .name('slideweave')
  .description('PowerPoint slide creation tool from JSON/CSS files')
  .version(getVersion(), '-v, --version', 'Show version number');

// buildコマンドを追加
program.addCommand(buildCommand);

// initコマンドを追加  
program.addCommand(initCommand);

// ヘルプメッセージのカスタマイズ
program.configureHelp({
  sortSubcommands: true,
  helpWidth: 80
});

// エラーハンドリング
program.exitOverride();

try {
  program.parse();
} catch (err: any) {
  if (err.code === 'commander.help' || err.code === 'commander.version') {
    // ヘルプやバージョン表示は正常終了
    process.exit(0);
  } else {
    console.error(chalk.red('❌ Error:'), err.message);
    process.exit(1);
  }
}