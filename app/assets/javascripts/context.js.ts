/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />

class KeywordProperty {
  ellipse_height: number;
  ellipse_width: number;
  font_size: number;

  constructor(h: number, w: number, fs: number) {
    this.ellipse_height = h;
    this.ellipse_width = w;
    this.font_size = fs;
  }
}

class Context {
  // members
  stageHeight: number;
  stageWidth: number;
  rootKeyword: string;
  currentKeyword: string;
  currentPath: string[];
  keywordProperty: KeywordProperty;

  constructor(stageHeight: number, stageWidth: number, keywordProperty: KeywordProperty, keyword: string) {
    this.stageHeight = stageHeight;
    this.stageWidth = stageWidth;
    this.keywordProperty = keywordProperty;
    this.rootKeyword = keyword;
    this.currentKeyword = keyword;
    this.currentPath = [keyword];
  }

  effectHeight(x: number): number { return x * (this.stageHeight - this.keywordProperty.ellipse_height) + (this.keywordProperty.ellipse_height / 2) }
  effectHeightWithFontSize(x: number): number { return x * (this.stageHeight - this.keywordProperty.ellipse_height) + (this.keywordProperty.ellipse_height / 2) + (this.keywordProperty.font_size / 2) }
  effectWidth(x: number): number { return x * (this.stageWidth - this.keywordProperty.ellipse_width) + (this.keywordProperty.ellipse_width / 2) }

}

