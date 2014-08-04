/// <reference path="d3.d.ts" />

class KeywordElement {

  private static toXPos(x: number, t: number): number { return x * (t - 100) + 50 }
  private static toYPos(x: number, t: number): number { return x * (t - 50) + 25 }

  public static draw(theme: string, keywords: Keyword[], width: number, height: number, depth: number): void {
    var svg: any = d3.select('svg');
    var drag: any = d3.behavior.drag()
    .on("drag", function(d,i) {
      d.x = (KeywordElement.toXPos(d.x, width) + d3.event.dx) / width;
      d.y = (KeywordElement.toYPos(d.y, height) + d3.event.dy) / height;
      d3.select(this).attr({
        "transform": function(d,i){
          return "translate(" + [ d3.event.dx, d3.event.dy ] + ")"
        },
        cx: function(d, i) {
          return KeywordElement.toXPos(d.x, width);
        },
        cy: function(d, i) {
          return KeywordElement.toYPos(d.y, height);
        }
      })
    });

    this.drawTheme(svg, drag, [{
      keyword: theme,
      x: 0.5,
      y: 0.5
    }], width, height, depth);
    this.drawKeywords(svg, drag, keywords, width, height, depth + 1);
  }

  private static drawTheme(svg: any, drag: any, keywords: Keyword[], width: number, height: number, depth: number): void {
    this.drawEllipse("theme", svg, drag, keywords, width, height, depth);
    this.drawText("theme", svg, drag, keywords, width, height);
  }

  private static drawKeywords(svg: any, drag: any, keywords: Keyword[], width: number, height: number, depth: number): void {
    this.drawEllipse("keyword", svg, drag, keywords, width, height, depth);
    this.drawText("keyword", svg, drag, keywords, width, height);

    jQuery.each(keywords, function(i:number, kw: Keyword) {
      var data = Array(KeywordElement.onWantChildSize(kw.keyword));

      svg.selectAll('circle.a' + i)
        .data(data)
        .enter()
        .append('circle')
        .attr({
          'class': "a" + i + " tubu",
          cx: function(d, j) {
            return kw.x * (width - 100) + 50 + (100 * Math.sin(j * 10 * (Math.PI / 180)));
          },
          cy: function(d, j) {
            return kw.y * (height - 50) + 25 + (50 * Math.cos(j * 10 * (Math.PI / 180)));
          },
          r: 5,
          fill: "red"
        });
    });
  }

  private static colorScale = d3.scale.category10();

  private static drawEllipse(class_name: string, svg: any, drag: any, keywords: Keyword[], width: number, height: number, depth: number): void {
    svg.selectAll('ellipse.' + class_name)
      .data(keywords)
      .enter()
      .append('ellipse')
      .on('dblclick', function(d) {
        KeywordElement.onClear(d, d3.select(this));
      })
      .attr({
        'class': class_name,
        cx: function(d, i) {
          return d.x * (width - 100) + 50;
        },
        cy: function(d, i) {
          return d.y * (height - 50) + 25;
        },
        rx: 0,
        ry: 0,
        fill: function(d, i) {
          return KeywordElement.colorScale(depth % 10);
        }
      })
      .call(drag)
      .transition()
      .duration(600)
      .attr({
        rx: 100,
        ry: 50
      });

  }

  public static onClear: {
    (keywords: Keyword, $self: any): void;
  };

  public static onDrillDown: {
    (keywords: Keyword): void;
  };

  public static onWantChildSize: {
    (theme: string): number;
  };

  private static drawText(class_name: string, svg: any, drag: any, keywords: Keyword[], width: number, height: number): void {
    svg.selectAll('text.' + class_name)
      .data(keywords)
      .enter()
      .append('text')
      .text(function(d, i) {
        return d.keyword;
      })
      .attr({
        'class': class_name,
        x: function(d, i) {
          return d.x * (width - 100) + 50;
        },
        y: function(d, i) {
          return d.y * (height - 50) + 25 + 10;
        },
        'text-anchor': 'middle',
        'font-size': 0,
      })
      .transition()
      .duration(700)
      .attr({
        'font-size': 20,
      });
  }
}
