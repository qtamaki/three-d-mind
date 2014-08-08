/// <reference path="drawController.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />

$(document)
  .ready(function() {
    
    var width: number = document.documentElement.clientWidth;
    var height: number = document.documentElement.clientHeight;
    var themeStack: string[] = [];

    d3.select('.container-fluid')
      .append('svg')
      .attr({xmlns: "http://www.w3.org/2000/svg",
        width: width,
        height: height - 20})

    var ctrl = new DrawController(width, height);
    ctrl.onDraw = function(theme: string, keywords: Keyword[]) {
      KeywordElement.draw(theme, keywords, width, height, themeStack.length);
    }

    KeywordElement.onClear = function(keyword: Keyword, $self: any) {
      console.dir(keyword);
      console.dir($self);
      $self.transition()
        .duration(300)
        .ease('in')
        .attr({
          rx: width,
          ry: height
        })
        .each("end", function() {
          d3.selectAll('text')
            .data([])
            .exit()
            .remove();
          d3.selectAll('ellipse')
            .data([])
            .exit()
            .remove();
          d3.selectAll('circle.tubu')
            .data([])
            .exit()
            .remove();
          (function(keyword: Keyword) {
            KeywordElement.onDrillDown(keyword);
          })(keyword);
        });

    }

    KeywordElement.onDrillDown = function(keyword: Keyword) {
      console.dir(keyword);
      console.dir(themeStack);
      if (ctrl.isCurrentTheme(keyword.keyword)) {
        ctrl.changeTheme(themeStack.pop());
      } else {
        themeStack.push(ctrl.getCurrentTheme());
        ctrl.changeTheme(keyword.keyword);
      }
      $('#inputbox')
        .focus();
    }

    KeywordElement.onWantChildSize = function(theme: string) {
      return ctrl.getChildSize(theme);
    }

    $('#inputbox')
      .on('keydown', function(e) {
        if (e.keyCode === 13) {
          if (this.value != "") {
            if (ctrl.validWord(this.value)) {
              if (ctrl.isReady()) {
                ctrl.addKeyword(this.value);
              } else {
                ctrl.changeTheme(this.value);
              }
              this.value = '';
            } else {
              alert("追加できません。既に入力済みです");
            }
          }
          return false;
        } else {
          return true;
        }
      })
      .focus();

  });
