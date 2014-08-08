/// <reference path="d3.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
/// <reference path="context.js.ts" />

var context = new Context(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth,
    new KeywordProperty(50, 100, 20),
    "dummry");

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
  keywords: {[key:string]: Keyword[];} = {}
}
var manager = new KeywordManager;

class MainView {
  svg: any;
  context: Context;
  manager: KeywordManager;
  drag: any;

  constructor(svg: any, context: Context, manager: KeywordManager){
    this.svg = svg;
    this.context = context;
    this.manager = manager;
    this.drag = d3.behavior.drag()
      .on("drag", function(d,i) {
        d.px = (context.effectWidth(d.px) + d3.event.dx) / context.stageWidth;
        d.py = (context.effectHeight(d.py) + d3.event.dy) / context.stageHeight;
        d3.select(this).attr({
          "transform": function(d,i){
            return "translate(" + [ d3.event.dx, d3.event.dy ] + ")"
          },
          cx: function(d, i) {
            return context.effectWidth(d.px);
          },
          cy: function(d, i) {
            return context.effectHeight(d.py);
          }
        })
      });
  }

  draw(keyword: string): void {
  }

  drawElements(class_name: string, keywords: Keyword[]): void {
    var gr = this.svg.selectAll('g.' + class_name)
      .data(keywords)
      .append('g')
      .on('dblclick', function(d) {
        this.onClear(d, d3.select(this));
      })
      .attr({
        'transform': function(d, i) {
          return "translate(" + this.context.effectWidth(d.px) + "," + this.context.effectHeight(d.py) + ")";}})
      .call(this.drag);

    gr.selectAll('ellipse')
      .data(function(d){ console.dir(d); return [d];})
      .enter()
      .append('ellipse')
      .attr({
        cx: function(d, i) {
          return context.effectWidth(d.px);
        },
        cy: function(d, i) {
          return context.effectHeight(d.py);
        },
        rx: 0,
        ry: 0,
        fill: function(d, i) {
          return MainView.colorScale(this.context.currentPath.length % 10);
        }
      })
      .call(this.drag)
      .transition()
      .duration(600)
      .attr({
        rx: 100,
        ry: 50
      });

    gr.selectAll('text')
      .data(function(d){ console.dir(d); return [d];})
      .enter()
      .append('text')
      .text(function(d, i) {
        return d.keyword;
      })
      .attr({
        x: function(d, i) {
          return this.context.effectWidth(d.px);
        },
        y: function(d, i) {
          return this.context.effectHeightWithFontSize(d.py);
        },
        'text-anchor': 'middle',
        'font-size': 0,
      })
      .transition()
      .duration(700)
      .attr({
        'font-size': this.context.keywordProperty.font_size,
      });
  }

  private static colorScale = d3.scale.category10();

}

var view = new MainView(d3.select('svg'), context, manager);

