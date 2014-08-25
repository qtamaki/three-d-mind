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

  childKeywords(): Keyword[] { return this.manager.keywords[this.currentKeyword]; }

  ratioToHeight(x: number): number { return x * (this.stageHeight - this.keywordProperty.ellipse_height) + (this.keywordProperty.ellipse_height / 2) }
  ratioToWidth(x: number): number { return x * (this.stageWidth - this.keywordProperty.ellipse_width) + (this.keywordProperty.ellipse_width / 2) }
  heightToRatio(x: number): number { return (x - (this.keywordProperty.ellipse_height / 2)) / (this.stageHeight - this.keywordProperty.ellipse_height) }
  widthToRatio(x: number): number { return (x - (this.keywordProperty.ellipse_width / 2)) / (this.stageWidth - this.keywordProperty.ellipse_width) }

  // 指定のキーワードに掘り下げる
  downKeyword(newKeyword: string): void {
    this.currentPath.push(newKeyword);
    this.currentKeyword = newKeyword;
    if(!this.manager.keywords[newKeyword]) {
      this.manager.keywords[newKeyword] = [];
    }
  }

  upKeyword(): void {
    // トップならばそれ以上登れない
    if(this.currentPath.length < 2) return;
    // それ以外は、一階層アップ
    this.currentPath.pop();
    this.currentKeyword = this.currentPath[this.currentPath.length - 1];
  }

}

