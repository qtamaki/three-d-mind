/// <reference path="d3.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
/// <reference path="context.js.ts" />

class ViewController {
  svg: any;
  context: Context;
  drag: any;
  changed: boolean;

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
        _this.changed = true;
      })
      .on('dragend', function(d,i) {
        console.dir(d);
        if(d.px > 1 || d.py > 1 || d.px < 0 || d.py < 0) {
          var x = context.childKeywords();
          x.splice(x.indexOf(d), 1);
          _this.removeAll();
          _this.redraw();
        }
      });
    this.changed = false;
  }

  removeAll():void {
    this.svg.selectAll('g')
      .data([])
      .exit()
      .remove();
  }
  
  redraw(): void {
    this.draw(this.context.currentKeyword);
  }

  draw(keyword: string): void {
    var _this = this;
    var context = this.context;

    this.drawBreadcrumb();

    this.drawElements(true, [new Keyword(0.5, 0.5, keyword)]);
    var keywords = context.manager.keywords[keyword];
    this.drawElements(false, keywords);
  }

  drawElements(theme_mode: boolean, keywords: Keyword[]): void {
    var class_name = "keyword";
    var drag_f = this.drag;
    var color_scale = (this.context.currentPath.length + 1) % 12;
    if(theme_mode) {
      class_name = "theme";
      drag_f = function(d,i) {};
      color_scale = (this.context.currentPath.length) % 12;
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
      .filter(function(d,i){ return !d.isImageUrl();})
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
        rx: this.context.keywordProperty.ellipse_width,
        ry: this.context.keywordProperty.ellipse_height
      });

    gr.selectAll('image')
      .data(function(d){ return [d];})
      .enter()
      .append('image')
      .filter(function(d,i){ return d.isImageUrl();})
      .attr({
        x: -50,
        y: -50,
        width: 100,
        height: 100,
        'xlink:href': function(d,i){return d.url;}
      });

    gr.selectAll('text')
      .data(function(d){ return [d];})
      .enter()
      .append('text')
      .text(function(d, i) {
        if (d.url != null){
          return d.alt;
        } else {
          return d.keyword;
        }
      })
      .attr({
        x: 0,
        y: function(d,i){
          var ret = _this.context.keywordProperty.font_size / 2;
          if (d.url != null && d.alt != null){
            ret = ret + 60;
          }
          return ret;
        },
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
          r: this.context.keywordProperty.ellipse_width / 20,
          fill: "red"
        });
    }
  }

  addKeyword(keywordString: string): void {
    this.changed = true;
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
    node.select('ellipse').transition()
    //node.transition()
      .duration(300)
      .ease('in')
      .attr({
        //'transform': (d, i) => {
        //  return "translate(" + this.context.ratioToWidth(0.5) + "," + this.context.ratioToHeight(0.5) + ")";}
        rx: this.context.stageWidth,
        ry: this.context.stageHeight
      })
      .each("end", () => {
        this.removeAll();
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

  private static colorScale = function(x:number) {
    return [
      "#69BD83",
    "#61C1BE",
    "#54C3F1",
    "#6C9BD2",
    "#796BAF",
    "#BA79B1",
    "#EE87B4",
    "#EF858C",
    "#EF845C",
    "#F9C270",
    "#FFF67F",
    "#C1DB81"
      ][x];
  }

  private hescape(val:string):string { return $('<div />').text(val).html();}

  private drawBreadcrumb() {
    var _this = this;
    var context = this.context;
    $('#breadcrumb').html($.map(context.currentPath, function(x,i) {return "<span class='label' idx="+i+" style='background-color: "+ViewController.colorScale(i+1)+"'>"+_this.hescape(x)+"</span>"}).join(" > "));
    $('#breadcrumb span').on('click', function(e) {
      var idx = + $(this).attr("idx");
      context.changeDepth(idx);
      _this.removeAll();
      _this.redraw();
    });
  }

}

