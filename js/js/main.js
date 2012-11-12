$(document).ready(function() {
    var width = 960,
        height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    var svg = d3.select("#graphCanvas").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("miserables.json", function(json) {
      force
          .nodes(json.nodes)
          .links(json.links)
          .start();

      var link = svg.selectAll("line.link")
          .data(json.links)
        .enter().append("line")
          .attr("class", "d3-link")
          .style("stroke-width", function(d) { return Math.sqrt(d.value); })
          

      var node = svg.selectAll("circle.node")
          .data(json.nodes)
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .style("fill", function(d) { return color(d.group); })
          .call(force.drag)
      svg.selectAll("circle.node").data(json.nodes).transition().delay(1000).duration(1000).style("opacity", 0);

      node.append("title")
          .text(function(d) { return d.name; });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
    });
       harry({
        container: "scale",
        width: 940,
        height: 100,
        datas:[
            {values:[51,52,47,6,5,86,95,93,96,22,55,49,21,21,6,49],color:"#fc0"}],
        labels:{
                 x:1,
          y:[0,50,100],
          color:"#000",
          ypos:"center"
        },

        labels : false, // FIXME: disable label or ask for patch
        mode:"curve:stack",
        fill:"solid",
        linewidth:3,
        autoscale:"top",
        mouseover:{
                 radius:4,
          linewidth:0,
          circle:"#fff"
        },
        mouseover : {
            text: plotterMouseoverHandler
        },
        legends:{
          background:"#ccc",
          color:"#fff",
          border:"#fff"
                 },
          bg:"black"
    });
});

function plotterMouseoverHandler(n, v, l, x, y) {
}
