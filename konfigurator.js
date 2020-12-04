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

/*
    Function that gets the text div, in which everything happens
*/
window.onload = function() {
    console.log("Seite geladen")
    cont = document.getElementById("text")
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
    newGraph()

    // console.log("Startseite")
    // s = "<p id='einleitung'>Herzlich willkommen beim digLL Konfigurator. Mit Hilfe dieses Konfigurators ist es möglich den Fragebogen zu Konfigurieren. Dazu kann entweder eine bestehende Vorlage bearbeitet werden oder es kann ein komplett neuer Fragebogen erstellt werden (Kommt erst später ;) )</p>"
    // s += "<p id='anweisung'>    Was möchten Sie tun?</p>"
    // s += "<button onclick='create()'>Einen Fragebogen erstellen</button>"
    // s += "<button onclick='modify()'>Einen Fragebogen bearbeiten</button>"
    // cont.innerHTML = s
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
    If you Insert the Json, this function creates a JSON-Object and a dictionary of all questions and calls function to load first question
*/
function applyJson () {
    console.log("Apply JSON")
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
    Loads next question and shows all important infromation of this question
    If all Questions have been loaded, JSON-String will be generated to copy
*/
function next() {
    jsonindex += 1
    if(jsonindex < jsondoc.length)
    {
        q = jsondoc[jsonindex]
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
        allFields += "<button onclick='addAnswer()'>Neue Antwort hinzufügen</button><br>"   //Funktioniert
        allFields += "<button onclick='save(1)' id='weiter'>Weiter</button><br>"            //Funktioniert
        allFields += "<button onclick='save(0)' id='zurueck'>Zurück</button><br>"           //Funktioniert
        allFields += "<button onclick='create(0)'>Neue Frage erzeugen</button><br>"          //Funktioniert nicht richtig
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
    console.log("Check if Changes and Save in Object")
    fr = document.getElementById("frage").value
    jsondoc[jsonindex]['text'] = fr
    frt = document.getElementById('ftype').value
    jsondoc[jsonindex]['type'] = frt

    antworten = document.getElementsByClassName('ant')
    nextref = document.getElementsByClassName('ne')
    feeds = document.getElementsByClassName('feed')

    console.log("Antworten: "+ antworten.length)
    console.log("Next Refs: "+ nextref.length)
    console.log("deefbacks: "+ feeds.length)

    for(i=0; i < jsondoc[jsonindex]['antworten'].length; i++) {
        jsondoc[jsonindex]['antworten'][i]['text'] = antworten[i].value
        changeEdge(jsonindex, jsondoc[jsonindex]['antworten'][i]['next'], nextref[i].selectedIndex, jsondoc[jsonindex]['antworten'][i]['wahl'])
        jsondoc[jsonindex]['antworten'][i]['next'] = nextref[i].selectedIndex
        jsondoc[jsonindex]['antworten'][i]['feedback'] = feeds[i].value     
    }
    lengthAntworten = jsondoc[jsonindex]['antworten'].length
    newAnswer = antworten.length - lengthAntworten
    console.log(newAnswer)
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
    next()
    
}

function deleteAnswer(choice, but) {
    if (choice == -1) {
        console.log(but)
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
        newGraph()
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
        newGraph()
        createNodesAndEdges(jsondoc)
        jsonindex -= 1
        next()
    }
    //Was ist mit den Referenzen??
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
    "text":"Geben Sie hier eine Ihrer Antwortmöglichkeiten ein",
    "next": 5,
    "feedback": "Hier können Sie Feedback an den Befragten eingeben, welches Angezeigt wird, wenn diese Antwort ausgewählt wurde."
    }

function create(alt) {
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
        allFields += "<button onclick='addAnswer()'>Neue Antwort hinzufügen</button><br>" //Funktioniert
        allFields += "<button onclick='append(0)' id='weiter'>Weiter</button><br>"        //
        allFields += "<button onclick='append(1)' id='zurueck'>Zurück</button><br>"       //Funktioniert
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
    console.log("newCount: ", newCount)
    dict[newCount++] = fr
    console.log(dict)
    //console.log(newCount)
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
    console.log(jsondoc)
    newGraph()
    createNodesAndEdges(jsondoc)
    
    console.log("n: ", n)
    if(n == 0) {
        create(0)
    }else {
        console.log("jsonindex: ", jsonindex)
        if(jsonindex > 0) {
            jsonindex -= 2
        } else {
            alert("Das ist bereits die erste Frage!")
            jsonindex -= 1
        }
        next()
    }

}

