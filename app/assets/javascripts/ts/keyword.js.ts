/// <reference path="jquery.d.ts" />

class Keyword {
  px: number;
  py: number;
  keyword: string;
  constructor(px: number, py: number, keyword: string){
    this.px = px;
    this.py = py;
    this.keyword = keyword;
  }
}

class KeywordManager {
  rootKeyword: string;
  keywords: {[key:string]: Keyword[];} = {}

  loadData(data: any) {
    this.rootKeyword = data.rootKeyword;
    $.each(data.keywords, (key, val) => {
      this.keywords[key] = [];
      $.each(val, (i, v) => {
        this.keywords[key].push(new Keyword(v.px, v.py, v.keyword));
      });
    });
  }
}

