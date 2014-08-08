$(function(){
    
    	//ドラッグ時のイベントをセット
        var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
            d.x += d3.event.dx
            d.y += d3.event.dy
            d3.select(this).attr("transform", function(d,i){
                return "translate(" + [ d.x,d.y ] + ")"
            })
        });


    
    // svgエリアを用意
    var svg = d3.select("#svg_area")
	.append("svg:svg")
	.attr("id", "stage")
	.attr("width", 400)
	.attr("height", 400); 
 
    //円
    svg.selectAll("circle .circle1")
	.data([ {"x":10, "y":10} ])		
	.enter()
	.append("svg:circle")
	.attr("cx", 100) 
	.attr("cy", 100)
	.attr("r", 20) 
	.attr("fill", "blue")
	.attr("class", "circle1")
	.call(drag);
    
    
    //四角　グループ化
    var dgrop = d3.select("#stage")
	.selectAll('g')
	.data([ {"x":20, "y":20, "c":"red"}, {"x":20, "y":20, "c":"blue"}, {"x":20, "y":20, "c":"black"} ])
	.enter()
	.append("g")
	.attr("class", "test")
	.attr("transform", "translate(" + 20 + "," + 20 + ")")
	.call(drag);
    
    dgrop.selectAll("rect")
	//.data([10,20])
	.data(function(d){ console.dir(d); return [d];})
	.enter()
	.append("rect")
	.attr("x", function(d, i){return i*120 })
	.attr("y", 20)
	.attr("width", 100)
	.attr("height", 100)
//        .attr("transform", "translate(" + 20 + "," + 20 + ")")
	.attr("fill", function(d){return d.c;})
	.attr("class", "rect")

    dgrop.selectAll("circle")
	//.data([10,20])
	.data(function(d){ console.dir(d); return [d];})
	.enter()
	.append("circle")
	.attr("cx", function(d, i){return i*120 })
	.attr("cy", 20)
	.attr("r", 20)
	.attr("fill", function(d){return d.c;})
	.attr("class", "circle")

    
});

