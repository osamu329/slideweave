import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/**
 * 一時ファイルの管理とクリーンアップを行うクラス
 */
export class TempFileManager {
  private static instance: TempFileManager;
  private tempFiles: Set<string> = new Set();
  private tempDirs: Set<string> = new Set();
  private cleanupRegistered = false;
  private tempDir: string | null = null;

  private constructor() {
    this.registerCleanupHandlers();
  }

  static getInstance(): TempFileManager {
    if (!this.instance) {
      this.instance = new TempFileManager();
    }
    return this.instance;
  }

  /**
   * 一時ディレクトリを作成・取得
   */
  getTempDir(): string {
    if (!this.tempDir) {
      try {
        this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "slideweave-"));
        this.tempDirs.add(this.tempDir);
      } catch (error) {
        console.warn("Failed to create temp directory, using fallback:", error);
        // フォールバック：examples/outputディレクトリ
        this.tempDir = path.join(process.cwd(), "examples", "output");
        if (!fs.existsSync(this.tempDir)) {
          fs.mkdirSync(this.tempDir, { recursive: true });
        }
      }
    }
    return this.tempDir;
  }

  /**
   * 一時ファイルを登録
   */
  registerTempFile(filePath: string): void {
    this.tempFiles.add(filePath);
  }

  /**
   * 特定の一時ファイルを削除して登録から除外
   */
  cleanupFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      this.tempFiles.delete(filePath);
    } catch (error) {
      console.warn(`Failed to cleanup temp file ${filePath}:`, error);
    }
  }

  /**
   * すべての一時ファイルと一時ディレクトリをクリーンアップ
   */
  cleanupAll(): void {
    // 一時ファイルを削除
    for (const filePath of this.tempFiles) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.warn(`Failed to cleanup temp file ${filePath}:`, error);
      }
    }
    this.tempFiles.clear();

    // 一時ディレクトリを削除
    for (const dirPath of this.tempDirs) {
      try {
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      } catch (error) {
        console.warn(`Failed to cleanup temp directory ${dirPath}:`, error);
      }
    }
    this.tempDirs.clear();
    this.tempDir = null;
  }

  /**
   * 特定のパターンにマッチする一時ファイルをクリーンアップ
   */
  cleanupByPattern(pattern: RegExp, directory: string): void {
    try {
      if (!fs.existsSync(directory)) return;

      const files = fs.readdirSync(directory);
      files.forEach((file) => {
        if (pattern.test(file)) {
          const fullPath = path.join(directory, file);
          this.cleanupFile(fullPath);
        }
      });
    } catch (error) {
      console.warn(
        `Failed to cleanup files by pattern in ${directory}:`,
        error,
      );
    }
  }

  /**
   * プロセス終了時のクリーンアップハンドラーを登録
   */
  private registerCleanupHandlers(): void {
    if (this.cleanupRegistered) return;

    const cleanup = () => {
      this.cleanupAll();
    };

    // 通常終了
    process.on("exit", cleanup);

    // Ctrl+C
    process.on("SIGINT", () => {
      cleanup();
      process.exit(0);
    });

    // kill command
    process.on("SIGTERM", () => {
      cleanup();
      process.exit(0);
    });

    // 未処理例外
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      cleanup();
      process.exit(1);
    });

    // 未処理Promise rejection
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      cleanup();
      process.exit(1);
    });

    this.cleanupRegistered = true;
  }

  /**
   * 登録されている一時ファイル数を取得
   */
  getTempFileCount(): number {
    return this.tempFiles.size;
  }

  /**
   * 登録されている一時ファイル一覧を取得
   */
  getTempFiles(): string[] {
    return Array.from(this.tempFiles);
  }
}
