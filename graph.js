var graph = {
    "nodes": [],
    "edges": []
}
var e_id = 0
//var s = new sigma('container')

var xCount = -1;

function createNodesAndEdges(tree) {
    document.getElementById('container').innerHTML = ""
    graph = {
        "nodes": [],
        "edges": []
    }
    //For every Question create a Node
    for(i=0; i< tree.length; i++) {
        //newNode = node
        var newNode = {
            "id": "n"+tree[i].id,
            "label": "Frage " + tree[i].id,
            "x": 0,
            "y": 0,
            "size": 1
        }
        xCount++
        graph.nodes.push(newNode)
        //For every Answer create an Edge
        for(j=0; j< tree[i].antworten.length; j++) {
             //newEdge = edge
             var newEdge = {
                "id": "e"+ e_id++,
                "source": "n"+tree[i].id,
                "target":"n"+tree[i].antworten[j].next,
                "type": "arrow"
            }
             graph.edges.push(newEdge)
        }
    }
    calcPositions()
    console.log(graph)
    draw()
}

function draw() {
    s = new sigma({ 
        graph: graph,
        container: 'container',
        settings: {
            defaultNodeColor: '#ec5148',
            arrowSizeRatio: 15,
        }
    });
    s.refresh()
}

function newGraph() {
    var g = document.getElementById('container');
    var p = g.parentNode;
    p.removeChild(g);
    var c = document.createElement('div');
    c.setAttribute('id', 'container');
    p.appendChild(c);
    e_id = 0
    xCount = -1
}

function changeEdge(start, old, end, wahl) {
    var w = 0
    try {
        graph.edges.forEach((edge) => {
            console.log(w)
            if(edge.source == ("n"+start) && edge.target == ("n"+old)) {
                if (w == wahl){
                    console.log("detected")
                    console.log(edge.target)
                    console.log("n"+end)
                    edge.target = "n"+end
                    console.log(edge.target)
                    throw BreakException
                } else {
                    w++
                }
            }
            
        })
    } catch (e) {
        console.log("Exception thrown")
    }
    newGraph()
    draw()
    s.refresh()
    console.log(graph)
}

function addEdge(start, end) {
    console.log("n"+start)
    console.log("n"+end)
    var newEdge = {
        "id": "e"+ e_id++,
        "source": "n"+start,
        "target":"n"+end,
        "type": "arrow"
    }
    console.log(s)
     graph.edges.push(newEdge)
    newGraph()
    draw()
    s.refresh()
}

function calcPositions() {
    //Number of Nodes
    nn = graph.nodes.length
    //angle for one node
    alpha = (Math.PI*2)/(nn-1)
    for(i=1;i<nn;i++) {
        w=alpha*(i-1)
        graph.nodes[i].x = Math.cos(w)
        graph.nodes[i].y = Math.sin(w)
    }
}
