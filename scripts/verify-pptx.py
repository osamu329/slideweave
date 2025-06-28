#!/usr/bin/env python3
# /// script
# requires-python = ">=3.8"
# dependencies = [
#   "python-pptx>=0.6.21",
# ]
# ///
"""
PPTXファイルの内容を検証するスクリプト
python-pptxを使用してPPTXの実際の内容を解析し、レポートを生成

使用方法:
  uv run scripts/verify-pptx.py <pptx-file>
"""

import sys
import json
from pathlib import Path
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE

def analyze_shape(shape, indent=0):
    """シェイプの情報を解析"""
    prefix = "  " * indent
    info = {
        "type": shape.shape_type,
        "name": shape.name,
        "left": shape.left,
        "top": shape.top,
        "width": shape.width,
        "height": shape.height,
    }
    
    # 位置とサイズ（EMU to インチ変換）
    print(f"{prefix}Shape: {shape.name}")
    print(f"{prefix}  Position: ({shape.left/914400:.2f}\", {shape.top/914400:.2f}\")")
    print(f"{prefix}  Size: {shape.width/914400:.2f}\" x {shape.height/914400:.2f}\"")
    
    # 背景色の確認
    if hasattr(shape, 'fill'):
        fill = shape.fill
        if fill.type == 1:  # Solid fill
            if fill.fore_color.rgb:
                print(f"{prefix}  Fill Color: #{fill.fore_color.rgb}")
            info["fill_color"] = str(fill.fore_color.rgb) if fill.fore_color.rgb else None
    
    # テキストの確認
    if shape.has_text_frame:
        text_frame = shape.text_frame
        for paragraph in text_frame.paragraphs:
            for run in paragraph.runs:
                if run.text.strip():
                    print(f"{prefix}  Text: \"{run.text}\"")
                    if run.font.color.rgb:
                        print(f"{prefix}    Font Color: #{run.font.color.rgb}")
                    print(f"{prefix}    Font Size: {run.font.size/12700:.1f}pt")
                    print(f"{prefix}    Bold: {run.font.bold}")
                    info["text"] = run.text
                    info["font_color"] = str(run.font.color.rgb) if run.font.color.rgb else None
                    info["font_size"] = run.font.size/12700 if run.font.size else None
    
    # グループシェイプの場合、子要素を再帰的に解析
    if shape.shape_type == MSO_SHAPE_TYPE.GROUP:
        print(f"{prefix}  Group with {len(shape.shapes)} shapes:")
        for child_shape in shape.shapes:
            analyze_shape(child_shape, indent + 1)
    
    return info

def verify_pptx(pptx_path):
    """PPTXファイルを検証"""
    print(f"=== PPTX Verification: {pptx_path} ===\n")
    
    prs = Presentation(pptx_path)
    
    # プレゼンテーション情報
    print(f"Slide Size: {prs.slide_width/914400:.1f}\" x {prs.slide_height/914400:.1f}\"")
    print(f"Number of Slides: {len(prs.slides)}\n")
    
    all_slides_info = []
    
    # 各スライドを解析
    for idx, slide in enumerate(prs.slides):
        print(f"=== Slide {idx + 1} ===")
        slide_info = {
            "slide_number": idx + 1,
            "shapes": []
        }
        
        # 背景色の確認
        if slide.background:
            if hasattr(slide.background, 'fill'):
                fill = slide.background.fill
                if fill.type == 1 and fill.fore_color.rgb:
                    print(f"Background Color: #{fill.fore_color.rgb}")
                    slide_info["background_color"] = str(fill.fore_color.rgb)
        
        # シェイプを解析
        print(f"Shapes: {len(slide.shapes)}")
        for shape in slide.shapes:
            shape_info = analyze_shape(shape)
            slide_info["shapes"].append(shape_info)
        
        all_slides_info.append(slide_info)
        print()
    
    # JSON形式でレポートを保存
    report_path = Path(pptx_path).with_suffix('.verification.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(all_slides_info, f, indent=2, ensure_ascii=False)
    print(f"Verification report saved to: {report_path}")
    
    return all_slides_info

def main():
    if len(sys.argv) < 2:
        print("Usage: python verify-pptx.py <pptx-file>")
        sys.exit(1)
    
    pptx_path = sys.argv[1]
    if not Path(pptx_path).exists():
        print(f"Error: File not found: {pptx_path}")
        sys.exit(1)
    
    verify_pptx(pptx_path)

if __name__ == "__main__":
    main()