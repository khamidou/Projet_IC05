$(document).ready(function() {
    var sigRoot = document.getElementById("sigmaCanvas");
    var sigInst = sigma.init(sigRoot);

    
    sigInst.addNode('hello',{
          label: 'Hello',
          color: '#ffccc0',
          size: 50,
    }).addNode('world',{
          label: 'World !',
      color: '#00ffcc'
    }).addEdge('hello_world','hello','world')
    
    sigInst.graphProperties({
          minNodeSize: 10,
          maxNodeSize: 100
    });
    sigInst.draw();
});
