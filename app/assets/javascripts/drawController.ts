/// <reference path="jquery.d.ts" />

interface Keyword {
  keyword: string;
  x: number;
  y: number;
}

class DrawController {

  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }

  public onDraw: {
    (theme: string, keywords: Keyword[]): void;
  };

  private themes: {
    [key: string]: Keyword[]
  } = {};

  private currentTheme: string;

  public getCurrentTheme(): string { return this.currentTheme; }

  public changeTheme(theme: string): void {
    this.currentTheme = theme
    if (!theme) return;
    if (this.themes[theme]) {
      this.onDraw(theme, this.themes[theme])
    } else {
      this.themes[theme] = [];
      this.onDraw(theme, [])
    }
  }

  public addKeyword(keywordString: string): void {
    var keyword = {
      keyword: keywordString,
      x: Math.random(), // * this.width,
      y: Math.random() // * this.height
    };
    this.themes[this.currentTheme].push(keyword);
    this.onDraw(this.currentTheme, this.themes[this.currentTheme]);
  }

  public isReady(): boolean {
    return !(!this.currentTheme);
  }

  public isCurrentTheme(keyword: string): boolean {
    return this.currentTheme == keyword;
  }

  public validWord(keyword: string): boolean {
    if(!this.currentTheme) return true;
    if(this.currentTheme == keyword) return false;
    if(jQuery.inArray(keyword, this.themes[this.currentTheme]) >= 0) return false;
    return true;
  }

  public getChildSize(theme: string): number {
    if (this.themes[theme]) {
      return this.themes[theme].length;
    }else {
      return 0;
    }
  }
}
