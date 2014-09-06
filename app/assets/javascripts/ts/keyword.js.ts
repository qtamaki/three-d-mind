/// <reference path="jquery.d.ts" />

class Keyword {
  static image_re: RegExp = /\!\[(.*)]\((.*)\)$/;
  static http_re: RegExp = /http(|s):\/\/.*\.(png|jpg|gif|jpeg)$/i;
  px: number;
  py: number;
  keyword: string;
  url: string;
  alt: string;
  constructor(px: number, py: number, keyword: string){
    this.px = px;
    this.py = py;
    this.keyword = keyword;
    var x = this.keyword.match(Keyword.image_re);
    if (x) {
      var y = x[2].match(Keyword.http_re);
      if (y) {
        this.url = x[2];
        this.alt = x[1];
      }
    }
    var z = this.keyword.match(Keyword.http_re);
    if (z) {
      this.url = this.keyword;
      this.alt = null;
    }
  }

  isImageUrl(): boolean {
    return this.url != null;
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

