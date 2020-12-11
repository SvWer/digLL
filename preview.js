function showPreview(t, o) {
    var div = document.getElementById("preview")
    var question = "<p> Die ist nur eine Vorschau für die aktuelle Frage. Die genaue Darstellung später kann von dieser abweichen. Diese Vorschau ist ohne Funktionalität der Buttons</p><br>"
    question += "<h1>" + o.text + "</h1><br>"
    if(t == 1) {
        //Checkbox Frage
        for(a = 0; a < o.antworten.length; a++) {
            question += "<input type='checkbox' class='prevCheck'>"
            question += "<label for='"+a+"' class='prevLabel'>"+o.antworten[a].text+"</label><br>"
        }
    } else if (t == 2) {
        //Dropdown Frage
        var question2 = "<select class='prevSelect'>"
        for(a = 0; a < o.antworten.length; a++) {
            question2 += "<option value='"+o.antworten[a].wahl+"'>"+o.antworten[a].wahl+":"+o.antworten[a].text+"</option>"
        }
        question2 += "</select>"
        question += question2 + "<br>"
        question += question2 + "<br>"
        question += question2
    } else {
        //Normale Frage
        for(a = 0; a < o.antworten.length; a++) {
            question += "<button class='prevButton'>"+ o.antworten[a].text + "</button><br>"
        }
    }
    div.innerHTML = question
}