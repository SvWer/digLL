var cont
var jsondoc = []    // Array, welches dann alle Fragen enthält 
var jsonindex = -1  // Index dafür, bei welcher Frage man gerade ist
var newAnswer = 0   //Enthält für jede Frage die Anzahl an neuen Antworten
var dict = {}
var fragentyp = {
    0: "Normale Frage",
    1: "Checkboxfrage",
    2: "Dropdownfrage"
}
var newWahlCounter = 0
/*
    Function that gets the text div, in which everything happens
*/
window.onload = function() {
    cont = document.getElementById("text")
    prepCanvas()
}

/*
    Function that sets all the content back to the first page
*/
function starten() {
    //Reset all global variables
    jsondoc = []
    jsonindex = -1
    newAnswer = 0
    dict = {}
    graph = {
        "nodes": [],
        "edges": []
    }
    e_id = 0
    xCount = -1
    location.reload();
}

/*
    If you clicked modify on the first page, this function changes the content, so you can paste the json
*/
function modify() {
    var getJsonArea = "<p> Bitte geben Sie den JSON-Text des Fragebogens ein</p> "
    getJsonArea += "<textarea id='jsontext' name='jsontext'></textarea> "
    getJsonArea += "<button id='start' onclick='starten()'>Zurück</button> "
    getJsonArea += "<button onclick='applyJson()'>Fragebogen bestätigen</button>"
    cont.innerHTML = getJsonArea
}

/*
    Erstellt Beispielfrage mit einer Antwort und zeigt diese als neue Frage an
*/
function create() {
    sampleQ = {
        "text":"Geben Sie hier Ihre Frage ein",
        "antworten":[],
        "id": 0
    }
    sampleA = {
        "wahl": newWahlCounter++,
        "text":"Geben Sie hier eine Ihrer Antwortmöglichkeiten ein. Über den Button 'Neue Antwort hinzufügen' können weitere Antworten hinzugefügt werden",
        "next": 0,
        "feedback": "Hier können Sie Feedback an den Befragten eingeben, welches Angezeigt wird, wenn diese Antwort ausgewählt wurde."
    }
    sampleQ.antworten.push(sampleA)
    jsondoc.push(sampleQ)
    for(i=0; i <jsondoc.length; i++) {
        dict[jsondoc[i]['id']] = jsondoc[i]['text']
    }
    newCount = dict.length
    createNodesAndEdges(jsondoc)
    loadQuestion()
}

/*
    If you Insert the Json, this function creates a JSON-Object and a dictionary of all questions and calls function to load first question
*/
function applyJson () {
    ta = document.getElementById("jsontext").value 
    jsondoc = JSON.parse(ta)
    //create dictionary with indices and question text for dropdowns
    for(i=0; i <jsondoc.length; i++) {
        dict[jsondoc[i]['id']] = jsondoc[i]['text']
    }
    newCount = dict.length
    createNodesAndEdges(jsondoc)
    next()
}


/*
    creates string for dropdown-menu over all possible questions
*/
function dropdown(next) {
    var select = "<select name='nextequestion' id='nextquestion' class='ne'>"
    if (Object.keys(dict).length == 0) {
            select += "<option value='"+0+"'>"+0+":"+"Text noch unbekannt"+"</option>"
    } else {
        for(var key in dict) {
            if (key == next) {
                select += "<option selected='selected' value='"+key+"'>"+key+":"+dict[key]+"</option>"
            } else {
                select += "<option value='"+key+"'>"+key+":"+dict[key]+"</option>"
            }
        }
        
    }
    select += "</select>"
    return select
}

/*
 Creates dropdown for question-types
*/
function createType(number) {
    var t = "<select name='ftype' id='ftype'>"
    for(var key in fragentyp) {
        if (key == number) {
            t += "<option selected='selected' value='"+key+"'>"+key+":"+fragentyp[key]+"</option>"
        } else {
            t += "<option value='"+key+"'>"+key+":"+fragentyp[key]+"</option>"
        }
        
    }
    t += "</select>"
    return t
}

/*
    Lade nur die Frage und Zeite diese an
*/
function loadQuestion() {
    jsonindex += 1
    if(jsonindex < jsondoc.length)
    {
        graph.nodes[activeID].color = "#032041"
        activeID = jsondoc[jsonindex].id
        graph.nodes[activeID].color = "#475D75"
        draw()
        q = jsondoc[jsonindex]
        showPreview(q.type, q)
        var allFields = "<h3>Frage: " + q.id+ "</h3>"
        allFields += "<textarea id='frage' name='frage'>"+ q['text'] +"</textarea><br>"
        allFields += "Fragentyp: " + createType(q['type']) + "<br>"
        allFields += "<button onclick='saveQuestion(0)' id='zurueck' class='inline'>Zurück</button>"            // Funktioniert
        allFields += "<button onclick='deleteQuestion()'>Diese Frage löschen</button>"              // Funktioniert
        allFields += "<button onclick='saveQuestion(1)' id='weiter' class='inline'>Weiter</button><br>"     //Funktioniert
        cont.innerHTML = allFields
    } else {
        var allFields = "Alle Fragen fertig beantwortet. Vollständiges Json siehe unten:<br>"
        allFields += "<textarea id='output' name='output'>"+ JSON.stringify(jsondoc) +"</textarea><br>"
        allFields += "<button onclick='starten()'>Zurück zum Anfang</button>"
        cont.innerHTML = allFields
    }
}

/*
    Saves the informations for the question and goes back to last question or goes on to the answers
*/
function saveQuestion(vz) {
    fr = document.getElementById("frage").value
    jsondoc[jsonindex]['text'] = fr
    frt = document.getElementById('ftype').value
    jsondoc[jsonindex]['type'] = frt
    if(vz == 1) {
        answerIndex = 0
        loadAnswers()
    } else {
        //lade vorherige Frage
        jsonindex -= 2
        loadQuestion()
    }

}

var answerIndex = 0
/*
    load one answer and shows it
*/
function loadAnswers() {
    q = jsondoc[jsonindex]
    allFields = "<div class='q'>"
    allFields += "Antwort:   <br>    <textarea id='antwort"+answerIndex+"' name='antwort"+answerIndex+"' class='ant'>"+ q['antworten'][answerIndex]['text'] +"</textarea><br>"
    allFields += "Nächste Frage: <br> "+dropdown(q['antworten'][answerIndex]['next']) + "<br>"
    allFields += "Feedback:   <br>   <textarea id='feedq"+answerIndex+"' name='feedq"+answerIndex+"' class='feed'>" +  q['antworten'][answerIndex]['feedback'] + "</textarea><br>"
    allFields += "<button onclick='deleteAnswer("+answerIndex+", this)'> Diese Antwort löschen </button> <br>"
    allFields += "</div>"
    cont.innerHTML = allFields
}

/*
    Loads next question and shows all important infromation of this question
    If all Questions have been loaded, JSON-String will be generated to copy
*/
function next() {
    //change active id
    
    jsonindex += 1
    if(jsonindex < jsondoc.length)
    {
        graph.nodes[activeID].color = "#032041"
        activeID = jsondoc[jsonindex].id
        graph.nodes[activeID].color = "#475D75"
        draw()
        q = jsondoc[jsonindex]
        showPreview(q.type, q)
        var allFields = "<h3>Frage: " + q.id+ "</h3>"
        allFields += "<textarea id='frage' name='frage'>"+ q['text'] +"</textarea><br>"
        allFields += "Fragentyp: " + createType(q['type']) + "<br>"
        allFields += "<button onclick='deleteQuestion()'>Diese Frage löschen</button><br>"
        allFields += "<hr>"
        allFields += "<h3>Antworten: </h3><br>"
        allFields += "<div id='answers'>"
        for(i=0; i < q['antworten'].length; i++) {
            allFields += "<div class='q'>"
            allFields += "Antwort:   <br>    <textarea id='antwort"+i+"' name='antwort"+i+"' class='ant'>"+ q['antworten'][i]['text'] +"</textarea><br>"
            //allFields += "Nächste Frage: <textarea id='nextq"+i+"' name='nextq"+i+"' class='ne'>" +  q['antworten'][i]['next'] + "</textarea><br>"
            allFields += "Nächste Frage: <br> "+dropdown(q['antworten'][i]['next']) + "<br>"
            allFields += "Feedback:   <br>   <textarea id='feedq"+i+"' name='feedq"+i+"' class='feed'>" +  q['antworten'][i]['feedback'] + "</textarea><br>"
            allFields += "<button onclick='deleteAnswer("+i+", this)'> Diese Antwort löschen </button> <br>"
            allFields += "</div>"
            allFields += "<hr>"
        }
        allFields += "</div>"
        allFields += "<div id='organize'>"
        allFields += "<button onclick='save(0)' id='zurueck' class='inline'>Zurück</button>"           //Funktioniert
        allFields += "<button onclick='addAnswer()' id='neueF' class='inline'>Neue Antwort hinzufügen</button>"   //Funktioniert
        allFields += "<button onclick='save(1)' id='weiter' class='inline'>Weiter</button><br><br>"            //Funktioniert
        allFields += "<button onclick='createAlt(0)'>Neue Frage erzeugen</button><br>"          //Funktioniert
        allFields += "<button onclick='end()' id='end'>Fragebogen beenden</button>"
        allFields += "</div>"
        cont.innerHTML = allFields
    } else {
        var allFields = "Alle Fragen fertig beantwortet. Vollständiges Json siehe unten:<br>"
        allFields += "<textarea id='output' name='output'>"+ JSON.stringify(jsondoc) +"</textarea><br>"
        allFields += "<button onclick='starten()'>Zurück zum Anfang</button>"
        cont.innerHTML = allFields
    }
}

/*
    This funktion saves all fields for this question
*/
function save(k) {
    fr = document.getElementById("frage").value
    jsondoc[jsonindex]['text'] = fr
    frt = document.getElementById('ftype').value
    jsondoc[jsonindex]['type'] = frt

    antworten = document.getElementsByClassName('ant')
    nextref = document.getElementsByClassName('ne')
    feeds = document.getElementsByClassName('feed')

    for(i=0; i < jsondoc[jsonindex]['antworten'].length; i++) {
        jsondoc[jsonindex]['antworten'][i]['text'] = antworten[i].value
        changeEdge(jsonindex, jsondoc[jsonindex]['antworten'][i]['next'], nextref[i].selectedIndex, jsondoc[jsonindex]['antworten'][i]['wahl'])
        jsondoc[jsonindex]['antworten'][i]['next'] = nextref[i].selectedIndex
        jsondoc[jsonindex]['antworten'][i]['feedback'] = feeds[i].value     
    }
    lengthAntworten = jsondoc[jsonindex]['antworten'].length
    newAnswer = antworten.length - lengthAntworten
    for(i=0; i < newAnswer; i++) {
        s = {
            "wahl" : lengthAntworten+i+1,
            "text": "'"+antworten[lengthAntworten+i].value +"'",
            "next": "'"+nextref[lengthAntworten+i].selectedIndex +"'",
            "feedback": "'"+feeds[lengthAntworten+i].value +"'"
        }
        jsondoc[jsonindex]['antworten'].push(s)
        addEdge(jsonindex, nextref[lengthAntworten+i].selectedIndex)
    }
    
    if(k ==0) {
        if(jsonindex > 0) {
            jsonindex -= 2
        } else {
            alert("Das ist bereits die erste Frage!")
            jsonindex -= 1
        }
    }
    if(jsonindex == jsondoc.length-1) {
        pr = prompt("Dies war die letze Frage. Geben Sie 'weiter' ein, um eine neue Frage zum Fragebogen hinzuzufügen oder geben Sie 'stop' ein, wenn Sie den Fragebogen beenden möchten.")
        if(pr == "weiter") {
            createAlt(0)
            return
        } else if (pr == "stop") {
            end(9)
            return
        }
    }
    next()
    
}

function deleteAnswer(choice, but) {
    if (choice == -1) {
        p = but.parentNode
        pp = p.parentNode
        pp.removeChild(p)
    } else {
        q = jsondoc[jsonindex]
        q.antworten.splice(choice, 1)
        for (i=0; i< q.antworten.length; i++) {
            q.antworten.wahl = i
        }
        jsonindex -= 1
        createNodesAndEdges(jsondoc)
        next()
    }
}

function deleteQuestion() {
    p = prompt("Wollen Sie diese Frage wirklich löschen? \n Alle Referenzen auf diese Frage werden dann zu Frage 0 geändert, was beim ausführen zu einem Beenden des Fragebogens führt.\n Schreiben Sie 'ja', wenn Sie die Frage wirklich löschen wollen.")
    if(p == "ja") {
        jsondoc.splice(jsonindex,1)
        //Für jede Frage
        for (f=0; f < jsondoc.length; f++) {
            //Für jede Antwort
            for(a=0; a< jsondoc[f].antworten.length; a++) {
                if (jsondoc[f].antworten[a].next == jsonindex) {
                    jsondoc[f].antworten[a].next = 0
                }
            }

        }
        //Graph neu berechnen und nächste Frage Anzeigen
        delete dict[jsonindex]
        createNodesAndEdges(jsondoc)
        jsonindex -= 1
        next()
    }
    //Was ist mit den Referenzen??
}

function end(t = 0) {
    if(t == 0) {
        save()
    } else if (t = 9) {

    }else {
        append(0)
    }
    zeroCount = 0
    for(a = 0; a < jsondoc.length; a++) {
        for(b=0; b < jsondoc[a].antworten.length; b++) {
            if(jsondoc[a].antworten[b].next == 0) {
                zeroCount += 1
            }
        }
    }
    alert("In diesem Fragebogen beenden "+ zeroCount+" Antworten den Fragebogen durch eine Referenz auf die Frage 0.")

    var allFields = "Alle Fragen fertig beantwortet. Vollständiges Json siehe unten:<br>"
        allFields += "<textarea id='output' name='output'>"+ JSON.stringify(jsondoc) +"</textarea><br>"
        allFields += "<button onclick='starten()'>Zurück zum Anfang</button>"
        cont.innerHTML = allFields
}

/*
    if you want to add a new answer, this function adds the empty fields
*/
function addAnswer( ) {
    feld = document.getElementById('answers')
    var s = "<div class='q'>"
    s += "Antwort:      <br>  <textarea id='antwort"+"' name='antwort"+"' class='ant'></textarea><br>"
    s += "Nächste Frage: <br> "+dropdown(0) + "<br>"
    s += "Feedback:     <br> <textarea id='feedq"+"' name='feedq"+"' class='feed'></textarea><br>"
    s += "<button onclick='deleteAnswer(-1, this)'> Diese Antwort löschen </button>"
    s += "</div>"
    s += "<hr>"
    feld.innerHTML += s
}


/*
    Function that starts the process to create a new questionnaire
*/
newCount = 0
sampleQ = {
    "text":"Geben Sie hier Ihre Frage ein",
    "antworten":[],
    "id": newCount
}
sampleA = {
    "wahl": 0,
    "text":"Geben Sie hier eine Ihrer Antwortmöglichkeiten ein. Über den Button 'Neue Antwort hinzufügen' können weitere Antworten hinzugefügt werden",
    "next": 5,
    "feedback": "Hier können Sie Feedback an den Befragten eingeben, welches Angezeigt wird, wenn diese Antwort ausgewählt wurde."
    }

function createAlt(alt) {
    if(alt == 0) {
        newCount = Object.keys(dict).length
        dict[newCount] = "Diese Frage"
    }
    var allFields = "<h3>Frage: " + newCount+ "</h3>"
        allFields += "<textarea id='frage' name='frage'>"+sampleQ.text +"</textarea><br>"
        allFields += "Fragentyp: " + createType(0) + "<br>"
        allFields += "<hr>"
        allFields += "<h3>Antworten: </h3><br>"
        allFields += "<div id='answers'>"
        allFields += "<div class='q'>"
        allFields += "Antwort:   <br>    <textarea id='antwort"+0+"' name='antwort"+0+"' class='ant'>"+sampleA.text +"</textarea><br>"
        allFields += "Nächste Frage: <br>  "+dropdown(0) + "<br>"
        allFields += "Feedback:   <br>   <textarea id='feedq"+0+"' name='feedq"+0+"' class='feed'>"+sampleA.feedback  + "</textarea><br>"
        allFields += "<button onclick='deleteAnswer(-1, this)'> Diese Antwort löschen </button> <br>"
        allFields += "</div>"
        allFields += "<hr>"
        
        allFields += "</div>"
        allFields += "<div id='organize'>"
        allFields += "<button onclick='append(1)' id='zurueck' class='inline'>Zurück</button>"       //Funktioniert
        allFields += "<button onclick='addAnswer()' class='inline'>Neue Antwort hinzufügen</button>" //Funktioniert
        allFields += "<button onclick='append(0)' id='weiter' class='inline'>Weiter</button><br>"        //
        allFields += "<button onclick='append(0)'>Neue Frage erzeugen</button><br>"          //Funktioniert
        allFields += "<button onclick='end(1)' id='end'>Fragebogen beenden</button>"
        allFields += "</div>"
        cont.innerHTML = allFields
}

function append(n) {
    //Diese Zeile geht so nicht, denn wenn ich einen Fragebogen bearbeite kollidiert es
    jsonindex = newCount

    fr = document.getElementById("frage").value
    frt = document.getElementById('ftype').value
    q = {
        "text":fr,
        "antworten":[],
        "type": frt,
        "id": newCount
    }
    dict[newCount++] = fr
    antworten = document.getElementsByClassName('ant')
    nextref = document.getElementsByClassName('ne')
    feeds = document.getElementsByClassName('feed')
    for(i=0; i < antworten.length; i++) {
        s = {
            "wahl" : i,
            "text": antworten[i].value,
            "next": nextref[i].selectedIndex ,
            "feedback": feeds[i].value 
        }
        q.antworten.push(s)
    }
    jsondoc.push(q)
    createNodesAndEdges(jsondoc)
    
    if(n == 0) {
        createAlt(0)
    }else {
        if(jsonindex > 0) {
            jsonindex -= 2
        } else {
            alert("Das ist bereits die erste Frage!")
            jsonindex -= 1
        }
        next()
    }

}







/*
    Hier wird der sticky header definiert
*/
window.onscroll = function() {myFunction()};
var header = document.getElementById("myHeader");
var sticky = header.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}