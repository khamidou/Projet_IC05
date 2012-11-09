$(document).ready(function() {
    var sigRoot = document.getElementById("sigmaCanvas");
    var sigInst = sigma.init(sigRoot);

    
    for(var i = 0; i < 90; i++) {
        color = 'rgb('+Math.round(Math.random()*256)+','+ Math.round(Math.random()*256)+','+ Math.round(Math.random()*256)+')';
        sigInst.addNode(i, { color: "#fff", size: 2, x: Math.random(), y: Math.random(), color: color});
    }
   
    sigInst.graphProperties({
          minNodeSize: 1,
          maxNodeSize: 10
    });
    sigInst.draw();

    harry({
        container: "scale",
        width: 940,
        height: 100,
        datas:[
            {values:[51,52,47,6,5,86,95,93,96,22,55,49,21,21,6,49],color:"#fc0"}],
        labels:{
                 x:1,
          y:[0,50,100],
          color:"#ddd",
          ypos:"right"
        },
        mode:"curve:stack",
        fill:"solid",
        linewidth:3,
        autoscale:"top",
        mouseover:{
                 radius:4,
          linewidth:0,
          circle:"#fff"
        },
        legends:{
                         background:"#444",
          color:"#fff",
          border:"#fff"
                 },
          bg:"black"
    });
});
