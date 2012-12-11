$(document).ready(function() {
    $(".ppButton").click(handlePlayPause);
    $.ajax("full.json", {success :setup});
    /*
    window.setTimeout(step1, 2000);
    window.setTimeout(step2, 5000);
    window.setTimeout(step3, 5000);
    */
});

function plotterMouseoverHandler(n, v, l, x, y) {
}

var jsonData = {};

function setup(json) {
    jsonData = json;

    var w = 760,
        h = 500;

    force = d3.layout.force()
        .gravity(.01)
        .distance(400)
        .charge(-30)
        .size([w, h]);

    nodes = force.nodes(),
    links = force.links();
            
    vis = d3.select("#graphCanvas").append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    force.on("tick", function() {
      vis.selectAll("g.node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      vis.selectAll("line.link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    });
    //step2();
    stepN();
}

function restart() {
  var link = vis.selectAll("line.link")
      .data(links, function(d) { return d.source.id + "-" + d.target.id; });
/*
  link.enter().insert("svg:line", "g.node")
      .attr("stroke", "white")
      .transition().duration(4000)
      .attr("stroke", "black");

  link.exit().remove();
*/
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id;});
	
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .call(force.drag);
  
  nodeEnter.append("svg:text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.id })
      .transition()
      .attr("class", "nodetext")

  nodeEnter.append("svg:title")
      .text("pkpmlkmlkmlk http://reddit.com");
	
  nodeEnter.append("circle")
      .attr("class", "circle")
      .attr("r", "5")
      .attr("fill", "white")
      .attr("stroke", "none")
      .attr("x", "-8px")
      .attr("y", "-8px")
      .attr("width", "16px")
      .attr("height", "16px")
      .transition()
      .duration(2500)
      .attr("class", "fully_visible")
      .attr("r", "10")

  node.exit().remove();
		
  force.start();
}

// Add three nodes and three links.
function step1() {
  var a = {id: "aaa"}, b = {id: "bbb", weight: 45}, c = {id: "ccc"};
  nodes.push(a, b, c);
  links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});



  restart();
}

function step2() {
  var a = {id: "aa"}, b = {id: "bb", weight : 45}, c = {id: "cc"}, d = {id: "dd"};
  nodes.push(a, b, c, d);
  console.log(links);
  links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
  restart();
  console.log(links[3], links[0]);
  links.push({source: nodes[0], target: a});  
  restart();
}

function step3() {
   nodes.pop(); 
   restart();
}

var displayed_nodes = [];
var count = 0;
var NUMELEMENTS = 2;
function stepN() {
    displayed = jsonData.edges.splice(count, count + NUMELEMENTS); 
    validEdges = [];
    validNodes = [];

    for(var i = 0; i < displayed.length; i++) {
        if("destination" in displayed[i] && "source" in displayed[i]) {
            validEdges.push(displayed[i]);
            var dest = displayed[i]["destination"];
            var src = displayed[i]["source"];

            // cherche le noeud destination correspondant
            for(var j = 0; j < jsonData["nodes"].length; j++) {
                if(jsonData["nodes"][j]["nodeName"] == dest) {
                    validNodes.push(jsonData["nodes"][j]);
                    break;
                }
            }
            // fait figurer les noeuds sources 
            for(var j = 0; j < jsonData["nodes"].length; j++) {
                if(jsonData["nodes"][j]["nodeName"] == src) {
                    validNodes.push(jsonData["nodes"][j]);
                    break;
                }
            }
 
        }
    }

    nodes = [];
    links = [];
    // ajoute les noeuds
    for(var j = 0; j < validNodes.length; j++) {
        nodes.push({id: validNodes[j]["nodeName"], weight: validNodes[j]["nodeScore"]});
        console.log(nodes[j]);
    }

    // ajoute les liens
    for(var j = 0; j < validEdges.length; j++) {
        links.push({source: validEdges[j]["source"], target: validEdges[j]["destination"]});
        console.log(links[j]);
    }

    restart();
    count += NUMELEMENTS;
}

var mode = "PAUSED";

function handlePlayPause() {
    if(mode == "PAUSED") {
        mode = "PLAYING";
        $(".ppButton").attr("src", "imgs/pause_24.png"); 
    } else {
        mode = "PAUSED";
        $(".ppButton").attr("src", "imgs/play_24.png"); 
    }

    stepN();
}

function setupPlotter() {
/*
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
*/
}
