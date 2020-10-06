function initialize(){

    
    printListOfCards();

}

function printListOfCards(){
    for (var i = 0; i < localStorage.length; i++){
        (function(){
        parsedFlashcard = JSON.parse(window.localStorage.getItem(localStorage.key(i)));
        var div = document.getElementById("div1");
        var paragraph = document.createElement("p");
        var node = document.createTextNode("Id:" + parsedFlashcard.id + "---------Title:" + parsedFlashcard.title);
        div.appendChild(paragraph);
        paragraph.appendChild(node);
        var button = document.createElement("button");
        button.setAttribute("id", parsedFlashcard.id);
        button.innerHTML = "delete";
        div.appendChild(button);
        document.getElementById(button.id).addEventListener("click", function() {deleteFC(button.id);}, true);
        }());
    }
}


function deleteFC(id){
    Flashcard.deleteFCFromStorage(id);
    location.reload();
}

if(window.addEventListener){
    window.addEventListener("load", initialize, false)
}
else if(window.attachEvent){
    window.attachEvent("onload", initialize)
}
