/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
/// <reference path="keyword.js.ts" />

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
  manager: KeywordManager;
  currentKeyword: string;
  currentPath: string[];
  keywordProperty: KeywordProperty;

  constructor(stageHeight: number, stageWidth: number, keywordProperty: KeywordProperty, manager: KeywordManager) {
    this.stageHeight = stageHeight;
    this.stageWidth = stageWidth;
    this.keywordProperty = keywordProperty;
    this.manager = manager;
    this.currentKeyword = manager.rootKeyword;
    this.currentPath = [manager.rootKeyword];
  }

  effectHeight(x: number): number { return x * (this.stageHeight - this.keywordProperty.ellipse_height) + (this.keywordProperty.ellipse_height / 2) }
  effectHeightWithFontSize(x: number): number { return x * (this.stageHeight - this.keywordProperty.ellipse_height) + (this.keywordProperty.ellipse_height / 2) + (this.keywordProperty.font_size / 2) }
  effectWidth(x: number): number { return x * (this.stageWidth - this.keywordProperty.ellipse_width) + (this.keywordProperty.ellipse_width / 2) }

}

