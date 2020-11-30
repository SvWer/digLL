var graph = {
    "nodes": [],
    "edges": []
}
var e_id = 0
var s = new sigma('container')

// Configure the noverlap layout:
var noverlapListener = s.configNoverlap({
    nodeMargin: 1,
    scaleNodes: 1.05,
    gridSize: 75,
    easing: 'quadraticInOut', // animation transition function
    duration: 1000,
  });

function createNodesAndEdges(tree) {

    //For every Question create a Node
    for(i=0; i< tree.length; i++) {
        //newNode = node
        console.log(i+ " von " + tree.length)
        console.log("Name: "+ "n"+(i+1))
        var newNode = {
            "id": "n"+(i+1),
            "label": "Frage " + (i+1),
            "x": Math.floor(Math.random() * 10),
            "y": Math.floor(Math.random() * 10),
            "size": 1
        }
        graph.nodes.push(newNode)
        //For every Answer create an Edge
        for(j=0; j< tree[i].antworten.length; j++) {
             //newEdge = edge
             var newEdge = {
                "id": "e"+ e_id++,
                "source": "n"+(i+1),
                "target":"n"+tree[i].antworten[j].next,
                "type": "arrow"
            }
             graph.edges.push(newEdge)
        }
    }
    console.log(graph)
    draw()
}

function draw() {
    s = new sigma({ 
        graph: graph,
        container: 'container',
        settings: {
            defaultNodeColor: '#ec5148',
            arrowSizeRatio: 5,
        }
    });
    s.refresh()
    s.startNoverlap();
}