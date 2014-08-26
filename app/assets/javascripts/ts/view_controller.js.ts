/// <reference path="d3.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
/// <reference path="context.js.ts" />

class ViewController {
  svg: any;
  context: Context;
  drag: any;

  constructor(svg: any, context: Context){
    var _this = this;
    this.svg = svg;
    this.context = context;
    this.drag = d3.behavior.drag()
      .on("drag", function(d,i) {
        d.px = context.widthToRatio(context.ratioToWidth(d.px) + d3.event.dx)
        d.py = context.heightToRatio(context.ratioToHeight(d.py) + d3.event.dy)
        d3.select(this).attr({
          "transform": function(d,i){
            return "translate(" + [ context.ratioToWidth(d.px), context.ratioToHeight(d.py) ] + ")"
          }
        })
      })
      .on('dragend', function(d,i) {
        if(d.px > 1 || d.py > 1 || d.px < 0 || d.py < 0) {
          var x = context.childKeywords();
          x.splice(x.indexOf(d), 1);
          d3.selectAll('g')
            .data([])
            .exit()
            .remove();
          _this.redraw();
        }
      });
  }
  
  redraw(): void {
    this.draw(this.context.currentKeyword);
  }

  draw(keyword: string): void {
    $('#breadcrumb').text(this.context.currentPath.join(" > "));
    this.drawElements(true, [new Keyword(0.5, 0.5, keyword)]);
    var keywords = this.context.manager.keywords[keyword];
    this.drawElements(false, keywords);
  }

  drawElements(theme_mode: boolean, keywords: Keyword[]): void {
    var class_name = "keyword";
    var drag_f = this.drag;
    var color_scale = (this.context.currentPath.length + 1) % 10;
    if(theme_mode) {
      class_name = "theme";
      drag_f = function(d,i) {};
      color_scale = (this.context.currentPath.length) % 10;
    }
    var _this = this;
    var gr = this.svg.selectAll('g.' + class_name)
      .data(keywords)
      .enter()
      .append('g')
      .on('dblclick', function(d) {
        _this.onChangeKeyword(d, d3.select(this));
      })
      .attr({
        'transform': function(d, i) {
          return "translate(" + _this.context.ratioToWidth(d.px) + "," + _this.context.ratioToHeight(d.py) + ")";},
        'class': class_name
      })
      .call(drag_f);

    gr.selectAll('ellipse')
      .data(function(d){ return [d];})
      .enter()
      .append('ellipse')
      .attr({
        cx: 0,
        cy: 0,
        rx: 0,
        ry: 0,
        fill: function(d, i) {
          return ViewController.colorScale(color_scale);
        }
      })
      .transition()
      .duration(600)
      .attr({
        rx: 100,
        ry: 50
      });

    gr.selectAll('text')
      .data(function(d){ return [d];})
      .enter()
      .append('text')
      .text(function(d, i) {
        return d.keyword;
      })
      .attr({
        x: 0,
        y: (_this.context.keywordProperty.font_size / 2),
        'text-anchor': 'middle',
        'font-size': 0,
      })
      .transition()
      .duration(700)
      .attr({
        'font-size': function(d) {return _this.context.keywordProperty.font_size},
      });

    if(!theme_mode) {
      gr.selectAll('circle.tubu')
        .data(function(d){ return Array(_this.context.childCount(d.keyword)).map(() => d);})
        .enter()
        .append('circle')
        .attr({
          'class': "tubu",
          cx: function(d, i) {
            return _this.context.calcTubuCX(i);
          },
          cy: function(d, i) {
            return _this.context.calcTubuCY(i);
          },
          r: 5,
          fill: "red"
        });
    }
  }

  addKeyword(keywordString: string): void {
    var keyword = new Keyword(Math.random(), Math.random(), keywordString);
    this.context.childKeywords().push(keyword);
    this.redraw();
  }

  validWord(keyword: string): boolean {
    if(this.context.currentKeyword == keyword) return false;
    if(jQuery.inArray(keyword, this.context.childKeywords().map((k) => k.keyword)) >= 0) return false;
    return true;
  }

  isCurrentKeyword(keyword: String): boolean {
    return this.context.currentKeyword == keyword;
  }

  onChangeKeyword(keyword: Keyword, node: any): void {
    node.transition()
      .duration(300)
      .ease('in')
      .attr({
        rx: this.context.stageWidth,
        ry: this.context.stageHeight
      })
      .each("end", () => {
        d3.selectAll('g')
          .data([])
          .exit()
          .remove();
        ((keyword: Keyword) => {
          if (this.isCurrentKeyword(keyword.keyword)) {
            //
            this.context.upKeyword();
          } else {
            this.context.downKeyword(keyword.keyword);
          }
          this.redraw();
          $('#inputbox').focus();
        })(keyword);
      });
  }

  private static colorScale = d3.scale.category10();

}

