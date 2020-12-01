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
    console.log("Startseite")
    s = "<p id='einleitung'>Herzlich willkommen beim digLL Konfigurator. Mit Hilfe dieses Konfigurators ist es möglich den Fragebogen zu Konfigurieren. Dazu kann entweder eine bestehende Vorlage bearbeitet werden oder es kann ein komplett neuer Fragebogen erstellt werden (Kommt erst später ;) )</p>"
    s += "<p id='anweisung'>    Was möchten Sie tun?</p>"
    s += "<button onclick='create()'>Einen Fragebogen erstellen</button>"
    s += "<button onclick='modify()'>Einen Fragebogen bearbeiten</button>"
    cont.innerHTML = s
}

/*
    If you clicked modify on the first page, this function changes the content, so you can paste the json
*/
function modify() {
    var getJsonArea = "<p> Bitte geben Sie den JSON-Text des Fragebogens ein</p> "
    getJsonArea += "<textarea id='jsontext' name='jsontext'></textarea> "
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
    createNodesAndEdges(jsondoc)
    next()
}

/*
    if you want to add a new answer, this function adds the empty fields
*/
function addAnswer( ) {
    feld = document.getElementById('answers')
    feld.innerHTML += "Antwort        <textarea id='antwort"+"' name='antwort"+"' class='ant'></textarea>"
    feld.innerHTML += "Nächste Frage:  "+dropdown(0) + "<br>"
    feld.innerHTML += "Feedback:      <textarea id='feedq"+"' name='feedq"+"' class='feed'></textarea><br>"
    newAnswer += 1
}

/*
    creates string for dropdown-menu over all possible questions
*/
function dropdown(next) {
    var select = "<select name='nextequestion' id='nextquestion' class='ne'>"
    for(var key in dict) {
        if (key == next) {
            select += "<option selected='selected' value='"+key+"'>"+key+":"+dict[key]+"</option>"
        } else {
            select += "<option value='"+key+"'>"+key+":"+dict[key]+"</option>"
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
    Loads next question and show all important infromation of this question
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
        allFields += "<hr>"
        allFields += "<h3>Antworten: </h3><br>"
        allFields += "<div id='answers'>"
        for(i=0; i < q['antworten'].length; i++) {
            allFields += "Antwort:       <textarea id='antwort"+i+"' name='antwort"+i+"' class='ant'>"+ q['antworten'][i]['text'] +"</textarea><br>"
            //allFields += "Nächste Frage: <textarea id='nextq"+i+"' name='nextq"+i+"' class='ne'>" +  q['antworten'][i]['next'] + "</textarea><br>"
            allFields += "Nächste Frage:  "+dropdown(q['antworten'][i]['next']) + "<br>"
            allFields += "Feedback:      <textarea id='feedq"+i+"' name='feedq"+i+"' class='feed'>" +  q['antworten'][i]['feedback'] + "</textarea><br>"
            allFields += "<hr>"
        }
        allFields += "</div>"
        allFields += "<button onclick='addAnswer()'>Neue Antwort hinzufügen</button><br>"
        allFields += "<button onclick='save(1)' id='weiter'>Weiter</button><br>"
        allFields += "<button onclick='save(0)' id='zurueck'>Zurück</button><br>"
        cont.innerHTML = allFields
    } else {
        var allFields = "Alle Fragen fertig beantwortet. Vollständiges Json siehe unten:<br>"
        allFields += "<textarea id='output' name='output'>"+ JSON.stringify(jsondoc) +"</textarea><br>"
        allFields += "<button onclick='starten()'>Zurück zum Anfang</button>"
        cont.innerHTML = allFields
    }
}

/*
    If you changed something, this funktion saves all fields for this question
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

    for(i=0; i < jsondoc[jsonindex]['antworten'].length; i++) {
        jsondoc[jsonindex]['antworten'][i]['text'] = antworten[i].value
        changeEdge(jsonindex, jsondoc[jsonindex]['antworten'][i]['next'], nextref[i].selectedIndex, jsondoc[jsonindex]['antworten'][i]['wahl'])
        jsondoc[jsonindex]['antworten'][i]['next'] = nextref[i].selectedIndex
        jsondoc[jsonindex]['antworten'][i]['feedback'] = feeds[i].value     
    }
    if(newAnswer > 0) {
        lengthAntworten = jsondoc[jsonindex]['antworten'].length
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
    }
    if(k ==0) {
        jsonindex -= 2
    }
    next()
}







/*
    Function that starts the process to create a new questionnaire
*/
newCount = 0
sampleQ = {
    "text":"Geben Sie hier Ihre Frage ein",
    "antworten":[],
    "id": 0
}
sampleA = {
    "wahl": 0,
    "text":"Geben Sie hier eine Ihrer Antwortmöglichkeiten ein",
    "next": 5,
    "feedback": "Hier können Sie Feedback an den Befragten eingeben, welches Angezeigt wird, wenn diese Antwort ausgewählt wurde."
    }
    dict[sampleQ['id']] = sampleQ['text']
function create() {
    var allFields = "<h3>Frage: " + newCount+ "</h3>"
        allFields += "<textarea id='frage' name='frage'>"+sampleQ.text +"</textarea><br>"
        allFields += "Fragentyp: " + createType(0) + "<br>"
        allFields += "<hr>"
        allFields += "<h3>Antworten: </h3><br>"
        allFields += "<div id='answers'>"
        allFields += "Antwort:       <textarea id='antwort"+0+"' name='antwort"+0+"' class='ant'>"+sampleA.text +"</textarea><br>"
        allFields += "Nächste Frage:  "+dropdown(0) + "<br>"
        allFields += "Feedback:      <textarea id='feedq"+0+"' name='feedq"+0+"' class='feed'>"+sampleA.feedback  + "</textarea><br>"
        allFields += "<hr>"
        
        allFields += "</div>"
        allFields += "<button onclick='addAnswer()'>Neue Antwort hinzufügen</button><br>" //Funktioniert
        allFields += "<button onclick='append()' id='weiter'>Weiter</button><br>"         //
        allFields += "<button onclick='save(0)' id='zurueck'>Zurück</button><br>"         //
        cont.innerHTML = allFields
}

function append() {
    fr = document.getElementById("frage").value
    frt = document.getElementById('ftype').value
    q = {
        "text":fr,
        "antworten":[],
        "type": frt,
        "id": 0
    }
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
    create()
}

