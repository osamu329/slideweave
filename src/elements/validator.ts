/**
 * SlideWeave要素バリデーション
 * 要素の型チェックとバリデーション機能
 */

import { Element, ElementType } from '../types/elements';

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  elementType?: ElementType;
  property?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  element?: Element;
}

export class ElementValidator {
  private static readonly VALID_ELEMENT_TYPES: ElementType[] = [
    'slide', 'slideHeader', 'slideBody', 'slideFooter',
    'container', 'text', 'heading', 'list', 'listItem',
    'table', 'tableRow', 'tableCell', 'img', 'svg'
  ];

  static validate(element: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    let validatedElement: Element | undefined;

    // 基本構造チェック
    if (!element || typeof element !== 'object') {
      errors.push({
        type: 'error',
        message: '要素はオブジェクトである必要があります'
      });
      return { isValid: false, errors, warnings };
    }

    // type プロパティチェック
    if (!element.type) {
      errors.push({
        type: 'error',
        message: 'type プロパティは必須です'
      });
      return { isValid: false, errors, warnings };
    }

    if (!this.VALID_ELEMENT_TYPES.includes(element.type)) {
      errors.push({
        type: 'error',
        message: `Unknown element type: ${element.type}`,
        elementType: element.type
      });
      return { isValid: false, errors, warnings };
    }

    // 要素タイプ別バリデーション
    this.validateElementType(element, errors, warnings);

    // style バリデーション
    if (element.style) {
      this.validateStyle(element.style, errors, warnings);
    }

    // children バリデーション
    if (element.children) {
      this.validateChildren(element.children, errors, warnings);
    }

    // デフォルト値設定
    validatedElement = this.applyDefaults(element);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      element: validatedElement
    };
  }

  private static validateElementType(element: any, errors: ValidationError[], warnings: ValidationError[]): void {
    switch (element.type) {
      case 'text':
        this.validateTextElement(element, errors, warnings);
        break;
      case 'heading':
        this.validateHeadingElement(element, errors, warnings);
        break;
      case 'img':
        this.validateImgElement(element, errors, warnings);
        break;
      case 'listItem':
        this.validateListItemElement(element, errors, warnings);
        break;
    }
  }

  private static validateTextElement(element: any, errors: ValidationError[], _warnings: ValidationError[]): void {
    if (!element.content || typeof element.content !== 'string') {
      errors.push({
        type: 'error',
        message: 'text要素にはcontentプロパティが必須です',
        elementType: 'text',
        property: 'content'
      });
    }
  }

  private static validateHeadingElement(element: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (!element.content || typeof element.content !== 'string') {
      errors.push({
        type: 'error',
        message: 'heading要素にはcontentプロパティが必須です',
        elementType: 'heading',
        property: 'content'
      });
    }

    if (element.level !== undefined) {
      if (!Number.isInteger(element.level) || element.level < 1 || element.level > 6) {
        warnings.push({
          type: 'warning',
          message: 'heading要素のlevelは1-6の整数である必要があります',
          elementType: 'heading',
          property: 'level'
        });
      }
    }
  }

  private static validateImgElement(element: any, errors: ValidationError[], _warnings: ValidationError[]): void {
    if (!element.src || typeof element.src !== 'string') {
      errors.push({
        type: 'error',
        message: 'img要素にはsrcプロパティが必須です',
        elementType: 'img',
        property: 'src'
      });
    }
  }

  private static validateListItemElement(element: any, errors: ValidationError[], _warnings: ValidationError[]): void {
    if (!element.content || typeof element.content !== 'string') {
      errors.push({
        type: 'error',
        message: 'listItem要素にはcontentプロパティが必須です',
        elementType: 'listItem',
        property: 'content'
      });
    }
  }

  private static validateStyle(style: any, _errors: ValidationError[], warnings: ValidationError[]): void {
    if (style.margin !== undefined) {
      if (!Number.isInteger(style.margin)) {
        warnings.push({
          type: 'warning',
          message: 'margin値は8px単位（整数）である必要があります',
          property: 'style.margin'
        });
      }
    }

    if (style.padding !== undefined) {
      if (!Number.isInteger(style.padding)) {
        warnings.push({
          type: 'warning',
          message: 'padding値は8px単位（整数）である必要があります',
          property: 'style.padding'
        });
      }
    }
  }

  private static validateChildren(children: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (!Array.isArray(children)) {
      errors.push({
        type: 'error',
        message: 'childrenプロパティは配列である必要があります',
        property: 'children'
      });
      return;
    }

    children.forEach((child, index) => {
      const childResult = this.validate(child);
      childResult.errors.forEach(error => {
        errors.push({
          ...error,
          message: `children[${index}]: ${error.message}`
        });
      });
      childResult.warnings.forEach(warning => {
        warnings.push({
          ...warning,
          message: `children[${index}]: ${warning.message}`
        });
      });
    });
  }

  private static applyDefaults(element: any): Element {
    const result = { ...element };

    // heading要素のデフォルトlevel設定
    if (element.type === 'heading' && element.level === undefined) {
      result.level = 1;
    }

    return result as Element;
  }
}