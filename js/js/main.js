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

    var sigRoot = $('#graphWrapper').get(0);
    var sigInst = sigma.init(sigRoot);
    sigInst.addNode('hello',{
          label: 'Hello',
          color: '#ff0000'
    }).addNode('world',{
          label: 'World !',
      color: '#00ff00'
    }).addEdge('hello_world','hello','world').draw();
    
    return;

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

var displayed = [];
var count = 0;
var NUMELEMENTS = 2;
function stepN() {
    displayed = jsonData.edges.splice(count, count + NUMELEMENTS); 
    var validEdges = [];
    var validNodes = [];

    var nodeTable = {};

    // pour chaque chemin
    for(var i = 0; i < displayed.length; i++) {
        // si c'est un chemin valide
        if("destination" in displayed[i] && "source" in displayed[i]) {

            // l'ajouter à la liste des chemins
            validEdges.push(displayed[i]);
            var dest = displayed[i]["destination"];
            var src = displayed[i]["source"];


            // cherche le noeud destination correspondant
            // s'il n'est pas déjà affiché
            if(nodeTable[dest] != 1)
            for(var j = 0; j < jsonData["nodes"].length; j++) {
                if(jsonData["nodes"][j]["nodeName"] == dest) {
                    validNodes.push(jsonData["nodes"][j]);
                    nodeTable[dest] = 1;
                    break;
                }
            }
            // fait figurer les noeuds sources 
            // s'il n'est pas déjà affiché
            if(nodeTable[src] != 1)
            for(var j = 0; j < jsonData["nodes"].length; j++) {
                if(jsonData["nodes"][j]["nodeName"] == src) {
                    validNodes.push(jsonData["nodes"][j]);
                    nodeTable[src] = 1;
                    break;
                }
            }
 
        }
    }

    console.log("nodetable", nodeTable);
    nodes = [];
    links = [];
    nodeTable = {}

    // ajoute les noeuds
    for(var j = 0; j < validNodes.length; j++) {
        var nodename = validNodes[j]["nodeName"];
        var nodeweight = validNodes[j]["nodeScore"];
        nodes.push({id: validNodes[j]["nodeName"], weight: validNodes[j]["nodeScore"]});
        nodeTable[nodename] ={id: validNodes[j]["nodeName"], weight: 10 /*validNodes[j]["nodeScore"]*/}; 
    }

    // ajoute les liens
    for(var j = 0; j < validEdges.length; j++) {
        console.log("tbalkjlk", validEdges[j]["source"], validEdges[j]["destination"]);  
        links.push({source: nodeTable[validEdges[j]["source"]], target: nodeTable[validEdges[j]["destination"]]});
    }

    console.log(nodes);
    console.log(links);
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
