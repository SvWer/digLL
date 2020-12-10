var graph = {
    "nodes": [],
    "edges": []
}
var e_id = 0
//var s = new sigma('container')
var can
var ctx
var event = new MouseEvent('mousemove', {});
var activeID = 0

/*
    Get Canvas element, create Context and add eventlistener for move and click
*/
function prepCanvas() {
    can = document.getElementById("testcanvas")
    ctx = can.getContext("2d")

    can.onmousemove = function(e) {
        var rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        i = 0, r;

        ctx.clearRect(0, 0, can.width, can.height); // for demo
         while(r = graph.nodes[i++]){
            // add a single rect to path:
            ctx.beginPath();
            ctx.arc(r.x, r.y, 10, 0, 2*Math.PI)  
            
            // check if we hover it, fill red, if not fill it blue
            if(ctx.isPointInPath(x, y)) {
                ctx.fillStyle = "blue"
                ctx.font = "20px Arial";
                lines = fragmentText("Frage: "+ r.id + " "+ r.text, can.width-20)
                console.log(lines)
                for(k = 0; k < lines.length; k++) {
                    console.log(lines[k])
                    ctx.fillText(lines[k], 20, 25*(k+1))
                }
                //ctx.fillText("Frage: "+r.id+" "+r.text, 20, 25)
            } else {
                ctx.fillStyle = r.color
            }
            ctx.fill();
          }
          for(j=0; j < graph.edges.length; j++) {
            drawLineWithArrows(graph.nodes[graph.edges[j].source].x, graph.nodes[graph.edges[j].source].y, graph.nodes[graph.edges[j].target].x, graph.nodes[graph.edges[j].target].y, 5, 8, false,true)
        }
    }

    can.onclick = function(e) {
        var rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        i = 0, r;

        ctx.clearRect(0, 0, can.width, can.height); // for demo
        while(r = graph.nodes[i++]) {
            // add a single rect to path:
            ctx.beginPath(); 
            ctx.arc(r.x, r.y, 10, 0, 2*Math.PI)  
            ctx.fillStyle = r.color
            // check if we hover it, fill red, if not fill it blue
            if(ctx.isPointInPath(x, y)) {
                console.log(r.label)
                jsonindex = r.id-1
                next()
            } else {
            }
            ctx.fill();
          }
          for(j=0; j < graph.edges.length; j++) {
              drawLineWithArrows(graph.nodes[graph.edges[j].source].x, graph.nodes[graph.edges[j].source].y, graph.nodes[graph.edges[j].target].x, graph.nodes[graph.edges[j].target].y, 5, 8, false,true)
        }
    }
}

function fragmentText(text, maxWidth) {
    var lines = [],
        words = text.replace(/\n\n/g,' ` ').replace(/(\n\s|\s\n)/g,'\r')
        .replace(/\s\s/g,' ').replace('`',' ').replace(/(\r|\n)/g,' '+' ').split(' '),
        space = ctx.measureText(' ').width,
        width = 0,
        line = '',
        word = '',
        len = words.length,
        w = 0,
        i;
    for (i = 0; i < len; i++) {
        word = words[i];
        w = word ? ctx.measureText(word).width : 0;
        if (w) {
            width = width + space + w;
        }
        if (w > maxWidth) {
            return [];
        } else if (w && width < maxWidth) {
            line += (i ? ' ' : '') + word;
        } else {
            !i || lines.push(line !== '' ? line.trim() : '');
            line = word;
            width = w;
        }
    }
    if (len !== i || line !== '') {
        lines.push(line);
    }
    return lines;
}

function drawLineWithArrows(x0,y0,x1,y1,aWidth,aLength,arrowStart,arrowEnd){
    var dx=x1-x0;
    var dy=y1-y0;
    var angle=Math.atan2(dy,dx);
    var length=Math.sqrt(dx*dx+dy*dy);
    //
    ctx.translate(x0,y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(length,0);
    if(arrowStart){
        ctx.moveTo(aLength,-aWidth);
        ctx.lineTo(0,0);
        ctx.lineTo(aLength,aWidth);
    }
    if(arrowEnd){
        ctx.moveTo(length-aLength,-aWidth);
        ctx.lineTo(length,0);
        ctx.lineTo(length-aLength,aWidth);
    }
    //
    ctx.stroke();
    ctx.setTransform(1,0,0,1,0,0);
}


function createNodesAndEdges(tree) {
    c = document.getElementById("testcanvas")
    co = document.getElementById('container')
    e = document.getElementById("erlaut")
    e.innerHTML = "Hier sind Ihr Fragen als Graph dargestellt. Jeder Punkt steht für eine Frage, jeder Pfeil für eine Antwort zu einer anderen Frage.<br><br>"
    e.innerHTML += "Grün stellt die aktuelle Frage dar<br>"
    e.innerHTML += "Rot sind gerade nicht aktive Fragen <br>"
    e.innerHTML += "Blau sind Fragen, wenn Sie mit der Maus über den Punkt gehen<br>"
    e.innerHTML += "Bei einem Klick auf einen Punkt wird die entsprechende Frage links angezeigt<br>"
    co.innerHTML = ""
    co.appendChild(e)
    co.appendChild(c)
    prepCanvas()
    graph = {
        "nodes": [],
        "edges": []
    }
    //For every Question create a Node
    for(i=0; i< tree.length; i++) {
        //newNode = node
        var newNode = {
            "id": tree[i].id,
            "label": "Frage " + tree[i].id,
            "text": tree[i].text,
            "color": "red",
            "x": 250,
            "y": 290,
            "size": 1
        }
        if(tree[i].id == activeID) {
            newNode.color = "green"
        }
        graph.nodes.push(newNode)
        //For every Answer create an Edge
        for(j=0; j< tree[i].antworten.length; j++) {
             //newEdge = edge
             var newEdge = {
                "id": "e"+ e_id++,
                "source": tree[i].id,
                "target":tree[i].antworten[j].next
            }
             graph.edges.push(newEdge)
        }
    }
    calcPositions()
    console.log("Test: ",graph)
    draw()
}

function draw() {
    !can.dispatchEvent(event);
}


function changeEdge(start, old, end, wahl) {
    var w = 0
    for(m=0; m < graph.edges.length; m++) {
        console.log(w)
        if(graph.edges[m].source == (start) && graph.edges[m].target == (old)) {
            if (w == wahl){
                console.log("detected")
                graph.edges[m].target = end
                m = graph.edges.length
            } else {
                w++
            }
        }
        
    }
    draw()
    console.log(graph)
}

/*
    adds new edge to the graph an redraws the graph
*/
function addEdge(start, end) {
    console.log(start)
    console.log(end)
    var newEdge = {
        "id": e_id++,
        "source": start,
        "target": end
    }
    console.log(s)
    graph.edges.push(newEdge)
    draw()
}

/*
    Calculates the positions of the nodes in a circle
*/
function calcPositions() {
    //Number of Nodes
    nn = graph.nodes.length
    //angle for one node
    alpha = (Math.PI*2)/(nn-1)
    for(i=1;i<nn;i++) {
        w=alpha*(i-1)
        graph.nodes[i].x = Math.cos(w) * 200 + 250
        graph.nodes[i].y = Math.sin(w) * 200 + 290
    }
}
