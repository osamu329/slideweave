/**
 * CSSライクスタイルシート機能
 * クラスセレクタによるスタイル定義とPowerPoint対応プロパティのサポート
 */

import postcss, { Rule, Declaration } from 'postcss';
import postcssImport from 'postcss-import';
import { CSSStyleParser, ParsedStyle } from './CSSStyleParser';
import { TailwindUtilities } from './TailwindUtilities';

export interface StylesheetRules {
  [className: string]: ParsedStyle;
}

export interface PowerPointProperty {
  supported: boolean;
  alternative?: string;
  warning?: string;
}

export interface ParseResult {
  styles: StylesheetRules;
  warnings: string[];
}

/**
 * PowerPoint対応CSSプロパティのホワイトリスト
 */
const POWERPOINT_PROPERTIES: Record<string, PowerPointProperty> = {
  // レイアウト（対応）
  'width': { supported: true },
  'height': { supported: true },
  'padding': { supported: true },
  'padding-top': { supported: true },
  'padding-right': { supported: true },
  'padding-bottom': { supported: true },
  'padding-left': { supported: true },
  'margin': { supported: true },
  'margin-top': { supported: true },
  'margin-right': { supported: true },
  'margin-bottom': { supported: true },
  'margin-left': { supported: true },
  'flex-direction': { supported: true },
  'gap': { 
    supported: false, 
    alternative: 'margin', 
    warning: 'gap is not supported in PowerPoint. Use margin for spacing control' 
  },
  'flex': { 
    supported: false, 
    alternative: 'width/height', 
    warning: 'flex property is not supported. Use explicit width/height instead' 
  },

  // 背景（対応）
  'background-color': { supported: true },
  'background-image': { supported: true },

  // テキスト（対応）
  'font-size': { supported: true },
  'font-family': { supported: true },
  'color': { supported: true },
  'text-align': { supported: true },
  'font-weight': { supported: true },
  'font-style': { supported: true },
  'line-height': { 
    supported: false, 
    warning: 'line-height is not supported in PowerPoint context' 
  },

  // 境界（対応）
  'border': { supported: true },
  'border-radius': { supported: true },

  // 効果（限定対応）
  'opacity': { supported: true },
  'box-shadow': { supported: true, warning: 'box-shadow support is limited in PowerPoint' },

  // フレックスボックス詳細（非対応）
  'justify-content': { 
    supported: false, 
    alternative: 'flex-direction', 
    warning: 'justify-content is not supported. Use flex-direction for layout control' 
  },
  'align-items': { 
    supported: false, 
    alternative: 'padding', 
    warning: 'align-items is not supported. Use padding for alignment control' 
  },
  'flex-wrap': { 
    supported: false, 
    warning: 'flex-wrap is not supported in PowerPoint context' 
  },

  // グリッド（非対応）
  'display': { 
    supported: false, 
    alternative: 'flex-direction', 
    warning: 'display: grid is not supported. Use flex-direction instead' 
  },
  'grid-template-columns': { 
    supported: false, 
    alternative: 'flex-direction: row', 
    warning: 'CSS Grid is not supported. Use flex-direction for layout' 
  },
  'grid-template-rows': { 
    supported: false, 
    alternative: 'flex-direction: column', 
    warning: 'CSS Grid is not supported. Use flex-direction for layout' 
  },

  // 位置（要調査）
  'position': { 
    supported: false, 
    warning: 'position is not fully supported in PowerPoint context' 
  },
  'top': { 
    supported: false, 
    warning: 'Absolute positioning is not supported. Use margin/padding instead' 
  },
  'left': { 
    supported: false, 
    warning: 'Absolute positioning is not supported. Use margin/padding instead' 
  },
  'z-index': { 
    supported: false, 
    warning: 'z-index is not supported in PowerPoint context' 
  }
};

export class CSSStylesheetParser {
  /**
   * CSSスタイルシートを解析してクラス別スタイル定義を取得
   * @param cssText CSSスタイルシート文字列
   * @returns 解析結果（スタイル定義と警告）
   */
  static parse(cssText: string): ParseResult {
    const styles: StylesheetRules = {};
    const warnings: string[] = [];

    // 組み込みTailwindユーティリティクラスを最初に追加
    this.addBuiltinTailwindClasses(styles);

    if (!cssText || cssText.trim() === '') {
      return { styles, warnings };
    }

    try {
      const root = postcss.parse(cssText);
      
      root.each((node) => {
        if (node.type === 'rule') {
          const rule = node as Rule;
          
          // クラスセレクタのみをサポート
          rule.selectors.forEach((selector) => {
            if (this.isClassSelector(selector)) {
              const className = this.extractClassName(selector);
              if (className) {
                const { style, ruleWarnings } = this.parseRuleDeclarations(rule);
                styles[className] = style;
                warnings.push(...ruleWarnings);
              }
            } else {
              warnings.push(`⚠️  Selector "${selector}" is not supported. Only class selectors (e.g., .my-class) are supported.`);
            }
          });
        } else if (node.type === 'atrule' && node.name === 'import') {
          // @import ディレクティブの警告
          warnings.push(`⚠️  @import directive is not yet supported. External CSS files will be supported in a future update.`);
        }
      });

    } catch (error) {
      warnings.push(`❌ CSS parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { styles, warnings };
  }

  /**
   * クラスセレクタかどうかを判定
   * @param selector CSSセレクタ
   * @returns クラスセレクタの場合true
   */
  private static isClassSelector(selector: string): boolean {
    const trimmed = selector.trim();
    return trimmed.startsWith('.') && !trimmed.includes(' ') && !trimmed.includes('>') && !trimmed.includes('+') && !trimmed.includes('~');
  }

  /**
   * クラスセレクタからクラス名を抽出
   * @param selector CSSセレクタ（例: ".my-class"）
   * @returns クラス名（例: "my-class"）
   */
  private static extractClassName(selector: string): string | null {
    const match = selector.trim().match(/^\.([a-zA-Z0-9_-]+)$/);
    return match ? match[1] : null;
  }

  /**
   * CSSルールの宣言をパースしてスタイルオブジェクトに変換
   * @param rule PostCSS Rule
   * @returns スタイルオブジェクトと警告
   */
  private static parseRuleDeclarations(rule: Rule): { style: ParsedStyle; ruleWarnings: string[] } {
    const style: ParsedStyle = {};
    const ruleWarnings: string[] = [];

    rule.each((decl) => {
      if (decl.type === 'decl') {
        const declaration = decl as Declaration;
        const prop = declaration.prop;
        const value = declaration.value;

        // PowerPoint対応チェック
        const propInfo = POWERPOINT_PROPERTIES[prop];
        if (propInfo) {
          if (!propInfo.supported) {
            let warning = `⚠️  CSS property "${prop}" is not supported in PowerPoint context`;
            if (propInfo.alternative) {
              warning += `. Consider using "${propInfo.alternative}" instead`;
            }
            if (propInfo.warning) {
              warning = `⚠️  ${propInfo.warning}`;
            }
            ruleWarnings.push(warning);
            return; // 非対応プロパティはスキップ
          } else if (propInfo.warning) {
            ruleWarnings.push(`💡 ${propInfo.warning}`);
          }
        } else {
          // 未知のプロパティ
          ruleWarnings.push(`❓ CSS property "${prop}" support is unknown. Please verify PowerPoint compatibility.`);
        }

        // CSS変数の警告
        if (value.includes('var(')) {
          ruleWarnings.push(`⚠️  CSS variables (e.g., var(--variable)) are not yet fully supported. Consider using literal values instead.`);
        }

        // CSSStyleParserを使用して値をパース
        const cssString = `${prop}: ${value}`;
        const parsedStyle = CSSStyleParser.parse(cssString);
        Object.assign(style, parsedStyle);
      }
    });

    return { style, ruleWarnings };
  }

  /**
   * 対応済みCSSプロパティの一覧を取得
   * @returns 対応済みプロパティの配列
   */
  static getSupportedProperties(): string[] {
    return Object.entries(POWERPOINT_PROPERTIES)
      .filter(([_, info]) => info.supported)
      .map(([prop, _]) => prop);
  }

  /**
   * 非対応CSSプロパティの一覧を取得
   * @returns 非対応プロパティの配列
   */
  static getUnsupportedProperties(): string[] {
    return Object.entries(POWERPOINT_PROPERTIES)
      .filter(([_, info]) => !info.supported)
      .map(([prop, _]) => prop);
  }

  /**
   * 特定のプロパティのサポート状況を確認
   * @param property CSSプロパティ名
   * @returns サポート情報
   */
  static getPropertySupport(property: string): PowerPointProperty | null {
    return POWERPOINT_PROPERTIES[property] || null;
  }

  /**
   * @importディレクティブを処理してCSSスタイルシートを解析
   * @param cssText CSSスタイルシート文字列（@import含む）
   * @param fileMap 外部ファイルのマップ（テスト用）
   * @returns 解析結果（スタイル定義と警告）
   */
  static parseWithImports(
    cssText: string, 
    fileMap?: Record<string, string>
  ): ParseResult {
    if (!cssText || cssText.trim() === '') {
      return { styles: {}, warnings: [] };
    }

    try {
      // Simple @import processing for testing
      let processedCSS = cssText;
      
      if (fileMap) {
        // Replace @import statements with actual CSS content
        for (const [filename, content] of Object.entries(fileMap)) {
          const importRegex = new RegExp(`@import\\s+['"]${filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?`, 'g');
          processedCSS = processedCSS.replace(importRegex, content);
        }
      }

      // 処理済みCSSを通常のparse方法で解析
      return this.parse(processedCSS);

    } catch (error) {
      return {
        styles: {},
        warnings: [`❌ CSS import processing error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * 組み込みTailwindユーティリティクラスをstylesに追加
   * @param styles スタイルルールオブジェクト
   */
  private static addBuiltinTailwindClasses(styles: StylesheetRules): void {
    const tailwindClasses = TailwindUtilities.getSupportedClasses();
    
    for (const className of tailwindClasses) {
      const style = TailwindUtilities.parseClass(className);
      styles[className] = style;
    }
  }
}