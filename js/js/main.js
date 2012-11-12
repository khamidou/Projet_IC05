$(document).ready(function() {
    
    //var sigRoot = document.getElementById("sigmaCanvas");
    var paper = Raphael(document.getElementById("graphCanvas"), 960, 600);
    c = paper.circle(320, 240, 30)
    c.attr({"fill" : "#ccc"});
    c.animate({"opacity": 0}, 1000);
    /*
    sigInst = sigma.init(sigRoot);
    */
    
    var nodeList = [];

    /*
    for(var i = 0; i < 90; i++) {
        color = 'rgb('+Math.round(Math.random()*256)+','+ Math.round(Math.random()*256)+','+ Math.round(Math.random()*256)+')';
        sigInst.addNode(i, { color: "#fff", size: 2, x: Math.random(), y: Math.random(), color: color, hidden: true});
        nodeList.push(i);
    }
    */
    /*
    for(var i = 0; i < 10; i++) {
        var index_1 = Math.round(Math.random()*90);
        var index_2 = Math.round(Math.random()*90);
        sigInst.addEdge(index_1 * index_2, index_1, index_2); 
    }
    */
   
    /*
    sigInst.graphProperties({
          minNodeSize: 1,
          maxNodeSize: 10
    });
    sigInst.draw();
    */
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
    sigInst.iterNodes(function(n) {
        if(x % 10 == n.id % 10) {
                n.hidden = false;
        } else {
                n.hidden = true;
        }
         
    });

    sigInst.draw();
}
