var cont
var jsondoc         // Array, welches dann alle Fragen enthält 
var jsonindex = -1  // Index dafür, bei welcher Frage man gerade ist
var newAnswer = 0   //Enthält für jede Frage die Anzahl an neuen Antworten


window.onload = function() {
    console.log("Seite geladen")
    cont = document.getElementById("text")
    console.log(cont)
}

function starten() {
    console.log("Startseite")
    s = "<p id='einleitung'>Herzlich willkommen beim digLL Konfigurator. Mit Hilfe dieses Konfigurators ist es möglich den Fragebogen zu Konfigurieren. Dazu kann entweder eine bestehende Vorlage bearbeitet werden oder es kann ein komplett neuer Fragebogen erstellt werden (Kommt erst später ;) )</p>"
    s += "<p id='anweisung'>    Was möchten Sie tun?</p>"
    s += "<button onclick='create()'>Einen Fragebogen erstellen</button>"
    s += "<button onclick='modify()'>Einen Fragebogen bearbeiten</button>"
    cont.innerHTML = s
}

function modify() {
    var getJsonArea = "<p> Bitte geben Sie den JSON-Text des Fragebogens ein</p> "
    getJsonArea += "<textarea id='jsontext' name='jsontext'></textarea> "
    getJsonArea += "<button onclick='applyJson()'>Fragebogen bestätigen</button>"
    cont.innerHTML = getJsonArea
}

function applyJson () {
    console.log("Apply JSON")
    ta = document.getElementById("jsontext").value 
    //console.log(ta)
    jsondoc = JSON.parse(ta)
    console.log(jsondoc)
    next()
}

function addAnswer() {
    feld = document.getElementById('answers')
    feld.innerHTML += "<textarea id='antwort"+i+"' name='antwort"+i+"' class='ant'></textarea>"
    feld.innerHTML += "Nächste Frage: <textarea id='nextq"+i+"' name='nextq"+i+"' class='ne'></textarea><br>"
    newAnswer += 1
}

function next() {
    jsonindex += 1
    if(jsonindex < jsondoc.length)
    {
        q = jsondoc[jsonindex]
        console.log(q)
        var allFields = "<h3>Frage: </h3><br>"
        allFields += "<textarea id='frage' name='frage'>"+ q['text'] +"</textarea><br>"
        allFields += "<h3>Antworten: </h3><br>"
        allFields += "<div id='answers'>"
        for(i=0; i < q['antworten'].length; i++) {
            allFields += "<textarea id='antwort"+i+"' name='antwort"+i+"' class='ant'>"+ q['antworten'][i]['text'] +"</textarea>"
            allFields += "Nächste Frage: <textarea id='nextq"+i+"' name='nextq"+i+"' class='ne'>" +  q['antworten'][i]['next'] + "</textarea><br>"
        }
        allFields += "</div>"
        allFields += "<button onclick='addAnswer()'>Neue Antwort hinzufügen</button><br>"
        allFields += "<button onclick='save()'>Speichern und Weiter</button><br>"
        allFields += "<button onclick='next()'>Weiter</button><br>"
        cont.innerHTML = allFields
    } else {
        var allFields = "Alle Fragen fertig beantwortet. Vollständiges Json siehe unten:"
        allFields += "<textarea id='output' name='output'>"+ JSON.stringify(jsondoc) +"</textarea><br>"
        allFields += "<button onclick='starten()'>Zurück zum Anfang</button>"
        cont.innerHTML = allFields
    }
}

function save() {
    console.log("Check if Changes and Save in Object")
    fr = document.getElementById("frage").value
    jsondoc[jsonindex]['text'] = fr

    antworten = document.getElementsByClassName('ant')
    nextref = document.getElementsByClassName('ne')
    console.log(antworten)
    console.log(nextref)
    for(i=0; i < jsondoc[jsonindex]['antworten'].length; i++) {
        jsondoc[jsonindex]['antworten'][i]['text'] = antworten[i].value
        jsondoc[jsonindex]['antworten'][i]['next'] = nextref[i].value
    }
    console.log("New Answer: "+ newAnswer)
    if(newAnswer > 0) {
        lengthAntworten = jsondoc[jsonindex]['antworten'].length
        console.log(lengthAntworten)
        for(i=0; i < newAnswer; i++) {
            s = {
                "wahl" : lengthAntworten+i+1,
                "text": "'"+antworten[lengthAntworten+i].value +"'",
                "next":"'"+nextref[lengthAntworten+i].value +"'",
                "feedback":"Feedback 3"
            }
            console.log(s)
            jsondoc[jsonindex]['antworten'].push(s)
            console.log(jsondoc[jsonindex])
        }
    }

    next()
}


function create() {
    console.log("Gibt es noch nicht..");
}

