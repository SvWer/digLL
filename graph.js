var graph = {
    "nodes": [],
    "edges": []
}
var e_id = 0
//var s = new sigma('container')

/* // Configure the noverlap layout:
var noverlapListener = s.configNoverlap({
    nodeMargin: 1,
    scaleNodes: 1.05,
    gridSize: 75,
    easing: 'quadraticInOut', // animation transition function
    duration: 1000,
  }); */

var xCount = -1;
/*
 * -1 / 3 Math.floor()+1 = 0
 * 0 / 3 Math.floor() +1 = 1
 * 1 / 3 Math.floor() +1 = 1
 * 2 / 3 Math.floor() +1 = 1
 * 3 / 3 Math.floor() +1 = 2
 * 4 / 3 Math.floor() +1 = 2
 * 
 * -1%3 +1 = 0
 *  0%3 +1 = 1
 *  1%3 +1 = 2
 *  2%3 +1 = 3
 *  3%3 +1 = 1
 *  4%3 +1 = 2
 */

function createNodesAndEdges(tree) {
    console.log("Test")
    console.log(-1%3)

    //For every Question create a Node
    for(i=0; i< tree.length; i++) {
        //newNode = node
        var newNode = {
            "id": "n"+(i),
            "label": "Frage " + (i),
            //"x": Math.floor(Math.random() * 10),
            "x": xCount%3 + 1,
            //"y": Math.floor(Math.random() * 10),
            "y": Math.floor(xCount/3)+1,
            "size": 1
        }
        xCount++
        graph.nodes.push(newNode)
        //For every Answer create an Edge
        for(j=0; j< tree[i].antworten.length; j++) {
             //newEdge = edge
             var newEdge = {
                "id": "e"+ e_id++,
                "source": "n"+i,
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

    var g = document.getElementById('container');
    var p = g.parentNode;
    p.removeChild(g);
    var c = document.createElement('div');
    c.setAttribute('id', 'container');
    p.appendChild(c);

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

    var g = document.getElementById('container');
    var p = g.parentNode;
    p.removeChild(g);
    var c = document.createElement('div');
    c.setAttribute('id', 'container');
    p.appendChild(c);

    draw()

    s.refresh()
    console.log(graph)
}

