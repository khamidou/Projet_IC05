$(document).ready(function() {
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
    sigInst.graphProperties({minNodeSize: 1, maxNodeSize: 50});
   
    draw(jsonData, sigInst);
    return;
}

function draw(data, sigInst) {
    var created_nodes = {}
    for(var i = 0; i < data["nodes"].length; i++) {
        var size = data["nodes"][i]["nodeScore"]; 
        var name =data["nodes"][i]["nodeName"]; 
        
        var color = "#c00"; // user
        if(name.split(".").length > 1)
            color = "#00c"; // site web
 
        if(size > 2) {
            sigInst.addNode(name, {x: Math.random(), y: Math.random(), size: size, color: color});
            created_nodes[name] = 1;
        }
    }
    
    for(var i = 0; i < data["edges"].length; i++) {
        var source = data["edges"][i]["source"]; 
        var dest = data["edges"][i]["destination"]; 
        if(created_nodes[source] == 1 && created_nodes[dest] == 1)
            sigInst.addEdge(i, source, dest);
    }


    sigInst.startForceAtlas2();
     
      var isRunning = true;
      document.getElementById('stop-layout').addEventListener('click',function(){
        if(isRunning){
          isRunning = false;
          sigInst.stopForceAtlas2();
          document.getElementById('stop-layout').childNodes[0].nodeValue = 'Start Layout';
        }else{
          isRunning = true;
          sigInst.startForceAtlas2();
          document.getElementById('stop-layout').childNodes[0].nodeValue = 'Stop Layout';
        }
      },true);
      document.getElementById('rescale-graph').addEventListener('click',function(){
        sigInst.position(0,0,1).draw();
      },true);
    
      sigInst.draw();
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
